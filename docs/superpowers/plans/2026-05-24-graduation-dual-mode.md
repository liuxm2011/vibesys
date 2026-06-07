# 毕业设计双模式 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 VibeCoding 平台新增"毕业设计"模块，学生登录后通过功能选择拦截页在"项目设计"与"毕业设计"之间选择；毕业设计选题具有排他性（一人一题）；管理员界面重构为项目设计管理和毕业设计管理两大区域。

**Architecture:** 前端新增 `ModeSelect.vue` 拦截页和 `GraduationDashboard/GraduationTopicPool` 页面，路由守卫根据 sessionStorage 中的模式决定是否拦截；后端新增 `ThesisTopic`、`ThesisProject` 两张 D1 表，选题接口通过事务确保排他性锁定。

**Tech Stack:** Vue 3 + Pinia + Vue Router + Hono + Cloudflare D1 (SQLite via Prisma) + Element Plus

---

## File Map

| 操作 | 文件 |
|---|---|
| 新建 | `frontend/src/views/ModeSelect.vue` |
| 新建 | `frontend/src/views/graduation/GraduationDashboard.vue` |
| 新建 | `frontend/src/views/graduation/GraduationTopicPool.vue` |
| 新建 | `frontend/src/views/admin/GraduationManagement.vue` |
| 新建 | `frontend/src/stores/appMode.store.ts` |
| 新建 | `frontend/src/api/thesis.api.ts` |
| 新建 | `frontend/src/types/thesis.ts` |
| 新建 | `backend/src/routes/thesis.routes.ts` |
| 新建 | `backend/src/scripts/import-thesis-topics.ts` |
| 修改 | `backend/prisma/schema.prisma` |
| 修改 | `backend/src/worker.ts` |
| 修改 | `frontend/src/router/index.ts` |
| 修改 | `frontend/src/router/guards.ts` |
| 修改 | `frontend/src/views/admin/AdminLayout.vue` |
| 修改 | `backend/src/routes/admin.routes.ts` |

---

## Task 1: Prisma Schema — 新增 ThesisTopic 和 ThesisProject

**Files:**
- Modify: `backend/prisma/schema.prisma`

- [ ] **Step 1: 添加 ThesisTopic 和 ThesisProject 模型到 schema.prisma**

在 `schema.prisma` 末尾追加，并在 `User` 模型中新增两个关系字段：

在 `User` 模型的 `customTopics` 行后面添加：
```prisma
  thesisProject      ThesisProject?   @relation("UserThesisProject")
  lockedThesisTopics ThesisTopic[]    @relation("ThesisTopicLock")
```

在文件末尾追加两个新模型：
```prisma
// 毕业设计选题池（从JSON导入，大数据专业专用）
model ThesisTopic {
  id           Int            @id @default(autoincrement())
  title        String         // 毕业设计名（如"基于机器学习的鸢尾花分类模型设计与实现"）
  category     String         // 分类（如"机器学习-表格数据"、"自然语言处理"、"计算机视觉"）
  datasetName  String         // 数据集名（如"鸢尾花分类"）
  datasetUrl   String         // 数据集存储地址（COS路径）
  datasetSize  String         // 数据集大小（如"24KB"）
  isLocked     Boolean        @default(false)   // true=已被学生选走
  lockedAt     DateTime?                        // 锁定时间
  lockedByUserId Int?                           // 锁定者ID（反查是哪个学生）
  createdAt    DateTime       @default(now())

  lockedBy     User?          @relation("ThesisTopicLock", fields: [lockedByUserId], references: [id], onDelete: SetNull)
  project      ThesisProject?

  @@index([isLocked])
  @@index([lockedByUserId])
  @@index([category])
}

// 毕业设计项目（一人一题，排他性）
model ThesisProject {
  id        Int          @id @default(autoincrement())
  userId    Int          @unique   // 每个学生只能有一个毕业设计
  topicId   Int          @unique   // 每个题目只能被一个学生选
  repoUrl   String?               // 代码仓库地址
  deployUrl String?               // 项目展示/部署地址
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  user      User         @relation("UserThesisProject", fields: [userId], references: [id])
  topic     ThesisTopic  @relation(fields: [topicId], references: [id])

  @@index([userId])
}
```

- [ ] **Step 2: 本地生成迁移 SQL**

```bash
cd backend && DATABASE_URL="file:./dev.db" npx prisma migrate dev --name add-thesis-tables
```

Expected: 成功生成 migration SQL 文件，不报错。

- [ ] **Step 3: 在生产 D1 执行建表 SQL（先建表后部署代码！）**

```bash
cd backend && npx wrangler d1 execute vibesysdb --remote --command="CREATE TABLE IF NOT EXISTS \"ThesisTopic\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"title\" TEXT NOT NULL, \"category\" TEXT NOT NULL, \"datasetName\" TEXT NOT NULL, \"datasetUrl\" TEXT NOT NULL, \"datasetSize\" TEXT NOT NULL, \"isLocked\" INTEGER NOT NULL DEFAULT 0, \"lockedAt\" DATETIME, \"lockedByUserId\" INTEGER, \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (\"lockedByUserId\") REFERENCES \"User\"(\"id\") ON DELETE SET NULL ON UPDATE CASCADE);"

npx wrangler d1 execute vibesysdb --remote --command="CREATE TABLE IF NOT EXISTS \"ThesisProject\" (\"id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"userId\" INTEGER NOT NULL UNIQUE, \"topicId\" INTEGER NOT NULL UNIQUE, \"repoUrl\" TEXT, \"deployUrl\" TEXT, \"createdAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, \"updatedAt\" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (\"userId\") REFERENCES \"User\"(\"id\") ON UPDATE CASCADE, FOREIGN KEY (\"topicId\") REFERENCES \"ThesisTopic\"(\"id\") ON UPDATE CASCADE);"

npx wrangler d1 execute vibesysdb --remote --command="CREATE INDEX IF NOT EXISTS \"ThesisTopic_isLocked_idx\" ON \"ThesisTopic\"(\"isLocked\"); CREATE INDEX IF NOT EXISTS \"ThesisTopic_lockedByUserId_idx\" ON \"ThesisTopic\"(\"lockedByUserId\"); CREATE INDEX IF NOT EXISTS \"ThesisTopic_category_idx\" ON \"ThesisTopic\"(\"category\"); CREATE INDEX IF NOT EXISTS \"ThesisProject_userId_idx\" ON \"ThesisProject\"(\"userId\");"
```

