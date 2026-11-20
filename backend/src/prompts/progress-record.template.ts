import type { GraduationStage } from '../services/graduation-handbook.js';

export const STAGE_FOCUS: Record<GraduationStage, string> = {
  PREPARATION: '资料调研、需求梳理、方案和环境准备、开题报告撰写',
  DRAFTING: '设计、搭建、核心功能或算法实现、测试和说明书初稿',
  MIDTERM_CHECK: '阶段成果、联调或评估、存在问题、说明书进度、论文查重及 AIGC 检测',
  REFINEMENT: '落实修改、测试修复、说明书完善以及成果与材料整理',
};

export function progressSectionInstruction(stage: GraduationStage): string {
  return `以学生口吻，依据学生提供的本阶段原始记录，写 3–6 条具体进展。阶段重点为${STAGE_FOCUS[stage]}。准确区分已完成、进行中和下一步安排，条数服从已有事实。保留已记录的成果和问题，禁止把计划或其他阶段目标当成已完成，禁止推断完成率、检测结果及指导教师意见。`;
}

export const SUMMARY_INSTRUCTION = '根据学生提供的个人反思和四份进展记录，以第一人称总结选题准备、设计实践、遇到的实际困难、解决过程与收获。用 3–6 个自然段，约 500–800 字。已有事实不足时，按实际材料压缩。禁止虚构经历、成绩、检测结果或教师意见。';
