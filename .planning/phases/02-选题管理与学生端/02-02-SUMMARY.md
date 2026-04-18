---
phase: 02-选题管理与学生端
plan: 02
subsystem: api
tags: [express, prisma, jwt, crud, projects]

requires:
  - phase: 02-00
    provides: Project model in Prisma schema with ProjectStatus enum
provides:
  - POST /api/projects endpoint for project creation from topic
  - GET /api/projects endpoint for listing user's projects
  - DELETE /api/projects/:id endpoint for project deletion
affects: [02-04, 02-06, 02-07]

tech-stack:
  added: []
  patterns:
    - "Route pattern: authMiddleware for protected endpoints"
    - "IDOR prevention: userId in where clause for all user-scoped queries"
    - "Project limit: count check before create (D-08: max 10)"
    - "Topic visibility: OR query for SYSTEM or user's CUSTOM topics"

key-files:
  created:
    - backend/src/routes/projects.routes.ts
  modified:
    - backend/src/index.ts

key-decisions:
  - "Used shared prisma instance from index.ts instead of new PrismaClient per route"
  - "Type-safe JSON casting for techStack and documentsRef fields"

patterns-established:
  - "Ownership verification: findFirst with userId in where clause before delete (IDOR prevention)"
  - "Count-then-create pattern for resource limits"
  - "Topic visibility: SYSTEM topics visible to all, CUSTOM only to creator"

requirements-completed: [TOPIC-04, DASH-01, DASH-02, D-06, D-07, D-08, D-09, D-10, D-11, D-14]

duration: 2min
completed: 2026-04-18
---

# Phase 2 Wave 2: Backend Projects Routes Summary

**Express routes for project management: create from topic with 10-project limit, list user's projects, delete with ownership verification**

## Performance

- **Duration:** 2 min
- **Started:** 2026-04-18T14:04:32Z
- **Completed:** 2026-04-18T14:06:18Z
- **Tasks:** 4
- **Files modified:** 2

## Accomplishments
- POST /api/projects creates project from topic with visibility check and max 10 limit
- GET /api/projects returns user's projects with topic info for dashboard
- DELETE /api/projects/:id deletes with IDOR-preventing ownership verification
- Routes mounted at /api/projects in Express app

## Task Commits

Each task was committed atomically:

1. **Tasks 1-3: Create projects routes with all endpoints** - `ffef577` (feat)
2. **Task 4: Mount projects routes at /api/projects** - `8d36c2e` (feat)

## Files Created/Modified
- `backend/src/routes/projects.routes.ts` - Project CRUD endpoints with auth, validation, and security checks
- `backend/src/index.ts` - Route mounting for /api/projects

## Decisions Made
- Used shared prisma instance exported from index.ts for consistent database connections
- Applied type casting for JSON fields (techStack as string[], documentsRef as Record)
- Fixed Express param type issue with Array.isArray check for req.params.id

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript error for req.params.id type**
- **Found during:** Task 1 (TypeScript compilation)
- **Issue:** req.params.id has type `string | string[]` in Express, causing TS2345 error
- **Fix:** Added Array.isArray check to safely handle both cases
- **Files modified:** backend/src/routes/projects.routes.ts
- **Verification:** TypeScript compiles without errors
- **Committed in:** ffef577 (part of Tasks 1-3 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minimal fix required for TypeScript strict mode. No scope creep.

## Issues Encountered
- Express type definitions treat route params as potentially arrays - handled with type guard

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Backend routes ready for frontend integration (Waves 3-4: stores and API clients)
- Project creation enforces business rules (max 10, topic visibility)
- IDOR prevention in place for all user-scoped operations

---
*Phase: 02-选题管理与学生端*
*Completed: 2026-04-18*