Expected: 每个命令返回 `{ success: true }`，无报错。

- [ ] **Step 4: 重新生成 Prisma Client**

```bash
cd backend && npx prisma generate
```

Expected: 生成成功，控制台显示 `Generated Prisma Client`。

- [ ] **Step 5: Commit schema 变更**

```bash
git add backend/prisma/schema.prisma backend/prisma/migrations/ backend/src/generated/
git commit -m "feat: add ThesisTopic and ThesisProject models for graduation thesis module"
```

---

## Task 2: 导入毕业设计选题数据到 D1

**Files:**
- Create: `backend/src/scripts/import-thesis-topics.ts`

- [ ] **Step 1: 创建导入脚本**

```typescript
// backend/src/scripts/import-thesis-topics.ts
// 把 JSON 毕业设计题目转换为 SQL INSERT 语句，输出到 stdout
import topics from '../../../../毕业设计数据集信息.json' assert { type: 'json' };

const inserts = (topics as any[]).map((t: any) => {
  const escape = (s: string) => s.replace(/'/g, "''");
  return `INSERT OR IGNORE INTO "ThesisTopic" ("title","category","datasetName","datasetUrl","datasetSize","isLocked","createdAt") VALUES ('${escape(t['毕业设计名'])}','${escape(t['分类'])}','${escape(t['数据集名'])}','${escape(t['数据集存储地址'])}','${escape(t['数据集大小'])}',0,CURRENT_TIMESTAMP);`;
});

console.log(inserts.join('\n'));
```

- [ ] **Step 2: 生成 SQL 文件并导入 D1**

```bash
cd backend && npx tsx src/scripts/import-thesis-topics.ts > /tmp/thesis-topics.sql
wc -l /tmp/thesis-topics.sql
```

Expected: 输出行数等于 JSON 中的条目数（应为 100+ 行）。

```bash
cd backend && npx wrangler d1 execute vibesysdb --remote --file=/tmp/thesis-topics.sql
```

Expected: `{ success: true }`，无报错。

- [ ] **Step 3: 验证导入结果**

```bash
cd backend && npx wrangler d1 execute vibesysdb --remote --command="SELECT COUNT(*) as total, SUM(CASE WHEN isLocked=1 THEN 1 ELSE 0 END) as locked FROM \"ThesisTopic\";"
```

Expected: `total` = JSON 文件中的条目数，`locked` = 0。

- [ ] **Step 4: Commit**

```bash
git add backend/src/scripts/import-thesis-topics.ts
git commit -m "feat: add thesis topics import script from JSON dataset"
```

---

## Task 3: 后端 Thesis Routes

**Files:**
- Create: `backend/src/routes/thesis.routes.ts`
- Modify: `backend/src/worker.ts`

- [ ] **Step 1: 创建 thesis.routes.ts**

```typescript
// backend/src/routes/thesis.routes.ts
import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

// GET /api/thesis/topics — 获取全部题目（含锁定状态）
router.get('/topics', authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');

  const topics = await prisma.thesisTopic.findMany({
    orderBy: [{ category: 'asc' }, { id: 'asc' }],
    select: {
      id: true,
      title: true,
      category: true,
      datasetName: true,
      datasetUrl: true,
      datasetSize: true,
      isLocked: true,
      lockedAt: true,
      lockedByUserId: true,
    }
  });

  // 对当前用户隐藏其他人的 lockedByUserId（只标注自己）
  const result = topics.map(t => ({
    ...t,
    isLockedByMe: t.lockedByUserId === user.userId,
    lockedByUserId: t.lockedByUserId === user.userId ? t.lockedByUserId : undefined,
  }));

  return c.json({ topics: result });
});

// GET /api/thesis/project — 获取当前学生的毕业设计项目
router.get('/project', authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');

  const project = await prisma.thesisProject.findUnique({
    where: { userId: user.userId },
    include: { topic: true }
  });

  return c.json({ project });
});

// POST /api/thesis/select — 学生选题（排他锁定）
router.post('/select', authMiddleware, async (c) => {
  const { topicId } = await c.req.json();
  if (!topicId || typeof topicId !== 'number') {
    return c.json({ error: '请提供有效的题目ID' }, 400);
  }

  const prisma = c.get('prisma');
  const user = c.get('user');

  // 检查是否已有毕业设计项目
  const existing = await prisma.thesisProject.findUnique({
    where: { userId: user.userId }
  });
  if (existing) {
    return c.json({ error: '您已选择了毕业设计题目，请先放弃当前选题再重新选择' }, 409);
  }

  // 乐观锁：用事务保证原子性
  try {
    const result = await prisma.$transaction(async (tx) => {
      const topic = await tx.thesisTopic.findUnique({ where: { id: topicId } });
      if (!topic) return { error: '题目不存在', status: 404 };
      if (topic.isLocked) return { error: '该题目已被其他同学选择，请选择其他题目', status: 409 };

      await tx.thesisTopic.update({
        where: { id: topicId },
        data: { isLocked: true, lockedAt: new Date(), lockedByUserId: user.userId }
      });

      const project = await tx.thesisProject.create({
        data: { userId: user.userId, topicId },
        include: { topic: true }
      });

      return { project };
    });

    if ('error' in result) {
      return c.json({ error: result.error }, result.status as any);
    }
    return c.json({ project: result.project }, 201);
  } catch (err: any) {
    // P2002 = unique constraint failed (并发选同一题)
    if (err?.code === 'P2002') {
      return c.json({ error: '该题目刚刚被其他同学选择，请选择其他题目' }, 409);
    }
    console.error('Thesis select error:', err);
    return c.json({ error: '选题失败，请重试' }, 500);
  }
});

// DELETE /api/thesis/release — 放弃选题
router.delete('/release', authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const user = c.get('user');

  const project = await prisma.thesisProject.findUnique({
    where: { userId: user.userId }
  });
  if (!project) {
    return c.json({ error: '您尚未选择毕业设计题目' }, 404);
  }

  await prisma.$transaction([
    prisma.thesisProject.delete({ where: { userId: user.userId } }),
    prisma.thesisTopic.update({
      where: { id: project.topicId },
      data: { isLocked: false, lockedAt: null, lockedByUserId: null }
    })
  ]);

  return c.json({ message: '已放弃选题，该题目已重新开放给其他同学' });
});

// PUT /api/thesis/project — 更新仓库/部署地址
router.put('/project', authMiddleware, async (c) => {
  const { repoUrl, deployUrl } = await c.req.json();
  const prisma = c.get('prisma');
  const user = c.get('user');

  const project = await prisma.thesisProject.findUnique({ where: { userId: user.userId } });
  if (!project) {
    return c.json({ error: '请先选择毕业设计题目' }, 404);
  }

  const updated = await prisma.thesisProject.update({
    where: { userId: user.userId },
    data: {
      ...(repoUrl !== undefined && { repoUrl }),
      ...(deployUrl !== undefined && { deployUrl }),
      updatedAt: new Date()
    },
    include: { topic: true }
  });

  return c.json({ project: updated });
});

export default router;
```

