---
phase: 2
slug: 选题管理与学生端
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-18
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (frontend) + jest (backend) |
| **Config file** | vitest.config.ts / jest.config.js |
| **Quick run command** | `npm run test -- --run` |
| **Full suite command** | `npm run test` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- --run`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | TOPIC-01, TOPIC-02, TOPIC-03 | T-02-01 | N/A | unit | `npm run test backend` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 1 | TOPIC-04, TOPIC-05 | T-02-02 | IDOR prevention on project create | unit | `npm run test backend` | ✅ | ⬜ pending |
| 02-03-01 | 03 | 2 | TOPIC-06, DASH-01 | — | N/A | unit | `npm run test frontend` | ✅ | ⬜ pending |
| 02-04-01 | 04 | 2 | DASH-02, DASH-03 | — | N/A | e2e | `npm run test:e2e` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/src/__tests__/setup.ts` — vitest setup with Vue Test Utils
- [ ] `backend/tests/topic.test.ts` — topic API unit tests
- [ ] `backend/tests/project.test.ts` — project API unit tests

*Existing infrastructure from Phase 1 covers auth tests.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| UI layout matching spec | D-16, D-18, D-19 | Visual verification | Review 选题池页面 table + sidebar filter layout |
| 自拟选题提交流程 | TOPIC-05 | E2E complexity | Walk through custom topic form submission |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending