import type { Document, DocType } from '@/types/document';

export const DOC_GENERATION_ORDER: DocType[] = [
  'PRD',
  'FRONTEND',
  'BACKEND',
  'API',
  'TASK',
  'CONTEXT_STATE',
  'AGENTS'
];

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  PRD: 'PRD',
  FRONTEND: '前端',
  BACKEND: '后端',
  API: 'API',
  TASK: '任务清单',
  CONTEXT_STATE: '状态',
  AGENTS: '规则'
};

function hasDocumentContent(document?: Pick<Document, 'content'>): boolean {
  return !!document?.content?.trim();
}

export function getPreviousDocType(docType: DocType): DocType | null {
  const index = DOC_GENERATION_ORDER.indexOf(docType);
  if (index <= 0) {
    return null;
  }

  return DOC_GENERATION_ORDER[index - 1];
}

export function getGenerationBlockedReason(docType: DocType, documents: Document[]): string | null {
  const previousDocType = getPreviousDocType(docType);
  if (!previousDocType) {
    return null;
  }

  const previousDocument = documents.find(document => document.docType === previousDocType);
  if (hasDocumentContent(previousDocument)) {
    return null;
  }

  return `请先生成${DOC_TYPE_LABELS[previousDocType]}文档，然后才能生成${DOC_TYPE_LABELS[docType]}文档。`;
}

export function canGenerateDocument(docType: DocType, documents: Document[]): boolean {
  return getGenerationBlockedReason(docType, documents) === null;
}

export const REVIEW_CATEGORY_LABELS: Record<string, string> = {
  prd_vs_frontend: 'PRD vs 前端',
  prd_vs_backend: 'PRD vs 后端',
  backend_vs_api: '后端 vs API',
  frontend_vs_api: '前端 vs API',
  overall: '整体一致性'
};

export const REVIEW_SEVERITY_CONFIG: Record<string, { type: 'danger' | 'warning' | 'info'; label: string }> = {
  critical: { type: 'danger', label: '严重' },
  warning: { type: 'warning', label: '警告' },
  suggestion: { type: 'info', label: '建议' }
};
