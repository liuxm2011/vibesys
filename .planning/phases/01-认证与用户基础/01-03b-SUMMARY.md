---
phase: 01-认证与用户基础
plan: 03b
status: complete
completed: 2026-04-18
commit: feat(01-03b)
---

# Plan 01-03b: Pinia Store + Login Page

## Summary

Created Pinia auth store for state management and Login page component with Element Plus form. Auth store handles login/logout actions and fetchProfile for session persistence. Login page validates inputs and displays unified error messages.

## What Was Built

### Pinia Auth Store
- `frontend/src/stores/auth.store.ts`:
  - State: `user`, `loading`, `error`
  - Computed: `isAuthenticated`, `isAdmin`
  - Actions:
    - `login(studentId, password)` — calls loginApi, sets user on success (D-18)
    - `logout()` — calls logoutApi, clears state (D-14, AUTH-03)
    - `fetchProfile()` — restores user from cookie (AUTH-04)
    - `$reset()` — clears all state

### Login Page
- `frontend/src/views/Login.vue`:
  - Element Plus form with studentId and password inputs (D-02)
  - Form validation (required fields)
  - Login button with loading state
  - Error alert bound to authStore.error (D-20)
  - Login hint: "初始密码默认为学号"
  - Gradient background styling

## Decision Trace

| Decision | Implementation |
|----------|----------------|
| D-02 | studentId input field |
| D-14 | logout() clears state, $reset() function |
| D-17 | Independent login page (not modal) |
| D-18 | Pinia defineStore('auth') |
| D-20 | Unified error via authStore.error |

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| frontend/src/stores/auth.store.ts | Pinia auth store | 85 |
| frontend/src/views/Login.vue | Login page UI | 120 |

## Verification

```bash
cd frontend && npm run dev
# Navigate to Login.vue (router not yet set up)
# Form validates required fields
# Login calls authStore.login()
```

## Self-Check: PASSED

- [x] Pinia store with defineStore('auth')
- [x] login/logout/fetchProfile actions
- [x] isAuthenticated computed
- [x] Login.vue with el-form
- [x] Form validation rules
- [x] Error alert bound to store
- [x] Router imports commented (Plan 04)

## Next Wave

Wave 5 (Plan 01-04): Vue Router + navigation guards
- Router configuration with Login/Dashboard routes
- beforeEach guard checking isAuthenticated
- Redirect to /login?redirect=... for protected routes