- [ ] **Step 2: 在 worker.ts 注册新路由**

打开 `backend/src/worker.ts`，找到注册其他路由的地方（如 `app.route('/api/graduation', graduationRouter)`），在其后添加：

```typescript
import thesisRouter from './routes/thesis.routes.js';
// ...
app.route('/api/thesis', thesisRouter);
```

- [ ] **Step 3: Commit**

```bash
git add backend/src/routes/thesis.routes.ts backend/src/worker.ts
git commit -m "feat: add thesis routes for topic selection, release, and project management"
```

---

## Task 4: 管理员 Thesis API

**Files:**
- Modify: `backend/src/routes/admin.routes.ts`

- [ ] **Step 1: 在 admin.routes.ts 末尾添加毕业设计管理接口**

在 `export default router;` 之前插入：

```typescript
// ============================================================
// GRADUATION THESIS MANAGEMENT
// ============================================================

// GET /api/admin/thesis/topics — 获取所有毕业设计题目（含锁定状态和锁定人信息）
router.get('/thesis/topics', async (c) => {
  try {
    const prisma = c.get('prisma');
    const topics = await prisma.thesisTopic.findMany({
      orderBy: [{ category: 'asc' }, { id: 'asc' }],
      include: {
        lockedBy: {
          select: { id: true, name: true, studentId: true, class: true, grade: true }
        },
        project: {
          select: { id: true, repoUrl: true, deployUrl: true, createdAt: true }
        }
      }
    });
    return c.json({ topics, total: topics.length });
  } catch (error) {
    console.error('Admin thesis topics error:', error);
    return c.json({ error: '获取毕业设计题目失败' }, 500);
  }
});

// GET /api/admin/thesis/projects — 获取所有学生毕业设计项目情况
router.get('/thesis/projects', async (c) => {
  try {
    const prisma = c.get('prisma');
    const q = c.req.query();
    const page = parseInt(q.page || '') || 1;
    const pageSize = parseInt(q.pageSize || '') || 20;
    const search = q.search || '';
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { user: { name: { contains: search } } },
        { user: { studentId: { contains: search } } },
        { topic: { title: { contains: search } } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.thesisProject.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, studentId: true, class: true, grade: true } },
          topic: { select: { id: true, title: true, category: true, datasetName: true } }
        }
      }),
      prisma.thesisProject.count({ where: whereClause })
    ]);

    return c.json({ projects, total, page, pageSize });
  } catch (error) {
    console.error('Admin thesis projects error:', error);
    return c.json({ error: '获取毕业设计项目失败' }, 500);
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add backend/src/routes/admin.routes.ts
git commit -m "feat: add admin endpoints for thesis topic and project management"
```

---

## Task 5: Frontend Types & API

**Files:**
- Create: `frontend/src/types/thesis.ts`
- Create: `frontend/src/api/thesis.api.ts`

- [ ] **Step 1: 创建 thesis.ts 类型定义**

```typescript
// frontend/src/types/thesis.ts
export interface ThesisTopic {
  id: number
  title: string
  category: string
  datasetName: string
  datasetUrl: string
  datasetSize: string
  isLocked: boolean
  isLockedByMe: boolean
  lockedAt?: string
  lockedByUserId?: number
}

export interface ThesisProject {
  id: number
  userId: number
  topicId: number
  repoUrl?: string
  deployUrl?: string
  createdAt: string
  updatedAt: string
  topic: ThesisTopic
}
```

- [ ] **Step 2: 创建 thesis.api.ts**

```typescript
// frontend/src/api/thesis.api.ts
import { request } from '@/utils/request';
import type { ThesisTopic, ThesisProject } from '@/types/thesis';

export async function getThesisTopics(): Promise<ThesisTopic[]> {
  const data = await request<{ topics: ThesisTopic[] }>('/api/thesis/topics');
  return data.topics;
}

export async function getMyThesisProject(): Promise<ThesisProject | null> {
  const data = await request<{ project: ThesisProject | null }>('/api/thesis/project');
  return data.project;
}

export async function selectThesisTopic(topicId: number): Promise<ThesisProject> {
  const data = await request<{ project: ThesisProject }>('/api/thesis/select', {
    method: 'POST',
    body: JSON.stringify({ topicId }),
  });
  return data.project;
}

export async function releaseThesisTopic(): Promise<void> {
  await request('/api/thesis/release', { method: 'DELETE' });
}

export async function updateThesisProject(data: { repoUrl?: string; deployUrl?: string }): Promise<ThesisProject> {
  const result = await request<{ project: ThesisProject }>('/api/thesis/project', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return result.project;
}
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/types/thesis.ts frontend/src/api/thesis.api.ts
git commit -m "feat: add thesis TypeScript types and API client functions"
```

---

## Task 6: AppMode Pinia Store

**Files:**
- Create: `frontend/src/stores/appMode.store.ts`

- [ ] **Step 1: 创建 appMode.store.ts**

```typescript
// frontend/src/stores/appMode.store.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type AppMode = 'project' | 'graduation';

export const useAppModeStore = defineStore('appMode', () => {
  const mode = ref<AppMode | null>(
    sessionStorage.getItem('appMode') as AppMode | null
  );

  function setMode(m: AppMode) {
    mode.value = m;
    sessionStorage.setItem('appMode', m);
  }

  function clearMode() {
    mode.value = null;
    sessionStorage.removeItem('appMode');
  }

  return { mode, setMode, clearMode };
});
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/stores/appMode.store.ts
git commit -m "feat: add appMode store for project/graduation mode selection"
```

---

## Task 7: 路由更新 + 守卫

