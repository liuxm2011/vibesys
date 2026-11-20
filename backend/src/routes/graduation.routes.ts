import { Hono } from 'hono';
import type { PrismaClient } from '../generated/prisma';
import { authMiddleware, viewerBlockMiddleware } from '../middleware/auth.middleware.js';
import { graduationAccessMiddleware } from '../middleware/graduation.middleware.js';
import { aiLimiter, documentUpdateLimiter } from '../middleware/rate-limit.middleware.js';
import { graduationService, type GenerationProgress, type TokenUsage } from '../services/graduation.service.js';
import {
  GRADUATION_STAGES, HANDBOOK_DOCUMENT_TYPES, isHandbookDocumentType, loadGraduationCalendar,
  parseHandbookProfile, readHandbookProfile,
} from '../services/graduation-handbook.js';
import { canRenderEmptyHandbookDraft } from '../services/graduation-handbook-document.js';
import { getLinkedGraduationAccessError } from '../services/graduation-gate.js';
import { asyncHandler } from '../lib/handler.js';
import type { AppEnv } from '../types.js';
import { logger } from '../lib/logger.js';
import { DocumentStreamError, streamDocumentResponse } from '../lib/document-stream.js';

const router = new Hono<AppEnv>();

const handbookProfileType = 'HANDBOOK_PROFILE';

async function loadGenerationProject(prisma: PrismaClient, projectId: number, userId: number) {
  return prisma.project.findFirst({
    where: { id: projectId, userId },
    select: {
      techStack: true,
      topic: { select: { title: true, description: true, domain: true, platform: true, objectives: true, techStack: true } },
      user: { select: { studentId: true, name: true, major: true, class: true } },
      documents: {
        where: { docType: { in: ['PRD', 'FRONTEND', 'BACKEND'] } },
        select: { docType: true, content: true },
      },
      graduationDocuments: { select: { id: true, projectId: true, docType: true, content: true, createdAt: true, updatedAt: true } },
      thesisProject: { select: { topic: { select: { datasetName: true, category: true } } } },
    },
  });
}

async function getGenerationContext(prisma: PrismaClient, project: NonNullable<Awaited<ReturnType<typeof loadGenerationProject>>>) {
  const graduationContent = (type: string) => project.graduationDocuments.find(doc => doc.docType === type)?.content ?? '';
  const projectContent = (type: string) => project.documents.find(doc => doc.docType === type)?.content ?? '';
  const handbook = readHandbookProfile(graduationContent(handbookProfileType));
  const calendar = await loadGraduationCalendar(prisma, handbook.cohort);
  const suggestedStack = Array.isArray(project.topic.techStack) ? project.topic.techStack.filter(item => typeof item === 'string') : [];
  const techStack = project.techStack?.split(/[,，、]/u).map(item => item.trim()).filter(Boolean);
  return {
    topic: {
      ...project.topic,
      techStack: techStack?.length ? techStack : suggestedStack,
      studentId: project.user.studentId,
      studentName: project.user.name,
      major: project.user.major,
      className: project.user.class,
      datasetName: project.thesisProject?.topic.datasetName,
      datasetCategory: project.thesisProject?.topic.category,
      handbook,
      calendar,
    },
    previous: {
      prdContent: projectContent('PRD'),
      frontendContent: projectContent('FRONTEND'),
      backendContent: projectContent('BACKEND'),
      taskBookContent: graduationContent('TASK_BOOK'),
      proposalContent: graduationContent('PROPOSAL'),
      progressContents: GRADUATION_STAGES.map(graduationContent),
    },
  };
}

async function saveGeneratedDocument(
  prisma: PrismaClient, projectId: number, docType: typeof HANDBOOK_DOCUMENT_TYPES[number], content: string,
  forceRegenerate: boolean,
) {
  const where = { projectId_docType: { projectId, docType } };
  const create = { projectId, docType, content };
  const document = await prisma.graduationDocument.upsert({
    where,
    update: forceRegenerate ? { content } : {},
    create,
  }).catch(error => {
    if (forceRegenerate || error?.code !== 'P2002') throw error;
    return prisma.graduationDocument.findUniqueOrThrow({ where });
  });
  if (forceRegenerate || document.content.trim()) return document;

  // A manual save or a second generation may have changed this previously empty draft.
  await prisma.graduationDocument.updateMany({
    where: { id: document.id, content: document.content },
    data: { content },
  });
  return prisma.graduationDocument.findUniqueOrThrow({ where });
}

