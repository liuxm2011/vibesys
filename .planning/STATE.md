# STATE.md: VibeCoding 教学实践平台

**Updated:** 2026-04-18
**Status:** Initialized

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-18)

**Core value:** 学生能够将模糊的想法转化为结构化文档，并利用AI工具高效完成软件开发
**Current focus:** Phase 1 — 认证与用户基础

## Roadmap Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1 | ○ Pending | 0% |
| 2 | ○ Pending | 0% |
| 3 | ○ Pending | 0% |
| 4 | ○ Pending | 0% |
| 5 | ○ Pending | 0% |

## Current Phase

**Phase 1: 认证与用户基础**

- Status: Not Started
- Goal: 建立学校SSO认证集成和基础用户数据模型
- Requirements: AUTH-01, AUTH-02, AUTH-03, AUTH-04
- Success Criteria: 3 criteria defined

## Session Memory

### What We Know

- Platform: 学生自主创作平台（软件工程/大数据）
- Roles: 学生 + 管理员（无教师角色）
- AI Integration: 调用外部Claude/OpenAI API
- Auth: 学校统一SSO认证
- Deploy: 公有云（阿里云/腾讯云）

### Key Decisions Made

1. 无教师角色 — 学生自主创作
2. AI辅助生成而非全自动 — 学生参与编辑
3. 技术栈可修改 — 给学生选择空间
4. API限额机制 — 成本控制

### Active Context

- Tech stack: Vue 3 + Node.js + MySQL
- Architecture: 前后端分离，JWT认证
- Build order: 认证 → 选题 → 文档 → 导出 → 后台

---

*State initialized: 2026-04-18*