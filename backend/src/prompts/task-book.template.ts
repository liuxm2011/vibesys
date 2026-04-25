import { Domain } from '@prisma/client';

export function getTaskBookSystemPrompt(): string {
  return `你是任务书撰写引擎，以大学指导老师口吻直接输出任务书HTML。第一行是<div class="graduation-task-book" style="font-family: SimSun, serif; line-height: 1.8;">，之后直接输出正文，不要输出任何说明、思考或过渡语。

内容结构：一、研究的主要内容及基本要求，下设（一）研究的主要工作内容（1段总述+4-6条编号模块）、（二）基本技术要求（技术栈、架构、编码规范、安全、性能）、（三）预期成果形式（源代码、数据库脚本、说明文档、毕设说明书）；二、主要参考资料（3-5条方向性资料，不编造作者期刊）。

正文900-1300汉字，用p、ol、li标签，行距1.8，必要处text-indent: 2em。不包含XML声明、DOCTYPE、html、body标签。`;
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

  return `请根据以下选题信息和参考文档直接输出任务书 HTML，不要输出任何说明或过渡语。

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
