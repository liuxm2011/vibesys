import { GraduationDocType, Domain, Platform } from '@prisma/client';
import { getTaskBookSystemPrompt, buildTaskBookUserPrompt } from '../prompts/task-book.template.js';
import { getProposalSystemPrompt, buildProposalUserPrompt } from '../prompts/proposal.template.js';
import { getProgressRecordSystemPrompt, buildProgressRecordUserPrompt } from '../prompts/progress-record.template.js';

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface GenerationProgress {
  phase: 'reasoning' | 'writing' | 'finalizing';
  reasoningText: string;
  contentText: string;
  tokenCount?: number;
  tokensPerSecond?: number;
  elapsedSeconds?: number;
}

interface TopicContext {
  title: string;
  description: string;
  domain: Domain;
  platform: Platform;
  objectives: string;
  techStack: string[];
  studentId: string;
  studentName: string;
  major: string;
  className: string;
  grade: string;
}

interface PreviousDocs {
  prdContent: string;
  frontendContent: string;
  backendContent: string;
  taskBookContent: string;
  proposalContent: string;
}

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

interface StreamChunkResponse {
  choices?: Array<{
    delta?: { content?: string; reasoning_content?: string };
    finish_reason?: string | null;
  }>;
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

export class GraduationService {
  private readonly REQUEST_TIMEOUT = 180_000;

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

  async generateDocument(
    docType: GraduationDocType,
    topicContext: TopicContext,
    previousDocs: PreviousDocs
  ): Promise<{ content: string; usage: TokenUsage }> {
    const config = this.getConfig();

    if (config.mockMode) {
      return this.generateMockDocument(docType, topicContext);
    }

    const { systemPrompt, userPrompt } = this.buildPrompts(docType, topicContext, previousDocs);
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const response = await this.requestCompletion(config.baseURL, config.apiKey, config.model, messages);
    const content = response.choices?.[0]?.message?.content || '';
    const usage: TokenUsage = {
      promptTokens: response.usage?.prompt_tokens ?? 0,
      completionTokens: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0
    };

    return { content: this.postProcess(content, docType), usage };
  }

