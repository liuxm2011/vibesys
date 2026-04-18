---
phase: 02-选题管理与学生端
plan: 01
subsystem: backend
tags: [api, topics, express, prisma, auth]
requires: [02-00]
provides: [topics-api, visibility-filter, custom-topic-creation]
affects: [TOPIC-01, TOPIC-02, TOPIC-03, TOPIC-05, D-12, D-13, D-14, D-15]
tech_stack:
  added: []
  patterns: [express-router, prisma-query, authMiddleware, OR-clause-filter]
key_files:
  created:
    - backend/src/routes/topics.routes.ts
  modified:
    - backend/src/index.ts
    - backend/package.json
    - backend/package-lock.json
decisions:
  - OR clause visibility: SYSTEM topics visible to all, CUSTOM only to creator
  - creatorId from JWT (req.user.userId), not from request body (security)
  - title validation: 2-100 characters
  - description validation: 10-500 characters
  - domain validation: enum check (SE/BD)
  - background/objectives optional with empty string default
metrics:
  duration: 15 minutes
  tasks_completed: 4
  files_changed: 4
  completed_date: 2026-04-18
---

# Phase 2 Plan 01: Backend Topics Routes Summary

## One-Liner

Express routes for topic management with visibility filtering (SYSTEM visible to all, CUSTOM only to creator), domain filtering, and custom topic creation with validation.

## Implementation Details

### Endpoints Created

| Endpoint | Method | Purpose | Requirements |
|----------|--------|---------|--------------|
| /api/topics | GET | Browse topic pool | TOPIC-01, TOPIC-02, D-14 |
| /api/topics/:id | GET | View topic detail | TOPIC-03, D-14 |
| /api/topics/custom | POST | Create custom topic | TOPIC-05, D-12, D-13, D-14, D-15 |

### Visibility Filter (D-14)

All endpoints implement the visibility rule using Prisma OR clause:
```typescript
OR: [
  { type: TopicType.SYSTEM },  // Public system topics
  { creatorId: userId }         // User's custom topics only
]
```

### Validation Rules

| Field | Rule | Requirement |
|-------|------|-------------|
| title | 2-100 characters | D-12 |
| description | 10-500 characters | D-12 |
| domain | SE or BD enum | D-03 |
| background | optional, default '' | D-12 |
| objectives | optional, default '' | D-12 |
| techStack | empty array [] | Phase 3 placeholder |

### Security Measures

- **creatorId from JWT**: Never from request body (prevents spoofing)
- **authMiddleware**: All endpoints require authentication
- **Visibility check**: Even GET /:id checks if user can access the topic

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Pre-existing TypeScript type error**
- **Found during:** Task 1 verification
- **Issue:** @types/cookie-parser missing, causing TypeScript compilation failure
- **Fix:** Installed @types/cookie-parser package
- **Files modified:** backend/package.json, backend/package-lock.json
- **Commit:** 825f38a

**2. [Rule 3 - Blocking] Wave 2 index.ts changes uncommitted**
- **Found during:** Task 4 preparation
- **Issue:** Wave 2 (02-02) commit did not include index.ts route mounting for projects routes
- **Fix:** Included projects routes mounting alongside topics routes mounting
- **Files modified:** backend/src/index.ts
- **Commit:** 469f4ae

**3. [Rule 1 - Bug] req.params.id type safety**
- **Found during:** Task 2 implementation
- **Issue:** TypeScript error - req.params.id can be string | string[]
- **Fix:** Added Array.isArray check before parseInt
- **Files modified:** backend/src/routes/topics.routes.ts
- **Commit:** 9e24848

## Files Created/Modified

| File | Action | Lines | Description |
|------|--------|-------|-------------|
| backend/src/routes/topics.routes.ts | created | 153 | Express router with 3 endpoints |
| backend/src/index.ts | modified | +4 | Import and mount topics routes |
| backend/package.json | modified | +1 | Added @types/cookie-parser |
| backend/package-lock.json | modified | +24/-11 | Dependency update |

## Commit History

| Commit | Message |
|--------|---------|
| 13ea2bb | feat(02-01): add GET /api/topics endpoint with visibility filter |
| 9e24848 | feat(02-01): add GET /api/topics/:id endpoint for topic detail |
| 86b9768 | feat(02-01): add POST /api/topics/custom endpoint for custom topics |
| 469f4ae | feat(02-01): mount topics routes at /api/topics |
| 825f38a | chore(02-01): add @types/cookie-parser for TypeScript compilation |

## Threat Mitigation Verification

| Threat ID | Mitigation | Status |
|-----------|------------|--------|
| T-02-01 | Validate title/description/domain, creatorId from JWT | Implemented |
| T-02-02 | OR clause filters SYSTEM + user's CUSTOM | Implemented |
| T-02-03 | authMiddleware on all endpoints | Implemented |
| T-02-04 | parseInt validation, visibility check | Implemented |

## Self-Check: PASSED

- backend/src/routes/topics.routes.ts: EXISTS
- backend/src/index.ts with topics routes: EXISTS
- Commit 13ea2bb: EXISTS
- Commit 9e24848: EXISTS
- Commit 86b9768: EXISTS
- Commit 469f4ae: EXISTS
- TypeScript compilation: PASSED

## Next Steps

Wave 3 (02-03) should create frontend topic store and API integration to consume these backend endpoints.