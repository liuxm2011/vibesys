# Roadmap: VibeCoding 教学实践平台

**Created:** 2026-04-18
**Granularity:** Standard (5-8 phases)
**Mode:** YOLO

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|-------------------|
| 1 | 认证与用户基础 | 本地认证系统和用户数据模型 | AUTH-01~04 | 7 plans |
| 2 | 选题管理与学生端 | 学生可以选题并管理项目 | TOPIC-01~06, DASH-01~03 | 8 plans |
| 3 | 文档生成与AI服务 | AI辅助生成PRD和技术文档 | DOC-01~08 | 7 plans ✓ |
| 4 | 文档导出功能 | 完整文档包导出能力 | EXPORT-01~03 | 3 criteria ✓ |
| 5 | 管理后台 | 管理员完整后台功能 | ADM-01~07 | 4 criteria ✓ |
| 6 | 毕业设计双模式 | 毕业设计模块+模式选择拦截 | THESIS-01~06 | 15 commits ✓ |

**Total Phases:** 6
**Requirements Mapped:** 37/37 ✓
**All Phases:** Complete ✓

---

## Phase 1: 认证与用户基础

**Goal:** 建立本地认证系统和用户数据模型。用户通过学号登录平台，管理员可导入学生数据。

**Status:** ✓ Complete

### Requirements Covered

- AUTH-01: 本地认证登录（学号+密码）
- AUTH-02: 用户基本信息获取
- AUTH-03: 安全登出
- AUTH-04: 会话在浏览器刷新后保持有效

### Success Criteria

1. 用户可通过学号+密码成功登录并获取基本信息 ✓
2. 登出后会话完全清除 ✓
3. 刷新浏览器后无需重新登录 ✓
4. 默认管理员账号可用：admin / admin123 ✓

### Implementation Notes

- 本地认证替代SSO（D-01决策）
- bcrypt密码加密，JWT Token存储在httpOnly Cookie
- Pinia管理前端认证状态，Vue Router守卫保护路由

### Plans

**Plans:** 7 plans in 7 waves — ALL COMPLETE ✓

- [x] 01-00-PLAN.md — Wave 0: Database schema + Express setup ✓
- [x] 01-01-PLAN.md — Wave 1: Backend auth utilities + middleware ✓
- [x] 01-02-PLAN.md — Wave 2: Auth routes + admin seeding ✓
- [x] 01-03a-PLAN.md — Wave 3: Frontend scaffolding + API client ✓
- [x] 01-03b-PLAN.md — Wave 4: Pinia store + Login page ✓
- [x] 01-04-PLAN.md — Wave 5: Vue Router + navigation guards ✓
- [x] 01-05-PLAN.md — Wave 6: Dashboard page + logout ✓

**Verification:** `.planning/phases/01-认证与用户基础/01-VERIFICATION.md`

---

## Phase 2: 选题管理与学生端

**Goal:** 学生可以浏览选题池、选择选题创建项目、管理多个项目。系统支持公共选题池和自拟选题，项目可删除和文档编辑。

**Status:** ✓ Complete (8/8 plans)

### Requirements Covered

- TOPIC-01: 选题池列表浏览
- TOPIC-02: 领域分类展示
- TOPIC-03: 选题详情查看
- TOPIC-04: 选题锁定 → 创建项目 (D-06修正)
- TOPIC-05: 自拟选题提交
- TOPIC-06: 难度级别标记 — **Deferred per D-02**
- DASH-01: 项目列表查看
- DASH-02: 项目状态查看
- DASH-03: 已生成文档访问 — **Phase 3 full implementation**

### Success Criteria

1. 学生可浏览并筛选选题（按领域）
2. 选择选题后项目创建成功
3. 学生Dashboard正确展示当前项目状态
4. 自拟选题可成功提交并创建项目

### Implementation Notes

- 选题池数据表设计（含领域字段，无难度）
- 项目状态枚举（未开始/进行中/已完成）
- 学生端基础页面框架（表格+侧边筛选）
- 同一选题可多次选择（D-07）
- 学生最多10个项目（D-08）

### Plans

**Plans:** 8 plans in 8 waves — ALL COMPLETE ✓

