import { Hono } from 'hono';
import { Domain, Platform, TopicType } from '../generated/prisma';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { viewerBlockMiddleware } from '../middleware/auth.middleware.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

router.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const q = c.req.query();
    const domain = q.domain as Domain | undefined;
    const type = q.type as TopicType | undefined;
    const platform = q.platform as Platform | undefined;

    const whereClause: any = {
      OR: [
        { type: TopicType.SYSTEM },
        { creatorId: userId }
      ]
    };

    if (type === TopicType.SYSTEM) {
      whereClause.OR = [{ type: TopicType.SYSTEM }];
    } else if (type === TopicType.CUSTOM) {
      whereClause.OR = [{ creatorId: userId }];
    }

    if (domain) {
      if (type === TopicType.SYSTEM) {
        whereClause.OR = [{ type: TopicType.SYSTEM, domain }];
      } else if (type === TopicType.CUSTOM) {
        whereClause.OR = [{ creatorId: userId, domain }];
      } else {
        whereClause.OR = [
          { type: TopicType.SYSTEM, domain },
          { creatorId: userId, domain }
        ];
      }
    }

    if (platform) {
      const applyPlatform = (clause: any) => ({ ...clause, platform });
      if (Array.isArray(whereClause.OR)) {
        whereClause.OR = whereClause.OR.map(applyPlatform);
      } else {
        whereClause.platform = platform;
      }
    }

    const topics = await prisma.topic.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    const typedTopics = topics.map(t => ({
      ...t,
      techStack: t.techStack as string[]
    }));

    return c.json({ topics: typedTopics });
  } catch (error) {
    console.error('Topics list error:', error);
    return c.json({ error: '获取选题失败，请刷新页面重试' }, 500);
  }
});

router.get('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    const topicId = parseInt(c.req.param('id'));

    if (isNaN(topicId)) {
      return c.json({ error: '无效的选题ID' }, 400);
    }

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        OR: [
          { type: TopicType.SYSTEM },
          { creatorId: userId }
        ]
      }
    });

    if (!topic) {
      return c.json({ error: '选题不存在' }, 404);
    }

    const typedTopic = {
      ...topic,
      techStack: topic.techStack as string[]
    };

    return c.json({ topic: typedTopic });
  } catch (error) {
    console.error('Topic detail error:', error);
    return c.json({ error: '获取选题详情失败' }, 500);
  }
});

router.post('/custom', authMiddleware, viewerBlockMiddleware, async (c) => {
  const { title, description, background, objectives, domain, platform, techStack } = await c.req.json();

  if (!title || !description || !domain || !platform) {
    return c.json({ error: '请填写必要信息' }, 400);
  }

  if (title.length < 2 || title.length > 100) {
    return c.json({ error: '标题长度需要在2-100字符之间' }, 400);
  }

  if (description.length < 10 || description.length > 2000) {
    return c.json({ error: '描述长度需要在10-2000字符之间' }, 400);
  }

  if (background && background.length > 2000) {
    return c.json({ error: '背景说明不能超过2000字符' }, 400);
  }

  if (objectives && objectives.length > 2000) {
    return c.json({ error: '预期目标不能超过2000字符' }, 400);
  }

  if (domain !== Domain.SE && domain !== Domain.BD) {
    return c.json({ error: '无效的领域类型' }, 400);
  }

  const validPlatforms = ['WEB', 'IOS', 'ANDROID', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'];
  if (!validPlatforms.includes(platform)) {
    return c.json({ error: '无效的运行平台' }, 400);
  }

  if (!techStack || !Array.isArray(techStack) || techStack.length < 3) {
    return c.json({ error: '请至少选择3项技术栈' }, 400);
  }

  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;

    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        background: background || null,
        objectives: objectives || null,
        domain: domain as Domain,
        platform: platform as Platform,
        techStack: techStack,
        type: TopicType.CUSTOM,
        creatorId: userId
      }
    });

    return c.json({ topic: { ...topic, techStack } });
  } catch (error) {
    console.error('Custom topic error:', error);
    return c.json({ error: '服务器错误，请稍后重试' }, 500);
  }
});

export default router;
