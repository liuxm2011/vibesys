---
phase: 02-选题管理与学生端
plan: 04
subsystem: frontend
tags: [frontend, types, api, store, pinia]
requires: [02-02]
provides:
  - project.ts type definitions
  - project.api.ts API client
  - project.store.ts Pinia store
affects: [DASH-01, DASH-02, TOPIC-04]
tech-stack:
  added:
    - project.api.ts
    - project.store.ts
    - project.ts
  patterns:
    - Pinia setup store pattern
    - TypeScript type definitions
    - API client pattern
key-files:
  created:
    - frontend/src/types/project.ts
    - frontend/src/api/project.api.ts
    - frontend/src/stores/project.store.ts
  modified: []
decisions: []
metrics:
  duration: 3 minutes
  completed: 2026-04-18
---

# Phase 2 Plan 04: Frontend Project Store + API Client Summary

## One-Liner

Frontend project types, API client for project endpoints, and Pinia store with projectCount/maxProjectsReached computed and Chinese status display helpers.

## Files Created

| File | Purpose | Lines |
|------|---------|-------|
| frontend/src/types/project.ts | Type definitions (ProjectStatus, Project, ProjectTopic) | 46 |
| frontend/src/api/project.api.ts | API client (fetchProjectsApi, createProjectApi, deleteProjectApi) | 27 |
| frontend/src/stores/project.store.ts | Pinia store with state, computed, actions | 163 |

## Requirements Addressed

| Requirement | Implementation |
|-------------|----------------|
| TOPIC-04 | createProject action in project.store.ts |
| DASH-01 | projectCount computed in project.store.ts |
| DASH-02 | getStatusText, getStatusTagType helpers; status filter computed |
| D-08 | maxProjectsReached computed (>= 10 projects) |
| D-09 | deleteProject action with splice removal |

## Key Implementation Details

### ProjectStatus Type (D-10)
- `'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'`
- Matches backend Prisma enum exactly

### Project Interface
- Includes `topic` field (ProjectTopic) for backend include
- `documentsRef: Record<string, any> | null` for Phase 3 placeholder

### API Client Endpoints
- `fetchProjectsApi()` → GET `/api/projects`
- `createProjectApi(topicId)` → POST `/api/projects` with `{ topicId }`
- `deleteProjectApi(projectId)` → DELETE `/api/projects/:id`

### Pinia Store Computed
- `projectCount`: `projects.value.length`
- `maxProjectsReached`: `projects.value.length >= 10` (D-08)
- `notStartedProjects`, `inProgressProjects`, `completedProjects`: status filters

### Status Display Helpers (DASH-02)
- `getStatusText`: Returns '未开始', '进行中', '已完成'
- `getStatusTagType`: Returns 'info', 'warning', 'success' for Element Plus el-tag

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Unused Import] Removed unused CreateProjectInput import**
- **Found during:** TypeScript verification
- **Issue:** `CreateProjectInput` imported but never used in project.api.ts
- **Fix:** Removed unused import from import statement
- **Files modified:** frontend/src/api/project.api.ts
- **Commit:** 8aabf15 (amended)

### Blocking Issues Resolved

**1. [Rule 3 - Missing Dependency] Wave 3 files uncommitted**
- **Found during:** Initial file check
- **Issue:** Wave 3 (topic.ts, topic.api.ts, topic.store.ts) files existed but were uncommitted
- **Fix:** Committed Wave 3 files as feat(02-03) before proceeding with Wave 4
- **Commit:** bea713a

None - plan executed as intended after resolving blocking issue.

## Threat Flags

None - frontend store has no direct threat vectors. Security enforced at backend route level (IDOR prevention).

## Known Stubs

None.

## Commits

| Commit | Message |
|--------|---------|
| bea713a | feat(02-03): frontend topic store and API client |
| a91f006 | feat(02-04): add project type definitions |
| 372e4f3 | feat(02-04): add project API client |
| 8aabf15 | feat(02-04): add project Pinia store |

## Self-Check: PASSED

- [x] frontend/src/types/project.ts exists
- [x] frontend/src/api/project.api.ts exists
- [x] frontend/src/stores/project.store.ts exists
- [x] All commits present in git log
- [x] TypeScript compiles for Wave 4 files (no new errors)