/**
 * 集成测试：/api/ai/* 的 aiLimiter 限流（P0-C 端到端验证）
 * 目标：连续超限后返回 429，且限流按**用户**维度计数（不同用户互不影响）。
 *
 * 说明：aiLimiter 是模块级进程内 Map（src/middleware/rate-limit.middleware.ts），
 * 在 vitest 默认「每文件独立模块图」下，同文件内计数有效、跨文件不共享。
 * 本文件不 mock 上游 AI——因为限流中间件在路由处理之前就短路，命中 11 次的
 * 请求根本不会触达 AI 调用；前 10 次则以「缺 projectId 的 400」证明请求确实
 * 穿过了限流并到达处理器。
 */
import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import { getRequestListener } from '@hono/node-server';
import { test, beforeAll, afterAll, afterEach, expect } from 'vitest';
import { PrismaClient, Role, Status, type User } from '../src/generated/prisma';

type JwtSigner = (
  payload: { userId: number; studentId: string; name: string; role: Role },
  secret: string
) => Promise<string>;

let server: Server;
let baseUrl: string;
let prisma: PrismaClient;
let signToken: JwtSigner;
let jwtSecret: string;

const createdUserIds = new Set<number>();

beforeAll(async () => {
  const indexModule = await import('../src/index.js');
  prisma = indexModule.prisma;

  const jwtModule = await import('../src/utils/jwt.utils.js');
  signToken = jwtModule.signToken as JwtSigner;
  jwtSecret = process.env.JWT_SECRET!;

  server = createServer(getRequestListener(indexModule.app.fetch));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Failed to start test server');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  const ids = Array.from(createdUserIds);
  if (ids.length > 0) {
    await prisma.userApiSetting.deleteMany({ where: { userId: { in: ids } } });
    await prisma.user.deleteMany({ where: { id: { in: ids } } });
    createdUserIds.clear();
  }
});

afterAll(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

async function createStudent(): Promise<User> {
  const suffix = randomUUID().replace(/-/g, '').slice(0, 5);
  const user = await prisma.user.create({
    data: {
      studentId: `2313${suffix}`,
      name: `Rl-${suffix}`,
      major: '大数据',
      grade: '2026级',
      class: '2601',
      password: 'test-password',
      role: Role.STUDENT,
      status: Status.ACTIVE
    }
  });
  createdUserIds.add(user.id);
  return user;
}

async function authCookie(user: User): Promise<string> {
  const token = await signToken(
    { userId: user.id, studentId: user.studentId, name: user.name, role: user.role },
    jwtSecret
  );
  return `token=${token}`;
}

async function hitGenerate(cookie: string): Promise<{ status: number; body: any }> {
  const response = await fetch(`${baseUrl}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    // 缺 projectId：处理器会 400 返回，证明请求已穿过限流到达处理器
    body: JSON.stringify({})
  });
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

test('aiLimiter：同一用户第 11 次请求返回 429，且计数按用户隔离', async () => {
  const userA = await createStudent();
  const cookieA = await authCookie(userA);
  const userB = await createStudent();
  const cookieB = await authCookie(userB);

  // 前 10 次应全部穿过限流（到达处理器 → 缺 projectId → 400），第 11 次被拒。
  const statuses: number[] = [];
  for (let i = 0; i < 11; i += 1) {
    const res = await hitGenerate(cookieA);
    statuses.push(res.status);
    if (i < 10) {
      expect(res.status, `第 ${i + 1} 次应为 400`).toBe(400);
    } else {
      expect(res.status, '第 11 次应为 429').toBe(429);
      expect(res.body.error).toContain('AI生成次数已达上限');
    }
  }
  expect(statuses.slice(0, 10).every((s) => s === 400)).toBe(true);

  // 计数按用户维度隔离：另一个用户不应被 A 的用量影响。
  const userBRes = await hitGenerate(cookieB);
  expect(userBRes.status).toBe(400);
});
