---
phase: 01-认证与用户基础
plan: 03b
type: execute
wave: 4
depends_on: [01-03a]
files_modified:
  - frontend/src/stores/auth.store.ts
  - frontend/src/views/Login.vue
autonomous: true
requirements: [AUTH-01, AUTH-02, AUTH-04]
user_setup: []
must_haves:
  truths:
    - "Login page displays form with studentId and password inputs"
    - "Login form validates inputs before submission"
    - "Successful login shows user name in UI"
    - "Login failure shows unified error message"
    - "Pinia store holds user state after login"
    - "Pinia store persists across page refresh (AUTH-04)"
  artifacts:
    - path: "frontend/src/views/Login.vue"
      provides: "Login page UI component"
      contains: "el-form"
      contains: "studentId"
      min_lines: 80
    - path: "frontend/src/stores/auth.store.ts"
      provides: "Pinia auth state management"
      exports: ["useAuthStore"]
      contains: "defineStore('auth'"
      min_lines: 60
  key_links:
    - from: "frontend/src/views/Login.vue"
      to: "frontend/src/stores/auth.store.ts"
      via: "useAuthStore"
      pattern: "useAuthStore\\(\\)"
    - from: "frontend/src/views/Login.vue"
      to: "frontend/src/api/auth.api.ts"
      via: "loginApi"
      pattern: "loginApi\\(\\)"
    - from: "frontend/src/stores/auth.store.ts"
      to: "frontend/src/api/auth.api.ts"
      via: "loginApi, logoutApi, getProfileApi"
      pattern: "loginApi|logoutApi|getProfileApi"
---

<objective>
Create Pinia auth store and Login page component.

Purpose: Implement auth state management (D-18), login UI (D-17), and session persistence via fetchProfile (AUTH-04).
Output: auth.store.ts with login/logout/fetchProfile, Login.vue with Element Plus form.
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
@.planning/phases/01-认证与用户基础/01-03a-SUMMARY.md

# Key decisions from CONTEXT.md
# D-17: Independent login page (not modal)
# D-18: Pinia Store for auth state
# D-20: Unified error message (same as backend)
# D-02: studentId as login field
# D-14: Logout clears state

# API client from Plan 03a
# loginApi, logoutApi, getProfileApi from auth.api.ts
# User interface with studentId, name, role, major, grade, class
</context>

<interfaces>
<!-- Imports from Plan 03a -->

From frontend/src/api/auth.api.ts:
```typescript
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

export async function loginApi(studentId: string, password: string): Promise<LoginResponse>;
export async function logoutApi(): Promise<LogoutResponse>;
export async function getProfileApi(): Promise<User>;
```

<!-- Backend endpoints behavior -->
- POST /api/auth/login: returns user on success, throws error on failure
- POST /api/auth/logout: clears cookie
- GET /api/auth/profile: returns user if cookie valid, throws if not
</interfaces>

<tasks>

