# Phase 1: 认证与用户基础 - Research

**Researched:** 2026-04-18
**Domain:** Node.js Express JWT Authentication + Vue 3 Pinia State Management
**Confidence:** HIGH

## Summary

This phase establishes local authentication for the VibeCoding teaching platform. Students login with their student ID (学号), with initial password defaulting to student ID. The system uses bcrypt for password hashing, JWT tokens stored in httpOnly cookies for session management, and Pinia for frontend auth state. This is a greenfield project - no existing code to consider.

**Primary recommendation:** Use jsonwebtoken 9.0.3 + bcryptjs 3.0.3 for backend auth, with cookie-parser 1.4.7 for httpOnly cookie handling. Frontend uses Pinia 3.0.4 auth store + Vue Router 5.0.4 navigation guards with meta.requiresAuth pattern.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

#### 认证方式
- **D-01:** 本地认证，不集成学校SSO系统（简化实现）
- **D-02:** 学号作为登录账号，初始密码默认为学号
- **D-03:** 管理员后台批量导入学生数据，自动创建账号

#### 用户数据模型
- **D-04:** 用户表字段：学号(studentId)、姓名、专业、年级、班级、密码、角色、状态
- **D-05:** 角色设计：student（学生）和 admin（管理员）两种角色
- **D-06:** 状态字段：active（正常）、banned（封禁）
- **D-07:** 最小化字段设计，后续按需扩展

#### 密码策略
- **D-08:** 初始密码 = 学号，学生可自行修改密码
- **D-09:** 密码加密使用 bcrypt 算法
- **D-10:** 修改密码功能在个人设置页面提供

#### 会话管理
- **D-11:** JWT Token 方案，Token 有效期 7 天
- **D-12:** Token 存储在 httpOnly Cookie 中（防止 XSS 攻击）
- **D-13:** 浏览器刷新后保持登录状态
- **D-14:** 登出时清除 Cookie 和前端状态

#### 管理员账号
- **D-15:** 系统预设默认管理员账号（初始化脚本创建）
- **D-16:** 默认管理员账号信息：admin / admin123（建议首次登录后修改）

#### 前端实现
- **D-17:** 登录界面采用独立登录页（而非弹窗）
- **D-18:** 前端登录状态使用 Pinia Store 管理
- **D-19:** 全局路由守卫检查登录状态，未登录跳转登录页
- **D-20:** 登录失败统一错误提示（不区分具体错误原因）

### Claude's Discretion

- 登录页面具体布局和样式
- 登录表单验证规则细节
- 错误提示文案设计
- 密码修改页面具体设计
- Token 过期后的处理逻辑（自动跳转登录页或提示）

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within phase scope.

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| AUTH-01 | 用户可通过学校统一认证系统登录 | 本地认证替代SSO (D-01决策)，使用学号+密码登录 |
| AUTH-02 | 登录后获取用户基本信息（姓名、学号、院系） | JWT payload携带用户基本信息，Pinia store存储 |
| AUTH-03 | 用户可安全登出 | 清除httpOnly Cookie + Pinia $reset() |
| AUTH-04 | 会话在浏览器刷新后保持有效 | httpOnly Cookie自动携带，无需localStorage |

</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Password hashing | API / Backend | — | CPU-intensive operation belongs server-side |
| JWT signing/verification | API / Backend | — | Secret must never leave server |
| Cookie management | API / Backend | Frontend Server | Backend sets cookie, frontend server may proxy |
| Auth state storage | Browser / Client | — | Pinia store manages client-side auth state |
| Route protection | Browser / Client | — | Vue Router guards run client-side |
| Login UI | Browser / Client | — | Login page component renders in browser |

## Standard Stack

### Core Backend

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| jsonwebtoken | 9.0.3 | JWT token generation/verification | Most widely used Node.js JWT library, battle-tested [VERIFIED: npm registry] |
| bcryptjs | 3.0.3 | Password hashing (bcrypt algorithm) | Pure JS, zero dependencies, cross-platform [VERIFIED: npm registry] |
| express | 5.2.1 | Web framework | Official Express 5.x with improved async error handling [VERIFIED: npm registry] |
| cookie-parser | 1.4.7 | Cookie parsing middleware | Required for httpOnly cookie JWT storage [VERIFIED: npm registry] |
| @prisma/client | 7.7.0 | Database ORM | Type-safe queries, auto-generated client [VERIFIED: npm registry] |
| prisma | 7.7.0 | Schema migration tool | Declarative schema, migration management [VERIFIED: npm registry] |

