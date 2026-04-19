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
}

export interface GenerateDocumentResponse {
  document: Document;
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