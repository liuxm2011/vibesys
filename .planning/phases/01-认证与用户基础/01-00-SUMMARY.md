---
phase: 01-认证与用户基础
plan: 00
status: complete
completed: 2026-04-18
commit: feat(01-00)
---

# Plan 01-00: Database Schema + Express Setup

## Summary

Established backend foundation for the VibeCoding authentication system. Created Prisma schema with User model matching D-04~D-07 decisions, Express server with security middleware, and database connection configuration.

## What Was Built

### Backend Directory Structure
- `backend/package.json` — Express 5.x, Prisma 6.x, JWT, bcrypt dependencies
- `backend/tsconfig.json` — TypeScript strict mode configuration
- `backend/.gitignore` — Excludes .env, node_modules, dist

### Database Schema (Prisma)
- `backend/prisma/schema.prisma` — User model with:
  - Fields: id, studentId (unique), name, major, grade, class, password, role, status
  - Role enum: STUDENT, ADMIN (D-05)
  - Status enum: ACTIVE, BANNED (D-06)
  - Indexes on studentId and role

### Express Application
- `backend/src/index.ts` — Entry point with:
  - helmet() for security headers
  - cors() with credentials:true for httpOnly cookies (D-12)
  - cookieParser() for JWT cookie handling
  - Health endpoint: GET /api/health
  - Graceful shutdown hooks

### Configuration
- `backend/.env` — DATABASE_URL, JWT_SECRET placeholders (excluded from git)

## Deviations

1. **Prisma version**: Used Prisma 6.6.0 instead of 7.7.0 — Prisma 7.x changed datasource configuration format requiring prisma.config.ts. For teaching project stability, used traditional Prisma 6.x format.

## Decision Trace

| Decision | Implementation |
|----------|----------------|
| D-02 | studentId field with @unique constraint |
| D-04 | User fields: studentId, name, major, grade, class, password |
| D-05 | Role enum with STUDENT, ADMIN |
| D-06 | Status enum with ACTIVE, BANNED |
| D-09 | password field (bcrypt hash storage) |
| D-12 | cors credentials:true for httpOnly cookies |

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| backend/prisma/schema.prisma | User model definition | 35 |
| backend/src/index.ts | Express entry point | 45 |
| backend/package.json | Dependencies | 30 |

## Verification

```bash
cd backend && npm install
cd backend && npx prisma generate
# Health check: curl http://localhost:3000/api/health
```

## Self-Check: PASSED

- [x] backend/package.json exists with express, prisma, jwt, bcrypt
- [x] backend/prisma/schema.prisma contains User model with all D-04 fields
- [x] backend/.env has DATABASE_URL and JWT_SECRET placeholders
- [x] backend/src/index.ts exports app and prisma
- [x] Express middleware configured (helmet, cors, cookieParser)

## Next Wave

Wave 1 (Plan 01-01): Backend auth utilities + middleware
- JWT sign/verify helpers
- Password hash/compare helpers
- Auth middleware for protected routes