### Core Frontend

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vue | 3.5.32 | Frontend framework | Vue 3 with Composition API [VERIFIED: npm registry] |
| pinia | 3.0.4 | State management | Official Vue 3 store, intuitive API [VERIFIED: npm registry] |
| vue-router | 5.0.4 | SPA routing | Official router with navigation guards [VERIFIED: npm registry] |
| element-plus | 2.13.7 | UI component library | Vue 3 enterprise-grade UI [VERIFIED: npm registry] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| cors | 2.8.5 | Cross-origin headers | Backend API CORS configuration |
| helmet | 8.0.0 | Security headers | Express security middleware |
| dotenv | 16.4.5 | Environment variables | JWT secret, database URL |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| bcryptjs | bcrypt (native) | Native bcrypt faster but requires compilation; bcryptjs pure JS, easier deployment |
| jsonwebtoken | jose | jose supports more algorithms, ESM-first; jsonwebtoken more established, CommonJS compatible |
| express | Fastify | Fastify faster but Express ecosystem larger, more middleware available |
| Pinia | Vuex | Vuex deprecated for Vue 3; Pinia is official recommendation |

**Installation (Backend):**
```bash
npm install express jsonwebtoken bcryptjs cookie-parser cors helmet dotenv
npm install prisma @prisma/client
```

