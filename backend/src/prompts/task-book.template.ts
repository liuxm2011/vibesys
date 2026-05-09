import { Domain } from '@prisma/client';

export function getTaskBookSystemPrompt(): string {
  return `你是一位高校指导教师，负责产出可直接交付的中文 Markdown 任务书。

输出约束：
- 只输出最终 Markdown 文档
- 第一行必须以 "# " 开头作为一级标题
- 不要输出思考过程、解释、备注、前言或后记
- 不要复述、罗列或解释本提示词中的任何格式要求或内容结构
- 不要输出"让我开始"、"以下为"、"现在输出"、"现在开始"、"接下来"等过渡语
- 不要包含 HTML 标签、XML 声明或 <think> 标签
- 全文只允许出现一个一级标题（# ）

文档结构：
# 任务书

## 一、研究的主要内容及基本要求

### （一）研究的主要工作内容

（用 1 段 100-180 字总述系统目标与核心价值，再用 4-6 条编号列表给出主要功能模块，每条 30-60 字。）

### （二）基本技术要求

（用 3-6 条要点列出技术栈、架构、编码规范、安全、性能等要求。）

### （三）预期成果形式

1. 系统源代码
2. 数据库脚本与设计说明
3. 接口与部署说明文档
4. 毕业设计说明书

## 二、主要参考资料

（用 3-5 条编号给出方向性资料，描述类型与可参考方向，禁止编造具体作者、期刊、年份与卷号。）

篇幅要求：正文 900-1300 汉字，语言为大学指导教师口吻，结合选题与参考文档，不编造数据。`;
}

export function buildTaskBookUserPrompt(params: {
  title: string;
  description: string;
  objectives: string;
  platform: string;
  techStack: string[];
  prdContent: string;
  frontendContent: string;
  backendContent: string;
}): string {
  const platformLabels: Record<string, string> = {
    WEB: 'Web应用（浏览器访问）',
    IOS: 'iOS原生应用',
    ANDROID: 'Android原生应用',
    WECHAT_MINI: '微信小程序',
    WINDOWS_DESKTOP: 'Windows桌面端',
    MAC_DESKTOP: 'Mac桌面端'
  };
  const platformLabel = platformLabels[params.platform] ?? params.platform;

  const truncatedContent = (label: string, content: string, maxLen: number): string => {
    if (!content || content.trim().length === 0) {
      return `${label}文档尚未生成，请根据选题信息自行判断。`;
    }
    if (content.length > maxLen) {
      return content.substring(0, maxLen) + '\n...(内容过长已截断)';
    }
    return content;
  };

  return `请根据以下选题信息和参考文档直接输出任务书的 Markdown 内容。第一行必须是 "# 任务书"。禁止任何前置说明或过渡语。

[项目基本情况]
选题标题：${params.title}
选题描述：${params.description}
项目目标：${params.objectives}
运行平台：${platformLabel}
推荐技术栈：${params.techStack.join(', ')}

[参考文档 - PRD]
${truncatedContent('PRD', params.prdContent, 4000)}

[参考文档 - 前端]
${truncatedContent('前端', params.frontendContent, 3000)}

[参考文档 - 后端]
${truncatedContent('后端', params.backendContent, 3000)}`;
}
