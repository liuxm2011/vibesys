import { Hono } from 'hono';
import { authMiddleware, viewerBlockMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { asyncHandler } from '../lib/handler.js';
import type { AppEnv } from '../types.js';
import { logger } from '../lib/logger.js';

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
    logger.error('Graduation status check error:', error);
    return c.json({ enabled: false });
  }
});

// GET /api/thesis/topics — list all topics with lock status
router.get('/topics', authMiddleware, asyncHandler('获取题目列表失败', async (c) => {
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
}));

// GET /api/thesis/project — get current student's thesis project
router.get('/project', authMiddleware, asyncHandler('获取项目信息失败', async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');

  const project = await prisma.thesisProject.findUnique({
    where: { userId: user.userId },
    include: { topic: true }
  });

  return c.json({ project });
}));

// POST /api/thesis/project/init-docs — lazily create a linked Project for document generation
router.post('/project/init-docs', authMiddleware, viewerBlockMiddleware, asyncHandler('初始化文档失败，请重试', async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');
  const db = c.env.DB;

  const thesisProject = await prisma.thesisProject.findUnique({
    where: { userId: user.userId },
    include: { topic: true }
  });

  if (!thesisProject) {
    return c.json({ error: '请先选择毕业设计题目' }, 404);
  }

  // Already linked — return immediately
  if (thesisProject.projectId) {
    return c.json({ projectId: thesisProject.projectId });
  }

  const topic = thesisProject.topic;

  // Infer description from topic info
  const description = `本课题基于${topic.datasetName}数据集（${topic.category}），实现${topic.title}，通过数据预处理、特征工程、模型训练与调优，以可视化界面展示分析结果与预测效果。`;
  const objectives = `掌握${topic.category}方向的核心算法与工程实现；基于${topic.datasetName}数据集完成完整的数据分析与建模流程；构建可交互的Web可视化展示系统。`;

  // Infer tech stack from category keywords
  const inferTechStack = (category: string): string[] => {
    if (category.includes('深度学习') || category.includes('神经网络')) {
      return ['Python', 'PyTorch', 'pandas', 'numpy', 'Flask', 'Vue 3', 'ECharts'];
    }
    if (category.includes('自然语言') || category.includes('NLP') || category.includes('文本')) {
      return ['Python', 'transformers', 'pandas', 'Flask', 'Vue 3', 'ECharts'];
    }
    if (category.includes('计算机视觉') || category.includes('图像')) {
      return ['Python', 'PyTorch', 'OpenCV', 'Flask', 'Vue 3', 'ECharts'];
    }
    if (category.includes('数据可视化')) {
      return ['Python', 'pandas', 'matplotlib', 'Flask', 'Vue 3', 'ECharts'];
    }
    // Default: machine learning / tabular data
    return ['Python', 'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'Flask', 'Vue 3'];
  };

  const techStack = inferTechStack(topic.category);

  // Create Topic + Project for this thesis
  const dbUser = await prisma.user.findUnique({ where: { id: user.userId }, select: { id: true } });
  if (!dbUser) return c.json({ error: '用户不存在' }, 404);

  const newTopic = await prisma.topic.create({
    data: {
      title: topic.title,
      description,
      objectives,
      domain: 'BD',
      platform: 'WEB',
      techStack,
      type: 'SYSTEM',
    }
  });

  const newProject = await prisma.project.create({
    data: {
      userId: user.userId,
      topicId: newTopic.id,
    }
  });

  // Atomically link: only update if projectId is still NULL (handles race conditions)
  const [updateResult] = await db.batch([
    db.prepare(`UPDATE "ThesisProject" SET "projectId"=?, "updatedAt"=? WHERE "userId"=? AND "projectId" IS NULL`)
      .bind(newProject.id, new Date().toISOString(), user.userId),
  ]);

  if ((updateResult as any).meta.changes === 0) {
    // Concurrent request already linked — clean up the project we just created and return the winner
    await prisma.project.delete({ where: { id: newProject.id } });
    await prisma.topic.delete({ where: { id: newTopic.id } });
    const current = await prisma.thesisProject.findUnique({ where: { userId: user.userId } });
    return c.json({ projectId: current!.projectId });
  }

  return c.json({ projectId: newProject.id });
}));

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
    logger.error('Thesis select error:', err);
    return c.json({ error: '选题失败，请重试' }, 500);
  }
});

// DELETE /api/thesis/release — release topic back to pool
router.delete('/release', authMiddleware, viewerBlockMiddleware, asyncHandler('操作失败，请重试', async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');
  const db = c.env.DB;

  const thesisProject = await prisma.thesisProject.findUnique({
    where: { userId: user.userId }
  });
  if (!thesisProject) {
    return c.json({ error: '您尚未选择毕业设计题目' }, 404);
  }

  const topicId = thesisProject.topicId;
  const linkedProjectId = thesisProject.projectId;

  // Delete ThesisProject + unlock topic atomically
  // Cascade on Project will auto-delete Documents and GraduationDocuments
  const batchOps: any[] = [
    db.prepare(`DELETE FROM "ThesisProject" WHERE "userId"=?`).bind(user.userId),
    db.prepare(`UPDATE "ThesisTopic" SET "isLocked"=0, "lockedAt"=NULL, "lockedByUserId"=NULL WHERE "id"=?`).bind(topicId),
  ];

  if (linkedProjectId) {
    batchOps.push(
      db.prepare(`DELETE FROM "Project" WHERE "id"=? AND "userId"=?`).bind(linkedProjectId, user.userId)
    );
  }

  await db.batch(batchOps);

  return c.json({ message: '已放弃选题，该题目已重新开放给其他同学' });
}));

// PUT /api/thesis/project — update repo/deploy URL
router.put('/project', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, asyncHandler('保存失败，请重试', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { repoUrl, deployUrl } = body;
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
    },
    include: { topic: true }
  });

  return c.json({ project: updated });
}));

export default router;
