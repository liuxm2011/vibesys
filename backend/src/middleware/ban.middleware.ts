import { Request, Response, NextFunction } from 'express';
import { prisma } from '../index.js';

/**
 * Check if user is banned before allowing sensitive operations
 * Phase 5: ADM-06 - banned users cannot create projects or edit documents
 */
export async function checkBannedMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: '未认证' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { status: true }
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    if (user.status === 'BANNED') {
      return res.status(403).json({ error: '账号已被封禁，无法执行此操作' });
    }

    next();
  } catch (error) {
    console.error('Ban check error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
}
