import { createMiddleware } from 'hono/factory';
import { getGraduationAccess, graduationAccessErrors } from '../services/graduation-gate.js';
import type { AppEnv } from '../types.js';

export const graduationAccessMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const access = await getGraduationAccess(c.get('prisma'), c.get('user'));
  if (access !== 'allowed') {
    return c.json({ error: graduationAccessErrors[access] }, 403);
  }
  await next();
});
