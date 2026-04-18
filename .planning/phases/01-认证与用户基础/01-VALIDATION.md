---
phase: 1
slug: 01-认证与用户基础
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-18
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (Vite-native, Vue 3 compatible) |
| **Config file** | vitest.config.ts (Wave 0 creates) |
| **Quick run command** | `vitest run --reporter=verbose` |
| **Full suite command** | `vitest run` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `vitest run --reporter=verbose`
- **After every plan wave:** Run `vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 00-01 | 00 | 0 | AUTH-02 | — | N/A (schema setup) | integration | `vitest run backend/tests/schema.test.ts` | ❌ W0 | ⬜ pending |
| 00-02 | 00 | 0 | AUTH-02 | — | N/A (env setup) | — | Manual: grep JWT_SECRET .env | ✅ | ⬜ pending |
| 00-03 | 00 | 0 | — | — | N/A | — | Manual: curl http://localhost:3000/health | ✅ | ⬜ pending |
| 01-01 | 01 | 1 | AUTH-02 | T-1-01 | bcrypt.compare constant-time, 10 rounds | unit | `vitest run backend/tests/password.test.ts` | ❌ W0 | ⬜ pending |
| 01-02 | 01 | 1 | AUTH-02 | T-1-02 | JWT signed with 256-bit secret, 7d expiry | unit | `vitest run backend/tests/jwt.test.ts` | ❌ W0 | ⬜ pending |
| 01-03 | 01 | 1 | AUTH-02 | T-1-03 | Cookie httpOnly:true, sameSite:strict | unit | `vitest run backend/tests/cookie.test.ts` | ❌ W0 | ⬜ pending |
| 02-01 | 02 | 1 | AUTH-01 | T-1-04 | Unified error message prevents timing attack | integration | `vitest run backend/tests/auth.login.test.ts` | ❌ W0 | ⬜ pending |
| 02-02 | 02 | 1 | AUTH-02 | — | JWT payload contains userId, studentId, name, role | integration | `vitest run backend/tests/auth.login.test.ts` | ❌ W0 | ⬜ pending |
| 02-03 | 02 | 1 | AUTH-03 | — | Logout clears cookie token | integration | `vitest run backend/tests/auth.logout.test.ts` | ❌ W0 | ⬜ pending |
| 02-04 | 02 | 1 | — | — | Admin seed script creates admin/admin123 | unit | `vitest run backend/tests/init-admin.test.ts` | ❌ W0 | ⬜ pending |
| 03-01 | 03 | 2 | — | — | N/A (scaffolding) | — | Manual: npm run dev succeeds | ✅ | ⬜ pending |
| 03-02 | 03 | 2 | AUTH-01 | — | Credentials included for cookie transport | unit | `vitest run frontend/tests/request.test.ts` | ❌ W0 | ⬜ pending |
| 03-03 | 03 | 2 | AUTH-01 | — | Login API returns user object | unit | `vitest run frontend/tests/auth.api.test.ts` | ❌ W0 | ⬜ pending |
| 03-04 | 03 | 2 | AUTH-04 | T-1-05 | Pinia store persists user across refresh | unit | `vitest run frontend/tests/auth.store.test.ts` | ❌ W0 | ⬜ pending |
| 03-05 | 03 | 2 | AUTH-01 | — | Login form validates studentId/password | e2e | `vitest run frontend/tests/login.e2e.test.ts` | ❌ W0 | ⬜ pending |
| 04-01 | 04 | 2 | AUTH-04 | — | Router beforeEach guard checks meta.requiresAuth | unit | `vitest run frontend/tests/router.guard.test.ts` | ❌ W0 | ⬜ pending |
| 04-02 | 04 | 2 | AUTH-04 | — | fetchProfile on app init restores session | unit | `vitest run frontend/tests/auth.persist.test.ts` | ❌ W0 | ⬜ pending |
| 04-03 | 04 | 2 | AUTH-03 | — | Logout action resets store + redirects | unit | `vitest run frontend/tests/logout.test.ts` | ❌ W0 | ⬜ pending |
| 05-01 | 05 | 3 | AUTH-02 | — | Dashboard displays user info from store | unit | `vitest run frontend/tests/dashboard.test.ts` | ❌ W0 | ⬜ pending |
| 05-02 | 05 | 3 | AUTH-03 | — | Logout button clears state + cookie | e2e | `vitest run frontend/tests/logout.e2e.test.ts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — Vitest framework configuration (backend + frontend)
- [ ] `backend/tests/setup.ts` — Prisma test database connection
- [ ] `backend/tests/schema.test.ts` — User model schema validation
- [ ] `backend/tests/password.test.ts` — bcrypt hash/compare tests
- [ ] `backend/tests/jwt.test.ts` — JWT sign/verify tests
- [ ] `backend/tests/cookie.test.ts` — Cookie security attribute tests
- [ ] `backend/tests/auth.login.test.ts` — Login endpoint integration tests (AUTH-01, AUTH-02)
- [ ] `backend/tests/auth.logout.test.ts` — Logout endpoint tests (AUTH-03)
- [ ] `backend/tests/init-admin.test.ts` — Admin seeding tests
- [ ] `frontend/tests/request.test.ts` — Axios/fetch credentials tests
- [ ] `frontend/tests/auth.api.test.ts` — Auth API wrapper tests
- [ ] `frontend/tests/auth.store.test.ts` — Pinia auth state tests (AUTH-04)
- [ ] `frontend/tests/router.guard.test.ts` — Navigation guard tests
- [ ] `frontend/tests/auth.persist.test.ts` — Session persistence tests (AUTH-04)
- [ ] `frontend/tests/logout.test.ts` — Logout action tests
- [ ] `frontend/tests/dashboard.test.ts` — Dashboard component tests
- [ ] `frontend/tests/login.e2e.test.ts` — Login page E2E test
- [ ] `frontend/tests/logout.e2e.test.ts` — Logout E2E test

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Browser refresh keeps user logged in | AUTH-04 | Requires real browser session | 1. Login with valid credentials 2. Refresh page 3. Verify user still authenticated |
| Cookie not accessible via document.cookie | T-1-03 | Requires browser DevTools | 1. Login 2. Open DevTools Console 3. Run `document.cookie` 4. Verify token not visible |
| Token expires after 7 days | AUTH-04 | Requires waiting | Verify JWT expiresIn is '7d' in auth.routes.ts |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter (after Wave 0 complete)

**Approval:** pending