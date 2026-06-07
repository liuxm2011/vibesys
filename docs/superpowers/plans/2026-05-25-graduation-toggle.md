# 毕业设计选题开关 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an admin toggle to enable/disable graduation topic selection, with a whitelist for test accounts. When toggled off, students see a dialog instead of entering graduation mode.

**Architecture:** Reuse the existing `SystemConfig` table (key-value pattern) for `graduationEnabled` and `graduationWhitelist`. Backend adds 4 admin endpoints + 1 student-facing status endpoint. Frontend adds switch UI in `GraduationManagement.vue` and dialog guard in `ModeSelect.vue`.

**Tech Stack:** Hono (backend), Vue 3 + Element Plus (frontend), Prisma (SQLite)

---

## File Changes Overview

| File | Action | Responsibility |
|------|--------|---------------|
| `backend/src/routes/admin.routes.ts` | Modify | Add 4 config endpoints for graduationEnabled + graduationWhitelist |
| `backend/src/routes/thesis.routes.ts` | Modify | Add GET `/api/thesis/status` endpoint |
| `frontend/src/api/admin.api.ts` | Modify | Add 4 API functions for admin config |
| `frontend/src/api/thesis.api.ts` | Modify | Add `getGraduationStatus()` function |
| `frontend/src/views/admin/GraduationManagement.vue` | Modify | Add toggle switch + whitelist input at top |
| `frontend/src/views/ModeSelect.vue` | Modify | Add graduation status check + dialog before routing |
| `frontend/src/stores/admin.store.ts` | Modify | Add state + methods for graduation config |
| `frontend/src/types/admin.ts` | No change needed | `SystemConfig` type already has `key: string` field |

---

### Task 1: Backend — Add graduation config endpoints to admin routes

**Files:**
- Modify: `backend/src/routes/admin.routes.ts` (add after the existing `/config/guide` PUT block, around line 934)

- [ ] **Step 1: Add graduationEnabled GET/PUT endpoints**

Insert after the `config/guide` PUT handler block (line 934):

```typescript
// ============================================================
// GRADUATION CONFIG
// ============================================================

router.get('/config/graduationEnabled', async (c) => {
  try {
    const prisma = c.get('prisma');
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'graduationEnabled' }
    });

    if (!config) {
      return c.json({ key: 'graduationEnabled', value: 'false', updatedAt: new Date() });
    }

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Get graduationEnabled error:', error);
    return c.json({ error: '获取毕业设计开关状态失败' }, 500);
  }
});

router.put('/config/graduationEnabled', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { value } = await c.req.json();

    if (value !== 'true' && value !== 'false') {
      return c.json({ error: '值必须为 true 或 false' }, 400);
    }

    const config = await prisma.systemConfig.upsert({
      where: { key: 'graduationEnabled' },
      update: { value },
      create: { key: 'graduationEnabled', value, description: '毕业设计选题开关' }
    });

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Update graduationEnabled error:', error);
    return c.json({ error: '更新毕业设计开关状态失败' }, 500);
  }
});

router.get('/config/graduationWhitelist', async (c) => {
  try {
    const prisma = c.get('prisma');
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'graduationWhitelist' }
    });

    if (!config) {
      return c.json({ key: 'graduationWhitelist', value: '231311111', updatedAt: new Date() });
    }

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Get graduationWhitelist error:', error);
    return c.json({ error: '获取毕业设计白名单失败' }, 500);
  }
});

router.put('/config/graduationWhitelist', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { value } = await c.req.json();

    if (typeof value !== 'string') {
      return c.json({ error: '无效的白名单值' }, 400);
    }

    const config = await prisma.systemConfig.upsert({
      where: { key: 'graduationWhitelist' },
      update: { value },
      create: { key: 'graduationWhitelist', value, description: '毕业设计白名单（逗号分隔学号）' }
    });

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Update graduationWhitelist error:', error);
    return c.json({ error: '更新毕业设计白名单失败' }, 500);
  }
});
```

- [ ] **Step 2: Verify backend compiles**

Run: `cd backend && pnpm exec tsc --noEmit`
Expected: No errors

---

### Task 2: Backend — Add student-facing status endpoint

**Files:**
- Modify: `backend/src/routes/thesis.routes.ts` (add before the existing `GET /topics` route, around line 8)

