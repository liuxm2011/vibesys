import { DocType, Domain } from '@prisma/client';
import { getPRDPromptTemplate } from '../prompts/prd.template.js';
import { getFrontendPromptTemplate } from '../prompts/frontend.template.js';
import { getBackendPromptTemplate } from '../prompts/backend.template.js';

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
}

interface ChatCompletionResponse {
  choices?: Array<{
    finish_reason?: string | null;
    message?: {
      content?: string;
    };
  }>;
}

class AIService {
  private getConfig() {
    if (!process.env.MINIMAX_API_KEY) {
      throw new Error('MINIMAX_API_KEY not configured');
    }

    return {
      baseURL: process.env.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1',
      apiKey: process.env.MINIMAX_API_KEY,
    };
  }

  /**
   * Generate document content via MiniMax API
   * DOC-04: AI content generation
   * D-08/09: Domain-specific templates
   */
  async generateDocument(
    docType: DocType,
    topicInfo: TopicInfo
  ): Promise<string> {
    const systemPrompt = this.getSystemPrompt(docType, topicInfo.domain);
    const userPrompt = this.buildUserPrompt(docType, topicInfo);
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];
    const contentParts: string[] = [];

    try {
      const { baseURL, apiKey } = this.getConfig();
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const data = await this.requestCompletion(baseURL, apiKey, messages);
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
      }

      return this.cleanGeneratedContent(contentParts.join('\n'));
    } catch (error) {
      console.error('AI generation error:', error);
      if (error instanceof Error && error.name === 'TimeoutError') {
        throw new Error('timeout');
      }
      throw new Error('文档生成失败，请稍后重试');
    }
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
      default:
        return '请生成结构化的技术文档。';
    }
  }

  /**
   * Build user prompt with topic info
   */
  private buildUserPrompt(docType: DocType, topicInfo: TopicInfo): string {
    return `
请根据以下选题信息生成${docType === 'PRD' ? '产品需求文档' : docType === 'FRONTEND' ? '前端技术文档' : '后端技术文档'}，直接输出最终 Markdown 文档，不要输出分析过程、思考说明、前言或“我将为你生成”等多余内容。

**选题标题**: ${topicInfo.title}
**选题描述**: ${topicInfo.description}
**领域**: ${topicInfo.domain === 'SE' ? '软件工程' : '大数据'}
**项目目标**: ${topicInfo.objectives}
**推荐技术栈**: ${topicInfo.techStack.join(', ')}

文档必须一次性尽可能完整输出；如果内容较长，也必须优先保证结构完整、章节完整、结尾完整。
`;
  }

  private async requestCompletion(
    baseURL: string,
    apiKey: string,
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  ): Promise<ChatCompletionResponse> {
    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'minimax-m2-7',
        messages,
        temperature: 0.4,
        max_tokens: 10000,
      }),
      signal: AbortSignal.timeout(180_000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MiniMax API request failed: ${response.status} ${errorText}`);
    }

    return response.json() as Promise<ChatCompletionResponse>;
  }

  private cleanGeneratedContent(content: string): string {
    const trimmed = content.trim();
    const firstHeadingIndex = trimmed.search(/^#\s+/m);

    if (firstHeadingIndex > 0) {
      return trimmed.slice(firstHeadingIndex).trim();
    }

    return trimmed;
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
}

export const aiService = new AIService();
export default AIService;
