# 学生作品归档部署（Coolify 集成）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 学生在 vibesys 提交 Git 仓库地址与环境变量，后端调用校内 Coolify REST API 创建独立容器并部署，永久保留可交互的作品，前端每 5 秒轮询构建状态。

**Architecture:** 后端新增 `coolify.service.ts`——分两层：纯函数（`parseEnvVars` / `isValidGitUrl` / `mapCoolifyStatus`，可单测）+ Coolify HTTP 客户端与编排函数（`archiveProject` / `archiveThesisProject` / `getProjectArchiveStatus` / `getThesisArchiveStatus`）。`Project` 与 `ThesisProject` 各加 3 个字段（`archiveUrl` / `archiveStatus` / `coolifyAppId`）。路由层在 `projects.routes.ts` 与 `thesis.routes.ts` 暴露触发与轮询端点。前端用一个自包含组件 `ArchiveDeployPanel.vue` 挂在项目详情页和毕设页两处。Coolify 配置缺失时端点返回 503，因此代码可在 Coolify 服务器就绪前安全部署（功能休眠）。

**Tech Stack:** Cloudflare Workers + Hono + Prisma(@prisma/adapter-d1) + D1(SQLite) 后端；Vue 3 + TypeScript + Element Plus 前端；node:test 测试（`npx tsx --test`，本仓库未安装 vitest）。

**⚠️ 关键约束（来自 CLAUDE.md）：**
- 生产 D1 schema 变更必须在 push 部署 Worker **之前**手动 `ALTER TABLE`，否则线上查询 500。本计划把生产迁移与部署集中在最后的 Task 13（人工、需用户授权）。
- 前面所有任务只改本地代码与本地 dev.db，**不 push、不动生产**。
- Coolify 校内服务器尚未安装；Task 1–12 不依赖它即可完成与本地验证。Coolify 的真实 v4 API 形状（端点路径、`status` 取值）在 Task 4 中按官方文档写入但标注「需对真实实例校验」，激活在 Task 13。

---

## File Structure

**后端：**
- Modify `backend/prisma/schema.prisma` — `Project` 与 `ThesisProject` 各加 3 字段。
- Modify `backend/src/types.ts` — `Bindings` 加 4 个可选 `COOLIFY_*`。
- Create `backend/src/services/coolify.service.ts` — 纯函数 + Coolify 客户端 + 4 个编排函数。
- Create `backend/tests/coolify-service.test.ts` — 纯函数单测（node:test）。
- Modify `backend/src/routes/projects.routes.ts` — `POST /:id/archive`、`GET /:id/archive/status`。
- Modify `backend/src/routes/thesis.routes.ts` — `POST /project/archive`、`GET /project/archive/status`。

**前端：**
- Modify `frontend/src/types/project.ts` — `ProjectDetail` 加 3 字段。
- Modify `frontend/src/types/thesis.ts` — `ThesisProject` 加 3 字段。
- Modify `frontend/src/api/project.api.ts` — `archiveProjectApi`、`getProjectArchiveStatusApi`。
- Modify `frontend/src/api/thesis.api.ts` — `archiveThesisApi`、`getThesisArchiveStatusApi`。
- Create `frontend/src/components/ArchiveDeployPanel.vue` — 自包含面板（弹窗 + 触发 + 轮询 + 状态展示）。
- Modify `frontend/src/views/ProjectDetail.vue` — 挂载面板（project 模式）。
- Modify `frontend/src/views/graduation/GraduationDashboard.vue` — 挂载面板（thesis 模式）。

**最后：**
- Modify `backend/wrangler.toml` — 非敏感 Coolify 配置进 `[vars]`（Task 13）。
- 生产 D1 `ALTER TABLE`、`wrangler secret put`、push 部署（Task 13，人工）。

---

## Task 1: Schema — Project 与 ThesisProject 新增归档字段

**Files:**
- Modify: `backend/prisma/schema.prisma:126-152`（Project）、`backend/prisma/schema.prisma:269-282`（ThesisProject）

- [ ] **Step 1: 给 Project 加 3 字段**

在 `backend/prisma/schema.prisma` 的 `model Project` 中，`deployUrl` 行之后、`isFeatured` 行之前插入：

```prisma
  deployUrl       String?       // 部署访问地址（学生填写）
  archiveUrl      String?       // Coolify 分配的永久访问地址（归档部署）
  archiveStatus   String?       // 归档部署状态: pending / building / running / failed
  coolifyAppId    String?       // Coolify 内部 application UUID
  isFeatured      Boolean       @default(false)  // 管理员标记的优秀项目
```

（即在已有 `deployUrl` 与 `isFeatured` 之间插入三行；保持其余不变。）

- [ ] **Step 2: 给 ThesisProject 加 3 字段**

在 `model ThesisProject` 中，`deployUrl String?` 行之后插入：

```prisma
  repoUrl   String?
  deployUrl String?
  archiveUrl    String?   // Coolify 永久访问地址
  archiveStatus String?   // pending / building / running / failed
  coolifyAppId  String?   // Coolify application UUID
  createdAt DateTime     @default(now())
```

- [ ] **Step 3: 生成本地迁移并重新生成客户端**

Run:
```bash
cd backend && DATABASE_URL="file:./dev.db" npx prisma migrate dev --name add_archive_deploy_fields
```
Expected: 输出 `Your database is now in sync with your schema.` 且自动 `Generated Prisma Client`。生成 `backend/prisma/migrations/<timestamp>_add_archive_deploy_fields/migration.sql`。

- [ ] **Step 4: 校验生成的客户端含新字段**

Run:
```bash
cd backend && grep -c "archiveStatus" src/generated/prisma/index.d.ts
```
Expected: 输出 `>= 2`（非 0），证明客户端类型已含新字段。

- [ ] **Step 5: 校验本地迁移 SQL 是增量 ALTER（不含 DROP TABLE）**

