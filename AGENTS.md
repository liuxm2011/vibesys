# VibeCoding 教学实践平台 — AGENTS.md

学生自主式软件开发实践平台。学生通过选题 → AI生成PRD → AI生成技术文档 → 外部AI编码工具开发的完整流程。

---

## Tech Stack

- **Frontend:** Vue 3 + TypeScript + Vite + Element Plus + Pinia + Tailwind CSS
- **Backend:** Node.js + Express + MySQL + Prisma + JWT（ESM: `"type": "module"`）
- **AI:** 多层优先级：用户个人设置 → 管理员活跃 Provider → 环境变量
- **Deploy:** 腾讯云 VPS，Nginx 反代，Systemd 托管

---

## Quick Start

```bash
# Backend
cd backend && pnpm install
cp .env.example .env  # fill DATABASE_URL, JWT_SECRET
pnpm exec prisma generate && pnpm exec prisma db push
pnpm run db:seed       # creates admin/admin123
pnpm dev               # tsx watch → port 3001

# Frontend (separate terminal)
cd frontend && pnpm install
pnpm dev               # vite → port 5173, proxies /api → 3001
```

**Ports:** Backend 3001 (not 3000), Frontend 5173, MySQL 3306, Redis 6379.

---

## Key Architecture

### Route → Service → Prisma

```
backend/src/routes/         # Express routers with authMiddleware
  auth.routes.ts            # /api/auth/*
  topics.routes.ts          # /api/topics/*
  projects.routes.ts        # /api/projects/*
  ai.routes.ts              # /api/ai/* (document generation)
  documents.routes.ts       # /api/documents/*
  graduation.routes.ts      # /api/graduation/* (毕设文档)
  user.routes.ts            # /api/user/* (personal API settings)
  admin.routes.ts           # /api/admin/* (30+ endpoints)

backend/src/services/
  apiProvider.service.ts    # Provider priority resolver + CRUD
  ai.service.ts             # All AI generation (2778 lines)
  graduation.service.ts     # Graduation doc generation

backend/src/middleware/
  auth.middleware.ts        # JWT from httpOnly cookie → req.user
  ban.middleware.ts         # Check user not BANNED
  rate-limit.middleware.ts  # loginLimiter(5/min), generalLimiter(100/15min), aiLimiter(10/hr)
```

### Auth Flow

- JWT stored in **httpOnly cookie** (not localStorage)
- `auth.store.ts` (Pinia) manages user state
- `router/guards.ts`: `beforeEach` checks `requiresAuth`/`requiresAdmin`, restores session via `fetchProfile()` on refresh
- `authMiddleware` sets `req.user = { userId, role, ... }`

### AI Provider Priority

```
getConfigForUser(userId) in apiProvider.service.ts:
  1. UserApiSetting table (if user configured personal key) — highest
  2. ApiProvider table (admin-configured, isActive=true) — middle
  3. Environment variables (MINIMAX_*) — lowest
```

Every `ai.service.ts` / `graduation.service.ts` method accepts `userId?: number`; pass it for per-user config resolution.

### Document Generation Order (Strict)

```
PRD → FRONTEND → BACKEND → API → TASK → CONTEXT_STATE → AGENTS
```

Each doc type depends on previous docs for context. Generation prompt templates in `backend/src/prompts/*.template.ts` (11 templates).

### Database

