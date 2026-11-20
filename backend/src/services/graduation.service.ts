import { GraduationDocType, Domain, Platform, PrismaClient } from '../generated/prisma';
import { apiProviderService, assertPublicHttpsBaseUrl } from './apiProvider.service.js';
import { getTaskBookSystemPrompt, buildTaskBookUserPrompt } from '../prompts/task-book.template.js';
import { getProposalSystemPrompt, buildProposalUserPrompt } from '../prompts/proposal.template.js';
import { getProgressRecordSystemPrompt, buildProgressRecordUserPrompt } from '../prompts/progress-record.template.js';
import type { AppEnv } from '../types.js';
import { DocumentStreamError } from '../lib/document-stream.js';

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface GenerationProgress {
  phase: 'connecting' | 'reasoning' | 'writing' | 'finalizing';
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
  objectives: string | null;
  techStack: string[];
  studentId: string;
  studentName: string;
  major: string;
  className: string;
  grade: string;
  datasetName?: string;
  datasetCategory?: string;
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
    delta?: {
      content?: string;
      reasoning_content?: string;
      reasoning_details?: Array<{ text?: string }>;
    };
    finish_reason?: string | null;
  }>;
  usage?: ChatCompletionResponse['usage'];
  error?: { message?: string };
}

type ProviderEnv = Pick<AppEnv['Bindings'], 'MINIMAX_BASE_URL' | 'MINIMAX_API_KEY' | 'MINIMAX_MODEL'>;

interface GraduationStreamOptions {
  signal?: AbortSignal;
  userId?: number;
  prisma?: PrismaClient;
  env?: ProviderEnv;
}

export class GraduationService {
  private readonly REQUEST_TIMEOUT = 600_000;
  private _prisma?: PrismaClient;
  private _env?: ProviderEnv;

  setContext(prisma: PrismaClient, env?: ProviderEnv) {
    this._prisma = prisma;
    this._env = env;
  }

  private async getConfig(userId?: number, prisma = this._prisma, env = this._env) {
    const providerConfig = prisma
      ? (userId
        ? await apiProviderService.getConfigForUser(prisma, userId, env)
        : await apiProviderService.getEffectiveConfig(prisma, env))
      : (userId
        ? await apiProviderService.getConfigForUser(userId)
        : await apiProviderService.getEffectiveConfig());
    const mockMode = process.env.MOCK_AI === 'true' || process.env.MOCK_AI === '1';

    if (!providerConfig.apiKey && !mockMode) {
      throw new Error('No active API provider configured — set up one in admin panel or configure MINIMAX_API_KEY in .env');
    }

    return {
      baseURL: providerConfig.baseURL,
      apiKey: providerConfig.apiKey,
      model: providerConfig.model,
      mockMode,
      providerConfig,
    };
  }