**Installation (Frontend):**
```bash
npm install vue pinia vue-router element-plus
npm install -D @types/jsonwebtoken # TypeScript types
```

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Browser / Client                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Vue 3 Application                         │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │ Login Page   │→ │ Pinia Auth   │→ │ Protected Routes │   │   │
│  │  │ Component    │  │ Store        │  │ (Dashboard, etc) │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  │         │                │                    │              │   │
│  │         │                │                    │              │   │
│  │         ▼                ▼                    ▼              │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │              Vue Router beforeEach Guard              │   │   │
│  │  │  if (meta.requiresAuth && !isAuthenticated)          │   │   │
│  │  │      → redirect to /login?redirect=originalPath      │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Request (Cookie auto-attached)
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          API / Backend                              │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     Express Server                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │ /auth/login  │  │ Auth         │  │ Protected        │   │   │
│  │  │ POST         │→ │ Middleware   │→ │ Routes           │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  │         │                │                    │              │   │
│  │         │                │                    │              │   │
│  │         ▼                ▼                    ▼              │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │ bcryptjs     │  │ jwt.verify() │  │ req.user         │   │   │
│  │  │ compare()    │  │ from Cookie  │  │ (decoded payload)│   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────┘   │   │
│  │         │                                                     │   │
│  │         ▼                                                     │   │
│  │  ┌──────────────┐                                             │   │
│  │  │ jwt.sign()   │  ──────────────────────────────────────→   │   │
│  │  │ expiresIn:   │        Set httpOnly Cookie                 │   │
│  │  │ '7d'         │        res.cookie('token', jwt, {          │   │
│  │  └──────────────┘          httpOnly: true,                   │   │
│  │                            secure: true,                     │   │
│  │                            maxAge: 7*24*60*60*1000            │   │
│  │                          })                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Prisma Query
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Database / Storage                           │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                     MySQL Database                           │   │
│  │  ┌──────────────────────────────────────────────────────┐   │   │
│  │  │                    User Table                         │   │   │
│  │  │  - id (auto increment)                                │   │   │
│  │  │  - studentId (unique, 登录账号)                       │   │   │
│  │  │  - name (姓名)                                        │   │   │
│  │  │  - major (专业)                                       │   │   │
│  │  │  - grade (年级)                                       │   │   │
│  │  │  - class (班级)                                       │   │   │
│  │  │  - password (bcrypt hash)                             │   │   │
│  │  │  - role ('student' | 'admin')                         │   │   │
│  │  │  - status ('active' | 'banned')                       │   │   │
│  │  │  - createdAt, updatedAt                               │   │   │
│  │  └──────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── auth.routes.ts      # Login, logout, change password endpoints
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts  # JWT verification from cookie
│   │   ├── utils/
│   │   │   ├── jwt.utils.ts        # Sign/verify token helpers
│   │   │   └── password.utils.ts   # bcrypt hash/compare helpers
│   │   ├── controllers/
│   │   │   └── auth.controller.ts  # Auth logic
│   │   └── scripts/
│   │   │   └── init-admin.ts       # Create default admin account
│   │   └── index.ts                # Express app entry
│   ├── prisma/
│   │   └── schema.prisma           # User model definition
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   │   ├── Login.vue           # Login page component
│   │   │   └── Dashboard.vue       # Post-login dashboard
│   │   ├── stores/
│   │   │   └── auth.store.ts       # Pinia auth state management
│   │   ├── router/
│   │   │   ├── index.ts            # Router configuration
│   │   │   └── guards.ts           # Navigation guards
│   │   ├── api/
│   │   │   └── auth.api.ts         # Login/logout API calls
│   │   ├── utils/
│   │   │   └── request.ts          # Axios/fetch wrapper with credentials
│   │   └── App.vue
│   └── package.json
└── .env                             # JWT_SECRET, DATABASE_URL
```

### Pattern 1: JWT Token with httpOnly Cookie

**What:** Store JWT in httpOnly cookie to prevent XSS attacks, automatic browser attachment.

**When to use:** All authentication flows where XSS prevention is critical.

**Example:**
```typescript
// Source: [CITED: Context7 /auth0/node-jsonwebtoken]
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { studentId, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { studentId }
  });

  if (!user || user.status === 'banned') {
    return res.status(401).json({ error: '登录失败，请检查账号密码' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: '登录失败，请检查账号密码' });
  }

  // Sign JWT with user info
  const token = jwt.sign(
    {
      userId: user.id,
      studentId: user.studentId,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Set httpOnly cookie
  res.cookie('token', token, {
    httpOnly: true,      // Prevent XSS access
    secure: true,        // HTTPS only (development: false)
    sameSite: 'strict',  // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days in ms
  });

  res.json({
    user: {
      studentId: user.studentId,
      name: user.name,
      role: user.role
    }
  });
});
```

### Pattern 2: Auth Middleware with Cookie Verification

**What:** Express middleware that verifies JWT from cookie and attaches user to request.

**When to use:** All protected API routes.

**Example:**
```typescript
// Source: [CITED: Context7 /auth0/node-jsonwebtoken]
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: '请先登录' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach user payload to request
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: '登录已过期，请重新登录' });
    }
    return res.status(401).json({ error: '无效的登录状态' });
  }
};

// Usage
app.get('/api/user/profile', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
```

### Pattern 3: Pinia Auth Store

**What:** Pinia store managing authentication state with login/logout actions.

**When to use:** Frontend auth state management throughout application.

**Example:**
```typescript
// Source: [CITED: Context7 /vuejs/pinia]
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginApi, logoutApi, getProfileApi } from '@/api/auth.api';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null as User | null);
  const isAuthenticated = computed(() => user.value !== null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Actions
  async function login(studentId: string, password: string) {
    loading.value = true;
    error.value = null;
    try {
      const response = await loginApi(studentId, password);
      user.value = response.user;
      return true;
    } catch (err) {
      error.value = '登录失败，请检查账号密码';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    await logoutApi();
    user.value = null;
  }

  async function fetchProfile() {
    try {
      const profile = await getProfileApi();
      user.value = profile;
    } catch {
      user.value = null;
    }
  }

  function $reset() {
    user.value = null;
    error.value = null;
    loading.value = false;
  }

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    fetchProfile,
    $reset
  };
});

