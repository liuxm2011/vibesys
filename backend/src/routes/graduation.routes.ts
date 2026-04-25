import { Router, Request, Response } from 'express';
import { GraduationDocType } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { prisma } from '../index.js';
import { graduationService, type TokenUsage } from '../services/graduation.service.js';

const router = Router();

const validGraduationDocTypes: GraduationDocType[] = [
  'TASK_BOOK',
  'PROPOSAL',
  'PREPARATION',
  'DRAFTING',
  'MIDTERM_CHECK',
  'REFINEMENT'
];

async function recordAiUsage(
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

/**
 * GET /api/graduation/:projectId
 * Fetch all graduation documents for a project
 */
router.get('/:projectId', authMiddleware, async (req: Request, res: Response) => {
  const projectIdParam = req.params.projectId;
  const projectId = parseInt(Array.isArray(projectIdParam) ? projectIdParam[0] : projectIdParam);

  if (isNaN(projectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  try {
    const userId = req.user!.userId;

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    const documents = await prisma.graduationDocument.findMany({
      where: { projectId },
      orderBy: { docType: 'asc' }
    });

    res.json({ documents });
  } catch (error) {
    console.error('Graduation documents fetch error:', error);
    res.status(500).json({ error: '获取毕设文档失败' });
  }
});

/**
 * PUT /api/graduation/:id
 * Update graduation document content
 */
router.put('/:id', authMiddleware, checkBannedMiddleware, async (req: Request, res: Response) => {
  const idParam = req.params.id;
  const documentId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
  const { content } = req.body;

  if (isNaN(documentId)) {
    return res.status(400).json({ error: '无效的文档ID' });
  }

  if (!content) {
    return res.status(400).json({ error: '请提供文档内容' });
  }

  const contentSize = Buffer.byteLength(content, 'utf8');
  if (contentSize > 100 * 1024) {
    return res.status(400).json({ error: '文档内容过大，最大100KB' });
  }

  try {
    const document = await prisma.graduationDocument.findFirst({
      where: { id: documentId },
      include: { project: true }
    });

    if (!document) {
      return res.status(404).json({ error: '文档不存在' });
    }

    if (document.project.userId !== req.user!.userId) {
      return res.status(404).json({ error: '文档不存在或无权限访问' });
    }

    const updated = await prisma.graduationDocument.update({
      where: { id: documentId },
      data: { content }
    });

    res.json({ document: updated });
  } catch (error) {
    console.error('Graduation document update error:', error);
    res.status(500).json({ error: '保存文档失败' });
  }
});

/**
 * POST /api/graduation
 * Create empty graduation document (lazy creation)
 */
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { projectId, docType } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: '请提供项目ID' });
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  if (!docType || !validGraduationDocTypes.includes(docType)) {
    return res.status(400).json({ error: '无效的文档类型' });
  }

  try {
    const userId = req.user!.userId;

    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    try {
      const document = await prisma.graduationDocument.create({
        data: {
          projectId: parsedProjectId,
          docType: docType as GraduationDocType,
          content: ''
        }
      });

      res.json({ document });
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
        res.json({ document: existing });
      } else {
        throw createError;
      }
    }
  } catch (error) {
    console.error('Graduation document create error:', error);
    res.status(500).json({ error: '创建文档失败' });
  }
});

/**
 * POST /api/graduation/generate
 * AI generation for graduation documents
 */
router.post('/generate', authMiddleware, checkBannedMiddleware, async (req: Request, res: Response) => {
  const { projectId, docType, forceRegenerate } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: '请提供项目ID' });
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  if (!docType || !validGraduationDocTypes.includes(docType)) {
    return res.status(400).json({ error: '无效的文档类型' });
  }

  try {
    const userId = req.user!.userId;

    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId },
      include: { topic: true, user: true, documents: true, graduationDocuments: true }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
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
      previousDocs
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

    await recordAiUsage(userId, parsedProjectId, docType, 'generate', result.usage, 'success');

    res.json({ document });
  } catch (error) {
    console.error('Graduation document generation error:', error);
    res.status(500).json({
      error: error instanceof Error ? error.message : '生成失败'
    });
  }
});

/**
 * POST /api/graduation/generate/stream
 * Streaming AI generation for graduation documents
 */
router.post('/generate/stream', authMiddleware, checkBannedMiddleware, async (req: Request, res: Response) => {
  const { projectId, docType, forceRegenerate } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: '请提供项目ID' });
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  if (!docType || !validGraduationDocTypes.includes(docType)) {
    return res.status(400).json({ error: '无效的文档类型' });
  }

  const clientAbortController = new AbortController();
  let streamFinished = false;
  res.on('close', () => {
    if (!streamFinished) {
      clientAbortController.abort();
    }
  });

  const sendEvent = (event: string, payload: unknown): void => {
    if (res.writableEnded) {
      return;
    }
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    const userId = req.user!.userId;

    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId },
      include: { topic: true, user: true, documents: true, graduationDocuments: true }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
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

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const result = await graduationService.generateDocumentStream(
      docType as GraduationDocType,
      topicInfo,
      previousDocs,
      (progress) => {
        sendEvent('progress', progress);
      },
      clientAbortController.signal
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

    await recordAiUsage(userId, parsedProjectId, docType, 'generate_stream', result.usage, 'success');

    sendEvent('complete', { document });
    streamFinished = true;
    res.end();
  } catch (error) {
    if (clientAbortController.signal.aborted) {
      streamFinished = true;
      if (!res.writableEnded) {
        res.end();
      }
      return;
    }

    console.error('Graduation document stream error:', error);
    const errMsg = error instanceof Error ? error.message : '生成失败';
    try {
      sendEvent('error', { message: errMsg });
    } catch {}
    streamFinished = true;
    res.end();
  }
});

export default router;