**Files:**
- Modify: `frontend/src/router/index.ts`
- Modify: `frontend/src/router/guards.ts`

- [ ] **Step 1: 在 router/index.ts 添加新路由**

在 `/dashboard` 路由之后，`/admin` 路由之前插入：

```typescript
{
  path: '/mode-select',
  name: 'ModeSelect',
  component: () => import('@/views/ModeSelect.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/graduation',
  name: 'GraduationDashboard',
  component: () => import('@/views/graduation/GraduationDashboard.vue'),
  meta: { requiresAuth: true }
},
{
  path: '/graduation/topics',
  name: 'GraduationTopicPool',
  component: () => import('@/views/graduation/GraduationTopicPool.vue'),
  meta: { requiresAuth: true }
},
```

在 `/admin` 的 children 数组末尾添加：
```typescript
{ path: 'graduation', name: 'AdminGraduation', component: () => import('@/views/admin/GraduationManagement.vue') }
```

同时在 RouteMeta 类型声明中添加（可选）：
```typescript
interface RouteMeta {
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
  skipModeCheck?: boolean;  // ModeSelect 页面本身不需要检查 mode
}
```

并在 `/mode-select` 路由的 meta 中添加 `skipModeCheck: true`。

- [ ] **Step 2: 更新 guards.ts 添加模式拦截逻辑**

在 `guards.ts` 的 import 区添加：
```typescript
import { useAppModeStore } from '@/stores/appMode.store';
```

在 `// All checks passed, proceed` 注释之前，即 admin redirect 检查之后插入：

```typescript
// 非管理员学生：检查是否已选择功能模式
if (!authStore.isAdmin && !to.meta.skipModeCheck) {
  const appModeStore = useAppModeStore();
  if (!appModeStore.mode) {
    return { name: 'ModeSelect' };
  }
}
```

同时，将 `/mode-select` 路由的 meta 更新为 `{ requiresAuth: true, skipModeCheck: true }`（已在 Step 1 做了，这里确认）。

- [ ] **Step 3: Commit**

```bash
git add frontend/src/router/index.ts frontend/src/router/guards.ts
git commit -m "feat: add graduation routes and mode-select guard interception"
```

---

## Task 8: ModeSelect.vue — 功能选择拦截页

**Files:**
- Create: `frontend/src/views/ModeSelect.vue`

- [ ] **Step 1: 创建 ModeSelect.vue**

```vue
<!-- frontend/src/views/ModeSelect.vue -->
<template>
  <div class="mode-select-container">
    <div class="mode-header">
      <div class="logo-box">
        <div class="logo-mini">VB</div>
        <div class="logo-text">
          <h1 class="platform-name">VibeCoding</h1>
          <span class="platform-tag">教学实践平台</span>
        </div>
      </div>
      <p class="mode-subtitle">请选择您本次使用的功能模块</p>
    </div>

    <div class="mode-cards">
      <div class="mode-card" @click="selectMode('project')">
        <div class="card-icon">
          <el-icon :size="48"><Monitor /></el-icon>
        </div>
        <h2 class="card-title">项目设计</h2>
        <p class="card-desc">
          软件工程 / 大数据专业<br>
          完成选题 → AI生成文档 → 编码实践的全流程软件项目
        </p>
        <el-button type="primary" size="large" class="card-btn">进入项目设计</el-button>
      </div>

      <div class="mode-card mode-card--graduation" @click="selectMode('graduation')">
        <div class="card-icon">
          <el-icon :size="48"><Document /></el-icon>
        </div>
        <h2 class="card-title">毕业设计</h2>
        <p class="card-desc">
          大数据专业专属<br>
          从数据集题库中选择毕业设计课题，完成数据分析与模型实践
        </p>
        <el-button type="success" size="large" class="card-btn">进入毕业设计</el-button>
      </div>
    </div>

    <div class="mode-footer">
      <el-button text @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Monitor, Document, SwitchButton } from '@element-plus/icons-vue';
import { useAppModeStore } from '@/stores/appMode.store';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const appModeStore = useAppModeStore();
const authStore = useAuthStore();

function selectMode(mode: 'project' | 'graduation') {
  appModeStore.setMode(mode);
  if (mode === 'project') {
    router.push('/dashboard');
  } else {
    router.push('/graduation');
  }
}

async function handleLogout() {
  await authStore.logout();
  appModeStore.clearMode();
  router.push('/login');
}
</script>

<style scoped>
.mode-select-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 48px;
}

.mode-header {
  text-align: center;
}

.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo-mini {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  font-weight: 800;
  font-size: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text { text-align: left; }

.platform-name {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.platform-tag {
  font-size: 13px;
  color: #64748b;
}

.mode-subtitle {
  font-size: 18px;
  color: #475569;
  margin: 0;
}

.mode-cards {
  display: flex;
  gap: 32px;
  align-items: stretch;
}

.mode-card {
  background: white;
  border-radius: 20px;
  padding: 48px 40px;
  width: 300px;
  text-align: center;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.mode-card:hover {
  border-color: #4f46e5;
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(79,70,229,0.15);
}

.mode-card--graduation:hover {
  border-color: #10b981;
  box-shadow: 0 12px 40px rgba(16,185,129,0.15);
}

.card-icon { color: #4f46e5; }
.mode-card--graduation .card-icon { color: #10b981; }

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
}

.card-btn { width: 100%; margin-top: 8px; }

.mode-footer { color: #94a3b8; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/ModeSelect.vue
git commit -m "feat: add ModeSelect interception page for project/graduation mode choice"
```

---

## Task 9: GraduationTopicPool.vue — 毕业设计选题池

**Files:**
- Create: `frontend/src/views/graduation/GraduationTopicPool.vue`

- [ ] **Step 1: 创建目录并创建组件**

```bash
mkdir -p frontend/src/views/graduation
```