Run:
```bash
cd backend && cat prisma/migrations/*add_archive_deploy_fields/migration.sql
```
Expected: 全部为 `ALTER TABLE ... ADD COLUMN`，**不含** `DROP TABLE`。若含 DROP TABLE，记录下来——Task 13 生产环境只手写 ADD COLUMN，不照搬此文件。

- [ ] **Step 6: Commit**

```bash
cd backend && git add prisma/schema.prisma prisma/migrations src/generated/prisma
git commit -m "feat(schema): Project/ThesisProject 新增归档部署字段（archiveUrl/archiveStatus/coolifyAppId）"
```

---

## Task 2: Bindings — types.ts 增加 COOLIFY_* 环境变量

**Files:**
- Modify: `backend/src/types.ts:10-19`

- [ ] **Step 1: 在 Bindings 中加入 4 个可选 Coolify 变量**

将 `backend/src/types.ts` 的 `Bindings` 块改为：

```typescript
export type AppEnv = {
  Bindings: {
    DB: D1Database;
    JWT_SECRET: string;
    FRONTEND_URL?: string;
    MINIMAX_API_KEY?: string;
    MINIMAX_BASE_URL?: string;
    MINIMAX_MODEL?: string;
    NODE_ENV?: string;
    COOLIFY_BASE_URL?: string;
    COOLIFY_API_TOKEN?: string;
    COOLIFY_SERVER_UUID?: string;
    COOLIFY_PROJECT_UUID?: string;
  };
  Variables: {
    user: JwtPayload;
    prisma: PrismaClient;
  };
};
```

- [ ] **Step 2: 类型检查通过**

Run:
```bash
cd backend && npx tsc --noEmit
```
Expected: 无错误退出（exit 0）。

- [ ] **Step 3: Commit**

```bash
cd backend && git add src/types.ts
git commit -m "feat(types): Bindings 增加 COOLIFY_* 环境变量"
```

---

## Task 3: coolify.service.ts 纯函数 + 单测（TDD）

**Files:**
- Create: `backend/src/services/coolify.service.ts`
- Test: `backend/tests/coolify-service.test.ts`

- [ ] **Step 1: 先写失败的测试**

Create `backend/tests/coolify-service.test.ts`:

```typescript
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  parseEnvVars,
  isValidGitUrl,
  mapCoolifyStatus,
} from '../src/services/coolify.service.js';

test('parseEnvVars: 解析多行 key=value，忽略空行与注释', () => {
  const raw = 'DB_HOST=localhost\n\n# comment\nDB_PORT=5432';
  assert.deepEqual(parseEnvVars(raw), [
    { key: 'DB_HOST', value: 'localhost' },
    { key: 'DB_PORT', value: '5432' },
  ]);
});

test('parseEnvVars: 值中允许含等号（按首个=切分）', () => {
  assert.deepEqual(parseEnvVars('URL=postgres://a=b@host'), [
    { key: 'URL', value: 'postgres://a=b@host' },
  ]);
});

test('parseEnvVars: 空/未定义返回空数组', () => {
  assert.deepEqual(parseEnvVars(''), []);
  assert.deepEqual(parseEnvVars(undefined), []);
  assert.deepEqual(parseEnvVars(null), []);
});

test('parseEnvVars: 非法行（无等号或空键）抛 INVALID_ENV_LINE', () => {
  assert.throws(() => parseEnvVars('JUST_A_KEY'), /INVALID_ENV_LINE/);
  assert.throws(() => parseEnvVars('=novalue'), /INVALID_ENV_LINE/);
});

test('isValidGitUrl: 接受 http/https，拒绝其他', () => {
  assert.equal(isValidGitUrl('https://gitee.com/a/b.git'), true);
  assert.equal(isValidGitUrl('http://github.com/a/b'), true);
  assert.equal(isValidGitUrl('git@github.com:a/b.git'), false);
  assert.equal(isValidGitUrl('not a url'), false);
  assert.equal(isValidGitUrl(''), false);
});

test('mapCoolifyStatus: 映射 Coolify 状态到归档状态', () => {
  assert.equal(mapCoolifyStatus('running'), 'running');
  assert.equal(mapCoolifyStatus('running:healthy'), 'running');
  assert.equal(mapCoolifyStatus('exited'), 'failed');
  assert.equal(mapCoolifyStatus('error'), 'failed');
  assert.equal(mapCoolifyStatus('starting'), 'building');
  assert.equal(mapCoolifyStatus(undefined), 'building');
});
```

- [ ] **Step 2: 运行测试确认失败**

Run:
```bash
cd backend && npx tsx --test tests/coolify-service.test.ts
```
Expected: FAIL — 报错 `Cannot find module '.../coolify.service.js'`（文件尚不存在）。

- [ ] **Step 3: 写最小实现（仅纯函数）**

Create `backend/src/services/coolify.service.ts`:

