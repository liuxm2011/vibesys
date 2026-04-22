import { DocType, Domain } from '@prisma/client';
import crypto from 'crypto';
import { getPRDPromptTemplate } from '../prompts/prd.template.js';
import { getFrontendPromptTemplate } from '../prompts/frontend.template.js';
import { getBackendPromptTemplate } from '../prompts/backend.template.js';
import { getAPIPromptTemplate } from '../prompts/api.template.js';
import { getTaskPromptTemplate } from '../prompts/task.template.js';
import { getContextStatePromptTemplate } from '../prompts/context_state.template.js';
import {
  getReviewSystemPrompt,
  buildReviewUserPrompt,
  getPatchHintRecoverySystemPrompt,
  buildPatchHintRecoveryUserPrompt
} from '../prompts/review.template.js';
import { getAgentsPromptTemplate } from '../prompts/agents.template.js';

/**
 * AI Service for document generation
 * D-01: Uses school's self-deployed MiniMax API via OpenAI SDK
 * D-02: Independent service module for future extensibility
 */

interface TopicInfo {
  title: string;
  description: string;
  domain: Domain;
  objectives: string;
  techStack: string[];
  // 新增：前置文档内容，用于上下文传递
  previousDocs?: Record<string, string>; // { 'PRD': content, 'BACKEND': content, ... }
}

interface ChatCompletionResponse {
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: string;
    };
  }>;
}

interface StreamChunkChoice {
  finish_reason?: string | null;
  delta?: {
    content?: string;
    reasoning_content?: string;
    reasoning_details?: Array<{
      text?: string;
    }>;
  };
}

interface StreamChunkResponse {
  choices?: StreamChunkChoice[];
}

export interface GenerationProgress {
  phase: 'reasoning' | 'writing' | 'finalizing';
  reasoningText: string;
  contentText: string;
  tokenCount?: number;
  tokensPerSecond?: number;
  elapsedSeconds?: number;
}

interface GenerationOptions {
  bypassCache?: boolean;
}

interface PendingRequest {
  promise: Promise<string>;
  timestamp: number;
}

export interface ReviewIssue {
  id: number;
  severity: 'critical' | 'warning' | 'suggestion';
  category: 'prd_vs_frontend' | 'prd_vs_backend' | 'backend_vs_api' | 'frontend_vs_api' | 'overall';
  title: string;
  description: string;
  affectedDocTypes: DocType[];
  suggestion: string;
  patchHints: ReviewPatchHint[];
}

export interface ReviewResult {
  issues: ReviewIssue[];
  summary: string;
}

export interface ReviewPatchHint {
  docType: DocType;
  changeType: 'replace_section' | 'replace_range';
  targetHeadingPath: string[];
  anchorBefore?: string;
  anchorAfter?: string;
  replacementContent: string;
}

export interface ReviewUnresolvedFix {
  docType: DocType;
  issueId: number;
  reason: string;
  fallbackNote: string;
  targetHeadingPath?: string[];
  anchorBefore?: string;
  anchorAfter?: string;
}

export interface ReviewFixResult {
  documents: Map<string, string>;
  unresolved: ReviewUnresolvedFix[];
}

interface CachedResult {
  content: string;
  timestamp: number;
}

interface SectionRange {
  startIndex: number;
  endIndex: number;
  headingLine: string;
}

export class AIService {
  private readonly AGENTS_AUDIT_REWRITE_PRIORITY_SECTION = `## 最高优先规则

1. 在开始任何编码、拆任务、写实现或调用外部 AI 工具之前，必须先审核全部 7 份项目文档：PRD.md、Frontend.md、Backend.md、API.md、task.md、context_state.md、AGENTS.md。
2. 只要任意文档中存在“审核修订记录”或“审核修订”内容，必须先依据这些修订记录重新编排、整合并规划相关文档内容，确保文档结构、术语、接口、任务顺序和执行约束已经吸收修订结果。
3. 完成上述整理前，不得直接进入编码阶段，也不得忽略修订记录继续实现。
4. 当用户在 AI 编程工具中输入“了解项目规则，查看 AGENTS.md 文档”时，必须立即先执行本规则，再开始后续编码引导。`;

  private readonly AGENTS_CLAUDE_GUIDELINES_SECTION = `## CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

Minimum code that solves the problem. Nothing speculative.

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.
- Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

Touch only what you must. Clean up only your own mess.

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

- "Add validation" -> "Write tests for invalid inputs, then make them pass"
- "Fix the bug" -> "Write a test that reproduces it, then make it pass"
- "Refactor X" -> "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

1. [Step] -> verify: [check]
2. [Step] -> verify: [check]
3. [Step] -> verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

These guidelines are working if: fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.`;

  // Request deduplication map: cacheKey -> pending promise
  private pendingRequests = new Map<string, PendingRequest>();

  // Result cache: cacheKey -> { content, timestamp }
  private resultCache = new Map<string, CachedResult>();

  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly REQUEST_TIMEOUT = 120_000; // 120 seconds (2 minutes) timeout
  private readonly REVIEW_TIMEOUT = 360_000; // 360 seconds (6 minutes) timeout for expert panel review

  /**
   * Generate cache key from docType and topic info
   */
  private generateCacheKey(docType: DocType, topicInfo: TopicInfo): string {
    const payload = {
      docType,
      title: topicInfo.title,
      description: topicInfo.description,
      domain: topicInfo.domain,
      objectives: topicInfo.objectives,
      techStack: [...topicInfo.techStack].sort(),
      previousDocs: Object.entries(topicInfo.previousDocs || {})
        .sort(([left], [right]) => left.localeCompare(right))
    };

    return crypto
      .createHash('md5')
      .update(JSON.stringify(payload))
      .digest('hex');
  }

  private getConfig() {
    if (!process.env.MINIMAX_API_KEY) {
      throw new Error('MINIMAX_API_KEY not configured');
    }

    return {
      baseURL: process.env.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1',
      apiKey: process.env.MINIMAX_API_KEY,
      model: process.env.MINIMAX_MODEL || 'minimax-m2-7',
      mockMode: process.env.MOCK_AI === 'true' || process.env.MOCK_AI === '1',
    };
  }

  /**
   * Generate document content via MiniMax API
   * DOC-04: AI content generation
   * D-08/09: Domain-specific templates
   */
  async generateDocument(
    docType: DocType,
    topicInfo: TopicInfo,
    options: GenerationOptions = {}
  ): Promise<string> {
    const config = this.getConfig();

    // Mock mode for development/testing when API is unavailable
    if (config.mockMode) {
      console.log('[AI Mock] Generating mock document for', docType);
      return this.postProcessGeneratedContent(docType, this.generateMockDocument(docType, topicInfo));
    }

    const cacheKey = this.generateCacheKey(docType, topicInfo);
    const bypassCache = options.bypassCache === true;

    if (!bypassCache) {
      // 1. Check result cache
      const cached = this.resultCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        console.log('[AI Cache] Hit for', cacheKey);
        return this.postProcessGeneratedContent(docType, cached.content);
      }

      // 2. Check pending request (deduplication)
      const pending = this.pendingRequests.get(cacheKey);
      if (pending && Date.now() - pending.timestamp < 60_000) {
        console.log('[AI Dedup] Reusing pending request for', cacheKey);
        return pending.promise;
      }
    }

    // 3. Execute new request
    const systemPrompt = this.getSystemPrompt(docType, topicInfo.domain);
    const userPrompt = this.buildUserPrompt(docType, topicInfo);
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const requestPromise = this.executeWithRetry(messages)
      .then(content => this.postProcessGeneratedContent(docType, content));

    // Record pending request
    this.pendingRequests.set(cacheKey, {
      promise: requestPromise,
      timestamp: Date.now()
    });

