import { Router, Request, Response } from 'express';
import { prisma } from '../index.js';
import { comparePassword } from '../utils/password.utils.js';
import { signToken, JwtPayload, getJwtExpirationMs } from '../utils/jwt.utils.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { loginLimiter } from '../middleware/rate-limit.middleware.js';

const router = Router();

/**
 * POST /api/auth/login
 * D-02: studentId as login account
 * D-20: Unified error message
 */
router.post('/login', loginLimiter, async (req: Request, res: Response) => {
  const { studentId, password } = req.body;

  // Input validation
  if (!studentId || !password) {
    return res.status(400).json({ error: '请输入学号和密码' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { studentId }
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: '登录失败，请检查账号密码' });
    }

    // Check banned status (Phase 5: ADM-06)
    if (user.status === 'BANNED') {
      return res.status(403).json({ error: '账号已被封禁，请联系管理员' });
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
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;