- [x] 02-00-PLAN.md — Wave 0: Database schema extension (Topic, Project models + enums) ✓
- [x] 02-01-PLAN.md — Wave 1: Backend topics routes (list, detail, custom) ✓
- [x] 02-02-PLAN.md — Wave 2: Backend projects routes (create, list, delete) ✓
- [x] 02-03-PLAN.md — Wave 3: Frontend topic store + API client ✓
- [x] 02-04-PLAN.md — Wave 4: Frontend project store + API client ✓
- [x] 02-05-PLAN.md — Wave 5: TopicPool.vue page (table + sidebar filter) ✓
- [x] 02-06-PLAN.md — Wave 6: Dashboard.vue project list ✓
- [x] 02-07-PLAN.md — Wave 7: Router update + navigation integration ✓

**Context:** `.planning/phases/02-选题管理与学生端/02-CONTEXT.md`
**Research:** `.planning/phases/02-选题管理与学生端/02-RESEARCH.md`
**UI-Spec:** `.planning/phases/02-选题管理与学生端/02-UI-SPEC.md`

---

## Phase 3: 文档生成与AI服务

**Goal:** AI辅助生成PRD、前端文档、后端文档，学生可在线编辑。系统调用自部署MiniMax API生成文档内容，支持软件工程和大数据两个领域的差异化模板。

**Status:** ✓ Complete

**UI hint:** yes

### Requirements Covered

- DOC-01: PRD文档生成
- DOC-02: 前端文档生成
- DOC-03: 后端文档生成
- DOC-04: AI根据选题内容填充文档初始内容
- DOC-05: 学生可在线编辑修改文档内容
- DOC-06: 学生可查看技术栈推荐方案
- DOC-07: 学生可修改技术栈选择
- DOC-08: API配额提示 — **Adjusted per D-04: Removed (self-deployed, no quota)**

### Success Criteria

1. 点击生成按钮可正确调用MiniMax API生成文档内容
2. 生成的PRD包含项目概述、功能需求、技术建议、验收标准等章节（SE/BD差异化）
3. 技术栈推荐从选题获取，学生可在项目详情页修改选择
4. 文档在线编辑界面响应流畅（500ms自动保存）
5. ~~API配额提示正确显示剩余次数~~ — Removed per D-04

### Implementation Notes

- 使用学校自部署MiniMax模型API（D-01），通过OpenAI SDK with baseURL调用
- 独立AI服务模块设计（D-02），便于未来扩展替换模型
- 无API调用成本限制（D-03），自部署服务无需配额控制
- Prompt模板设计（软件工程/大数据领域特定 - D-08/09）
- vue-codemirror Markdown编辑器集成（DOC-05）
- Document表存储文档内容（D-10~13），关联Project
- 每个Project对应3个Document记录（PRD + FRONTEND + BACKEND）

### Plans

**Plans:** 7 plans in 6 waves — ALL COMPLETE ✓

- [x] 03-00-PLAN.md — Wave 0: Prisma schema extension (Document model + DocType enum) ✓
- [x] 03-01-PLAN.md — Wave 1: Backend AI service + prompt templates ✓
- [x] 03-02-PLAN.md — Wave 1: Backend document CRUD routes (parallel with 01) ✓
- [x] 03-03-PLAN.md — Wave 2: Frontend types + API clients + document store ✓
- [x] 03-04-PLAN.md — Wave 3: UI components (MarkdownEditor, TechStackPanel, DocumentTabs) ✓
- [x] 03-05-PLAN.md — Wave 4: ProjectDetail page integration + router ✓
- [x] 03-06-PLAN.md — Wave 5: Human verification checkpoint ✓

**Context:** `.planning/phases/03-文档生成与AI服务/03-CONTEXT.md`
**Research:** `.planning/phases/03-文档生成与AI服务/03-RESEARCH.md`
**Validation:** `.planning/phases/03-文档生成与AI服务/03-VALIDATION.md`

---

## Phase 4: 文档导出功能

**Goal:** 学生可导出完整文档包用于外部AI工具

**Status:** ✓ Complete

### Requirements Covered

- EXPORT-01: 文档包导出
- EXPORT-02: 包含所有文档类型
- EXPORT-03: 文件命名规范

### Success Criteria

1. 导出按钮生成包含PRD、前端、后端文档的压缩包 ✓
2. 文件格式为Markdown，命名包含项目名和日期 ✓
3. 导出过程流畅无阻塞 ✓

### Implementation Notes

- 前端 JSZip 打包所有文档内容为 ZIP
- 文件名格式：`{项目名}_{YYYY-MM-DD}.zip`
- 导出按钮在 ProjectDetail 页面顶部操作栏
- 空文档自动过滤，生成内容直接打包

