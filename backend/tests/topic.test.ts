import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import { test, before, after, afterEach } from 'node:test';
import path from 'node:path';
import dotenv from 'dotenv';
import { PrismaClient, Role, Status, TopicType, type Topic, type User } from '@prisma/client';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
process.env.NODE_ENV = 'test';

type JwtSigner = (payload: {
  userId: number;
  studentId: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
}) => string;

let server: Server;
let baseUrl: string;
let prisma: PrismaClient;
let signToken: JwtSigner;

const createdTopicIds = new Set<number>();
const createdUserIds = new Set<number>();

before(async () => {
  const indexModule = await import('../src/index.js');
  prisma = indexModule.prisma;

  const jwtModule = await import('../src/utils/jwt.utils.js');
  signToken = jwtModule.signToken as JwtSigner;

  server = createServer(indexModule.app);
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');

  const address = server.address();
  if (!address || typeof address === 'string') {
    throw new Error('Failed to start test server');
  }

  baseUrl = `http://127.0.0.1:${address.port}`;
});

afterEach(async () => {
  if (createdTopicIds.size > 0) {
    await prisma.topic.deleteMany({
      where: {
        id: { in: Array.from(createdTopicIds) }
      }
    });
    createdTopicIds.clear();
  }

  if (createdUserIds.size > 0) {
    await prisma.user.deleteMany({
      where: {
        id: { in: Array.from(createdUserIds) }
      }
    });
    createdUserIds.clear();
  }
});

after(async () => {
  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});

async function createUser(role: Role, label: string): Promise<User> {
  const suffix = randomUUID().replace(/-/g, '').slice(0, 5);
  const majorCode = role === Role.ADMIN ? '11' : '13';
  const studentId = `23${majorCode}${suffix}`;
  const user = await prisma.user.create({
    data: {
      studentId,
      name: `${label}-${suffix}`,
      major: role === Role.ADMIN ? '软件工程' : '大数据',
      grade: '2026级',
      class: '2601',
      password: 'test-password',
      role,
      status: Status.ACTIVE
    }
  });

  createdUserIds.add(user.id);
  return user;
}

function authCookie(user: User): string {
  const token = signToken({
    userId: user.id,
    studentId: user.studentId,
    name: user.name,
    role: user.role
  });

  return `token=${token}`;
}

async function requestJson(
  url: string,
  options: RequestInit = {}
): Promise<{ status: number; body: any }> {
  const response = await fetch(`${baseUrl}${url}`, options);
  const body = await response.json();
  return { status: response.status, body };
}

test('keeps custom topics private to the creator and hidden from admin topic management', async () => {
  const admin = await createUser(Role.ADMIN, 'Admin');
  const creator = await createUser(Role.STUDENT, 'Creator');
  const otherStudent = await createUser(Role.STUDENT, 'Other');

  const creatorCookie = authCookie(creator);
  const otherCookie = authCookie(otherStudent);
  const adminCookie = authCookie(admin);

  const customTitle = `Custom Topic ${randomUUID().slice(0, 8)}`;

  const createResponse = await requestJson('/api/topics/custom', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: creatorCookie
    },
    body: JSON.stringify({
      title: customTitle,
      description: '这是用于验证自拟选题隐私范围的测试描述内容。',
      background: '测试背景',
      objectives: '测试目标',
      domain: 'SE',
      techStack: ['Vue 3', 'Node.js + Express', 'MySQL']
    })
  });

  assert.equal(createResponse.status, 200);
  assert.equal(createResponse.body.topic.type, TopicType.CUSTOM);

  const customTopic = createResponse.body.topic as Topic;
  createdTopicIds.add(customTopic.id);

  const creatorTopics = await requestJson('/api/topics', {
    headers: { Cookie: creatorCookie }
  });
  assert.equal(creatorTopics.status, 200);
  assert.equal(creatorTopics.body.topics.some((topic: Topic) => topic.id === customTopic.id), true);

  const otherTopics = await requestJson('/api/topics', {
    headers: { Cookie: otherCookie }
  });
  assert.equal(otherTopics.status, 200);
  assert.equal(otherTopics.body.topics.some((topic: Topic) => topic.id === customTopic.id), false);

  const otherTopicDetail = await requestJson(`/api/topics/${customTopic.id}`, {
    headers: { Cookie: otherCookie }
  });
  assert.equal(otherTopicDetail.status, 404);

  const adminTopics = await requestJson('/api/admin/topics?page=1&pageSize=50', {
    headers: { Cookie: adminCookie }
  });
  assert.equal(adminTopics.status, 200);
  assert.equal(adminTopics.body.topics.every((topic: Topic) => topic.type === TopicType.SYSTEM), true);
  assert.equal(adminTopics.body.topics.some((topic: Topic) => topic.id === customTopic.id), false);

  const adminCustomFilter = await requestJson('/api/admin/topics?type=CUSTOM', {
    headers: { Cookie: adminCookie }
  });
  assert.equal(adminCustomFilter.status, 400);

  const adminUpdate = await requestJson(`/api/admin/topics/${customTopic.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie
    },
    body: JSON.stringify({
      title: 'Blocked Update',
      description: '这是用于验证后台不能修改自拟选题的测试描述内容。',
      background: '测试背景',
      objectives: '测试目标',
      domain: 'SE',
      techStack: []
    })
  });
  assert.equal(adminUpdate.status, 404);

  const adminDelete = await requestJson(`/api/admin/topics/${customTopic.id}`, {
    method: 'DELETE',
    headers: { Cookie: adminCookie }
  });
  assert.equal(adminDelete.status, 404);
});
