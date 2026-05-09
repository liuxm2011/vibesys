import { Router, Request, Response } from 'express';
import { PrismaClient, ProjectStatus } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { prisma } from '../index.js';

const router = Router();

/**
 * POST /api/projects
 * TOPIC-04: Create project from topic selection
 * D-06: Creates project instance (not locks topic)
 * D-07: Same topic can be selected multiple times
 * D-08: Max 10 projects per user
 * D-10: Default status NOT_STARTED
 * D-11: Links user + topic
 * Phase 5: ADM-06 - Check if user is banned
 */
router.post('/', authMiddleware, checkBannedMiddleware, async (req: Request, res: Response) => {
  const { topicId } = req.body;

  // Validate topicId
  if (!topicId) {
    return res.status(400).json({ error: '请选择选题' });
  }

  const parsedTopicId = parseInt(topicId);
  if (isNaN(parsedTopicId)) {
    return res.status(400).json({ error: '无效的选题ID' });
  }

  try {
    const userId = req.user!.userId;

    // D-08: Check project count limit (max 10)
    const existingCount = await prisma.project.count({
      where: { userId }
    });

    if (existingCount >= 10) {
      return res.status(400).json({ error: '已达到项目上限(10个)，请删除现有项目后再创建' });
    }

    // Verify topic exists and user can access it (D-14 visibility)
    const topic = await prisma.topic.findFirst({
      where: {
        id: parsedTopicId,
        OR: [
          { type: 'SYSTEM' },
          { creatorId: userId }
        ]
      }
    });

    if (!topic) {
      return res.status(404).json({ error: '选题不存在或无权限访问' });
    }

    // D-06: Create project instance (not lock topic)
    // D-07: Same topic can be selected multiple times (no unique constraint)
    const project = await prisma.project.create({
      data: {
        userId,
        topicId: parsedTopicId,
        status: ProjectStatus.NOT_STARTED,  // D-10
        documentsRef: {}  // D-11: Placeholder for Phase 3
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            domain: true,
            type: true
          }
        }
      }
    });

    res.json({ project });
  } catch (error) {
    console.error('Project create error:', error);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
});

/**
 * GET /api/projects
 * DASH-01: View user's project list
 * DASH-02: View project status
 * Returns projects with topic info for dashboard display
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // DASH-01: List all user's projects
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            description: true,
            domain: true,
            type: true,
            techStack: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Cast techStack and documentsRef to proper types
    const typedProjects = projects.map(p => ({
      ...p,
      topic: {
        ...p.topic,
        techStack: p.topic.techStack as string[]
      },
      documentsRef: p.documentsRef as Record<string, any> | null
    }));

    res.json({ projects: typedProjects });
  } catch (error) {
    console.error('Projects list error:', error);
    res.status(500).json({ error: '获取项目列表失败' });
  }
});

/**
 * DELETE /api/projects/:id
 * D-09: Delete project (does NOT affect original topic)
 * IDOR prevention: Only owner can delete
 */
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const idParam = req.params.id;
    const projectId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);

    if (isNaN(projectId)) {
      return res.status(400).json({ error: '无效的项目ID' });
    }

    // IDOR prevention: Verify ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }

    // D-09: Delete project (topic remains in pool)
    await prisma.project.delete({
      where: { id: projectId }
    });

    res.json({ message: '项目已删除' });
  } catch (error) {
    console.error('Project delete error:', error);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
});

/**
 * GET /api/projects/:id
 * Export-03: Get project detail with topic info for export filename
 * IDOR prevention: Only owner can access
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const idParam = req.params.id;
    const projectId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);

    if (isNaN(projectId)) {
      return res.status(400).json({ error: '无效的项目ID' });
    }

    // IDOR prevention: Verify ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: {
        topic: {
          select: {
            title: true,
            description: true,
            domain: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    res.json({
      project: {
        ...project,
        reviewResult: project.reviewResult as Record<string, unknown> | null
      }
    });
  } catch (error) {
    console.error('Project detail error:', error);
    res.status(500).json({ error: '获取项目详情失败' });
  }
});

/**
 * PUT /api/projects/:id/techStack
 * DOC-07: Modify tech stack selection
 *
 * Allows user to modify the tech stack from topic recommendation
 * IDOR prevention: Only owner can modify
 */
router.put('/:id/techStack', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const idParam = req.params.id;
    const projectId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
    const { techStack } = req.body;

    if (isNaN(projectId)) {
      return res.status(400).json({ error: '无效的项目ID' });
    }

    // Validate techStack
    if (!techStack || typeof techStack !== 'string') {
      return res.status(400).json({ error: '请提供技术栈' });
    }

    // Reasonable length check
    if (techStack.length > 500) {
      return res.status(400).json({ error: '技术栈内容过长' });
    }

    // IDOR prevention: Verify ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    // Update tech stack
    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { techStack }
    });

    res.json({ project: { id: updated.id, techStack: updated.techStack } });
  } catch (error) {
    console.error('Tech stack update error:', error);
    res.status(500).json({ error: '更新技术栈失败' });
  }
});

export default router;
