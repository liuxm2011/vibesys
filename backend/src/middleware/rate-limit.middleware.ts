import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../types.js';

/**
 * D1 持久化限流（P0-2 修复）。
 *
 * 旧实现的两个缺陷：
 *  1. 进程内 Map——Workers 每个 isolate / 每个 colo 各一份且随时回收，实际限额 = 配置 × isolate 数；
 *  2. key 取 x-forwarded-for——CF 默认透传客户端传入的 XFF，伪造即可绕过。
 *
 * 现改为单条 D1 原子 upsert：计数与窗口翻转在一条 SQL 内完成，跨 isolate 共享。
 * key 只用不可伪造的 cf-connecting-ip（CF 边缘注入）；D1 不可用或出错时 fail-open。
 */

const RATE_LIMIT_UPSERT = `
  INSERT INTO "RateLimitEntry" ("key","count","resetAt") VALUES (?1, 1, ?3)
  ON CONFLICT("key") DO UPDATE SET
    "count"   = CASE WHEN "resetAt" <= ?2 THEN 1 ELSE "count" + 1 END,
    "resetAt" = CASE WHEN "resetAt" <= ?2 THEN ?3 ELSE "resetAt" END
  RETURNING "count"
`;

async function hitRateLimit(db: D1Database | undefined, key: string, windowMs: number, max: number): Promise<boolean> {
  if (!db) return false; // fail-open：无 D1 binding 的环境（本地 Node）不限流

  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);

  try {
    const row = await db
      .prepare(RATE_LIMIT_UPSERT)
      .bind(key, now.toISOString(), resetAt.toISOString())
      .first<{ count: number }>();
    // 本次请求已计入 count：count > max 表示本请求是第 max+1 次 → 拒绝
    return (row?.count ?? 0) > max;
  } catch {
    return false; // fail-open：限流存储故障不应拖垮业务
  }
}

function getClientIp(c: { req: { header(name: string): string | undefined } }): string {
  // 只认 Cloudflare 边缘注入的 cf-connecting-ip，不可被请求头伪造
  return c.req.header('cf-connecting-ip') || 'unknown';
}

function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (c: any) => string;
}) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const key = options.keyGenerator
      ? options.keyGenerator(c)
      : getClientIp(c);

    const limited = await hitRateLimit(c.env?.DB, key, options.windowMs, options.max);
    if (limited) {
      return c.json({ error: options.message }, 429);
    }

    await next();
  });
}

export const loginLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: '登录尝试次数过多，请稍后再试',
  keyGenerator: (c: any) => `login:${getClientIp(c)}`
});

export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: '请求过于频繁，请稍后再试',
  keyGenerator: (c: any) => `general:${getClientIp(c)}`
});

export const aiLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'AI生成次数已达上限，请稍后再试',
  keyGenerator: (c: any) => {
    // userId 来自 JWT payload（authMiddleware 之后可用），不可伪造，优先于 IP
    const user = c.get('user');
    return user?.userId != null ? `ai:${user.userId}` : `ai:${getClientIp(c)}`;
  }
});

export const documentUpdateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: '操作过于频繁，请稍后再试',
  keyGenerator: (c: any) => `doc:${getClientIp(c)}`
});