- [ ] **Step 1: Add GET `/status` endpoint to thesis routes**

Insert at the top of thesis routes, before `router.get('/topics', ...)`:

```typescript
// GET /api/thesis/status — check if graduation mode is enabled for current user
router.get('/status', authMiddleware, async (c) => {
  try {
    const prisma = c.get('prisma');
    const user = c.get('user');

    const enabledConfig = await prisma.systemConfig.findUnique({
      where: { key: 'graduationEnabled' }
    });

    const isEnabled = enabledConfig?.value === 'true';

    if (isEnabled) {
      return c.json({ enabled: true });
    }

    // Check whitelist
    const whitelistConfig = await prisma.systemConfig.findUnique({
      where: { key: 'graduationWhitelist' }
    });

    const whitelist = (whitelistConfig?.value || '').split(',').map(s => s.trim()).filter(Boolean);

    if (whitelist.includes(user.studentId)) {
      return c.json({ enabled: true });
    }

    return c.json({ enabled: false });
  } catch (error) {
    console.error('Graduation status check error:', error);
    // Default to disabled on error for safety
    return c.json({ enabled: false });
  }
});
```

- [ ] **Step 2: Verify backend compiles**

Run: `cd backend && pnpm exec tsc --noEmit`
Expected: No errors

---

### Task 3: Frontend — Add admin API functions

**Files:**
- Modify: `frontend/src/api/admin.api.ts` (add after line 244, before API PROVIDER MANAGEMENT section)
- Modify: `frontend/src/stores/admin.store.ts` (add state + methods)

- [ ] **Step 1: Add 4 config API functions in admin.api.ts**

Insert after line 244 (after `updateGuideApi`), before the `API PROVIDER MANAGEMENT` section:

```typescript
export async function fetchGraduationEnabledApi(): Promise<SystemConfig> {
  return api.get('/api/admin/config/graduationEnabled');
}

export async function updateGraduationEnabledApi(value: string): Promise<SystemConfig> {
  return api.put('/api/admin/config/graduationEnabled', { value });
}

export async function fetchGraduationWhitelistApi(): Promise<SystemConfig> {
  return api.get('/api/admin/config/graduationWhitelist');
}

export async function updateGraduationWhitelistApi(value: string): Promise<SystemConfig> {
  return api.put('/api/admin/config/graduationWhitelist', { value });
}
```

- [ ] **Step 2: Add store state + methods in admin.store.ts**

Add after the `guide` ref (line 41):

```typescript
const graduationEnabled = ref<SystemConfig | null>(null);
const graduationWhitelist = ref<SystemConfig | null>(null);
```

Add after `saveGuide` function (around line 275):

```typescript
async function loadGraduationEnabled() {
  configLoading.value = true;
  error.value = null;
  try {
    graduationEnabled.value = await adminApi.fetchGraduationEnabledApi();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载毕业设计开关状态失败';
  } finally {
    configLoading.value = false;
  }
}

async function saveGraduationEnabled(value: string) {
  error.value = null;
  try {
    graduationEnabled.value = await adminApi.updateGraduationEnabledApi(value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存毕业设计开关状态失败';
    throw e;
  }
}

async function loadGraduationWhitelist() {
  configLoading.value = true;
  error.value = null;
  try {
    graduationWhitelist.value = await adminApi.fetchGraduationWhitelistApi();
  } catch (e) {
    error.value = e instanceof Error ? e.message : '加载毕业设计白名单失败';
  } finally {
    configLoading.value = false;
  }
}

async function saveGraduationWhitelist(value: string) {
  error.value = null;
  try {
    graduationWhitelist.value = await adminApi.updateGraduationWhitelistApi(value);
  } catch (e) {
    error.value = e instanceof Error ? e.message : '保存毕业设计白名单失败';
    throw e;
  }
}
```

Add to `$reset()` function (after `guide.value = null`):

```typescript
graduationEnabled.value = null;
graduationWhitelist.value = null;
```

Add to the return statement:

```typescript
graduationEnabled, graduationWhitelist,
loadGraduationEnabled, saveGraduationEnabled,
loadGraduationWhitelist, saveGraduationWhitelist,
```

- [ ] **Step 3: Verify frontend builds**

