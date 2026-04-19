import { Router, Request, Response } from 'express';
import { DocType } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { prisma } from '../index.js';
import { aiService } from '../services/ai.service.js';

const router = Router();

// Valid DocType values for validation
const validDocTypes: DocType[] = ['PRD', 'FRONTEND', 'BACKEND', 'API', 'TASK', 'CONTEXT_STATE', 'AGENTS'];

// Document dependency map: which docs each type depends on
const docDependencies: Record<string, string[]> = {
  'PRD': [],
  'FRONTEND': ['PRD'],
  'BACKEND': ['PRD'],
  'API': ['PRD', 'FRONTEND', 'BACKEND'],
  'TASK': ['PRD', 'FRONTEND', 'BACKEND', 'API'],
  'CONTEXT_STATE': ['TASK'],
  'AGENTS': ['PRD', 'FRONTEND', 'BACKEND', 'API', 'TASK', 'CONTEXT_STATE']
};

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
  const { projectId, docType } = req.body;

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
      objectives: project.topic.objectives || project.topic.background,
      techStack: project.topic.techStack as string[]
    };

    // Load previous documents as context for cross-document consistency
    const allDocs = await prisma.document.findMany({
      where: { projectId: parsedProjectId },
      orderBy: { docType: 'asc' }
    });

    const previousDocs: Record<string, string> = {};
    const deps = docDependencies[docType] || [];
    for (const depType of deps) {
      const depDoc = allDocs.find(d => d.docType === depType);
      if (depDoc && depDoc.content) {
        previousDocs[depType] = depDoc.content;
      }
    }

    // Generate document content via AI service
    const content = await aiService.generateDocument(docType as DocType, {
      ...topicInfo,
      previousDocs
    });

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
      const allDocTypes: DocType[] = ['PRD', 'FRONTEND', 'BACKEND', 'API', 'TASK', 'CONTEXT_STATE', 'AGENTS'];
      const allGenerated = allDocTypes.every(dt =>
        allDocs.find(d => d.docType === dt)?.content?.length > 0 || (dt === docType && content.length > 0)
      );

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

    // Handle timeout gracefully
    if (error instanceof Error && error.message.includes('timeout')) {
      return res.status(504).json({ error: '文档生成超时，请稍后重试' });
    }

    res.status(500).json({ error: '文档生成失败，请稍后重试' });
  }
});

export default router;
