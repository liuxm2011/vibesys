---
phase: 01-认证与用户基础
plan: 03a
status: complete
completed: 2026-04-18
commit: feat(01-03a)
---

# Plan 01-03a: Frontend Scaffolding + API Client

## Summary

Created frontend project foundation with Vue 3, Vite, Element Plus, Pinia. Implemented HTTP request utility with credentials for httpOnly cookie support, and auth API client matching backend endpoints.

## What Was Built

### Frontend Project Structure
- `frontend/package.json` — Vue 3.5.32, Pinia 3.0.4, vue-router 5.0.4, element-plus 2.13.7
- `frontend/vite.config.ts` — Proxy /api to localhost:3000, @ alias
- `frontend/tsconfig.json` — TypeScript strict mode with Vue settings
- `frontend/src/main.ts` — Pinia and ElementPlus initialization
- `frontend/src/App.vue` — Placeholder layout
- `frontend/index.html` — Entry HTML

### HTTP Request Utility
- `frontend/src/utils/request.ts`:
  - `request<T>()` — fetch with credentials: 'include' (D-12)
  - Error extraction from API response (D-20)
  - JSON content-type handling
  - `api` object with get, post, put, delete convenience methods

### Auth API Client
- `frontend/src/api/auth.api.ts`:
  - `User` interface — studentId, name, role, major, grade, class
  - `loginApi(studentId, password)` — POST /api/auth/login (D-02)
  - `logoutApi()` — POST /api/auth/logout (AUTH-03)
  - `getProfileApi()` — GET /api/auth/profile (AUTH-02)

## Decision Trace

| Decision | Implementation |
|----------|----------------|
| D-02 | loginApi uses studentId field |
| D-12 | credentials: 'include' in fetch |
| D-20 | Error thrown with API message |

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| frontend/vite.config.ts | Vite + proxy config | 20 |
| frontend/src/utils/request.ts | HTTP request wrapper | 45 |
| frontend/src/api/auth.api.ts | Auth API client | 48 |
| frontend/src/main.ts | App initialization | 20 |

## Verification

```bash
cd frontend && npm run dev
# Opens http://localhost:5173
# Proxy /api/health -> http://localhost:3000/api/health
```

## Self-Check: PASSED

- [x] frontend/package.json has vue, pinia, element-plus
- [x] vite.config.ts has proxy for /api
- [x] request.ts has credentials: 'include'
- [x] auth.api.ts has loginApi, logoutApi, getProfileApi
- [x] npm install completed (119 packages)

## Next Wave

Wave 4 (Plan 01-03b): Pinia store + Login page
- Auth store with login/logout/fetchProfile actions
- Login.vue with Element Plus form
- Form validation and error handling