  async generateDocumentStream(
    docType: GraduationDocType,
    topicContext: TopicContext,
    previousDocs: PreviousDocs,
    onProgress: (progress: GenerationProgress) => void,
    signal?: AbortSignal
  ): Promise<{ content: string; usage: TokenUsage }> {
    const config = this.getConfig();

    if (config.mockMode) {
      return this.generateMockDocument(docType, topicContext);
    }

    const { systemPrompt, userPrompt } = this.buildPrompts(docType, topicContext, previousDocs);
    let messages: Array<{ role: 'system' | 'user'; content: string }> = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const contentParts: string[] = [];
    let totalUsage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    const maxAttempts = 3;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
        const isContinuation = attempt > 0;
        const result = await this.requestCompletionStream(
          config.baseURL, config.apiKey, config.model, messages, onProgress, signal, isContinuation
        );

        if (!result.content.trim()) break;

        contentParts.push(result.content);
        totalUsage.promptTokens += result.usage.promptTokens;
        totalUsage.completionTokens += result.usage.completionTokens;
        totalUsage.totalTokens += result.usage.totalTokens;

        if (result.finishReason !== 'length') break;

        messages = [
          { role: 'system', content: this.buildContinuationSystemPrompt() },
          { role: 'user', content: this.buildContinuationUserPrompt(result.content) }
        ];
      } catch (error) {
        if (attempt === maxAttempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    const mergedContent = this.mergeContentParts(contentParts);
    return { content: this.postProcess(mergedContent, docType), usage: totalUsage };
  }

  private buildPrompts(
    docType: GraduationDocType,
    topicContext: TopicContext,
    previousDocs: PreviousDocs
  ): { systemPrompt: string; userPrompt: string } {
    switch (docType) {
      case 'TASK_BOOK':
        return {
          systemPrompt: getTaskBookSystemPrompt(),
          userPrompt: buildTaskBookUserPrompt({
            title: topicContext.title,
            description: topicContext.description,
            objectives: topicContext.objectives,
            platform: topicContext.platform,
            techStack: topicContext.techStack,
            prdContent: previousDocs.prdContent,
            frontendContent: previousDocs.frontendContent,
            backendContent: previousDocs.backendContent
          })
        };
      case 'PROPOSAL':
        return {
          systemPrompt: getProposalSystemPrompt(),
          userPrompt: buildProposalUserPrompt({
            title: topicContext.title,
            description: topicContext.description,
            objectives: topicContext.objectives,
            platform: topicContext.platform,
            techStack: topicContext.techStack,
            prdContent: previousDocs.prdContent,
            frontendContent: previousDocs.frontendContent,
            backendContent: previousDocs.backendContent
          })
        };
      case 'PREPARATION':
      case 'DRAFTING':
      case 'MIDTERM_CHECK':
      case 'REFINEMENT':
        return {
          systemPrompt: getProgressRecordSystemPrompt(),
          userPrompt: buildProgressRecordUserPrompt({
            docType,
            title: topicContext.title,
            description: topicContext.description,
            objectives: topicContext.objectives,
            platform: topicContext.platform,
            techStack: topicContext.techStack,
            studentId: topicContext.studentId,
            studentName: topicContext.studentName,
            major: topicContext.major,
            className: topicContext.className,
            grade: topicContext.grade,
            prdContent: previousDocs.prdContent,
            frontendContent: previousDocs.frontendContent,
            backendContent: previousDocs.backendContent,
            taskBookContent: previousDocs.taskBookContent,
            proposalContent: previousDocs.proposalContent
          })
        };
    }
  }

  /**
   * Markdown post-processing:
   * 1. 如果被包裹在 ```...``` 中，取出内容。
   * 2. 从第一个 `# ` 一级标题处截取，前面的任何思考、过渡语、提示词复述全部丢弃。
   * 3. 重复出现的一级标题只保留首个，避免中途“重启”。
   */
  private postProcess(content: string, _docType?: GraduationDocType): string {
    let clean = content.trim();

    const codeFenceMatch = clean.match(/```(?:\w+)?\s*\n?([\s\S]*?)```/);
    if (codeFenceMatch) {
      clean = codeFenceMatch[1].trim();
    }

    const firstHeadingIndex = clean.search(/^#\s+/m);
    if (firstHeadingIndex > 0) {
      clean = clean.slice(firstHeadingIndex).trim();
    }

    // Drop any duplicate top-level headings produced when the model restarts mid-stream.
    const headingMatches = [...clean.matchAll(/^#\s+.+$/gm)];
    if (headingMatches.length > 1) {
      const secondHeading = headingMatches[1];
      if (secondHeading.index !== undefined) {
        clean = clean.slice(0, secondHeading.index).trim();
      }
    }

    return clean;
  }

  /**
   * Lightweight cleanup used during streaming display: slice from the first `# ` heading
   * (preamble/thinking is dropped on the fly).
   */
  private cleanStreamingMarkdown(text: string): string {
    const trimmed = text.trim();
    const firstHeading = trimmed.search(/^#\s+/m);
    if (firstHeading > 0) {
      return trimmed.slice(firstHeading).trim();
    }
    return trimmed;
  }

  private removeRepeatedTitle(text: string): string {
    const matches = [...text.matchAll(/^#\s+.+$/gm)];
    if (matches.length <= 1) return text;
    const secondMatch = matches[1];
    if (secondMatch.index === undefined) return text;
    return text.slice(0, secondMatch.index).trim();
  }

  private buildContinuationSystemPrompt(): string {
    return [
      '你是一位专业的技术文档续写助手。',
      '你正在续写一份已被截断、尚未完成的 Markdown 文档。',
      '',
      '核心规则：',
      '- 你收到的上文是截断前的最后一段，紧接其后继续输出',
      '- 严禁输出文档标题（# 开头）',
      '- 严禁重复任何已输出过的章节或内容',
      '- 如果上一段句子不完整，先补全该句子',
      '- 直接输出剩余 Markdown 正文，不解释、不道歉'
    ].join('\n');
  }

  private buildContinuationUserPrompt(previousTail: string): string {
    const tailText = previousTail.slice(-800).trim();
    return [
      '上一条回答因长度限制被截断。以下是截断前的最后一段：',
      '',
      '```',
      tailText,
      '```',
      '',
      '请严格从上述内容之后继续生成剩余部分：',
      '- 严禁输出文档标题（# 开头的内容）',
      '- 严禁重复已输出过的任何章节、段落、表格、代码块或列表',
      '- 如果上一个句子或表格不完整，先补全再继续新内容',
      '- 直接输出 Markdown 正文，不要解释、道歉或说明"继续"'
    ].join('\n');
  }

  private mergeContentParts(parts: string[]): string {
    if (parts.length === 0) return '';
    let merged = parts[0].trim();
    for (const part of parts.slice(1)) {
      const next = part.trim();
      if (!next) continue;
      const withoutRestart = this.removeRepeatedTitle(next);
      const suffix = this.removeContentOverlap(merged, withoutRestart);
      if (suffix) {
        merged = `${merged}\n\n${suffix}`.trim();
      }
    }
    return merged;
  }

  private removeContentOverlap(existing: string, incoming: string): string {
    if (!incoming || existing.endsWith(incoming)) return '';
    const maxOverlap = Math.min(existing.length, incoming.length, 4000);
    for (let len = maxOverlap; len > 4; len -= 1) {
      if (existing.endsWith(incoming.slice(0, len))) {
        return incoming.slice(len).trim();
      }
    }
    return incoming;
  }


  private async requestCompletion(
    baseURL: string,
    apiKey: string,
    model: string,
    messages: Array<{ role: 'system' | 'user'; content: string }>
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
        max_tokens: 65536,
      }),
      signal: AbortSignal.timeout(this.REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${errorText}`);
    }

    return response.json();
  }

  private async requestCompletionStream(
    baseURL: string,
    apiKey: string,
    model: string,
    messages: Array<{ role: 'system' | 'user'; content: string }>,
    onProgress: (progress: GenerationProgress) => void,
    signal?: AbortSignal,
    isContinuation = false
  ): Promise<{ content: string; usage: TokenUsage; finishReason: string | null }> {
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
        max_tokens: 65536,
        stream: true,
        reasoning_split: true,
      }),
      signal: this.createRequestSignal(this.REQUEST_TIMEOUT, signal),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API stream request failed: ${response.status} ${errorText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let contentText = '';
    let reasoningText = '';
    let rawContentChars = 0;
    let apiReportedCompletionTokens = 0;
    let apiReportedTotalTokens = 0;
    let finishReason: string | null = null;
    let lastStreamCleanLength = 0;
    const STREAM_CLEAN_INTERVAL = 300;
    const startTime = Date.now();

    const estimateTokensFromText = (text: string): number => {
      const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
      const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
      const otherChars = text.length - chineseChars - englishWords;
      return Math.ceil(chineseChars + englishWords * 1.3 + otherChars * 0.5);
    };

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || !trimmed.startsWith('data: ')) continue;
          const data = trimmed.slice(6);
          if (data === '[DONE]') continue;

          try {
            const parsed: StreamChunkResponse = JSON.parse(data);
            const delta = parsed.choices?.[0]?.delta;
            if (delta) {
              if (delta.reasoning_content) {
                reasoningText += delta.reasoning_content;
              }
              if (delta.content) {
                contentText += delta.content;
                rawContentChars += delta.content.length;
              }
            }
            const choiceFinishReason = parsed.choices?.[0]?.finish_reason;
            if (choiceFinishReason) {
              finishReason = choiceFinishReason;
            }
            if (parsed.usage) {
              apiReportedCompletionTokens = parsed.usage.completion_tokens ?? 0;
              apiReportedTotalTokens = parsed.usage.total_tokens ?? 0;
            }

            const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
            const estimatedTokens = estimateTokensFromText(contentText);
            const displayTokens = apiReportedTotalTokens > 0 ? apiReportedTotalTokens : estimatedTokens;
            const displayCompletion = apiReportedCompletionTokens > 0 ? apiReportedCompletionTokens : estimatedTokens;

            let displayContent = this.cleanStreamingMarkdown(contentText);
            if (isContinuation) {
              displayContent = this.removeRepeatedTitle(displayContent);
            }
            if (contentText.length - lastStreamCleanLength >= STREAM_CLEAN_INTERVAL) {
              lastStreamCleanLength = contentText.length;
            }

            onProgress({
              phase: contentText.length > 0 ? 'writing' : 'reasoning',
              reasoningText,
              contentText: displayContent,
              tokenCount: displayTokens,
              tokensPerSecond: elapsedSeconds > 0 ? Math.round(displayTokens / elapsedSeconds) : 0,
              elapsedSeconds
            });
          } catch {
            // Skip unparseable chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
    const finalEstimatedTokens = estimateTokensFromText(contentText);
    const finalTokens = apiReportedTotalTokens > 0 ? apiReportedTotalTokens : finalEstimatedTokens;
    const finalCompletion = apiReportedCompletionTokens > 0 ? apiReportedCompletionTokens : finalEstimatedTokens;
    const finalPrompt = finalTokens - finalCompletion;

    return {
      content: contentText,
      usage: {
        promptTokens: Math.max(0, finalPrompt),
        completionTokens: finalCompletion,
        totalTokens: finalTokens
      },
      finishReason
    };
  }

  private async generateMockDocument(
    docType: GraduationDocType,
    topicContext: TopicContext
  ): Promise<{ content: string; usage: TokenUsage }> {
    const labels: Record<string, string> = {
      TASK_BOOK: '任务书',
      PROPOSAL: '开题报告',
      PREPARATION: '前期准备',
      DRAFTING: '撰写阶段',
      MIDTERM_CHECK: '中期检查',
      REFINEMENT: '完善'
    };

    const content = `# ${labels[docType]}

## 选题：${topicContext.title}

（模拟数据）此文档为 ${labels[docType]} 模板内容。请配置 MINIMAX_API_KEY 环境变量后生成正式文档。`;

    return {
      content,
      usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
    };
  }

  private createRequestSignal(timeoutMs: number, externalSignal?: AbortSignal): AbortSignal {
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    if (!externalSignal) {
      return timeoutSignal;
    }

    const controller = new AbortController();
    const abortFrom = (signal: AbortSignal): void => {
      if (!controller.signal.aborted) {
        controller.abort(signal.reason);
      }
    };

    if (externalSignal.aborted) {
      abortFrom(externalSignal);
    } else {
      externalSignal.addEventListener('abort', () => abortFrom(externalSignal), { once: true });
    }
    timeoutSignal.addEventListener('abort', () => abortFrom(timeoutSignal), { once: true });

    return controller.signal;
  }
}

export const graduationService = new GraduationService();