- Prisma + MySQL (`db push` not `migrate deploy` in production — migration history doesn't match MySQL dialect)
- Key models: `User`, `Topic`, `Project`, `Document` (7 doc types), `GraduationDocument` (6 types), `UserApiSetting`, `ApiProvider`, `SystemConfig`, `AiUsageLog`
- `prisma db seed` = `tsx src/scripts/init-admin.ts`
- `@@unique([projectId, docType])` — one doc per type per project

---

## Build / Test / Verify

```bash
# Backend typecheck (no build needed — tsx runs TS directly)
cd backend && pnpm exec tsc --noEmit

# Backend tests (vitest)
cd backend && npx vitest run

# Frontend typecheck + build
cd frontend && pnpm run build   # runs vue-tsc -b && vite build

# Frontend tests (vitest, jsdom)
cd frontend && npx vitest run
```

- Frontend `tsconfig.json` has `noUnusedLocals: true`, `noUnusedParameters: true` — strict
- Frontend test setup only mocks Element Plus; no actual test files exist yet
- Backend test setup is minimal (`beforeAll`/`afterAll` connect/disconnect); integration tests need real DB
- Both sides use `vitest.config.ts`

---

## Vite Proxy — SSE Handling

`frontend/vite.config.ts` has special proxy config for SSE streams:

| Path | Timeout | Notes |
|------|---------|-------|
| `/api/ai/generate/stream` | 180s | `Connection: keep-alive`, `X-Accel-Buffering: no` |
| `/api/ai/review/stream` | 600s | Same headers, 10min for expert panel review |
| `/api` (general) | default | No special headers |

The SSE proxy config must be duplicated for each streaming endpoint — the `/api` catch-all proxy does not inherit SSE headers.

---

## Production Deployment (腾讯云 VPS)

| Item | Value |
|------|-------|
| IP | `101.43.175.201` |
| SSH alias | `vibecoding-vps` (key: `~/.ssh/vibecoding_vps_ed25519`) |
| Domain | `https://miaofu.work` (Cloudflare proxied) |
| App dir | `/opt/vibecoding` |
| Web dir | `/var/www/vibecoding` |
| Backend service | `vibecoding-backend.service` (systemd, port 3001) |
| Nginx | `/etc/nginx/sites-available/vibecoding.conf` |
| Database | MySQL `vibecoding`, user `vibecoding` |

**Deploy flow (tar.gz from local):**

```bash
# 1. Local verify
cd backend && pnpm exec tsc --noEmit
cd ../frontend && pnpm run build

# 2. Commit + push
git add -A && git commit -m '...' && git push origin main

# 3. Archive + upload
git archive --format=tar.gz -o /tmp/vibecoding-src.tar.gz HEAD
scp /tmp/vibecoding-src.tar.gz vibecoding-vps:/tmp/

# 4. On VPS: extract, preserve .env, install, db sync, build frontend, restart
# (See full deploy script in Production section of this file)
```

**Never** commit `.env` files. **Always** back up `/opt/vibecoding/backend/.env` before wiping the app dir.

**Health check:** `curl -fsS http://127.0.0.1:3001/api/health` → `{"status":"ok",...}`

---

## Framework Quirks & Gotchas

1. **Backend ESM:** `"type": "module"` — imports need `.js` extension (e.g., `from './auth.middleware.js'`), run via `tsx` not `ts-node`
2. **Express v5:** `express` 5.x has different error handling than v4; `app.use((err, req, res, next) => {...})` works
3. **Menu order in schema:** `@@index([key])` is listed after fields but before closing `}` — Prisma syntax
4. **Admin routes are monolithic:** `admin.routes.ts` is 1423 lines with all admin CRUD in one file
5. **`ai.service.ts` is monolithic:** 2778 lines with all generation/review/fix methods
6. **`claude-mem` block at bottom of old AGENTS.md:** Remove it — it's session context, not repo instruction
7. **`AGENTS.md` and `CLAUDE.md` are siblings:** Both exist at root; `CLAUDE.md` has a subset of the same info (outdated). The `AGENTS.md` is the canonical one.
8. **`ban.middleware.ts` is imported but checkBannedMiddleware is not a route-level middleware in most routes** — the service file imports it but routes use it only in specific admin endpoints
9. **Planning docs are out of date** (`STATE.md`, `ROADMAP.md` say all phases complete, but features like graduation documents, user API settings, AI providers were added after)

---

## Project Layout

```
backend/                  # Express API server
  prisma/schema.prisma    # 15 models (234 lines)
  src/
    index.ts              # App entry: middleware → routes → error handler
    routes/               # 8 route files
    services/             # ai.service.ts (2778 lines), apiProvider, graduation
    prompts/              # 11 prompt templates
    middleware/           # auth, ban, rate-limit
    utils/                # jwt, password, excel-import
    scripts/              # init-admin.ts, update-passwords.ts
  tests/                  # 8 test files (vitest)
frontend/                 # Vue 3 SPA
  src/
    api/                  # 9 API client modules
    stores/               # 6 Pinia stores
    views/                # 7 pages + admin/ subfolder
    router/               # index.ts + guards.ts
    components/           # Shared Vue components
    constants/            # tech-options.ts
    utils/                # Unknown — check contents
    __tests__/            # setup.ts only
```

---

## What This File Does NOT Cover

- Individual page/component specifics (the codebase is straightforward Vue SFC)
- Generic Vue/TypeScript best practices (follow framework defaults)
- GSD phase workflow (planning system is dormant — all 5 phases complete)
- CSS/styling conventions (custom vars in `App.vue`, Element Plus overrides)
