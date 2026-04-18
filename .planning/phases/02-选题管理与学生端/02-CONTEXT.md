# Phase 2: 选题管理与学生端 - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

学生可以浏览选题池、选择选题创建项目、管理多个项目。系统支持公共选题池和自拟选题，项目可删除和文档编辑。不涉及选题锁定或限制。

</domain>

<decisions>
## Implementation Decisions

### Topic Data Model
- **D-01:** 选题表字段：标题、描述、背景、目标、领域（软件工程/大数据）、技术栈建议(JSON数组)
- **D-02:** 无难度级别标记 — 学生自行判断复杂度
- **D-03:** 领域分类仅两类：软件工程(SE)、大数据(BD) — 与PRD定义一致
- **D-04:** 技术栈建议存储为JSON数组 — 支持多个技术栈选项供学生选择
- **D-05:** 选题类型字段：SYSTEM(系统预设) / CUSTOM(学生自拟)

### Project Model (原"选题锁定")
- **D-06:** 不是"锁定选题"，而是"创建项目" — 选择选题即创建一个新项目实例
- **D-07:** 同一选题可被多次选择 — 不同学生或同一学生可多次创建同题项目
- **D-08:** 学生最多创建10个项目（可配置上限）
- **D-09:** 项目可删除 — 删除不影响选题池中的原始选题
- **D-10:** 项目状态：NOT_STARTED(未开始) / IN_PROGRESS(进行中) / COMPLETED(已完成)
- **D-11:** 项目关联学生(User) + 选题(Topic)，存储创建时间、状态、已生成文档引用

### Custom Topic Submission
- **D-12:** 自拟选题字段：标题+描述+背景+目标+领域 — 与系统选题结构一致
- **D-13:** 自拟选题无需审核 — 学生提交即生效
- **D-14:** 自拟选题仅自己可用 — 不加入公共选题池
- **D-15:** 自拟选题创建类型标记为CUSTOM，仅创建者可见

### UI Layout & Navigation
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/ROADMAP.md` — Phase 2 goal and success criteria
- `.planning/REQUIREMENTS.md` — TOPIC-01~06, DASH-01~03 requirements

### Prior Phase
- `.planning/phases/01-认证与用户基础/01-CONTEXT.md` — Auth patterns, User model, Router structure

No external specs — requirements are fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/prisma/schema.prisma` — User model with Role enum (STUDENT/ADMIN), Status enum (ACTIVE/BANNED)
- `backend/src/routes/auth.routes.ts` — Express router pattern with Prisma queries
- `backend/src/middleware/auth.middleware.ts` — JWT authentication middleware
- `frontend/src/stores/auth.store.ts` — Pinia store pattern (state + actions + computed)
- `frontend/src/api/auth.api.ts` — API client pattern using `api` wrapper
- `frontend/src/utils/request.ts` — HTTP request utility with credentials: 'include'
- `frontend/src/router/index.ts` — Vue Router with meta: { requiresAuth }
- `frontend/src/views/Dashboard.vue` — Existing dashboard with user info card + "我的项目" placeholder

### Established Patterns
- Prisma model: id, createdAt, updatedAt, @@index for query fields
- Express route: Router → middleware → Prisma query → res.json/error
- Pinia store: defineStore with ref state, computed getters, async actions
- Vue component: script setup + template + scoped style
- Element Plus: el-card, el-table, el-button, el-form, el-message

### Integration Points
- User model: 可扩展关联 Project (projects relation)
- Router: 添加 /topics 路由（学生端选题池）
- Dashboard.vue: 替换 projects-card 占位为真实项目列表
- auth.store.ts: isAdmin 判断可用于区分学生/管理员功能

</code_context>

<specifics>
## Specific Ideas

- "这不是考试平台，所有学生所有选题都可无限制选择" — 同题可多次做
- "每个选题就是一个项目，项目内有 vibecoding 需要的各种文档" — 项目=选题实例
- "学生可开启第二个项目" — 多项目支持，上限10个
- 自拟选题仅自己可用 — 个人定制题目，不污染公共池

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-选题管理与学生端*
*Context gathered: 2026-04-18*