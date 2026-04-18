# Phase 3: 文档生成与AI服务 - Research

**Researched:** 2026-04-18
**Domain:** AI文档生成、Markdown编辑器、MiniMax API集成
**Confidence:** HIGH (MiniMax API verified via Context7, CodeMirror verified via npm registry)

## Summary

Phase 3 implements AI-assisted document generation using a self-deployed MiniMax API. Students can generate PRD, frontend, and backend documentation templates with domain-specific differentiation (Software Engineering vs Big Data). The system uses the OpenAI SDK with a custom baseURL to call MiniMax API, stores documents in a dedicated Document table, and provides an online Markdown editor for editing.

**Primary recommendation:** Use OpenAI SDK (v6.34.0) with custom baseURL for MiniMax API integration; vue-codemirror (v6.1.1) with @codemirror/lang-markdown for the Markdown editor; Prisma Document table with three records per project (PRD + FRONTEND + BACKEND).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** 使用学校自部署的MiniMax模型API（非外部Claude/OpenAI）
- **D-02:** 独立AI服务模块设计，便于未来扩展替换模型
- **D-03:** 无API调用成本限制，自部署服务无需配额控制
- **D-04:** 不显示API配额提示（DOC-08调整），简化用户体验

### Document Template Structure
- **D-05:** PRD标准结构：项目概述、功能需求(核心)、技术建议、验收标准
- **D-06:** 前端文档结构：组件结构、状态管理、路由设计、样式方案
- **D-07:** 后端文档结构：API设计、数据库设计、中间件配置、部署说明
- **D-08:** 软件工程(SE)和大数据(BD)领域使用差异化模板
- **D-09:** SE模板侧重功能流程和交互设计；BD模板侧重数据Pipeline和分析模型

### Document Storage
- **D-10:** 新建Document表存储文档内容，关联Project
- **D-11:** 每个Project对应3个Document记录（PRD + 前端文档 + 后端文档）
- **D-12:** 单版本存储，每次生成覆盖之前内容，学生编辑实时保存
- **D-13:** Document表字段：projectId、docType(PRD/FRONTEND/BACKEND)、content(Markdown)、createdAt、updatedAt

### Claude's Discretion
- Markdown编辑器选择（Monaco Editor / CodeMirror / 简单textarea）
- 技术栈推荐展示UI（卡片选择 / 下拉列表 / 标签编辑）
- 文档编辑保存策略（实时保存 / 手动保存按钮）
- 生成按钮交互流程（一键生成全部 / 分步生成单个文档）
- 项目详情页面布局结构

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DOC-01 | 学生可生成PRD文档框架 | MiniMax API + PRD template (D-05) + prompt engineering patterns |
| DOC-02 | 学生可生成前端开发文档模板 | MiniMax API + Frontend template (D-06) + vue-codemirror for editing |
| DOC-03 | 学生可生成后端开发文档模板 | MiniMax API + Backend template (D-07) + Document table schema |
| DOC-04 | AI根据选题内容填充文档初始内容 | MiniMax chat completion with topic info + prompt templates |
| DOC-05 | 学生可在线编辑修改文档内容 | vue-codemirror with @codemirror/lang-markdown + real-time save API |
| DOC-06 | 学生可查看技术栈推荐方案 | Topic.techStack (JSON array from Phase 2) + display UI component |
| DOC-07 | 学生可修改技术栈选择 | Project-level tech stack modification + API endpoint |
| DOC-08 | 系统提示文档生成消耗API配额 | **Adjusted per D-04** — No quota display needed (self-deployed) |
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| AI Text Generation | API / Backend | — | MiniMax API calls require backend service; sensitive API keys must stay server-side |
| Document Storage | Database / Storage | API / Backend | Prisma Document model for persistence; backend routes for CRUD |
| Markdown Editor | Browser / Client | — | vue-codemirror runs entirely in browser; only content syncs to backend |
| Template Rendering | API / Backend | — | Prompt templates with domain differentiation (SE/BD) computed server-side |
| Tech Stack Display | Browser / Client | API / Backend | Topic.techStack from backend; display component in frontend |
| Document Save | API / Backend | Database / Storage | REST endpoint for PUT /api/documents/:id; Prisma update |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| openai | 6.34.0 [VERIFIED: npm registry] | MiniMax API client | OpenAI SDK compatibility; custom baseURL for self-deployed MiniMax |
| vue-codemirror | 6.1.1 [VERIFIED: npm registry] | Markdown editor component | Native Vue 3 support; CodeMirror 6 engine; extensible |
| @codemirror/lang-markdown | 6.5.0 [VERIFIED: npm registry] | Markdown syntax support | Official CodeMirror markdown mode; highlighting + parsing |
| @codemirror/theme-one-dark | 6.1.3 [VERIFIED: npm registry] | Editor theme | Popular dark theme; good for long editing sessions |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @codemirror/view | (bundled) | Editor view extensions | Custom styling, height, placeholder |
| @codemirror/state | (bundled) | Editor state management | v-model binding, change detection |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| vue-codemirror | @gravity-ui/markdown-editor | Gravity UI has WYSIWYG mode but requires React-style setup; vue-codemirror is simpler for Vue 3 |
| vue-codemirror | Monaco Editor | Monaco is heavier (~2MB), VS Code-style; overkill for simple Markdown editing |
| vue-codemirror | textarea + marked.js | Simpler but no syntax highlighting, preview, or undo stack |

