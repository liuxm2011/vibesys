import type { GraduationDocType } from '@/types/graduation-document';

export const GRAD_DOC_GENERATION_ORDER: GraduationDocType[] = [
  'TASK_BOOK',
  'PROPOSAL',
  'PREPARATION',
  'DRAFTING',
  'MIDTERM_CHECK',
  'REFINEMENT'
];

export const GRAD_DOC_TYPE_LABELS: Record<GraduationDocType, string> = {
  TASK_BOOK: '任务书',
  PROPOSAL: '开题报告',
  PREPARATION: '前期准备',
  DRAFTING: '撰写阶段',
  MIDTERM_CHECK: '中期检查',
  REFINEMENT: '完善'
};

export function getGradDocTypeLabel(type: GraduationDocType): string {
  return GRAD_DOC_TYPE_LABELS[type];
}
