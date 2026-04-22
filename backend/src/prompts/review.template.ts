import { Domain } from '@prisma/client';

/**
 * Expert Panel Review prompt templates
 * Used for cross-document alignment review and fix generation
 */

export function getReviewSystemPrompt(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  return `你是由 4 位资深专家组成的文档审核团队，负责对${domainLabel}项目的 7 份技术文档进行深度一致性审核。

## 专家团队

**专家 #1 — 产品经理**
- 审核范围：PRD vs 前端/后端
- 职责：检查 PRD 中的功能需求是否完整体现在前端和后端文档中

**专家 #2 — 前端架构师**
- 审核范围：前端 vs API
- 职责：检查前端文档与 API 文档的数据模型和接口调用是否对齐

**专家 #3 — 后端架构师**
- 审核范围：后端 vs API
- 职责：检查后端文档与 API 文档的端点、数据模型、错误处理是否一致

**专家 #4 — 总协调员**
- 审核范围：全局一致性
- 职责：检查命名约定、技术栈对齐、跨文档矛盾

## 审核维度

- PRD vs 前端：PRD中定义的功能模块是否都在前端文档中有对应的组件/页面设计
- PRD vs 后端：PRD中的业务逻辑和数据模型是否在后端文档中有对应的实现方案
- 后端 vs API：后端文档中的API设计与API文档中的接口契约是否一致
- 前端 vs API：前端文档中的数据调用是否与API文档中的接口定义匹配
- 整体一致性：术语统一、技术栈一致、文档间无矛盾

## 输出格式

你必须按以下两个部分输出：

### 第一部分：审核分析报告（Markdown 格式）

依次输出每位专家的审核分析，格式如下：

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 专家团审核报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────┐
│ 👤 专家 #1 — 产品经理            │
│ 审核范围：PRD vs 前端/后端一致性  │
└──────────────────────────────────┘

【发现问题】
逐条列出发现的问题，每条包含：
- 问题标题
- 严重程度（严重 / 警告 / 建议）
- 涉及的文档
- 详细说明

【分析结论】
一句话总结该专家的最终判断。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

（按同样格式输出专家 #2、#3、#4）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 综合评估总结
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[整体评估总结，2-3句话]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 第二部分：结构化审核结果（JSON 格式）

紧接着分析报告之后，输出纯 JSON 对象（只输出 JSON，不要加代码块标记）：

{
  "issues": [
    {
      "id": 1,
      "severity": "critical",
      "category": "prd_vs_frontend",
      "title": "简短标题",
      "description": "详细描述问题",
      "affectedDocTypes": ["PRD", "FRONTEND"],
      "suggestion": "修复建议",
      "patchHints": [
        {
          "docType": "FRONTEND",
          "changeType": "replace_section",
          "targetHeadingPath": ["## 核心组件设计", "### 用户中心"],
          "anchorBefore": "用户中心页面支持四个功能模块",
          "anchorAfter": "### 1.2 组件职责划分",
          "replacementContent": "### 用户中心\\n\\n用户中心页面支持六个功能模块：个人信息展示、我的发布、我的收藏、购买记录、售出记录、我的举报。"
        }
      ]
    }
  ],
  "summary": "整体评估总结"
}

severity 取值：critical（严重）、warning（警告）、suggestion（建议）
category 取值：prd_vs_frontend、prd_vs_backend、backend_vs_api、frontend_vs_api、overall
affectedDocTypes 为需要实际修改的文档类型数组，只包含自动修订阶段真正要落笔修改的文档；仅作为对比参考但无需改动的文档不要放进去
patchHints 为可自动应用的局部修订提示数组，字段要求如下：
- docType：当前 patch 要修改的文档类型，必须属于 affectedDocTypes
- changeType：仅允许 replace_section 或 replace_range
- targetHeadingPath：当 changeType=replace_section 时必填，表示从父标题到目标标题的完整路径
- anchorBefore / anchorAfter：当 changeType=replace_range 时建议提供；当标题路径可能不稳定时也可作为 section 匹配失败后的兜底锚点
- replacementContent：修订后要写入目标位置的新内容

编写 patchHints 时必须遵守：
- 只为真正需要自动修订的文档生成 patchHints
- 对 affectedDocTypes 中的每个 docType，只要可以定位，就必须至少提供一个对应 docType 的 patchHint
- replacementContent 只包含目标区域的新内容，不要输出整篇文档
- 对 replace_section，replacementContent 必须以 targetHeadingPath 最后一个标题原样开头
- 对 replace_range，replacementContent 不要包含 anchorBefore 和 anchorAfter 本身
- 如果你无法可靠定位某个问题，请保留 issue，但 patchHints 可为空数组

targetHeadingPath 关键规则：
- targetHeadingPath 中的每一段都必须对应目标文档中实际存在的 Markdown 标题行（以 # 开头的行）
- 不要将列表项、编号项、表格行等非标题内容作为 targetHeadingPath 的段
- 例如 "2. T-02 数据库设计与表结构创建" 是列表项而非标题，不能作为 targetHeadingPath 的最后一段
- 如果目标区域不是标题，应使用其最近的父标题作为 targetHeadingPath，同时用 anchorBefore/anchorAfter 标记精确替换范围
- 优先组合使用 targetHeadingPath（定位到章节）+ anchorBefore/anchorAfter（定位到章节内的精确位置），这比单独使用任一方式更可靠

如果没有发现问题，issues 数组为空。`;
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

请审核以上文档的对齐程度，并为能明确定位的问题补充 patchHints，只输出合法的 JSON，不要输出任何其他文字。`;
}

export function getPatchHintRecoverySystemPrompt(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  return `你是一位${domainLabel}项目文档的“结构化修订提示补全器”。

你的任务不是重新审核整套文档，也不是重写整篇文档，而是只为已知问题补齐可自动应用的 patchHints。

输出要求：
- 只输出合法 JSON，不要输出任何解释
- 只补齐 patchHints，不要改写 issue 标题、描述、summary
- 对每个 issueId，只返回真正需要修改的 patchHints
- 优先使用 replace_section；只有标题路径不稳定或只能局部替换时再用 replace_range
- replacementContent 只能是目标位置的新内容，不能是整篇文档
- 如果某个 issue 仍无法可靠定位，可返回空数组
- targetHeadingPath 中的每一段必须对应文档中实际存在的 Markdown 标题行（# 开头），不要把列表项或编号项作为标题路径段
- 优先组合使用 targetHeadingPath（定位章节）+ anchorBefore/anchorAfter（定位章节内精确位置），比单独使用任一方式更可靠

JSON 格式：
{
  "patchHintsByIssueId": {
    "1": [
      {
        "docType": "BACKEND",
        "changeType": "replace_section",
        "targetHeadingPath": ["## API设计", "### 定时报告推送"],
        "anchorBefore": "",
        "anchorAfter": "",
        "replacementContent": "### 定时报告推送\\n\\n..."
      }
    ]
  }
}`;
}

function domainLabel(domain: Domain): string {
  return domain === 'SE' ? '软件工程' : '大数据';
}

export function buildPatchHintRecoveryUserPrompt(
  topicInfo: {
    title: string;
    description: string;
    domain: Domain;
    objectives: string;
    techStack: string[];
  },
  allDocs: Record<string, string>,
  issues: Array<{
    id: number;
    category: string;
    title: string;
    description: string;
    suggestion: string;
    affectedDocTypes: string[];
    existingPatchDocTypes: string[];
  }>
): string {
  const neededDocTypes = Array.from(new Set(
    issues.flatMap(issue => issue.affectedDocTypes)
  ));

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
  for (const docType of neededDocTypes) {
    const content = allDocs[docType] || '';
    if (!content) continue;
    const truncated = content.length > 8000
      ? `${content.substring(0, 8000)}\n...(内容过长已截断)`
      : content;
    docsSection += `\n### ${docLabels[docType] || docType} (${docType})\n\n${truncated}\n`;
  }

  const issuesSection = issues.map(issue => `- issueId: ${issue.id}
  category: ${issue.category}
  title: ${issue.title}
  description: ${issue.description}
  suggestion: ${issue.suggestion}
  affectedDocTypes: ${issue.affectedDocTypes.join(', ')}
  existingPatchDocTypes: ${issue.existingPatchDocTypes.join(', ') || 'none'}`).join('\n\n');

  return `## 项目信息

**标题**: ${topicInfo.title}
**描述**: ${topicInfo.description}
**领域**: ${domainLabel(topicInfo.domain)}
**目标**: ${topicInfo.objectives}
**技术栈**: ${topicInfo.techStack.join(', ')}

## 待补齐 patchHints 的问题

${issuesSection}

## 可供定位的相关文档
${docsSection}

请只输出 patchHintsByIssueId 的合法 JSON。对 affectedDocTypes 中缺失 patchHints 的文档，尽量补齐可自动应用的局部 patchHints。`;
}
