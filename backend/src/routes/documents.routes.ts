import { Router, Request, Response } from 'express';
import { DocType } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { prisma } from '../index.js';

const router = Router();

// Valid DocType values for validation
const validDocTypes: DocType[] = ['PRD', 'FRONTEND', 'BACKEND'];

/**
 * GET /api/documents/:projectId
 * DOC-01~03: Fetch all documents for a project
 * DOC-06: Include tech stack from topic
 *
 * IDOR prevention: Only owner can view documents
 */
router.get('/:projectId', authMiddleware, async (req: Request, res: Response) => {
  const projectIdParam = req.params.projectId;
  const projectId = parseInt(Array.isArray(projectIdParam) ? projectIdParam[0] : projectIdParam);

  if (isNaN(projectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  try {
    const userId = req.user!.userId;

    // IDOR prevention: Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId },
      include: {
        topic: {
          select: {
            techStack: true,
            title: true,
            domain: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    // Fetch documents for this project
    const documents = await prisma.document.findMany({
      where: { projectId },
      orderBy: { docType: 'asc' }
    });

    // DOC-06: Tech stack - use project.techStack if modified, else topic.techStack
    const techStack = project.techStack
      ? project.techStack.split(',').map(t => t.trim())
      : (project.topic.techStack as string[]);

    res.json({ documents, techStack });
  } catch (error) {
    console.error('Documents fetch error:', error);
    res.status(500).json({ error: '获取文档失败' });
  }
});

/**
 * PUT /api/documents/:id
 * DOC-05: Update document content (real-time save)
 * D-12: Real-time save with debouncing on frontend
 *
 * IDOR prevention: Only owner can update
 * DOS prevention: Content size limit 100KB
 */
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const idParam = req.params.id;
  const documentId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
  const { content } = req.body;

  if (isNaN(documentId)) {
    return res.status(400).json({ error: '无效的文档ID' });
  }

  // Validate content
  if (!content) {
    return res.status(400).json({ error: '请提供文档内容' });
  }

  // T-03-02-03: DOS prevention - 100KB limit
  const contentSize = Buffer.byteLength(content, 'utf8');
  if (contentSize > 100 * 1024) {
    return res.status(400).json({ error: '文档内容过大，最大100KB' });
  }

  try {
    // Fetch document with project to verify ownership
    const document = await prisma.document.findFirst({
      where: { id: documentId },
      include: { project: true }
    });

    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }

    // T-03-02-01: IDOR prevention - verify project ownership
    if (document.project.userId !== req.user!.userId) {
      return res.status(404).json({ error: '文档不存在或无权限访问' });
    }

    // Update document content
    const updated = await prisma.document.update({
      where: { id: documentId },
      data: { content }
    });

    res.json({ document: updated });
  } catch (error) {
    console.error('Document update error:', error);
    res.status(500).json({ error: '保存文档失败' });
  }
});

/**
 * POST /api/documents
 * Create empty document (lazy creation)
 *
 * Handles unique constraint gracefully - returns existing if already created
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { projectId, docType } = req.body;

  // Validate projectId
  if (!projectId) {
    return res.status(400).json({ error: '请提供项目ID' });
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  // T-03-02-04: Validate docType against enum
  if (!docType || !validDocTypes.includes(docType)) {
    return res.status(400).json({ error: '无效的文档类型' });
  }

  try {
    const userId = req.user!.userId;

    // IDOR prevention: Verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    // Try to create, handle unique constraint violation
    try {
      const document = await prisma.document.create({
        data: {
          projectId: parsedProjectId,
          docType: docType as DocType,
          content: ''  // Empty initial content
        }
      });

      res.json({ document });
    } catch (createError: any) {
      // Handle unique constraint - return existing document
      if (createError.code === 'P2002') {
        const existing = await prisma.document.findUnique({
          where: {
            projectId_docType: {
              projectId: parsedProjectId,
              docType: docType as DocType
            }
          }
        });
        res.json({ document: existing });
      } else {
        throw createError;
      }
    }
  } catch (error) {
    console.error('Document create error:', error);
    res.status(500).json({ error: '创建文档失败' });
  }
});

export default router;