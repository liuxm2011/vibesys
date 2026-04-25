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
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userPrompt }
    ];

    const { content, usage } = await this.requestCompletionStream(
      config.baseURL, config.apiKey, config.model, messages, onProgress, signal
    );

    return { content: this.postProcess(content, docType), usage };
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

  private postProcess(content: string, docType?: GraduationDocType): string {
    let clean = content;
    const codeFenceMatch = clean.match(/```(?:\w+)?\s*\n?([\s\S]*?)```/);
    if (codeFenceMatch) {
      clean = codeFenceMatch[1].trim();
    }
    clean = this.stripPreamble(clean, 'html');
    return clean;
  }

  /**
   * Strip any text before the first document heading.
   * This catches cases where the model outputs instructions/thinking before the actual content.
   */
  private stripPreamble(text: string, format: 'html' | 'markdown'): string {
    const headingLookahead = '(?=\\n##|\\n# |\\n<h2|<h2|\\n<div|<div|\\n一[、.．]\\s*研究|^一[、.．]\\s*研究|\\n一[、.．]\\s*文献综述|^一[、.．]\\s*文献综述|毕业设计开题报告)';
    const knownLeakPatterns = [
      new RegExp(`^开始输出[\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^用户要求我[\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^根据您的要求[\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^我需要[\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^让我根据[\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^让我开始[\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^现在开始[\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^以下是根据[\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^好的[,，][\\s\\S]*?${headingLookahead}`, 'i'),
      new RegExp(`^好的[,，]根据[\\s\\S]*?${headingLookahead}`, 'i'),
      // 匹配 AI 复述用户提示词中的指令清单（如"项目：xxx 技术栈：xxx 需要包含的内容：xxx 让我开始编写"）
      new RegExp(`^(?:项目[：:]|技术栈[：:]|需要包含的内容[：:]|输出规范[：:]|生成规范[：:]|必须包含[：:])[\\s\\S]{0,2000}?${headingLookahead}`, 'i'),
    ];

    let result = text.trim();
    for (const pattern of knownLeakPatterns) {
      if (pattern.test(result)) {
        result = result.replace(pattern, '').trim();
      }
    }

    if (format === 'markdown') {
      const firstHeading = result.search(/^## /m);
      if (firstHeading > 0) {
        result = result.slice(firstHeading).trim();
      }
    } else {
      result = this.stripGraduationReasoningLeak(result);
      result = this.stripLeadingLeakInsideDiv(result);

      const firstHtmlNode = result.search(/<h[2-6]\b|<div\b/i);
      if (firstHtmlNode > 0) {
        const afterHeadingContent = result.slice(firstHtmlNode);
        const precedingText = result.slice(0, firstHtmlNode).trim();
        if (precedingText.length > 0 && !precedingText.includes('>')) {
          result = afterHeadingContent;
        }
      }

      const firstChineseHeading = result.search(/^一[、.．]\s*研究的主要内容及基本要求/m);
      if (firstHtmlNode === -1 && firstChineseHeading > 0) {
        result = result.slice(firstChineseHeading).trim();
      }

      const firstProposalHeading = result.search(/^(.+毕业设计开题报告|一[、.．]\s*文献综述)/m);
      if (firstHtmlNode === -1 && firstChineseHeading === -1 && firstProposalHeading > 0) {
        result = result.slice(firstProposalHeading).trim();
      }
    }

    return result.trim();
  }

  private stripGraduationReasoningLeak(text: string): string {
    let result = text.trim();

    const finalAnswerMarkers = [
      /现在我来编写任务书的具体内容。[^\n]*(?:\n)+/i,
      /现在开始输出任务书正文。[^\n]*(?:\n)+/i,
      /现在开始生成\s*HTML\s*格式的任务书内容。[^\n]*(?:\n)+/i,
      /现在开始撰写开题报告[：:]?[^\n]*(?:\n)+/i,
      /现在开始生成\s*HTML\s*格式的开题报告内容。[^\n]*(?:\n)+/i,
      /以下为开题报告正文[：:。]?[^\n]*(?:\n)+/i,
      /以下为任务书正文[：:。]?[^\n]*(?:\n)+/i,
      /让我开始编写[：:]?[^\n]*(?:\n)+/i,
      /现在我来编写[：:]?[^\n]*(?:\n)+/i,
      /以下是我编写的[：:]?[^\n]*(?:\n)+/i,
      /我将开始编写[：:]?[^\n]*(?:\n)+/i,
      /我将为您编写[：:]?[^\n]*(?:\n)+/i,
      /让我根据[^\n]*来编写[^\n]*[：:]?[^\n]*(?:\n)+/i,
      /现在开始编写\s*HTML\s*格式的[^\n]*内容。[^\n]*(?:\n)+/i,
      /参考资料方向包括[^\n]*(?:\n)+/i,
      /现在开始编写开题报告内容。[^\n]*(?:\n)+/i,
      /现在开始编写任务书内容。[^\n]*(?:\n)+/i,
      /现在开始编写[^\n]*内容。[^\n]*(?:\n)+/i,
      /让我整理内容[。.]?[^\n]*(?:\n)+/i,
      /现在开始生成\s*HTML[^\n]*(?:\n)+/i,
      /直接输出正文[，,]?\s*[^\n]*(?:\n)+/i,
    ];

    for (const marker of finalAnswerMarkers) {
      const match = result.match(marker);
      if (match?.index !== undefined && this.hasSubstantialDocumentAfter(result, match.index + match[0].length)) {
        result = result.slice(match.index + match[0].length).trim();
      }
    }

    result = result
      .split('\n')
      .filter(line => !this.isLeakedGenerationLine(line))
      .join('\n')
      .trim();

    const firstExpectedHeading = result.search(/<h[2-6]\b|<div\b|^一[、.．]\s*研究的主要内容及基本要求|^.+毕业设计开题报告|^一[、.．]\s*文献综述/m);
    if (firstExpectedHeading > 0) {
      const precedingText = result.slice(0, firstExpectedHeading).trim();
      const looksLikeReasoning =
        /开始输出|让我根据|让我开始|让我整理|接下来需要|我需要|参考文档|PRD文档|前端技术文档|后端技术文档|选题数据|技术栈|功能模块|核心功能|现在我来|现在开始|提取关键信息|需要包含的内容|输出规范|生成规范|必须包含|让我开始编写|现在我来编写|以下是我编写的|标签\s*-|正文\s*\d+|汉字|行距|不要输出|不要复述|不要编造|参考资料方向|居中标题|居中副标题|基本信息行|中文题目|英文题目|进展情况|指导教师|整体适合|内联style|建议进展|禁止输出|禁止复述|禁止先列/.test(precedingText);
      if (looksLikeReasoning) {
        result = result.slice(firstExpectedHeading).trim();
      }
    }

    return result;
  }

  private isLeakedGenerationLine(line: string): boolean {
    const leakedLinePatterns = [
      /^\s*开始输出\s*$/i,
      /^\s*让我开始编写任务书内容[：:]?\s*$/i,
      /^\s*现在开始生成\s*HTML\s*格式的任务书内容。?\s*$/i,
      /^\s*现在开始撰写开题报告[：:]?\s*$/i,
      /^\s*现在开始生成\s*HTML\s*格式的开题报告内容。?\s*$/i,
      /^\s*PRD文档内容[：:]?\s*$/i,
      /^\s*前端技术文档[：:]?\s*$/i,
      /^\s*后端技术文档[：:]?\s*$/i,
      /^\s*选题数据[：:]?\s*$/i,
      /^\s*项目[：:]\s*$/i,
      /^\s*技术栈[：:]\s*$/i,
      /^\s*需要包含的内容[：:]?\s*$/i,
      /^\s*输出规范[：:]?\s*$/i,
      /^\s*生成规范[：:]?\s*$/i,
      /^\s*让我开始编写[：:]?\s*$/i,
      /^\s*现在我来编写[：:]?\s*$/i,
      /^\s*以下是我编写的[：:]?\s*$/i,
      /^\s*研究的主要内容及基本要求\s*$/i,
      /^\s*研究的主要工作内容\s*$/i,
      /^\s*基本技术要求\s*$/i,
      /^\s*预期成果形式\s*$/i,
      /^\s*主要参考资料\s*$/i,
      /^\s*文献综述\s*$/i,
      /^\s*主要内容\s*$/i,
      /^\s*详细提纲\s*$/i,
      /^\s*标签\s*-\s*正文\s*\d+.*汉字/i,
      /^\s*让我根据.*来编写.*[：:]?\s*$/i,
      /^\s*参考资料方向包括.*\s*$/i,
      /^\s*正文\s*\d+.*汉字/i,
      /^\s*使用\s*p\s*、\s*ol\s*、\s*li\s*标签/i,
      /^\s*行距约\s*\d/i,
      /^\s*不要输出任何说明.*\s*$/i,
      /^\s*不要复述输入材料标题.*\s*$/i,
      /^\s*不要编造参考资料.*\s*$/i,
      /^\s*研究的主要内容[：:]?\s*$/i,
      /^\s*基本技术要求[：:]?\s*$/i,
      /^\s*预期成果形式[：:]?\s*$/i,
      /^\s*标签闭合后.*$/i,
      /^\s*语言正式.*学术化.*$/i,
      /^\s*内容需结合.*$/i,
      /^\s*禁止输出.*关于自身任务描述.*$/i,
      /^\s*禁止复述.*输入材料.*$/i,
      /^\s*禁止先列出.*摘要.*提纲.*$/i,
      /^\s*内容结构要求[：:]?\s*$/i,
      /^\s*居中标题[：:]?\s*$/i,
      /^\s*篇幅与版式[：:]?\s*$/i,
      /^\s*正文总量.*汉字.*$/i,
      /^\s*使用.*标签.*行距.*$/i,
      /^\s*不包含.*XML.*$/i,
      /^\s*现在开始编写.*内容[。.]?\s*$/i,
      /^\s*\d+[、.．)）、]\s*居中标题/i,
      /^\s*\d+[、.．)）、]\s*居中副标题/i,
      /^\s*\d+[、.．)）、]\s*基本信息行/i,
      /^\s*\d+[、.．)）、]\s*(中文|英文)题目/i,
      /^\s*\d+[、.．)）、]\s*进展情况记录/i,
      /^\s*\d+[、.．)）、]\s*学生签名/i,
      /^\s*\d+[、.．)）、]\s*指导教师(意见|签名)/i,
      /^\s*整体适合.*Word.*一页/i,
      /^\s*用内联\s*style\s*控制/i,
      /^\s*建议进展要点/i,
      /^\s*让我整理内容/i,
      /^\s*接下来需要根据/i,
      /^\s*现在开始编写开题报告/i,
      /^\s*直接输出正文/i,
      /^\s*不要输出任何说明/i,
      /^\s*不包含.*DOCTYPE.*html.*body/i,
      /^\s*中文题目[、,，]?\s*英文题目[、,，]?\s*时间/i,
      /^\s*指导教师需要撰写/i,
    ];
    return leakedLinePatterns.some(pattern => pattern.test(line));
  }

  private hasSubstantialDocumentAfter(text: string, startIndex: number): boolean {
    const remaining = text.slice(startIndex).trim();
    if (remaining.length < 120) {
      return false;
    }

    return /<h[2-6]\b|<p\b|^一[、.．]\s*研究的主要内容及基本要求/m.test(remaining);
  }

  /**
   * Strip leaked instruction recitation that appears inside the opening <div> tag
   * but before the first real document heading (<h2>, <h3>, etc.).
   * This handles cases where the AI echoes the user's prompt instructions
   * (e.g. "项目：xxx", "技术栈：xxx", "需要包含的内容：xxx") inside the HTML body.
   */
  private stripLeadingLeakInsideDiv(text: string): string {
    const divMatch = text.match(/<div\b[^>]*class="graduation-[^"]*"[^>]*>/i);
    if (!divMatch || divMatch.index === undefined) {
      return text;
    }

    const divEnd = divMatch.index + divMatch[0].length;
    const afterDiv = text.slice(divEnd);

    const firstH2 = afterDiv.search(/<h[2-6]\b/i);
    if (firstH2 === -1) {
      return text;
    }

    const betweenDivAndH2 = afterDiv.slice(0, firstH2);
    const leakIndicators = [
      /^\s*(?:项目[：:]|技术栈[：:]|需要包含的内容[：:]|输出规范[：:]|生成规范[：:]|必须包含[：:]|让我开始编写|现在我来编写|以下是我编写的|让我根据|让我整理)/m,
      /\n\s*(?:项目[：:]|技术栈[：:]|需要包含的内容[：:]|输出规范[：:]|生成规范[：:]|必须包含[：:]|研究的主要内容[：:]|基本技术要求[：:]|预期成果形式[：:])/m,
      /标签\s*-\s*正文|正文\s*\d+.*汉字|行距约\s*\d|不要输出任何说明|不要复述输入材料|不要编造参考资料|参考资料方向包括/m,
      /研究的主要内容[：:]\s*\n\s*用户管理|研究的主要内容[：:]\s*\n\s*图书管理|研究的主要内容[：:]\s*\n\s*借阅管理/m,
      /标签闭合后|语言正式.*学术化|内容需结合|禁止输出.*关于自身任务描述|禁止复述.*输入材料|禁止先列出.*摘要/m,
      /内容结构要求|居中标题|篇幅与版式|正文总量.*汉字|使用.*标签.*行距|不包含.*XML/m,
      /现在开始编写.*内容[。.]?\s*$/m,
      /一[、.．]\s*文献综述|二[、.．]\s*主要内容|三[、.．]\s*详细提纲|四[、.．]\s*进度安排|五[、.．]\s*参考文献/m,
      /居中副标题|基本信息行|中文题目|英文题目|进展情况记录|指导教师(意见|签名)|整体适合|内联style|建议进展/m,
      /接下来需要根据|直接输出正文|不包含.*DOCTYPE|禁止.*输出.*说明.*过渡语/m,
    ];
    const hasLeakContent = leakIndicators.some(pattern => pattern.test(betweenDivAndH2));

    if (hasLeakContent) {
      const h2AbsolutePos = divEnd + firstH2;
      return text.slice(0, divEnd) + '\n' + text.slice(h2AbsolutePos).trimStart();
    }

    return text;
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
        max_tokens: 16384,
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
    signal?: AbortSignal
  ): Promise<{ content: string; usage: TokenUsage }> {
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
            if (parsed.usage) {
              apiReportedCompletionTokens = parsed.usage.completion_tokens ?? 0;
              apiReportedTotalTokens = parsed.usage.total_tokens ?? 0;
            }

            const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
            const estimatedTokens = estimateTokensFromText(contentText);
            const displayTokens = apiReportedTotalTokens > 0 ? apiReportedTotalTokens : estimatedTokens;
            const displayCompletion = apiReportedCompletionTokens > 0 ? apiReportedCompletionTokens : estimatedTokens;
            const promptTokens = displayTokens - displayCompletion;

            let displayContent = contentText;
            if (contentText.length - lastStreamCleanLength >= STREAM_CLEAN_INTERVAL || elapsedSeconds % 3 === 0) {
              displayContent = this.stripIncrementalStreamLeak(contentText);
              lastStreamCleanLength = contentText.length;
            } else {
              displayContent = this.stripIncrementalStreamLeak(contentText);
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

    onProgress({
      phase: 'finalizing',
      reasoningText: '正在定稿...',
      contentText: this.stripIncrementalStreamLeak(contentText),
      tokenCount: finalTokens,
      tokensPerSecond: elapsedSeconds > 0 ? Math.round(finalTokens / elapsedSeconds) : 0,
      elapsedSeconds
    });

    return {
      content: contentText,
      usage: {
        promptTokens: Math.max(0, finalPrompt),
        completionTokens: finalCompletion,
        totalTokens: finalTokens
      }
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

    const content = `<div style="font-family: SimSun, serif; line-height: 1.8; max-width: 800px; margin: 0 auto; padding: 40px; color: #333;">
<h2 style="text-align: center; font-size: 22px; font-weight: bold; margin-bottom: 30px;">${topicContext.title}</h2>
<h3 style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 40px;">${labels[docType]}</h3>
<p style="text-indent: 2em; margin-bottom: 16px;">（模拟数据）此文档为${labels[docType]}模板内容。请配置 MINIMAX_API_KEY 环境变量后生成正式文档。</p>
</div>`;

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

  /** Lightweight streaming leak cleanup — returns content unchanged if no leak detected. */
  private stripIncrementalStreamLeak(text: string): string {
    let result = text;

    const divMatch = result.match(/<div\b[^>]*class="graduation-[^"]*"[^>]*>/i);
    if (divMatch && divMatch.index !== undefined) {
      const beforeDiv = result.slice(0, divMatch.index).trim();
      if (beforeDiv.length > 0 && this.looksLikeReasoningLeak(beforeDiv)) {
        result = result.slice(divMatch.index);
      }
    }

    const graduationDivMatch = result.match(/<div\b[^>]*class="graduation-[^"]*"[^>]*>/i);
    if (graduationDivMatch && graduationDivMatch.index !== undefined) {
      const divEnd = graduationDivMatch.index + graduationDivMatch[0].length;
      const afterDiv = result.slice(divEnd);
      const firstContent = afterDiv.search(/<h[2-6]\b|<p\b|<table\b|<ol\b/i);
      if (firstContent > 0) {
        const between = afterDiv.slice(0, firstContent);
        if (this.looksLikeReasoningLeak(between)) {
          result = result.slice(0, divEnd) + '\n' + result.slice(divEnd + firstContent).trimStart();
        }
      }
    }

    if (!graduationDivMatch) {
      const headingLookahead = '(?=<h[2-6]\\b|<div\\b|<p\\b)';
      const preamblePatterns = [
        new RegExp(`^[\\s\\S]*?${headingLookahead}`, 'i'),
      ];
      for (const pattern of preamblePatterns) {
        const m = result.match(pattern);
        if (m && m.index !== undefined && m[0].length < result.length * 0.6) {
          const after = result.slice(m.index + m[0].length);
          if (after.length > 200) {
            const preamble = result.slice(0, m.index + m[0].length - m[0].length);
            if (this.looksLikeReasoningLeak(preamble)) {
              result = after;
            }
          }
        }
      }
    }

    result = result
      .split('\n')
      .filter(line => !this.isLeakedGenerationLine(line))
      .join('\n')
      .trim();

    return result;
  }

  private looksLikeReasoningLeak(text: string): boolean {
    const leakIndicators = [
      /居中标题|居中副标题|基本信息行|中文题目|英文题目|进展情况记录|指导教师签名|指导教师意见/,
      /整体适合|内联style|Word一页|不包含XML|DOCTYPE|html.*body标签/,
      /内容结构[：:]|篇幅与版式|正文总?量|使用.*标签|行距|不要输出/i,
    ];
    return leakIndicators.some(pattern => pattern.test(text));
  }
}

export const graduationService = new GraduationService();
