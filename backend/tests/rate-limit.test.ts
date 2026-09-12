import { test, expect } from 'vitest';
import { Hono } from 'hono';
import { aiLimiter } from '../src/middleware/rate-limit.middleware.js';
import type { AppEnv } from '../src/types.js';

/**
 * 回归测试：AI 限流中间件 aiLimiter（对应修复 C/D 的接线能力）。
 * 采用唯一用户 ID，避免中间件模块级 Map 在多次运行间相互污染。
 */
function uniqueUserId(): number {
  return 900000 + Math.floor(Math.random() * 1_000_000);
}

function buildApp(initialUserId: number): { app: Hono<AppEnv>; setUser: (id: number) => void } {
  let currentUserId = initialUserId;
  const app = new Hono<AppEnv>();
  app.use('/ai', async (c, next) => {
    c.set('user', {
      userId: currentUserId,
      studentId: 'test',
      name: 'test',
      role: 'STUDENT'
    });
    await next();
  });
  app.use('/ai', aiLimiter);
  app.get('/ai', (c) => c.json({ ok: true }));
  return { app, setUser: (id: number) => { currentUserId = id; } };
}

test('aiLimiter 达到上限后返回 429，并给出中文提示', async () => {
  const userId = uniqueUserId();
  const { app } = buildApp(userId);

  const statuses: number[] = [];
  for (let i = 0; i < 11; i += 1) {
    const res = await app.request('/ai');
    statuses.push(res.status);
  }

  expect(statuses.slice(0, 10)).toEqual(new Array(10).fill(200));
  expect(statuses[10]).toBe(429);

  const blocked = await app.request('/ai');
  expect(blocked.status).toBe(429);
  const body = (await blocked.json()) as { error?: string };
  expect(body.error).toContain('上限');
});

test('aiLimiter 按用户维度计数：不同用户互不影响', async () => {
  const userA = uniqueUserId();
  const userB = uniqueUserId();
  const { app, setUser } = buildApp(userA);

  // 用户 A 用满 10 次
  for (let i = 0; i < 10; i += 1) {
    expect((await app.request('/ai')).status).toBe(200);
  }
  expect((await app.request('/ai')).status).toBe(429);

  // 用户 B 不应受用户 A 的计数影响
  setUser(userB);
  expect((await app.request('/ai')).status).toBe(200);
});
