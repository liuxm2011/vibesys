import { Router, Request, Response } from 'express';
import { Domain, TopicType } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { prisma } from '../index.js';

const router = Router();

/**
 * GET /api/topics
 * TOPIC-01: Browse topic pool list
 * TOPIC-02: Filter by domain (query param)
 * D-14: Custom topics only visible to creator
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const domain = req.query.domain as Domain | undefined;

    // D-14: Show SYSTEM topics + user's own CUSTOM topics
    const whereClause: any = {
      OR: [
        { type: TopicType.SYSTEM },  // Public system topics
        { creatorId: userId }         // User's custom topics
      ]
    };

    // TOPIC-02: Optional domain filter
    if (domain) {
      whereClause.OR = [
        { type: TopicType.SYSTEM, domain },
        { creatorId: userId, domain }
      ];
    }

    const topics = await prisma.topic.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    // Cast techStack Json to string array for type safety
    const typedTopics = topics.map(t => ({
      ...t,
      techStack: t.techStack as string[]
    }));

    res.json({ topics: typedTopics });
  } catch (error) {
    console.error('Topics list error:', error);
    res.status(500).json({ error: '获取选题失败，请刷新页面重试' });
  }
});

/**
 * GET /api/topics/:id
 * TOPIC-03: View topic detail
 * D-14: Custom topics only visible to creator
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const idParam = req.params.id;
    const topicId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);

    if (isNaN(topicId)) {
      return res.status(400).json({ error: '无效的选题ID' });
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
      return res.status(404).json({ error: '选题不存在' });
    }

    // Cast techStack to string array
    const typedTopic = {
      ...topic,
      techStack: topic.techStack as string[]
    };

    res.json({ topic: typedTopic });
  } catch (error) {
    console.error('Topic detail error:', error);
    res.status(500).json({ error: '获取选题详情失败' });
  }
});

/**
 * POST /api/topics/custom
 * TOPIC-05: Submit custom topic
 * D-12: Fields: title + description + background + objectives + domain
 * D-13: No approval required - instant creation
 * D-14: Only visible to creator
 * D-15: Type marked as CUSTOM
 */
router.post('/custom', authMiddleware, async (req: Request, res: Response) => {
  const { title, description, background, objectives, domain } = req.body;

  // D-12: Validate required fields
  if (!title || !description || !domain) {
    return res.status(400).json({ error: '请填写必要信息' });
  }

  // Validate title length
  if (title.length < 2 || title.length > 100) {
    return res.status(400).json({ error: '标题长度需要在2-100字符之间' });
  }

  // Validate description length
  if (description.length < 10 || description.length > 500) {
    return res.status(400).json({ error: '描述长度需要在10-500字符之间' });
  }

  // Validate domain value
  if (domain !== Domain.SE && domain !== Domain.BD) {
    return res.status(400).json({ error: '无效的领域类型' });
  }

  try {
    const userId = req.user!.userId;

    // D-13, D-15: Create custom topic instantly with type=CUSTOM
    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        background: background || '',      // Optional per D-12
        objectives: objectives || '',      // Optional per D-12
        domain: domain as Domain,
        techStack: [],                     // Empty for custom topics
        type: TopicType.CUSTOM,            // D-15
        creatorId: userId                   // D-14: Link to creator
      }
    });

    res.json({ topic: { ...topic, techStack: [] as string[] } });
  } catch (error) {
    console.error('Custom topic error:', error);
    res.status(500).json({ error: '服务器错误，请稍后重试' });
  }
});

export default router;