import { Domain } from '@prisma/client';

/**
 * Expert Panel Review prompt templates
 * Used for cross-document alignment review and fix generation
 */

export function getReviewSystemPrompt(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  return `你是一位由4位专家组成的文档审核团队，负责对${domainLabel}项目的7份技术文档进行一致性审核。

四位专家分别是：
1. **产品经理**：检查PRD中的功能需求是否完整体现在前端和后端文档中
2. **前端架构师**：检查前端文档与API文档的数据模型和接口调用是否对齐
3. **后端架构师**：检查后端文档与API文档的端点、数据模型、错误处理是否一致
4. **总协调员**：检查全局一致性，包括命名约定、技术栈对齐、跨文档矛盾

## 审核维度

- PRD vs 前端：PRD中定义的功能模块是否都在前端文档中有对应的组件/页面设计
- PRD vs 后端：PRD中的业务逻辑和数据模型是否在后端文档中有对应的实现方案
- 后端 vs API：后端文档中的API设计与API文档中的接口契约是否一致
- 前端 vs API：前端文档中的数据调用是否与API文档中的接口定义匹配
- 整体一致性：术语统一、技术栈一致、文档间无矛盾

## 输出格式

只输出合法的 JSON，不要输出任何其他文字。JSON 结构如下：

{
  "issues": [
    {
      "id": 1,
      "severity": "critical",
      "category": "prd_vs_frontend",
      "title": "简短标题",
      "description": "详细描述问题",
      "affectedDocTypes": ["PRD", "FRONTEND"],
      "suggestion": "修复建议"
    }
  ],
  "summary": "整体评估总结"
}

severity 取值：critical（严重）、warning（警告）、suggestion（建议）
category 取值：prd_vs_frontend、prd_vs_backend、backend_vs_api、frontend_vs_api、overall
affectedDocTypes 为受影响的文档类型数组
如果没有发现问题，issues 数组为空。`;
}

export function getReviewFixSystemPrompt(): string {
  return `你是一位严谨的技术文档修订助手，负责根据审核意见对现有 Markdown 文档做局部修改。

你的任务是输出“局部修订方案”，而不是重写整篇文档。

输出规则：
- 只输出合法 JSON
- 不要输出 Markdown 解释、分析过程、代码块标记或额外文字
- 只返回确实需要修改的章节
- 每个章节必须对应原文中已存在的标题
- 不允许返回整篇文档

JSON 结构如下：
{
  "summary": "本次局部修订摘要",
  "patches": [
    {
      "targetHeading": "## 需要替换的原始标题",
      "updatedSection": "## 需要替换的原始标题\\n\\n这里是替换后的完整章节内容"
    }
  ]
}

字段说明：
- summary: 本次修订摘要
- patches: 需要替换的章节数组
- targetHeading: 原文中必须精确存在的标题行
- updatedSection: 替换后的完整章节内容，必须以 targetHeading 原样开头

如果该文档无需修改，请返回：
{
  "summary": "该文档无需修改",
  "patches": []
}`;
}

export function buildReviewUserPrompt(
  topicInfo: {
    title: string;
    description: string;
    domain: Domain;
    objectives: string;
    techStack: string[];
  },
  allDocs: Record<string, string>
): string {
  const docOrder = ['PRD', 'FRONTEND', 'BACKEND', 'API', 'TASK', 'CONTEXT_STATE', 'AGENTS'];
  const docLabels: Record<string, string> = {
    PRD: '产品需求文档',
    FRONTEND: '前端技术文档',
    BACKEND: '后端技术文档',
    API: 'API 接口契约文档',
    TASK: '开发任务清单',
    CONTEXT_STATE: '项目状态追踪文档',
    AGENTS: 'AI 编码规则文档'
  };

  let docsSection = '';
  for (const docType of docOrder) {
    const content = allDocs[docType] || '';
    if (!content) continue;
    const truncated = content.length > 3000
      ? content.substring(0, 3000) + '\n...(内容过长已截断)'
      : content;
    docsSection += `\n### ${docLabels[docType]} (${docType})\n\n${truncated}\n`;
  }

  return `## 项目信息

**标题**: ${topicInfo.title}
**描述**: ${topicInfo.description}
**领域**: ${domainLabel(topicInfo.domain)}
**目标**: ${topicInfo.objectives}
**技术栈**: ${topicInfo.techStack.join(', ')}

## 待审核文档${docsSection}

请审核以上文档的对齐程度，只输出合法的 JSON，不要输出任何其他文字。`;
}

export function getReviewFixUserPrompt(
  findings: string,
  docType: string,
  docLabel: string,
  fullContent: string
): string {
  return `以下是针对项目文档的专家审核结果（仅包含与当前文档相关的问题）：

${findings}

## 需要修改的文档

你需要修改的是 **${docLabel} (${docType})**。

以下是该文档的完整原文：

${fullContent}

## 任务

请根据审核结果中的相关建议，输出“局部章节修订方案 JSON”。

注意：
- 只修改与审核问题直接相关的章节
- 不要重写整篇文档
- 不要新增原文中不存在的章节标题作为替换目标
- targetHeading 必须与原文中的标题行完全一致
- updatedSection 必须从对应标题开始，包含该标题下完整且修订后的章节内容
- 如果某条建议无法定位到明确章节，请不要臆造整篇内容；优先选择最直接受影响的现有章节
- 如果审核结果中没有针对此文档的问题，请返回空 patches`;
}

function domainLabel(domain: Domain): string {
  return domain === 'SE' ? '软件工程' : '大数据';
}