Run: `cd frontend && pnpm run build`
Expected: Build succeeds

---

### Task 4: Frontend — Admin toggle UI in GraduationManagement.vue

**Files:**
- Modify: `frontend/src/views/admin/GraduationManagement.vue`

- [ ] **Step 1: Add config section at top of template**

Add a config card above the `el-tabs` in the template (after `<div class="graduation-management">` and before `<el-tabs>`):

```vue
    <div class="config-card">
      <div class="config-row">
        <div class="config-label">
          <span class="config-title">毕业设计选题开关</span>
          <span class="config-desc">关闭后，学生将无法进入毕业设计模块（管理员不受影响）</span>
        </div>
        <el-switch
          v-model="graduationEnabled"
          active-text="已开放"
          inactive-text="未开放"
          :loading="switchLoading"
          @change="handleToggleGraduation"
        />
      </div>
      <div class="config-row" style="margin-top: 12px">
        <div class="config-label">
          <span class="config-title">白名单学号</span>
          <span class="config-desc">不受开关影响的学号，多个学号用英文逗号分隔</span>
        </div>
        <div class="config-input-group">
          <el-input
            v-model="whitelistText"
            placeholder="如: 231311111,231312222"
            style="width: 320px"
            :disabled="switchLoading"
          />
          <el-button type="primary" :loading="whitelistSaving" @click="handleSaveWhitelist">保存白名单</el-button>
        </div>
      </div>
    </div>
```

- [ ] **Step 2: Add script logic**

Add to the `<script setup>` imports:

```typescript
import { useAdminStore } from '@/stores/admin.store';
```

Add reactive state and functions inside `<script setup>`:

```typescript
const adminStore = useAdminStore();
const graduationEnabled = ref(false);
const switchLoading = ref(false);
const whitelistText = ref('');
const whitelistSaving = ref(false);

async function loadGraduationConfig() {
  switchLoading.value = true;
  try {
    await adminStore.loadGraduationEnabled();
    graduationEnabled.value = adminStore.graduationEnabled?.value === 'true';
  } finally {
    switchLoading.value = false;
  }
  try {
    await adminStore.loadGraduationWhitelist();
    whitelistText.value = adminStore.graduationWhitelist?.value || '';
  } catch {
    // ignore whitelist load error
  }
}

async function handleToggleGraduation(val: boolean) {
  switchLoading.value = true;
  try {
    await adminStore.saveGraduationEnabled(val ? 'true' : 'false');
    ElMessage.success(val ? '毕业设计选题已开放' : '毕业设计选题已关闭');
  } catch (e: any) {
    graduationEnabled.value = !val;
    ElMessage.error(e?.message || '操作失败');
  } finally {
    switchLoading.value = false;
  }
}

async function handleSaveWhitelist() {
  whitelistSaving.value = true;
  try {
    await adminStore.saveGraduationWhitelist(whitelistText.value);
    ElMessage.success('白名单已保存');
  } catch (e: any) {
    ElMessage.error(e?.message || '保存白名单失败');
  } finally {
    whitelistSaving.value = false;
  }
}
```

Add to `onMounted`:

```typescript
onMounted(() => {
  loadGraduationConfig();
  loadTopics();
  loadProjects();
});
```

- [ ] **Step 3: Add CSS for config card**

Append to `<style scoped>`:

```css
.config-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.config-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.config-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.config-desc {
  font-size: 12px;
  color: #94a3b8;
}

.config-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
```

- [ ] **Step 4: Verify frontend builds**

Run: `cd frontend && pnpm run build`
Expected: Build succeeds

---

### Task 5: Frontend — Student dialog guard in ModeSelect.vue

**Files:**
- Modify: `frontend/src/views/ModeSelect.vue`
- Modify: `frontend/src/api/thesis.api.ts`

- [ ] **Step 1: Add `getGraduationStatus` in thesis.api.ts**

Add at the end of `frontend/src/api/thesis.api.ts`:

```typescript
export async function getGraduationStatus(): Promise<{ enabled: boolean }> {
  return request<{ enabled: boolean }>('/api/thesis/status');
}
```

- [ ] **Step 2: Add guard in ModeSelect.vue script**

Add import:

```typescript
import { ElMessageBox } from 'element-plus';
import { getGraduationStatus } from '@/api/thesis.api';
```

