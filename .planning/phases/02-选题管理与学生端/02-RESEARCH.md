# Phase 2: 选题管理与学生端 - Research

**Researched:** 2026-04-18
**Domain:** Vue 3 + Prisma + Element Plus CRUD patterns for topic/project management
**Confidence:** HIGH

## Summary

Phase 2 extends the existing auth infrastructure to implement topic browsing, project creation, and student dashboard. The core pattern is: User → Project → Topic relations where a student creates a Project instance from a Topic (not "locking" the topic). Same topic can be selected multiple times by different students or the same student. Custom topics are private to the creator.

The implementation follows established patterns from Phase 1: Prisma schema with relations/enums, Express routes with auth middleware, Pinia stores with setup syntax, Vue components with Element Plus UI, and Vue Router with meta guards.

**Primary recommendation:** Extend schema.prisma with Topic and Project models following User pattern, create topics.routes.ts and projects.routes.ts following auth.routes.ts pattern, add topic.store.ts and project.store.ts following auth.store.ts pattern, and update Dashboard.vue with real project list replacing placeholder.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Topic Data Model
- **D-01:** 选题表字段：标题、描述、背景、目标、领域（软件工程/大数据）、技术栈建议(JSON数组)
- **D-02:** 无难度级别标记 — 学生自行判断复杂度
- **D-03:** 领域分类仅两类：软件工程(SE)、大数据(BD) — 与PRD定义一致
- **D-04:** 技术栈建议存储为JSON数组 — 支持多个技术栈选项供学生选择
- **D-05:** 选题类型字段：SYSTEM(系统预设) / CUSTOM(学生自拟)

#### Project Model (原"选题锁定")
- **D-06:** 不是"锁定选题"，而是"创建项目" — 选择选题即创建一个新项目实例
- **D-07:** 同一选题可被多次选择 — 不同学生或同一学生可多次创建同题项目
- **D-08:** 学生最多创建10个项目（可配置上限）
- **D-09:** 项目可删除 — 删除不影响选题池中的原始选题
- **D-10:** 项目状态：NOT_STARTED(未开始) / IN_PROGRESS(进行中) / COMPLETED(已完成)
- **D-11:** 项目关联学生(User) + 选题(Topic)，存储创建时间、状态、已生成文档引用

#### Custom Topic Submission
- **D-12:** 自拟选题字段：标题+描述+背景+目标+领域 — 与系统选题结构一致
- **D-13:** 自拟选题无需审核 — 学生提交即生效
- **D-14:** 自拟选题仅自己可用 — 不加入公共选题池
- **D-15:** 自拟选题创建类型标记为CUSTOM，仅创建者可见

#### UI Layout & Navigation
- **D-16:** 选题池页面：表格列表 + 侧边筛选栏（领域筛选）
- **D-17:** 导航结构：顶部导航栏 + Dashboard入口按钮（延续Phase1 Header）
- **D-18:** 项目列表嵌入Dashboard页面 — 替换现有占位卡片
- **D-19:** Dashboard布局：上区域用户信息卡片(已存在) + 下区域项目列表卡片

### Claude's Discretion
- 选题池表格具体列设计
- 筛选栏交互细节
- 项目卡片展示内容（状态、进度、文档图标）
- 项目详情页面结构
- 自拟选题提交表单交互流程

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TOPIC-01 | 学生可浏览选题池列表 | Prisma findMany + Element Plus el-table pattern |
| TOPIC-02 | 选题按领域分类展示 | Prisma where filter + Element Plus el-table-column filters |
| TOPIC-03 | 学生可查看选题详情 | Dialog with nested table pattern from Element Plus docs |
| TOPIC-04 | 学生可选择并锁定一个选题 | Project model (D-06: creates project instance, not locks) |
| TOPIC-05 | 学生可提交自拟选题 | Custom topic form with TopicType.CUSTOM + creatorId field |
| TOPIC-06 | 选题显示难度级别标记 | NOT IMPLEMENTED per D-02 (学生自行判断复杂度) |
| DASH-01 | 学生可查看自己的项目列表 | Prisma include relations + Project store with user filter |
| DASH-02 | 学生可查看当前项目状态 | ProjectStatus enum + el-tag display in project cards |
| DASH-03 | 学生可访问已生成的文档 | Project.documentsRef JSON field (Phase 3 implementation) |