async function recordAiUsage(
  prisma: PrismaClient,
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
    logger.error('[AI Usage Log] Failed to record graduation doc usage:', err);
  }
}

router.get('/:projectId', authMiddleware, asyncHandler('获取毕设文档失败', async (c) => {
  const projectId = parseInt(c.req.param('projectId')!);

  if (isNaN(projectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;

  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { thesisProject: { select: { id: true } } }
  });

  if (!project) {
    return c.json({ error: '项目不存在或无权限访问' }, 404);
  }

  const accessError = await getLinkedGraduationAccessError(prisma, user, project.thesisProject);
  if (accessError) return c.json({ error: accessError }, 403);

  const documents = await prisma.graduationDocument.findMany({
    where: { projectId, docType: { in: [...HANDBOOK_DOCUMENT_TYPES] } },
    orderBy: { docType: 'asc' }
  });

  return c.json({ documents });
}));

router.get('/:projectId/handbook', authMiddleware, asyncHandler('获取手册资料失败', async (c) => {
  const projectId = Number(c.req.param('projectId'));
  if (!Number.isSafeInteger(projectId) || projectId <= 0) return c.json({ error: '无效的项目ID' }, 400);
  const user = c.get('user');
  const prisma = c.get('prisma');
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.userId },
    select: {
      topic: { select: { title: true } },
      user: { select: { studentId: true, name: true, major: true, class: true } },
      thesisProject: { select: { id: true } },
    },
  });
  if (!project) return c.json({ error: '项目不存在或无权限访问' }, 404);
  const accessError = await getLinkedGraduationAccessError(prisma, user, project.thesisProject);
  if (accessError) return c.json({ error: accessError }, 403);

  const row = await prisma.graduationDocument.findUnique({
    where: { projectId_docType: { projectId, docType: handbookProfileType } },
    select: { content: true },
  });
  const profile = readHandbookProfile(row?.content);
  const calendar = await loadGraduationCalendar(prisma, profile.cohort);
  return c.json({
    profile, calendar,
    identity: {
      studentId: project.user.studentId, name: project.user.name,
      majorClass: [project.user.major, project.user.class].filter(Boolean).join(' '),
      title: project.topic.title,
    },
  });
}));

router.put('/:projectId/handbook', authMiddleware, viewerBlockMiddleware, documentUpdateLimiter, asyncHandler('保存手册资料失败', async (c) => {
  const projectId = Number(c.req.param('projectId'));
  if (!Number.isSafeInteger(projectId) || projectId <= 0) return c.json({ error: '无效的项目ID' }, 400);
  const profile = parseHandbookProfile(await c.req.json());
  if (!profile) return c.json({ error: '手册资料格式无效，请检查届别、日期和字段长度' }, 400);
  const user = c.get('user');
  const prisma = c.get('prisma');
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: user.userId },
    select: { thesisProject: { select: { id: true } } },
  });
  if (!project) return c.json({ error: '项目不存在或无权限访问' }, 404);
  const accessError = await getLinkedGraduationAccessError(prisma, user, project.thesisProject);
  if (accessError) return c.json({ error: accessError }, 403);

  const content = JSON.stringify(profile);
  await prisma.graduationDocument.upsert({
    where: { projectId_docType: { projectId, docType: handbookProfileType } },
    update: { content },
    create: { projectId, docType: handbookProfileType, content },
  });
  return c.json({ profile, calendar: await loadGraduationCalendar(prisma, profile.cohort) });
}));

router.put('/:id', authMiddleware, documentUpdateLimiter, viewerBlockMiddleware, asyncHandler('保存文档失败', async (c) => {
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

  const document = await prisma.graduationDocument.findFirst({
    where: { id: documentId },
    include: { project: { select: { userId: true, thesisProject: { select: { id: true } } } } }
  });

  if (!document || !isHandbookDocumentType(document.docType)) {
    return c.json({ error: '文档不存在' }, 404);
  }

  if (document.project.userId !== user.userId) {
    return c.json({ error: '文档不存在或无权限访问' }, 404);
  }

  const accessError = await getLinkedGraduationAccessError(prisma, user, document.project.thesisProject);
  if (accessError) return c.json({ error: accessError }, 403);

  const updated = await prisma.graduationDocument.update({
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

  if (!isHandbookDocumentType(docType)) {
    return c.json({ error: '无效的文档类型' }, 400);
  }

  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;

  const project = await prisma.project.findFirst({
    where: { id: parsedProjectId, userId },
    select: { thesisProject: { select: { id: true } } }
  });

  if (!project) {
    return c.json({ error: '项目不存在或无权限访问' }, 404);
  }

  const accessError = await getLinkedGraduationAccessError(prisma, user, project.thesisProject);
  if (accessError) return c.json({ error: accessError }, 403);

  // Inner try/catch handles the unique-constraint race (P2002): return the
  // existing doc instead of failing. Other errors bubble up to asyncHandler.
  try {
    const document = await prisma.graduationDocument.create({
      data: {
        projectId: parsedProjectId,
        docType: docType,
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
            docType: docType
          }
        }
      });
      return c.json({ document: existing });
    } else {
      throw createError;
    }
  }
}));