```typescript
export type ArchiveStatus = 'pending' | 'building' | 'running' | 'failed';

export interface ParsedEnvVar {
  key: string;
  value: string;
}

/**
 * 解析多行 "key=value" 环境变量文本。
 * - 一行一对；空行与以 # 开头的行忽略。
 * - 按首个 '=' 切分，值中可含 '='。
 * - 非空行无 '=' 或键为空时抛 Error('INVALID_ENV_LINE:<line>')。
 */
export function parseEnvVars(raw: string | null | undefined): ParsedEnvVar[] {
  if (!raw) return [];
  const result: ParsedEnvVar[] = [];
  for (const rawLine of raw.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) throw new Error(`INVALID_ENV_LINE:${line}`);
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!key) throw new Error(`INVALID_ENV_LINE:${line}`);
    result.push({ key, value });
  }
  return result;
}

/** 仅接受 http/https 的 Git 仓库地址，长度上限 500。 */
export function isValidGitUrl(url: unknown): boolean {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.length === 0 || trimmed.length > 500) return false;
  try {
    const u = new URL(trimmed);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** 把 Coolify 的 application status 映射为本系统归档状态。 */
export function mapCoolifyStatus(status: string | null | undefined): ArchiveStatus {
  const base = (status ?? '').toLowerCase().split(':')[0].trim();
  switch (base) {
    case 'running':
      return 'running';
    case 'exited':
    case 'error':
    case 'failed':
    case 'degraded':
      return 'failed';
    default:
      return 'building';
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run:
```bash
cd backend && npx tsx --test tests/coolify-service.test.ts
```
Expected: PASS — 所有断言通过，无失败。

- [ ] **Step 5: Commit**

```bash
cd backend && git add src/services/coolify.service.ts tests/coolify-service.test.ts
git commit -m "feat(coolify): 归档部署纯函数（parseEnvVars/isValidGitUrl/mapCoolifyStatus）+ 单测"
```

---

## Task 4: coolify.service.ts — Coolify 客户端 + 编排函数

**Files:**
- Modify: `backend/src/services/coolify.service.ts`（追加，不改 Task 3 已有导出）

> ⚠️ Coolify v4 REST API 的端点路径与字段按官方文档写入，但本仓库无法在 Coolify 就绪前联调；下方所有路径与字段集中在 `COOLIFY_PATHS` 常量与各 client 函数中，Task 13 联调时只需在此处校正。

- [ ] **Step 1: 在文件顶部加 import**

在 `backend/src/services/coolify.service.ts` **第一行之前**（文件最顶部）插入两个 type-only import：

```typescript
import type { PrismaClient } from '../generated/prisma';
import type { AppEnv } from '../types.js';
```

- [ ] **Step 2: 在文件末尾追加配置解析、客户端、编排函数**

在 `backend/src/services/coolify.service.ts` **末尾**追加：

```typescript
export interface CoolifyConfig {
  baseUrl: string;
  apiToken: string;
  serverUuid: string;
  projectUuid: string;
}

/** 从 env 读取 Coolify 配置；任一缺失返回 null（端点据此返回 503）。 */
export function getCoolifyConfig(env: AppEnv['Bindings']): CoolifyConfig | null {
  const baseUrl = env.COOLIFY_BASE_URL;
  const apiToken = env.COOLIFY_API_TOKEN;
  const serverUuid = env.COOLIFY_SERVER_UUID;
  const projectUuid = env.COOLIFY_PROJECT_UUID;
  if (!baseUrl || !apiToken || !serverUuid || !projectUuid) return null;
  return {
    baseUrl: baseUrl.replace(/\/+$/, ''),
    apiToken,
    serverUuid,
    projectUuid,
  };
}

// ⚠️ 待真实 Coolify v4 实例校验的端点路径。
const COOLIFY_PATHS = {
  createPublicApp: '/api/v1/applications/public',
  appEnvs: (uuid: string) => `/api/v1/applications/${uuid}/envs`,
  deploy: '/api/v1/deploy',
  app: (uuid: string) => `/api/v1/applications/${uuid}`,
};