**Installation (frontend):**
```bash
npm install vue-codemirror @codemirror/lang-markdown @codemirror/theme-one-dark
```

**Installation (backend):**
```bash
npm install openai
```

**MiniMax API Configuration (backend):**
```typescript
// ai.service.ts - D-02: Independent AI service module
import OpenAI from 'openai';

// Self-deployed MiniMax configuration (D-01)
const minimaxClient = new OpenAI({
  baseURL: process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1',
  apiKey: process.env.MINIMAX_API_KEY,
});

// Available models: M2-her, MiniMax-M2.7, MiniMax-M2.5, MiniMax-M2.1
const DEFAULT_MODEL = 'M2-her';
```

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Browser / Client                                   │
│  ┌─────────────────────────────────────────────────────────────────────    │
│  │  ProjectDetail.vue                                                   │    │
│  │  ├─ DocumentTabs (PRD | Frontend | Backend)                         │    │
│  │  │   └─ vue-codemirror (Markdown Editor)                            │    │
│  │  │       ├─ v-model="document.content"                              │    │
│  │  │       └─ @change="handleAutoSave"                                │    │
│  │  ├─ TechStackPanel (recommendation display + modification)          │    │
│  │  │   └─ el-select / el-tag for tech stack editing                   │    │
│  │  └─ GenerateButtons (一键生成 / 分步生成)                            │    │
│  │       └─ @click="generateDocument(docType)"                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                              │                                               │
│              API calls (credentials: 'include')                              │
│                              ▼                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                           API / Backend                                      │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐        │
│  │ documents.routes  │   │ ai.routes.ts     │   │ ai.service.ts    │        │
│  │ ├─ GET /:projectId│   │ ├─ POST /generate│   │ ├─ minimaxClient │        │
│  │ ├─ PUT /:id       │   │ │   {projectId,  │   │ ├─ generatePRD() │        │
│  │ ├─ POST /         │   │ │    docType}    │   │ ├─ generateFront │        │
│  │                   │   │                  │   │ ├─ generateBack  │        │
│  └──────────────────┘   └──────────────────┘   └──────────────────┘        │
│                              │                       │                       │
│                              │                       ▼                       │
│                              │           ┌──────────────────────┐            │
│                              │           │ MiniMax API (Self)   │            │
│                              │           │ ├─ POST /chat/complet│            │
│                              │           │ │   messages: [{     │            │
│                              │           │ │     role: "system",│            │
│                              │           │ │     content: PROMPT│            │
│                              │           │ │   }, {             │            │
│                              │           │ │     role: "user",  │            │
│                              │           │ │     content: topic │            │
│                              │           │ │   }]               │            │
│                              │           └──────────────────────┘            │
│                              ▼                                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                         Database / Storage                                   │
│  ┌─────────────────────────────────────────────────────────────────────    │
│  │  Document Table (Prisma)                                            │    │
│  │  ├─ id (Int, autoincrement)                                        │    │
│  │  ├─ projectId (Int, foreign key → Project)                         │    │
│  │  ├─ docType (Enum: PRD/FRONTEND/BACKEND)                           │    │
│  │  ├─ content (String, Markdown text)                                │    │
│  │  ├─ createdAt (DateTime)                                           │    │
│  │  ├─ updatedAt (DateTime)                                           │    │
│  │  └─ @@index([projectId, docType]) — unique constraint              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────    │
│  │  Project Table (Phase 2)                                            │    │
│  │  ├─ documentsRef (Json?) — Phase 2 placeholder, Phase 3 migrates   │    │
│  │  └─ documents: Document[] — new relation                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
backend/
├── src/
│   ├── routes/
│   │   ├── documents.routes.ts    # NEW: Document CRUD endpoints
│   │   └── ai.routes.ts           # NEW: AI generation endpoints
│   ├── services/
│   │   └── ai.service.ts          # NEW: MiniMax API client + prompts
│   └── prompts/
│       ├── prd.template.ts        # NEW: PRD prompt templates (SE/BD)
│       ├── frontend.template.ts   # NEW: Frontend doc prompts
│       └── backend.template.ts    # NEW: Backend doc prompts
├── prisma/
│   └── schema.prisma              # EXTEND: Add Document model + DocType enum

