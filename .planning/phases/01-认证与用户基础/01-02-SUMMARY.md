---
phase: 01-认证与用户基础
plan: 02
status: complete
completed: 2026-04-18
commit: feat(01-02)
---

# Plan 01-02: Auth Routes + Admin Seeding

## Summary

Implemented authentication API endpoints (login, logout, profile) and admin seeding script. Login uses bcrypt password verification, JWT token stored in httpOnly cookie, and returns unified error messages per D-20.

## What Was Built

### Auth Routes
- `backend/src/routes/auth.routes.ts`:
  - `POST /api/auth/login` — studentId + password login (D-02)
    - Validates input (400 if missing)
    - Checks user.status === 'BANNED' (D-06)
    - bcrypt.compare for password (D-09)
    - Unified error: '登录失败，请检查账号密码' (D-20)
    - Sets httpOnly cookie with 7-day expiry (D-11, D-12)
    - Returns user info (AUTH-02)
  - `POST /api/auth/logout` — clears cookie (AUTH-03)
  - `GET /api/auth/profile` — returns user info (authMiddleware required)

### Admin Seeding
- `backend/src/scripts/init-admin.ts`:
  - Default credentials: admin / admin123 (D-15, D-16)
  - bcrypt hash with 10 rounds
  - Duplicate prevention check
  - Warning to change password after first login

### Express App Update
- `backend/src/index.ts`:
  - Imported authRoutes
  - Mounted at `/api/auth`
  - Middleware order: helmet → cors → cookieParser → json → health → auth → error

## Decision Trace

| Decision | Implementation |
|----------|----------------|
| D-02 | studentId as login account |
| D-06 | BANNED users blocked at login |
| D-11 | Cookie maxAge = 604800000ms (7 days) |
| D-12 | httpOnly: true, sameSite: 'strict' |
| D-15 | Default admin: studentId = 'admin' |
| D-16 | Default admin: password = 'admin123' |
| D-20 | Unified error '登录失败，请检查账号密码' |

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| backend/src/routes/auth.routes.ts | Login/logout/profile | 95 |
| backend/src/scripts/init-admin.ts | Admin seeding | 45 |
| backend/src/index.ts | Route mounting | +2 |

## Verification

```bash
# Start server
cd backend && npm run dev

# Test login (will fail without database)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"studentId":"admin","password":"admin123"}'

# Should return 500 (database not connected) or 401 (no user yet)
```

## Self-Check: PASSED

- [x] login endpoint validates input (400)
- [x] login checks BANNED status (D-06)
- [x] login uses comparePassword (D-09)
- [x] login sets httpOnly cookie with sameSite:'strict'
- [x] login returns unified error (D-20)
- [x] logout clears cookie
- [x] profile uses authMiddleware
- [x] admin script uses admin/admin123 (D-15, D-16)
- [x] routes mounted at /api/auth

## Next Wave

Wave 3 (Plan 01-03a): Frontend scaffolding + API client
- Vue 3 project with Vite
- Element Plus UI library
- API client with axios/fetch
- Request interceptor with credentials