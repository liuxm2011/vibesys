import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { GraduationDocType } from '../generated/prisma'
import { authMiddleware, viewerBlockMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { graduationService, type TokenUsage } from '../services/graduation.service.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

router.use('*', async (c, next) => {
  graduationService.setContext(c.get('prisma'), {
    MINIMAX_BASE_URL: c.env.MINIMAX_BASE_URL,
    MINIMAX_API_KEY: c.env.MINIMAX_API_KEY,
    MINIMAX_MODEL: c.env.MINIMAX_MODEL,
  });
  await next();
});

const validGraduationDocTypes: GraduationDocType[] = [
  'TASK_BOOK',
  'PROPOSAL',
  'PREPARATION',
  'DRAFTING',
  'MIDTERM_CHECK',
  'REFINEMENT'
];

async function recordAiUsage(
  prisma: any,
  userId: number,
  projectId: number | null,
  docType: string | null,
  operation: string,
  usage: TokenUsage,
  status: 'success' | 'error' | 'timeout',
  errorMessage?: string
): Promise<void> {
  try {
    await prisma.aiUsageLog.create({
      data: {
        userId,
        projectId,
        docType,
        operation,
        promptTokens: usage.promptTokens,
        completionTokens: usage.completionTokens,
        totalTokens: usage.totalTokens,
        status,
        errorMessage: errorMessage || null
      }
    });
  } catch (err) {
    console.error('[AI Usage Log] Failed to record graduation doc usage:', err);
  }
}

router.get('/:projectId', authMiddleware, async (c) => {
  const projectId = parseInt(c.req.param('projectId'));

  if (isNaN(projectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }

    const documents = await prisma.graduationDocument.findMany({
      where: { projectId },
      orderBy: { docType: 'asc' }
    });

    return c.json({ documents });
  } catch (error) {
    console.error('Graduation documents fetch error:', error);
    return c.json({ error: '获取毕设文档失败' }, 500);
  }
});

router.put('/:id', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  const documentId = parseInt(c.req.param('id'));
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

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');

    const document = await prisma.graduationDocument.findFirst({
      where: { id: documentId },
      include: { project: true }
    });

    if (!document) {
      return c.json({ error: '文档不存在' }, 404);
    }

    if (document.project.userId !== user.userId) {
      return c.json({ error: '文档不存在或无权限访问' }, 404);
    }

    const updated = await prisma.graduationDocument.update({
      where: { id: documentId },
      data: { content }
    });

    return c.json({ document: updated });
  } catch (error) {
    console.error('Graduation document update error:', error);
    return c.json({ error: '保存文档失败' }, 500);
  }
});

router.post('/', authMiddleware, viewerBlockMiddleware, async (c) => {
  const { projectId, docType } = await c.req.json();

  if (!projectId) {
    return c.json({ error: '请提供项目ID' }, 400);
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  if (!docType || !validGraduationDocTypes.includes(docType)) {
    return c.json({ error: '无效的文档类型' }, 400);
  }

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId }
    });

    if (!project) {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }

    try {
      const document = await prisma.graduationDocument.create({
        data: {
          projectId: parsedProjectId,
          docType: docType as GraduationDocType,
          content: ''
        }
      });

      return c.json({ document });
    } catch (createError: any) {
      if (createError.code === 'P2002') {
        const existing = await prisma.graduationDocument.findUnique({
          where: {
            projectId_docType: {
              projectId: parsedProjectId,
              docType: docType as GraduationDocType
            }
          }
        });
        return c.json({ document: existing });
      } else {
        throw createError;
      }
    }
  } catch (error) {
    console.error('Graduation document create error:', error);
    return c.json({ error: '创建文档失败' }, 500);
  }
});

