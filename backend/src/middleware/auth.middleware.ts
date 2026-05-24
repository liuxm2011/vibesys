import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { verifyToken } from '../utils/jwt.utils.js';
import type { AppEnv } from '../types.js';

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const token = getCookie(c, 'token');

  if (!token) {
    return c.json({ error: '请先登录' }, 401);
  }

  const payload = await verifyToken(token, c.env.JWT_SECRET);

  if (!payload) {
    return c.json({ error: '登录已过期，请重新登录' }, 401);
  }

  c.set('user', payload);
  await next();
});

export const adminOnlyMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get('user');
  if (user?.role !== 'ADMIN') {
    return c.json({ error: '权限不足' }, 403);
  }
  await next();
});

export const viewerBlockMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const user = c.get('user');
  if (user?.role === 'VIEWER') {
    return c.json({ error: '测试账号仅可查看，无法执行此操作' }, 403);
  }
  await next();
});