```vue
<!-- frontend/src/views/graduation/GraduationTopicPool.vue -->
<template>
  <div class="topic-pool">
    <div class="pool-header">
      <div class="header-left">
        <el-button text @click="router.push('/graduation')">
          <el-icon><ArrowLeft /></el-icon>返回看板
        </el-button>
        <h2 class="pool-title">毕业设计选题池</h2>
      </div>
      <div class="header-stats">
        <el-tag type="info">共 {{ topics.length }} 个题目</el-tag>
        <el-tag type="danger">已选 {{ lockedCount }} 个</el-tag>
        <el-tag type="success">剩余 {{ topics.length - lockedCount }} 个</el-tag>
      </div>
    </div>

    <div class="filter-bar">
      <el-select v-model="selectedCategory" placeholder="按分类筛选" clearable style="width: 240px">
        <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
      </el-select>
      <el-input v-model="searchKeyword" placeholder="搜索题目或数据集名..." style="width: 300px" clearable>
        <template #prefix><el-icon><Search /></el-icon></template>
      </el-input>
    </div>

    <div v-if="myProject" class="my-selection-banner">
      <el-alert type="success" :closable="false">
        <template #default>
          <div class="banner-content">
            <span>您已选择：<strong>{{ myProject.topic.title }}</strong></span>
            <el-popconfirm
              title="放弃选题后，该题目将重新开放给其他同学。确定放弃吗？"
              confirm-button-text="确定放弃"
              cancel-button-text="取消"
              @confirm="handleRelease"
            >
              <template #reference>
                <el-button type="warning" size="small" :loading="releasing">放弃选题</el-button>
              </template>
            </el-popconfirm>
          </div>
        </template>
      </el-alert>
    </div>

    <div v-loading="loading" class="topics-grid">
      <div
        v-for="topic in filteredTopics"
        :key="topic.id"
        class="topic-card"
        :class="{
          'topic-card--mine': topic.isLockedByMe,
          'topic-card--locked': topic.isLocked && !topic.isLockedByMe
        }"
      >
        <div class="topic-category-badge">{{ topic.category }}</div>
        <h3 class="topic-title">{{ topic.title }}</h3>
        <div class="topic-meta">
          <div class="meta-item">
            <span class="meta-label">数据集：</span>
            <span class="meta-value">{{ topic.datasetName }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">数据大小：</span>
            <span class="meta-value">{{ topic.datasetSize }}</span>
          </div>
        </div>
        <div class="topic-footer">
          <el-tag v-if="topic.isLockedByMe" type="success">已选择（我的）</el-tag>
          <el-tag v-else-if="topic.isLocked" type="danger">已被选择</el-tag>
          <el-tag v-else type="info">可选</el-tag>

          <el-button
            v-if="!topic.isLocked && !myProject"
            type="primary"
            size="small"
            :loading="selectingId === topic.id"
            @click="handleSelect(topic.id)"
          >
            选择此题
          </el-button>
          <el-button
            v-if="topic.datasetUrl"
            size="small"
            plain
            @click="window.open(topic.datasetUrl, '_blank')"
          >
            查看数据集
          </el-button>
        </div>
      </div>
    </div>

    <el-empty v-if="!loading && filteredTopics.length === 0" description="没有找到匹配的题目" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { ArrowLeft, Search } from '@element-plus/icons-vue';
import { getThesisTopics, selectThesisTopic, releaseThesisTopic, getMyThesisProject } from '@/api/thesis.api';
import type { ThesisTopic, ThesisProject } from '@/types/thesis';

const router = useRouter();
const topics = ref<ThesisTopic[]>([]);
const myProject = ref<ThesisProject | null>(null);
const loading = ref(false);
const selectingId = ref<number | null>(null);
const releasing = ref(false);
const selectedCategory = ref('');
const searchKeyword = ref('');

const categories = computed(() => [...new Set(topics.value.map(t => t.category))].sort());
const lockedCount = computed(() => topics.value.filter(t => t.isLocked).length);

const filteredTopics = computed(() => {
  return topics.value.filter(t => {
    if (selectedCategory.value && t.category !== selectedCategory.value) return false;
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase();
      return t.title.toLowerCase().includes(kw) || t.datasetName.toLowerCase().includes(kw);
    }
    return true;
  });
});

async function loadData() {
  loading.value = true;
  try {
    [topics.value, myProject.value] = await Promise.all([
      getThesisTopics(),
      getMyThesisProject(),
    ]);
  } finally {
    loading.value = false;
  }
}

async function handleSelect(topicId: number) {
  selectingId.value = topicId;
  try {
    myProject.value = await selectThesisTopic(topicId);
    await loadData();
    ElMessage.success('选题成功！');
    router.push('/graduation');
  } catch (err: any) {
    ElMessage.error(err?.message || '选题失败，请重试');
  } finally {
    selectingId.value = null;
  }
}

async function handleRelease() {
  releasing.value = true;
  try {
    await releaseThesisTopic();
    myProject.value = null;
    await loadData();
    ElMessage.success('已放弃选题，题目已重新开放');
  } catch (err: any) {
    ElMessage.error(err?.message || '操作失败');
  } finally {
    releasing.value = false;
  }
}

onMounted(loadData);
</script>

<style scoped>
.topic-pool { padding: 24px; max-width: 1400px; margin: 0 auto; }

.pool-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left { display: flex; align-items: center; gap: 12px; }
.pool-title { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0; }
.header-stats { display: flex; gap: 8px; }

.filter-bar { display: flex; gap: 12px; margin-bottom: 20px; }

.my-selection-banner { margin-bottom: 20px; }
.banner-content { display: flex; justify-content: space-between; align-items: center; }

.topics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.topic-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  transition: all 0.2s;
  position: relative;
}

.topic-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
.topic-card--mine { border-color: #10b981; background: #f0fdf4; }
.topic-card--locked { opacity: 0.65; }

.topic-category-badge {
  display: inline-block;
  font-size: 11px;
  color: #4f46e5;
  background: #eef2ff;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.topic-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 12px;
  line-height: 1.5;
}

.topic-meta { margin-bottom: 16px; }
.meta-item { display: flex; gap: 4px; font-size: 13px; color: #64748b; margin-bottom: 4px; }
.meta-label { color: #94a3b8; white-space: nowrap; }
.meta-value { color: #475569; }

.topic-footer { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/graduation/GraduationTopicPool.vue
git commit -m "feat: add GraduationTopicPool with exclusive topic selection and category filter"
```

---

## Task 10: GraduationDashboard.vue — 毕业设计看板

**Files:**
- Create: `frontend/src/views/graduation/GraduationDashboard.vue`

- [ ] **Step 1: 创建 GraduationDashboard.vue**