frontend/
├── src/
│   ├── views/
│   │   └── ProjectDetail.vue      # NEW: Project detail page with editor
│   ├── components/
│   │   ├── MarkdownEditor.vue     # NEW: Reusable vue-codemirror wrapper
│   │   ├── TechStackPanel.vue     # NEW: Tech stack display/edit
│   │   └── DocumentTabs.vue       # NEW: Tab component for 3 docs
│   ├── stores/
│   │   └── document.store.ts      # NEW: Document state management
│   ├── api/
│   │   └ document.api.ts          # NEW: Document API client
│   │   └ ai.api.ts                # NEW: AI generation API client
│   ├── types/
│   │   └ document.ts              # NEW: Document type definitions
│   └── router/
│   └── index.ts                   # EXTEND: Add /projects/:id route
```

### Pattern 1: MiniMax API Integration via OpenAI SDK

**What:** Use OpenAI SDK with custom baseURL to call self-deployed MiniMax API (D-01)
**When to use:** All AI text generation for document content
**Example:**
```typescript
// Source: https://platform.minimax.io/docs/guides/text-chat [VERIFIED: Context7]
import OpenAI from 'openai';

// ai.service.ts
export class AIService {
  private client: OpenAI;
  
  constructor() {
    this.client = new OpenAI({
      baseURL: process.env.MINIMAX_BASE_URL,
      apiKey: process.env.MINIMAX_API_KEY,
    });
  }

