import { Router, Request, Response } from 'express';
import { PrismaClient, Domain, TopicType } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
const prisma = new PrismaClient();

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
    await prisma.$disconnect();
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
    await prisma.$disconnect();
  } catch (error) {
    console.error('Topic detail error:', error);
    res.status(500).json({ error: '获取选题详情失败' });
  }
});

export default router;