import type { Context } from 'hono';
import { streamSSE, type SSEStreamingApi } from 'hono/streaming';
import type { AppEnv } from '../types.js';

const HEARTBEAT_INTERVAL_MS = 15_000;

export class DocumentStreamError extends Error {}

export function streamDocumentResponse(
  c: Context<AppEnv>,
  generate: (stream: SSEStreamingApi, signal: AbortSignal) => Promise<void>,
): Response {
  const response = streamSSE(c, async (stream) => {
    const controller = new AbortController();
    let heartbeatPending = false;
    const heartbeat = setInterval(() => {
      if (heartbeatPending || controller.signal.aborted) return;
      heartbeatPending = true;
      void stream.write(': keepalive\n\n').finally(() => {
        heartbeatPending = false;
      });
    }, HEARTBEAT_INTERVAL_MS);

    stream.onAbort(() => {
      clearInterval(heartbeat);
      controller.abort();
    });

    try {
      await generate(stream, controller.signal);
    } finally {
      clearInterval(heartbeat);
    }
  });
  response.headers.set('Cache-Control', 'no-cache, no-transform');
  response.headers.set('X-Accel-Buffering', 'no');
  response.headers.delete('Connection');
  response.headers.delete('Transfer-Encoding');
  return response;
}