  async generateDocument(
    promptTemplate: string,
    topicInfo: { title: string; description: string; domain: string; objectives: string }
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: 'M2-her',  // Or configurable via env
      messages: [
        { role: 'system', content: promptTemplate },
        { role: 'user', content: this.buildUserPrompt(topicInfo) }
      ],
      temperature: 0.7,  // Lower for more consistent output
      max_tokens: 2048,
    });

    return response.choices[0]?.message?.content || '';
  }

  private buildUserPrompt(topic: TopicInfo): string {
    return `
请根据以下选题信息生成文档内容：

选题标题：${topic.title}
选题描述：${topic.description}
项目领域：${topic.domain === 'SE' ? '软件工程' : '大数据'}
项目目标：${topic.objectives}

请严格按照指定结构输出，使用Markdown格式。
    `.trim();
  }
}
```

### Pattern 2: Vue CodeMirror Markdown Editor Setup

**What:** vue-codemirror with markdown language support for document editing
**When to use:** DOC-05 online editing requirement
**Example:**
```vue
<!-- Source: https://context7.com/surmon-china/vue-codemirror/llms.txt [VERIFIED: Context7] -->
<script setup lang="ts">
import { ref, shallowRef, computed } from 'vue';
import { Codemirror } from 'vue-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

const content = ref<string>(initialMarkdown);
const view = shallowRef<EditorView>();

const extensions = computed(() => [
  markdown(),
  oneDark,
  EditorView.theme({
    '&': { height: '500px' },
    '.cm-scroller': { overflow: 'auto' }
  })
]);

const handleChange = (value: string) => {
  // Auto-save logic (D-12: real-time save)
  saveDocument(value);
};
</script>

<template>
  <codemirror
    v-model="content"
    :extensions="extensions"
    :indent-with-tab="true"
    :tab-size="2"
    :autofocus="false"
    placeholder="开始编辑文档..."
    :style="{ height: '500px' }"
    @change="handleChange"
  />
</template>
```

### Pattern 3: Document Table Schema (Prisma)

**What:** Prisma Document model per D-10~13 decisions
**When to use:** Phase 3 schema extension
**Example:**
```prisma
// schema.prisma extension
enum DocType {
  PRD       // D-05: PRD document
  FRONTEND  // D-06: Frontend document
  BACKEND   // D-07: Backend document
}

model Document {
  id        Int       @id @default(autoincrement())
  projectId Int       // D-10: Link to Project
  docType   DocType   // D-13: Document type enum
  content   String    @db.Text  // D-13: Markdown content (TEXT for large content)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  project   Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)

  @@unique([projectId, docType])  // D-11: One document per type per project
  @@index([projectId])
}

