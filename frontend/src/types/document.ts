/**
 * Type definitions for Document (D-10~13)
 * Phase 3: Document model matching backend schema
 */

export type DocType = 'PRD' | 'FRONTEND' | 'BACKEND' | 'API' | 'TASK' | 'CONTEXT_STATE' | 'AGENTS';

export interface Document {
  id: number;
  projectId: number;
  docType: DocType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentsResponse {
  documents: Document[];
  techStack: string[];
}

export interface CreateDocumentRequest {
  projectId: number;
  docType: DocType;
}

export interface CreateDocumentResponse {
  document: Document;
}

export interface UpdateDocumentRequest {
  content: string;
}

export interface UpdateDocumentResponse {
  document: Document;
}

export interface GenerateDocumentRequest {
  projectId: number;
  docType: DocType;
  forceRegenerate?: boolean;
}

export interface GenerateDocumentResponse {
  document: Document;
}

export interface GenerateDocumentStreamProgress {
  phase: 'reasoning' | 'writing' | 'finalizing';
  reasoningText: string;
  contentText: string;
  tokenCount?: number;
  tokensPerSecond?: number;
  elapsedSeconds?: number;
}

export interface UpdateTechStackRequest {
  techStack: string;
}

export interface UpdateTechStackResponse {
  project: {
    id: number;
    techStack: string;
  };
}

export interface ReviewIssue {
  id: number;
  severity: 'critical' | 'warning' | 'suggestion';
  category: 'prd_vs_frontend' | 'prd_vs_backend' | 'backend_vs_api' | 'frontend_vs_api' | 'overall';
  title: string;
  description: string;
  affectedDocTypes: DocType[];
  suggestion: string;
  patchHints: ReviewPatchHint[];
}

export interface ReviewResult {
  issues: ReviewIssue[];
  summary: string;
}

export interface ReviewPatchHint {
  docType: DocType;
  changeType: 'replace_section' | 'replace_range';
  targetHeadingPath: string[];
  anchorBefore?: string;
  anchorAfter?: string;
  replacementContent: string;
}

export interface ReviewUnresolvedFix {
  docType: DocType;
  issueId: number;
  reason: string;
  fallbackNote: string;
  targetHeadingPath?: string[];
  anchorBefore?: string;
  anchorAfter?: string;
}

export interface ReviewDocumentsResponse {
  review?: ReviewResult;
  documents?: Document[];
  unresolved?: ReviewUnresolvedFix[];
  success?: boolean;
}

export type ReviewStatus = 'idle' | 'reviewing' | 'reviewed' | 'fixing' | 'fixed';
