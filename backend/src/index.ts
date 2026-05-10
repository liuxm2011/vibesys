import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';
import { PrismaClient } from './generated/prisma';
import type { AppEnv } from './types.js';
import authRoutes from './routes/auth.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import topicsRoutes from './routes/topics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import adminRoutes from './routes/admin.routes.js';
import graduationRoutes from './routes/graduation.routes.js';
import userRoutes from './routes/user.routes.js';
import { generalLimiter } from './middleware/rate-limit.middleware.js';

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

const app = new Hono<AppEnv>();

app.use('*', cors({
  origin: (origin, c) => {
    const configuredOrigin = process.env.FRONTEND_URL?.trim();
    const defaults = ['http://127.0.0.1:5173', 'http://localhost:5173'];

    if (!origin) return origin;

    if (configuredOrigin) {
      const normalized = configuredOrigin.replace(/\/+$/, '');
      if (origin === normalized || defaults.includes(origin)) {
        return origin;
      }
    } else if (defaults.includes(origin)) {
      return origin;
    }

    return '';
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

app.use('*', logger());

app.use('*', async (c, next) => {
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
});

app.use('*', generalLimiter);

app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.route('/api/auth', authRoutes);
app.route('/api/topics', topicsRoutes);
app.route('/api/projects', projectsRoutes);
app.route('/api/ai', aiRoutes);
app.route('/api/documents', documentsRoutes);
app.route('/api/admin', adminRoutes);
app.route('/api/graduation', graduationRoutes);
app.route('/api/user', userRoutes);

app.onError((err, c) => {
  console.error(err.stack);
  return c.json({ error: '服务器错误' }, 500);
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
