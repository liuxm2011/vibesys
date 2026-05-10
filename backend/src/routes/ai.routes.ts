import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import { DocType, Prisma } from '../generated/prisma';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { aiService, type TokenUsage } from '../services/ai.service.js';
import { DOC_GENERATION_ORDER, getContextDependencies, getGenerationBlockedReason } from '../constants/document-generation.js';
import type { AppEnv } from '../types.js';

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
    console.error('[AI Usage Log] Failed to record usage:', err);
  }
}

const router = new Hono<AppEnv>();

router.use('*', async (c, next) => {
  aiService.setContext(c.get('prisma'), {
    MINIMAX_BASE_URL: c.env.MINIMAX_BASE_URL,
    MINIMAX_API_KEY: c.env.MINIMAX_API_KEY,
    MINIMAX_MODEL: c.env.MINIMAX_MODEL,
  });
  await next();
});

const validDocTypes: DocType[] = ['PRD', 'FRONTEND', 'BACKEND', 'API', 'TASK', 'CONTEXT_STATE', 'AGENTS'];

router.post('/generate', authMiddleware, checkBannedMiddleware, async (c) => {
  const { projectId, docType, forceRegenerate } = await c.req.json();

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

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

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
      return c.json({ error: '项目不存在或无权限访问' }, 404);
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
      return c.json({
        error: blockedReason,
        code: 'DOCUMENT_STAGE_BLOCKED'
      }, 409);
    }

    const previousDocs: Record<string, string> = {};
    const deps = getContextDependencies(docType as DocType);
    for (const depType of deps) {
      const depDoc = allDocs.find(d => d.docType === depType);
      if (depDoc && depDoc.content) {
        previousDocs[depType] = depDoc.content;
      }
    }

    const result = await aiService.generateDocument(docType as DocType, {
      ...topicInfo,
      previousDocs
    }, {
      bypassCache: forceRegenerate === true,
      userId
    });
    const content = result.content;

    await recordAiUsage(prisma, userId, parsedProjectId, docType, 'generate', result.usage, 'success');

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

    return c.json({ document });
  } catch (error) {
    console.error('AI generation error:', error);

    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    const isTimeout = errorMsg.includes('timeout');
    const user = c.get('user');
    const prisma = c.get('prisma');
    await recordAiUsage(
      prisma,
      user.userId,
      parsedProjectId,
      docType,
      'generate',
      { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
      isTimeout ? 'timeout' : 'error',
      errorMsg
    );

    if (isTimeout) {
      return c.json({ error: '文档生成超时，请稍后重试' }, 504);
    }

    return c.json({ error: '文档生成失败，请稍后重试' }, 500);
  }
});

router.post('/generate/stream', authMiddleware, checkBannedMiddleware, async (c) => {
  const { projectId, docType, forceRegenerate } = await c.req.json();

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
    return c.json({ error: '项目不存在或无权限访问' }, 404);
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
    return c.json({
      error: blockedReason,
      code: 'DOCUMENT_STAGE_BLOCKED'
    }, 409);
  }

  const previousDocs: Record<string, string> = {};
  const deps = getContextDependencies(docType as DocType);
  for (const depType of deps) {
    const depDoc = allDocs.find(d => d.docType === depType);
    if (depDoc && depDoc.content) {
      previousDocs[depType] = depDoc.content;
    }
  }

  const clientAbortController = new AbortController();

  return streamSSE(c, async (stream) => {
    stream.onAbort(() => {
      clientAbortController.abort();
    });

    try {
      const result = await aiService.generateDocumentStream(docType as DocType, {
        ...topicInfo,
        previousDocs
      }, progress => {
        stream.writeSSE({ event: 'progress', data: JSON.stringify(progress) });
      }, {
        bypassCache: forceRegenerate === true,
        signal: clientAbortController.signal,
        userId
      });
      const content = result.content;

      await recordAiUsage(prisma, userId, parsedProjectId, docType, 'generate_stream', result.usage, 'success');

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

      stream.writeSSE({ event: 'complete', data: JSON.stringify({ document }) });
    } catch (error) {
      if (clientAbortController.signal.aborted) {
        return;
      }

      console.error('AI streaming generation error:', error);

      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      const isTimeout = errorMsg.includes('timeout');
      await recordAiUsage(
        prisma,
        userId,
        parsedProjectId,
        docType,
        'generate_stream',
        { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
        isTimeout ? 'timeout' : 'error',
        errorMsg
      );

      stream.writeSSE({
        event: 'error',
        data: JSON.stringify({
          error: isTimeout
            ? '文档生成超时，请稍后重试'
            : '文档生成失败，请稍后重试'
        })
      });
    }
  });
});

