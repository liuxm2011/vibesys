---
phase: 01-认证与用户基础
plan: 03a
type: execute
wave: 3
depends_on: [01-00, 01-02]
files_modified:
  - frontend/package.json
  - frontend/vite.config.ts
  - frontend/tsconfig.json
  - frontend/src/main.ts
  - frontend/src/App.vue
  - frontend/src/utils/request.ts
  - frontend/src/api/auth.api.ts
autonomous: true
requirements: [AUTH-01, AUTH-02, AUTH-04]
user_setup: []
must_haves:
  truths:
    - "Frontend project structure exists with Vue 3 + Pinia + Element Plus"
    - "Vite proxy configured for backend API"
    - "HTTP request utility supports credentials: 'include'"
    - "Auth API client matches backend endpoints"
    - "Request utility throws errors with API message"
  artifacts:
    - path: "frontend/package.json"
      provides: "Frontend dependencies and scripts"
      contains: "vue"
      contains: "pinia"
      contains: "element-plus"
    - path: "frontend/vite.config.ts"
      provides: "Vite configuration with proxy"
      contains: "proxy"
      contains: "/api"
    - path: "frontend/src/utils/request.ts"
      provides: "HTTP request wrapper with credentials"
      contains: "credentials: 'include'"
      min_lines: 20
    - path: "frontend/src/api/auth.api.ts"
      provides: "Auth API client functions"
      exports: ["loginApi", "logoutApi", "getProfileApi"]
      min_lines: 30
  key_links:
    - from: "frontend/src/api/auth.api.ts"
      to: "frontend/src/utils/request.ts"
      via: "request function"
      pattern: "request\\("
    - from: "frontend/src/utils/request.ts"
      to: "backend /api/auth"
      via: "fetch with credentials: 'include'"
      pattern: "credentials: 'include'"
---

<objective>
Create frontend project scaffolding, HTTP request utility, and auth API client.

Purpose: Establish frontend foundation (Vue 3 + Vite + Element Plus), request utility with cookie support (D-12), and API client matching backend endpoints from Plan 02.
Output: package.json, vite.config.ts, request.ts, auth.api.ts, basic main.ts/App.vue.
</objective>

<execution_context>
@/Users/liuxiangmiao/.claude/get-shit-done/workflows/execute-plan.md
@/Users/liuxiangmiao/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/ROADMAP.md
@.planning/STATE.md
@.planning/phases/01-认证与用户基础/01-CONTEXT.md
@.planning/phases/01-认证与用户基础/01-RESEARCH.md
@.planning/phases/01-认证与用户基础/01-00-SUMMARY.md
@.planning/phases/01-认证与用户基础/01-02-SUMMARY.md

# Key decisions from CONTEXT.md
# D-12: httpOnly Cookie needs credentials: 'include' in fetch
# D-02: studentId as login field
# D-20: Unified error message (same as backend)

# Backend endpoints from Plan 02
# POST /api/auth/login { studentId, password }
# POST /api/auth/logout
# GET /api/auth/profile

# Technical stack
# Vue 3 + Element Plus + Pinia
# Backend runs on port 3000, frontend on 5173
</context>

<interfaces>
<!-- Backend API contract from Plan 02 -->

POST /api/auth/login:
```typescript
// Request
{ studentId: string, password: string }

// Response 200
{ user: { studentId, name, role, major, grade, class } }

// Response 401
{ error: '登录失败，请检查账号密码' }  // D-20 unified
```

POST /api/auth/logout:
```typescript
// Response 200
{ message: '已登出' }
```

GET /api/auth/profile:
```typescript
// Response 200 (requires cookie)
{ studentId, name, role, major, grade, class }

// Response 401
{ error: '请先登录' }
```

<!-- Cookie behavior -->
- httpOnly: true (JS cannot access)
- Automatic browser attachment with credentials: 'include'
- 7-day expiry (D-11)

<!-- Frontend stack from RESEARCH.md -->
- vue: 3.5.32
- pinia: 3.0.4
- vue-router: 5.0.4
- element-plus: 2.13.7
</interfaces>

<tasks>