  async generateDocument(
    docType: GraduationDocType,
    topicContext: TopicContext,
    previousDocs: PreviousDocs,
    userId?: number
  ): Promise<{ content: string; usage: TokenUsage }> {
    const config = await this.getConfig(userId);

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
    onProgress: (progress: GenerationProgress) => void | Promise<void>,
    options: GraduationStreamOptions = {}
  ): Promise<{ content: string; usage: TokenUsage }> {
    const { signal } = options;
    signal?.throwIfAborted();
    const config = await this.getConfig(options.userId, options.prisma, options.env);

    if (config.mockMode) {
      const result = await this.generateMockDocument(docType, topicContext);
      await onProgress({ phase: 'finalizing', reasoningText: '', contentText: result.content });
      return result;
    }

    const { systemPrompt, userPrompt } = this.buildPrompts(docType, topicContext, previousDocs);
    let messages: Array<{ role: 'system' | 'user'; content: string }> = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const contentParts: string[] = [];
    const totalUsage: TokenUsage = { promptTokens: 0, completionTokens: 0, totalTokens: 0 };
    const maxAttempts = 3;
    const startedAt = Date.now();

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      signal?.throwIfAborted();
      try {
        const result = await this.requestCompletionStream(
          config.baseURL, config.apiKey, config.model, messages, progress => onProgress({
            ...progress,
            contentText: contentParts.length && progress.contentText
              ? this.mergeContentParts([...contentParts, progress.contentText])
              : progress.contentText,
            elapsedSeconds: Math.floor((Date.now() - startedAt) / 1000),
          }), signal
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
        signal?.throwIfAborted();
        if (error instanceof Error && error.name === 'TimeoutError') {
          throw new DocumentStreamError('等待 AI 服务响应超时，请稍后重试', { cause: error });
        }
        if (error instanceof DocumentStreamError || attempt === maxAttempts - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    const content = this.postProcess(this.mergeContentParts(contentParts), docType);
    if (!content) {
      throw new DocumentStreamError('AI 服务未返回文档正文，请重试或更换模型');
    }
    await onProgress({ phase: 'finalizing', reasoningText: '', contentText: content });
    return { content, usage: totalUsage };
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
            backendContent: previousDocs.backendContent,
            datasetName: topicContext.datasetName,
            datasetCategory: topicContext.datasetCategory
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
            backendContent: previousDocs.backendContent,
            datasetName: topicContext.datasetName,
            datasetCategory: topicContext.datasetCategory
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
            proposalContent: previousDocs.proposalContent,
            domain: topicContext.domain,
            datasetName: topicContext.datasetName,
            datasetCategory: topicContext.datasetCategory
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

  private getDocumentText(text: string): string {
    const trimmed = text.trimStart();
    const openingTag = '<think>';
    if (openingTag.startsWith(trimmed)) return '';
    if (!trimmed.startsWith(openingTag)) return text;

    const closingTag = '</think>';
    const end = trimmed.indexOf(closingTag);
    return end === -1 ? '' : trimmed.slice(end + closingTag.length);
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
    assertPublicHttpsBaseUrl(baseURL);
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
    onProgress: (progress: GenerationProgress) => void | Promise<void>,
    signal?: AbortSignal
  ): Promise<{ content: string; usage: TokenUsage; finishReason: string | null }> {
    assertPublicHttpsBaseUrl(baseURL);
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'text/event-stream',
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
      await response.body?.cancel().catch(() => {});
      const status = response.status;
      if (status === 429) throw new DocumentStreamError('AI 服务请求过于频繁，请稍后重试');
      if (status === 401 || status === 403) {
        throw new DocumentStreamError('AI 服务拒绝了请求，请检查模型权限和 API 密钥配置');
      }
      if (status >= 500) throw new DocumentStreamError(`AI 服务暂时不可用（HTTP ${status}），请稍后重试`);
      throw new DocumentStreamError(`AI 服务拒绝了生成请求（HTTP ${status}），请检查模型配置`);
    }

    if (response.headers.get('content-type')?.includes('application/json')) {
      await response.body?.cancel().catch(() => {});
      throw new DocumentStreamError('AI 服务返回了非流式响应，请检查所选模型或 API 网关是否支持流式输出');
    }
    if (!response.body) {
      throw new DocumentStreamError('AI 服务未返回流式响应，请稍后重试');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let contentText = '';
    let usage: StreamChunkResponse['usage'];
    let finishReason: string | null = null;
    let streamDone = false;
    const startTime = Date.now();
    let lastProgressAt = 0;
    let lastPhase: GenerationProgress['phase'] | undefined;

    const estimateTokensFromText = (text: string): number => {
      const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
      const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
      const otherChars = text.length - chineseChars - englishWords;
      return Math.ceil(chineseChars + englishWords * 1.3 + otherChars * 0.5);
    };

    const processDataLine = (line: string): boolean => {
      if (!line.startsWith('data:')) return false;
      const data = line.slice(5).trim();
      if (data === '[DONE]') {
        streamDone = true;
        return false;
      }
      if (!data) return false;

      let chunk: StreamChunkResponse;
      try {
        chunk = JSON.parse(data);
      } catch {
        return false;
      }
      if (chunk?.error) {
        throw new DocumentStreamError('AI 服务在生成过程中返回错误，请稍后重试');
      }

      const choice = chunk?.choices?.[0];
      const delta = choice?.delta;
      if (delta?.content) contentText += delta.content;
      finishReason = choice?.finish_reason ?? finishReason;
      usage = chunk?.usage ?? usage;

      return Boolean(delta?.content || delta?.reasoning_content
        || delta?.reasoning_details?.some(detail => detail.text) || chunk?.usage);
    };

    try {
      while (!streamDone) {
        const { done, value } = await reader.read().catch((error: unknown) => {
          signal?.throwIfAborted();
          if (error instanceof Error && error.name === 'TimeoutError') {
            throw new DocumentStreamError('等待 AI 服务响应超时，请稍后重试', { cause: error });
          }
          throw new DocumentStreamError('AI 服务的流式连接中断，请稍后重试', { cause: error });
        });
        buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });
        const lines = buffer.split(/\r\n|\r|\n/);
        buffer = done ? '' : lines.pop() ?? '';

        let changed = false;
        for (const line of lines) {
          changed = processDataLine(line) || changed;
          if (streamDone) break;
        }

        if (changed) {
          const documentText = this.getDocumentText(contentText);
          const phase = documentText.trim() ? 'writing' : 'reasoning';
          const now = Date.now();
          // Display the first text immediately and limit repeated full Markdown snapshots.
          if (phase !== lastPhase || done || streamDone || now - lastProgressAt >= 100) {
            const displayContent = this.cleanStreamingMarkdown(documentText);
            const tokenCount = usage?.completion_tokens ?? estimateTokensFromText(displayContent);
            const elapsedMs = now - startTime;
            await onProgress({
              phase,
              reasoningText: '',
              contentText: displayContent,
              tokenCount,
              tokensPerSecond: elapsedMs >= 1000 ? tokenCount / (elapsedMs / 1000) : 0,
            });
            lastProgressAt = now;
            lastPhase = phase;
          }
        }

        if (done) break;
      }
    } finally {
      await reader.cancel().catch(() => {});
      reader.releaseLock();
    }

    if (!streamDone && !finishReason) {
      throw new DocumentStreamError('AI 服务在文档生成完毕前关闭了连接，请稍后重试');
    }

    const content = this.getDocumentText(contentText);
    const finalCompletion = usage?.completion_tokens ?? estimateTokensFromText(content);
    const finalPrompt = usage?.prompt_tokens ?? Math.max(0, (usage?.total_tokens ?? finalCompletion) - finalCompletion);

    return {
      content,
      usage: {
        promptTokens: finalPrompt,
        completionTokens: finalCompletion,
        totalTokens: usage?.total_tokens ?? finalPrompt + finalCompletion,
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
