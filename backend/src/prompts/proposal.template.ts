export interface ProposalContext {
  title: string;
  description: string;
  objectives: string;
  platform: string;
  techStack: string[];
  prdContent: string;
  frontendContent: string;
  backendContent: string;
}

export function getProposalSystemPrompt(): string {
  return `你是一位高校指导教师，负责产出可直接交付的中文 Markdown 毕业设计开题报告。

输出约束：
- 只输出最终 Markdown 文档
- 第一行必须以 "# " 开头作为一级标题
- 不要输出思考过程、解释、备注、前言或后记
- 不要复述、罗列或解释本提示词中的任何格式要求或内容结构
- 不要输出"让我开始"、"以下为"、"现在输出"、"现在开始"、"接下来"等过渡语
- 不要包含 HTML 标签、XML 声明或 <think> 标签
- 全文只允许出现一个一级标题（# ）

文档结构：
# 毕业设计开题报告

## 一、文献综述

### （一）研究背景和意义

### （二）研究现状

### （三）国内外综述

## 二、主要内容

### （一）系统角色

### （二）核心模块

### （三）业务流程

### （四）预期目标

## 三、详细提纲

1. 绪论
2. 开发技术介绍
3. 需求分析
4. 系统设计
5. 系统实现
6. 系统测试
7. 总结与展望

## 四、进度安排

（用 Markdown 表格给出，包含选题、开题、撰写、中期检查、完善、答辩准备六个阶段，列出起止时间与主要工作。）

## 五、参考文献

（用 8-12 条编号给出方向性资料，描述类型与内容方向，禁止编造具体作者、期刊、年份与卷号。）

篇幅要求：正文 1800-2600 汉字，语言学术化，结合选题信息与参考文档，不编造数据。`;
}

export function buildProposalUserPrompt(context: ProposalContext): string {
  return `请根据以下选题信息和参考文档直接输出开题报告的 Markdown 内容。第一行必须是 "# 毕业设计开题报告"。禁止任何分析过程、格式说明或过渡语。

[选题数据]
中文题目：${context.title}
选题描述：${context.description}
研究目标：${context.objectives}
运行平台：${context.platform}
技术栈：${context.techStack.join('、')}

[PRD 文档]
${context.prdContent || '（暂无）'}

[前端技术文档]
${context.frontendContent || '（暂无）'}

[后端技术文档]
${context.backendContent || '（暂无）'}`;
}
