import { api } from '@/utils/request';
import type {
  DocType,
  DocumentsResponse,
  CreateDocumentResponse,
  UpdateDocumentResponse
} from '@/types/document';

/**
 * Fetch all documents for a project (DOC-01~03)
 * @param projectId Project ID to fetch documents for
 * @returns Documents array with tech stack
 */
export async function fetchDocumentsApi(projectId: number): Promise<DocumentsResponse> {
  return api.get<DocumentsResponse>(`/api/documents/${projectId}`);
}

/**
 * Update document content (DOC-05, D-12 real-time save)
 * @param id Document ID to update
 * @param content New content
 * @returns Updated document
 */
export async function updateDocumentApi(id: number, content: string): Promise<UpdateDocumentResponse> {
  return api.put<UpdateDocumentResponse>(`/api/documents/${id}`, { content });
}

/**
 * Create empty document (lazy creation)
 * @param projectId Project ID
 * @param docType Document type
 * @returns Created or existing document
 */
export async function createDocumentApi(
  projectId: number,
  docType: DocType
): Promise<CreateDocumentResponse> {
  return api.post<CreateDocumentResponse>('/api/documents', { projectId, docType });
}