// Extend Project model
model Project {
  // ... existing fields
  documents  Document[]  // Phase 3 relation
}
```

### Anti-Patterns to Avoid

- **Hardcoding MiniMax API URL in frontend:** Sensitive API keys must stay backend-side; frontend calls backend routes which proxy to MiniMax
- **Storing documents in Project.documentsRef JSON:** D-10 explicitly requires dedicated Document table; JSON field has size limits and no query flexibility
- **Regenerating documents without user consent:** Each generation overwrites content (D-12); must warn user before regenerate action
- **Skipping auto-save debounce:** Real-time save (D-12) needs debounce (500ms-1s) to avoid API spam on every keystroke

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| AI API client | Custom HTTP wrapper for MiniMax | OpenAI SDK with baseURL | SDK handles retries, streaming, proper headers; MiniMax is OpenAI-compatible |
| Markdown editor | Custom textarea + marked.js | vue-codemirror | CodeMirror 6 has proper undo, syntax highlighting, extensible architecture |
| Document templates | String concatenation in routes | Dedicated prompt template files | Separation of concerns; easier to update templates; D-08/09 domain differentiation |
| Auto-save | setInterval polling | Debounced @change handler | Debounce prevents API spam; cleaner architecture |

**Key insight:** MiniMax API is OpenAI-compatible — don't build custom HTTP code when OpenAI SDK with baseURL works perfectly.

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | Project.documentsRef (Json? placeholder) | Migration: Create Document records for existing projects (optional) or leave as Phase 2 complete |
| Live service config | None — MiniMax API key in backend .env | None — backend-side config stays server-side |
| OS-registered state | None — no scheduled tasks or daemons | None |
| Secrets/env vars | MINIMAX_BASE_URL, MINIMAX_API_KEY (backend) | Add to backend/.env; document in deployment guide |
| Build artifacts | None — no compiled binaries | None |

**Nothing found in most categories:** This is a greenfield feature addition to existing backend/frontend. Only new env vars needed.

## Common Pitfalls

### Pitfall 1: MiniMax API Timeout on Long Documents
**What goes wrong:** Document generation may take 5-10 seconds; default Express timeout too short
**Why it happens:** MiniMax API generates structured content; max_tokens=2048 takes time
**How to avoid:** Set explicit timeout on AI routes (30s); show loading state in frontend
**Warning signs:** 504 Gateway Timeout errors; empty response body

### Pitfall 2: Document Content Exceeds MySQL TEXT Limit
**What goes wrong:** Generated documents > 64KB may fail to save
**Why it happens:** MySQL TEXT type has 64KB limit; Markdown with sections can exceed
**How to avoid:** Use `@db.Text` in Prisma (maps to MySQL TEXT) or consider `@db.LongText` for safety
**Warning signs:** Prisma write errors on large documents; truncated content

### Pitfall 3: Race Condition on Regenerate + Edit
**What goes wrong:** User clicks regenerate while auto-save is pending; content conflicts
**Why it happens:** No lock mechanism; generate overwrites while debounce save queued
**How to avoid:** Disable regenerate button during save; show "保存中..." status; queue operations
**Warning signs:** Lost user edits after regenerate; stale content displayed

### Pitfall 4: Missing Domain Differentiation in Prompts
**What goes wrong:** SE and BD projects get identical document templates
**Why it happens:** Prompt templates don't branch on domain (D-08/09)
**How to avoid:** Include domain in system prompt; separate prompt files for SE vs BD
**Warning signs:** BD documents lack data pipeline sections; SE documents have unnecessary data analysis

## Code Examples

### MiniMax Chat Completion (Node.js)

```typescript
// Source: https://platform.minimax.io/docs/api-reference/text-chat [VERIFIED: Context7]
import OpenAI from 'openai';

const minimaxClient = new OpenAI({
  baseURL: process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1',
  apiKey: process.env.MINIMAX_API_KEY,
});

// Generate document content
async function generatePRD(topicInfo: TopicInfo): Promise<string> {
  const response = await minimaxClient.chat.completions.create({
    model: 'M2-her',
    messages: [
      {
        role: 'system',
        content: getPRDPromptTemplate(topicInfo.domain)  // D-08: Domain-specific template
      },
      {
        role: 'user',
        content: `选题：${topicInfo.title}\n描述：${topicInfo.description}\n目标：${topicInfo.objectives}`
      }
    ],
    temperature: 0.7,
    max_tokens: 2048,
  });

  return response.choices[0]?.message?.content || '';
}
```

### Vue CodeMirror with Auto-Save Debounce

```typescript
// Source: https://context7.com/surmon-china/vue-codemirror/llms.txt [VERIFIED: Context7]
import { ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';  // Optional: or custom debounce

const content = ref<string>('');
const saving = ref(false);

// Debounced save (500ms)
const debouncedSave = useDebounceFn(async (value: string) => {
  saving.value = true;
  try {
    await updateDocumentApi(documentId, { content: value });
  } finally {
    saving.value = false;
  }
}, 500);

// Watch for changes
watch(content, (newContent) => {
  debouncedSave(newContent);
});
```

### Document Routes Pattern

```typescript
// documents.routes.ts - follows existing projects.routes.ts pattern
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { prisma } from '../index.js';

const router = Router();

// GET /api/documents/:projectId - fetch all documents for a project
router.get('/:projectId', authMiddleware, async (req: Request, res: Response) => {
  const projectId = parseInt(req.params.projectId);
  
  // IDOR check: verify user owns the project
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId: req.user!.userId }
  });
  
  if (!project) {
    return res.status(404).json({ error: '项目不存在' });
  }
  
  const documents = await prisma.document.findMany({
    where: { projectId }
  });
  
  res.json({ documents });
});