interface User {
  studentId: string;
  name: string;
  role: 'student' | 'admin';
}
```

### Pattern 4: Vue Router Navigation Guard

**What:** Global beforeEach guard that checks route meta for auth requirement.

**When to use:** All SPA routing with protected pages.

**Example:**
```typescript
// Source: [CITED: Context7 /vuejs/vue-router]
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/Admin.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    }
  ]
});

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires auth
  if (to.meta.requiresAuth) {
    // Fetch profile if not already loaded
    if (!authStore.user) {
      await authStore.fetchProfile();
    }

    if (!authStore.isAuthenticated) {
      // Redirect to login with return path
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
      return;
    }

    // Check admin-only routes
    if (to.meta.requiresAdmin && authStore.user?.role !== 'admin') {
      next({ name: 'Dashboard' });  // Or 403 page
      return;
    }
  }

  next();
});

export default router;
```

### Pattern 5: Prisma User Schema

**What:** Prisma schema for user model matching D-04~D-07 decisions.

**When to use:** Database schema definition.

**Example:**
```prisma
// Source: [CITED: Context7 /prisma/prisma]
// prisma/schema.prisma

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  studentId String   @unique                    // 登录账号 (D-02)
  name      String                              // 姓名
  major     String                              // 专业
  grade     String                              // 年级
  class     String                              // 班级
  password  String                              // bcrypt hash (D-09)
  role      Role     @default(STUDENT)          // 角色 (D-05)
  status    Status   @default(ACTIVE)           // 状态 (D-06)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([studentId])
  @@index([role])
}

enum Role {
  STUDENT
  ADMIN
}

enum Status {
  ACTIVE
  BANNED
}
```

### Anti-Patterns to Avoid

- **Storing JWT in localStorage:** XSS vulnerability — attackers can steal token via injected scripts. Use httpOnly cookie instead.
- **Weak bcrypt rounds:** Using less than 10 rounds makes passwords vulnerable to brute force. Use 10-12 rounds.
- **Including password hash in JWT payload:** Payload is readable — never include sensitive data.
- **Calling next() multiple times in guard:** Each guard should call next() exactly once.
- **Verifying token in frontend:** JWT verification must happen server-side — frontend cannot safely verify signature.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password hashing | Custom hash function | bcryptjs | bcrypt designed for passwords, includes salt, resistant to GPU attacks |
| JWT token | Custom encoding | jsonwebtoken | JWT has specific structure (header.payload.signature), library handles signing correctly |
| Cookie security | Manual cookie string | cookie-parser + Express res.cookie() | Proper encoding, httpOnly flag handling |
| Auth state | Vuex or manual refs | Pinia | Official Vue 3 solution, type-safe, devtools integration |
| Route protection | Manual if checks | Vue Router meta + beforeEach | Standard pattern, works with nested routes |

**Key insight:** Authentication is a security-critical domain. Custom implementations almost always have subtle vulnerabilities. Use established libraries with proven security track records.

## Runtime State Inventory

> Greenfield project — no existing runtime state.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — new project | Initialize MySQL database, run Prisma migration |
| Live service config | None — new project | Create .env with JWT_SECRET, DATABASE_URL |
| OS-registered state | None — new project | None |
| Secrets/env vars | None — new project | Generate JWT_SECRET (256-bit random), configure DATABASE_URL |
| Build artifacts | None — new project | None |

## Common Pitfalls

### Pitfall 1: CORS with Cookies
**What goes wrong:** Frontend cannot receive/set cookies due to CORS configuration.
**Why it happens:** Cookies require specific CORS settings: credentials: 'include' on frontend, cors({ origin, credentials: true }) on backend.
**How to avoid:** Configure CORS explicitly with origin whitelist and credentials enabled.
**Warning signs:** Login succeeds but subsequent requests fail with 401; browser DevTools shows no cookie set.

### Pitfall 2: bcrypt Timing Attack
**What goes wrong:** Password comparison reveals information via response time differences.
**Why it happens:** Non-constant-time comparison or error messages differ for "user not found" vs "wrong password".
**How to avoid:** Use bcrypt.compare (constant-time), return identical error message for all auth failures (D-20).
**Warning signs:** Different response times for valid vs invalid users.

### Pitfall 3: JWT Secret Weakness
**What goes wrong:** JWT secret too short or predictable, allowing token forgery.
**Why it happens:** Using "secret" or simple strings as JWT_SECRET.
**How to avoid:** Generate 256-bit random secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
**Warning signs:** JWT_SECRET less than 32 characters, or using default/example values.

### Pitfall 4: Token Expiration Handling
**What goes wrong:** Frontend shows protected route content briefly before redirecting.
**Why it happens:** fetchProfile call fails but UI already rendered based on stale state.
**How to avoid:** Check isAuthenticated in guard before route enter, handle 401 responses with immediate redirect.
**Warning signs:** Flash of protected content before login page appears.

### Pitfall 5: bcryptjs vs bcrypt Confusion
**What goes wrong:** Native bcrypt fails to compile on some systems or Docker containers.
**Why it happens:** bcrypt requires native C compilation; bcryptjs is pure JavaScript.
**How to avoid:** Use bcryptjs for cross-platform compatibility and easier deployment.
**Warning signs:** Build errors mentioning "bcrypt", "node-gyp", or "binding.node".

## Code Examples

### Login API with Cookie

```typescript
// Source: [CITED: Context7 /auth0/node-jsonwebtoken + /dcodeio/bcrypt.js]
// backend/src/routes/auth.routes.ts

