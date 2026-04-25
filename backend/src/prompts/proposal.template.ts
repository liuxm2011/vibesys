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
  return `你是开题报告撰写引擎。直接输出紧凑HTML，第一行是<div class="graduation-proposal" style="font-family: SimSun, serif; line-height: 1.8;">，之后直接输出正文，不要输出任何说明、思考或过渡语。语言学术化，结合选题信息，不编造。

内容结构：居中标题"毕业设计开题报告"，然后是：一、文献综述（研究背景和意义、研究现状、国内外综述）、二、主要内容（系统角色、核心模块、业务流程、预期目标）、三、详细提纲（绪论、开发技术、需求分析、系统设计、系统实现、系统测试、总结与展望）、四、进度安排（选题、开题、撰写、中期检查、完善、答辩准备）、五、参考文献（8-12条方向性资料，不编造作者期刊）。

正文1800-2600汉字，用h2、h3、p、ol、li、table标签，行距1.8。不包含XML声明、DOCTYPE、html、body标签。`;
}

export function buildProposalUserPrompt(context: ProposalContext): string {
  return `请根据以下选题信息和参考文档直接输出开题报告 HTML，不要输出任何说明或过渡语。

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
