import type { PrismaClient } from '../generated/prisma';

/**
 * 毕业设计功能开关 + 白名单的服务端校验。
 * UI 层的 /status 判断与选题/生成接口的门槛共用此逻辑，防止仅前端门控被绕过。
 */
export async function isGraduationEnabledForUser(
  prisma: PrismaClient,
  studentId: string
): Promise<boolean> {
  const enabledConfig = await prisma.systemConfig.findUnique({
    where: { key: 'graduationEnabled' }
  });

  if (enabledConfig?.value === 'true') {
    return true;
  }

  const whitelistConfig = await prisma.systemConfig.findUnique({
    where: { key: 'graduationWhitelist' }
  });

  const whitelist = (whitelistConfig?.value || '').split(',').map(s => s.trim()).filter(Boolean);
  return whitelist.includes(studentId);
}