**Note on TOPIC-04:** D-06 explicitly changes requirement semantics from "锁定选题" to "创建项目". TOPIC-06 is deferred per D-02.
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Topic browsing/filtering | Frontend (Vue) | API (Express) | UI-driven interaction, API provides data |
| Project creation | API (Express) | Database (Prisma) | Business logic validates max projects (D-08), persists relation |
| Custom topic submission | API + Frontend | Database | Form validation on frontend, persistence with creatorId on API |
| Project list display | Frontend (Dashboard) | API | State managed by Pinia, data fetched from API |
| Navigation structure | Frontend (Router) | — | Vue Router handles route definitions and guards |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prisma | 7.7.0 [VERIFIED: npm registry] | ORM with relations, enums, JSON fields | Type-safe queries, established pattern from Phase 1 |
| Express | 5.2.1 [VERIFIED: package.json] | API routing with middleware | Phase 1 auth.routes.ts pattern |
| Pinia | 3.0.4 [VERIFIED: npm registry] | State management with setup stores | Phase 1 auth.store.ts pattern |
| Element Plus | 2.13.7 [VERIFIED: npm registry] | UI components (table, form, dialog, card) | Chinese-friendly, Phase 1 established |
| Vue Router | 5.0.4 [VERIFIED: package.json] | Route management with meta guards | Phase 1 router/index.ts pattern |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| bcryptjs | 3.0.3 | Password hashing (auth) | Already in Phase 1, not new for Phase 2 |
| jsonwebtoken | 9.0.3 | JWT handling (auth) | Already in Phase 1, authMiddleware used for project routes |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Element Plus el-table | ag-Grid | ag-Grid heavier, Element Plus sufficient for simple list |
| Prisma JSON field | Separate TechStack model | JSON simpler for "建议" (optional), no foreign key complexity |
| Setup store (Pinia) | Options store | Setup store matches Vue 3 Composition API style (Phase 1 pattern) |

**Installation:** Phase 2 uses existing dependencies from Phase 1. No new packages required.

**Version verification:**
```
npm view prisma version → 7.7.0 (2026-04-18)
npm view element-plus version → 2.13.7 (matches package.json)
npm view pinia version → 3.0.4 (matches package.json)
npm view express version → ^5.2.1 (package.json)
```

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser / Client                          │
├─────────────────────────────────────────────────────────────────┤
│  Vue 3 Frontend                                                  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Dashboard.vue   │  │ TopicPool.vue   │  │ CustomTopic.vue │  │
│  │ (project list)  │  │ (topic browse)  │  │ (submit form)   │  │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘  │
│           │                    │                    │           │
│  ┌────────▼────────────────────▼────────────────────▼────────┐  │
│  │              Pinia Stores (topic, project)                │  │
│  │   topic.store.ts ←─────→ project.store.ts                 │  │
│  └──────────────────────────┬────────────────────────────────┘  │
│                             │ API calls                         │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTP + JWT Cookie
┌─────────────────────────────▼───────────────────────────────────┐
│                    API / Backend (Express)                       │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐                       │
│  │ topics.routes.ts│  │projects.routes.ts│                       │
│  └────────┬────────┘  └────────┬────────┘                       │
│           │                    │                                 │
│  ┌────────▼────────────────────▼────────────────────────────────┤
│  │           authMiddleware (JWT verification)                   │
│  └──────────────────────────┬────────────────────────────────────┤
│                             │                                   │
│  ┌──────────────────────────▼────────────────────────────────────┤
│  │                   Prisma Client                               │
│  └──────────────────────────┬────────────────────────────────────┤
└─────────────────────────────┼───────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                    Database / Storage (MySQL)                    │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│  │    User     │◄───│   Project   │───►│    Topic    │          │
│  │ (Phase 1)   │    │ (Phase 2)   │    │ (Phase 2)   │          │
│  └─────────────┘    └─────────────┘    └─────────────┘          │
│        │                  │                                       │
│        └──────────────────┘                                       │
│           User.projects[]                                         │
│           Project.userId → User                                   │
│           Project.topicId → Topic                                 │
│           Topic.creatorId? → User (for CUSTOM)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
backend/src/
├── routes/
│   ├── auth.routes.ts      # Phase 1 - existing
│   ├── topics.routes.ts    # Phase 2 - NEW: CRUD for topics
│   └── projects.routes.ts  # Phase 2 - NEW: CRUD for projects
├── middleware/
│   └── auth.middleware.ts  # Phase 1 - reuse for new routes
├── utils/
│   ├── jwt.utils.ts        # Phase 1 - existing
│   └── password.utils.ts   # Phase 1 - existing
└── index.ts                # Mount new routes

