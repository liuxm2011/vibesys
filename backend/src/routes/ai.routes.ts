import { Router, Request, Response } from 'express';
import { DocType, Prisma } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { prisma } from '../index.js';
import { aiService, type TokenUsage } from '../services/ai.service.js';
import { DOC_GENERATION_ORDER, getContextDependencies, getGenerationBlockedReason } from '../constants/document-generation.js';

/**
 * Record AI usage log to database
 */
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
    console.error('[AI Usage Log] Failed to record usage:', err);
  }
}

const router = Router();

// Valid DocType values for validation
const validDocTypes: DocType[] = ['PRD', 'FRONTEND', 'BACKEND', 'API', 'TASK', 'CONTEXT_STATE', 'AGENTS'];

/**
 * POST /api/ai/generate
 * DOC-04: AI document generation with cross-document context
 * D-01: MiniMax API integration
 * D-08/09: Domain-specific templates
 *
 * Request body: { projectId, docType }
 * Response: { document: updatedDoc }
 *
 * Timeout: 30s for AI generation
 */
router.post('/generate', authMiddleware, checkBannedMiddleware, async (req: Request, res: Response) => {
  const { projectId, docType, forceRegenerate } = req.body;

  // Validate projectId
  if (!projectId) {
    return res.status(400).json({ error: '请提供项目ID' });
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  // Validate docType
  if (!docType || !validDocTypes.includes(docType)) {
    return res.status(400).json({ error: '无效的文档类型' });
  }

  try {
    const userId = req.user!.userId;

    // T-03-01-02: IDOR prevention - verify project ownership
    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId },
      include: {
        topic: {
          select: {
            title: true,
            description: true,
            background: true,
            objectives: true,
            domain: true,
            platform: true,
            techStack: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    // Prepare topic info for AI generation
    const topicInfo = {
      title: project.topic.title,
      description: project.topic.description,
      domain: project.topic.domain,
      platform: project.topic.platform,
      objectives: project.topic.objectives || project.topic.background,
      techStack: project.topic.techStack as string[]
    };

    // Load previous documents as context for cross-document consistency
    const allDocs = await prisma.document.findMany({
      where: { projectId: parsedProjectId },
      orderBy: { docType: 'asc' }
    });

    const blockedReason = getGenerationBlockedReason(docType as DocType, allDocs);
    if (blockedReason) {
      return res.status(409).json({
        error: blockedReason,
        code: 'DOCUMENT_STAGE_BLOCKED'
      });
    }

    const previousDocs: Record<string, string> = {};
    const deps = getContextDependencies(docType as DocType);
    for (const depType of deps) {
      const depDoc = allDocs.find(d => d.docType === depType);
      if (depDoc && depDoc.content) {
        previousDocs[depType] = depDoc.content;
      }
    }

    // Generate document content via AI service
    const result = await aiService.generateDocument(docType as DocType, {
      ...topicInfo,
      previousDocs
    }, {
      bypassCache: forceRegenerate === true
    });
    const content = result.content;

    // Record AI usage
    await recordAiUsage(userId, parsedProjectId, docType, 'generate', result.usage, 'success');

    // D-12: Create or update document record (single version, overwrite)
    const document = await prisma.document.upsert({
      where: {
        projectId_docType: {
          projectId: parsedProjectId,
          docType: docType as DocType
        }
      },
      update: { content },
      create: {
        projectId: parsedProjectId,
        docType: docType as DocType,
        content
      }
    });

    // Update project status to IN_PROGRESS when first document is generated
    if (project.status === 'NOT_STARTED') {
      await prisma.project.update({
        where: { id: parsedProjectId },
        data: { status: 'IN_PROGRESS' }
      });
    }

    // Update project status to COMPLETED when all 7 documents are generated
    if (project.status !== 'COMPLETED') {
      const allGenerated = DOC_GENERATION_ORDER.every(dt => {
        const existingContent = allDocs.find(d => d.docType === dt)?.content ?? '';
        return existingContent.length > 0 || (dt === docType && content.length > 0);
      });

      if (allGenerated) {
        await prisma.project.update({
          where: { id: parsedProjectId },
          data: { status: 'COMPLETED' }
        });
      }
    }

    res.json({ document });
  } catch (error) {
    console.error('AI generation error:', error);

    // Record failed usage
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMsg.includes('timeout');
    await recordAiUsage(
      req.user!.userId,
      parsedProjectId,
      docType,
      'generate',
      { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      isTimeout ? 'timeout' : 'error',
      errorMsg
    );

    // Handle timeout gracefully
    if (isTimeout) {
      return res.status(504).json({ error: '文档生成超时，请稍后重试' });
    }

    res.status(500).json({ error: '文档生成失败，请稍后重试' });
  }
});

router.post('/generate/stream', authMiddleware, checkBannedMiddleware, async (req: Request, res: Response) => {
  const { projectId, docType, forceRegenerate } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: '请提供项目ID' });
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  if (!docType || !validDocTypes.includes(docType)) {
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
      include: {
        topic: {
          select: {
            title: true,
            description: true,
            background: true,
            objectives: true,
            domain: true,
            platform: true,
            techStack: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    const topicInfo = {
      title: project.topic.title,
      description: project.topic.description,
      domain: project.topic.domain,
      platform: project.topic.platform,
      objectives: project.topic.objectives || project.topic.background,
      techStack: project.topic.techStack as string[]
    };

    const allDocs = await prisma.document.findMany({
      where: { projectId: parsedProjectId },
      orderBy: { docType: 'asc' }
    });

    const blockedReason = getGenerationBlockedReason(docType as DocType, allDocs);
    if (blockedReason) {
      return res.status(409).json({
        error: blockedReason,
        code: 'DOCUMENT_STAGE_BLOCKED'
      });
    }

    const previousDocs: Record<string, string> = {};
    const deps = getContextDependencies(docType as DocType);
    for (const depType of deps) {
      const depDoc = allDocs.find(d => d.docType === depType);
      if (depDoc && depDoc.content) {
        previousDocs[depType] = depDoc.content;
      }
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const result = await aiService.generateDocumentStream(docType as DocType, {
      ...topicInfo,
      previousDocs
    }, progress => {
      sendEvent('progress', progress);
    }, {
      bypassCache: forceRegenerate === true,
      signal: clientAbortController.signal
    });
    const content = result.content;

    // Record AI usage
    await recordAiUsage(userId, parsedProjectId, docType, 'generate_stream', result.usage, 'success');

    const document = await prisma.document.upsert({
      where: {
        projectId_docType: {
          projectId: parsedProjectId,
          docType: docType as DocType
        }
      },
      update: { content },
      create: {
        projectId: parsedProjectId,
        docType: docType as DocType,
        content
      }
    });

    if (project.status === 'NOT_STARTED') {
      await prisma.project.update({
        where: { id: parsedProjectId },
        data: { status: 'IN_PROGRESS' }
      });
    }

    if (project.status !== 'COMPLETED') {
      const allGenerated = DOC_GENERATION_ORDER.every(dt => {
        const existingContent = allDocs.find(d => d.docType === dt)?.content ?? '';
        return existingContent.length > 0 || (dt === docType && content.length > 0);
      });

      if (allGenerated) {
        await prisma.project.update({
          where: { id: parsedProjectId },
          data: { status: 'COMPLETED' }
        });
      }
    }

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

    console.error('AI streaming generation error:', error);

    // Record failed usage
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMsg.includes('timeout');
    await recordAiUsage(
      req.user!.userId,
      parsedProjectId,
      docType,
      'generate_stream',
      { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      isTimeout ? 'timeout' : 'error',
      errorMsg
    );

    if (res.headersSent) {
      sendEvent('error', {
        error: isTimeout
          ? '文档生成超时，请稍后重试'
          : '文档生成失败，请稍后重试'
      });
      streamFinished = true;
      return res.end();
    }

    if (isTimeout) {
      return res.status(504).json({ error: '文档生成超时，请稍后重试' });
    }

    res.status(500).json({ error: '文档生成失败，请稍后重试' });
  }
});

/**
 * POST /api/ai/review
 * Expert Panel Review: cross-document alignment review and fix
 *
 * Request body: { projectId, mode: 'review' | 'fix' | 'discard' }
 * mode='review': analyze all 7 documents for alignment issues
 * mode='fix': apply targeted fixes to affected documents based on prior review results
 * mode='discard': discard persisted review results
 */
router.post('/review', authMiddleware, checkBannedMiddleware, async (req: Request, res: Response) => {
  const { projectId, mode } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: '请提供项目ID' });
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  if (!mode || !['review', 'fix', 'discard'].includes(mode)) {
    return res.status(400).json({ error: 'mode 参数必须为 review、fix 或 discard' });
  }

  try {
    const userId = req.user!.userId;

    const project = await prisma.project.findFirst({
      where: { id: parsedProjectId, userId },
      include: {
        topic: {
          select: {
            title: true,
            description: true,
            background: true,
            objectives: true,
            domain: true,
            platform: true,
            techStack: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    const topicInfo = {
      title: project.topic.title,
      description: project.topic.description,
      domain: project.topic.domain,
      platform: project.topic.platform,
      objectives: project.topic.objectives || project.topic.background,
      techStack: project.topic.techStack as string[]
    };

    const allDocs = await prisma.document.findMany({
      where: { projectId: parsedProjectId }
    });

    const docsMap: Record<string, string> = {};
    for (const doc of allDocs) {
      docsMap[doc.docType] = doc.content || '';
    }

    if (mode === 'review') {
      const reviewResult = await aiService.reviewDocuments(topicInfo, docsMap);

      await prisma.project.update({
        where: { id: parsedProjectId },
        data: {
          reviewStatus: 'PENDING_FIX',
          reviewResult: reviewResult as unknown as object
        }
      });

      return res.json({ review: reviewResult });
    }

    if (mode === 'discard') {
      await prisma.project.update({
        where: { id: parsedProjectId },
        data: {
          reviewStatus: 'DISCARDED',
          reviewResult: Prisma.JsonNull
        }
      });

      return res.json({ success: true });
    }

    // mode === 'fix'
    if (!project.reviewResult || !Array.isArray((project.reviewResult as any)?.issues)) {
      return res.status(409).json({ error: '请先执行审核，再应用修复' });
    }

    const reviewResult = project.reviewResult as unknown as {
      issues: Array<{ affectedDocTypes: string[] }>;
    };

    const affectedTypes = new Set<string>();
    for (const issue of reviewResult.issues) {
      for (const t of issue.affectedDocTypes) {
        affectedTypes.add(t);
      }
    }

    const affectedDocs: Record<string, string> = {};
    for (const docType of affectedTypes) {
      if (docsMap[docType]) {
        affectedDocs[docType] = docsMap[docType];
      }
    }

    if (Object.keys(affectedDocs).length === 0) {
      return res.status(400).json({ error: '没有需要修复的文档' });
    }

    const fixedDocs = await aiService.fixDocuments(topicInfo, affectedDocs, reviewResult as any);

    const updatedDocuments = [];
    for (const [docType, content] of fixedDocs.documents) {
      const document = await prisma.document.upsert({
        where: {
          projectId_docType: {
            projectId: parsedProjectId,
            docType: docType as DocType
          }
        },
        update: { content },
        create: {
          projectId: parsedProjectId,
          docType: docType as DocType,
          content
        }
      });
      updatedDocuments.push(document);
    }

    await prisma.project.update({
      where: { id: parsedProjectId },
      data: { reviewStatus: 'ACCEPTED' }
    });

    return res.json({
      documents: updatedDocuments,
      unresolved: fixedDocs.unresolved
    });
  } catch (error) {
    console.error('AI review error:', error);
    const actionLabel = mode === 'fix' ? '修复' : '审核';

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return res.status(504).json({ error: `${actionLabel}超时，请稍后重试` });
      }
      return res.status(500).json({ error: `${actionLabel}失败: ${error.message}` });
    }

    res.status(500).json({ error: `${actionLabel}失败，请稍后重试` });
  }
});

/**
 * POST /api/ai/review/stream
 * Streaming expert panel review with SSE for UI progress feedback
 */
router.post('/review/stream', authMiddleware, checkBannedMiddleware, async (req: Request, res: Response) => {
  const { projectId, mode } = req.body;

  if (!projectId) {
    return res.status(400).json({ error: '请提供项目ID' });
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return res.status(400).json({ error: '无效的项目ID' });
  }

  if (!mode || !['review', 'fix', 'discard'].includes(mode)) {
    return res.status(400).json({ error: 'mode 参数必须为 review、fix 或 discard' });
  }

  if (mode !== 'review') {
    return res.status(400).json({ error: 'stream 端点仅支持 review 模式' });
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
      include: {
        topic: {
          select: {
            title: true,
            description: true,
            background: true,
            objectives: true,
            domain: true,
            platform: true,
            techStack: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: '项目不存在或无权限访问' });
    }

    const topicInfo = {
      title: project.topic.title,
      description: project.topic.description,
      domain: project.topic.domain,
      platform: project.topic.platform,
      objectives: project.topic.objectives || project.topic.background,
      techStack: project.topic.techStack as string[]
    };

    const allDocs = await prisma.document.findMany({
      where: { projectId: parsedProjectId }
    });

    const docsMap: Record<string, string> = {};
    for (const doc of allDocs) {
      docsMap[doc.docType] = doc.content || '';
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const reviewResult = await aiService.reviewDocumentsStream(
      topicInfo,
      docsMap,
      phase => {
        sendEvent('phase', { phase });
      },
      clientAbortController.signal
    );

    await prisma.project.update({
      where: { id: parsedProjectId },
      data: {
        reviewStatus: 'PENDING_FIX',
        reviewResult: reviewResult as unknown as object
      }
    });

    sendEvent('complete', { review: reviewResult });
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

    console.error('AI review streaming error:', error);

    if (res.headersSent) {
      sendEvent('error', {
        error: error instanceof Error && error.message.includes('timeout')
          ? '审核超时，请稍后重试'
          : '审核失败，请稍后重试'
      });
      streamFinished = true;
      return res.end();
    }

    if (error instanceof Error && error.message.includes('timeout')) {
      return res.status(504).json({ error: '审核超时，请稍后重试' });
    }

    res.status(500).json({ error: '审核失败，请稍后重试' });
  }
});

export default router;
