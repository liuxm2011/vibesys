/**
 * 集成测试：SSRF 防护在 HTTP 接口层真实生效（P0-A 端到端验证）
 * 目标接口：PUT /api/user/api-setting（src/routes/user.routes.ts）
 *
 * 参考 tests/auth-password.test.ts 的范式——真实 HTTP server + 真实 SQLite，
 * 登录态通过直接签发 JWT 得到 cookie（与 auth.middleware 共用 JWT_SECRET）。
 *
 * 断言点：
 *   1. 恶意 baseURL（云元数据 / 私网 / 非 https / userinfo）→ 400，且**不落库**；
 *   2. 合法公网 https baseURL → 通过 URL 策略，走到 upsert 并持久化。
 * 这证明「拦截发生在接口层」而非仅存在于单元函数里。
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
    // UserApiSetting 与 User 之间没有声明级联关系，必须显式清理，避免脏数据。
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
      name: `Ssrf-${suffix}`,
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

async function requestJson(url: string, options: RequestInit = {}): Promise<{ status: number; body: any }> {
  const response = await fetch(`${baseUrl}${url}`, options);
  const text = await response.text();
  return { status: response.status, body: text ? JSON.parse(text) : null };
}

async function putApiSetting(cookie: string, body: Record<string, unknown>) {
  return requestJson('/api/user/api-setting', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(body)
  });
}

test('拒绝把 baseURL 指向云元数据/私网/非 https（400 且不落库）', async () => {
  const student = await createStudent();
  const cookie = await authCookie(student);

  const malicious: Array<[string, string]> = [
    ['http://169.254.169.254/latest/meta-data', '云元数据(非 https)'],
    ['https://169.254.169.254/latest/meta-data', '云元数据(https)'],
    ['http://127.0.0.1:8080/v1', '本机回环'],
    ['https://10.0.0.5/v1', '私网 10.x'],
    ['https://192.168.1.10/v1', '私网 192.168.x'],
    ['https://database/v1', '单标签内网主机'],
    ['https://user:pass@api.openai.com/v1', '带 userinfo']
  ];

  for (const [badUrl, label] of malicious) {
    const res = await putApiSetting(cookie, { baseURL: badUrl, apiKey: 'sk-x', model: 'gpt-4o-mini' });
    expect(res.status, `期望 400：${label} (${badUrl})`).toBe(400);
    expect(res.body.error).toContain('公网 HTTPS');
  }

  // 全部被拒后，DB 里不应留下任何设置
  const persisted = await prisma.userApiSetting.findUnique({ where: { userId: student.id } });
  expect(persisted).toBeNull();
  const getRes = await requestJson('/api/user/api-setting', { headers: { Cookie: cookie } });
  expect(getRes.status).toBe(200);
  expect(getRes.body.exists).toBe(false);
});

test('放行合法公网 https baseURL 并持久化（走通 URL 策略与 upsert）', async () => {
  const student = await createStudent();
  const cookie = await authCookie(student);

  const okUrl = 'https://api.minimaxi.com/v1';
  const res = await putApiSetting(cookie, { baseURL: okUrl, apiKey: 'sk-test-123', model: 'gpt-4o-mini' });

  expect(res.status).toBe(200);
  expect(res.body.setting.baseURL).toBe(okUrl);

  // 直连 DB 复核确实落库且字节一致
  const persisted = await prisma.userApiSetting.findUnique({ where: { userId: student.id } });
  expect(persisted?.baseURL).toBe(okUrl);
  expect(persisted?.model).toBe('gpt-4o-mini');

  // 通过 GET 接口复核（baseURL 原样回显，apiKey 被掩码）
  const getRes = await requestJson('/api/user/api-setting', { headers: { Cookie: cookie } });
  expect(getRes.status).toBe(200);
  expect(getRes.body.exists).toBe(true);
  expect(getRes.body.setting.baseURL).toBe(okUrl);
  expect(getRes.body.setting.apiKey).not.toBe('sk-test-123');
});
