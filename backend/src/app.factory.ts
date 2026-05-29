import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { getCookie } from 'hono/cookie';
import type { Context, MiddlewareHandler } from 'hono';
import { verifyToken } from './utils/jwt.utils.js';
import type { AppEnv } from './types.js';
import authRoutes from './routes/auth.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import topicsRoutes from './routes/topics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import documentsRoutes from './routes/documents.routes.js';
import adminRoutes from './routes/admin.routes.js';
import graduationRoutes from './routes/graduation.routes.js';
import userRoutes from './routes/user.routes.js';
import thesisRouter from './routes/thesis.routes.js';
import { generalLimiter } from './middleware/rate-limit.middleware.js';
import { AppError } from './lib/errors.js';
import { logger as log } from './lib/logger.js';

export interface CreateAppOptions {
  /**
   * Resolve the configured frontend URL(s) for CORS. Differs by runtime:
   * Cloudflare reads `c.env.FRONTEND_URL`, Node reads `process.env.FRONTEND_URL`.
   */
  resolveFrontendUrl: (c: Context<AppEnv>) => string | undefined;
  /**
   * Per-request context setup. Must call `c.set('prisma', ...)`.
   * Cloudflare builds a D1-backed client per request; Node reuses a singleton
   * and additionally shims `c.env` from `process.env`.
   */
  contextMiddleware: MiddlewareHandler<AppEnv>;
}

/**
 * Build the shared Hono app. Both the Cloudflare Workers entry (`worker.ts`)
 * and the Node dev/test entry (`index.ts`) use this so their middleware,
 * route table, and error handling cannot drift apart.
 */
export function createApp(options: CreateAppOptions): Hono<AppEnv> {
  const app = new Hono<AppEnv>();

  app.use('*', cors({
    origin: (origin, c) => {
      if (!origin) return undefined;

      const allowed = ['http://127.0.0.1:5173', 'http://localhost:5173'];

      const configured = options.resolveFrontendUrl(c)?.trim().replace(/\/+$/, '');
      if (configured) {
        // Support comma-separated list of origins
        configured.split(',').forEach((o: string) => {
          const trimmed = o.trim().replace(/\/+$/, '');
          if (trimmed) allowed.push(trimmed);
        });
      }

      return allowed.includes(origin) ? origin : undefined;
    },
    credentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  }));

  app.use('*', logger());
  app.use('*', options.contextMiddleware);
  app.use('*', generalLimiter);

  app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

  app.get('/api/debug/whoami', async (c) => {
    const token = getCookie(c, 'token');
    if (!token) return c.json({ hasCookie: false, payload: null });
    const payload = await verifyToken(token, c.env.JWT_SECRET);
    return c.json({ hasCookie: true, tokenLength: token.length, payload });
  });

  app.route('/api/auth', authRoutes);
  app.route('/api/topics', topicsRoutes);
  app.route('/api/projects', projectsRoutes);
  app.route('/api/ai', aiRoutes);
  app.route('/api/documents', documentsRoutes);
  app.route('/api/admin', adminRoutes);
  app.route('/api/graduation', graduationRoutes);
  app.route('/api/user', userRoutes);
  app.route('/api/thesis', thesisRouter);

  app.onError((err, c) => {
    if (err instanceof AppError) {
      return c.json({ error: err.message }, err.status);
    }
    log.error(err.stack);
    return c.json({ error: '服务器错误' }, 500);
  });

  return app;
}