// PUT /api/documents/:id - update document content (D-12: real-time save)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  const { content } = req.body;
  const documentId = parseInt(req.params.id);
  
  // Verify ownership via project relation
  const document = await prisma.document.findFirst({
    where: { id: documentId },
    include: { project: true }
  });
  
  if (!document || document.project.userId !== req.user!.userId) {
    return res.status(404).json({ error: '文档不存在' });
  }
  
  const updated = await prisma.document.update({
    where: { id: documentId },
    data: { content }
  });
  
  res.json({ document: updated });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom AI API client | OpenAI SDK with baseURL | MiniMax OpenAI-compatibility announced | Simplified integration; standard SDK |
| textarea for Markdown | CodeMirror 6 (vue-codemirror) | CodeMirror 6 release (2022) | Better UX: syntax highlighting, undo, extensions |
| Documents in JSON field | Dedicated Document table | Prisma best practices | Query flexibility; proper relations; size limits |

**Deprecated/outdated:**
- CodeMirror 5: Use CodeMirror 6 via vue-codemirror
- Raw fetch() to MiniMax: Use OpenAI SDK which handles edge cases

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | School's MiniMax deployment uses standard `/v1/chat/completions` endpoint | MiniMax Integration | Need to verify actual endpoint with school IT; may be `/v1/text/chatcompletion_v2` |
| A2 | MiniMax API key provided via environment variable | Environment | If school uses different auth method, need to adjust ai.service.ts |
| A3 | MySQL TEXT (64KB) sufficient for document content | Document Schema | If documents exceed 64KB, migrate to LONGTEXT |

**If this table has entries:** Some claims need user confirmation before execution — specifically MiniMax deployment details (endpoint, auth).

## Open Questions (RESOLVED)

1. **What is the actual MiniMax API endpoint provided by the school?** → RESOLVED
   - What we know: MiniMax public API uses `/v1/text/chatcompletion_v2` or `/v1/chat/completions`
   - What's unclear: School's self-deployed version may use different endpoint path
   - **Resolution:** Add configurable `MINIMAX_ENDPOINT` env var; default to `/v1/chat/completions`. Executor will configure via backend/.env based on school IT deployment details.

2. **Should existing projects (from Phase 2) get empty Document records created?** → RESOLVED
   - What we know: D-11 says each project has 3 documents
   - What's unclear: Phase 2 projects have `documentsRef: {}` placeholder
   - **Resolution:** Lazy creation on first access. When user visits ProjectDetail page and documents don't exist, backend creates empty Document records with default content.

3. **Real-time save vs manual save button preference?** → RESOLVED
   - What we know: D-12 says "实时保存" (real-time save)
   - What's unclear: Implementation detail (debounce interval, save indicator)
   - **Resolution:** 500ms debounce auto-save with "保存中..." status indicator; also provide manual save button for explicit user control.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Backend runtime | ✓ | v24.13.0 | — |
| npm | Package manager | ✓ | 11.6.2 | — |
| MySQL | Database | ✓ (assumed from Phase 1/2 completion) | — | — |
| MiniMax API | AI generation | ? (self-deployed by school) | — | Need school IT confirmation |

**Missing dependencies with no fallback:**
- MiniMax API access — planner must confirm with school IT deployment details before execution

