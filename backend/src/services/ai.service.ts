import { DocType, Domain } from '@prisma/client';
import crypto from 'crypto';
import { getPRDPromptTemplate } from '../prompts/prd.template.js';
import { getFrontendPromptTemplate } from '../prompts/frontend.template.js';
import { getBackendPromptTemplate } from '../prompts/backend.template.js';
import { getAPIPromptTemplate } from '../prompts/api.template.js';
import { getTaskPromptTemplate } from '../prompts/task.template.js';
import { getContextStatePromptTemplate } from '../prompts/context_state.template.js';
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

interface PendingRequest {
  promise: Promise<string>;
  timestamp: number;
}

interface CachedResult {
  content: string;
  timestamp: number;
}

class AIService {
  // Request deduplication map: cacheKey -> pending promise
  private pendingRequests = new Map<string, PendingRequest>();

  // Result cache: cacheKey -> { content, timestamp }
  private resultCache = new Map<string, CachedResult>();

  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly REQUEST_TIMEOUT = 120_000; // 120 seconds (2 minutes) timeout

  /**
   * Generate cache key from docType and topic info
   */
  private generateCacheKey(docType: DocType, topicInfo: TopicInfo): string {
    const payload = `${docType}:${topicInfo.title}:${topicInfo.domain}`;
    return crypto.createHash('md5').update(payload).digest('hex');
  }

  private getConfig() {
    if (!process.env.MINIMAX_API_KEY) {
      throw new Error('MINIMAX_API_KEY not configured');
    }

    return {
      baseURL: process.env.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1',
      apiKey: process.env.MINIMAX_API_KEY,
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
    topicInfo: TopicInfo
  ): Promise<string> {
    const config = this.getConfig();

    // Mock mode for development/testing when API is unavailable
    if (config.mockMode) {
      console.log('[AI Mock] Generating mock document for', docType);
      return this.generateMockDocument(docType, topicInfo);
    }

    const cacheKey = this.generateCacheKey(docType, topicInfo);

    // 1. Check result cache
    const cached = this.resultCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      console.log('[AI Cache] Hit for', cacheKey);
      return cached.content;
    }

    // 2. Check pending request (deduplication)
    const pending = this.pendingRequests.get(cacheKey);
    if (pending && Date.now() - pending.timestamp < 60_000) {
      console.log('[AI Dedup] Reusing pending request for', cacheKey);
      return pending.promise;
    }

    // 3. Execute new request
    const systemPrompt = this.getSystemPrompt(docType, topicInfo.domain);
    const userPrompt = this.buildUserPrompt(docType, topicInfo);
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const requestPromise = this.executeWithRetry(messages);

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

  /**
   * Execute AI request with retry logic
   */
  private async executeWithRetry(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
  ): Promise<string> {
    const { baseURL, apiKey } = this.getConfig();
    const contentParts: string[] = [];
    const maxAttempts = 3; // Reduced from 5 to 3

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      try {
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
      } catch (error) {
        if (attempt === maxAttempts - 1) throw error;
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    return this.cleanGeneratedContent(contentParts.join('\n'));
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
        temperature: 0.7,
        max_tokens: 16384, // Max output tokens for minimax-m2-7
      }),
      signal: AbortSignal.timeout(this.REQUEST_TIMEOUT), // 120 seconds timeout
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
}

export const aiService = new AIService();
export default AIService;