import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req, res) => {
  const { studentId, password } = req.body;

  // Validate input
  if (!studentId || !password) {
    return res.status(400).json({ error: '请输入学号和密码' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { studentId }
    });

    // Unified error message (D-20)
    if (!user || user.status === 'banned') {
      return res.status(401).json({ error: '登录失败，请检查账号密码' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '登录失败，请检查账号密码' });
    }

    // JWT payload with essential info (AUTH-02)
    const token = jwt.sign(
      {
        userId: user.id,
        studentId: user.studentId,
        name: user.name,
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }  // D-11
    );

    // httpOnly Cookie (D-12)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: {
        studentId: user.studentId,
        name: user.name,
        role: user.role,
        major: user.major,
        grade: user.grade,
        class: user.class
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: '已登出' });
});

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    res.json({
      studentId: user?.studentId,
      name: user?.name,
      role: user?.role,
      major: user?.major,
      grade: user?.grade,
      class: user?.class
    });
  } catch {
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

export default router;
```

### Initialize Default Admin

```typescript
// backend/src/scripts/init-admin.ts

import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initAdmin() {
  const existingAdmin = await prisma.user.findUnique({
    where: { studentId: 'admin' }
  });

  if (existingAdmin) {
    console.log('Admin already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      studentId: 'admin',
      name: '系统管理员',
      major: '系统',
      grade: '系统',
      class: '系统',
      password: hashedPassword,
      role: 'ADMIN',
      status: 'ACTIVE'
    }
  });

  console.log('Default admin created: admin / admin123');
}

initAdmin()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| localStorage JWT | httpOnly cookie JWT | 2016+ | XSS protection, automatic browser handling |
| bcrypt native (C binding) | bcryptjs (pure JS) | 2017+ | Cross-platform, easier Docker deployment |
| Vuex | Pinia | Vue 3 (2020) | TypeScript support, simpler API, modular by default |
| Express 4.x async try-catch | Express 5.x auto catch | Express 5 (2024) | No need for wrapper functions for async errors |

**Deprecated/outdated:**
- Express 3.x: Router pattern changed significantly, upgrade required
- session-based auth with express-session: JWT is simpler for SPA, no server-side session storage needed

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | MySQL database already provisioned or will be before execution | Environment Availability | Development blocked until database available |
| A2 | HTTPS will be available in production for secure cookies | Cookie Security | httpOnly cookies with secure:true fail in development without proxy |

**Note:** Only 2 assumptions — most stack choices verified via Context7 and npm registry.

## Open Questions

1. **Database provisioning status**
   - What we know: MySQL is specified in tech stack, DATABASE_URL needed
   - What's unclear: Is MySQL already installed/provisioned? Local or cloud?
   - Recommendation: Include database setup step in Wave 0 if not available

2. **HTTPS in development**
   - What we know: secure:true required for production cookies
   - What's unclear: Will development use HTTPS proxy or should we use secure:false in dev?
   - Recommendation: Set secure based on NODE_ENV: `secure: process.env.NODE_ENV === 'production'`

## Environment Availability

