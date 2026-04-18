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

export default router;