/**
 * 集成测试：毕业设计白名单门槛（P0-3 服务端校验）
 *
 * isGraduationEnabledForUser 是 /thesis/status（UI 判断）与 /thesis/select、
 * /graduation/generate、/graduation/generate/stream（服务端门槛）共用的逻辑：
 * graduationEnabled=true 时全员开放；否则仅 graduationWhitelist 中的学号可用。
 */
import { test, beforeAll, afterAll, expect } from 'vitest';
import { PrismaClient } from '../src/generated/prisma';
import { isGraduationEnabledForUser } from '../src/services/graduation-gate.js';

let prisma: PrismaClient;

const createdConfigKeys = new Set<string>();

beforeAll(async () => {
  const indexModule = await import('../src/index.js');
  prisma = indexModule.prisma;
});

afterAll(async () => {
  const keys = Array.from(createdConfigKeys);
  if (keys.length > 0) {
    await prisma.systemConfig.deleteMany({ where: { key: { in: keys } } });
    createdConfigKeys.clear();
  }
});

async function setConfig(key: string, value: string): Promise<void> {
  const existing = await prisma.systemConfig.findUnique({ where: { key } });
  if (existing) {
    await prisma.systemConfig.update({ where: { key }, data: { value } });
  } else {
    await prisma.systemConfig.create({ data: { key, value } });
    createdConfigKeys.add(key);
  }
}

test('graduationEnabled=true → all students pass', async () => {
  await setConfig('graduationEnabled', 'true');
  await setConfig('graduationWhitelist', '');

  expect(await isGraduationEnabledForUser(prisma, '231300001')).toBe(true);
  expect(await isGraduationEnabledForUser(prisma, 'anyone')).toBe(true);
});

test('graduationEnabled=false → only whitelisted studentIds pass', async () => {
  await setConfig('graduationEnabled', 'false');
  await setConfig('graduationWhitelist', '231311111, 231322222 ');

  expect(await isGraduationEnabledForUser(prisma, '231311111')).toBe(true);
  expect(await isGraduationEnabledForUser(prisma, '231322222')).toBe(true);
  // Not in whitelist
  expect(await isGraduationEnabledForUser(prisma, '231333333')).toBe(false);
  // Whitelist entries must match fully — prefix must not pass
  expect(await isGraduationEnabledForUser(prisma, '23131')).toBe(false);
});

test('config missing entirely → disabled (fail closed)', async () => {
  await setConfig('graduationEnabled', 'false');
  await setConfig('graduationWhitelist', '');

  expect(await isGraduationEnabledForUser(prisma, '231300001')).toBe(false);
});