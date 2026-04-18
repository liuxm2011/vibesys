# STATE.md: VibeCoding 教学实践平台

**Updated:** 2026-04-18
**Status:** Phase 1 Planned

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-18)

**Core value:** 学生能够将模糊的想法转化为结构化文档，并利用AI工具高效完成软件开发
**Current focus:** Phase 1 — 认证与用户基础 (Ready for execution)

## Roadmap Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1 | ● Planned | 20% |
| 2 | ○ Pending | 0% |
| 3 | ○ Pending | 0% |
| 4 | ○ Pending | 0% |
| 5 | ○ Pending | 0% |

## Current Phase

**Phase 1: 认证与用户基础**

- Status: Planned (6 plans created)
- Goal: 建立本地认证系统和用户数据模型（学号登录，管理员导入）
- Requirements: AUTH-01~04 (本地认证实现)
- Success Criteria: 4 criteria defined
- Plans: `.planning/phases/01-认证与用户基础/01-*-PLAN.md`

### Wave Structure

| Wave | Plans | Description |
|------|-------|-------------|
| 0 | 01-00 | Database schema + Express setup |
| 1 | 01-01, 01-02 | Backend auth utilities + routes |
| 2 | 01-03, 01-04 | Frontend login + router guards |
| 3 | 01-05 | Dashboard page + logout |

## Session Memory

### What We Know

- Platform: 学生自主创作平台（软件工程/大数据）
- Roles: 学生 + 管理员（无教师角色）
- AI Integration: 调用外部Claude/OpenAI API
- Auth: 本地认证（学号+密码），替代学校SSO（D-01）
- Deploy: 公有云（阿里云/腾讯云）

### Key Decisions Made

1. 本地认证替代SSO — 简化实现（D-01）
2. 学号作为登录账号，初始密码=学号（D-02）
3. bcrypt密码加密，JWT 7天有效期，httpOnly Cookie（D-09, D-11, D-12）
4. 默认管理员：admin / admin123（D-15, D-16）
5. Pinia管理前端认证状态（D-18）
6. Vue Router守卫保护路由（D-19）

### Active Context

- Tech stack: Vue 3 + Node.js + MySQL (backend), Vue 3 + Element Plus + Pinia (frontend)
- Architecture: 前后端分离，JWT认证，httpOnly Cookie
- Build order: 认证 → 选题 → 文档 → 导出 → 后台

---

*State updated: 2026-04-18 - Phase 1 plans created*