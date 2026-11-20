import type { GenerateDocumentStreamProgress } from '@/types/document';
import { resolveApiUrl } from '@/utils/request';

interface StreamOptions {
  onProgress?: (event: GenerateDocumentStreamProgress) => void;
  forceRegenerate?: boolean;
  signal?: AbortSignal;
}

export async function requestDocumentStream<T>(
  endpoint: string,
  projectId: number,
  docType: string,
  options: StreamOptions,
): Promise<T> {
  const response = await fetch(resolveApiUrl(endpoint), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    credentials: 'include',
    signal: options.signal,
    body: JSON.stringify({ projectId, docType, forceRegenerate: options.forceRegenerate === true }),
  }).catch((error: unknown) => {
    options.signal?.throwIfAborted();
    throw new Error('无法连接到文档生成服务，请稍后重试', { cause: error });
  });

  const contentType = response.headers.get('content-type') ?? '';
  if (!response.ok) {
    const body = contentType.includes('application/json') ? await response.json().catch(() => null) : null;
    if (body?.error) throw new Error(body.error);
    throw new Error(`文档生成请求失败（HTTP ${response.status}），请稍后重试`);
  }
  if (!contentType.includes('text/event-stream') || !response.body) {
    throw new Error('生成服务未返回有效的流式响应，请稍后重试');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  function processEvent(block: string): T | undefined {
    const lines = block.split(/\r?\n/);
    const event = lines.find(line => line.startsWith('event:'))?.slice(6).trim();
    if (event !== 'progress' && event !== 'complete' && event !== 'error') return;
    const data = lines.filter(line => line.startsWith('data:')).map(line => line.slice(5).trimStart()).join('\n');
    const payload = JSON.parse(data);
    if (event === 'complete') return payload as T;
    if (event === 'error') throw new Error(payload.error || payload.message || '生成失败');
    options.onProgress?.(payload as GenerateDocumentStreamProgress);
  }

  try {
    while (true) {
      const { done, value } = await reader.read().catch((error: unknown) => {
        options.signal?.throwIfAborted();
        throw new Error('与生成服务的流式连接中断，请稍后重试', { cause: error });
      });
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true });

      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = done ? '' : blocks.pop() ?? '';
      for (const block of blocks) {
        const result = processEvent(block);
        if (result !== undefined) return result;
      }
      if (done) throw new Error('连接已关闭，未收到文档生成完成通知，请稍后重试');
    }
  } finally {
    void reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
