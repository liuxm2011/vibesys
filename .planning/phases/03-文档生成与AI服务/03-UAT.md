---
status: testing
phase: 03-文档生成与AI服务
source: [03-00-SUMMARY.md, 03-01-SUMMARY.md, 03-02-SUMMARY.md, 03-03-SUMMARY.md, 03-04-SUMMARY.md, 03-05-SUMMARY.md]
started: 2026-04-19T00:00:00Z
updated: 2026-04-19T00:00:00Z
---

## Current Test

number: 10
name: Project Detail Navigation
expected: |
  Click a project from Dashboard, navigates to /projects/:id with correct project data loaded.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
result: pass

### 2. Document Generation (Single)
expected: Click "生成PRD" button on ProjectDetail page, AI generates content and displays in MarkdownEditor without errors.
result: pass

### 3. Batch Document Generation
expected: Click "批量生成" button, all three documents (PRD, Frontend, Backend) generate sequentially with loading states.
result: pass

### 4. Online Document Editing & Auto-Save
expected: Edit document content in MarkdownEditor, changes auto-save after 500ms debounce.
result: pass

### 5. Document Tab Navigation
expected: Click PRD/Frontend/Backend tabs, content switches correctly. Un-generated docs show "未生成" indicator.
result: pass

### 6. Tech Stack Display & Modification
expected: TechStackPanel shows current tech stack as tags. User can add/remove tech options.
result: pass

### 7. Domain-Specific Templates (SE vs BD)
expected: Generated PRD/Frontend/Backend content reflects the project's domain (Software Engineering vs Big Data) with appropriate structure.
result: pass

### 8. Admin Redirect After Login
expected: Admin user logs in, redirected to /admin page instead of /dashboard.
result: pass

### 9. Student Redirect After Login
expected: Student user logs in, redirected to /dashboard page.
result: pass

### 10. Project Detail Navigation
expected: Click a project from Dashboard, navigates to /projects/:id with correct project data loaded.
result: issue
reported: "进入页面后所有按钮不可交互，页面好像开始在执行什么操作导致阻塞"
severity: blocker

### 11. Generate Overwrite Warning
expected: Clicking generate on an already-generated document shows confirmation dialog warning about overwrite.
result: [pending]

## Summary

total: 11
passed: 9
issues: 0
pending: 2
skipped: 0
blocked: 0

## Gaps

[none yet]