    try {
      const content = await requestPromise;

      // Cache result
      this.resultCache.set(cacheKey, {
        content,
        timestamp: Date.now()
      });

      return content;
    } finally {
      // Clean up pending marker
      this.pendingRequests.delete(cacheKey);
    }
  }

  async generateDocumentStream(
    docType: DocType,
    topicInfo: TopicInfo,
    onProgress: (progress: GenerationProgress) => void,
    options: GenerationOptions = {}
  ): Promise<string> {
    const config = this.getConfig();

    if (config.mockMode) {
      const content = await this.streamMockDocument(docType, topicInfo, onProgress);
      const finalized = this.postProcessGeneratedContent(docType, content);
      if (finalized !== content) {
        onProgress({
          phase: 'finalizing',
          reasoningText: this.buildPreviewReasoningText('finalizing'),
          contentText: finalized
        });
      }
      return finalized;
    }

    const cacheKey = this.generateCacheKey(docType, topicInfo);
    const bypassCache = options.bypassCache === true;

    if (!bypassCache) {
      const cached = this.resultCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        const finalizedCached = this.postProcessGeneratedContent(docType, cached.content);
        onProgress({
          phase: 'finalizing',
          reasoningText: this.buildPreviewReasoningText('finalizing'),
          contentText: finalizedCached
        });
        return finalizedCached;
      }
    }

    const systemPrompt = this.getSystemPrompt(docType, topicInfo.domain);
    const userPrompt = this.buildUserPrompt(docType, topicInfo);
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const content = await this.executeStreamWithRetry(messages, onProgress);
    const finalized = this.postProcessGeneratedContent(docType, content);

    if (finalized !== content) {
      onProgress({
        phase: 'finalizing',
        reasoningText: this.buildPreviewReasoningText('finalizing'),
        contentText: finalized
      });
    }

    this.resultCache.set(cacheKey, {
      content: finalized,
      timestamp: Date.now()
    });

    return finalized;
  }

  /**
   * Execute AI request with retry logic
   */
  private async executeWithRetry(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    const { baseURL, apiKey, model } = this.getConfig();
    const contentParts: string[] = [];
    const maxAttempts = 3; // Reduced from 5 to 3

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        const data = await this.requestCompletion(baseURL, apiKey, model, messages);
        const choice = data.choices?.[0];
        const content = choice?.message?.content?.trim() || '';

        if (!content) {
          break;
        }

        contentParts.push(content);

        if (choice?.finish_reason !== 'length') {
          break;
        }

        messages.push({ role: 'assistant', content });
        messages.push({
          role: 'user',
          content: '文档尚未写完。请继续从下一个未完成的章节开始续写，保持 Markdown 格式一致。\n每个章节保持适当的详细程度，直接输出 Markdown 内容，不要添加任何说明。'
        });
      } catch (error) {
        if (attempt === maxAttempts - 1) throw error;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    return this.cleanGeneratedContent(contentParts.join('\n'));
  }

  private async executeStreamWithRetry(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    onProgress: (progress: GenerationProgress) => void
  ): Promise<string> {
    const { baseURL, apiKey, model } = this.getConfig();
    const maxAttempts = 3;
    const contentParts: string[] = [];

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        const result = await this.requestStreamingCompletion(baseURL, apiKey, model, messages, onProgress);

        const cleanedContent = result.contentText.trim();
        if (!cleanedContent) {
          break;
        }

        contentParts.push(cleanedContent);

        if (result.finishReason !== 'length') {
          break;
        }

        messages.push({ role: 'assistant', content: cleanedContent });
        messages.push({
          role: 'user',
          content: '文档尚未写完。请继续从下一个未完成的章节开始续写，保持 Markdown 格式一致。\n每个章节保持适当的详细程度，直接输出 Markdown 内容，不要添加任何说明。'
        });
      } catch (error) {
        if (attempt === maxAttempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    const finalContent = this.cleanGeneratedContent(contentParts.join('\n'));
    onProgress({
      phase: 'finalizing',
      reasoningText: this.buildPreviewReasoningText('finalizing'),
      contentText: finalContent,
      tokenCount: contentParts.reduce((acc, part) => acc + part.split(/\s+/).length, 0),
      elapsedSeconds: 0,
    });
    return finalContent;
  }

  /**
   * Get system prompt based on docType and domain
   * D-08/09: Domain differentiation
   */
  private getSystemPrompt(docType: DocType, domain: Domain): string {
    switch (docType) {
      case 'PRD':
        return this.getPRDSystemPrompt(domain);
      case 'FRONTEND':
        return this.getFrontendSystemPrompt(domain);
      case 'BACKEND':
        return this.getBackendSystemPrompt(domain);
      case 'API':
        return this.getAPISystemPrompt(domain);
      case 'TASK':
        return this.getTaskSystemPrompt(domain);
      case 'CONTEXT_STATE':
        return this.getContextStateSystemPrompt(domain);
      case 'AGENTS':
        return this.getAgentsSystemPrompt(domain);
      default:
        return '请生成结构化的技术文档。';
    }
  }

  /**
   * Build user prompt with topic info and previous document context
   */
  private buildUserPrompt(docType: DocType, topicInfo: TopicInfo): string {
    const baseInfo = `
**选题标题**: ${topicInfo.title}
**选题描述**: ${topicInfo.description}
**领域**: ${topicInfo.domain === 'SE' ? '软件工程' : '大数据'}
**项目目标**: ${topicInfo.objectives}
**推荐技术栈**: ${topicInfo.techStack.join(', ')}
`;

    let contextSection = '';
    if (topicInfo.previousDocs && Object.keys(topicInfo.previousDocs).length > 0) {
      contextSection = '\n### 参考文档（前置文档内容）\n\n';
      for (const [dType, content] of Object.entries(topicInfo.previousDocs)) {
        const truncated = content.length > 3000
          ? content.substring(0, 3000) + '\n...(内容过长已截断)'
          : content;
        contextSection += `#### ${dType} 文档\n\n${truncated}\n\n`;
      }
    }

    const docTypeLabels: Record<DocType, string> = {
      PRD: '产品需求文档',
      FRONTEND: '前端技术文档',
      BACKEND: '后端技术文档',
      API: 'API 接口契约文档',
      TASK: '开发任务清单',
      CONTEXT_STATE: '项目状态追踪文档',
      AGENTS: 'AI 编码规则文档'
    };

    return `
请根据以下选题信息生成${docTypeLabels[docType]}，直接输出最终 Markdown 文档，不要输出分析过程、思考说明、前言或多余内容。
${baseInfo}${contextSection}
文档必须一次性尽可能完整输出；如果内容较长，也必须优先保证结构完整、章节完整、结尾完整。
`;
  }

  private async requestCompletion(
    baseURL: string,
    apiKey: string,
    model: string,
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 16384,
      }),
      signal: AbortSignal.timeout(this.REQUEST_TIMEOUT), // 120 seconds timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MiniMax API request failed: ${response.status} ${errorText}`);
    }

    return response.json() as Promise<ChatCompletionResponse>;
  }

  private async requestStreamingCompletion(
    baseURL: string,
    apiKey: string,
    model: string,
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    onProgress: (progress: GenerationProgress) => void
  ): Promise<{ reasoningText: string; contentText: string; finishReason: string | null; tokenCount: number }> {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 16384,
        stream: true,
        reasoning_split: true
      }),
      signal: AbortSignal.timeout(this.REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MiniMax API request failed: ${response.status} ${errorText}`);
    }

    if (!response.body) {
      throw new Error('MiniMax API stream is unavailable');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let reasoningText = '';
    let contentText = '';
    let finishReason: string | null = null;
    let lastEmitAt = 0;
    let tokenCount = 0;
    const startTime = Date.now();

    const extractNextEventBlock = (): string | null => {
      const match = buffer.match(/\r?\n\r?\n/);
      if (!match || match.index === undefined) {
        return null;
      }

      const block = buffer.slice(0, match.index).trim();
      buffer = buffer.slice(match.index + match[0].length);
      return block;
    };

    const emitProgress = (force = false): void => {
      const now = Date.now();
      if (!force && now - lastEmitAt < 120) {
        return;
      }

      const previewContentText = this.extractPreviewContent(contentText);
      const phase: GenerationProgress['phase'] = previewContentText
        ? 'writing'
        : reasoningText || contentText
          ? 'reasoning'
          : 'reasoning';

      const elapsedSeconds = Math.floor((now - startTime) / 1000);
      const tokensPerSecond = elapsedSeconds > 0 ? tokenCount / elapsedSeconds : 0;

      onProgress({
        phase,
        reasoningText: this.buildPreviewReasoningText(phase),
        contentText: previewContentText,
        tokenCount,
        tokensPerSecond,
        elapsedSeconds,
      });
      lastEmitAt = now;
    };

    const processEventBlock = (block: string): void => {
      const dataLines = block
        .split(/\r?\n/)
        .filter(line => line.startsWith('data:'))
        .map(line => line.slice(5).trim());

      if (dataLines.length === 0) {
        return;
      }

      const payload = dataLines.join('\n');
      if (payload === '[DONE]') {
        return;
      }

      const chunk = JSON.parse(payload) as StreamChunkResponse;
      const choice = chunk.choices?.[0];
      const delta = choice?.delta;

      if (!delta) {
        return;
      }

      const reasoningIncoming = this.extractReasoningText(delta);
      const reasoningDelta = this.getNovelSuffix(reasoningText, reasoningIncoming);
      if (reasoningDelta) {
        reasoningText += reasoningDelta;
      }

      const contentIncoming = delta.content || '';
      const contentDelta = this.getNovelSuffix(contentText, contentIncoming);
      if (contentDelta) {
        contentText += contentDelta;
        tokenCount += 1;
      }

      if (choice?.finish_reason) {
        finishReason = choice.finish_reason;
      }

      if (reasoningDelta || contentDelta) {
        emitProgress();
      }
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      let block = extractNextEventBlock();

      while (block !== null) {
        if (block) {
          processEventBlock(block);
        }

        block = extractNextEventBlock();
      }
    }

    if (buffer.trim()) {
      processEventBlock(buffer.trim());
    }

    emitProgress(true);

    return {
      reasoningText,
      contentText,
      finishReason,
      tokenCount,
    };
  }

  private extractReasoningText(delta: StreamChunkChoice['delta']): string {
    const reasoningDetails = delta?.reasoning_details
      ?.map(detail => detail.text || '')
      .join('') || '';

    return delta?.reasoning_content || reasoningDetails;
  }

  private getNovelSuffix(existing: string, incoming: string): string {
    if (!incoming) {
      return '';
    }

    if (!existing) {
      return incoming;
    }

    if (incoming.startsWith(existing)) {
      return incoming.slice(existing.length);
    }

    return incoming;
  }

  private cleanGeneratedContent(content: string): string {
    const trimmed = content.trim();
    const firstHeadingIndex = trimmed.search(/^#\s+/m);

    if (firstHeadingIndex > 0) {
      return trimmed.slice(firstHeadingIndex).trim();
    }

    return trimmed;
  }

  private postProcessGeneratedContent(docType: DocType, content: string): string {
    const cleaned = this.cleanGeneratedContent(content);

    if (docType !== 'AGENTS') {
      return cleaned;
    }

    return this.mergeAgentsRequiredSections(cleaned);
  }

  private mergeAgentsRequiredSections(content: string): string {
    if (!content) {
      return content;
    }

    let nextContent = this.mergeAgentsPriorityRule(content);
    nextContent = this.mergeAgentsClaudeGuidelines(nextContent);
    return nextContent;
  }

  private mergeAgentsPriorityRule(content: string): string {
    if (/^##\s+最高优先规则\b/m.test(content) || /审核修订记录/.test(content) && /了解项目规则，查看 AGENTS\.md 文档/.test(content)) {
      return content;
    }

    const firstHeadingMatch = content.match(/^#\s+.*$/m);
    if (!firstHeadingMatch || firstHeadingMatch.index === undefined) {
      return `${this.AGENTS_AUDIT_REWRITE_PRIORITY_SECTION}\n\n${content}`.trim();
    }

    const headingEnd = firstHeadingMatch.index + firstHeadingMatch[0].length;
    const before = content.slice(0, headingEnd).trimEnd();
    const after = content.slice(headingEnd).trimStart();
    return `${before}\n\n${this.AGENTS_AUDIT_REWRITE_PRIORITY_SECTION}\n\n${after}`.trim();
  }

  private mergeAgentsClaudeGuidelines(content: string): string {
    const priorityRuleIndex = content.indexOf(this.AGENTS_AUDIT_REWRITE_PRIORITY_SECTION);

    if (/^##\s+CLAUDE\.md\b/m.test(content) || /Behavioral guidelines to reduce common LLM coding mistakes\./.test(content)) {
      return content;
    }

    const anchors = [
      /^##\s+ContextState 更新规则\b/m,
      /^##\s+文档引用\b/m,
      /^##\s+执行流程\b/m
    ];

    for (const anchor of anchors) {
      const match = anchor.exec(content);
      if (!match || match.index === undefined) {
        continue;
      }

      const before = content.slice(0, match.index).trimEnd();
      const after = content.slice(match.index).trimStart();
      return `${before}\n\n${this.AGENTS_CLAUDE_GUIDELINES_SECTION}\n\n${after}`.trim();
    }

    if (priorityRuleIndex >= 0) {
      const afterPriority = content.slice(priorityRuleIndex + this.AGENTS_AUDIT_REWRITE_PRIORITY_SECTION.length).trimStart();
      const beforePriority = content.slice(0, priorityRuleIndex + this.AGENTS_AUDIT_REWRITE_PRIORITY_SECTION.length).trimEnd();
      return `${beforePriority}\n\n${this.AGENTS_CLAUDE_GUIDELINES_SECTION}\n\n${afterPriority}`.trim();
    }

    return `${content.trimEnd()}\n\n${this.AGENTS_CLAUDE_GUIDELINES_SECTION}\n`.trim();
  }

  private extractPreviewContent(content: string): string {
    const cleaned = this.cleanGeneratedContent(content);
    const firstHeadingIndex = cleaned.search(/^#\s+/m);

    if (firstHeadingIndex === -1) {
      return '';
    }

    return cleaned.slice(firstHeadingIndex).trim();
  }

  private buildPreviewReasoningText(phase: GenerationProgress['phase']): string {
    if (phase === 'reasoning') {
      return [
        '正在分析前置文档依赖与约束条件。',
        '正在组织章节结构与输出顺序。'
      ].join('\n');
    }

    if (phase === 'writing') {
      return [
        '正在输出正式文档内容。',
        '正在补全当前章节细节并校正文档格式。'
      ].join('\n');
    }

    return [
      '正在整理最终文档结构。',
      '正在执行一致性检查并准备写入项目空间。'
    ].join('\n');
  }

  /**
   * Generate mock document for development/testing
   */
  private generateMockDocument(docType: DocType, topicInfo: TopicInfo): string {
    const domainLabel = topicInfo.domain === 'SE' ? '软件工程' : '大数据';
    const timestamp = new Date().toLocaleString('zh-CN');

    if (docType === 'PRD') {
      return `# ${topicInfo.title} - 产品需求文档(PRD)

## 项目概述

**领域**: ${domainLabel}
**生成时间**: ${timestamp}
**项目描述**: ${topicInfo.description}
**项目目标**: ${topicInfo.objectives}

## 功能需求

### 核心功能模块

1. **用户管理模块**
   - 用户注册与登录
   - 个人信息管理
   - 权限控制

2. **业务核心模块**
   - 主要业务流程
   - 数据管理与展示
   - 统计分析功能

3. **系统管理模块**
   - 系统配置
   - 日志管理
   - 数据备份

## 技术建议

**推荐技术栈**: ${topicInfo.techStack.join(', ')}

- 前端采用现代化框架，确保良好的用户体验
- 后端采用微服务架构，保证系统可扩展性
- 数据库设计遵循第三范式，确保数据一致性

## 验收标准

- 功能完整性：所有核心功能均已实现
- 性能要求：页面加载时间 < 2秒
- 安全要求：通过基本的安全测试
- 兼容性：支持主流浏览器

---

*注：此为Mock模式生成的示例文档。配置有效的API密钥后将生成真实的AI文档。*
`;
    } else if (docType === 'FRONTEND') {
      return `# ${topicInfo.title} - 前端技术文档

## 项目概述

**领域**: ${domainLabel}
**生成时间**: ${timestamp}

## 技术栈

${topicInfo.techStack.map(tech => `- ${tech}`).join('\n')}

## 项目结构

\`\`\`
src/
├── components/     # 可复用组件
├── views/          # 页面视图
├── stores/         # 状态管理
├── api/            # API调用
├── router/         # 路由配置
└── utils/          # 工具函数
\`\`\`

## 核心组件设计

### 1. 布局组件
- Header: 顶部导航栏
- Sidebar: 侧边栏菜单
- Main: 主内容区域

### 2. 业务组件
- 根据具体业务需求设计
- 遵循单一职责原则

## 状态管理

使用 Pinia 进行全局状态管理，包括：
- 用户认证状态
- 业务数据缓存
- UI状态控制

---

*注：此为Mock模式生成的示例文档。*
`;
    } else if (docType === 'BACKEND') {
      return `# ${topicInfo.title} - 后端技术文档

## 项目概述

**领域**: ${domainLabel}
**生成时间**: ${timestamp}

## 技术栈

${topicInfo.techStack.map(tech => `- ${tech}`).join('\n')}

## API设计

### RESTful API规范

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/resource | 获取资源列表 |
| POST | /api/resource | 创建新资源 |
| PUT | /api/resource/:id | 更新资源 |
| DELETE | /api/resource/:id | 删除资源 |

## 数据库设计

### 核心表结构

- **users**: 用户信息表
- **projects**: 项目信息表
- **documents**: 文档记录表

## 安全设计

- JWT身份认证
- 请求速率限制
- 输入数据验证
- SQL注入防护

---

*注：此为Mock模式生成的示例文档。*
`;
    } else if (docType === 'API') {
      return `# ${topicInfo.title} - API 接口契约文档

## 项目概述
**领域**: ${domainLabel}
**生成时间**: ${timestamp}

## 认证机制
- JWT Bearer Token
- 请求头: Authorization: Bearer <token>

## 接口列表

### 用户认证
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/register | 用户注册 |
| GET | /api/auth/profile | 获取用户信息 |

### 业务接口
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/resources | 获取资源列表 |
| POST | /api/resources | 创建资源 |
| GET | /api/resources/:id | 获取单个资源 |
| PUT | /api/resources/:id | 更新资源 |
| DELETE | /api/resources/:id | 删除资源 |

## 错误码
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

---

*注：此为Mock模式生成的示例文档。*
`;
    } else if (docType === 'TASK') {
      return `# ${topicInfo.title} - 开发任务清单

## 第一阶段：基础设施 (P0)

### T-01: 项目初始化
**类型**: 后端 | **依赖**: 无 | **预估**: 小
- [ ] 初始化项目框架
- [ ] 配置数据库连接

### T-02: 数据库设计
**类型**: 数据库 | **依赖**: T-01 | **预估**: 中
- [ ] 设计核心表结构
- [ ] 创建迁移脚本

## 第二阶段：核心功能 (P0)

### T-03: 用户认证模块
**类型**: 后端 | **依赖**: T-02 | **预估**: 中
- [ ] 实现 JWT 认证
- [ ] 登录/注册接口

### T-04: 核心业务模块
**类型**: 全栈 | **依赖**: T-03 | **预估**: 大
- [ ] 后端 API 实现
- [ ] 前端页面开发

---

*注：此为Mock模式生成的示例文档。*
`;
    } else if (docType === 'CONTEXT_STATE') {
      return `# ${topicInfo.title} - 项目状态追踪

## 项目概述
**领域**: ${domainLabel}
**生成时间**: ${timestamp}

## 任务完成状态

| 任务编号 | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| T-01 | 项目初始化 | PENDING | - |
| T-02 | 数据库设计 | PENDING | - |
| T-03 | 用户认证模块 | PENDING | - |
| T-04 | 核心业务模块 | PENDING | - |

## 当前进度
- 已完成: 0/4
- 完成百分比: 0%
- 当前任务: 无

## 下一步行动
1. T-01: 项目初始化
2. T-02: 数据库设计
3. T-03: 用户认证模块

## 变更记录
- [${timestamp}] 初始化状态文档

---

*注：此为Mock模式生成的示例文档。每次完成任务后请更新此文件。*
`;
    } else if (docType === 'AGENTS') {
      return `# AGENTS.md — ${topicInfo.title}

## 项目概述
**领域**: ${domainLabel}
**项目描述**: ${topicInfo.description}
**项目目标**: ${topicInfo.objectives}

## 技术栈
${topicInfo.techStack.map(tech => `- ${tech}`).join('\n')}

## 开发规则
- 遵循 ESLint 代码规范
- 所有 API 接口需编写文档
- 核心功能需编写单元测试

## ContextState 更新规则
**重要：每次完成一个任务后，必须更新 context_state.md 文件：**
1. 将已完成任务状态更新为 COMPLETED
2. 记录完成时间
3. 更新下一步行动

## 文档引用
1. PRD.md — 产品需求文档
2. Frontend.md — 前端技术文档
3. Backend.md — 后端技术文档
4. API.md — API 接口契约文档
5. task.md — 开发任务清单
6. context_state.md — 项目状态追踪文档
7. AGENTS.md — 本文件

## 执行流程
1. 阅读 PRD.md 了解需求
2. 阅读技术文档了解方案
3. 阅读 task.md 了解任务
4. 按顺序执行任务
5. 每完成一个任务，立即更新 context_state.md

---

*注：此为Mock模式生成的示例文档。配置有效的API密钥后将生成真实的AI文档。*
`;
    }
    return '# 未知文档类型';
  }

  private async streamMockDocument(
    docType: DocType,
    topicInfo: TopicInfo,
    onProgress: (progress: GenerationProgress) => void
  ): Promise<string> {
    const content = this.generateMockDocument(docType, topicInfo);
    let streamedContent = '';
    let tokenCount = 0;
    const startTime = Date.now();

    const chunks = content.match(/.{1,80}/gs) || [content];
    for (const chunk of chunks) {
      streamedContent += chunk;
      tokenCount += chunk.split(/\s+/).length;
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const tokensPerSecond = elapsedSeconds > 0 ? tokenCount / elapsedSeconds : 0;
      onProgress({
        phase: 'writing',
        reasoningText: '',
        contentText: streamedContent,
        tokenCount,
        tokensPerSecond,
        elapsedSeconds,
      });
      await new Promise(resolve => setTimeout(resolve, 90));
    }

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const tokensPerSecond = elapsedSeconds > 0 ? tokenCount / elapsedSeconds : 0;
    onProgress({
      phase: 'finalizing',
      reasoningText: '',
      contentText: streamedContent,
      tokenCount,
      tokensPerSecond,
      elapsedSeconds,
    });

    return this.cleanGeneratedContent(streamedContent);
  }

  /**
   * D-05/D-08: PRD system prompt with SE/BD differentiation
   */
  private getPRDSystemPrompt(domain: Domain): string {
    return `你是一位专业的产品经理，负责产出可直接交付的中文 Markdown PRD。

${getPRDPromptTemplate(domain)}

输出约束：
- 只输出最终 Markdown 文档
- 不要输出思考过程、解释、备注、前言或后记
- 必须从文档标题开始，到最后一个章节完整结束
- 如果包含流程或结构图，优先使用 Markdown 列表或代码块，避免输出半截内容`;
  }

  /**
   * D-06/D-08: Frontend system prompt with SE/BD differentiation
   */
  private getFrontendSystemPrompt(domain: Domain): string {
    return `你是一位专业的前端架构师，负责产出可直接交付的中文 Markdown 前端技术文档。

${getFrontendPromptTemplate(domain)}

输出约束：
- 只输出最终 Markdown 文档
- 不要输出思考过程、解释、备注、前言或后记
- 必须把所有主要章节完整写完
- 优先给出完整结构，避免输出未闭合的代码块或未完成的 ASCII 图`;
  }

  /**
   * D-07/D-08: Backend system prompt with SE/BD differentiation
   */
  private getBackendSystemPrompt(domain: Domain): string {
    return `你是一位专业的后端架构师，负责产出可直接交付的中文 Markdown 后端技术文档。

${getBackendPromptTemplate(domain)}

输出约束：
- 只输出最终 Markdown 文档
- 不要输出思考过程、解释、备注、前言或后记
- 必须把所有主要章节完整写完
- 优先给出完整结构，避免输出未闭合的代码块或未完成的表格`;
  }

  /**
   * API 接口契约文档 system prompt
   */
  private getAPISystemPrompt(domain: Domain): string {
    return `你是一位专业的 API 架构师，负责产出可直接交付的中文 Markdown API 接口契约文档。

${getAPIPromptTemplate(domain)}

输出约束：
- 只输出最终 Markdown 文档
- 不要输出思考过程、解释、备注、前言或后记
- 接口必须使用 Markdown 表格或代码块详细描述
- 请求/响应示例必须使用 JSON 格式`;
  }

  /**
   * 开发任务清单 system prompt
   */
  private getTaskSystemPrompt(domain: Domain): string {
    return `你是一位专业的项目经理，负责产出可直接交付的中文 Markdown 开发任务清单。

${getTaskPromptTemplate(domain)}

输出约束：
- 只输出最终 Markdown 文档
- 不要输出思考过程、解释、备注、前言或后记
- 任务编号使用 T-01, T-02 格式
- 每个任务必须包含明确的验收标准`;
  }

  /**
   * 项目状态追踪文档 system prompt
   */
  private getContextStateSystemPrompt(domain: Domain): string {
    return `你是一位专业的项目协调员，负责产出可直接交付的中文 Markdown 项目状态追踪文档。

${getContextStatePromptTemplate(domain)}

输出约束：
- 只输出最终 Markdown 文档
- 不要输出思考过程、解释、备注、前言或后记
- 表格格式必须规范
- 这是一个需要持续更新的文档`;
  }

  /**
   * AI 编码规则文档 system prompt
   */
  private getAgentsSystemPrompt(domain: Domain): string {
    return `你是一位专业的 AI 编程导师，负责产出可直接交付的中文 Markdown AGENTS.md 编码规则文档。

${getAgentsPromptTemplate(domain)}

输出约束：
- 只输出最终 Markdown 文档
- 不要输出思考过程、解释、备注、前言或后记
- ContextState 更新规则部分必须清晰明确
- 这是 AI Coding 工具的主要参考文档`;
  }

  /**
   * Review all documents for cross-document alignment (streaming version)
   * Emits initial phases, then streams the actual AI review output into
   * the terminal so the user sees the review reasoning in real time.
   */
  async reviewDocumentsStream(
    topicInfo: TopicInfo,
    allDocs: Record<string, string>,
    onProgress: (phase: string) => void
  ): Promise<ReviewResult> {
    const config = this.getConfig();

    if (config.mockMode) {
      onProgress('正在加载并解析 7 份文档内容...\n');
      await this.delay(500);
      onProgress('产品经理：检查 PRD 与前端/后端的一致性...\n');
      await this.delay(500);
      onProgress('前端架构师：验证前端文档与 API 契约...\n');
      await this.delay(500);
      onProgress('后端架构师：检查后端与 API 的对齐...\n');
      await this.delay(500);
      onProgress('总协调员：汇总整体评估意见...\n');
      await this.delay(500);
      onProgress('正在生成结构化审核结果...\n');
      await this.delay(500);
      const result = this.generateMockReviewResult();
      onProgress(JSON.stringify(result, null, 2));
      onProgress('\n审核完成');
      return result;
    }

    // Emit initial phases
    onProgress('正在加载并解析 7 份文档内容...\n');
    await this.delay(500);
    onProgress('产品经理：检查 PRD 与前端/后端的一致性...\n');
    await this.delay(300);
    onProgress('前端架构师：验证前端文档与 API 契约...\n');
    await this.delay(300);
    onProgress('后端架构师：检查后端与 API 的对齐...\n');
    await this.delay(300);
    onProgress('总协调员：汇总整体评估意见...\n');
    await this.delay(300);
    onProgress('正在生成结构化审核结果...\n\n');

    const systemPrompt = getReviewSystemPrompt(topicInfo.domain);
    const userPrompt = buildReviewUserPrompt(topicInfo, allDocs);
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    // Stream the AI response, forwarding raw content to onProgress.
    // We inline the streaming logic here because requestStreamingCompletion
    // passes extractPreviewContent(contentText) which strips JSON output.
    const rawContent = await this.requestStreamingCompletionRaw(
      config.baseURL,
      config.apiKey,
      config.model,
      messages,
      onProgress
    );

    const cleaned = this.cleanGeneratedContent(rawContent);
    const parsedResult = this.parseReviewResult(cleaned);
    const finalized = await this.ensureReviewPatchHints(topicInfo, allDocs, parsedResult);

    onProgress('\n\n审核完成');
    return finalized;
  }

  /**
   * Like requestStreamingCompletion but passes raw accumulated content
   * to onProgress instead of the preview-extracted version.
   * Used for review streaming where the output is JSON, not markdown.
   */
  private async requestStreamingCompletionRaw(
    baseURL: string,
    apiKey: string,
    model: string,
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
    onRawContent: (rawContent: string) => void
  ): Promise<string> {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 16384,
        stream: true,
        reasoning_split: true
      }),
      signal: AbortSignal.timeout(this.REVIEW_TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MiniMax API request failed: ${response.status} ${errorText}`);
    }

    if (!response.body) {
      throw new Error('MiniMax API stream is unavailable');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let contentText = '';
    let lastEmitAt = 0;

    const extractNextEventBlock = (): string | null => {
      const match = buffer.match(/\r?\n\r?\n/);
      if (!match || match.index === undefined) {
        return null;
      }
      const block = buffer.slice(0, match.index).trim();
      buffer = buffer.slice(match.index + match[0].length);
      return block;
    };

    const emitProgress = (force = false): void => {
      const now = Date.now();
      if (!force && now - lastEmitAt < 120) {
        return;
      }
      onRawContent(contentText);
      lastEmitAt = now;
    };

    const processEventBlock = (block: string): void => {
      const dataLines = block
        .split(/\r?\n/)
        .filter(line => line.startsWith('data:'))
        .map(line => line.slice(5).trim());

      if (dataLines.length === 0) return;

      const payload = dataLines.join('\n');
      if (payload === '[DONE]') return;

      const chunk = JSON.parse(payload) as StreamChunkResponse;
      const choice = chunk.choices?.[0];
      const delta = choice?.delta;
      if (!delta) return;

      const contentIncoming = delta.content || '';
      const contentDelta = this.getNovelSuffix(contentText, contentIncoming);
      if (contentDelta) {
        contentText += contentDelta;
        emitProgress();
      }
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      let block = extractNextEventBlock();
      while (block !== null) {
        if (block) processEventBlock(block);
        block = extractNextEventBlock();
      }
    }

    if (buffer.trim()) processEventBlock(buffer.trim());
    emitProgress(true);

    return contentText;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Review all documents for cross-document alignment
   */
  async reviewDocuments(
    topicInfo: TopicInfo,
    allDocs: Record<string, string>
  ): Promise<ReviewResult> {
    const config = this.getConfig();

    if (config.mockMode) {
      return this.generateMockReviewResult();
    }

    const systemPrompt = getReviewSystemPrompt(topicInfo.domain);
    const userPrompt = buildReviewUserPrompt(topicInfo, allDocs);
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const rawContent = await this.executeWithRetry(messages);
    const parsedResult = this.parseReviewResult(rawContent);
    return this.ensureReviewPatchHints(topicInfo, allDocs, parsedResult);
  }

  /**
   * Fix affected documents based on review findings
   */
  async fixDocuments(
    topicInfo: TopicInfo,
    affectedDocs: Record<string, string>,
    findings: ReviewResult
  ): Promise<ReviewFixResult> {
    const relevantDocTypes = new Set(Object.keys(affectedDocs) as DocType[]);
    const scopedFindings: ReviewResult = {
      summary: findings.summary,
      issues: findings.issues.filter(issue =>
        issue.affectedDocTypes.some(docType => relevantDocTypes.has(docType))
        || issue.patchHints.some(hint => relevantDocTypes.has(hint.docType))
      )
    };
    const hydratedFindings = await this.ensureReviewPatchHints(topicInfo, affectedDocs, scopedFindings);
    const results = new Map<string, string>();
    const unresolved: ReviewUnresolvedFix[] = [];

    for (const [docType, fullContent] of Object.entries(affectedDocs)) {
      const docFindings: ReviewResult = {
        issues: hydratedFindings.issues.filter(issue => issue.affectedDocTypes.includes(docType as DocType)),
        summary: hydratedFindings.summary
      };

      if (docFindings.issues.length === 0) {
        results.set(docType, this.postProcessGeneratedContent(docType as DocType, fullContent));
        continue;
      }

      const fixResult = this.applyStructuredReviewFixes(
        docType as DocType,
        fullContent,
        docFindings
      );
      unresolved.push(...fixResult.unresolved);
      results.set(docType, this.postProcessGeneratedContent(docType as DocType, fixResult.content));
    }

    return {
      documents: results,
      unresolved
    };
  }

  private parseReviewResult(rawContent: string): ReviewResult {
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { issues: [], summary: '审核完成，未发现明显问题。' };
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]) as Partial<ReviewResult>;
      return {
        issues: Array.isArray(parsed.issues) ? parsed.issues.map((issue, i) => ({
          id: issue.id ?? (i + 1),
          severity: (issue.severity as ReviewIssue['severity']) ?? 'suggestion',
          category: (issue.category as ReviewIssue['category']) ?? 'overall',
          title: issue.title ?? '未命名问题',
          description: issue.description ?? '',
          affectedDocTypes: Array.isArray(issue.affectedDocTypes) ? issue.affectedDocTypes : [],
          suggestion: issue.suggestion ?? '',
          patchHints: this.parseReviewPatchHints(issue.patchHints)
        })) : [],
        summary: typeof parsed.summary === 'string' ? parsed.summary : '审核完成。'
      };
    } catch {
      return { issues: [], summary: '审核结果解析失败，请重试。' };
    }
  }

  private generateMockReviewResult(): ReviewResult {
    return {
      issues: [
        {
          id: 1,
          severity: 'warning',
          category: 'prd_vs_frontend',
          title: 'Mock模式：PRD与前端文档对齐检查',
          description: '此为Mock模式生成的示例审核结果。配置有效API密钥后将生成真实审核。',
          affectedDocTypes: ['PRD', 'FRONTEND'],
          suggestion: '在前端文档中补充PRD提到的用户管理模块设计',
          patchHints: [
            {
              docType: 'FRONTEND',
              changeType: 'replace_section',
              targetHeadingPath: ['## 核心组件设计'],
              replacementContent: `## 核心组件设计

### 用户管理模块

- 登录注册流程
- 个人资料管理
- 收藏与发布管理`
            }
          ]
        }
      ],
      summary: 'Mock模式审核完成。整体文档结构较为完整，建议检查各文档间的模块命名一致性。'
    };
  }

  private parseReviewPatchHints(rawHints: unknown): ReviewPatchHint[] {
    if (!Array.isArray(rawHints)) {
      return [];
    }

    return rawHints
      .map((rawHint): ReviewPatchHint | null => {
        if (!rawHint || typeof rawHint !== 'object') {
          return null;
        }

        const hint = rawHint as Partial<ReviewPatchHint>;
        const changeType = hint.changeType === 'replace_range' ? 'replace_range' : hint.changeType === 'replace_section' ? 'replace_section' : null;
        const docType = typeof hint.docType === 'string' ? hint.docType as DocType : null;
        const replacementContent = typeof hint.replacementContent === 'string' ? hint.replacementContent.trim() : '';

        if (!docType || !changeType || !replacementContent) {
          return null;
        }

        return {
          docType,
          changeType,
          targetHeadingPath: Array.isArray(hint.targetHeadingPath)
            ? hint.targetHeadingPath.filter((part): part is string => typeof part === 'string').map(part => part.trim()).filter(Boolean)
            : [],
          anchorBefore: typeof hint.anchorBefore === 'string' ? hint.anchorBefore.trim() : undefined,
          anchorAfter: typeof hint.anchorAfter === 'string' ? hint.anchorAfter.trim() : undefined,
          replacementContent
        };
      })
      .filter((hint): hint is ReviewPatchHint => hint !== null);
  }

  private applyStructuredReviewFixes(
    docType: DocType,
    originalContent: string,
    findings: ReviewResult
  ): { content: string; unresolved: ReviewUnresolvedFix[] } {
    let nextContent = this.cleanGeneratedContent(originalContent);
    const unresolved: ReviewUnresolvedFix[] = [];

    for (const issue of findings.issues) {
      const patchHints = issue.patchHints.filter(hint => hint.docType === docType);
      if (patchHints.length === 0) {
        if (issue.patchHints.length > 0) {
          continue;
        }

        unresolved.push({
          docType,
          issueId: issue.id,
          reason: 'missing_patch_hints',
          fallbackNote: this.buildReviewIssueNote(issue)
        });
        continue;
      }

      for (const patchHint of patchHints) {
        const result = this.applyStructuredPatchHint(nextContent, patchHint);
        if (result.applied) {
          nextContent = result.content;
          continue;
        }

        unresolved.push({
          docType,
          issueId: issue.id,
          reason: result.reason || 'patch_apply_failed',
          fallbackNote: this.buildReviewIssueNote(issue),
          targetHeadingPath: patchHint.targetHeadingPath.length > 0 ? patchHint.targetHeadingPath : undefined,
          anchorBefore: patchHint.anchorBefore,
          anchorAfter: patchHint.anchorAfter
        });
      }
    }

    return {
      content: nextContent,
      unresolved
    };
  }

  private applyStructuredPatchHint(
    content: string,
    patchHint: ReviewPatchHint
  ): { applied: boolean; content: string; reason?: string } {
    if (patchHint.changeType === 'replace_section') {
      // Strategy 1: Heading path match (exact + fuzzy)
      const section = this.findSectionByHeadingPath(content, patchHint.targetHeadingPath);
      if (section) {
        return {
          applied: true,
          content: this.replaceSectionByRange(content, section, patchHint.replacementContent)
        };
      }

      // Strategy 2: Anchor-based replacement
      if (patchHint.anchorBefore && patchHint.anchorAfter) {
        return this.applyAnchorPatch(content, patchHint);
      }

      // Strategy 3: Partial heading path + text search within section
      const partialResult = this.findByPartialPathAndText(content, patchHint);
      if (partialResult.applied) {
        return partialResult;
      }

      // Strategy 4: Full-text keyword search
      const textResult = this.findByFullTextSearch(content, patchHint);
      if (textResult.applied) {
        return textResult;
      }

      return { applied: false, content, reason: 'target_heading_path_not_found' };
    }

    if (patchHint.changeType === 'replace_range') {
      const anchorResult = this.applyAnchorPatch(content, patchHint);
      if (anchorResult.applied) {
        return anchorResult;
      }

      if (patchHint.targetHeadingPath.length > 0) {
        const section = this.findSectionByHeadingPath(content, patchHint.targetHeadingPath);
        if (section) {
          return {
            applied: true,
            content: this.replaceSectionByRange(content, section, patchHint.replacementContent)
          };
        }
      }

      // Partial heading path + text search fallback
      const partialResult = this.findByPartialPathAndText(content, patchHint);
      if (partialResult.applied) {
        return partialResult;
      }

      return anchorResult.reason
        ? anchorResult
        : { applied: false, content, reason: 'anchors_not_found' };
    }

    return { applied: false, content, reason: 'unsupported_change_type' };
  }

  private buildReviewIssueNote(issue: ReviewIssue): string {
    const severityLabels: Record<ReviewIssue['severity'], string> = {
      critical: '严重',
      warning: '警告',
      suggestion: '建议'
    };

    const categoryLabels: Record<ReviewIssue['category'], string> = {
      prd_vs_frontend: 'PRD vs 前端',
      prd_vs_backend: 'PRD vs 后端',
      backend_vs_api: '后端 vs API',
      frontend_vs_api: '前端 vs API',
      overall: '整体一致性'
    };

    const detail = issue.suggestion || issue.description || issue.title;
    return `- [${severityLabels[issue.severity]}][${categoryLabels[issue.category]}] ${issue.title}：${detail}`;
  }

  private findSectionByHeadingPath(content: string, targetHeadingPath: string[]): SectionRange | null {
    if (!Array.isArray(targetHeadingPath) || targetHeadingPath.length === 0) {
      return null;
    }

    const lines = content.split(/\r?\n/);
    const normalizedTargetPath = targetHeadingPath.map(part => this.normalizeHeadingLine(part));
    const stack: Array<{ level: number; heading: string; original: string }> = [];

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const match = line.match(/^(#{1,6})\s+/);
      if (!match) {
        continue;
      }

      const level = match[1].length;
      const originalHeading = line.replace(/^(#{1,6})\s+/, '');
      const normalizedHeading = this.normalizeHeadingLine(line);
      
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      stack.push({ level, heading: normalizedHeading, original: originalHeading });

      const currentPath = stack.map(item => item.heading);
      if (this.pathEndsWith(currentPath, normalizedTargetPath)) {
        let endIndex = lines.length;
        for (let end = index + 1; end < lines.length; end += 1) {
          const nextMatch = lines[end].match(/^(#{1,6})\s+/);
          if (nextMatch && nextMatch[1].length <= level) {
            endIndex = end;
            break;
          }
        }

        return {
          startIndex: index,
          endIndex,
          headingLine: line
        };
      }
    }

    // If exact match not found, try fuzzy matching for better robustness
    return this.fuzzyFindSectionByHeadingPath(content, targetHeadingPath, stack);
  }

  /**
   * Fuzzy matching for heading paths to handle minor text differences
   */
  private fuzzyFindSectionByHeadingPath(
    content: string, 
    targetHeadingPath: string[],
    originalStack: Array<{ level: number; heading: string; original: string }>
  ): SectionRange | null {
    if (!Array.isArray(targetHeadingPath) || targetHeadingPath.length === 0) {
      return null;
    }

    const lines = content.split(/\r?\n/);
    const normalizedTargetPath = targetHeadingPath.map(part => this.normalizeHeadingLine(part));
    const targetLastSegment = normalizedTargetPath[normalizedTargetPath.length - 1];
    const targetLastSegmentSimple = targetLastSegment.replace(/[#\s]/g, '').toLowerCase();
    
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      const match = line.match(/^(#{1,6})\s+/);
      if (!match) {
        continue;
      }

      const level = match[1].length;
      // Only consider headings that match the depth we're looking for
      if (level !== targetHeadingPath.length) {
        continue;
      }

      const originalHeading = line.replace(/^(#{1,6})\s+/, '');
      const normalizedHeading = this.normalizeHeadingLine(line);
      const normalizedHeadingSimple = normalizedHeading.replace(/[#\s]/g, '').toLowerCase();
      
      // Check for exact match first (fallback)
      if (normalizedHeading === targetLastSegment) {
        // Now check if the parent path matches
        const tempStack: Array<{ level: number; heading: string }> = [];
        for (let i = 0; i < index; i++) {
          const prevLine = lines[i];
          const prevMatch = prevLine.match(/^(#{1,6})\s+/);
          if (!prevMatch) continue;
          
          const prevLevel = prevMatch[1].length;
          const prevHeading = this.normalizeHeadingLine(prevLine);
          
          while (tempStack.length > 0 && tempStack[tempStack.length - 1].level >= prevLevel) {
            tempStack.pop();
          }
          tempStack.push({ level: prevLevel, heading: prevHeading });
        }
        
        const currentPath = tempStack.map(item => item.heading);
        if (this.pathEndsWith(currentPath, normalizedTargetPath.slice(0, -1))) {
          let endIndex = lines.length;
          for (let end = index + 1; end < lines.length; end += 1) {
            const nextMatch = lines[end].match(/^(#{1,6})\s+/);
            if (nextMatch && nextMatch[1].length <= level) {
              endIndex = end;
              break;
            }
          }

          return {
            startIndex: index,
            endIndex,
            headingLine: line
          };
        }
      }
      
      // Check for fuzzy match (contains or partial match)
      if (normalizedHeadingSimple.includes(targetLastSegmentSimple) || 
          targetLastSegmentSimple.includes(normalizedHeadingSimple)) {
        // Simple containment match - use this as a fallback
        let endIndex = lines.length;
        for (let end = index + 1; end < lines.length; end += 1) {
          const nextMatch = lines[end].match(/^(#{1,6})\s+/);
          if (nextMatch && nextMatch[1].length <= level) {
            endIndex = end;
            break;
          }
        }

        return {
          startIndex: index,
          endIndex,
          headingLine: line
        };
      }
    }

    return null;
  }

  /**
   * Strategy 3: Find by partial heading path, then search for text within that section.
   * Handles cases like "## 下一步行动 > 2. T-02 数据库设计" where the last segment
   * is a list item inside the section, not a heading.
   */
  private findByPartialPathAndText(
    content: string,
    patchHint: ReviewPatchHint
  ): { applied: boolean; content: string; reason?: string } {
    const { targetHeadingPath, replacementContent } = patchHint;
    if (targetHeadingPath.length < 2) {
      return { applied: false, content, reason: 'target_heading_path_not_found' };
    }

    // Try matching the parent path (all segments except the last)
    const parentPath = targetHeadingPath.slice(0, -1);
    const lastSegment = targetHeadingPath[targetHeadingPath.length - 1];

    // Find the parent section
    const parentSection = this.findSectionByHeadingPath(content, parentPath);
    if (!parentSection) {
      return { applied: false, content, reason: 'target_heading_path_not_found' };
    }

    // Extract parent section content and search for the last segment text
    const lines = content.split(/\r?\n/);
    const parentLines = lines.slice(parentSection.startIndex, parentSection.endIndex);
    const parentContent = parentLines.join('\n');

    // Normalize the last segment for search
    const normalizedLast = lastSegment
      .replace(/^\d+[\.\)、]\s*/, '') // Remove leading numbering like "2. " or "2) "
      .trim()
      .toLowerCase();

    if (!normalizedLast) {
      // No meaningful text to search — replace entire parent section
      return {
        applied: true,
        content: this.replaceSectionByRange(content, parentSection, replacementContent)
      };
    }

    // Find the line containing the last segment text
    const matchedLineIndex = parentLines.findIndex(line => {
      const normalizedLine = line.replace(/^\s*[-*]\s*/, '').replace(/^\d+[\.\)、]\s*/, '').trim().toLowerCase();
      return normalizedLine.includes(normalizedLast) || normalizedLast.includes(normalizedLine);
    });

    if (matchedLineIndex === -1) {
      // Text not found within parent section — replace entire parent section as last resort
      return {
        applied: true,
        content: this.replaceSectionByRange(content, parentSection, replacementContent)
      };
    }

    // Found the target text — determine its scope (list item block or single line)
    const absoluteMatchIndex = parentSection.startIndex + matchedLineIndex;
    const matchLevel = this.detectListLevel(parentLines[matchedLineIndex]);
    let endOfBlock = matchedLineIndex + 1;
    while (endOfBlock < parentLines.length) {
      const nextLine = parentLines[endOfBlock];
      if (nextLine.trim() === '') { endOfBlock++; continue; }
      const nextLevel = this.detectListLevel(nextLine);
      if (nextLevel <= matchLevel && nextLine.match(/^\s*[-*\d]/)) break;
      if (nextLine.match(/^#{1,6}\s+/)) break;
      if (nextLevel <= matchLevel) break;
      endOfBlock++;
    }

    const blockSection: SectionRange = {
      startIndex: absoluteMatchIndex,
      endIndex: parentSection.startIndex + endOfBlock,
      headingLine: lines[absoluteMatchIndex]
    };

    return {
      applied: true,
      content: this.replaceSectionByRange(content, blockSection, replacementContent)
    };
  }

  /**
   * Strategy 4: Full-text keyword search across the entire document.
   * Extracts key terms from targetHeadingPath and replacementContent,
   * locates the best matching region, and replaces it.
   */
  private findByFullTextSearch(
    content: string,
    patchHint: ReviewPatchHint
  ): { applied: boolean; content: string; reason?: string } {
    const { targetHeadingPath, replacementContent } = patchHint;

    // Extract searchable keywords from the path segments
    const keywords = targetHeadingPath
      .flatMap(segment => segment.split(/[\s>]+/))
      .map(kw => kw.replace(/^\d+[\.\)、]*/, '').trim().toLowerCase())
      .filter(kw => kw.length >= 2);

    if (keywords.length === 0) {
      return { applied: false, content, reason: 'target_heading_path_not_found' };
    }

    const lines = content.split(/\r?\n/);
    let bestLineIndex = -1;
    let bestScore = 0;

    for (let i = 0; i < lines.length; i++) {
      const normalizedLine = lines[i].toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        if (normalizedLine.includes(kw)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestLineIndex = i;
      }
    }

    if (bestLineIndex === -1 || bestScore === 0) {
      return { applied: false, content, reason: 'target_heading_path_not_found' };
    }

    // Determine the scope of the matched region
    const matchLine = lines[bestLineIndex];
    const matchLevel = this.detectListLevel(matchLine);
    let endOfBlock = bestLineIndex + 1;
    while (endOfBlock < lines.length) {
      const nextLine = lines[endOfBlock];
      if (nextLine.trim() === '') { endOfBlock++; continue; }
      const nextLevel = this.detectListLevel(nextLine);
      if (nextLine.match(/^#{1,6}\s+/)) break;
      if (nextLevel <= matchLevel && nextLine.match(/^\s*[-*\d]/)) break;
      if (nextLevel <= matchLevel) break;
      endOfBlock++;
    }

    const section: SectionRange = {
      startIndex: bestLineIndex,
      endIndex: endOfBlock,
      headingLine: matchLine
    };

    return {
      applied: true,
      content: this.replaceSectionByRange(content, section, replacementContent)
    };
  }

  private detectListLevel(line: string): number {
    const match = line.match(/^(\s*)/);
    const indent = match ? match[1].length : 0;
    // Count indent level (2 or 4 spaces per level)
    return Math.floor(indent / 2);
  }

  private replaceSectionByRange(content: string, section: SectionRange, replacementContent: string): string {
    const lines = content.split(/\r?\n/);
    let replacement = this.cleanGeneratedContent(replacementContent);
    const firstReplacementLine = replacement.split(/\r?\n/)[0] || '';

    if (this.normalizeHeadingLine(firstReplacementLine) !== this.normalizeHeadingLine(section.headingLine)) {
      replacement = `${section.headingLine}\n\n${replacement}`.trim();
    }

    const replacementLines = replacement.split(/\r?\n/);
    const mergedLines = [
      ...lines.slice(0, section.startIndex),
      ...replacementLines,
      ...lines.slice(section.endIndex)
    ];

    return mergedLines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  private applyAnchorPatch(
    content: string,
    patchHint: ReviewPatchHint
  ): { applied: boolean; content: string; reason?: string } {
    if (!patchHint.anchorBefore || !patchHint.anchorAfter) {
      return { applied: false, content, reason: 'missing_anchors' };
    }

    const startIndex = content.indexOf(patchHint.anchorBefore);
    if (startIndex === -1) {
      return { applied: false, content, reason: 'anchor_before_not_found' };
    }

    const replaceStart = startIndex + patchHint.anchorBefore.length;
    const endIndex = content.indexOf(patchHint.anchorAfter, replaceStart);
    if (endIndex === -1) {
      return { applied: false, content, reason: 'anchor_after_not_found' };
    }

    if (endIndex < replaceStart) {
      return { applied: false, content, reason: 'invalid_anchor_order' };
    }

    const merged = `${content.slice(0, replaceStart)}${patchHint.replacementContent}${content.slice(endIndex)}`;
    return {
      applied: true,
      content: merged.replace(/\n{3,}/g, '\n\n').trim()
    };
  }

  private pathEndsWith(fullPath: string[], targetPath: string[]): boolean {
    if (fullPath.length < targetPath.length) {
      return false;
    }

    const startIndex = fullPath.length - targetPath.length;
    for (let index = 0; index < targetPath.length; index += 1) {
      if (fullPath[startIndex + index] !== targetPath[index]) {
        return false;
      }
    }

    return true;
  }

  private normalizeHeadingLine(line: string): string {
    return line.trim().replace(/\s+/g, ' ').replace(/[^\w\s一-鿿]/g, '').toLowerCase();
  }

  private async ensureReviewPatchHints(
    topicInfo: TopicInfo,
    allDocs: Record<string, string>,
    reviewResult: ReviewResult
  ): Promise<ReviewResult> {
    const issuesNeedingRecovery = reviewResult.issues
      .map(issue => ({
        issue,
        missingDocTypes: issue.affectedDocTypes.filter(docType =>
          Boolean(allDocs[docType])
          && !issue.patchHints.some(hint => hint.docType === docType)
        )
      }))
      .filter(item => item.missingDocTypes.length > 0);

    if (issuesNeedingRecovery.length === 0) {
      return reviewResult;
    }

    const recoverySystemPrompt = getPatchHintRecoverySystemPrompt(topicInfo.domain);
    const recoveryUserPrompt = buildPatchHintRecoveryUserPrompt(
      topicInfo,
      allDocs,
      issuesNeedingRecovery.map(({ issue }) => ({
        id: issue.id,
        category: issue.category,
        title: issue.title,
        description: issue.description,
        suggestion: issue.suggestion,
        affectedDocTypes: issue.affectedDocTypes,
        existingPatchDocTypes: issue.patchHints.map(hint => hint.docType)
      }))
    );

    try {
      const rawRecovery = await this.executeWithRetry([
        { role: 'system', content: recoverySystemPrompt },
        { role: 'user', content: recoveryUserPrompt }
      ]);
      const recoveredPatchHints = this.parsePatchHintRecoveryResult(rawRecovery);

      return {
        ...reviewResult,
        issues: reviewResult.issues.map(issue => {
          const extraHints = recoveredPatchHints.get(issue.id) || [];
          if (extraHints.length === 0) {
            return issue;
          }

          const existingKeys = new Set(
            issue.patchHints.map(hint => this.getPatchHintIdentity(hint))
          );
          const mergedHints = [
            ...issue.patchHints,
            ...extraHints.filter(hint => !existingKeys.has(this.getPatchHintIdentity(hint)))
          ];

          return {
            ...issue,
            patchHints: mergedHints
          };
        })
      };
    } catch (error) {
      console.warn('Patch hint recovery failed:', error);
      return reviewResult;
    }
  }

  private parsePatchHintRecoveryResult(rawContent: string): Map<number, ReviewPatchHint[]> {
    const patchHintsByIssueId = new Map<number, ReviewPatchHint[]>();
    const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return patchHintsByIssueId;
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]) as {
        patchHintsByIssueId?: Record<string, unknown>;
      };

      for (const [issueId, rawHints] of Object.entries(parsed.patchHintsByIssueId || {})) {
        const numericIssueId = Number(issueId);
        if (Number.isNaN(numericIssueId)) {
          continue;
        }

        patchHintsByIssueId.set(numericIssueId, this.parseReviewPatchHints(rawHints));
      }
    } catch {
      return patchHintsByIssueId;
    }

    return patchHintsByIssueId;
  }

  private getPatchHintIdentity(patchHint: ReviewPatchHint): string {
    return JSON.stringify({
      docType: patchHint.docType,
      changeType: patchHint.changeType,
      targetHeadingPath: patchHint.targetHeadingPath,
      anchorBefore: patchHint.anchorBefore || '',
      anchorAfter: patchHint.anchorAfter || '',
      replacementContent: patchHint.replacementContent
    });
  }
}

export const aiService = new AIService();
export default AIService;
