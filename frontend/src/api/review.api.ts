import { api } from '@/utils/request';
import { resolveApiUrl } from '@/utils/request';
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

interface ReviewDocumentsStreamOptions {
  onPhase?: (phase: string) => void;
  signal?: AbortSignal;
}

export async function reviewDocumentsStreamApi(
  projectId: number,
  mode: 'review' | 'fix' | 'discard',
  options: ReviewDocumentsStreamOptions = {}
): Promise<ReviewDocumentsResponse> {
  if (mode !== 'review') {
    // fix/discard are not streamed; use synchronous fallback
    return reviewDocumentsApi(projectId, mode);
  }

  const response = await fetch(resolveApiUrl('/api/ai/review/stream'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    signal: options.signal,
    body: JSON.stringify({
      projectId,
      mode
    })
  });

  if (!response.ok) {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      throw new Error(data.error || '请求失败');
    }

    const text = await response.text();
    throw new Error(text || '请求失败');
  }

  if (!response.body) {
    throw new Error('浏览器不支持流式响应');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completedResponse: ReviewDocumentsResponse | null = null;

  const extractNextEventBlock = (): string | null => {
    const match = buffer.match(/\r?\n\r?\n/);
    if (!match || match.index === undefined) {
      return null;
    }

    const block = buffer.slice(0, match.index).trim();
    buffer = buffer.slice(match.index + match[0].length);
    return block;
  };

  const processEventBlock = (block: string): void => {
    const lines = block
      .split(/\r?\n/)
      .map(line => line.trimEnd())
      .filter(Boolean);

    let eventName = 'message';
    const dataLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith('event:')) {
        eventName = line.slice(6).trim();
      } else if (line.startsWith('data:')) {
        dataLines.push(line.slice(5).trim());
      }
    }

    if (dataLines.length === 0) {
      return;
    }

    const payloadText = dataLines.join('\n');
    const payload = JSON.parse(payloadText);

    if (eventName === 'phase') {
      options.onPhase?.(payload.phase as string);
      return;
    }

    if (eventName === 'complete') {
      completedResponse = payload as ReviewDocumentsResponse;
      return;
    }

    if (eventName === 'error') {
      throw new Error(payload.error || '审核失败');
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    let block = extractNextEventBlock();
    while (block !== null) {
      if (block) {
        processEventBlock(block);
      }

      block = extractNextEventBlock();
    }
  }

  if (buffer.trim()) {
    processEventBlock(buffer.trim());
  }

  if (!completedResponse) {
    throw new Error('审核流式响应提前结束，请稍后重试');
  }

  return completedResponse;
}

export interface ReviewApiState {
  status: 'idle' | 'reviewing' | 'reviewed' | 'fixing' | 'fixed';
  result: ReviewResult | null;
  fixedDocuments: Document[];
}
