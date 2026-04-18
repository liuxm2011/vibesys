---
phase: 03-文档生成与AI服务
plan: 01
status: complete
completed: 2026-04-18
requirements:
  - DOC-01
  - DOC-02
  - DOC-03
  - DOC-04
---

# Summary: Backend AI Service + Prompt Templates

## What Was Built

AI service module with MiniMax API integration and domain-specific prompt templates.

### Components

1. **AIService** (`backend/src/services/ai.service.ts`)
   - OpenAI SDK with custom baseURL for MiniMax API
   - generateDocument method for DOC-04
   - Domain-specific system prompts (SE/BD)

2. **Prompt Templates**
   - `prd.template.ts` - PRD structure with D-05 sections
   - `frontend.template.ts` - Frontend structure with D-06 sections
   - `backend.template.ts` - Backend structure with D-07 sections
   - SE vs BD differentiation (D-08/09)

3. **AI Routes** (`backend/src/routes/ai.routes.ts`)
   - POST /api/ai/generate endpoint
   - IDOR prevention (project ownership check)
   - Document upsert on generation

4. **Dependencies**
   - Added openai package

## Security Mitigations

- API key from env vars only (T-03-01-01)
- IDOR prevention via project.userId check (T-03-01-02)
- 30s timeout handling (T-03-01-04)

## Key Files Created/Modified

| File | Purpose |
|------|---------|
| backend/src/services/ai.service.ts | MiniMax API client wrapper |
| backend/src/prompts/prd.template.ts | PRD templates (SE/BD) |
| backend/src/prompts/frontend.template.ts | Frontend templates (SE/BD) |
| backend/src/prompts/backend.template.ts | Backend templates (SE/BD) |
| backend/src/routes/ai.routes.ts | AI generation endpoint |
| backend/src/index.ts | Route registration |
| backend/package.json | OpenAI dependency |

## Verification

- TypeScript compiles ✓
- OpenAI SDK installed ✓
- AI routes registered ✓