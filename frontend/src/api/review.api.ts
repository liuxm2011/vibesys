import { api } from '@/utils/request';
import type { ReviewDocumentsResponse, ReviewResult, Document } from '@/types/document';

export async function reviewDocumentsApi(
  projectId: number,
  mode: 'review' | 'fix' | 'discard'
): Promise<ReviewDocumentsResponse> {
  return api.post<ReviewDocumentsResponse>('/api/ai/review', {
    projectId,
    mode
  });
}

export interface ReviewApiState {
  status: 'idle' | 'reviewing' | 'reviewed' | 'fixing' | 'fixed';
  result: ReviewResult | null;
  fixedDocuments: Document[];
}
