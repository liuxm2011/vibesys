import { test, expect } from 'vitest';
import { Hono } from 'hono';
import { aiLimiter, loginLimiter } from '../src/middleware/rate-limit.middleware.js';
import type { AppEnv } from '../src/types.js';

/**
 * 回归测试：D1 限流中间件（P0-2 修复后的实现）。
 *
 * 计数存储在 D1（c.env.DB），测试用 FakeD1 模拟 upsert-first 语义：
 * 表内存 (key, count, resetAt)，实现与生产 SQL 相同的原子计数 + 窗口翻转。
 */

/** 模拟 D1Database 的最小面：prepare().bind().first()，复刻生产 upsert 语义 */
class FakeD1 {
  private rows = new Map<string, { count: number; resetAt: string }>();

  prepare(sql: string) {
    return {
      bind: (...params: unknown[]) => ({
        first: async (): Promise<{ count: number } | null> => {
          // RATE_LIMIT_UPSERT: (key, nowIso, resetAtIso)
          const key = params[0] as string;
          const now = params[1] as string;
          const resetAt = params[2] as string;

          const existing = this.rows.get(key);
          if (!existing || existing.resetAt <= now) {
            this.rows.set(key, { count: 1, resetAt });
            return { count: 1 };
          }
          existing.count += 1;
          return { count: existing.count };
        }
      })
    };
  }
}

function buildApp(): Hono<AppEnv> {
  const app = new Hono<AppEnv>();
  app.use('/ai', async (c, next) => {
    c.set('user', { userId: 1, studentId: 'test', name: 'test', role: 'STUDENT' });
    await next();
  });
  app.use('/ai', aiLimiter);
  app.get('/ai', (c) => c.json({ ok: true }));
  app.use('/login', loginLimiter);
  app.post('/login', (c) => c.json({ ok: true }));
  return app;
}

/** 用指定 env 直接发请求（Hono app.request 第三参即 ExecutionEnv） */
async function call(app: Hono<AppEnv>, path: string, env: any, method = 'GET'): Promise<Response> {
  return app.request(path, { method }, env);
}

test('aiLimiter 达到上限后返回 429，并给出中文提示', async () => {
  const app = buildApp();
  const env = { DB: new FakeD1() };

  const statuses: number[] = [];
  for (let i = 0; i < 11; i += 1) {
    const res = await call(app, '/ai', env);
    statuses.push(res.status);
  }

  expect(statuses.slice(0, 10)).toEqual(new Array(10).fill(200));
  expect(statuses[10]).toBe(429);

  const blocked = await call(app, '/ai', env);
  expect(blocked.status).toBe(429);
  const body = (await blocked.json()) as { error?: string };
  expect(body.error).toContain('上限');
});

test('aiLimiter 计数在 D1 中共享：同 env 的两个 app 实例共用计数', async () => {
  // 验证跨 isolate 共享的核心性质：计数绑定 D1 而非模块状态
  const env = { DB: new FakeD1() };
  const appA = buildApp();
  const appB = buildApp();

  for (let i = 0; i < 10; i += 1) {
    expect((await call(appA, '/ai', env)).status).toBe(200);
  }
  // 另一个"实例"（模拟另一 isolate）应看到同一计数并拒绝
  expect((await call(appB, '/ai', env)).status).toBe(429);
});

test('无 DB binding 时 fail-open：不限流直接放行', async () => {
  const app = buildApp();
  const env = {}; // 本地 Node 环境无 c.env.DB

  for (let i = 0; i < 15; i += 1) {
    expect((await call(app, '/ai', env)).status).toBe(200);
  }
});

test('loginLimiter 的 key 取 cf-connecting-ip，伪造 x-forwarded-for 不能绕过', async () => {
  const app = buildApp();
  const env = { DB: new FakeD1() };

  // 同一真实 IP（cf-connecting-ip），每次换伪造的 XFF
  for (let i = 0; i < 20; i += 1) {
    const res = await app.request(
      '/login',
      { method: 'POST', headers: { 'x-forwarded-for': `1.2.3.${i}` } },
      env
    );
    expect(res.status).toBe(200);
  }
  // 第 21 次：计数已到 20，即使再换 XFF 也应 429
  const blocked = await app.request(
    '/login',
    { method: 'POST', headers: { 'x-forwarded-for': '9.9.9.9' } },
    env
  );
  expect(blocked.status).toBe(429);
});

test('loginLimiter 按 cf-connecting-ip 区分：不同真实 IP 互不影响', async () => {
  const app = buildApp();
  const env = { DB: new FakeD1() };

  for (let i = 0; i < 20; i += 1) {
    const res = await app.request(
      '/login',
      { method: 'POST', headers: { 'cf-connecting-ip': '203.0.113.1' } },
      env
    );
    expect(res.status).toBe(200);
  }
  // 另一 IP 不受影响
  const other = await app.request(
    '/login',
    { method: 'POST', headers: { 'cf-connecting-ip': '203.0.113.2' } },
    env
  );
  expect(other.status).toBe(200);
});

test('D1 出错时 fail-open：限流存储故障不拖垮业务', async () => {
  const brokenDb = {
    prepare() {
      return {
        bind() {
          return { first: async () => { throw new Error('D1 unavailable'); } };
        }
      };
    }
  };
  const app = buildApp();
  const env = { DB: brokenDb };

  for (let i = 0; i < 25; i += 1) {
    expect((await call(app, '/ai', env)).status).toBe(200);
  }
});