```vue
<!-- frontend/src/views/graduation/GraduationDashboard.vue -->
<template>
  <div class="graduation-dashboard">
    <!-- Header -->
    <el-header class="dashboard-header" height="72px">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-box">
            <div class="logo-mini">VB</div>
            <div class="logo-text">
              <h1 class="platform-name">VibeCoding</h1>
              <span class="platform-tag">毕业设计</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <el-button plain @click="switchMode">
            <el-icon><Refresh /></el-icon>切换模式
          </el-button>
          <el-button type="success" @click="router.push('/graduation/topics')" class="nav-item">
            <el-icon><Collection /></el-icon>选题管理
          </el-button>
          <el-divider direction="vertical" />
          <el-dropdown trigger="click">
            <div class="user-info-trigger">
              <el-avatar :size="36">{{ user?.name?.charAt(0) }}</el-avatar>
              <div class="user-meta">
                <span class="user-name">{{ user?.name }}</span>
                <span class="user-role">学生用户</span>
              </div>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="passwordDialogVisible = true">
                  <el-icon><Key /></el-icon>修改密码
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <main class="dashboard-main">
      <!-- 未选题状态 -->
      <div v-if="!loading && !thesisProject" class="empty-state">
        <el-empty
          description="您还未选择毕业设计题目"
          :image-size="120"
        >
          <el-button type="success" size="large" @click="router.push('/graduation/topics')">
            <el-icon><Plus /></el-icon>去选择题目
          </el-button>
        </el-empty>
      </div>

      <!-- 已选题状态 -->
      <div v-if="thesisProject" class="project-view">
        <div class="project-card">
          <div class="project-header">
            <div>
              <el-tag type="success" size="large">已选题</el-tag>
              <h2 class="project-title">{{ thesisProject.topic.title }}</h2>
            </div>
            <el-popconfirm
              title="放弃选题后，该题目将重新开放给其他同学。确定放弃吗？"
              confirm-button-text="确定放弃"
              cancel-button-text="取消"
              @confirm="handleRelease"
            >
              <template #reference>
                <el-button type="warning" plain :loading="releasing">放弃选题</el-button>
              </template>
            </el-popconfirm>
          </div>

          <el-descriptions :column="2" border class="project-descriptions">
            <el-descriptions-item label="数据集">{{ thesisProject.topic.datasetName }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ thesisProject.topic.category }}</el-descriptions-item>
            <el-descriptions-item label="数据集大小">{{ thesisProject.topic.datasetSize }}</el-descriptions-item>
            <el-descriptions-item label="选题时间">{{ formatDate(thesisProject.createdAt) }}</el-descriptions-item>
            <el-descriptions-item label="数据集地址" :span="2">
              <el-link :href="thesisProject.topic.datasetUrl" target="_blank" type="primary">
                {{ thesisProject.topic.datasetUrl }}
              </el-link>
            </el-descriptions-item>
          </el-descriptions>

          <el-divider>项目信息</el-divider>

          <div class="project-urls">
            <div class="url-field">
              <label class="url-label">代码仓库地址</label>
              <div class="url-input-row">
                <el-input
                  v-model="editRepoUrl"
                  placeholder="请填写 Gitee/GitHub 仓库地址"
                  :disabled="!editingRepo"
                />
                <el-button v-if="!editingRepo" @click="editingRepo = true">编辑</el-button>
                <el-button v-else type="primary" :loading="savingRepo" @click="saveRepoUrl">保存</el-button>
                <el-button v-if="editingRepo" @click="cancelEditRepo">取消</el-button>
              </div>
            </div>
            <div class="url-field">
              <label class="url-label">项目展示/部署地址</label>
              <div class="url-input-row">
                <el-input
                  v-model="editDeployUrl"
                  placeholder="请填写项目运行演示地址"
                  :disabled="!editingDeploy"
                />
                <el-button v-if="!editingDeploy" @click="editingDeploy = true">编辑</el-button>
                <el-button v-else type="primary" :loading="savingDeploy" @click="saveDeployUrl">保存</el-button>
                <el-button v-if="editingDeploy" @click="cancelEditDeploy">取消</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <SelfPasswordDialog v-model:visible="passwordDialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  Collection, ArrowDown, Key, SwitchButton, Plus, Refresh
} from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth.store';
import { useAppModeStore } from '@/stores/appMode.store';
import { getMyThesisProject, releaseThesisTopic, updateThesisProject } from '@/api/thesis.api';
import type { ThesisProject } from '@/types/thesis';
import SelfPasswordDialog from '@/components/SelfPasswordDialog.vue';

const router = useRouter();
const authStore = useAuthStore();
const appModeStore = useAppModeStore();
const user = authStore.user;

const thesisProject = ref<ThesisProject | null>(null);
const loading = ref(false);
const releasing = ref(false);
const passwordDialogVisible = ref(false);
const editRepoUrl = ref('');
const editDeployUrl = ref('');
const editingRepo = ref(false);
const editingDeploy = ref(false);
const savingRepo = ref(false);
const savingDeploy = ref(false);

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('zh-CN');
}

function switchMode() {
  appModeStore.clearMode();
  router.push('/mode-select');
}

async function handleLogout() {
  await authStore.logout();
  appModeStore.clearMode();
  router.push('/login');
}

async function handleRelease() {
  releasing.value = true;
  try {
    await releaseThesisTopic();
    thesisProject.value = null;
    editRepoUrl.value = '';
    editDeployUrl.value = '';
    ElMessage.success('已放弃选题');
  } catch (err: any) {
    ElMessage.error(err?.message || '操作失败');
  } finally {
    releasing.value = false;
  }
}

function cancelEditRepo() {
  editingRepo.value = false;
  editRepoUrl.value = thesisProject.value?.repoUrl || '';
}

function cancelEditDeploy() {
  editingDeploy.value = false;
  editDeployUrl.value = thesisProject.value?.deployUrl || '';
}

async function saveRepoUrl() {
  savingRepo.value = true;
  try {
    thesisProject.value = await updateThesisProject({ repoUrl: editRepoUrl.value });
    editingRepo.value = false;
    ElMessage.success('仓库地址已保存');
  } catch {
    ElMessage.error('保存失败');
  } finally {
    savingRepo.value = false;
  }
}

async function saveDeployUrl() {
  savingDeploy.value = true;
  try {
    thesisProject.value = await updateThesisProject({ deployUrl: editDeployUrl.value });
    editingDeploy.value = false;
    ElMessage.success('部署地址已保存');
  } catch {
    ElMessage.error('保存失败');
  } finally {
    savingDeploy.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    thesisProject.value = await getMyThesisProject();
    if (thesisProject.value) {
      editRepoUrl.value = thesisProject.value.repoUrl || '';
      editDeployUrl.value = thesisProject.value.deployUrl || '';
    }
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.graduation-dashboard { min-height: 100vh; background: #f8fafc; display: flex; flex-direction: column; }

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}

.header-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-left { display: flex; align-items: center; }
.header-right { display: flex; align-items: center; gap: 12px; }

.logo-box { display: flex; align-items: center; gap: 10px; }
.logo-mini {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white; font-weight: 800; font-size: 14px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.platform-name { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0; }
.platform-tag { font-size: 12px; color: #10b981; }

.user-info-trigger { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.user-meta { display: flex; flex-direction: column; }
.user-name { font-size: 14px; font-weight: 600; color: #1e293b; }
.user-role { font-size: 12px; color: #64748b; }

.dashboard-main { flex: 1; padding: 40px 24px; max-width: 900px; margin: 0 auto; width: 100%; }

.empty-state { display: flex; justify-content: center; align-items: center; min-height: 400px; }

.project-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #e2e8f0;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.project-title { font-size: 20px; font-weight: 700; color: #1e293b; margin: 8px 0 0; }

.project-descriptions { margin-bottom: 24px; }

.project-urls { display: flex; flex-direction: column; gap: 20px; }
.url-field { display: flex; flex-direction: column; gap: 8px; }
.url-label { font-size: 14px; font-weight: 600; color: #374151; }
.url-input-row { display: flex; gap: 8px; }
.url-input-row .el-input { flex: 1; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/graduation/GraduationDashboard.vue
git commit -m "feat: add GraduationDashboard with thesis project view and URL management"
```

