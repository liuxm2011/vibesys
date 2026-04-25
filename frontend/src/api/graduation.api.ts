import { api, resolveApiUrl } from '@/utils/request';
import type {
  GraduationDocType,
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

export interface GenerateGraduationStreamProgress {
  phase: 'reasoning' | 'writing' | 'finalizing';
  reasoningText: string;
  contentText: string;
  tokenCount?: number;
  tokensPerSecond?: number;
  elapsedSeconds?: number;
}

export interface GenerateGraduationStreamOptions {
  onProgress?: (event: GenerateGraduationStreamProgress) => void;
  forceRegenerate?: boolean;
  signal?: AbortSignal;
}

export async function generateGraduationDocumentStreamApi(
  projectId: number,
  docType: GraduationDocType,
  options: GenerateGraduationStreamOptions = {}
): Promise<GenerateGraduationDocumentResponse> {
  const response = await fetch(resolveApiUrl('/api/graduation/generate/stream'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    signal: options.signal,
    body: JSON.stringify({
      projectId,
      docType,
      forceRegenerate: options.forceRegenerate === true
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
  let completedResponse: GenerateGraduationDocumentResponse | null = null;

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

    if (eventName === 'progress') {
      options.onProgress?.(payload as GenerateGraduationStreamProgress);
      return;
    }

    if (eventName === 'complete') {
      completedResponse = payload as GenerateGraduationDocumentResponse;
      return;
    }

    if (eventName === 'error') {
      throw new Error(payload.message || '生成失败');
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
    throw new Error('流式响应提前结束，请稍后重试');
  }

  return completedResponse;
}