backend/prisma/
└── schema.prisma           # Add Topic, Project models + enums

frontend/src/
├── views/
│   ├── Dashboard.vue       # Phase 1 - UPDATE: replace placeholder
│   ├── TopicPool.vue       # Phase 2 - NEW: topic browsing
│   └── TopicDetail.vue     # Phase 2 - NEW: topic detail dialog
│   └── CustomTopic.vue     # Phase 2 - NEW: custom topic form
├── stores/
│   ├── auth.store.ts       # Phase 1 - existing
│   ├── topic.store.ts      # Phase 2 - NEW: topic state
│   └── project.store.ts    # Phase 2 - NEW: project state
├── api/
│   ├── auth.api.ts         # Phase 1 - existing
│   ├── topic.api.ts        # Phase 2 - NEW: topic API client
│   └── project.api.ts      # Phase 2 - NEW: project API client
├── router/
│   └── index.ts            # Phase 2 - ADD: /topics route
└── utils/
    └── request.ts          # Phase 1 - reuse
```

### Pattern 1: Prisma Model with Relations and Enums

**What:** Define Topic and Project models following User pattern with relations, enums, and JSON fields.

**When to use:** Database schema for Phase 2 data.

**Example:**
```prisma
// Source: [CITED: prisma.io/docs - enum + relations + Json]

// Existing from Phase 1
model User {
  id        Int      @id @default(autoincrement())
  studentId String   @unique
  name      String
  major     String
  grade     String
  class     String
  password  String
  role      Role     @default(STUDENT)
  status    Status   @default(ACTIVE)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // NEW: Phase 2 relations
  projects  Project[]  // User has many projects
  customTopics Topic[] @relation("CustomTopic")  // User's custom topics
  
  @@index([studentId])
  @@index([role])
}

// NEW: Phase 2 models
model Topic {
  id              Int        @id @default(autoincrement())
  title           String     // D-01: 标题
  description     String     // D-01: 描述
  background      String     // D-01: 背景
  objectives      String     // D-01: 目标
  domain          Domain     // D-03: 领域分类
  techStack       Json       // D-04: 技术栈建议 (JSON array)
  type            TopicType  @default(SYSTEM)  // D-05: 类型
  creatorId       Int?       // D-14: 仅自定义选题有creator
  creator         User?      @relation("CustomTopic", fields: [creatorId], references: [id])
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt
  
  // Projects created from this topic
  projects        Project[]
  
  @@index([domain])
  @@index([type])
  @@index([creatorId])  // For filtering custom topics by user
}

model Project {
  id              Int          @id @default(autoincrement())
  userId          Int          // D-11: 关联学生
  topicId         Int          // D-11: 关联选题
  status          ProjectStatus @default(NOT_STARTED)  // D-10
  documentsRef    Json?        // D-11: 已生成文档引用 (Phase 3)
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt
  
  // Relations
  user            User         @relation(fields: [userId], references: [id])
  topic           Topic        @relation(fields: [topicId], references: [id])
  
  @@index([userId])
  @@index([status])
  @@index([topicId])
}

// NEW: Phase 2 enums
enum Domain {
  SE  // 软件工程 - D-03
  BD  // 大数据 - D-03
}

enum TopicType {
  SYSTEM  // 系统预设 - D-05
  CUSTOM  // 学生自拟 - D-05
}

enum ProjectStatus {
  NOT_STARTED  // 未开始 - D-10
  IN_PROGRESS  // 进行中 - D-10
  COMPLETED    // 已完成 - D-10
}
```

### Pattern 2: Express Route with Auth Middleware

**What:** CRUD routes following auth.routes.ts pattern with Prisma queries and authMiddleware.

**When to use:** API endpoints for topics and projects.

**Example:**
```typescript
// Source: [CITED: backend/src/routes/auth.routes.ts - Phase 1 pattern]
// Source: [CITED: prisma.io/docs - include relations]

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();
const prisma = new PrismaClient();