router.post('/generate', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  const { projectId, docType, forceRegenerate } = await c.req.json();

  if (!projectId) {
    return c.json({ error: '请提供项目ID' }, 400);
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  if (!docType || !validGraduationDocTypes.includes(docType)) {
    return c.json({ error: '无效的文档类型' }, 400);
  }

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId },
      include: { topic: true, user: true, documents: true, graduationDocuments: true }
    });

    if (!project) {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }

    const topicInfo = {
      title: project.topic.title,
      description: project.topic.description,
      domain: project.topic.domain,
      platform: project.topic.platform,
      objectives: project.topic.objectives || '',
      techStack: (project.topic.techStack as string[]) || [],
      studentId: project.user.studentId,
      studentName: project.user.name,
      major: project.user.major,
      className: project.user.class,
      grade: project.user.grade
    };

    const prdDoc = project.documents.find(d => d.docType === 'PRD');
    const frontendDoc = project.documents.find(d => d.docType === 'FRONTEND');
    const backendDoc = project.documents.find(d => d.docType === 'BACKEND');
    const taskBookDoc = project.graduationDocuments.find(d => d.docType === 'TASK_BOOK');
    const proposalDoc = project.graduationDocuments.find(d => d.docType === 'PROPOSAL');

    const previousDocs = {
      prdContent: prdDoc?.content || '',
      frontendContent: frontendDoc?.content || '',
      backendContent: backendDoc?.content || '',
      taskBookContent: taskBookDoc?.content || '',
      proposalContent: proposalDoc?.content || ''
    };

    const result = await graduationService.generateDocument(
      docType as GraduationDocType,
      topicInfo,
      previousDocs,
      userId
    );

    const existing = await prisma.graduationDocument.findUnique({
      where: {
        projectId_docType: {
          projectId: parsedProjectId,
          docType: docType as GraduationDocType
        }
      }
    });

    let document;
    if (existing) {
      document = await prisma.graduationDocument.update({
        where: { id: existing.id },
        data: { content: result.content }
      });
    } else {
      document = await prisma.graduationDocument.create({
        data: {
          projectId: parsedProjectId,
          docType: docType as GraduationDocType,
          content: result.content
        }
      });
    }

    await recordAiUsage(prisma, userId, parsedProjectId, docType, 'generate', result.usage, 'success');

    return c.json({ document });
  } catch (error) {
    console.error('Graduation document generation error:', error);
    return c.json({
      error: error instanceof Error ? error.message : '生成失败'
    }, 500);
  }
});

router.post('/generate/stream', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  const { projectId, docType, forceRegenerate } = await c.req.json();

  if (!projectId) {
    return c.json({ error: '请提供项目ID' }, 400);
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  if (!docType || !validGraduationDocTypes.includes(docType)) {
    return c.json({ error: '无效的文档类型' }, 400);
  }

  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;

  const project = await prisma.project.findFirst({
    where: { id: parsedProjectId, userId },
    include: { topic: true, user: true, documents: true, graduationDocuments: true }
  });

  if (!project) {
    return c.json({ error: '项目不存在或无权限访问' }, 404);
  }

  const topicInfo = {
    title: project.topic.title,
    description: project.topic.description,
    domain: project.topic.domain,
    platform: project.topic.platform,
    objectives: project.topic.objectives || '',
    techStack: (project.topic.techStack as string[]) || [],
    studentId: project.user.studentId,
    studentName: project.user.name,
    major: project.user.major,
    className: project.user.class,
    grade: project.user.grade
  };

  const prdDoc = project.documents.find(d => d.docType === 'PRD');
  const frontendDoc = project.documents.find(d => d.docType === 'FRONTEND');
  const backendDoc = project.documents.find(d => d.docType === 'BACKEND');
  const taskBookDoc = project.graduationDocuments.find(d => d.docType === 'TASK_BOOK');
  const proposalDoc = project.graduationDocuments.find(d => d.docType === 'PROPOSAL');

  const previousDocs = {
    prdContent: prdDoc?.content || '',
    frontendContent: frontendDoc?.content || '',
    backendContent: backendDoc?.content || '',
    taskBookContent: taskBookDoc?.content || '',
    proposalContent: proposalDoc?.content || ''
  };

  const clientAbortController = new AbortController();

  return streamSSE(c, async (stream) => {
    stream.onAbort(() => {
      clientAbortController.abort();
    });

    try {
      const result = await graduationService.generateDocumentStream(
        docType as GraduationDocType,
        topicInfo,
        previousDocs,
        (progress) => {
          stream.writeSSE({ event: 'progress', data: JSON.stringify(progress) });
        },
        clientAbortController.signal,
        userId
      );

      const content = result.content;

      const existing = await prisma.graduationDocument.findUnique({
        where: {
          projectId_docType: {
            projectId: parsedProjectId,
            docType: docType as GraduationDocType
          }
        }
      });

      let document;
      if (existing) {
        document = await prisma.graduationDocument.update({
          where: { id: existing.id },
          data: { content }
        });
      } else {
        document = await prisma.graduationDocument.create({
          data: {
            projectId: parsedProjectId,
            docType: docType as GraduationDocType,
            content
          }
        });
      }

      await recordAiUsage(prisma, userId, parsedProjectId, docType, 'generate_stream', result.usage, 'success');

      await stream.writeSSE({ event: 'complete', data: JSON.stringify({ document }) });
    } catch (error) {
      if (clientAbortController.signal.aborted) {
        return;
      }

      console.error('Graduation document stream error:', error);
      const errMsg = error instanceof Error ? error.message : '生成失败';
      await stream.writeSSE({ event: 'error', data: JSON.stringify({ message: errMsg }) });
    }
  });
});

export default router;
