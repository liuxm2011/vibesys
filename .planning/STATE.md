# STATE.md: VibeCoding 教学实践平台

**Updated:** 2026-04-20
**Status:** All Phases Complete

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-18)

**Core value:** 学生能够将模糊的想法转化为结构化文档，并利用AI工具高效完成软件开发
**Current focus:** All phases complete — ready for deployment

## Roadmap Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1 | ✓ Complete | 100% |
| 2 | ✓ Complete | 100% |
| 3 | ✓ Complete | 100% |
| 4 | ✓ Complete | 100% |
| 5 | ✓ Complete | 100% |

## Completed Phases

**Phase 1: 认证与用户基础 — Complete**

- Status: Complete (7 plans executed)
- Goal: 建立本地认证系统和用户数据模型（学号登录，管理员导入）
- Requirements: AUTH-01~04 (全部验证通过)
- Success Criteria: 4 criteria verified
- Verification: `.planning/phases/01-认证与用户基础/01-VERIFICATION.md`

### Wave Summary

| Wave | Plan | Status | Commit |
|------|------|--------|--------|
| 0 | 01-00 | ✓ | 93a0e4c |
| 1 | 01-01 | ✓ | c3b305d |
| 2 | 01-02 | ✓ | 959b208 |
| 3 | 01-03a | ✓ | b51d1c4 |
| 4 | 01-03b | ✓ | f7c07aa |
| 5 | 01-04 | ✓ | 2df2a16 |
| 6 | 01-05 | ✓ | 3419daa |

**Phase 2: 选题管理与学生端 — Complete**

- Status: Complete (8 plans executed)
- Goal: 学生可以浏览选题池、选择选题创建项目、管理多个项目
- Requirements: TOPIC-01~06, DASH-01~03 (TOPIC-06 deferred per D-02)
- Success Criteria: 4 criteria verified
- Context: `.planning/phases/02-选题管理与学生端/02-CONTEXT.md`

### Key Decisions from Discussion

1. 不是"锁定选题"而是"创建项目" — D-06
2. 同一选题可被多次选择 — D-07
3. 学生最多创建10个项目 — D-08
4. 项目可删除，状态可更新 — D-09, D-10
5. 自拟选题仅自己可用 — D-14
6. 选题池：表格列表+侧边筛选栏 — D-16
7. 项目列表嵌入Dashboard — D-18

### Wave Summary

| Wave | Plan | Objective | Status | Commit |
|------|------|-----------|--------|--------|
| 0 | 02-00 | Database schema extension | ✓ | ca4db55 |
| 1 | 02-01 | Backend topics routes | ✓ | 13ea2bb, 9e24848, 86b9768, 469f4ae, 825f38a |
| 2 | 02-02 | Backend projects routes | ✓ | ffef577 |
| 3 | 02-03 | Frontend topic store + API | ✓ | bea713a |
| 4 | 02-04 | Frontend project store + API | ✓ | a91f006, 372e4f3, 8aabf15 |
| 5 | 02-05 | TopicPool.vue page | ✓ | f0b3fe1, d56d461, b2acff1 |
| 6 | 02-06 | Dashboard project list | ✓ | 9c7d013 |
| 7 | 02-07 | Router + navigation | ✓ | 8ed49f1 |

**Phase 3: 文档生成与AI服务 — Complete**

- Status: Complete (7 plans executed)
- Goal: AI辅助生成PRD、前端文档、后端文档，学生可在线编辑
- Requirements: DOC-01~08 (DOC-08 adjusted per D-04: removed配额)
- Success Criteria: 5 criteria verified

### Key Features
- AI 服务模块（MiniMax API，通过 OpenAI SDK 调用）
- Prompt 模板（软件工程/大数据领域差异化）
- Document CRUD 接口
- Markdown 编辑器（vue-codemirror），500ms 自动保存
- DocumentTabs 组件（PRD / FRONTEND / BACKEND 切换）
- TechStackPanel（技术栈推荐与修改）
- ProjectDetail 页面集成

### Wave Summary

| Wave | Plan | Objective | Status | Commit |
|------|------|-----------|--------|--------|
| 0 | 03-00 | Prisma schema extension (Document model) | ✓ | — |
| 1 | 03-01 | Backend AI service + prompt templates | ✓ | — |
| 1 | 03-02 | Backend document CRUD routes | ✓ | — |
| 2 | 03-03 | Frontend types + API + store | ✓ | — |
| 3 | 03-04 | UI components (MarkdownEditor, TechStackPanel, DocumentTabs) | ✓ | — |
| 4 | 03-05 | ProjectDetail page + router integration | ✓ | — |
| 5 | 03-06 | Human verification checkpoint | ✓ | — |

**Phase 4: 文档导出功能 — Complete**

- Status: Complete
- Goal: 学生可导出完整文档包用于外部AI工具
- Requirements: EXPORT-01~03 (全部实现)
- Success Criteria: 3 criteria verified

### Key Features
- 前端 JSZip 打包导出 ZIP
- 文件名包含项目名+日期
- 全部7份文档（含AI生成+自定义文档）导出为 Markdown

**Phase 5: 管理后台 — Complete**

- Status: Complete
- Goal: 管理员完整后台功能
- Requirements: ADM-01~07 (全部实现)
- Success Criteria: 4 criteria verified

### Key Features
- AdminLayout（管理后台布局）
- UserManagement（用户列表、封禁/解封）
- TopicManagement（选题池增删改）
- Statistics（使用统计仪表板）
- SystemConfig（公告和指南配置）
- Admin 路由 + 权限中间件

## Session Memory

### What We Know

- Platform: 学生自主创作平台（软件工程/大数据）
- Roles: 学生 + 管理员（无教师角色）
- AI Integration: 学校自部署MiniMax模型API（D-01 Phase 3）
- Auth: 本地认证（学号+密码），替代学校SSO（D-01）
- Deploy: 公有云（阿里云/腾讯云）

### Key Decisions Made

1. 本地认证替代SSO — 简化实现（Phase 1 D-01）
2. 学号作为登录账号，初始密码=学号（Phase 1 D-02）
3. bcrypt密码加密，JWT 7天有效期，httpOnly Cookie（Phase 1 D-09, D-11, D-12）
4. 默认管理员：admin / admin123（Phase 1 D-15, D-16）
5. Pinia管理前端认证状态（Phase 1 D-18）
6. Vue Router守卫保护路由（Phase 1 D-19）
7. 选题无难度级别标记（Phase 2 D-02）
8. 项目=选题实例，非锁定（Phase 2 D-06）
9. 使用MiniMax API替代Claude/OpenAI（Phase 3 D-01）
10. 无API配额限制（Phase 3 D-03, D-04）
11. SE/BD领域差异化模板（Phase 3 D-08, D-09）
12. Document表存储文档，每项目3个文档（Phase 3 D-10~13）

### Active Context

- Tech stack: Vue 3 + Node.js + MySQL (backend), Vue 3 + Element Plus + Pinia (frontend)
- Architecture: 前后端分离，JWT认证，httpOnly Cookie
- Build order: 认证 → 选题 → 文档 → 导出 → 后台
- MiniMax API: OpenAI SDK with custom baseURL (backend/src/services/ai.service.ts)

---

## Next Action

All 5 phases complete. Ready for deployment or further iterations.

*State updated: 2026-04-20 - All phases complete*