<task type="auto" tdd="true">
  <name>Task 0: Create Pinia auth store</name>
  <files>
    frontend/src/stores/auth.store.ts
  </files>
  <read_first>
    - .planning/phases/01-认证与用户基础/01-RESEARCH.md (Pinia store pattern)
    - .planning/phases/01-认证与用户基础/01-CONTEXT.md (D-18: Pinia Store)
    - frontend/src/api/auth.api.ts (from Plan 03a)
    - .planning/phases/01-认证与用户基础/01-CONTEXT.md (D-14: logout clears state)
  </read_first>
  <behavior>
    - Test 1: useAuthStore().user is null initially
    - Test 2: useAuthStore().isAuthenticated is false initially
    - Test 3: login('admin', 'admin123') sets user and isAuthenticated = true
    - Test 4: login('wrong', 'wrong') sets error message, user remains null
    - Test 5: logout() clears user and isAuthenticated = false
    - Test 6: fetchProfile() on page refresh restores user (AUTH-04)
    - Test 7: $reset() clears all state (D-14)
  </behavior>
  <action>
    Create frontend/src/stores/auth.store.ts following RESEARCH.md pattern:
    
    ```typescript
    import { defineStore } from 'pinia';
    import { ref, computed } from 'vue';
    import { loginApi, logoutApi, getProfileApi, User } from '@/api/auth.api';
    
    /**
     * Pinia auth store (D-18)
     * Manages authentication state throughout the application
     */
    export const useAuthStore = defineStore('auth', () => {
      // State
      const user = ref<User | null>(null);
      const loading = ref(false);
      const error = ref<string | null>(null);
      
      // Computed
      const isAuthenticated = computed(() => user.value !== null);
      const isAdmin = computed(() => user.value?.role === 'ADMIN');
      
      // Actions
      
      /**
       * Login action
       * @param studentId Student ID
       * @param password Password
       * @returns true on success, false on failure
       */
      async function login(studentId: string, password: string): Promise<boolean> {
        loading.value = true;
        error.value = null;
        
        try {
          const response = await loginApi(studentId, password);
          user.value = response.user;
          return true;
        } catch (e) {
          // D-20: Unified error message
          error.value = e instanceof Error ? e.message : '登录失败，请检查账号密码';
          return false;
        } finally {
          loading.value = false;
        }
      }
      
      /**
       * Logout action (D-14, AUTH-03)
       * Clears cookie on backend and local state
       */
      async function logout(): Promise<void> {
        try {
          await logoutApi();
        } catch (e) {
          console.error('Logout API error:', e);
        }
        // Clear state regardless of API success
        user.value = null;
        error.value = null;
      }
      
      /**
       * Fetch profile on page refresh (AUTH-04)
       * Restores user state from cookie authentication
       * @returns true if user restored, false if not logged in
       */
      async function fetchProfile(): Promise<boolean> {
        loading.value = true;
        
        try {
          const profile = await getProfileApi();
          user.value = profile;
          return true;
        } catch (e) {
          // Not logged in or session expired
          user.value = null;
          return false;
        } finally {
          loading.value = false;
        }
      }
      
      /**
       * Reset store state (D-14)
       */
      function $reset(): void {
        user.value = null;
        loading.value = false;
        error.value = null;
      }
      
      return {
        // State
        user,
        loading,
        error,
        // Computed
        isAuthenticated,
        isAdmin,
        // Actions
        login,
        logout,
        fetchProfile,
        $reset
      };
    });
    ```
  </action>
  <acceptance_criteria>
    - frontend/src/stores/auth.store.ts exists
    - file uses defineStore('auth', ...)
    - file exports useAuthStore
    - user ref is initialized as null
    - isAuthenticated computed returns user !== null
    - isAdmin computed checks role === 'ADMIN'
    - login function calls loginApi and sets user on success
    - login sets error on failure with message from API
    - logout function calls logoutApi and clears user
    - fetchProfile function calls getProfileApi and restores user
    - $reset function clears all state
    - loading ref for UI feedback
  </acceptance_criteria>
  <verify>
    <automated>grep -q "defineStore('auth'" frontend/src/stores/auth.store.ts && grep -q "export const useAuthStore" frontend/src/stores/auth.store.ts && grep -q "const user = ref" frontend/src/stores/auth.store.ts && grep -q "const isAuthenticated = computed" frontend/src/stores/auth.store.ts && grep -q "async function login" frontend/src/stores/auth.store.ts && grep -q "async function logout" frontend/src/stores/auth.store.ts && grep -q "async function fetchProfile" frontend/src/stores/auth.store.ts && echo "PASS"</automated>
  </verify>
  <done>
    Pinia auth store created with login/logout/fetchProfile actions, user state, isAuthenticated computed (D-18, AUTH-04).
  </done>
</task>