**Missing dependencies with fallback:**
- None identified

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (backend vitest.config.ts, frontend vitest.config.ts) |
| Config file | backend/vitest.config.ts, frontend/vitest.config.ts |
| Quick run command (backend) | `cd backend && npm test` |
| Quick run command (frontend) | `cd frontend && npm test` |
| Full suite command | `npm test` (both directories) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DOC-01 | Generate PRD document | integration | `vitest run tests/document.test.ts` | ❌ Wave 0 |
| DOC-02 | Generate frontend document | integration | `vitest run tests/document.test.ts` | ❌ Wave 0 |
| DOC-03 | Generate backend document | integration | `vitest run tests/document.test.ts` | ❌ Wave 0 |
| DOC-04 | AI fills initial content from topic | integration | `vitest run tests/ai.test.ts` | ❌ Wave 0 |
| DOC-05 | Online edit and save | unit (frontend) | `vitest run src/__tests__/MarkdownEditor.test.ts` | ❌ Wave 0 |
| DOC-06 | View tech stack recommendation | unit | `vitest run tests/project.test.ts` | ✓ (existing placeholder) |
| DOC-07 | Modify tech stack | integration | `vitest run tests/project.test.ts` | ❌ Wave 0 |
| DOC-08 | No quota display (adjusted per D-04) | — | N/A (feature removed) | N/A |

### Sampling Rate
- **Per task commit:** `cd backend && npm test` (quick backend check)
- **Per wave merge:** `npm test` in both backend and frontend
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `backend/tests/document.test.ts` — covers DOC-01~03, DOC-05 backend save
- [ ] `backend/tests/ai.test.ts` — covers DOC-04 AI generation
- [ ] `frontend/src/__tests__/MarkdownEditor.test.ts` — covers DOC-05 frontend editor
- [ ] Document type definitions — `frontend/src/types/document.ts`
- [ ] Document API client — `frontend/src/api/document.api.ts`
- [ ] Document store — `frontend/src/stores/document.store.ts`

*(Wave 0 tests are placeholder skeletons; full test implementation during Wave 1)*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | yes (via authMiddleware) | JWT httpOnly cookie (Phase 1) |
| V3 Session Management | yes | 7-day JWT expiry (Phase 1) |
| V4 Access Control | yes | IDOR prevention in document routes (verify project.userId) |
| V5 Input Validation | yes | Zod/express-validator for docType enum, content length |
| V6 Cryptography | no | No encryption needed for document content |

### Known Threat Patterns for Node.js + Express + AI API

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| API key exposure in frontend | Information Disclosure | Keep MINIMAX_API_KEY in backend .env only; frontend calls backend routes |
| IDOR (access other user's documents) | Tampering | authMiddleware + projectId ownership check in every document route |
| XSS in Markdown content | Tampering | Sanitize output if rendering as HTML; CodeMirror handles raw Markdown safely |
| Prompt injection (user topic manipulation) | Tampering | System prompt isolation; escape user input; limit topic field lengths |
| Large content DoS (huge documents) | Denial of Service | Content length limit (e.g., 100KB max); rate limit on PUT /documents |

## Sources

### Primary (HIGH confidence)
- MiniMax API Documentation — `/llmstxt/platform_minimax_io_llms_txt` via Context7 — Chat completion API, OpenAI SDK compatibility
- Vue CodeMirror Documentation — `/surmon-china/vue-codemirror` via Context7 — Vue 3 integration, extensions setup
- npm registry — `npm view` commands — Package versions verified (openai 6.34.0, vue-codemirror 6.1.1, @codemirror/lang-markdown 6.5.0)

### Secondary (MEDIUM confidence)
- Existing project patterns — `backend/src/routes/*.routes.ts`, `frontend/src/stores/*.store.ts` — Established conventions

### Tertiary (LOW confidence)
- A1: MiniMax deployment endpoint — assumed standard endpoint; need school IT confirmation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — Versions verified via npm registry; MiniMax API verified via Context7 official docs
- Architecture: HIGH — Patterns follow existing project conventions; MiniMax integration verified in official docs
- Pitfalls: MEDIUM — Based on general Node.js/Express best practices; MiniMax-specific pitfalls partially assumed

**Research date:** 2026-04-18
**Valid until:** 30 days (MiniMax API stable; CodeMirror versions current)