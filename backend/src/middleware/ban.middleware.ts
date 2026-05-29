import { createMiddleware } from 'hono/factory';
import type { AppEnv } from '../types.js';
import { logger } from '../lib/logger.js';

export const checkBannedMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');

    if (!user?.userId) {
      return c.json({ error: '未认证' }, 401);
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { status: true }
    });

    if (!dbUser) {
      return c.json({ error: '用户不存在' }, 404);
    }

    if (dbUser.status === 'BANNED') {
      return c.json({ error: '账号已被封禁，无法执行此操作' }, 403);
    }

    await next();
  } catch (error) {
    logger.error('Ban check error:', error);
    return c.json({ error: '服务器错误' }, 500);
  }
});
