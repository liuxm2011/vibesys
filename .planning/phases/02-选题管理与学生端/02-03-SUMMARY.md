---
phase: 02-选题管理与学生端
plan: 03
subsystem: frontend
tags: [frontend, pinia, api-client, types, topic-management]
requires: [02-01]
provides: [topic-types, topic-api-client, topic-pinia-store]
affects: [frontend/src/types/topic.ts, frontend/src/api/topic.api.ts, frontend/src/stores/topic.store.ts]
tech-stack:
  added:
    - TypeScript type definitions for Domain/TopicType
    - API client with domain query parameter support
    - Pinia store with filteredTopics computed property
  patterns:
    - Composition API setup pattern
    - Type-safe API client
    - Computed property for domain filtering
key-files:
  created:
    - frontend/src/types/topic.ts
    - frontend/src/api/topic.api.ts
    - frontend/src/stores/topic.store.ts
  modified: []
decisions:
  - Domain type: 'SE' | 'BD' (exact values per D-03)
  - TopicType: 'SYSTEM' | 'CUSTOM' (exact values per D-05)
  - filteredTopics computed filters by selectedDomain.value (TOPIC-02)
  - fetchTopicsApi supports optional domain query param
metrics:
  duration: 3m
  completed_date: 2026-04-18
  task_count: 3
  file_count: 3
---

# Phase 2 Plan 03: Frontend Topic Store + API Client Summary

## One-liner

Created frontend TypeScript type definitions, API client with domain filtering support, and Pinia store for topic state management with computed filtering.

## Tasks Completed

| Task | Description | Status | Commit |
|------|-------------|--------|--------|
| 1 | Create topic type definitions | Done | bea713a |
| 2 | Create topic API client | Done | bea713a |
| 3 | Create topic Pinia store | Done | bea713a |

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| frontend/src/types/topic.ts | 41 | Type definitions for Domain, TopicType, Topic, response/input interfaces |
| frontend/src/api/topic.api.ts | 31 | API client with fetchTopicsApi, getTopicDetailApi, createCustomTopicApi |
| frontend/src/stores/topic.store.ts | 146 | Pinia store with topics state, filteredTopics computed, actions |

## Requirements Covered

| Requirement | Coverage |
|-------------|----------|
| TOPIC-01 (Browse topics) | fetchTopicsApi + fetchTopics action |
| TOPIC-02 (Domain filter) | fetchTopicsApi domain param + filteredTopics computed |
| TOPIC-03 (Topic detail) | getTopicDetailApi + getTopicDetail action |
| TOPIC-05 (Custom topic) | createCustomTopicApi + createCustomTopic action |

## Key Implementation Details

### Type Definitions (topic.ts)
- Domain: 'SE' | 'BD' - exact values matching backend enum (D-03)
- TopicType: 'SYSTEM' | 'CUSTOM' - exact values matching backend enum (D-05)
- Topic interface with all D-01 fields: id, title, description, background, objectives, domain, techStack, type, creatorId, createdAt, updatedAt
- techStack as string[] (cast from backend Json)
- creatorId optional (null for SYSTEM topics)
- Response/input interfaces for API calls

### API Client (topic.api.ts)
- fetchTopicsApi with optional domain query param for TOPIC-02 filtering
- getTopicDetailApi for single topic retrieval
- createCustomTopicApi for TOPIC-05 custom submission
- All use api wrapper from request.ts (credentials: 'include' for cookies)
- Endpoint paths match backend routes: /api/topics, /api/topics/:id, /api/topics/custom

### Pinia Store (topic.store.ts)
- Setup pattern following auth.store.ts pattern
- State: topics, currentTopic, loading, error, selectedDomain
- filteredTopics computed - filters topics by selectedDomain.value (TOPIC-02)
- systemTopics/customTopics computed - separate by type
- Actions: fetchTopics, getTopicDetail, createCustomTopic, setDomainFilter, clearCurrentTopic, $reset
- createCustomTopic pushes new topic to topics.value array
- All async actions return boolean, set loading/error states

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

All acceptance criteria verified:
- topic.ts has Domain and TopicType types matching D-03/D-05
- topic.ts has Topic interface with all D-01 fields
- topic.api.ts exports fetchTopicsApi, getTopicDetailApi, createCustomTopicApi
- fetchTopicsApi supports optional domain filter (TOPIC-02)
- topic.store.ts has filteredTopics computed (TOPIC-02)
- topic.store.ts has selectedDomain state for filter
- TypeScript compiles without errors in topic files

## Next Steps

Wave 4 (02-04): Frontend project store + API client
- Project type definitions
- Project API client (createProjectApi, fetchProjectsApi, deleteProjectApi)
- Project Pinia store