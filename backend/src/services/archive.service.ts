import { PrismaClient } from '../generated/prisma';

/**
 * 返回所有已归档的年级字符串（如 ["2023级"]）。
 * 管理后台各列表接口用它来排除归档年级（whereClause.grade = { notIn }）。
 * 归档年级为空时返回空数组，调用方据此跳过过滤。
 */
export async function getArchivedGrades(prisma: PrismaClient): Promise<string[]> {
  const rows = await prisma.archivedGrade.findMany({ select: { grade: true } });
  return rows.map((r) => r.grade);
}
