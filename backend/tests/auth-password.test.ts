import { createServer, type Server } from 'node:http';
import { once } from 'node:events';
import { randomUUID } from 'node:crypto';
import assert from 'node:assert/strict';
import { test, before, after, afterEach } from 'node:test';
import path from 'node:path';
import dotenv from 'dotenv';
import { PrismaClient, Role, Status, type User } from '@prisma/client';

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
let hashPassword: (password: string) => Promise<string>;
let adminDefaultPassword: string;

const createdUserIds = new Set<number>();

before(async () => {
  const indexModule = await import('../src/index.js');
  prisma = indexModule.prisma;

  const jwtModule = await import('../src/utils/jwt.utils.js');
  signToken = jwtModule.signToken as JwtSigner;

  const passwordModule = await import('../src/utils/password.utils.js');
  hashPassword = passwordModule.hashPassword as (password: string) => Promise<string>;
  adminDefaultPassword = passwordModule.ADMIN_DEFAULT_PASSWORD as string;

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

async function createUser(options: {
  role: Role;
  label: string;
  passwordMode?: 'studentId' | 'adminDefault' | 'custom';
  customPassword?: string;
}): Promise<User> {
  const suffix = randomUUID().replace(/-/g, '').slice(0, 5);
  const majorCode = options.role === Role.ADMIN ? '11' : '13';
  const studentId = `23${majorCode}${suffix}`;
  const passwordMode =
    options.passwordMode ||
    (options.role === Role.ADMIN ? 'adminDefault' : 'studentId');

  let plainPassword = studentId;
  if (passwordMode === 'adminDefault') {
    plainPassword = adminDefaultPassword;
  } else if (passwordMode === 'custom') {
    plainPassword = options.customPassword || `pw-${suffix}`;
  }

  const user = await prisma.user.create({
    data: {
      studentId,
      name: `${options.label}-${suffix}`,
      major: options.role === Role.ADMIN ? '软件工程' : '大数据',
      grade: '2026级',
      class: '2601',
      password: await hashPassword(plainPassword),
      role: options.role,
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

test('student can change their own password and log in with the new password', async () => {
  const student = await createUser({ role: Role.STUDENT, label: 'Student' });
  const cookie = authCookie(student);
  const nextPassword = 'new-pass-123';

  const changeResponse = await requestJson('/api/auth/password', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookie
    },
    body: JSON.stringify({
      currentPassword: student.studentId,
      newPassword: nextPassword
    })
  });

  assert.equal(changeResponse.status, 200);
  assert.equal(changeResponse.body.message, '密码修改成功');

  const oldLogin = await requestJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: student.studentId,
      password: student.studentId
    })
  });
  assert.equal(oldLogin.status, 401);

  const newLogin = await requestJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: student.studentId,
      password: nextPassword
    })
  });
  assert.equal(newLogin.status, 200);
  assert.equal(newLogin.body.user.studentId, student.studentId);
});

test('admin can inspect password state and reset student password to default', async () => {
  const admin = await createUser({ role: Role.ADMIN, label: 'Admin' });
  const student = await createUser({
    role: Role.STUDENT,
    label: 'ChangedStudent',
    passwordMode: 'custom',
    customPassword: 'custom-pass-1'
  });

  const adminCookie = authCookie(admin);

  const defaultStudent = await createUser({ role: Role.STUDENT, label: 'DefaultStudent' });
  const userList = await requestJson(`/api/admin/users?page=1&pageSize=50&search=${defaultStudent.studentId}`, {
    headers: { Cookie: adminCookie }
  });

  assert.equal(userList.status, 200);
  const listedUser = userList.body.users.find((item: any) => item.id === defaultStudent.id);
  assert.ok(listedUser);
  assert.equal(listedUser.passwordStatus, 'DEFAULT');
  assert.equal(listedUser.revealedPassword, defaultStudent.studentId);

  const passwordInfo = await requestJson(`/api/admin/users/${student.id}/password`, {
    headers: { Cookie: adminCookie }
  });
  assert.equal(passwordInfo.status, 200);
  assert.equal(passwordInfo.body.passwordStatus, 'CUSTOM');
  assert.equal(passwordInfo.body.revealedPassword, null);

  const resetResponse = await requestJson(`/api/admin/users/${student.id}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie
    },
    body: JSON.stringify({ action: 'RESET_TO_DEFAULT' })
  });

  assert.equal(resetResponse.status, 200);
  assert.equal(resetResponse.body.passwordStatus, 'DEFAULT');
  assert.equal(resetResponse.body.revealedPassword, student.studentId);

  const loginAfterReset = await requestJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: student.studentId,
      password: student.studentId
    })
  });

  assert.equal(loginAfterReset.status, 200);
});

test('admin can set a custom password for a student', async () => {
  const admin = await createUser({ role: Role.ADMIN, label: 'AdminSetter' });
  const student = await createUser({ role: Role.STUDENT, label: 'StudentSetter' });
  const adminCookie = authCookie(admin);
  const customPassword = 'teacher-set-123';

  const updateResponse = await requestJson(`/api/admin/users/${student.id}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: adminCookie
    },
    body: JSON.stringify({
      action: 'SET_CUSTOM',
      newPassword: customPassword
    })
  });

  assert.equal(updateResponse.status, 200);
  assert.equal(updateResponse.body.passwordStatus, 'CUSTOM');
  assert.equal(updateResponse.body.revealedPassword, customPassword);

  const loginResponse = await requestJson('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentId: student.studentId,
      password: customPassword
    })
  });

  assert.equal(loginResponse.status, 200);
  assert.equal(loginResponse.body.user.name, student.name);
});