---

## Task 11: 管理员界面重构 — AdminLayout.vue

**Files:**
- Modify: `frontend/src/views/admin/AdminLayout.vue`

- [ ] **Step 1: 重构侧边栏为两大分区**

将 `AdminLayout.vue` 的 `el-menu` 部分（`<el-menu>` 到 `</el-menu>`）替换为以下内容：

```html
<el-menu
  :default-active="activeMenu"
  class="sidebar-menu"
  :router="true"
  background-color="#ffffff"
  text-color="#64748b"
  active-text-color="#4f46e5"
>
  <!-- 通用 -->
  <el-menu-item index="/admin/users">
    <el-icon><User /></el-icon>
    <span>用户管理</span>
  </el-menu-item>

  <el-menu-item-group title="项目设计管理">
    <el-menu-item index="/admin/topics">
      <el-icon><Collection /></el-icon>
      <span>选题管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/repos">
      <el-icon><Link /></el-icon>
      <span>仓库管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/stats">
      <el-icon><TrendCharts /></el-icon>
      <span>统计分析</span>
    </el-menu-item>
  </el-menu-item-group>

  <el-menu-item-group title="毕业设计管理">
    <el-menu-item index="/admin/graduation">
      <el-icon><Document /></el-icon>
      <span>毕业设计管理</span>
    </el-menu-item>
  </el-menu-item-group>

  <el-divider />

  <el-menu-item index="/admin/config">
    <el-icon><Setting /></el-icon>
    <span>系统配置</span>
  </el-menu-item>
  <el-menu-item index="/admin/api-providers">
    <el-icon><Connection /></el-icon>
    <span>API 服务管理</span>
  </el-menu-item>
</el-menu>
```

在 script 的 import 中添加 `Document` 图标：
```typescript
import { Back, User, Collection, TrendCharts, Setting, Connection, Link, SwitchButton, Key, Document } from '@element-plus/icons-vue';
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/admin/AdminLayout.vue
git commit -m "refactor: split admin sidebar into project-design and graduation sections"
```

---

## Task 12: GraduationManagement.vue — 管理员毕业设计管理页

**Files:**
- Create: `frontend/src/views/admin/GraduationManagement.vue`

- [ ] **Step 1: 创建管理员毕业设计管理页**

需要先在 `frontend/src/api/admin.api.ts` 末尾添加两个新函数：

```typescript
export async function adminGetThesisTopics(): Promise<any[]> {
  const data = await request<{ topics: any[] }>('/api/admin/thesis/topics');
  return data.topics;
}

export async function adminGetThesisProjects(params: { page?: number; pageSize?: number; search?: string } = {}): Promise<{ projects: any[]; total: number }> {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.pageSize) q.set('pageSize', String(params.pageSize));
  if (params.search) q.set('search', params.search);
  return request<{ projects: any[]; total: number }>(`/api/admin/thesis/projects?${q}`);
}
```

然后创建组件：

