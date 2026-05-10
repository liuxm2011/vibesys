import { PrismaClient } from '@prisma/client';

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
      return Buffer.from(data.content, 'base64').toString('utf-8');
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
    select: { repoUrl: true, repoSyncData: true },
  });
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  return project;
}

export async function getAllProjectRepos(prisma: PrismaClient) {
  const projects = await prisma.project.findMany({
    where: { repoUrl: { not: null } },
    select: {
      id: true,
      repoUrl: true,
      repoSyncData: true,
      user: { select: { studentId: true, name: true, major: true } },
      topic: { select: { title: true } },
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
  return projects.map((p) => ({
    projectId: p.id,
    studentId: p.user.studentId,
    studentName: p.user.name,
    major: p.user.major,
    topicTitle: p.topic.title,
    repoUrl: p.repoUrl,
    syncedAt: (p.repoSyncData as any)?.syncedAt ?? null,
    commitCount: (p.repoSyncData as any)?.commitCount ?? 0,
  }));
}
