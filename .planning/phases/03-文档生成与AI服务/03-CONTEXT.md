# Phase 3: 文档生成与AI服务 - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

AI辅助生成PRD、前端文档、后端文档，学生可在线编辑。系统调用自部署MiniMax API生成文档内容，支持软件工程和大数据两个领域的差异化模板。包含文档存储、编辑器、技术栈推荐展示功能。

</domain>

<decisions>
## Implementation Decisions

### AI服务商
- **D-01:** 使用学校自部署的MiniMax模型API（非外部Claude/OpenAI）
- **D-02:** 独立AI服务模块设计，便于未来扩展替换模型
- **D-03:** 无API调用成本限制，自部署服务无需配额控制
- **D-04:** 不显示API配额提示（DOC-08调整），简化用户体验

### 文档模板结构
- **D-05:** PRD标准结构：项目概述、功能需求(核心)、技术建议、验收标准
- **D-06:** 前端文档结构：组件结构、状态管理、路由设计、样式方案
- **D-07:** 后端文档结构：API设计、数据库设计、中间件配置、部署说明
- **D-08:** 软件工程(SE)和大数据(BD)领域使用差异化模板
- **D-09:** SE模板侧重功能流程和交互设计；BD模板侧重数据Pipeline和分析模型

### 文档存储方案
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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements
- `.planning/ROADMAP.md` — Phase 3 goal and success criteria (DOC-01~08)
- `.planning/REQUIREMENTS.md` — DOC-01~08 requirements spec

### Prior Phases
- `.planning/phases/01-认证与用户基础/01-CONTEXT.md` — Auth patterns, User model
- `.planning/phases/02-选题管理与学生端/02-CONTEXT.md` — Project model, documentsRef placeholder (D-11), Domain enum

No external specs — requirements are fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `backend/prisma/schema.prisma` — Project model with documentsRef (Json?) placeholder, Domain enum (SE/BD)
- `backend/src/routes/projects.routes.ts` — Express router pattern, authMiddleware usage
- `backend/src/middleware/auth.middleware.ts` — JWT authentication for route protection
- `frontend/src/views/Dashboard.vue` — handleProjectClick placeholder for Phase 3
- `frontend/src/stores/project.store.ts` — Pinia store pattern for state management
- `frontend/src/api/*.api.ts` — API client pattern with credentials: 'include'

### Established Patterns
- Prisma model: id, createdAt, updatedAt, @@index for query fields
- Express route: Router → authMiddleware → Prisma query → res.json/error
- Pinia store: defineStore with ref state, async actions
- Vue component: script setup + template + Element Plus components

### Integration Points
- Project.documentsRef: Phase 2 placeholder, Phase 3 should migrate content to new Document table
- Dashboard.vue: handleProjectClick should navigate to project detail page (文档编辑界面)
- Router: 新增 /projects/:id 路由指向项目详情页
- 新建 ai.routes.ts 或 ai.service.ts 处理MiniMax API调用

</code_context>

<specifics>
## Specific Ideas

- 自部署MiniMax模型简化成本控制，无需Redis配额计数
- 领域差异化模板让AI生成更贴合软件工程/大数据项目特点
- 独立Document表便于未来扩展版本历史功能

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 03-文档生成与AI服务*
*Context gathered: 2026-04-18*