<task type="auto">
  <name>Task 0: Create frontend project structure and package.json</name>
  <files>
    frontend/package.json
    frontend/vite.config.ts
    frontend/tsconfig.json
    frontend/src/main.ts
    frontend/src/App.vue
  </files>
  <read_first>
    - .planning/phases/01-认证与用户基础/01-RESEARCH.md (frontend dependencies)
    - CLAUDE.md (Vue 3 + TypeScript + Vite + Element Plus + Pinia)
  </read_first>
  <action>
    Create frontend project with Vite + Vue 3 + TypeScript:
    
    1. Create frontend/package.json:
       ```json
       {
         "name": "vibecoding-frontend",
         "version": "1.0.0",
         "type": "module",
         "scripts": {
           "dev": "vite",
           "build": "vue-tsc && vite build",
           "preview": "vite preview"
         },
         "dependencies": {
           "vue": "3.5.32",
           "pinia": "3.0.4",
           "vue-router": "5.0.4",
           "element-plus": "2.13.7"
         },
         "devDependencies": {
           "@vitejs/plugin-vue": "^5.0.0",
           "typescript": "^5.0.0",
           "vite": "^6.0.0",
           "vue-tsc": "^2.0.0"
         }
       }
       ```
    
    2. Create frontend/vite.config.ts:
       ```typescript
       import { defineConfig } from 'vite';
       import vue from '@vitejs/plugin-vue';
       import { fileURLToPath, URL } from 'node:url';
       
       export default defineConfig({
         plugins: [vue()],
         resolve: {
           alias: {
             '@': fileURLToPath(new URL('./src', import.meta.url))
           }
         },
         server: {
           port: 5173,
           proxy: {
             '/api': {
               target: 'http://localhost:3000',
               changeOrigin: true
             }
           }
         }
       });
       ```
    
    3. Create frontend/tsconfig.json with Vue 3 settings
    
    4. Create frontend/src/main.ts:
       ```typescript
       import { createApp } from 'vue';
       import { createPinia } from 'pinia';
       import ElementPlus from 'element-plus';
       import 'element-plus/dist/index.css';
       import App from './App.vue';
       // Router will be added in Plan 04
       
       const app = createApp(App);
       const pinia = createPinia();
       
       app.use(pinia);
       app.use(ElementPlus);
       // app.use(router); // Plan 04
       
       app.mount('#app');
       ```
    
    5. Create frontend/src/App.vue with basic layout placeholder
    
    Run: cd frontend && npm install
  </action>
  <acceptance_criteria>
    - frontend/package.json exists
    - frontend/package.json contains vue: 3.5.32
    - frontend/package.json contains pinia: 3.0.4
    - frontend/package.json contains vue-router: 5.0.4
    - frontend/package.json contains element-plus: 2.13.7
    - frontend/vite.config.ts has proxy for /api to localhost:3000
    - frontend/src/main.ts imports createPinia and ElementPlus
    - frontend/src/main.ts uses pinia and ElementPlus
    - frontend/node_modules exists after npm install
  </acceptance_criteria>
  <verify>
    <automated>grep -q '"vue"' frontend/package.json && grep -q '"pinia"' frontend/package.json && grep -q '"element-plus"' frontend/package.json && grep -q "proxy" frontend/vite.config.ts && test -d frontend/node_modules && echo "PASS"</automated>
  </verify>
  <done>
    Frontend project created with Vue 3, Pinia, Element Plus, Vite proxy for API.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 1: Create HTTP request utility with credentials</name>
  <files>
    frontend/src/utils/request.ts
  </files>
  <read_first>
    - .planning/phases/01-认证与用户基础/01-RESEARCH.md (fetch with credentials)
    - .planning/phases/01-认证与用户基础/01-CONTEXT.md (D-12: httpOnly cookie needs credentials)
    - frontend/vite.config.ts (proxy configuration)
  </read_first>
  <behavior>
    - Test 1: request('/api/health') returns { status: 'ok' }
    - Test 2: request uses credentials: 'include' in fetch options
    - Test 3: request throws error with message when response status >= 400
    - Test 4: request correctly parses JSON response
  </behavior>
  <action>
    Create frontend/src/utils/request.ts for HTTP requests with cookie support:
    
    ```typescript
    /**
     * HTTP request utility with credentials for httpOnly cookie (D-12)
     * Uses fetch API with credentials: 'include' to auto-attach cookies
     */
    
    interface RequestOptions {
      method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
      body?: unknown;
      headers?: Record<string, string>;
    }
    
    interface ApiResponse<T> {
      data: T;
      status: number;
    }
    
    /**
     * Make HTTP request with automatic cookie handling
     * @param url API endpoint path (e.g., '/api/auth/login')
     * @param options Request options
     * @returns Response data
     * @throws Error with message from API if status >= 400
     */
    export async function request<T>(
      url: string,
      options: RequestOptions = {}
    ): Promise<T> {
      const { method = 'GET', body, headers = {} } = options;
      
      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        credentials: 'include',  // D-12: Auto-attach httpOnly cookies
      };
      
      if (body && method !== 'GET') {
        fetchOptions.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, fetchOptions);
      
      const data = await response.json();
      
      if (!response.ok) {
        // Throw error with API message for UI display (D-20)
        throw new Error(data.error || '请求失败');
      }
      
      return data;
    }
    
    /**
     * Convenience methods for common HTTP verbs
     */
    export const api = {
      get: <T>(url: string) => request<T>(url),
      post: <T>(url: string, body: unknown) => request<T>(url, { method: 'POST', body }),
      put: <T>(url: string, body: unknown) => request<T>(url, { method: 'PUT', body }),
      delete: <T>(url: string) => request<T>(url, { method: 'DELETE' }),
    };
    ```
  </action>
  <acceptance_criteria>
    - frontend/src/utils/request.ts exists
    - file exports request function
    - request uses credentials: 'include'
    - request sets Content-Type: application/json
    - request throws Error with API error message when !response.ok
    - file exports api object with get, post, put, delete methods
    - request works with Vite proxy (fetch('/api/health') succeeds)
  </acceptance_criteria>
  <verify>
    <automated>grep -q "credentials: 'include'" frontend/src/utils/request.ts && grep -q "export async function request" frontend/src/utils/request.ts && grep -q "export const api" frontend/src/utils/request.ts && echo "PASS"</automated>
  </verify>
  <done>
    Request utility created with credentials: 'include' for httpOnly cookie, JSON handling, error extraction.
  </done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Create auth API client</name>
  <files>
    frontend/src/api/auth.api.ts
  </files>
  <read_first>
    - backend/src/routes/auth.routes.ts (API endpoints from Plan 02)
    - frontend/src/utils/request.ts (after Task 1)
    - .planning/phases/01-认证与用户基础/01-CONTEXT.md (D-02: studentId field)
  </read_first>
  <behavior>
    - Test 1: loginApi('admin', 'admin123') returns { user: {...} }
    - Test 2: loginApi('wrong', 'wrong') throws Error with '登录失败，请检查账号密码'
    - Test 3: logoutApi() returns { message: '已登出' }
    - Test 4: getProfileApi() returns user info when logged in
    - Test 5: getProfileApi() throws '请先登录' when not logged in
  </behavior>
  <action>
    Create frontend/src/api/auth.api.ts:
    
    ```typescript
    import { api } from '@/utils/request';
    
    // Types matching backend responses
    export interface User {
      studentId: string;
      name: string;
      role: 'STUDENT' | 'ADMIN';
      major: string;
      grade: string;
      class: string;
    }
    
    export interface LoginResponse {
      user: User;
    }
    
    export interface LogoutResponse {
      message: string;
    }
    
    /**
     * Login API (D-02: studentId as account)
     * @param studentId Student ID (login account)
     * @param password Password (initial = studentId for new users)
     * @returns User info on success
     * @throws Error with unified message on failure (D-20)
     */
    export async function loginApi(studentId: string, password: string): Promise<LoginResponse> {
      return api.post<LoginResponse>('/api/auth/login', { studentId, password });
    }
    
    /**
     * Logout API (AUTH-03)
     * Clears httpOnly cookie on backend
     * @returns Success message
     */
    export async function logoutApi(): Promise<LogoutResponse> {
      return api.post<LogoutResponse>('/api/auth/logout');
    }
    
    /**
     * Get current user profile (AUTH-02)
     * Uses cookie for authentication
     * @returns User profile
     * @throws Error if not logged in
     */
    export async function getProfileApi(): Promise<User> {
      return api.get<User>('/api/auth/profile');
    }
    ```
  </action>
  <acceptance_criteria>
    - frontend/src/api/auth.api.ts exists
    - file imports api from '@/utils/request'
    - file exports User interface with studentId, name, role, major, grade, class
    - file exports loginApi function
    - loginApi calls api.post('/api/auth/login', { studentId, password })
    - file exports logoutApi function
    - logoutApi calls api.post('/api/auth/logout')
    - file exports getProfileApi function
    - getProfileApi calls api.get('/api/auth/profile')
  </acceptance_criteria>
  <verify>
    <automated>grep -q "export interface User" frontend/src/api/auth.api.ts && grep -q "export async function loginApi" frontend/src/api/auth.api.ts && grep -q "/api/auth/login" frontend/src/api/auth.api.ts && grep -q "export async function logoutApi" frontend/src/api/auth.api.ts && grep -q "export async function getProfileApi" frontend/src/api/auth.api.ts && echo "PASS"</automated>
  </verify>
  <done>
    Auth API client created with login, logout, profile functions matching backend endpoints.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Browser → Frontend | User input in forms (untrusted) |
| Frontend → Backend API | HTTP requests via proxy (trusted channel) |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-03a-01 | T | Form input manipulation | accept | Backend validation is authoritative, frontend just UX |
| T-01-03a-02 | I | Error message exposure | accept | Unified error D-20, no enumeration possible |
| T-01-03a-03 | S | Token in localStorage | N/A | Not used - httpOnly cookie prevents JS access |

</threat_model>

<verification>
Wave 3 frontend scaffolding verification:
1. npm run dev starts frontend server
2. Frontend renders without errors
3. Request utility exists with credentials: 'include'
4. Auth API client matches backend endpoints
5. Health check via proxy works
</verification>

<success_criteria>
- Frontend project with Vue 3, Pinia, Element Plus, Vite
- Vite proxy configured for /api to backend
- Request utility with credentials: 'include' (D-12)
- Auth API client matching backend endpoints
</success_criteria>

<output>
After completion, create `.planning/phases/01-认证与用户基础/01-03a-SUMMARY.md`
</output>