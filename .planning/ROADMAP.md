# Roadmap: VibeCoding 教学实践平台

**Created:** 2026-04-18
**Granularity:** Standard (5-8 phases)
**Mode:** YOLO

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|-------------------|
| 1 | 认证与用户基础 | 本地认证系统和用户数据模型 | AUTH-01~04 | 7 plans |
| 2 | 选题管理与学生端 | 学生可以选题并管理项目 | TOPIC-01~06, DASH-01~03 | 8 plans |
| 3 | 文档生成与AI服务 | AI辅助生成PRD和技术文档 | DOC-01~08 | 5 criteria |
| 4 | 文档导出功能 | 完整文档包导出能力 | EXPORT-01~03 | 3 criteria |
| 5 | 管理后台 | 管理员完整后台功能 | ADM-01~07 | 4 criteria |

**Total Phases:** 5
**Requirements Mapped:** 31/31 ✓

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

**Goal:** AI辅助生成PRD、前端文档、后端文档，学生可在线编辑

**UI hint:** yes

### Requirements Covered

- DOC-01: PRD文档生成
- DOC-02: 前端文档生成
- DOC-03: 后端文档生成
- DOC-04: AI内容填充
- DOC-05: 在线编辑
- DOC-06: 技术栈推荐
- DOC-07: 技术栈修改
- DOC-08: API配额提示

### Success Criteria

1. 点击生成按钮可正确调用AI API生成文档内容
2. 生成的PRD包含项目概述、功能需求、技术建议等章节
3. 技术栈推荐根据选题智能生成，学生可修改选择
4. 文档在线编辑界面响应流畅
5. API配额提示正确显示剩余次数

### Implementation Notes

- AI服务模块设计（Claude/OpenAI API调用）
- Redis存储API调用计数
- Prompt模板设计（软件工程/大数据领域特定）
- Markdown编辑器集成
- **Pitfall Prevention:** 设置用户每日API限额，监控成本

---

## Phase 4: 文档导出功能

**Goal:** 学生可导出完整文档包用于外部AI工具

### Requirements Covered

- EXPORT-01: 文档包导出
- EXPORT-02: 包含所有文档类型
- EXPORT-03: 文件命名规范

### Success Criteria

1. 导出按钮生成包含PRD、前端、后端文档的压缩包
2. 文件格式为Markdown，命名包含项目名和日期
3. 导出过程流畅无阻塞

### Implementation Notes

- 文件打包服务
- OSS临时存储或直接流式下载
- 文件命名规范实现

---

## Phase 5: 管理后台

**Goal:** 管理员完整后台管理功能

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

1. 管理员可完整管理选题池（增删改）
2. 用户列表展示关键信息（姓名、学号、项目数）
3. 使用统计仪表板展示关键指标
4. 平台公告和指南可正确配置和展示

### Implementation Notes

- 管理后台独立路由和权限验证
- 统计数据聚合查询设计
- 公告和指南存储方案

---

## Dependency Graph

```
Phase 1 (认证基础) ✓
    │
    ├──────────────────┐
    │                  │
    ▼                  ▼
Phase 2          Phase 3
(选题管理)       (文档生成)
    │                  │
    │                  │
    ▼                  ▼
    │            Phase 4 (导出)
    │                  │
    └──────────────────┘
              │
              ▼
        Phase 5 (管理后台)
```

---

## Next Step

**Phase 3: 文档生成与AI服务** — Ready for planning

```
/gsd-discuss-phase 3 — 收集上下文，澄清方案（推荐）
/gsd-plan-phase 3 — 直接创建执行计划
```

---

*Roadmap updated: 2026-04-18*
*Phase 2 complete: 8/8 plans executed, verified*