<task type="auto">
  <name>Task 1: Create Login page component</name>
  <files>
    frontend/src/views/Login.vue
  </files>
  <read_first>
    - .planning/phases/01-认证与用户基础/01-RESEARCH.md (Login page pattern reference)
    - .planning/phases/01-认证与用户基础/01-CONTEXT.md (D-17: independent page, D-20: unified error)
    - frontend/src/stores/auth.store.ts (after Task 0)
    - frontend/src/api/auth.api.ts (User interface from Plan 03a)
  </read_first>
  <action>
    Create frontend/src/views/Login.vue with Element Plus form:
    
    ```vue
    <template>
      <div class="login-container">
        <div class="login-card">
          <h1 class="login-title">VibeCoding 教学实践平台</h1>
          <h2 class="login-subtitle">学生登录</h2>
          
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-width="80px"
            @submit.prevent="handleLogin"
          >
            <el-form-item label="学号" prop="studentId">
              <el-input
                v-model="form.studentId"
                placeholder="请输入学号"
                :disabled="loading"
              />
            </el-form-item>
            
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
                show-password
                :disabled="loading"
              />
            </el-form-item>
            
            <el-form-item>
              <el-button
                type="primary"
                native-type="submit"
                :loading="loading"
                class="login-button"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
          
          <el-alert
            v-if="error"
            :title="error"
            type="error"
            show-icon
            :closable="false"
            class="error-alert"
          />
          
          <div class="login-hint">
            <p>初始密码默认为学号</p>
          </div>
        </div>
      </div>
    </template>
    
    <script setup lang="ts">
    import { ref, computed } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import { ElMessage } from 'element-plus';
    import type { FormInstance, FormRules } from 'element-plus';
    import { useAuthStore } from '@/stores/auth.store';
    
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    
    const formRef = ref<FormInstance>();
    const form = ref({
      studentId: '',
      password: ''
    });
    
    const loading = computed(() => authStore.loading);
    const error = computed(() => authStore.error);
    
    // Form validation rules (D-02: studentId required)
    const rules: FormRules = {
      studentId: [
        { required: true, message: '请输入学号', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    };
    
    async function handleLogin() {
      if (!formRef.value) return;
      
      const valid = await formRef.value.validate().catch(() => false);
      if (!valid) return;
      
      const success = await authStore.login(form.value.studentId, form.value.password);
      
      if (success) {
        ElMessage.success('登录成功');
        // Redirect to intended page or dashboard
        const redirect = route.query.redirect as string || '/dashboard';
        router.push(redirect);
      }
      // Error already shown via authStore.error binding
    }
    </script>
    
    <style scoped>
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    
    .login-card {
      width: 400px;
      padding: 40px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    }
    
    .login-title {
      text-align: center;
      margin-bottom: 10px;
      color: #333;
      font-size: 24px;
    }
    
    .login-subtitle {
      text-align: center;
      margin-bottom: 30px;
      color: #666;
      font-size: 16px;
    }
    
    .login-button {
      width: 100%;
    }
    
    .error-alert {
      margin-top: 20px;
    }
    
    .login-hint {
      margin-top: 20px;
      text-align: center;
      color: #999;
      font-size: 12px;
    }
    </style>
    ```
    
    Note: Router import will work after Plan 04 adds router. For now, test form rendering.
  </action>
  <acceptance_criteria>
    - frontend/src/views/Login.vue exists
    - component uses el-form with studentId and password inputs
    - form has validation rules for required fields
    - component imports useAuthStore
    - handleLogin calls authStore.login
    - error displayed via el-alert bound to authStore.error
    - loading state disables inputs and shows button loading
    - login hint shows "初始密码默认为学号"
    - scoped styles for login card layout
  </acceptance_criteria>
  <verify>
    <automated>grep -q "el-form" frontend/src/views/Login.vue && grep -q "studentId" frontend/src/views/Login.vue && grep -q "useAuthStore" frontend/src/views/Login.vue && grep -q "authStore.login" frontend/src/views/Login.vue && grep -q "初始密码默认为学号" frontend/src/views/Login.vue && echo "PASS"</automated>
  </verify>
  <done>
    Login page created with Element Plus form, validation, auth store integration (D-17, D-20).
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| Browser → Frontend | User input in login form (untrusted) |
| Frontend → Pinia Store | State management (trusted internal) |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-03b-01 | T | Form input manipulation | accept | Backend validation is authoritative, frontend just UX |
| T-01-03b-02 | I | Error message exposure | accept | Unified error D-20, no enumeration possible |

</threat_model>

<verification>
Wave 4 frontend auth verification:
1. npm run dev starts frontend server
2. Login page renders at /login
3. Form validates required fields
4. Login with admin/admin123 shows success
5. Login with wrong credentials shows unified error
6. User name appears after successful login
</verification>

<success_criteria>
- Login page with studentId/password form (D-17)
- Pinia auth store with login/logout/fetchProfile (D-18)
- Session persists across refresh (AUTH-04)
</success_criteria>

<output>
After completion, create `.planning/phases/01-认证与用户基础/01-03b-SUMMARY.md`
</output>