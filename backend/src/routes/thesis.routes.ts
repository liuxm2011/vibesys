import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

// GET /api/thesis/topics — list all topics with lock status
router.get('/topics', authMiddleware, async (c) => {
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
});

// GET /api/thesis/project — get current student's thesis project
router.get('/project', authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');

  const project = await prisma.thesisProject.findUnique({
    where: { userId: user.userId },
    include: { topic: true }
  });

  return c.json({ project });
});

// POST /api/thesis/select — exclusive topic selection with transaction
router.post('/select', authMiddleware, async (c) => {
  const body = await c.req.json();
  const topicId = typeof body?.topicId === 'number' ? body.topicId : null;
  if (!topicId) {
    return c.json({ error: '请提供有效的题目ID' }, 400);
  }

  const prisma = c.get('prisma');
  const user = c.get('user');

  // Check if student already has a thesis project
  const existing = await prisma.thesisProject.findUnique({
    where: { userId: user.userId }
  });
  if (existing) {
    return c.json({ error: '您已选择了毕业设计题目，请先放弃当前选题再重新选择' }, 409);
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const topic = await tx.thesisTopic.findUnique({ where: { id: topicId } });
      if (!topic) return { error: '题目不存在', status: 404 as const };
      if (topic.isLocked) return { error: '该题目已被其他同学选择，请选择其他题目', status: 409 as const };

      await tx.thesisTopic.update({
        where: { id: topicId },
        data: { isLocked: true, lockedAt: new Date(), lockedByUserId: user.userId }
      });

      const project = await tx.thesisProject.create({
        data: { userId: user.userId, topicId },
        include: { topic: true }
      });

      return { project };
    });

    if ('error' in result) {
      return c.json({ error: result.error }, result.status);
    }
    return c.json({ project: result.project }, 201);
  } catch (err: any) {
    if (err?.code === 'P2002') {
      return c.json({ error: '该题目刚刚被其他同学选择，请选择其他题目' }, 409);
    }
    console.error('Thesis select error:', err);
    return c.json({ error: '选题失败，请重试' }, 500);
  }
});

// DELETE /api/thesis/release — release topic back to pool
router.delete('/release', authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');

  const project = await prisma.thesisProject.findUnique({
    where: { userId: user.userId }
  });
  if (!project) {
    return c.json({ error: '您尚未选择毕业设计题目' }, 404);
  }

  await prisma.$transaction([
    prisma.thesisProject.delete({ where: { userId: user.userId } }),
    prisma.thesisTopic.update({
      where: { id: project.topicId },
      data: { isLocked: false, lockedAt: null, lockedByUserId: null }
    })
  ]);

  return c.json({ message: '已放弃选题，该题目已重新开放给其他同学' });
});

// PUT /api/thesis/project — update repo/deploy URL
router.put('/project', authMiddleware, async (c) => {
  const { repoUrl, deployUrl } = await c.req.json();
  const prisma = c.get('prisma');
  const user = c.get('user');

  const project = await prisma.thesisProject.findUnique({ where: { userId: user.userId } });
  if (!project) {
    return c.json({ error: '请先选择毕业设计题目' }, 404);
  }

  const updated = await prisma.thesisProject.update({
    where: { userId: user.userId },
    data: {
      ...(repoUrl !== undefined && { repoUrl }),
      ...(deployUrl !== undefined && { deployUrl }),
      updatedAt: new Date()
    },
    include: { topic: true }
  });

  return c.json({ project: updated });
});

export default router;
