import { DocType } from '../generated/prisma'

type DocumentLike = {
  docType: DocType;
  content: string;
};

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

function hasDocumentContent(document?: Pick<DocumentLike, 'content'>): boolean {
  return !!document?.content?.trim();
}

export function getPreviousDocType(docType: DocType): DocType | null {
  const index = DOC_GENERATION_ORDER.indexOf(docType);
  if (index <= 0) {
    return null;
  }

  return DOC_GENERATION_ORDER[index - 1];
}

export function getGenerationBlockedReason(docType: DocType, documents: DocumentLike[]): string | null {
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

export function getContextDependencies(docType: DocType): DocType[] {
  const index = DOC_GENERATION_ORDER.indexOf(docType);
  if (index <= 0) {
    return [];
  }

  return DOC_GENERATION_ORDER.slice(0, index);
}
