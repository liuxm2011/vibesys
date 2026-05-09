import { GraduationDocType } from '@prisma/client';

export interface ProgressRecordContext {
  docType: GraduationDocType;
  title: string;
  description: string;
  objectives: string;
  platform: string;
  techStack: string[];
  studentId: string;
  studentName: string;
  major: string;
  className: string;
  grade: string;
  prdContent: string;
  frontendContent: string;
  backendContent: string;
  taskBookContent: string;
  proposalContent: string;
}

interface StageSpec {
  stageTitle: string;
  dateText: string;
  focus: string;
  progressItems: string[];
  teacherOpinionFocus: string;
}

const STAGE_SPECS: Partial<Record<GraduationDocType, StageSpec>> = {
  PREPARATION: {
    stageTitle: '前期准备阶段',
    dateText: '自开题报告完成后至撰写阶段开始前',
    focus: '围绕选题资料调研、需求梳理、方案确认、开发环境准备展开。',
    progressItems: [
      '查阅与选题相关的文献、同类系统资料和技术资料，明确系统建设背景与实际需求。',
      '结合任务书和开题报告，梳理系统功能模块、用户角色、业务流程和非功能性要求。',
      '完成技术路线确认，初步确定前端、后端、数据库及接口设计方案。',
      '准备开发工具、运行环境和项目管理方式，为后续编码与说明书撰写奠定基础。'
    ],
    teacherOpinionFocus: '资料查阅充分，需求分析和技术准备较扎实，能够按计划进入后续设计与实现。'
  },
  DRAFTING: {
    stageTitle: '撰写阶段',
    dateText: '自撰写阶段开始至中期检查前',
    focus: '围绕概要设计、详细设计、核心功能编码和毕业设计说明书初稿展开。',
    progressItems: [
      '根据需求分析结果，完成系统概要设计和详细设计，明确主要模块边界与数据流转关系。',
      '推进数据库表结构、接口契约、前后端页面和核心业务逻辑的设计与实现。',
      '按照项目计划开展编码工作，并同步进行功能自测，及时修复开发中发现的问题。',
      '开始撰写毕业设计说明书，完成绪论、需求分析、系统设计等主要章节初稿。'
    ],
    teacherOpinionFocus: '系统设计思路清晰，核心开发工作有序推进，说明书撰写能与开发过程同步开展。'
  },
  MIDTERM_CHECK: {
    stageTitle: '中期检查阶段',
    dateText: '自中期检查开始至完善阶段前',
    focus: '围绕阶段成果核查、核心功能完成度、测试修复和中期材料提交展开。',
    progressItems: [
      '对照开题报告和任务书检查需求完成情况，确认系统主要功能模块的实现进度。',
      '完成大部分核心业务功能开发，开展接口联调、页面联调和关键流程测试。',
      '检查代码质量、数据库设计和说明书撰写进度，整理阶段性成果与存在问题。',
      '根据中期检查要求提交相关材料，并结合指导教师意见调整后续开发与写作安排。'
    ],
    teacherOpinionFocus: '阶段目标完成情况较好，能够主动提交中期材料并根据反馈改进系统和说明书。'
  },
  REFINEMENT: {
    stageTitle: '完善阶段',
    dateText: '自完善阶段开始至毕业设计定稿前',
    focus: '围绕功能完善、系统测试、说明书定稿、材料归档和答辩准备展开。',
    progressItems: [
      '根据指导教师建议完善系统功能，补充异常处理、数据校验和界面细节。',
      '完成系统整体测试和问题修复，提高系统稳定性、可用性和数据完整性。',
      '完善毕业设计说明书内容，规范章节结构、图表、参考文献和格式要求。',
      '整理源码、数据库文件和过程材料，准备查重、归档、打印装订及答辩展示材料。'
    ],
    teacherOpinionFocus: '能够根据反馈持续完善系统与文档，材料整理较完整，具备进入定稿和答辩准备的条件。'
  }
};

export function getProgressRecordSystemPrompt(): string {
  return `你是一位高校指导教师，负责产出可直接交付的中文 Markdown 毕业设计进展情况记录。

输出约束：
- 只输出最终 Markdown 文档
- 第一行必须以 "# " 开头作为一级标题
- 不要输出思考过程、解释、备注、前言或后记
- 不要复述、罗列或解释本提示词中的任何格式要求或内容结构
- 不要输出"让我开始"、"以下为"、"现在输出"、"现在开始"、"接下来需要"等过渡语
- 不要输出格式规范的元描述（如"居中标题"、"正文数字"、"适合 Word 一页"等）
- 不要包含 HTML 标签、XML 声明或 <think> 标签
- 全文只允许出现一个一级标题（# ）

文档结构：
# 萍乡学院本科生毕业设计进展情况记录

## 阶段名称：{阶段标题}

| 项目 | 内容 |
|------|------|
| 学号 | xxx |
| 姓名 | xxx |
| 专业班级 | xxx |
| 中文题目 | xxx |
| 英文题目 | xxx |
| 时间 | xxx |

## 进展情况记录

1. 第一条进展要点（35-55 字）
2. 第二条进展要点
3. 第三条进展要点
4. 第四条进展要点
5. （可选）第五条进展要点
6. （可选）第六条进展要点

**学生签名：**________________

## 指导教师意见

（一段 120-180 字的指导教师点评，口吻为指导老师。要求：评价阶段进展、指出优点与不足、给出后续建议。）

**指导教师签名：**________________

要求：进展要点 4-6 条，每条 35-55 字；指导教师意见 120-180 字，语言为指导老师口吻。`;
}

export function buildProgressRecordUserPrompt(context: ProgressRecordContext): string {
  const spec = STAGE_SPECS[context.docType];
  if (!spec) {
    throw new Error(`Unsupported progress record doc type: ${context.docType}`);
  }

  const classText = [context.major, context.className].filter(Boolean).join(' ');
  const techStackText = context.techStack.length > 0 ? context.techStack.join('、') : '按项目技术方案确定';

  return `请根据以下信息直接输出毕业设计进展情况记录的 Markdown 内容。第一行必须是 "# 萍乡学院本科生毕业设计进展情况记录"。禁止任何分析过程、格式说明或过渡语。

[学生与选题信息]
学生学号：${context.studentId || '（留空）'}
学生姓名：${context.studentName || '（留空）'}
专业班级：${classText || context.major || context.className || '（留空）'}
年级：${context.grade || '（留空）'}
中文题目：${context.title}
英文题目：请根据中文题目生成简洁、准确的英文标题
运行平台：${context.platform}
技术栈：${techStackText}
选题描述：${context.description}
研究目标：${context.objectives}

[已生成文档摘要参考]
任务书：${truncate(context.taskBookContent, 1200)}
开题报告：${truncate(context.proposalContent, 1600)}
PRD：${truncate(context.prdContent, 1200)}
前端技术文档：${truncate(context.frontendContent, 800)}
后端技术文档：${truncate(context.backendContent, 800)}

[本次生成阶段]
阶段标题：${spec.stageTitle}
时间：${spec.dateText}
阶段重点：${spec.focus}
建议进展要点：
${spec.progressItems.map((item, index) => `${index + 1}. ${item}`).join('\n')}
指导教师意见重点：${spec.teacherOpinionFocus}`;
}

function truncate(content: string, maxLength: number): string {
  const trimmed = content?.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || '';
  if (!trimmed) {
    return '（暂无）';
  }
  return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength)}...` : trimmed;
}
