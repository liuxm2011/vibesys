import { Hono } from 'hono';
import { PrismaClient, ProjectStatus } from '../generated/prisma';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { viewerBlockMiddleware } from '../middleware/auth.middleware.js';
import { checkBannedMiddleware } from '../middleware/ban.middleware.js';
import { updateRepoUrl, syncRepoData, getProjectRepoInfo, updateDeployUrl } from '../services/repo.service.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

router.post('/', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  const { topicId } = await c.req.json();

  if (!topicId) {
    return c.json({ error: '请选择选题' }, 400);
  }

  const parsedTopicId = parseInt(topicId);
  if (isNaN(parsedTopicId)) {
    return c.json({ error: '无效的选题ID' }, 400);
  }

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

    const existingCount = await prisma.project.count({
      where: { userId }
    });

    if (existingCount >= 10) {
      return c.json({ error: '已达到项目上限(10个)，请删除现有项目后再创建' }, 400);
    }

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
      return c.json({ error: '选题不存在或无权限访问' }, 404);
    }

    const project = await prisma.project.create({
      data: {
        userId,
        topicId: parsedTopicId,
        status: ProjectStatus.NOT_STARTED,
        documentsRef: {}
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

    return c.json({ project });
  } catch (error) {
    console.error('Project create error:', error);
    return c.json({ error: '服务器错误，请稍后重试' }, 500);
  }
});

router.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

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

    const typedProjects = projects.map(p => ({
      ...p,
      topic: {
        ...p.topic,
        techStack: p.topic.techStack as string[]
      },
      documentsRef: p.documentsRef as Record<string, any> | null
    }));

    return c.json({ projects: typedProjects });
  } catch (error) {
    console.error('Projects list error:', error);
    return c.json({ error: '获取项目列表失败' }, 500);
  }
});

router.delete('/:id', authMiddleware, viewerBlockMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const projectId = parseInt(c.req.param('id'));

    if (isNaN(projectId)) {
      return c.json({ error: '无效的项目ID' }, 400);
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return c.json({ error: '项目不存在' }, 404);
    }

    await prisma.project.delete({
      where: { id: projectId }
    });

    return c.json({ message: '项目已删除' });
  } catch (error) {
    console.error('Project delete error:', error);
    return c.json({ error: '服务器错误，请稍后重试' }, 500);
  }
});

router.get('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const projectId = parseInt(c.req.param('id'));

    if (isNaN(projectId)) {
      return c.json({ error: '无效的项目ID' }, 400);
    }

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
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }

    return c.json({
      project: {
        ...project,
        reviewResult: project.reviewResult as Record<string, unknown> | null
      }
    });
  } catch (error) {
    console.error('Project detail error:', error);
    return c.json({ error: '获取项目详情失败' }, 500);
  }
});

router.put('/:id/techStack', authMiddleware, viewerBlockMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const projectId = parseInt(c.req.param('id'));
    const { techStack } = await c.req.json();

    if (isNaN(projectId)) {
      return c.json({ error: '无效的项目ID' }, 400);
    }

    if (!techStack || typeof techStack !== 'string') {
      return c.json({ error: '请提供技术栈' }, 400);
    }

    if (techStack.length > 500) {
      return c.json({ error: '技术栈内容过长' }, 400);
    }

    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });

    if (!project) {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: { techStack }
    });

    return c.json({ project: { id: updated.id, techStack: updated.techStack } });
  } catch (error) {
    console.error('Tech stack update error:', error);
    return c.json({ error: '更新技术栈失败' }, 500);
  }
});

router.put('/:id/repoUrl', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const projectId = parseInt(c.req.param('id'));
    const { repoUrl } = await c.req.json();

    if (isNaN(projectId)) {
      return c.json({ error: '无效的项目ID' }, 400);
    }

    if (repoUrl && typeof repoUrl === 'string' && repoUrl.length > 500) {
      return c.json({ error: '仓库地址过长' }, 400);
    }

    await updateRepoUrl(prisma, projectId, userId, repoUrl || null);
    return c.json({ message: '仓库地址已更新' });
  } catch (error: any) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }
    if (error.message === 'INVALID_GITEE_URL') {
      return c.json({ error: '请输入有效的 Gitee 仓库地址（如 https://gitee.com/owner/repo）' }, 400);
    }
    console.error('Repo URL update error:', error);
    return c.json({ error: '更新仓库地址失败' }, 500);
  }
});

router.put('/:id/deployUrl', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const projectId = parseInt(c.req.param('id'));
    const { deployUrl } = await c.req.json();

    if (isNaN(projectId)) {
      return c.json({ error: '无效的项目ID' }, 400);
    }

    if (deployUrl && typeof deployUrl === 'string' && deployUrl.length > 500) {
      return c.json({ error: '访问地址过长' }, 400);
    }

    await updateDeployUrl(prisma, projectId, userId, deployUrl || null);
    return c.json({ message: '访问地址已更新' });
  } catch (error: any) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }
    console.error('Deploy URL update error:', error);
    return c.json({ error: '更新访问地址失败' }, 500);
  }
});

router.post('/:id/syncRepo', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const projectId = parseInt(c.req.param('id'));

    if (isNaN(projectId)) {
      return c.json({ error: '无效的项目ID' }, 400);
    }

    const syncData = await syncRepoData(prisma, projectId, userId);
    return c.json({ syncData });
  } catch (error: any) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }
    if (error.message === 'NO_REPO_URL') {
      return c.json({ error: '请先设置仓库地址' }, 400);
    }
    if (error.message === 'INVALID_GITEE_URL') {
      return c.json({ error: '仓库地址格式无效，请输入 Gitee 地址' }, 400);
    }
    console.error('Repo sync error:', error);
    return c.json({ error: '同步仓库数据失败，请检查仓库地址是否正确且为公开仓库' }, 500);
  }
});

router.get('/:id/repoInfo', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const projectId = parseInt(c.req.param('id'));

    if (isNaN(projectId)) {
      return c.json({ error: '无效的项目ID' }, 400);
    }

    const info = await getProjectRepoInfo(prisma, projectId, userId);
    return c.json({ repoUrl: info.repoUrl, repoSyncData: info.repoSyncData });
  } catch (error: any) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }
    console.error('Repo info error:', error);
    return c.json({ error: '获取仓库信息失败' }, 500);
  }
});

export default router;
