import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../types.js';

type RateLimitEntry = { count: number; resetAt: number };

const rateLimitMap = new Map<string, RateLimitEntry>();

function createRateLimiter(options: {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (c: any) => string;
}) {
  return createMiddleware<AppEnv>(async (c, next) => {
    const key = options.keyGenerator
      ? options.keyGenerator(c)
      : c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || 'unknown';

    const now = Date.now();
    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
      rateLimitMap.set(key, { count: 1, resetAt: now + options.windowMs });
      await next();
      return;
    }

    if (entry.count >= options.max) {
      return c.json({ error: options.message }, 429);
    }

    entry.count++;
    await next();
  });
}

export const loginLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 20,
  message: '登录尝试次数过多，请稍后再试',
  keyGenerator: (c: any) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('cf-connecting-ip') || 'unknown';
    return `login:${ip}`;
  }
});

export const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: '请求过于频繁，请稍后再试'
});

export const aiLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'AI生成次数已达上限，请稍后再试',
  keyGenerator: (c: any) => {
    const user = c.get('user');
    return user?.userId?.toString() || c.req.header('x-forwarded-for') || 'unknown';
  }
});

export const documentUpdateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 30,
  message: '操作过于频繁，请稍后再试'
});
