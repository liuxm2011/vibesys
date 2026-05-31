import { PrismaClient } from '../generated/prisma'

export interface GiteeCommit {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
}

export interface RepoSyncData {
  commits: GiteeCommit[];
  readme: string | null;
  syncedAt: string;
  commitCount: number;
}

function parseGiteeUrl(repoUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(repoUrl);
    if (url.hostname !== 'gitee.com') return null;
    const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1].replace(/\.git$/, '') };
  } catch {
    const match = repoUrl.match(/gitee\.com[:/]([^/]+)\/([^/]+)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2].replace(/\.git$/, '') };
  }
}

async function fetchGiteeCommits(owner: string, repo: string): Promise<GiteeCommit[]> {
  const url = `https://gitee.com/api/v5/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/commits?per_page=20`;
  const response = await fetch(url, {
    signal: AbortSignal.timeout(15000),
    headers: { 'Accept': 'application/json' },
  });
  if (!response.ok) {
    throw new Error(`Gitee API 返回 ${response.status}`);
  }
  const data = await response.json() as any[];
  return data.map((c: any) => ({
    sha: c.sha?.substring(0, 7) ?? '',
    message: c.commit?.message?.split('\n')[0] ?? '',
    authorName: c.commit?.author?.name ?? '',
    authorDate: c.commit?.author?.date ?? '',
  }));
}

async function fetchGiteeReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const url = `https://gitee.com/api/v5/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/readme`;
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
      headers: { 'Accept': 'application/json' },
    });
    if (!response.ok) return null;
    const data = await response.json() as { content?: string; encoding?: string };
    if (data.content && data.encoding === 'base64') {
      const byteString = atob(data.content);
      const bytes = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i++) {
        bytes[i] = byteString.charCodeAt(i);
      }
      return new TextDecoder('utf-8').decode(bytes);
    }
    return null;
  } catch {
    return null;
  }
}

export async function syncRepoData(prisma: PrismaClient, projectId: number, userId: number): Promise<RepoSyncData> {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  if (!project.repoUrl) throw new Error('NO_REPO_URL');

  const parsed = parseGiteeUrl(project.repoUrl);
  if (!parsed) throw new Error('INVALID_GITEE_URL');

  const [commits, readme] = await Promise.all([
    fetchGiteeCommits(parsed.owner, parsed.repo),
    fetchGiteeReadme(parsed.owner, parsed.repo),
  ]);

  const syncData: RepoSyncData = {
    commits,
    readme,
    syncedAt: new Date().toISOString(),
    commitCount: commits.length,
  };

  await prisma.project.update({
    where: { id: projectId },
    data: { repoSyncData: syncData as any },
  });

  return syncData;
}

export async function updateRepoUrl(prisma: PrismaClient, projectId: number, userId: number, repoUrl: string | null): Promise<void> {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new Error('PROJECT_NOT_FOUND');

  if (repoUrl) {
    const parsed = parseGiteeUrl(repoUrl);
    if (!parsed) throw new Error('INVALID_GITEE_URL');
  }

  await prisma.project.update({
    where: { id: projectId },
    data: {
      repoUrl,
      ...(repoUrl ? {} : { repoSyncData: { set: null as any } }),
    },
  });
}

export async function getProjectRepoInfo(prisma: PrismaClient, projectId: number, userId: number) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    select: { repoUrl: true, repoSyncData: true, deployUrl: true },
  });
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  return project;
}

export async function updateDeployUrl(
  prisma: PrismaClient,
  projectId: number,
  userId: number,
  deployUrl: string | null
): Promise<void> {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  await prisma.project.update({
    where: { id: projectId },
    data: { deployUrl },
  });
}

export async function adminUpdateDeployUrl(
  prisma: PrismaClient,
  projectId: number,
  deployUrl: string | null
): Promise<void> {
  const project = await prisma.project.findFirst({ where: { id: projectId } });
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  await prisma.project.update({
    where: { id: projectId },
    data: { deployUrl },
  });
}

export async function adminUpdateFeatured(
  prisma: PrismaClient,
  projectId: number,
  isFeatured: boolean
): Promise<void> {
  const project = await prisma.project.findFirst({ where: { id: projectId } });
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  await prisma.project.update({
    where: { id: projectId },
    data: { isFeatured },
  });
}

export async function getAllProjectRepos(
  prisma: PrismaClient,
  filters: { hasDeployUrl?: boolean; major?: string; className?: string; featured?: boolean } = {}
) {
  const { hasDeployUrl, major, className, featured } = filters;
  // 注意：hasDeployUrl 不在 SQL 层过滤。一个学生可选多个题目，去重规则需要看到该学生
  // 的全部选题才能判断是否「至少有一个填了地址」，因此先取全量（仅按 major/class 过滤，
  // 这两个是按用户维度的、不会拆分同一学生的选题），去重后再在内存里应用 hasDeployUrl。
  const where: any = {};
  const userWhere: any = {};
  if (major) userWhere.major = major;
  if (className) userWhere.class = className;
  if (Object.keys(userWhere).length > 0) where.user = userWhere;

  const allProjects = await prisma.project.findMany({
    where,
    select: {
      id: true,
      userId: true,
      repoUrl: true,
      repoSyncData: true,
      deployUrl: true,
      isFeatured: true,
      user: { select: { studentId: true, name: true, major: true, grade: true, class: true } },
      topic: { select: { title: true } },
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  // 判定一个项目是否为「有效项目」：仓库地址或访问地址任意一个填写了即有效。
  const hasAddress = (p: { repoUrl: string | null; deployUrl: string | null }) =>
    !!(p.repoUrl && p.repoUrl.trim()) || !!(p.deployUrl && p.deployUrl.trim());

  // 按学生（userId）分组：若该学生名下至少有一个有效项目，则只保留其有效项目，
  // 隐藏其空白项目；若全部为空白，则原样全部保留。被标记为优秀的项目视为有效，
  // 永不被去重隐藏（避免手动标记丢失）。
  const userHasAddress = new Set<number>();
  for (const p of allProjects) {
    if (hasAddress(p)) userHasAddress.add(p.userId);
  }
  let projects = allProjects.filter(
    (p) => !userHasAddress.has(p.userId) || hasAddress(p) || p.isFeatured
  );

  // 去重后再应用 hasDeployUrl 过滤（已填写 / 未填写 访问地址）。
  if (hasDeployUrl === true) {
    projects = projects.filter((p) => !!(p.deployUrl && p.deployUrl.trim()));
  } else if (hasDeployUrl === false) {
    projects = projects.filter((p) => !(p.deployUrl && p.deployUrl.trim()));
  }

  // 仅看优秀（与上面的过滤可叠加）。
  if (featured === true) {
    projects = projects.filter((p) => p.isFeatured);
  }

  return projects.map((p) => ({
    projectId: p.id,
    studentId: p.user.studentId,
    studentName: p.user.name,
    major: p.user.major,
    grade: p.user.grade,
    className: p.user.class,
    topicTitle: p.topic.title,
    repoUrl: p.repoUrl,
    syncedAt: (p.repoSyncData as any)?.syncedAt ?? null,
    commitCount: (p.repoSyncData as any)?.commitCount ?? 0,
    deployUrl: p.deployUrl,
    isFeatured: p.isFeatured,
  }));
}
