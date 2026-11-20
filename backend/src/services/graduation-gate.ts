import type { PrismaClient } from '../generated/prisma';
import type { AuthenticatedUser } from '../types.js';

export type GraduationAccess = 'allowed' | 'closed' | 'ineligible';

export const graduationAccessErrors = {
  closed: '毕业设计尚未开放，请先使用项目设计。',
  ineligible: '毕业设计仅面向大数据专业学生开放。',
};

export async function getGraduationAccess(
  prisma: PrismaClient,
  user: Pick<AuthenticatedUser, 'role' | 'major'>,
): Promise<GraduationAccess> {
  if (user.role !== 'STUDENT' || user.major.trim() !== '大数据') {
    return 'ineligible';
  }

  const config = await prisma.systemConfig.findUnique({
    where: { key: 'graduationEnabled' },
    select: { value: true },
  });
  return config?.value === 'true' ? 'allowed' : 'closed';
}

// 毕业设计与项目设计共用文档接口，关联项目也要遵守毕业设计开关。
export async function getLinkedGraduationAccessError(
  prisma: PrismaClient,
  user: AuthenticatedUser,
  thesisProject: { id: number } | null,
): Promise<string | null> {
  if (!thesisProject) return null;
  const access = await getGraduationAccess(prisma, user);
  return access === 'allowed' ? null : graduationAccessErrors[access];
}
