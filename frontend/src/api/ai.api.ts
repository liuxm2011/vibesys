import { api } from '@/utils/request';
import { requestDocumentStream } from '@/utils/document-stream';
import type {
  DocType,
  GenerateDocumentResponse,
  GenerateDocumentStreamProgress
} from '@/types/document';

/**
 * Generate document via AI (DOC-04)
 * Note: This operation may take 5-30 seconds
 * @param projectId Project ID
 * @param docType Document type to generate
 * @returns Generated document with content
 */
export async function generateDocumentApi(
  projectId: number,
  docType: DocType,
  forceRegenerate = false
): Promise<GenerateDocumentResponse> {
  return api.post<GenerateDocumentResponse>('/api/ai/generate', {
    projectId,
    docType,
    forceRegenerate
  });
}

interface GenerateDocumentStreamOptions {
  onProgress?: (event: GenerateDocumentStreamProgress) => void;
  forceRegenerate?: boolean;
  signal?: AbortSignal;
}

export async function generateDocumentStreamApi(
  projectId: number,
  docType: DocType,
  options: GenerateDocumentStreamOptions = {}
): Promise<GenerateDocumentResponse> {
  return requestDocumentStream<GenerateDocumentResponse>('/api/ai/generate/stream', projectId, docType, options);
}