Replace the existing `selectMode` function with:

```typescript
async function selectMode(mode: 'project' | 'graduation') {
  if (mode === 'graduation') {
    try {
      const { enabled } = await getGraduationStatus();
      if (!enabled) {
        ElMessageBox.alert('毕业设计还未到开放时间，请先使用项目设计功能', '提示', {
          confirmButtonText: '知道了',
          type: 'warning',
        });
        return;
      }
    } catch {
      // On API error, block access for safety
      ElMessageBox.alert('毕业设计还未到开放时间，请先使用项目设计功能', '提示', {
        confirmButtonText: '知道了',
        type: 'warning',
      });
      return;
    }
  }

  appModeStore.setMode(mode);
  if (mode === 'project') {
    router.push('/dashboard');
  } else {
    router.push('/graduation');
  }
}
```

- [ ] **Step 3: Verify frontend builds**

Run: `cd frontend && pnpm run build`
Expected: Build succeeds

---

### Task 6: Seed default config values

**Files:**
- Modify: `backend/src/scripts/init-admin.ts` (add default SystemConfig rows)

- [ ] **Step 1: Add graduation config seeding in init-admin.ts**

Add after the test account creation block (after the closing `}` of the `else` block for test account, around line 76), before the `initAdmin()` call:

```typescript
  // Seed graduation config defaults
  const graduationEnabled = await prisma.systemConfig.findUnique({
    where: { key: 'graduationEnabled' }
  });

  if (!graduationEnabled) {
    await prisma.systemConfig.create({
      data: { key: 'graduationEnabled', value: 'false', description: '毕业设计选题开关' }
    });
    console.log('Default graduationEnabled config created (disabled)');
  }

  const graduationWhitelist = await prisma.systemConfig.findUnique({
    where: { key: 'graduationWhitelist' }
  });

  if (!graduationWhitelist) {
    await prisma.systemConfig.create({
      data: { key: 'graduationWhitelist', value: '231311111', description: '毕业设计白名单（逗号分隔学号）' }
    });
    console.log('Default graduationWhitelist config created (231311111)');
  }
```

- [ ] **Step 2: Run prisma db push to ensure schema is up to date**

Run: `cd backend && pnpm exec prisma db push`
Then run the seed: `cd backend && pnpm exec tsx src/scripts/init-admin.ts`
Expected: Script runs without error, logs "Default graduationEnabled config created (disabled)"

- [ ] **Step 3: Verify backend compiles**

Run: `cd backend && pnpm exec tsc --noEmit`
Expected: No errors

---

### Task 7: End-to-end verification

- [ ] **Step 1: Start backend and verify endpoints**

```bash
cd backend && pnpm dev
```

Then test with curl (in another terminal, after server is up):

```bash
# Login first to get a cookie
curl -X POST http://localhost:3001/api/auth/login -H 'Content-Type: application/json' -d '{"studentId":"admin","password":"admin123"}' -c /tmp/cookies.txt

# Test admin: get graduationEnabled
curl http://localhost:3001/api/admin/config/graduationEnabled -b /tmp/cookies.txt

# Should return: { "key": "graduationEnabled", "value": "false", ... }

# Test admin: enable graduation
curl -X PUT http://localhost:3001/api/admin/config/graduationEnabled -b /tmp/cookies.txt -H 'Content-Type: application/json' -d '{"value":"true"}'

# Should return: { "key": "graduationEnabled", "value": "true", ... }

# Test student status endpoint
curl http://localhost:3001/api/thesis/status -b /tmp/cookies.txt

# Should return: { "enabled": true } (admin is whitelisted or we enabled it)

# Test admin: disable graduation
curl -X PUT http://localhost:3001/api/admin/config/graduationEnabled -b /tmp/cookies.txt -H 'Content-Type: application/json' -d '{"value":"false"}'
```

- [ ] **Step 2: Start frontend and verify UI**

```bash
cd frontend && pnpm dev
```

1. Login as admin → go to 毕业设计管理 → verify switch + whitelist input appear
2. Toggle the switch → verify it saves
3. Edit whitelist → verify it saves
4. Login as student → go to mode select → click 毕业设计 → verify dialog appears (when switch is off)
5. Login as student 231311111 → click 毕业设计 → verify they can enter (even when switch is off)