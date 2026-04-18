# STATE.md: VibeCoding 教学实践平台

**Updated:** 2026-04-18
**Status:** Phase 2 In Progress

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-18)

**Core value:** 学生能够将模糊的想法转化为结构化文档，并利用AI工具高效完成软件开发
**Current focus:** Phase 2 — 选题管理与学生端 (Plans created, ready for execution)

## Roadmap Progress

| Phase | Status | Progress |
|-------|--------|----------|
| 1 | ✓ Complete | 100% |
| 2 | ● In Progress | 50% |
| 3 | ○ Pending | 0% |
| 4 | ○ Pending | 0% |
| 5 | ○ Pending | 0% |

## Current Phase

**Phase 2: 选题管理与学生端 — Plans Created**

- Status: 8 plans created, ready for execution
- Goal: 学生可以浏览选题池、选择选题创建项目、管理多个项目
- Requirements: TOPIC-01~06, DASH-01~03 (TOPIC-06 deferred per D-02)
- Context: `.planning/phases/02-选题管理与学生端/02-CONTEXT.md`

### Key Decisions from Discussion

1. 不是"锁定选题"而是"创建项目" — D-06
2. 同一选题可被多次选择 — D-07
3. 学生最多创建10个项目 — D-08
4. 项目可删除，状态可更新 — D-09, D-10
5. 自拟选题仅自己可用 — D-14
6. 选题池：表格列表+侧边筛选栏 — D-16
7. 项目列表嵌入Dashboard — D-18

### Wave Structure

| Wave | Plan | Objective | Autonomous |
|------|------|-----------|------------|
| 0 | 02-00 | Database schema extension | ✓ done |
| 1 | 02-01 | Backend topics routes | ✓ done |
| 2 | 02-02 | Backend projects routes | ✓ done |
| 3 | 02-03 | Frontend topic store + API | yes |
| 4 | 02-04 | Frontend project store + API | yes |
| 5 | 02-05 | TopicPool.vue page | yes |
| 6 | 02-06 | Dashboard project list | yes |
| 7 | 02-07 | Router + navigation | yes |

**Note:** Waves 1 and 2 can run in parallel (both depend only on Wave 0).

### Wave Progress

| Wave | Plan | Status | Commit |
|------|------|--------|--------|
| 0 | 02-00 | ✓ | ca4db55 |
| 1 | 02-01 | ✓ | 13ea2bb, 9e24848, 86b9768, 469f4ae, 825f38a |
| 2 | 02-02 | ✓ | ffef577 |

---

## Completed Phase

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
7. 选题无难度级别标记（D-02）
8. 项目=选题实例，非锁定（D-06）

### Active Context

- Tech stack: Vue 3 + Node.js + MySQL (backend), Vue 3 + Element Plus + Pinia (frontend)
- Architecture: 前后端分离，JWT认证，httpOnly Cookie
- Build order: 认证 → 选题 → 文档 → 导出 → 后台

---

## Next Action

Continue Phase 2 Wave 3 (Frontend topic store + API):
```
/gsd-execute-phase 2 --wave 3
```

Or Wave 4 (Frontend project store + API):
```
/gsd-execute-phase 2 --wave 4
```

*State updated: 2026-04-18 - Wave 1 complete (topics routes)*