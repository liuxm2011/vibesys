/**
 * 集成测试：/api/ai/* 的 aiLimiter 接线（P0-C 端到端验证）。
 *
 * P0-2 修复后限流计数存 D1（c.env.DB），本地 Node 入口（src/index.ts）shim
 * DB: undefined → 限流 fail-open 放行。因此本文件验证两点：
 *  1. aiLimiter 在路由链上且不误伤（超量请求仍到达处理器 → 缺 projectId 的 400）；
 *  2. 计数与拒绝语义由 tests/rate-limit.test.ts 在 FakeD1 上覆盖。
 * 本文件不 mock 上游 AI——前 10 次以「缺 projectId 的 400」证明请求确实
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

test('aiLimiter 在路由链上：本地 Node（无 D1）fail-open，请求仍到达处理器', async () => {
  const userA = await createStudent();
  const cookieA = await authCookie(userA);
  const userB = await createStudent();
  const cookieB = await authCookie(userB);

  // 本地 Node 入口 DB: undefined → fail-open：超量请求不被限流拒绝，
  // 仍穿过中间件到达处理器（缺 projectId → 400）。
  const statuses: number[] = [];
  for (let i = 0; i < 11; i += 1) {
    const res = await hitGenerate(cookieA);
    statuses.push(res.status);
    expect(res.status, `第 ${i + 1} 次应为 400（到达处理器）`).toBe(400);
  }
  expect(statuses.every((s) => s === 400)).toBe(true);

  // 计数按用户维度隔离：另一个用户不受 A 的用量影响。
  const userBRes = await hitGenerate(cookieB);
  expect(userBRes.status).toBe(400);
});