async function coolifyFetch<T>(
  config: CoolifyConfig,
  path: string,
  init?: RequestInit
): Promise<T | null> {
  const res = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    signal: AbortSignal.timeout(20000),
    headers: {
      Authorization: `Bearer ${config.apiToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`COOLIFY_API_ERROR:${res.status}:${text.slice(0, 200)}`);
  }
  if (res.status === 204) return null;
  return (await res.json()) as T;
}

interface CoolifyApp {
  uuid: string;
  fqdn?: string | null;
  status?: string | null;
}

/** 创建一个公共 Git application（nixpacks 自动识别技术栈）。 */
async function createApplication(config: CoolifyConfig, gitUrl: string): Promise<CoolifyApp> {
  const app = await coolifyFetch<CoolifyApp>(config, COOLIFY_PATHS.createPublicApp, {
    method: 'POST',
    body: JSON.stringify({
      project_uuid: config.projectUuid,
      server_uuid: config.serverUuid,
      environment_name: 'production',
      git_repository: gitUrl,
      git_branch: 'main',
      build_pack: 'nixpacks',
      instant_deploy: false,
    }),
  });
  if (!app?.uuid) throw new Error('COOLIFY_API_ERROR:0:missing uuid in create response');
  return app;
}

async function setApplicationEnv(
  config: CoolifyConfig,
  uuid: string,
  key: string,
  value: string
): Promise<void> {
  await coolifyFetch(config, COOLIFY_PATHS.appEnvs(uuid), {
    method: 'POST',
    body: JSON.stringify({ key, value, is_preview: false }),
  });
}

async function triggerDeploy(config: CoolifyConfig, uuid: string): Promise<void> {
  await coolifyFetch(config, COOLIFY_PATHS.deploy, {
    method: 'POST',
    body: JSON.stringify({ uuid }),
  });
}

async function getApplication(config: CoolifyConfig, uuid: string): Promise<CoolifyApp> {
  const app = await coolifyFetch<CoolifyApp>(config, COOLIFY_PATHS.app(uuid), { method: 'GET' });
  if (!app) throw new Error('COOLIFY_API_ERROR:0:empty app response');
  return app;
}

/** 触发归档部署：建应用 → 注入环境变量 → 部署 → 写回 D1（环境变量不落库）。 */
async function deployToCoolify(
  config: CoolifyConfig,
  gitUrl: string,
  envVars: ParsedEnvVar[]
): Promise<{ uuid: string; fqdn: string | null }> {
  const app = await createApplication(config, gitUrl);
  for (const { key, value } of envVars) {
    await setApplicationEnv(config, app.uuid, key, value);
  }
  await triggerDeploy(config, app.uuid);
  return { uuid: app.uuid, fqdn: app.fqdn ?? null };
}

export interface ArchiveResult {
  coolifyAppId: string;
  archiveStatus: ArchiveStatus;
  archiveUrl: string | null;
}

export interface ArchiveStatusResult {
  archiveStatus: ArchiveStatus | null;
  archiveUrl: string | null;
}

/** 项目设计：触发归档部署。 */
export async function archiveProject(
  prisma: PrismaClient,
  config: CoolifyConfig,
  opts: { projectId: number; userId: number; gitUrl: string; envVars: ParsedEnvVar[] }
): Promise<ArchiveResult> {
  const project = await prisma.project.findFirst({
    where: { id: opts.projectId, userId: opts.userId },
    select: { id: true },
  });
  if (!project) throw new Error('PROJECT_NOT_FOUND');

  const { uuid, fqdn } = await deployToCoolify(config, opts.gitUrl, opts.envVars);
  await prisma.project.update({
    where: { id: opts.projectId },
    data: { coolifyAppId: uuid, archiveStatus: 'building', archiveUrl: fqdn },
  });
  return { coolifyAppId: uuid, archiveStatus: 'building', archiveUrl: fqdn };
}

/** 项目设计：查询并按需回写归档状态。 */
export async function getProjectArchiveStatus(
  prisma: PrismaClient,
  config: CoolifyConfig,
  opts: { projectId: number; userId: number }
): Promise<ArchiveStatusResult> {
  const project = await prisma.project.findFirst({
    where: { id: opts.projectId, userId: opts.userId },
    select: { coolifyAppId: true, archiveStatus: true, archiveUrl: true },
  });
  if (!project) throw new Error('PROJECT_NOT_FOUND');
  if (!project.coolifyAppId) {
    return {
      archiveStatus: (project.archiveStatus as ArchiveStatus | null) ?? null,
      archiveUrl: project.archiveUrl ?? null,
    };
  }
  const app = await getApplication(config, project.coolifyAppId);
  const status = mapCoolifyStatus(app.status);
  const fqdn = app.fqdn ?? project.archiveUrl ?? null;
  if (status !== project.archiveStatus || (fqdn && fqdn !== project.archiveUrl)) {
    await prisma.project.update({
      where: { id: opts.projectId },
      data: { archiveStatus: status, archiveUrl: fqdn },
    });
  }
  return { archiveStatus: status, archiveUrl: fqdn };
}

/** 毕业设计：触发归档部署（按 userId 定位 ThesisProject）。 */
export async function archiveThesisProject(
  prisma: PrismaClient,
  config: CoolifyConfig,
  opts: { userId: number; gitUrl: string; envVars: ParsedEnvVar[] }
): Promise<ArchiveResult> {
  const project = await prisma.thesisProject.findUnique({
    where: { userId: opts.userId },
    select: { id: true },
  });
  if (!project) throw new Error('THESIS_NOT_FOUND');

  const { uuid, fqdn } = await deployToCoolify(config, opts.gitUrl, opts.envVars);
  await prisma.thesisProject.update({
    where: { userId: opts.userId },
    data: { coolifyAppId: uuid, archiveStatus: 'building', archiveUrl: fqdn },
  });
  return { coolifyAppId: uuid, archiveStatus: 'building', archiveUrl: fqdn };
}

/** 毕业设计：查询并按需回写归档状态。 */
export async function getThesisArchiveStatus(
  prisma: PrismaClient,
  config: CoolifyConfig,
  opts: { userId: number }
): Promise<ArchiveStatusResult> {
  const project = await prisma.thesisProject.findUnique({
    where: { userId: opts.userId },
    select: { coolifyAppId: true, archiveStatus: true, archiveUrl: true },
  });
  if (!project) throw new Error('THESIS_NOT_FOUND');
  if (!project.coolifyAppId) {
    return {
      archiveStatus: (project.archiveStatus as ArchiveStatus | null) ?? null,
      archiveUrl: project.archiveUrl ?? null,
    };
  }
  const app = await getApplication(config, project.coolifyAppId);
  const status = mapCoolifyStatus(app.status);
  const fqdn = app.fqdn ?? project.archiveUrl ?? null;
  if (status !== project.archiveStatus || (fqdn && fqdn !== project.archiveUrl)) {
    await prisma.thesisProject.update({
      where: { userId: opts.userId },
      data: { archiveStatus: status, archiveUrl: fqdn },
    });
  }
  return { archiveStatus: status, archiveUrl: fqdn };
}
```

- [ ] **Step 3: 类型检查通过**

Run:
```bash
cd backend && npx tsc --noEmit
```
Expected: exit 0，无错误。

- [ ] **Step 4: 重跑纯函数测试，确认未回归**

Run:
```bash
cd backend && npx tsx --test tests/coolify-service.test.ts
```
Expected: PASS（Task 3 的全部断言仍通过）。

- [ ] **Step 5: Commit**

```bash
cd backend && git add src/services/coolify.service.ts
git commit -m "feat(coolify): Coolify v4 客户端与归档编排（project/thesis 触发+状态查询）"
```

---

## Task 5: projects.routes.ts — 归档触发与状态端点

**Files:**
- Modify: `backend/src/routes/projects.routes.ts`（顶部 import + 文件末尾 `export default router;` 之前插入两个 handler）

- [ ] **Step 1: 增加 import**

在 `backend/src/routes/projects.routes.ts` 顶部、`import { logger } from '../lib/logger.js';` 之后插入：

```typescript
import {
  getCoolifyConfig,
  archiveProject,
  getProjectArchiveStatus,
  parseEnvVars,
  isValidGitUrl,
} from '../services/coolify.service.js';
```

- [ ] **Step 2: 在 `export default router;` 之前插入两个 handler**

```typescript
// 触发归档部署：调用 Coolify 创建独立容器并部署。环境变量透传给 Coolify，不落库。
router.post('/:id/archive', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const projectId = parseInt(c.req.param('id'));
    if (isNaN(projectId)) return c.json({ error: '无效的项目ID' }, 400);

    const config = getCoolifyConfig(c.env);
    if (!config) return c.json({ error: '归档部署服务未配置，请联系管理员' }, 503);

    const body = await c.req.json().catch(() => ({}));
    const gitUrl = typeof body.gitUrl === 'string' ? body.gitUrl.trim() : '';
    if (!isValidGitUrl(gitUrl)) {
      return c.json({ error: '请填写有效的 Git 仓库地址（需 http/https）' }, 400);
    }

    let envVars;
    try {
      envVars = parseEnvVars(body.envVars);
    } catch (e: any) {
      const bad = String(e.message).replace('INVALID_ENV_LINE:', '');
      return c.json({ error: `环境变量格式错误（需 key=value）：${bad}` }, 400);
    }

    const result = await archiveProject(prisma, config, {
      projectId,
      userId: user.userId,
      gitUrl,
      envVars,
    });
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }
    if (String(error.message).startsWith('COOLIFY_API_ERROR')) {
      logger.error('Coolify deploy error:', error);
      return c.json({ error: '部署服务调用失败，请稍后重试' }, 502);
    }
    logger.error('Archive deploy error:', error);
    return c.json({ error: '归档部署失败' }, 500);
  }
});

// 查询归档构建状态（前端每 5 秒轮询）。
router.get('/:id/archive/status', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const projectId = parseInt(c.req.param('id'));
    if (isNaN(projectId)) return c.json({ error: '无效的项目ID' }, 400);

    const config = getCoolifyConfig(c.env);
    if (!config) return c.json({ error: '归档部署服务未配置' }, 503);

    const result = await getProjectArchiveStatus(prisma, config, {
      projectId,
      userId: user.userId,
    });
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return c.json({ error: '项目不存在或无权限访问' }, 404);
    }
    if (String(error.message).startsWith('COOLIFY_API_ERROR')) {
      logger.error('Coolify status error:', error);
      return c.json({ error: '查询部署状态失败' }, 502);
    }
    logger.error('Archive status error:', error);
    return c.json({ error: '查询部署状态失败' }, 500);
  }
});
```

- [ ] **Step 3: 类型检查通过**

Run:
```bash
cd backend && npx tsc --noEmit
```
Expected: exit 0。

- [ ] **Step 4: Commit**

```bash
cd backend && git add src/routes/projects.routes.ts
git commit -m "feat(projects): 归档部署触发与状态查询端点"
```

---

## Task 6: thesis.routes.ts — 毕设归档触发与状态端点

**Files:**
- Modify: `backend/src/routes/thesis.routes.ts`（顶部 import + `export default router;` 之前插入两个 handler）

- [ ] **Step 1: 增加 import**

在 `backend/src/routes/thesis.routes.ts` 顶部、`import { logger } from '../lib/logger.js';` 之后插入：

```typescript
import {
  getCoolifyConfig,
  archiveThesisProject,
  getThesisArchiveStatus,
  parseEnvVars,
  isValidGitUrl,
} from '../services/coolify.service.js';
```

- [ ] **Step 2: 在 `export default router;` 之前插入两个 handler**

```typescript
// POST /api/thesis/project/archive — 毕设归档部署
router.post('/project/archive', authMiddleware, viewerBlockMiddleware, checkBannedMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');

    const config = getCoolifyConfig(c.env);
    if (!config) return c.json({ error: '归档部署服务未配置，请联系管理员' }, 503);

    const body = await c.req.json().catch(() => ({}));
    const gitUrl = typeof body.gitUrl === 'string' ? body.gitUrl.trim() : '';
    if (!isValidGitUrl(gitUrl)) {
      return c.json({ error: '请填写有效的 Git 仓库地址（需 http/https）' }, 400);
    }

    let envVars;
    try {
      envVars = parseEnvVars(body.envVars);
    } catch (e: any) {
      const bad = String(e.message).replace('INVALID_ENV_LINE:', '');
      return c.json({ error: `环境变量格式错误（需 key=value）：${bad}` }, 400);
    }

    const result = await archiveThesisProject(prisma, config, {
      userId: user.userId,
      gitUrl,
      envVars,
    });
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'THESIS_NOT_FOUND') {
      return c.json({ error: '请先选择毕业设计题目' }, 404);
    }
    if (String(error.message).startsWith('COOLIFY_API_ERROR')) {
      logger.error('Coolify thesis deploy error:', error);
      return c.json({ error: '部署服务调用失败，请稍后重试' }, 502);
    }
    logger.error('Thesis archive deploy error:', error);
    return c.json({ error: '归档部署失败' }, 500);
  }
});

// GET /api/thesis/project/archive/status — 毕设归档状态查询（前端轮询）
router.get('/project/archive/status', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');

    const config = getCoolifyConfig(c.env);
    if (!config) return c.json({ error: '归档部署服务未配置' }, 503);

    const result = await getThesisArchiveStatus(prisma, config, { userId: user.userId });
    return c.json(result);
  } catch (error: any) {
    if (error.message === 'THESIS_NOT_FOUND') {
      return c.json({ error: '请先选择毕业设计题目' }, 404);
    }
    if (String(error.message).startsWith('COOLIFY_API_ERROR')) {
      logger.error('Coolify thesis status error:', error);
      return c.json({ error: '查询部署状态失败' }, 502);
    }
    logger.error('Thesis archive status error:', error);
    return c.json({ error: '查询部署状态失败' }, 500);
  }
});
```

- [ ] **Step 3: 类型检查通过**

Run:
```bash
cd backend && npx tsc --noEmit
```
Expected: exit 0。

- [ ] **Step 4: Commit**

```bash
cd backend && git add src/routes/thesis.routes.ts
git commit -m "feat(thesis): 毕设归档部署触发与状态查询端点"
```

---

## Task 7: 前端类型 — 增加归档字段

**Files:**
- Modify: `frontend/src/types/project.ts:40-57`（ProjectDetail）
- Modify: `frontend/src/types/thesis.ts`（ThesisProject）

- [ ] **Step 1: ProjectDetail 加 3 字段**

在 `frontend/src/types/project.ts` 的 `ProjectDetail` 接口中，`deployUrl: string | null;` 之后插入：

```typescript
  deployUrl: string | null;
  archiveUrl: string | null;
  archiveStatus: string | null;
  coolifyAppId: string | null;
```

- [ ] **Step 2: ThesisProject 加 3 字段**

在 `frontend/src/types/thesis.ts` 的 `ThesisProject` 接口中，`deployUrl?: string` 之后插入：

```typescript
  repoUrl?: string
  deployUrl?: string
  archiveUrl?: string | null
  archiveStatus?: string | null
  coolifyAppId?: string | null
```

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/types/project.ts src/types/thesis.ts
git commit -m "feat(types): 前端 ProjectDetail/ThesisProject 增加归档字段"
```

---

## Task 8: 前端 API 函数

**Files:**
- Modify: `frontend/src/api/project.api.ts`（文件末尾追加）
- Modify: `frontend/src/api/thesis.api.ts`（文件末尾追加）

- [ ] **Step 1: project.api.ts 追加两个函数**

在 `frontend/src/api/project.api.ts` 末尾追加：

```typescript
export interface ArchiveResult {
  coolifyAppId: string;
  archiveStatus: string;
  archiveUrl: string | null;
}

export interface ArchiveStatusResult {
  archiveStatus: string | null;
  archiveUrl: string | null;
}

/** 触发项目归档部署（gitUrl + envVars 多行 key=value 文本） */
export async function archiveProjectApi(
  projectId: number,
  body: { gitUrl: string; envVars: string }
): Promise<ArchiveResult> {
  return api.post<ArchiveResult>(`/api/projects/${projectId}/archive`, body);
}

/** 查询项目归档构建状态（轮询） */
export async function getProjectArchiveStatusApi(
  projectId: number
): Promise<ArchiveStatusResult> {
  return api.get<ArchiveStatusResult>(`/api/projects/${projectId}/archive/status`);
}
```

- [ ] **Step 2: thesis.api.ts 追加两个函数**

在 `frontend/src/api/thesis.api.ts` 末尾追加：

```typescript
export interface ArchiveResult {
  coolifyAppId: string;
  archiveStatus: string;
  archiveUrl: string | null;
}

export interface ArchiveStatusResult {
  archiveStatus: string | null;
  archiveUrl: string | null;
}

/** 触发毕设归档部署 */
export async function archiveThesisApi(
  body: { gitUrl: string; envVars: string }
): Promise<ArchiveResult> {
  return request<ArchiveResult>('/api/thesis/project/archive', { method: 'POST', body });
}

/** 查询毕设归档构建状态（轮询） */
export async function getThesisArchiveStatusApi(): Promise<ArchiveStatusResult> {
  return request<ArchiveStatusResult>('/api/thesis/project/archive/status');
}
```

- [ ] **Step 3: Commit**

```bash
cd frontend && git add src/api/project.api.ts src/api/thesis.api.ts
git commit -m "feat(api): 前端归档部署接口（project/thesis 触发+状态）"
```

---

## Task 9: ArchiveDeployPanel.vue 组件

**Files:**
- Create: `frontend/src/components/ArchiveDeployPanel.vue`

自包含面板：根据 `mode` 调用对应 API，内部管理弹窗、触发、5 秒轮询与状态展示；样式对齐 `DeployUrlPanel.vue`。

- [ ] **Step 1: 创建组件**

Create `frontend/src/components/ArchiveDeployPanel.vue`:

```vue
<template>
  <div class="archive-deploy-panel">
    <div class="panel-header">
      <span class="panel-title">归档部署</span>
      <el-button
        v-if="!disabled && (status === null || status === 'failed')"
        size="small"
        text
        type="primary"
        @click="openDialog"
      >
        {{ status === 'failed' ? '重试' : '提交归档' }}
      </el-button>
    </div>

    <!-- 未部署 -->
    <div v-if="status === null" class="hint">提交后将永久部署到校内服务器，作品不依赖你的服务器续费。</div>

    <!-- 构建中 -->
    <div v-else-if="status === 'building' || status === 'pending'" class="status-row building">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>正在构建并部署…</span>
    </div>

    <!-- 运行中 -->
    <div v-else-if="status === 'running'" class="status-row running">
      <div class="status-label"><el-icon><CircleCheck /></el-icon><span>已部署</span></div>
      <a v-if="archiveUrl" :href="normalizeUrl(archiveUrl)" target="_blank" rel="noopener" class="url-link">
        {{ archiveUrl }}
      </a>
      <span v-else class="hint">地址生成中…</span>
    </div>

    <!-- 失败 -->
    <div v-else-if="status === 'failed'" class="status-row failed">
      <el-icon><CircleClose /></el-icon>
      <span>部署失败，请检查仓库与环境变量后重试。</span>
    </div>

    <!-- 提交弹窗 -->
    <el-dialog v-model="dialogVisible" title="提交归档部署" width="540px" append-to-body>
      <el-form label-position="top">
        <el-form-item label="Git 仓库地址">
          <el-input v-model="gitUrl" placeholder="https://gitee.com/owner/repo" clearable />
        </el-form-item>
        <el-form-item label="环境变量（每行一个 key=value，可留空）">
          <el-input
            v-model="envVars"
            type="textarea"
            :rows="5"
            placeholder="DB_HOST=db.internal&#10;DB_PORT=5432&#10;API_KEY=xxxx"
          />
          <div class="tip">
            提示：数据库连接地址等配置请用环境变量传入，<b>不要硬编码旧服务器 IP</b>。环境变量仅透传给部署平台，不会保存在本系统。
          </div>
        </el-form-item>
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submit">提交部署</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Loading, CircleCheck, CircleClose } from '@element-plus/icons-vue';
import {
  archiveProjectApi,
  getProjectArchiveStatusApi,
} from '@/api/project.api';
import {
  archiveThesisApi,
  getThesisArchiveStatusApi,
} from '@/api/thesis.api';

const props = defineProps<{
  mode: 'project' | 'thesis';
  projectId?: number;
  repoUrl?: string | null;
  initialStatus?: string | null;
  initialUrl?: string | null;
  disabled?: boolean;
}>();

const status = ref<string | null>(props.initialStatus ?? null);
const archiveUrl = ref<string | null>(props.initialUrl ?? null);

const dialogVisible = ref(false);
const gitUrl = ref('');
const envVars = ref('');
const errorMsg = ref('');
const submitting = ref(false);

let pollTimer: ReturnType<typeof setInterval> | null = null;

function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

function openDialog() {
  gitUrl.value = props.repoUrl ?? '';
  envVars.value = '';
  errorMsg.value = '';
  dialogVisible.value = true;
}

async function fetchStatus() {
  try {
    const res =
      props.mode === 'project'
        ? await getProjectArchiveStatusApi(props.projectId as number)
        : await getThesisArchiveStatusApi();
    status.value = res.archiveStatus;
    archiveUrl.value = res.archiveUrl;
    if (res.archiveStatus === 'running' || res.archiveStatus === 'failed') {
      stopPolling();
    }
  } catch {
    // 轮询失败静默重试，不打断用户
  }
}

function startPolling() {
  stopPolling();
  pollTimer = setInterval(fetchStatus, 5000);
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

async function submit() {
  const url = gitUrl.value.trim();
  if (!/^https?:\/\//i.test(url)) {
    errorMsg.value = '请填写有效的 Git 仓库地址（需 http/https）';
    return;
  }
  errorMsg.value = '';
  submitting.value = true;
  try {
    const body = { gitUrl: url, envVars: envVars.value };
    const res =
      props.mode === 'project'
        ? await archiveProjectApi(props.projectId as number, body)
        : await archiveThesisApi(body);
    status.value = res.archiveStatus;
    archiveUrl.value = res.archiveUrl;
    dialogVisible.value = false;
    ElMessage.success('已提交，正在构建部署…');
    startPolling();
  } catch (e: any) {
    errorMsg.value = e.message || '提交失败';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  // 若初始即处于构建中，自动恢复轮询
  if (status.value === 'building' || status.value === 'pending') {
    startPolling();
  }
});

onUnmounted(stopPolling);
</script>

<style scoped>
.archive-deploy-panel {
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}
.hint {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.5;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.status-row.building { color: #d97706; }
.status-row.running { flex-direction: column; align-items: flex-start; gap: 4px; }
.status-row.running .status-label { display: flex; align-items: center; gap: 6px; color: #16a34a; }
.status-row.failed { color: #ef4444; }
.url-link {
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  word-break: break-all;
}
.url-link:hover { text-decoration: underline; }
.tip {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 6px;
  line-height: 1.5;
}
.error-msg {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
cd frontend && git add src/components/ArchiveDeployPanel.vue
git commit -m "feat(component): ArchiveDeployPanel 归档部署面板（弹窗+轮询+状态）"
```

---

## Task 10: 在 ProjectDetail.vue 挂载面板

**Files:**
- Modify: `frontend/src/views/ProjectDetail.vue`（import 区、模板 `DeployUrlPanel` 之后、加载逻辑 line ~922、新增 ref）

- [ ] **Step 1: 引入组件**

在 `frontend/src/views/ProjectDetail.vue` 的 `<script setup>` 组件 import 区（其他组件 import 旁，如 `RepoUrlPanel` / `DeployUrlPanel` 的 import 附近）加入：

```typescript
import ArchiveDeployPanel from '@/components/ArchiveDeployPanel.vue';
```

- [ ] **Step 2: 新增 ref 保存归档初值**

在 `const deployUrl = ref<string | null>(null);`（约 `ProjectDetail.vue:1166`）之后插入：

```typescript
const archiveStatus = ref<string | null>(null);
const archiveUrl = ref<string | null>(null);
```

- [ ] **Step 3: 加载时填充归档初值**

在加载详情处（约 `ProjectDetail.vue:922`，`deployUrl.value = detail.project.deployUrl ?? null;` 之后）插入：

```typescript
        archiveStatus.value = detail.project.archiveStatus ?? null;
        archiveUrl.value = detail.project.archiveUrl ?? null;
```

- [ ] **Step 4: 模板中挂载面板**

在模板 `DeployUrlPanel`（约 `ProjectDetail.vue:716-719`）的 `</...>` 闭合之后、`<!-- Quick Actions -->` 之前插入：

```vue
        <ArchiveDeployPanel
          mode="project"
          :project-id="projectId"
          :repo-url="repoUrl"
          :initial-status="archiveStatus"
          :initial-url="archiveUrl"
          :disabled="isViewer"
        />
```

> 说明：本文件已有 `projectId`（computed，`ProjectDetail.vue:849`，模板自动解包）与 `isViewer`（computed，`ProjectDetail.vue:847`），直接复用，无需新增。

- [ ] **Step 5: 前端构建（含类型检查）通过**

Run:
```bash
cd frontend && npm run build
```
Expected: `vue-tsc -b` 无类型错误，`vite build` 成功产出 dist。

- [ ] **Step 6: Commit**

```bash
cd frontend && git add src/views/ProjectDetail.vue
git commit -m "feat(project-detail): 挂载归档部署面板"
```

---

## Task 11: 在 GraduationDashboard.vue 挂载面板

**Files:**
- Modify: `frontend/src/views/graduation/GraduationDashboard.vue`（import 区、仓库/部署地址区块附近模板、已有 `isViewer` / `thesisProject` ref）

- [ ] **Step 1: 引入组件**

在 `GraduationDashboard.vue` 的 `<script setup>` import 区加入：

```typescript
import ArchiveDeployPanel from '@/components/ArchiveDeployPanel.vue';
```

- [ ] **Step 2: 在仓库/部署地址区块附近挂载面板**

在模板中「仓库地址 / 部署地址」操作区（约 `GraduationDashboard.vue:95-98` 所在的容器）之后插入面板。`thesisProject` 为已存在的 ref（见 `GraduationDashboard.vue:618-619`），`isViewer` 已存在（见模板第 95-98 行用法）：

```vue
        <ArchiveDeployPanel
          v-if="thesisProject"
          mode="thesis"
          :repo-url="thesisProject.repoUrl ?? null"
          :initial-status="thesisProject.archiveStatus ?? null"
          :initial-url="thesisProject.archiveUrl ?? null"
          :disabled="isViewer"
        />
```

> 说明：thesis 模式不需要 `project-id`。放置位置选在毕设「我的项目 / 仓库地址」卡片内、紧邻仓库/部署地址展示处，与项目详情页布局保持一致。若该区域是 `el-card`，放在其默认插槽底部即可。

- [ ] **Step 3: 前端构建（含类型检查）通过**

Run:
```bash
cd frontend && npm run build
```
Expected: `vue-tsc -b` 无类型错误，`vite build` 成功。

- [ ] **Step 4: Commit**

```bash
cd frontend && git add src/views/graduation/GraduationDashboard.vue
git commit -m "feat(graduation): 毕设页挂载归档部署面板"
```

---

## Task 12: 本地整体验证

**Files:** 无（仅运行验证命令）

- [ ] **Step 1: 后端类型检查**

Run:
```bash
cd backend && npx tsc --noEmit
```
Expected: exit 0。

- [ ] **Step 2: 后端单测**

Run:
```bash
cd backend && npx tsx --test tests/coolify-service.test.ts
```
Expected: PASS，全部断言通过。

- [ ] **Step 3: 前端构建**

Run:
```bash
cd frontend && npm run build
```
Expected: `vue-tsc -b && vite build` 成功，无类型错误。

- [ ] **Step 4: 确认未触碰生产**

Run:
```bash
cd /Users/liuxiangmiao/项目/vibesys && git log --oneline -12 && git status -s
```
Expected: 仅有本计划的若干 commit；无任何 push、无 `wrangler` 部署、无生产 D1 变更（这些都在 Task 13）。

---

## Task 13: 生产上线（⚠️ 人工执行，需用户授权 — Coolify 就绪后）

> 此任务依赖校内 Coolify 服务器，且涉及生产数据库与部署，**executing 会话执行到此应停下、交回用户授权后再逐条进行**。务必遵守 CLAUDE.md：**先改 D1，再 push 部署 Worker**。

- [ ] **Step 1: 安装并初始化 Coolify（校内服务器，一次性）**

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
# 浏览器访问 http://校内服务器IP:8000 完成初始化
# 新建 Project 命名 "vibesys-archive"；在 Settings 生成 API Token
```
记录：`COOLIFY_BASE_URL`、`COOLIFY_API_TOKEN`、`COOLIFY_SERVER_UUID`、`COOLIFY_PROJECT_UUID`。

- [ ] **Step 2: 用真实实例校验 coolify.service.ts 的端点与字段**

对照 Coolify v4 API 文档逐一确认 `coolify.service.ts` 中 `COOLIFY_PATHS`、创建应用的请求体字段、`app.status` 取值、`app.fqdn` 字段名是否一致；不一致则就地修正后重新 `npx tsc --noEmit` 并 commit。

- [ ] **Step 3: 生产 D1 增量加列（push 之前！）**

```bash
cd backend
npx wrangler d1 execute vibesysdb --remote --command="ALTER TABLE \"Project\" ADD COLUMN \"archiveUrl\" TEXT;"
npx wrangler d1 execute vibesysdb --remote --command="ALTER TABLE \"Project\" ADD COLUMN \"archiveStatus\" TEXT;"
npx wrangler d1 execute vibesysdb --remote --command="ALTER TABLE \"Project\" ADD COLUMN \"coolifyAppId\" TEXT;"
npx wrangler d1 execute vibesysdb --remote --command="ALTER TABLE \"ThesisProject\" ADD COLUMN \"archiveUrl\" TEXT;"
npx wrangler d1 execute vibesysdb --remote --command="ALTER TABLE \"ThesisProject\" ADD COLUMN \"archiveStatus\" TEXT;"
npx wrangler d1 execute vibesysdb --remote --command="ALTER TABLE \"ThesisProject\" ADD COLUMN \"coolifyAppId\" TEXT;"
```

- [ ] **Step 4: 配置生产环境变量**

非敏感项写入 `backend/wrangler.toml` 的 `[vars]`：

```toml
[vars]
FRONTEND_URL = "https://vibesys.7878.cloud,https://vibesys.pages.dev"
NODE_ENV = "production"
COOLIFY_BASE_URL = "http://校内服务器IP:8000"
COOLIFY_SERVER_UUID = "xxx"
COOLIFY_PROJECT_UUID = "xxx"
```

敏感 Token 用 secret（不进 git）：

```bash
cd backend && npx wrangler secret put COOLIFY_API_TOKEN
# 按提示粘贴 Token
```

- [ ] **Step 5: push 部署后端 + 部署前端**

```bash
cd /Users/liuxiangmiao/项目/vibesys && git push   # 触发 .github/workflows/deploy.yml 部署 Worker
# 前端按既有方式部署（Cloudflare Pages）
```

- [ ] **Step 6: 生产冒烟测试**

用真实账号在项目详情页与毕设页各提交一次归档：确认弹窗 → 提交返回 building → 轮询若干次后变 running 并展示可点击地址；点开地址确认作品可访问。失败则查 Coolify Web UI 日志。

---

## 范围约束（来自设计文档，确认不实现）

- 不实现：学生原服务器到期提醒（学生主动提交触发）。
- 不实现：从 Coolify 回读环境变量展示给学生（安全考虑，环境变量不落库）。
- 不实现：版本历史 / 回滚（存档固定为提交时的最新版本，前端轮询只查状态不重复拉代码）。
- 管理员视图复用 Coolify 自带 Web UI（查看状态、日志、重启、资源限额），vibesys 不另建管理界面。
