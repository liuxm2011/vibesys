import { Hono } from 'hono';
import { afterEach, expect, test, vi } from 'vitest';
import type { PrismaClient } from '../src/generated/prisma';
import graduationRoutes from '../src/routes/graduation.routes.js';
import type { AppEnv } from '../src/types.js';
import { signToken } from '../src/utils/jwt.utils.js';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

async function startGeneration(upstream: Response) {
  vi.stubEnv('MOCK_AI', 'false');
  const fetchModel = vi.fn().mockResolvedValue(upstream);
  vi.stubGlobal('fetch', fetchModel);
  const saveDocument = vi.fn(async ({ data }) => data);
  const prisma = {
    user: { findUnique: async () => ({ status: 'ACTIVE', role: 'STUDENT', major: '大数据' }) },
    userApiSetting: {
      findUnique: async () => ({ baseURL: 'https://provider.example.test/v1', apiKey: 'test-key', model: 'test-model' }),
    },
    systemConfig: { findUnique: async () => ({ value: 'true' }) },
    project: {
      findFirst: async () => ({
        topic: { title: '图书管理', description: '图书借阅系统', platform: 'WEB' },
        user: { studentId: '1', name: '测试学生', major: '大数据' },
        documents: [],
        graduationDocuments: [],
      }),
    },
    graduationDocument: { findUnique: async () => null, create: saveDocument },
    aiUsageLog: { create: async () => ({}) },
  } as unknown as PrismaClient;

  const app = new Hono<AppEnv>();
  app.use('*', async (c, next) => {
    c.set('prisma', prisma);
    await next();
  });
  app.route('/api/graduation', graduationRoutes);

  const secret = 'test-secret-for-document-streaming';
  const token = await signToken({ userId: 1, studentId: '1', name: '测试学生', role: 'STUDENT' }, secret);
  const response = await app.request('/api/graduation/generate/stream', {
    method: 'POST',
    headers: { Cookie: `token=${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectId: 1, docType: 'TASK_BOOK' }),
  }, { JWT_SECRET: secret });
  return { response, fetchModel, saveDocument };
}

test('任务书在上游结束前转发生成阶段和正文片段', async () => {
  let upstream!: ReadableStreamDefaultController<Uint8Array>;
  const body = new ReadableStream<Uint8Array>({ start: controller => { upstream = controller; } });
  const encoder = new TextEncoder();
  const content = '# 任务书\n\n正文第一段。';
  const finalText = '\n\n正文第二段。';
  const { response, fetchModel, saveDocument } = await startGeneration(
    new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }),
  );
  expect(response.status).toBe(200);
  expect(response.headers.get('Cache-Control')).toContain('no-transform');

  const reader = response.body!.getReader();
  async function readEvent() {
    const { value } = await reader.read();
    const lines = new TextDecoder().decode(value).split('\n');
    return { name: lines[0], data: JSON.parse(lines[1].slice(6)) };
  }

  try {
    expect((await readEvent()).data.phase).toBe('connecting');

    upstream.enqueue(encoder.encode('data:{"choices":[{"delta":{"reasoning_details":[{"text":"内部推理"}]}}]}\r\n\r\n'));
    expect((await readEvent()).data).toMatchObject({ phase: 'reasoning', contentText: '', reasoningText: '' });
    expect(fetchModel).toHaveBeenCalledWith('https://provider.example.test/v1/chat/completions', expect.objectContaining({
      headers: expect.objectContaining({ Accept: 'text/event-stream' }),
      body: expect.stringContaining('"stream":true'),
    }));

    const firstDelta = encoder.encode(`data:${JSON.stringify({ choices: [{ delta: { content } }] })}\r\n\r\n`);
    const split = firstDelta.indexOf(encoder.encode('任')[0]) + 1;
    upstream.enqueue(firstDelta.slice(0, split));
    upstream.enqueue(firstDelta.slice(split));
    expect((await readEvent()).data).toMatchObject({ phase: 'writing', contentText: content });
    expect(saveDocument).not.toHaveBeenCalled();

    // Some gateways close immediately after their last data line.
    upstream.enqueue(encoder.encode(`data: ${JSON.stringify({ choices: [{ delta: { content: finalText }, finish_reason: 'stop' }] })}`));
    upstream.close();
    expect((await readEvent()).data).toMatchObject({ phase: 'writing', contentText: content + finalText });
    expect((await readEvent()).data.phase).toBe('finalizing');
    expect(await readEvent()).toMatchObject({
      name: 'event: complete',
      data: { document: { content: content + finalText } },
    });
  } finally {
    await reader.cancel();
  }
});

test('任务书流收到普通 JSON 时提示服务商返回格式且不保存空文档', async () => {
  const { response, fetchModel, saveDocument } = await startGeneration(
    Response.json({ choices: [{ message: { content: '# 任务书' } }] }),
  );

  const events = await response.text();
  expect(events).toContain('event: error');
  expect(events).toContain('AI 服务返回了非流式响应');
  expect(fetchModel).toHaveBeenCalledTimes(1);
  expect(saveDocument).not.toHaveBeenCalled();
});