router.post('/review', authMiddleware, checkBannedMiddleware, async (c) => {
  const { projectId, mode } = await c.req.json();

  if (!projectId) {
    return c.json({ error: '请提供项目ID' }, 400);
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  if (!mode || !['review', 'fix', 'discard'].includes(mode)) {
    return c.json({ error: 'mode 参数必须为 review、fix 或 discard' }, 400);
  }

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

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
      return c.json({ error: '项目不存在或无权限访问' }, 404);
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
      const reviewResult = await aiService.reviewDocuments(topicInfo, docsMap, userId);

      await prisma.project.update({
        where: { id: parsedProjectId },
        data: {
          reviewStatus: 'PENDING_FIX',
          reviewResult: reviewResult as unknown as object
        }
      });

      return c.json({ review: reviewResult });
    }

    if (mode === 'discard') {
      await prisma.project.update({
        where: { id: parsedProjectId },
        data: {
          reviewStatus: 'DISCARDED',
          reviewResult: Prisma.JsonNull
        }
      });

      return c.json({ success: true });
    }

    // mode === 'fix'
    if (!project.reviewResult || !Array.isArray((project.reviewResult as any)?.issues)) {
      return c.json({ error: '请先执行审核，再应用修复' }, 409);
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
      return c.json({ error: '没有需要修复的文档' }, 400);
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

    return c.json({
      documents: updatedDocuments,
      unresolved: fixedDocs.unresolved
    });
  } catch (error) {
    console.error('AI review error:', error);
    const actionLabel = mode === 'fix' ? '修复' : '审核';

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return c.json({ error: `${actionLabel}超时，请稍后重试` }, 504);
      }
      return c.json({ error: `${actionLabel}失败: ${error.message}` }, 500);
    }

    return c.json({ error: `${actionLabel}失败，请稍后重试` }, 500);
  }
});

router.post('/review/stream', authMiddleware, checkBannedMiddleware, async (c) => {
  const { projectId, mode } = await c.req.json();

  if (!projectId) {
    return c.json({ error: '请提供项目ID' }, 400);
  }

  const parsedProjectId = parseInt(projectId);
  if (isNaN(parsedProjectId)) {
    return c.json({ error: '无效的项目ID' }, 400);
  }

  if (!mode || !['review', 'fix', 'discard'].includes(mode)) {
    return c.json({ error: 'mode 参数必须为 review、fix 或 discard' }, 400);
  }

  if (mode !== 'review') {
    return c.json({ error: 'stream 端点仅支持 review 模式' }, 400);
  }

  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;

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
    return c.json({ error: '项目不存在或无权限访问' }, 404);
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

  const clientAbortController = new AbortController();

  return streamSSE(c, async (stream) => {
    stream.onAbort(() => {
      clientAbortController.abort();
    });

    try {
      const reviewResult = await aiService.reviewDocumentsStream(
        topicInfo,
        docsMap,
        phase => {
          stream.writeSSE({ event: 'phase', data: JSON.stringify({ phase }) });
        },
        clientAbortController.signal,
        userId
      );

      await prisma.project.update({
        where: { id: parsedProjectId },
        data: {
          reviewStatus: 'PENDING_FIX',
          reviewResult: reviewResult as unknown as object
        }
      });

      stream.writeSSE({ event: 'complete', data: JSON.stringify({ review: reviewResult }) });
    } catch (error) {
      if (clientAbortController.signal.aborted) {
        return;
      }

      console.error('AI review streaming error:', error);

      stream.writeSSE({
        event: 'error',
        data: JSON.stringify({
          error: error instanceof Error && error.message.includes('timeout')
            ? '审核超时，请稍后重试'
            : '审核失败，请稍后重试'
        })
      });
    }
  });
});

export default router;
