import { createMiddleware } from 'hono/factory';
import { getCookie } from 'hono/cookie';
import { verifyToken } from '../utils/jwt.utils.js';
import { logger } from '../lib/logger.js';
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

  // P1-6：封禁状态查库校验（原 checkBannedMiddleware 逐路由挂载覆盖不一致，
  // JWT 内嵌角色且无吊销，封禁用户的旧 token 在有效期内仍可通过漏挂路由写操作）。
  // 每请求一次 PK 查询，D1 下开销可接受。
  try {
    const prisma = c.get('prisma');
    const dbUser = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { status: true }
    });

    if (dbUser?.status === 'BANNED') {
      return c.json({ error: '账号已被封禁，无法执行此操作' }, 403);
    }
  } catch (error) {
    logger.error('Ban check error:', error);
    return c.json({ error: '服务器错误' }, 500);
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
