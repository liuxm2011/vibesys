import { createPrismaClient } from './lib/prisma.js';
import { createApp } from './app.factory.js';

const app = createApp({
  resolveFrontendUrl: (c) => c.env.FRONTEND_URL,
  contextMiddleware: async (c, next) => {
    const prisma = createPrismaClient(c.env.DB);
    c.set('prisma', prisma);
    await next();
  },
});

export default app;
