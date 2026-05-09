/**
 * Type definitions for Graduation Design Documents (毕设文档)
 * Separate document set for the graduation design workflow.
 */

export type GraduationDocType =
  | 'TASK_BOOK'       // 任务书
  | 'PROPOSAL'        // 开题报告
  | 'PREPARATION'     // 前期准备阶段
  | 'DRAFTING'        // 撰写阶段
  | 'MIDTERM_CHECK'   // 中期检查阶段
  | 'REFINEMENT';     // 完善阶段

export interface GraduationDocument {
  id: number;
  projectId: number;
  docType: GraduationDocType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraduationDocumentsResponse {
  documents: GraduationDocument[];
}

export interface CreateGraduationDocumentRequest {
  projectId: number;
  docType: GraduationDocType;
}

export interface CreateGraduationDocumentResponse {
  document: GraduationDocument;
}

export interface UpdateGraduationDocumentRequest {
  content: string;
}

export interface UpdateGraduationDocumentResponse {
  document: GraduationDocument;
}

export interface GenerateGraduationDocumentRequest {
  projectId: number;
  docType: GraduationDocType;
  forceRegenerate?: boolean;
}

export interface GenerateGraduationDocumentResponse {
  document: GraduationDocument;
}
