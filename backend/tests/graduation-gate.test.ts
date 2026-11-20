import { Hono } from 'hono';
import { expect, test, vi } from 'vitest';
import type { PrismaClient } from '../src/generated/prisma';
import thesisRouter from '../src/routes/thesis.routes.js';
import graduationRouter from '../src/routes/graduation.routes.js';
import type { AppEnv, AuthenticatedUser } from '../src/types.js';
import { signToken } from '../src/utils/jwt.utils.js';

async function setup({ major = '大数据', role = 'STUDENT', enabled }: {
  major?: string;
  role?: AuthenticatedUser['role'];
  enabled?: boolean;
}) {
  const studentId = '231311111';
  const secret = 'graduation-test-secret';
  const config = vi.fn(({ where }: { where: { key: string } }) => {
    if (where.key === 'graduationWhitelist') return { value: studentId };
    return enabled === undefined ? null : { value: String(enabled) };
  });
  const prisma = {
    user: { findUnique: vi.fn().mockResolvedValue({ status: 'ACTIVE', role, major }) },
    systemConfig: { findUnique: config },
    thesisTopic: { findMany: vi.fn().mockResolvedValue([]) },
    project: { findFirst: vi.fn().mockResolvedValue({ thesisProject: { id: 1 } }) },
    graduationDocument: { findMany: vi.fn().mockResolvedValue([]) },
  };

  const app = new Hono<AppEnv>();
  app.use('*', async (c, next) => {
    c.set('prisma', prisma as unknown as PrismaClient);
    await next();
  });
  app.route('/thesis', thesisRouter);
  app.route('/graduation', graduationRouter);

  // The database role and major are authoritative, even with an old student token.
  const token = await signToken({ userId: 1, studentId, name: '学生', role: 'STUDENT' }, secret);
  const request = (path: string, method = 'GET') => app.request(path, {
    method,
    headers: { cookie: `token=${token}` },
  }, { JWT_SECRET: secret });
  return { config, request };
}

test('已开放时，大数据专业学生可以查看毕业设计选题和文档', async () => {
  const { request } = await setup({ enabled: true, major: ' 大数据 ' });
  expect(await (await request('/thesis/status')).json()).toEqual({ enabled: true, access: 'allowed' });
  expect(await (await request('/thesis/topics')).json()).toEqual({ topics: [] });
  expect(await (await request('/graduation/1')).json()).toEqual({ documents: [] });
});

test.each([false, undefined])('关闭或缺少开关配置时，旧白名单无法放行（%s）', async (enabled) => {
  const { config, request } = await setup({ enabled });
  expect(await (await request('/thesis/status')).json()).toEqual({ enabled: false, access: 'closed' });
  expect((await request('/thesis/topics')).status).toBe(403);
  expect((await request('/thesis/project')).status).toBe(403);
  expect((await request('/thesis/project/init-docs', 'POST')).status).toBe(403);
  expect((await request('/thesis/select', 'POST')).status).toBe(403);
  expect((await request('/thesis/project', 'PUT')).status).toBe(403);
  expect((await request('/thesis/release', 'DELETE')).status).toBe(403);
  expect((await request('/graduation/1')).status).toBe(403);
  expect((await request('/graduation/generate', 'POST')).status).toBe(403);
  expect((await request('/graduation/generate/stream', 'POST')).status).toBe(403);
  expect(config.mock.calls.every(([args]) => args.where.key === 'graduationEnabled')).toBe(true);
});

test.each([
  { major: '软件工程', role: 'STUDENT' },
  { major: '大数据', role: 'VIEWER' },
  { major: '大数据', role: 'ADMIN' },
] as const)('开放时仍校验专业和学生身份（$major, $role）', async (user) => {
  const { request } = await setup({ ...user, enabled: true });
  expect(await (await request('/thesis/status')).json()).toEqual({ enabled: false, access: 'ineligible' });
  expect((await request('/thesis/topics')).status).toBe(403);
  expect((await request('/thesis/select', 'POST')).status).toBe(403);
});
