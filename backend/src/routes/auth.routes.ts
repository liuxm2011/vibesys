import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { comparePassword, hashPassword, validatePassword } from '../utils/password.utils.js';
import { signToken, JwtPayload, getJwtExpirationMs } from '../utils/jwt.utils.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { loginLimiter } from '../middleware/rate-limit.middleware.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

router.post('/login', loginLimiter, async (c) => {
  const { studentId, password } = await c.req.json();

  if (!studentId || !password) {
    return c.json({ error: '请输入学号和密码' }, 400);
  }

  try {
    const prisma = c.get('prisma');
    const user = await prisma.user.findUnique({
      where: { studentId }
    });

    if (!user) {
      return c.json({ error: '登录失败，请检查账号密码' }, 401);
    }

    if (user.status === 'BANNED') {
      return c.json({ error: '账号已被封禁，请联系管理员' }, 403);
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return c.json({ error: '登录失败，请检查账号密码' }, 401);
    }

    const payload: JwtPayload = {
      userId: user.id,
      studentId: user.studentId,
      name: user.name,
      role: user.role
    };

    const token = await signToken(payload, c.env.JWT_SECRET);

    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: c.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: getJwtExpirationMs() / 1000,
      path: '/',
    });

    return c.json({
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
    return c.json({ error: '服务器错误' }, 500);
  }
});

router.post('/logout', (c) => {
  deleteCookie(c, 'token', {
    httpOnly: true,
    secure: c.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    path: '/',
  });
  return c.json({ message: '已登出' });
});

router.get('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    if (!dbUser) {
      return c.json({ error: '用户不存在' }, 404);
    }

    return c.json({
      studentId: dbUser.studentId,
      name: dbUser.name,
      role: dbUser.role,
      major: dbUser.major,
      grade: dbUser.grade,
      class: dbUser.class
    });
  } catch (error) {
    console.error('Profile error:', error);
    return c.json({ error: '服务器错误' }, 500);
  }
});

router.get('/system-config', authMiddleware, async (c) => {
  try {
    const prisma = c.get('prisma');
    const [announcement, guide] = await Promise.all([
      prisma.systemConfig.findUnique({ where: { key: 'announcement' } }),
      prisma.systemConfig.findUnique({ where: { key: 'guide' } })
    ]);

    return c.json({
      announcement: announcement?.value || '',
      guide: guide?.value || '',
      updatedAt: {
        announcement: announcement?.updatedAt || null,
        guide: guide?.updatedAt || null
      }
    });
  } catch (error) {
    console.error('Get system config error:', error);
    return c.json({ error: '获取平台信息失败' }, 500);
  }
});

router.put('/password', authMiddleware, async (c) => {
  const { currentPassword, newPassword } = await c.req.json();

  if (!currentPassword || !newPassword) {
    return c.json({ error: '请输入当前密码和新密码' }, 400);
  }

  const validationError = validatePassword(newPassword);
  if (validationError) {
    return c.json({ error: validationError }, 400);
  }

  if (currentPassword === newPassword) {
    return c.json({ error: '新密码不能与当前密码相同' }, 400);
  }

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId }
    });

    if (!dbUser) {
      return c.json({ error: '用户不存在' }, 404);
    }

    const isCurrentPasswordValid = await comparePassword(currentPassword, dbUser.password);
    if (!isCurrentPasswordValid) {
      return c.json({ error: '当前密码不正确' }, 400);
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { password: hashedPassword }
    });

    return c.json({ message: '密码修改成功' });
  } catch (error) {
    console.error('Change password error:', error);
    return c.json({ error: '修改密码失败' }, 500);
  }
});

export default router;
