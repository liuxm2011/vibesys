import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { comparePassword } from '../utils/password.utils.js';
import { signToken, JwtPayload, getJwtExpirationMs } from '../utils/jwt.utils.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * POST /api/auth/login
 * D-02: studentId as login account
 * D-20: Unified error message
 */
router.post('/login', async (req: Request, res: Response) => {
  const { studentId, password } = req.body;

  // Input validation
  if (!studentId || !password) {
    return res.status(400).json({ error: '请输入学号和密码' });
  }

  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { studentId }
    });

    // Unified error: don't reveal if user exists (D-20)
    // Also check banned status (D-06)
    if (!user || user.status === 'BANNED') {
      return res.status(401).json({ error: '登录失败，请检查账号密码' });
    }

    // Verify password (constant-time compare)
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '登录失败，请检查账号密码' });
    }

    // Create JWT payload (AUTH-02: user info)
    const payload: JwtPayload = {
      userId: user.id,
      studentId: user.studentId,
      name: user.name,
      role: user.role
    };

    const token = signToken(payload);

    // Set httpOnly cookie (D-12)
    res.cookie('token', token, {
      httpOnly: true,                          // Prevent XSS access
      secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
      sameSite: 'strict',                      // CSRF protection
      maxAge: getJwtExpirationMs()             // 7 days (D-11)
    });

    // Return user info (AUTH-02)
    res.json({
      user: {
        studentId: user.studentId,
        name: user.name,
        role: user.role,
        major: user.major,
        grade: user.grade,
        class: user.class
      }
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

/**
 * POST /api/auth/logout
 * AUTH-03: Clear cookie and session
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.json({ message: '已登出' });
});

/**
 * GET /api/auth/profile
 * Requires auth middleware
 * Returns current user info from database
 */
router.get('/profile', authMiddleware, async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId }
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({
      studentId: user.studentId,
      name: user.name,
      role: user.role,
      major: user.major,
      grade: user.grade,
      class: user.class
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;