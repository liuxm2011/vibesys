---
phase: 02-选题管理与学生端
plan: 05
subsystem: frontend-views
tags: [vue, element-plus, topic-pool, dialog, d-16-layout]
requires: [02-03, 02-04]
provides: [TOPIC-01, TOPIC-02, TOPIC-03, TOPIC-05, D-16]
affects: [frontend/src/views/TopicPool.vue]
tech_stack:
  added: []
  patterns: [Vue 3 SFC, Element Plus table/dialog/form, Pinia store integration]
key_files:
  created:
    - frontend/src/views/TopicPool.vue
    - frontend/src/components/TopicDetailDialog.vue
    - frontend/src/components/CustomTopicDialog.vue
  modified: []
decisions:
  - D-16: TopicPool layout = el-aside (200px) + el-main with el-table
  - TOPIC-02: Domain filter = radio group (全部/null, 软件工程/SE, 大数据/BD)
  - TOPIC-03: Topic detail shown in el-dialog with el-descriptions
  - TOPIC-05: Custom topic form with validation (title 2-100, description 10-500)
metrics:
  duration: "2 minutes"
  completed: "2026-04-18T14:22Z"
  tasks: 3
  files: 3
  commits: [f0b3fe1, d56d461, b2acff1]
---

# Phase 2 Plan 5: TopicPool.vue Page Summary

**One-liner:** TopicPool.vue with D-16 layout (200px sidebar + table), domain filter radio group, TopicDetailDialog for TOPIC-03, and CustomTopicDialog for TOPIC-05.

## Completed Tasks

| Task | Description | Commit | Files |
|------|-------------|--------|-------|
| 1 | Create TopicDetailDialog component | f0b3fe1 | frontend/src/components/TopicDetailDialog.vue |
| 2 | Create CustomTopicDialog component | d56d461 | frontend/src/components/CustomTopicDialog.vue |
| 3 | Create TopicPool.vue main page | b2acff1 | frontend/src/views/TopicPool.vue |

## Implementation Details

### Task 1: TopicDetailDialog.vue

Created el-dialog component for TOPIC-03 (topic detail display):
- el-descriptions with :column="1" border showing all topic fields
- Fields: 标题, 描述, 背景, 目标, 领域, 类型, 技术栈建议
- Domain tag colors: primary (SE), success (BD)
- Type tag colors: default (SYSTEM), warning (CUSTOM)
- "选择此选题" button calls projectStore.createProject(topic.id)
- maxProjectsReached check before creation (D-08 limit)
- v-model sync for visible prop

### Task 2: CustomTopicDialog.vue

Created el-dialog with el-form for TOPIC-05 (custom topic submission):
- Form fields: 标题, 领域, 描述, 背景, 目标
- Validation rules per D-12:
  - title: required, 2-100 characters
  - domain: required (radio buttons)
  - description: required, 10-500 characters
- Domain radio: SE (软件工程), BD (大数据)
- Background and objectives are optional textareas
- Submit calls topicStore.createCustomTopic
- v-model sync for visible prop

### Task 3: TopicPool.vue

Created main page implementing D-16 layout:
- el-container with el-aside (width="200px") + el-main
- Sidebar: "领域筛选" card with el-radio-group
  - 全部 (value: null)
  - 软件工程 (value: "SE")
  - 大数据 (value: "BD")
- Sidebar: "提交自拟选题" button opens CustomTopicDialog
- Main: el-table with columns 标题/领域/类型/描述/操作
- Table data: topicStore.filteredTopics (TOPIC-02 filtering)
- Domain tags: primary (SE), success (BD)
- Type tags: default (SYSTEM), warning (CUSTOM)
- "详情" button opens TopicDetailDialog
- "选择" button calls quickCreate, disabled at maxProjectsReached
- Empty text: "暂无选题，系统选题由管理员添加，您也可以提交自拟选题"
- onMounted fetches topics and projects

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- TypeScript compiles without errors in new files
- All acceptance criteria pass
- el-dialog/el-descriptions/el-form/el-table components correctly implemented
- Domain/type tag colors match Element Plus semantic colors
- Form validation rules match D-12 specifications

## Threat Surface

No new threat surface introduced beyond plan's threat_model. All inputs validated via Element Plus form rules.

## Self-Check: PASSED

- [x] TopicDetailDialog.vue exists with el-dialog/el-descriptions
- [x] CustomTopicDialog.vue exists with el-dialog/el-form
- [x] TopicPool.vue exists with D-16 layout
- [x] All commits exist in git history
- [x] TypeScript compiles without errors in new files

---

*SUMMARY generated: 2026-04-18*
*Phase 2 Wave 5: TopicPool.vue Page*