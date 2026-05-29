import { Hono } from 'hono';
import { DocType } from '../generated/prisma'
import { authMiddleware, viewerBlockMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { getGenerationBlockedReason } from '../constants/document-generation.js';
import { asyncHandler } from '../lib/handler.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

const validDocTypes: DocType[] = ['PRD', 'FRONTEND', 'BACKEND', 'API', 'TASK', 'CONTEXT_STATE', 'AGENTS'];

router.get('/:projectId', authMiddleware, asyncHandler('获取文档失败', async (c) => {
  const projectId = parseInt(c.req.param('projectId')!);

  if (isNaN(projectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;

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
    return c.json({ error: '项目不存在或无权限访问' }, 404);
  }

  const documents = await prisma.document.findMany({
    where: { projectId },
    orderBy: { docType: 'asc' }
  });

  const techStack = project.techStack
    ? project.techStack.split(',').map(t => t.trim())
    : (project.topic.techStack as string[]);

  return c.json({ documents, techStack });
}));

router.put('/:id', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, asyncHandler('保存文档失败', async (c) => {
  const documentId = parseInt(c.req.param('id')!);
  const { content } = await c.req.json();

  if (isNaN(documentId)) {
    return c.json({ error: '无效的文档ID' }, 400);
  }

  if (!content) {
    return c.json({ error: '请提供文档内容' }, 400);
  }

  const contentSize = new TextEncoder().encode(content).length;
  if (contentSize > 100 * 1024) {
    return c.json({ error: '文档内容过大，最大100KB' }, 400);
  }

  const user = c.get('user');
  const prisma = c.get('prisma');

  const document = await prisma.document.findFirst({
    where: { id: documentId },
    include: { project: true }
  });

  if (!document) {
    return c.json({ error: '文档不存在' }, 404);
  }

  if (document.project.userId !== user.userId) {
    return c.json({ error: '文档不存在或无权限访问' }, 404);
  }

  const updated = await prisma.document.update({
    where: { id: documentId },
    data: { content }
  });

  return c.json({ document: updated });
}));

router.post('/', authMiddleware, viewerBlockMiddleware, asyncHandler('创建文档失败', async (c) => {
  const { projectId, docType } = await c.req.json();

  if (!projectId) {
    return c.json({ error: '请提供项目ID' }, 400);
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  if (!docType || !validDocTypes.includes(docType)) {
    return c.json({ error: '无效的文档类型' }, 400);
  }

  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;

  const project = await prisma.project.findFirst({
    where: { id: parsedProjectId, userId }
  });

  if (!project) {
    return c.json({ error: '项目不存在或无权限访问' }, 404);
  }

  const allDocs = await prisma.document.findMany({
    where: { projectId: parsedProjectId }
  });

  const blockedReason = getGenerationBlockedReason(docType as DocType, allDocs);
  if (blockedReason) {
    return c.json({
      error: blockedReason,
      code: 'DOCUMENT_STAGE_BLOCKED'
    }, 409);
  }

  // Inner try/catch handles the unique-constraint race (P2002): return the
  // existing doc instead of failing. Other errors bubble up to asyncHandler.
  try {
    const document = await prisma.document.create({
      data: {
        projectId: parsedProjectId,
        docType: docType as DocType,
        content: ''
      }
    });

    return c.json({ document });
  } catch (createError: any) {
    if (createError.code === 'P2002') {
      const existing = await prisma.document.findUnique({
        where: {
          projectId_docType: {
            projectId: parsedProjectId,
            docType: docType as DocType
          }
        }
      });
      return c.json({ document: existing });
    } else {
      throw createError;
    }
  }
}));

export default router;
