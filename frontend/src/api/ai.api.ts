import { api } from '@/utils/request';
import { resolveApiUrl } from '@/utils/request';
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
  docType: DocType
): Promise<GenerateDocumentResponse> {
  return api.post<GenerateDocumentResponse>('/api/ai/generate', { projectId, docType });
}

interface GenerateDocumentStreamOptions {
  onProgress?: (event: GenerateDocumentStreamProgress) => void;
}

export async function generateDocumentStreamApi(
  projectId: number,
  docType: DocType,
  options: GenerateDocumentStreamOptions = {}
): Promise<GenerateDocumentResponse> {
  const response = await fetch(resolveApiUrl('/api/ai/generate/stream'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ projectId, docType })
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
  let completedResponse: GenerateDocumentResponse | null = null;

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
      options.onProgress?.(payload as GenerateDocumentStreamProgress);
      return;
    }

    if (eventName === 'complete') {
      completedResponse = payload as GenerateDocumentResponse;
      return;
    }

    if (eventName === 'error') {
      throw new Error(payload.error || '生成失败');
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