> Greenfield project — external dependencies to be installed.

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime | Yes | 24.13.0 | — |
| npm | Package manager | Yes | 11.6.2 | — |
| MySQL | Database | Unknown | — | SQLite via Prisma (dev only) |
| OpenSSL/HTTPS | Secure cookies | Unknown | — | secure:false in development |

**Missing dependencies with no fallback:**
- MySQL database — planner should include database setup task or verify availability

**Missing dependencies with fallback:**
- HTTPS in development — can use secure:false cookie flag

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (recommended for Vite-based Vue 3 project) |
| Config file | vitest.config.ts (to be created in Wave 0) |
| Quick run command | `vitest run --reporter=verbose` |
| Full suite command | `vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | User login with studentId/password | integration | `vitest run backend/tests/auth.login.test.ts` | Wave 0 |
| AUTH-02 | User info returned after login | unit | `vitest run backend/tests/jwt.payload.test.ts` | Wave 0 |
| AUTH-03 | Logout clears cookie | integration | `vitest run backend/tests/auth.logout.test.ts` | Wave 0 |
| AUTH-04 | Session persists across refresh | e2e | `vitest run frontend/tests/auth.persist.test.ts` | Wave 0 |

### Sampling Rate
- **Per task commit:** `vitest run --reporter=verbose`
- **Per wave merge:** `vitest run`
- **Phase gate:** Full suite green before /gsd-verify-work

### Wave 0 Gaps
- [ ] `vitest.config.ts` — framework configuration
- [ ] `backend/tests/setup.ts` — Prisma test database setup
- [ ] `backend/tests/auth.login.test.ts` — covers AUTH-01, AUTH-02
- [ ] `backend/tests/auth.logout.test.ts` — covers AUTH-03
- [ ] `frontend/tests/auth.store.test.ts` — covers Pinia auth state
- [ ] `frontend/tests/router.guard.test.ts` — covers navigation guard logic

*(Wave 0: Existing test infrastructure does not cover phase requirements — all test files to be created)*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | Yes | bcryptjs + JWT (jsonwebtoken) |
| V3 Session Management | Yes | httpOnly Cookie + JWT expiration |
| V4 Access Control | Yes | Vue Router guards + Express middleware role check |
| V5 Input Validation | Yes | Request body validation (express-validator or manual) |
| V6 Cryptography | Yes | bcrypt (10 rounds) + JWT HMAC-SHA256 |

### Known Threat Patterns for Node.js + Express Auth

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| XSS stealing token | Information Disclosure | httpOnly Cookie prevents JS access |
| CSRF login attack | Tampering | sameSite: 'strict' cookie attribute |
| Brute force password | Tampering | bcrypt slow hashing, rate limiting (future) |
| JWT forgery | Tampering | Strong random JWT_SECRET (256-bit) |
| Timing attack auth | Information Disclosure | bcrypt.compare constant-time, unified error messages |

## Sources

### Primary (HIGH confidence)
- Context7 /auth0/node-jsonwebtoken - JWT sign/verify, expiration handling
- Context7 /dcodeio/bcrypt.js - hash/compare patterns, timing attack prevention
- Context7 /prisma/prisma - User model schema, MySQL provider
- Context7 /vuejs/pinia - defineStore setup syntax, $subscribe, $reset
- Context7 /vuejs/vue-router - beforeEach guard, meta fields, route protection
- npm registry - Version verification: jsonwebtoken 9.0.3, bcryptjs 3.0.3, express 5.2.1

### Secondary (MEDIUM confidence)
- Express 4.x Router pattern (Context7 /expressjs/express)
- Cookie-parser usage pattern (npm documentation implied by express ecosystem)

### Tertiary (LOW confidence)
- MySQL provisioning status (ASSUMED — needs user confirmation)
- HTTPS development availability (ASSUMED — needs environment check)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified via npm registry, patterns from Context7 official docs
- Architecture: HIGH - Standard patterns from official library documentation
- Pitfalls: HIGH - Common auth security issues well-documented in community

**Research date:** 2026-04-18
**Valid until:** 30 days (stable libraries, minor version updates possible)

---

*Generated by GSD Research Phase — 2026-04-18*