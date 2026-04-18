# Phase 3: 文档生成与AI服务 - Validation Strategy

**Created:** 2026-04-18
**Phase:** 03-文档生成与AI服务
**Test Framework:** Vitest

## Validation Dimensions

### Dimension 1: Functional Coverage
| Req ID | Behavior | Test Command | Status |
|--------|----------|--------------|--------|
| DOC-01 | Generate PRD document | `vitest run tests/document.test.ts` | Wave 1+ |
| DOC-02 | Generate frontend document | `vitest run tests/document.test.ts` | Wave 1+ |
| DOC-03 | Generate backend document | `vitest run tests/document.test.ts` | Wave 1+ |
| DOC-04 | AI fills initial content | `vitest run tests/ai.test.ts` | Wave 1+ |
| DOC-05 | Online edit and save | `vitest run tests/document.test.ts` + frontend tests | Wave 2+ |
| DOC-06 | View tech stack recommendation | `vitest run tests/project.test.ts` | Wave 2+ |
| DOC-07 | Modify tech stack | `vitest run tests/project.test.ts` | Wave 2+ |
| DOC-08 | No quota display (D-04 adjustment) | N/A (removed) | N/A |

### Dimension 2: Integration Points
| Integration | Test Focus | Command |
|-------------|------------|---------|
| MiniMax API → Backend | OpenAI SDK with baseURL | Mock in tests, verify call structure |
| Backend → Frontend | Document CRUD API | Integration test with test DB |
| Document → Project | Foreign key relation | Cascade delete test |

### Dimension 3: Security Validation
| Threat | Mitigation | Test |
|--------|------------|------|
| IDOR | project.userId check | Test with wrong user's project |
| API key exposure | Backend-only | Verify no key in frontend |
| XSS in Markdown | Raw Markdown display | CodeMirror safety check |
| Prompt injection | System prompt isolation | Test malicious topic input |

### Dimension 4: Performance Thresholds
| Metric | Threshold | Test Method |
|--------|-----------|-------------|
| Document generation | < 30s timeout | Mock MiniMax response |
| Auto-save debounce | 500ms interval | Frontend timing test |
| Large document save | 100KB limit | Test oversized content |

### Dimension 5: Error Handling
| Scenario | Expected Response | Test |
|----------|-------------------|------|
| MiniMax API failure | 500 + error message | Mock failure |
| Invalid docType | 400 validation error | Bad enum value |
| Missing project | 404 not found | Non-existent ID |
| Unauthorized access | 403 forbidden | Wrong user |

### Dimension 6: Domain Differentiation
| Domain | Template Check | Test |
|--------|----------------|------|
| SE (软件工程) | Contains functional flow sections | Compare SE vs BD output |
| BD (大数据) | Contains data pipeline sections | Compare BD vs SE output |

## Test File Inventory

### Backend Tests (Wave 0 Skeletons)
- `backend/tests/document.test.ts` — Document CRUD + AI generation
- `backend/tests/ai.test.ts` — MiniMax API integration (mocked)

### Frontend Tests (Wave 0 Skeletons)
- `frontend/src/__tests__/MarkdownEditor.test.ts` — Editor component
- `frontend/src/__tests__/ProjectDetail.test.ts` — Page component

## Sampling Protocol

- **Per task commit:** `cd backend && npm test --run`
- **Per wave merge:** `npm test --run` (both dirs)
- **Phase gate:** Full suite green + manual verification

## Verification Commands

```bash
# Quick backend check
cd backend && npm test --run

# Quick frontend check
cd frontend && npm test --run

# Full integration test
npm test --run
```

---

*Validation strategy for Phase 03-文档生成与AI服务*
*Created: 2026-04-18*