import { Hono } from 'hono';
import { authMiddleware, viewerBlockMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

// GET /api/thesis/status — check if graduation mode is enabled for current user
router.get('/status', authMiddleware, async (c) => {
  try {
    const prisma = c.get('prisma');
    const user = c.get('user');

    const enabledConfig = await prisma.systemConfig.findUnique({
      where: { key: 'graduationEnabled' }
    });

    const isEnabled = enabledConfig?.value === 'true';

    if (isEnabled) {
      return c.json({ enabled: true });
    }

    // Check whitelist
    const whitelistConfig = await prisma.systemConfig.findUnique({
      where: { key: 'graduationWhitelist' }
    });

    const whitelist = (whitelistConfig?.value || '').split(',').map(s => s.trim()).filter(Boolean);

    if (whitelist.includes(user.studentId)) {
      return c.json({ enabled: true });
    }

    return c.json({ enabled: false });
  } catch (error) {
    console.error('Graduation status check error:', error);
    return c.json({ enabled: false });
  }
});

// GET /api/thesis/topics — list all topics with lock status
router.get('/topics', authMiddleware, async (c) => {
  try {
    const prisma = c.get('prisma');
    const user = c.get('user');

    const topics = await prisma.thesisTopic.findMany({
      orderBy: [{ category: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        title: true,
        category: true,
        datasetName: true,
        datasetUrl: true,
        datasetSize: true,
        isLocked: true,
        lockedAt: true,
        lockedByUserId: true,
      }
    });

    // Only reveal lockedByUserId to the student who locked it
    const result = topics.map(t => ({
      ...t,
      isLockedByMe: t.lockedByUserId === user.userId,
      lockedByUserId: t.lockedByUserId === user.userId ? t.lockedByUserId : undefined,
    }));

    return c.json({ topics: result });
  } catch (err) {
    console.error('Thesis topics error:', err);
    return c.json({ error: '获取题目列表失败' }, 500);
  }
});

// GET /api/thesis/project — get current student's thesis project
router.get('/project', authMiddleware, async (c) => {
  try {
    const prisma = c.get('prisma');
    const user = c.get('user');

    const project = await prisma.thesisProject.findUnique({
      where: { userId: user.userId },
      include: { topic: true }
    });

    return c.json({ project });
  } catch (err) {
    console.error('Thesis project error:', err);
    return c.json({ error: '获取项目信息失败' }, 500);
  }
});

// POST /api/thesis/select — exclusive topic selection (D1 native batch for atomicity)
router.post('/select', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  const body = await c.req.json().catch(() => null);
  const topicId = typeof body?.topicId === 'number' && body.topicId > 0 ? body.topicId : null;
  if (!topicId) {
    return c.json({ error: '请提供有效的题目ID' }, 400);
  }

  const prisma = c.get('prisma');
  const user = c.get('user');
  const db = c.env.DB; // D1 binding

  // Only students may select topics
  if (user.role !== 'STUDENT') {
    return c.json({ error: '仅学生可以选择毕业设计题目' }, 403);
  }

  const now = new Date().toISOString();

  try {
    // Atomic: only update if isLocked=0, and insert ThesisProject in same batch
    const [updateResult] = await db.batch([
      db.prepare(
        `UPDATE "ThesisTopic" SET "isLocked"=1, "lockedAt"=?, "lockedByUserId"=? WHERE "id"=? AND "isLocked"=0`
      ).bind(now, user.userId, topicId),
      db.prepare(
        `INSERT INTO "ThesisProject" ("userId","topicId","createdAt","updatedAt") VALUES (?,?,?,?)`
      ).bind(user.userId, topicId, now, now),
    ]);

    // If 0 rows affected on UPDATE, topic was already locked or doesn't exist
    if (updateResult.meta.changes === 0) {
      // Check if topic exists at all
      const topic = await prisma.thesisTopic.findUnique({ where: { id: topicId }, select: { id: true, isLocked: true } });
      if (!topic) return c.json({ error: '题目不存在' }, 404);
      return c.json({ error: '该题目已被其他同学选择，请选择其他题目' }, 409);
    }

    // Fetch the created project for response
    const project = await prisma.thesisProject.findUnique({
      where: { userId: user.userId },
      include: { topic: true }
    });
    return c.json({ project }, 201);
  } catch (err: any) {
    // P2002 or SQLITE UNIQUE constraint: could be userId already has a project, or topicId taken
    if (err?.code === 'P2002' || (typeof err?.message === 'string' && err.message.includes('UNIQUE'))) {
      // Could be topicId taken by someone else, or userId already has a project — disambiguate
      const hasProject = await prisma.thesisProject.findUnique({ where: { userId: user.userId } });
      if (hasProject) {
        return c.json({ error: '您已选择了毕业设计题目，请先放弃当前选题再重新选择' }, 409);
      }
      return c.json({ error: '该题目刚刚被其他同学选择，请选择其他题目' }, 409);
    }
    console.error('Thesis select error:', err);
    return c.json({ error: '选题失败，请重试' }, 500);
  }
});

// DELETE /api/thesis/release — release topic back to pool
router.delete('/release', authMiddleware, viewerBlockMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');
  const db = c.env.DB;

  try {
    const project = await prisma.thesisProject.findUnique({
      where: { userId: user.userId }
    });
    if (!project) {
      return c.json({ error: '您尚未选择毕业设计题目' }, 404);
    }

    const topicId = project.topicId;

    await db.batch([
      db.prepare(`DELETE FROM "ThesisProject" WHERE "userId"=?`).bind(user.userId),
      db.prepare(`UPDATE "ThesisTopic" SET "isLocked"=0, "lockedAt"=NULL, "lockedByUserId"=NULL WHERE "id"=?`).bind(topicId),
    ]);

    return c.json({ message: '已放弃选题，该题目已重新开放给其他同学' });
  } catch (err) {
    console.error('Thesis release error:', err);
    return c.json({ error: '操作失败，请重试' }, 500);
  }
});

// PUT /api/thesis/project — update repo/deploy URL
router.put('/project', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { repoUrl, deployUrl } = body;
  const prisma = c.get('prisma');
  const user = c.get('user');

  try {
    const project = await prisma.thesisProject.findUnique({ where: { userId: user.userId } });
    if (!project) {
      return c.json({ error: '请先选择毕业设计题目' }, 404);
    }

    const updated = await prisma.thesisProject.update({
      where: { userId: user.userId },
      data: {
        ...(repoUrl !== undefined && { repoUrl }),
        ...(deployUrl !== undefined && { deployUrl }),
      },
      include: { topic: true }
    });

    return c.json({ project: updated });
  } catch (err) {
    console.error('Thesis project update error:', err);
    return c.json({ error: '保存失败，请重试' }, 500);
  }
});

export default router;
