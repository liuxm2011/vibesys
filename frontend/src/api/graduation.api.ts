import { api } from '@/utils/request';
import { requestDocumentStream } from '@/utils/document-stream';
import type { GenerateDocumentStreamProgress } from '@/types/document';
import type {
  GraduationDocType,
  GraduationHandbookData,
  HandbookProfile,
  GraduationDocumentsResponse,
  CreateGraduationDocumentResponse,
  UpdateGraduationDocumentResponse,
  GenerateGraduationDocumentResponse,
} from '@/types/graduation-document';

export async function fetchGraduationDocumentsApi(
  projectId: number
): Promise<GraduationDocumentsResponse> {
  return api.get<GraduationDocumentsResponse>(`/api/graduation/${projectId}`);
}

export async function updateGraduationDocumentApi(
  id: number,
  content: string
): Promise<UpdateGraduationDocumentResponse> {
  return api.put<UpdateGraduationDocumentResponse>(`/api/graduation/${id}`, { content });
}

export async function createGraduationDocumentApi(
  projectId: number,
  docType: GraduationDocType
): Promise<CreateGraduationDocumentResponse> {
  return api.post<CreateGraduationDocumentResponse>('/api/graduation', { projectId, docType });
}

export async function generateGraduationDocumentApi(
  projectId: number,
  docType: GraduationDocType,
  forceRegenerate = false
): Promise<GenerateGraduationDocumentResponse> {
  return api.post<GenerateGraduationDocumentResponse>('/api/graduation/generate', {
    projectId,
    docType,
    forceRegenerate
  });
}

export interface GenerateGraduationStreamOptions {
  onProgress?: (event: GenerateDocumentStreamProgress) => void;
  forceRegenerate?: boolean;
  signal?: AbortSignal;
}

export async function generateGraduationDocumentStreamApi(
  projectId: number,
  docType: GraduationDocType,
  options: GenerateGraduationStreamOptions = {}
): Promise<GenerateGraduationDocumentResponse> {
  return requestDocumentStream<GenerateGraduationDocumentResponse>('/api/graduation/generate/stream', projectId, docType, options);
}

export function fetchGraduationHandbookApi(projectId: number): Promise<GraduationHandbookData> {
  return api.get(`/api/graduation/${projectId}/handbook`);
}

export function updateGraduationHandbookApi(
  projectId: number, profile: HandbookProfile,
): Promise<Pick<GraduationHandbookData, 'profile' | 'calendar'>> {
  return api.put(`/api/graduation/${projectId}/handbook`, profile);
}
