import { api } from '@/utils/request';
import type { GenerateDocumentResponse } from '@/types/document';

/**
 * Generate document via AI (DOC-04)
 * Note: This operation may take 5-30 seconds
 * @param projectId Project ID
 * @param docType Document type to generate
 * @returns Generated document with content
 */
export async function generateDocumentApi(
  projectId: number,
  docType: 'PRD' | 'FRONTEND' | 'BACKEND'
): Promise<GenerateDocumentResponse> {
  return api.post<GenerateDocumentResponse>('/api/ai/generate', { projectId, docType });
}