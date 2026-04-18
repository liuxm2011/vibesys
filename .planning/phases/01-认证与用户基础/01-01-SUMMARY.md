---
phase: 01-认证与用户基础
plan: 01
status: complete
completed: 2026-04-18
commit: feat(01-01)
---

# Plan 01-01: Backend Auth Utilities + Middleware

## Summary

Created authentication utilities and middleware that all protected routes will depend on. Implemented bcrypt password hashing, JWT token signing/verification, and Express auth middleware following D-09, D-11, D-12, and D-20 decisions.

## What Was Built

### Password Utilities
- `backend/src/utils/password.utils.ts` — bcryptjs functions:
  - `hashPassword()` — 10 rounds hashing (D-09)
  - `comparePassword()` — constant-time comparison

### JWT Utilities
- `backend/src/utils/jwt.utils.ts` — jsonwebtoken functions:
  - `signToken()` — creates 7-day JWT (D-11)
  - `verifyToken()` — decodes and validates token
  - `JwtPayload` interface — userId, studentId, name, role
  - `getJwtExpirationMs()` — returns 7 days in milliseconds

### Auth Middleware
- `backend/src/middleware/auth.middleware.ts`:
  - `authMiddleware()` — verifies JWT from httpOnly cookie (D-12)
  - `adminOnlyMiddleware()` — checks ADMIN role
  - Express Request extended with `user` property
  - Unified error messages (D-20): '请先登录', '登录已过期，请重新登录'

## Decision Trace

| Decision | Implementation |
|----------|----------------|
| D-09 | bcryptjs with 10 rounds for password hashing |
| D-11 | JWT expiresIn: '7d' (604800 seconds) |
| D-12 | Token read from req.cookies.token (httpOnly) |
| D-20 | Unified error messages for auth failures |

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| backend/src/utils/password.utils.ts | bcrypt hash/compare | 22 |
| backend/src/utils/jwt.utils.ts | JWT sign/verify | 47 |
| backend/src/middleware/auth.middleware.ts | Auth + admin middleware | 40 |

## Verification

```typescript
// Password utils
const hash = await hashPassword('test123');
const match = await comparePassword('test123', hash); // true

// JWT utils
const token = signToken({userId: 1, studentId: 'test', name: 'Test', role: 'STUDENT'});
const payload = verifyToken(token); // {userId, studentId, name, role}
```

## Self-Check: PASSED

- [x] password.utils.ts imports bcryptjs (not bcrypt)
- [x] BCRYPT_ROUNDS = 10
- [x] jwt.utils.ts has JWT_EXPIRES_IN = '7d'
- [x] JwtPayload interface defined
- [x] authMiddleware reads from req.cookies.token
- [x] adminOnlyMiddleware checks role === 'ADMIN'
- [x] Unified error messages per D-20

## Next Wave

Wave 2 (Plan 01-02): Auth routes + admin seeding
- Login endpoint with cookie setting
- Logout endpoint clearing cookie
- Profile endpoint returning user info
- Admin seeding script