```vue
<!-- frontend/src/views/admin/GraduationManagement.vue -->
<template>
  <div class="graduation-management">
    <el-tabs v-model="activeTab" type="border-card">
      <el-tab-pane label="选题概况" name="topics">
        <div class="tab-toolbar">
          <el-tag type="info">共 {{ thesisTopics.length }} 个题目</el-tag>
          <el-tag type="danger">已锁定 {{ lockedCount }} 个</el-tag>
          <el-tag type="success">剩余 {{ thesisTopics.length - lockedCount }} 个</el-tag>
          <el-select v-model="topicCategoryFilter" placeholder="按分类筛选" clearable style="width:200px;margin-left:auto">
            <el-option v-for="c in topicCategories" :key="c" :label="c" :value="c" />
          </el-select>
        </div>

        <el-table :data="filteredTopics" v-loading="topicsLoading" stripe>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="category" label="分类" width="150" />
          <el-table-column prop="datasetName" label="数据集" width="160" />
          <el-table-column prop="title" label="毕业设计题目" min-width="260" />
          <el-table-column prop="datasetSize" label="数据集大小" width="110" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.isLocked ? 'danger' : 'success'" size="small">
                {{ row.isLocked ? '已选' : '可选' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="选题学生" min-width="160">
            <template #default="{ row }">
              <span v-if="row.lockedBy">
                {{ row.lockedBy.name }}（{{ row.lockedBy.studentId }}）
                <br><small class="text-secondary">{{ row.lockedBy.class }}</small>
              </span>
              <span v-else class="text-secondary">—</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <el-tab-pane label="学生选题情况" name="projects">
        <div class="tab-toolbar">
          <el-input
            v-model="projectSearch"
            placeholder="搜索姓名/学号/题目"
            style="width:280px"
            clearable
            @input="loadProjects"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-tag type="info" style="margin-left:auto">共 {{ projectTotal }} 条记录</el-tag>
        </div>

        <el-table :data="thesisProjects" v-loading="projectsLoading" stripe>
          <el-table-column label="学生" width="150">
            <template #default="{ row }">
              {{ row.user.name }}<br>
              <small class="text-secondary">{{ row.user.studentId }}</small>
            </template>
          </el-table-column>
          <el-table-column label="班级/年级" width="130">
            <template #default="{ row }">
              {{ row.user.class }}<br>
              <small class="text-secondary">{{ row.user.grade }}</small>
            </template>
          </el-table-column>
          <el-table-column label="毕业设计题目" min-width="240">
            <template #default="{ row }">
              <div>{{ row.topic.title }}</div>
              <el-tag size="small" type="info" style="margin-top:4px">{{ row.topic.category }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="代码仓库" min-width="180">
            <template #default="{ row }">
              <el-link v-if="row.repoUrl" :href="row.repoUrl" target="_blank" type="primary">{{ row.repoUrl }}</el-link>
              <span v-else class="text-secondary">未填写</span>
            </template>
          </el-table-column>
          <el-table-column label="部署地址" min-width="180">
            <template #default="{ row }">
              <el-link v-if="row.deployUrl" :href="row.deployUrl" target="_blank" type="success">{{ row.deployUrl }}</el-link>
              <span v-else class="text-secondary">未填写</span>
            </template>
          </el-table-column>
          <el-table-column label="选题时间" width="120">
            <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
          </el-table-column>
        </el-table>

        <div class="pagination-bar">
          <el-pagination
            v-model:current-page="projectPage"
            :page-size="20"
            :total="projectTotal"
            layout="prev, pager, next"
            @current-change="loadProjects"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { adminGetThesisTopics, adminGetThesisProjects } from '@/api/admin.api';

const activeTab = ref('topics');

// Topics tab
const thesisTopics = ref<any[]>([]);
const topicsLoading = ref(false);
const topicCategoryFilter = ref('');
const topicCategories = computed(() => [...new Set(thesisTopics.value.map((t: any) => t.category))].sort());
const lockedCount = computed(() => thesisTopics.value.filter((t: any) => t.isLocked).length);
const filteredTopics = computed(() =>
  topicCategoryFilter.value
    ? thesisTopics.value.filter((t: any) => t.category === topicCategoryFilter.value)
    : thesisTopics.value
);

// Projects tab
const thesisProjects = ref<any[]>([]);
const projectsLoading = ref(false);
const projectTotal = ref(0);
const projectPage = ref(1);
const projectSearch = ref('');

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('zh-CN');
}

async function loadTopics() {
  topicsLoading.value = true;
  try {
    thesisTopics.value = await adminGetThesisTopics();
  } finally {
    topicsLoading.value = false;
  }
}

async function loadProjects() {
  projectsLoading.value = true;
  try {
    const result = await adminGetThesisProjects({
      page: projectPage.value,
      pageSize: 20,
      search: projectSearch.value
    });
    thesisProjects.value = result.projects;
    projectTotal.value = result.total;
  } finally {
    projectsLoading.value = false;
  }
}

onMounted(() => {
  loadTopics();
  loadProjects();
});
</script>

<style scoped>
.graduation-management { padding: 0; }
.tab-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.pagination-bar { display: flex; justify-content: center; margin-top: 20px; }
.text-secondary { color: #94a3b8; font-size: 12px; }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/views/admin/GraduationManagement.vue frontend/src/api/admin.api.ts
git commit -m "feat: add GraduationManagement admin page with topic overview and student selection table"
```

---

## Task 13: 端到端验证

- [ ] **Step 1: 构建前端检查 TypeScript 错误**

```bash
cd frontend && npx tsc --noEmit
```

Expected: 零 TypeScript 错误。

- [ ] **Step 2: 启动前端开发服务器，验证功能流程**

```bash
cd frontend && npm run dev
```

在浏览器中验证以下路径：
1. 登录 → 自动跳转到 `/mode-select`，显示两张卡片
2. 点击"项目设计" → 跳转到 `/dashboard`（原有功能正常）
3. 退出重新登录 → 再次被拦截到 `/mode-select`
4. 点击"毕业设计" → 跳转到 `/graduation`，显示"未选题"空状态
5. 点击"去选择题目" → 跳转到 `/graduation/topics`，显示题目列表
6. 选择一个题目 → 成功后跳回 `/graduation`，显示项目信息
7. 填写仓库地址 → 保存成功
8. 切换模式按钮 → 返回 `/mode-select`

- [ ] **Step 3: 验证管理员界面**

登录管理员账号，进入 `/admin`：
1. 侧边栏显示"项目设计管理"和"毕业设计管理"两个分区
2. 点击"毕业设计管理" → 进入 `/admin/graduation`
3. "选题概况" Tab 显示所有题目列表，有锁定状态
4. "学生选题情况" Tab 显示学生选题记录（如有）

- [ ] **Step 4: 部署 Worker 到生产**

确认 D1 已经有 ThesisTopic 和 ThesisProject 两张表（Task 1 已执行），以及题目数据已导入（Task 2 已执行）。然后：

```bash
git push origin main
```

等待 CI/CD 自动部署完成（约 2 分钟）。

- [ ] **Step 5: 生产验证**

访问生产 URL，重复 Step 2 的流程，确认功能正常。

---

## 自检清单

- [ ] `ThesisTopic` 和 `ThesisProject` 表已在生产 D1 中创建
- [ ] 毕业设计题目数据已从 JSON 导入到 D1
- [ ] 选题排他性通过 `$transaction` 保证（并发选同一题时 P2002 处理）
- [ ] `ModeSelect.vue` 两张卡片居中显示，点击生效
- [ ] 路由守卫正确：未选模式 → `/mode-select`，选了模式才放行
- [ ] 管理员不触发模式守卫（`isAdmin` 判断正确）
- [ ] 放弃选题后 `ThesisTopic.isLocked` 归零，题目重回可选池
- [ ] `adminGetThesisTopics` 和 `adminGetThesisProjects` 函数加入了 `admin.api.ts`
- [ ] AdminLayout 侧边栏"毕业设计管理"入口链接到 `/admin/graduation`
- [ ] Worker.ts 已注册 `/api/thesis` 路由