---

## Phase 5: 管理后台

**Goal:** 管理员完整后台管理功能

**Status:** ✓ Complete

**UI hint:** yes

### Requirements Covered

- ADM-01: 用户列表查看
- ADM-02: 选题池管理
- ADM-03: 使用统计
- ADM-04: 公告配置
- ADM-05: 使用指南配置
- ADM-06: 用户封禁/解封
- ADM-07: API调用统计

### Success Criteria

1. 管理员可完整管理选题池（增删改） ✓
2. 用户列表展示关键信息（姓名、学号、项目数） ✓
3. 使用统计仪表板展示关键指标 ✓
4. 平台公告和指南可正确配置和展示 ✓

### Implementation Notes

- 管理后台独立路由 `/admin/*` 和权限验证中间件
- AdminLayout 提供侧边导航布局
- UserManagement：用户列表、封禁/解封操作
- TopicManagement：选题池增删改查、领域分类
- Statistics：使用统计仪表板
- SystemConfig：公告和使用指南配置
- admin.routes.ts 提供 30+ 管理接口

---

## Phase 6: 毕业设计双模式

**Goal:** 登录后拦截页让学生选择"项目设计"或"毕业设计"模式；毕业设计模块提供排他性题目选择、项目信息记录；管理员新增毕业设计管理界面。

**Status:** ✓ Complete (2026-05-24, 15 commits)

### Requirements Covered

- THESIS-01: 登录后模式选择拦截（`/mode-select`）
- THESIS-02: 毕业设计题目池浏览（分类筛选+关键词搜索）
- THESIS-03: 排他性选题（一人一题，D1 native batch 原子性）
- THESIS-04: 放弃选题（返还题库）
- THESIS-05: 记录仓库地址和部署地址
- THESIS-06: 管理员毕业设计管理（题目概况 + 学生选题情况）

### Success Criteria

1. 学生登录后被 `/mode-select` 拦截，选择模式后不再拦截 ✓
2. 选题后题目对其他学生显示为已锁定 ✓
3. 并发选题不会导致同一题目被多人选中 ✓
4. 管理员可查看所有题目状态和学生选题列表 ✓

### Implementation Notes

- **AppMode 持久化**：`sessionStorage` + Pinia store，刷新不丢失，关闭标签页重置
- **排他性原子操作**：`UPDATE ThesisTopic WHERE isLocked=0` + `INSERT ThesisProject` 在同一 D1 batch，0 changes = 已被选走
- **UNIQUE 双保险**：`ThesisProject.userId UNIQUE` + `ThesisProject.topicId UNIQUE`
- **管理后台重构**：AdminLayout 侧边栏分"项目设计管理"和"毕业设计管理"两组
- **题目数据**：根目录 `毕业设计数据集信息.json` → `npm run import:thesis` 生成 SQL → 执行到 D1

### New Files

| 文件 | 说明 |
|------|------|
| `backend/src/routes/thesis.routes.ts` | 学生端毕业设计路由 |
| `backend/src/scripts/import-thesis-topics.ts` | 题目数据导入脚本 |
| `frontend/src/stores/appMode.store.ts` | 模式状态 Pinia store |
| `frontend/src/types/thesis.ts` | ThesisTopic / ThesisProject 类型 |
| `frontend/src/api/thesis.api.ts` | 毕业设计 API 客户端 |
| `frontend/src/views/ModeSelect.vue` | 模式选择拦截页 |
| `frontend/src/views/graduation/GraduationDashboard.vue` | 毕业设计主页 |
| `frontend/src/views/graduation/GraduationTopicPool.vue` | 题目池页面 |
| `frontend/src/views/admin/GraduationManagement.vue` | 管理员毕业设计页 |

---

## Dependency Graph

```
Phase 1 (认证基础) ✓
    │
    ├──────────────────┐
    │                  │
    ▼                  ▼
Phase 2          Phase 3
(选题管理) ✓     (文档生成) ✓
    │                  │
    │                  │
    ▼                  ▼
    │            Phase 4 (导出) ✓
    │                  │
    └──────────────────┘
              │
              ▼
        Phase 5 (管理后台) ✓
              │
              ▼
        Phase 6 (毕业设计双模式) ✓
```

---

## Next Step

**All 6 phases complete.** Project is live on Cloudflare Workers + D1.

---

*Roadmap updated: 2026-05-24 - Phase 6 (毕业设计双模式) complete*