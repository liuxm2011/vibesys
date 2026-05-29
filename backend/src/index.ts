import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma';
import { createApp } from './app.factory.js';

dotenv.config();

function validateEnvironment(): void {
  const required = ['JWT_SECRET', 'DATABASE_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }

  if (!process.env.MINIMAX_API_KEY) {
    console.warn('WARNING: MINIMAX_API_KEY not configured, AI features will not work');
  }
}

validateEnvironment();

const prisma = new PrismaClient();

const app = createApp({
  resolveFrontendUrl: () => process.env.FRONTEND_URL,
  contextMiddleware: async (c, next) => {
    c.set('prisma', prisma);
    (c.env as any) = {
      DB: undefined,
      JWT_SECRET: process.env.JWT_SECRET!,
      FRONTEND_URL: process.env.FRONTEND_URL,
      MINIMAX_API_KEY: process.env.MINIMAX_API_KEY,
      MINIMAX_BASE_URL: process.env.MINIMAX_BASE_URL,
      MINIMAX_MODEL: process.env.MINIMAX_MODEL,
      NODE_ENV: process.env.NODE_ENV,
    };
    await next();
  },
});

const PORT = parseInt(process.env.PORT || '3001');

if (process.env.NODE_ENV !== 'test') {
  serve({
    fetch: app.fetch,
    port: PORT,
  }, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export { app, prisma };