// GET /api/topics - List all SYSTEM topics + user's CUSTOM topics
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    // D-14: Custom topics only visible to creator
    const topics = await prisma.topic.findMany({
      where: {
        OR: [
          { type: 'SYSTEM' },  // Public system topics
          { creatorId: userId }  // User's custom topics
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ topics });
    await prisma.$disconnect();
  } catch (error) {
    console.error('Topics list error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// POST /api/topics/custom - Create custom topic (D-12, D-13, D-15)
router.post('/custom', authMiddleware, async (req: Request, res: Response) => {
  const { title, description, background, objectives, domain } = req.body;
  
  // Input validation
  if (!title || !description || !domain) {
    return res.status(400).json({ error: '请填写必要信息' });
  }
  
  try {
    const userId = req.user!.userId;
    
    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        background: background || '',
        objectives: objectives || '',
        domain: domain as Domain,
        techStack: [],  // Empty for custom topics
        type: 'CUSTOM',
        creatorId: userId
      }
    });
    
    res.json({ topic });
    await prisma.$disconnect();
  } catch (error) {
    console.error('Custom topic error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// POST /api/projects - Create project from topic (D-06, D-07, D-08)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const { topicId } = req.body;
  
  if (!topicId) {
    return res.status(400).json({ error: '请选择选题' });
  }
  
  try {
    const userId = req.user!.userId;
    
    // D-08: Check max projects limit (10)
    const existingCount = await prisma.project.count({
      where: { userId }
    });
    
    if (existingCount >= 10) {
      return res.status(400).json({ error: '已达到项目上限(10个)' });
    }
    
    // D-06: Create project instance (not lock topic)
    const project = await prisma.project.create({
      data: {
        userId,
        topicId,
        status: 'NOT_STARTED'
      },
      include: {
        topic: true  // Return topic info for UI
      }
    });
    
    res.json({ project });
    await prisma.$disconnect();
  } catch (error) {
    console.error('Project create error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// GET /api/projects - List user's projects (DASH-01, DASH-02)
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            domain: true,
            type: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ projects });
    await prisma.$disconnect();
  } catch (error) {
    console.error('Projects list error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// DELETE /api/projects/:id - Delete project (D-09)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const projectId = parseInt(req.params.id);
    
    // Verify ownership
    const project = await prisma.project.findFirst({
      where: { id: projectId, userId }
    });
    
    if (!project) {
      return res.status(404).json({ error: '项目不存在' });
    }
    
    await prisma.project.delete({
      where: { id: projectId }
    });
    
    res.json({ message: '项目已删除' });
    await prisma.$disconnect();
  } catch (error) {
    console.error('Project delete error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

export default router;
```

### Pattern 3: Pinia Setup Store with Async Actions

**What:** Store pattern following auth.store.ts with ref state, computed getters, async actions.

**When to use:** State management for topics and projects.

**Example:**
```typescript
// Source: [CITED: github.com/vuejs/pinia - setup store pattern]
// Source: [CITED: frontend/src/stores/auth.store.ts - Phase 1 pattern]

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchTopicsApi, createCustomTopicApi } from '@/api/topic.api';

export const useTopicStore = defineStore('topic', () => {
  // State
  const topics = ref<Topic[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const selectedDomain = ref<Domain | null>(null);

  // Computed
  const filteredTopics = computed(() => {
    if (!selectedDomain.value) return topics.value;
    return topics.value.filter(t => t.domain === selectedDomain.value);
  });
  
  const systemTopics = computed(() => 
    topics.value.filter(t => t.type === 'SYSTEM')
  );
  
  const customTopics = computed(() => 
    topics.value.filter(t => t.type === 'CUSTOM')
  );

  // Actions
  async function fetchTopics(): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetchTopicsApi();
      topics.value = response.topics;
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取选题失败';
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  async function createCustomTopic(data: CustomTopicInput): Promise<boolean> {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createCustomTopicApi(data);
      topics.value.push(response.topic);
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建选题失败';
      return false;
    } finally {
      loading.value = false;
    }
  }
  
  function setDomainFilter(domain: Domain | null): void {
    selectedDomain.value = domain;
  }
  
  function $reset(): void {
    topics.value = [];
    loading.value = false;
    error.value = null;
    selectedDomain.value = null;
  }

  return {
    topics, loading, error, selectedDomain,
    filteredTopics, systemTopics, customTopics,
    fetchTopics, createCustomTopic, setDomainFilter, $reset
  };
});

// Types
interface Topic {
  id: number;
  title: string;
  description: string;
  background: string;
  objectives: string;
  domain: Domain;
  techStack: string[];
  type: TopicType;
  creatorId?: number;
  createdAt: string;
}

type Domain = 'SE' | 'BD';
type TopicType = 'SYSTEM' | 'CUSTOM';

interface CustomTopicInput {
  title: string;
  description: string;
  background: string;
  objectives: string;
  domain: Domain;
}
```

### Pattern 4: Element Plus Table with Filter

**What:** el-table with column filters for domain filtering (D-16, TOPIC-02).

**When to use:** TopicPool.vue for browsing topics.

**Example:**
```vue
<!-- Source: [CITED: element-plus.org - table filter pattern] -->
<template>
  <el-container>
    <!-- Sidebar filter -->
    <el-aside width="200px">
      <el-card>
        <template #header>领域筛选</template>
        <el-radio-group v-model="topicStore.selectedDomain" @change="handleFilter">
          <el-radio-button :value="null">全部</el-radio-button>
          <el-radio-button value="SE">软件工程</el-radio-button>
          <el-radio-button value="BD">大数据</el-radio-button>
        </el-radio-group>
      </el-card>
    </el-aside>
    
    <!-- Main table -->
    <el-main>
      <el-table :data="topicStore.filteredTopics" v-loading="topicStore.loading">
        <el-table-column prop="title" label="标题" width="200" />
        <el-table-column prop="domain" label="领域" width="100">
          <template #default="{ row }">
            <el-tag :type="row.domain === 'SE' ? 'primary' : 'success'">
              {{ row.domain === 'SE' ? '软件工程' : '大数据' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag :type="row.type === 'SYSTEM' ? '' : 'warning'">
              {{ row.type === 'SYSTEM' ? '系统' : '自拟' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="showDetail(row)">详情</el-button>
            <el-button type="primary" size="small" @click="createProject(row)">
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- Detail dialog -->
      <el-dialog v-model="detailVisible" title="选题详情" width="600">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="标题">{{ currentTopic?.title }}</el-descriptions-item>
          <el-descriptions-item label="描述">{{ currentTopic?.description }}</el-descriptions-item>
          <el-descriptions-item label="背景">{{ currentTopic?.background }}</el-descriptions-item>
          <el-descriptions-item label="目标">{{ currentTopic?.objectives }}</el-descriptions-item>
          <el-descriptions-item label="技术栈建议">
            <el-tag v-for="tech in currentTopic?.techStack" :key="tech">
              {{ tech }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { useTopicStore } from '@/stores/topic.store';
import { useProjectStore } from '@/stores/project.store';

const topicStore = useTopicStore();
const projectStore = useProjectStore();

const detailVisible = ref(false);
const currentTopic = ref<Topic | null>(null);

onMounted(() => {
  topicStore.fetchTopics();
});

function handleFilter(): void {
  // Filter is handled by computed in store
}

function showDetail(topic: Topic): void {
  currentTopic.value = topic;
  detailVisible.value = true;
}

async function createProject(topic: Topic): Promise<void> {
  const success = await projectStore.createProject(topic.id);
  if (success) {
    ElMessage.success('项目创建成功');
  }
}
</script>
```

### Anti-Patterns to Avoid

- **Calling useStore() after await:** In Pinia actions, call other stores before any `await` statement [CITED: github.com/vuejs/pinia - SSR issue warning]
- **Not indexing relation fields:** Always add @@index on userId, topicId, creatorId for query performance
- **Using select and include together:** Prisma doesn't allow both on same query level - use nested select within include [CITED: prisma.io/docs]
- **Deleting Topic instead of Project:** D-09 states deleting project does NOT affect original topic in pool

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Table filtering | Custom JS filter logic | Element Plus el-table-column filters | Built-in filter UI, tested interactions |
| Form validation | Manual validation checks | Element Plus el-form with rules | Async validation, error display built-in |
| State persistence | localStorage manually | Pinia with watchers | Type-safe, devtools support |
| API error handling | Try-catch in every component | API wrapper + store error state | Centralized error handling |

**Key insight:** Element Plus provides complete UI primitives. Prisma provides type-safe queries. Don't reinvent CRUD patterns.

## Common Pitfalls

### Pitfall 1: Project Count Exceeds Limit (D-08)

**What goes wrong:** Student creates more than 10 projects, violates business rule.

**Why it happens:** No validation in frontend, backend only checks but returns generic error.

**How to avoid:**
- Backend: Check count before create, return specific error "已达到项目上限(10个)"
- Frontend: Show project count in Dashboard, disable "选择" button when count >= 10

**Warning signs:** Projects created successfully after limit, count mismatch in UI.

### Pitfall 2: Custom Topic Visibility (D-14)

**What goes wrong:** Custom topics appear in other students' topic pool.

**Why it happens:** Query uses `findMany()` without `OR` condition filtering by creatorId.

**How to avoid:**
```typescript
// CORRECT: Filter by SYSTEM + user's CUSTOM
where: { OR: [{ type: 'SYSTEM' }, { creatorId: userId }] }

// WRONG: Shows all topics including others' custom
where: {}  // Missing filter
```

**Warning signs:** Students see topics with unfamiliar titles, "自拟" topics from other users.

### Pitfall 3: Project-Topic Relation Integrity

**What goes wrong:** Deleting a topic causes projects to have null topic reference.

**Why it happens:** System topics should never be deleted. Custom topics should only be deletable if no projects reference them.

**How to avoid:**
- Backend: Check project count before deleting any topic
- Only allow delete if topic.projects.length === 0
- Add onDelete: Restrict or Cascade in schema? NO - use soft approach, check in API

**Warning signs:** Project detail shows null topic title, orphaned projects.

### Pitfall 4: Json Field Type Safety

**What goes wrong:** techStack field returns object instead of array, TypeScript errors.

**Why it happens:** Prisma Json type is generic, needs casting.

**How to avoid:**
```typescript
// In API response, cast JSON field
const topics = await prisma.topic.findMany();
const typedTopics = topics.map(t => ({
  ...t,
  techStack: t.techStack as string[]  // Cast to expected type
}));
```

**Warning signs:** `techStack.map()` throws TypeError, undefined methods on Json field.

## Code Examples

### API Client Pattern (frontend/src/api/topic.api.ts)

```typescript
// Source: [CITED: frontend/src/api/auth.api.ts - Phase 1 pattern]
import { api } from '@/utils/request';

export interface Topic {
  id: number;
  title: string;
  description: string;
  background: string;
  objectives: string;
  domain: 'SE' | 'BD';
  techStack: string[];
  type: 'SYSTEM' | 'CUSTOM';
  createdAt: string;
}

export interface TopicsResponse {
  topics: Topic[];
}

export interface CustomTopicInput {
  title: string;
  description: string;
  background: string;
  objectives: string;
  domain: 'SE' | 'BD';
}

export async function fetchTopicsApi(): Promise<TopicsResponse> {
  return api.get<TopicsResponse>('/api/topics');
}

export async function createCustomTopicApi(data: CustomTopicInput): Promise<{ topic: Topic }> {
  return api.post<{ topic: Topic }>('/api/topics/custom', data);
}
```

### Router Guard Extension (frontend/src/router/index.ts)

```typescript
// Source: [CITED: frontend/src/router/index.ts - Phase 1 pattern]
// Add new routes for Phase 2

const routes: RouteRecordRaw[] = [
  // ... existing routes from Phase 1
  {
    path: '/topics',
    name: 'TopicPool',
    component: () => import('@/views/TopicPool.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetail.vue'),
    meta: { requiresAuth: true }
  },
  // ...
];
```

### Dashboard Project List Update (frontend/src/views/Dashboard.vue)

```vue
<!-- Source: [CITED: frontend/src/views/Dashboard.vue - Phase 1 placeholder] -->
<!-- Replace projects-card placeholder with real list -->

<el-card class="projects-card">
  <template #header>
    <div class="card-header">
      <span>我的项目 ({{ projectStore.projects.length }}/10)</span>
      <el-button type="primary" size="small" @click="router.push('/topics')">
        去选题
      </el-button>
    </div>
  </template>
  
  <!-- Real project list -->
  <div v-if="projectStore.projects.length > 0" class="project-list">
    <div v-for="project in projectStore.projects" :key="project.id" class="project-item">
      <el-card shadow="hover" @click="router.push(`/projects/${project.id}`)">
        <div class="project-header">
          <span class="project-title">{{ project.topic?.title }}</span>
          <el-tag :type="getTagType(project.status)">
            {{ getStatusText(project.status) }}
          </el-tag>
        </div>
        <div class="project-info">
          <span>{{ project.topic?.domain === 'SE' ? '软件工程' : '大数据' }}</span>
          <span>创建于 {{ formatDate(project.createdAt) }}</span>
        </div>
        <el-button type="danger" size="small" text @click.stop="deleteProject(project.id)">
          删除
        </el-button>
      </el-card>
    </div>
  </div>
  
  <!-- Empty state -->
  <el-empty v-else description="暂无项目">
    <el-button type="primary" @click="router.push('/topics')">去选题</el-button>
  </el-empty>
</el-card>

<script setup lang="ts">
// Add project store
import { useProjectStore } from '@/stores/project.store';
import { onMounted } from 'vue';

const projectStore = useProjectStore();

onMounted(() => {
  projectStore.fetchProjects();
});

function getTagType(status: ProjectStatus): string {
  switch (status) {
    case 'NOT_STARTED': return 'info';
    case 'IN_PROGRESS': return 'warning';
    case 'COMPLETED': return 'success';
  }
}

function getStatusText(status: ProjectStatus): string {
  switch (status) {
    case 'NOT_STARTED': return '未开始';
    case 'IN_PROGRESS': return '进行中';
    case 'COMPLETED': return '已完成';
  }
}

async function deleteProject(id: number): Promise<void> {
  await projectStore.deleteProject(id);
}
</script>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Options API stores | Setup stores (Composition API) | Pinia 2.x | Better TypeScript support, Vue 3 style |
| Manual filter logic | Element Plus built-in filters | Element Plus 2.x | Less custom code, consistent UI |
| Foreign key cascade | Prisma relation checks | Prisma 5.x+ | Safer deletes, explicit business logic |

**Deprecated/outdated:**
- Vuex: Replaced by Pinia (lighter, better DX)
- Options API: Setup stores preferred for Vue 3

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | TOPIC-06 "难度级别标记" is deferred per D-02 | Phase Requirements | If user expects difficulty display, need clarification |
| A2 | Project.documentsRef structure defined in Phase 3 | Pattern 1 | Phase 2 only creates placeholder, Phase 3 fills content |
| A3 | Topic deletion logic not blocking Phase 2 | Common Pitfalls | Admin topic management is Phase 5 scope |

**If this table is empty:** All claims in this research were verified or cited.

## Open Questions

1. **TOPIC-06 vs D-02 Conflict**
   - What we know: REQUIREMENTS.md lists TOPIC-06 "选题显示难度级别标记"
   - What's unclear: D-02 explicitly states "无难度级别标记 — 学生自行判断复杂度"
   - Recommendation: Follow D-02 (user decision), mark TOPIC-06 as deferred/out-of-scope for Phase 2

2. **Project.documentsRef Schema**
   - What we know: D-11 mentions "已生成文档引用", Phase 3 implements document generation
   - What's unclear: Exact JSON structure for documentsRef
   - Recommendation: Use placeholder `{}` in Phase 2, define structure in Phase 3 research

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/runtime | ✓ | v24.13.0 | — |
| npm | Package management | ✓ | 11.6.2 | — |
| MySQL | Database | ✓ (Phase 1 setup) | — | Prisma dev with SQLite if needed |
| Express | API server | ✓ | 5.2.1 | — |
| Prisma | ORM | ✓ | 7.7.0 (latest) | — |
| Vue 3 | Frontend | ✓ | 3.5.32 | — |
| Element Plus | UI components | ✓ | 2.13.7 | — |
| Pinia | State management | ✓ | 3.0.4 | — |

**Missing dependencies with no fallback:**
- None — all Phase 2 dependencies inherited from Phase 1

**Missing dependencies with fallback:**
- None

## Validation Architecture

> nyquist_validation: true (workflow.nyquist_validation enabled in config.json)

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Not yet established (Phase 1 had no tests) |
| Config file | none — Wave 0 needs framework setup |
| Quick run command | TBD after framework selection |
| Full suite command | TBD |

**Recommended Framework:** Vitest for frontend (matches Vite stack), Jest/Vitest for backend.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| TOPIC-01 | Browse topic list | integration | `vitest run tests/api/topics.test.ts` | ❌ Wave 0 |
| TOPIC-02 | Filter by domain | unit | `vitest run tests/stores/topic.test.ts` | ❌ Wave 0 |
| TOPIC-03 | View topic detail | integration | `vitest run tests/components/TopicDetail.test.ts` | ❌ Wave 0 |
| TOPIC-04 | Create project from topic | integration | `vitest run tests/api/projects.test.ts` | ❌ Wave 0 |
| TOPIC-05 | Submit custom topic | integration | `vitest run tests/api/topics.test.ts` | ❌ Wave 0 |
| TOPIC-06 | Difficulty display | deferred | — (D-02: not implemented) | N/A |
| DASH-01 | View project list | unit | `vitest run tests/stores/project.test.ts` | ❌ Wave 0 |
| DASH-02 | View project status | unit | `vitest run tests/components/ProjectCard.test.ts` | ❌ Wave 0 |
| DASH-03 | Access documents | deferred | — (Phase 3 implementation) | N/A |

### Sampling Rate
- **Per task commit:** Quick unit tests for store logic
- **Per wave merge:** Integration tests for API routes
- **Phase gate:** Full suite covering TOPIC-01~05, DASH-01~02

### Wave 0 Gaps
- [ ] `backend/tests/setup.ts` — test database setup
- [ ] `backend/tests/api/topics.test.ts` — TOPIC-01, TOPIC-02, TOPIC-05
- [ ] `backend/tests/api/projects.test.ts` — TOPIC-04, DASH-01
- [ ] `frontend/tests/stores/topic.test.ts` — TOPIC-02 filter logic
- [ ] `frontend/tests/stores/project.test.ts` — DASH-01, DASH-02
- [ ] `frontend/tests/components/TopicPool.test.ts` — TOPIC-01 display
- [ ] `frontend/tests/components/Dashboard.test.ts` — DASH-01, DASH-02
- [ ] Framework install: `npm i -D vitest @vue/test-utils` — frontend
- [ ] Framework install: `npm i -D vitest` — backend

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes (inherit) | JWT middleware from Phase 1 |
| V3 Session Management | yes (inherit) | httpOnly cookie from Phase 1 |
| V4 Access Control | yes | Creator check for custom topics, owner check for project delete |
| V5 Input Validation | yes | Prisma type safety + API body validation |
| V6 Cryptography | no | No new crypto in Phase 2 |

### Known Threat Patterns for Vue + Express + Prisma

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| IDOR (Project delete) | Tampering | Check userId === req.user.userId before delete |
| XSS in topic fields | Tampering | Vue auto-escapes, sanitize on input if needed |
| SQL injection | Tampering | Prisma parameterized queries (built-in) |
| CSRF on project create | Tampering | Same-site cookie + auth middleware |
| Mass assignment | Tampering | Explicit field selection in Prisma create |

**Key security checks:**
- Project delete: `where: { id, userId }` — not just `id`
- Custom topic: `creatorId: userId` from JWT, not from body
- Topic list: Filter by `OR: [{ type: 'SYSTEM' }, { creatorId: userId }]`

## Sources

### Primary (HIGH confidence)
- [CITED: prisma.io/docs] - enum, relations, Json field, include/select patterns
- [CITED: element-plus.org] - table filters, dialog, card, tag components
- [CITED: github.com/vuejs/pinia] - setup store, async actions, store composition
- [VERIFIED: npm registry] - prisma 7.7.0, element-plus 2.13.7, pinia 3.0.4

### Secondary (MEDIUM confidence)
- [CITED: backend/src/routes/auth.routes.ts] - Express route pattern from Phase 1
- [CITED: frontend/src/stores/auth.store.ts] - Pinia setup store pattern from Phase 1
- [CITED: backend/prisma/schema.prisma] - User model pattern from Phase 1

### Tertiary (LOW confidence)
- [ASSUMED] TOPIC-06 difficulty display deferred per D-02 — needs user confirmation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - verified via npm registry, matches Phase 1 patterns
- Architecture: HIGH - Prisma + Express + Pinia + Vue patterns well-documented
- Pitfalls: HIGH - based on documented patterns and D-decisions constraints

**Research date:** 2026-04-18
**Valid until:** 2026-05-18 (30 days - stable libraries)