router.post('/generate', authMiddleware, graduationAccessMiddleware, async (c) => {
  const { projectId, docType, forceRegenerate } = await c.req.json();

  if (!projectId) {
    return c.json({ error: '请提供项目ID' }, 400);
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  if (!isHandbookDocumentType(docType)) {
    return c.json({ error: '无效的文档类型' }, 400);
  }

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

    const project = await loadGenerationProject(prisma, parsedProjectId, userId);
    if (!project) return c.json({ error: '项目不存在或无权限访问' }, 404);
    const existing = project.graduationDocuments.find(doc => doc.docType === docType);
    if (existing?.content.trim() && forceRegenerate !== true) return c.json({ document: existing });

    const { topic, previous } = await getGenerationContext(prisma, project);
    if (!canRenderEmptyHandbookDraft(docType, topic)) {
      const limited = await aiLimiter(c, async () => {});
      if (limited) return limited;
    }
    const result = await graduationService.generateDocument(docType, topic, previous, { userId, prisma, env: c.env });
    const document = await saveGeneratedDocument(prisma, parsedProjectId, docType, result.content, forceRegenerate === true);

    await recordAiUsage(prisma, userId, parsedProjectId, docType, 'generate', result.usage, 'success');

    return c.json({ document });
  } catch (error) {
    logger.error('Graduation document generation error:', error);
    // Detailed error (which may include the upstream response body) is logged
    // only — the client gets a generic message, same as the stream endpoints.
    return c.json({ error: error instanceof DocumentStreamError ? error.message : '生成失败，请稍后重试' }, 500);
  }
});

router.post('/generate/stream', authMiddleware, graduationAccessMiddleware, async (c) => {
  const { projectId, docType, forceRegenerate } = await c.req.json();

  if (!projectId) {
    return c.json({ error: '请提供项目ID' }, 400);
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  if (!isHandbookDocumentType(docType)) {
    return c.json({ error: '无效的文档类型' }, 400);
  }

  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;

  const project = await loadGenerationProject(prisma, parsedProjectId, userId);
  if (!project) return c.json({ error: '项目不存在或无权限访问' }, 404);
  const existing = project.graduationDocuments.find(doc => doc.docType === docType);
  if (existing?.content.trim() && forceRegenerate !== true) {
    return streamDocumentResponse(c, async stream => {
      await stream.writeSSE({ event: 'complete', data: JSON.stringify({ document: existing }) });
    });
  }
  const { topic, previous } = await getGenerationContext(prisma, project);
  if (!canRenderEmptyHandbookDraft(docType, topic)) {
    const limited = await aiLimiter(c, async () => {});
    if (limited) return limited;
  }

  return streamDocumentResponse(c, async (stream, signal) => {
    const sendProgress = (progress: GenerationProgress) =>
      stream.writeSSE({ event: 'progress', data: JSON.stringify(progress) });

    try {
      await sendProgress({ phase: 'connecting', reasoningText: '', contentText: '' });
      const result = await graduationService.generateDocumentStream(
        docType,
        topic,
        previous,
        sendProgress,
        { signal, userId, prisma, env: c.env }
      );

      signal.throwIfAborted();
      const document = await saveGeneratedDocument(prisma, parsedProjectId, docType, result.content, forceRegenerate === true);

      await recordAiUsage(prisma, userId, parsedProjectId, docType, 'generate_stream', result.usage, 'success');

      await stream.writeSSE({ event: 'complete', data: JSON.stringify({ document }) });
    } catch (error) {
      if (signal.aborted) {
        return;
      }

      logger.error('Graduation document stream error:', error);
      const message = error instanceof DocumentStreamError
        ? error.message
        : '生成失败，请稍后重试';
      await stream.writeSSE({ event: 'error', data: JSON.stringify({ message }) });
    }
  });
});

export default router;
