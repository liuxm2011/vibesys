<template>
  <div class="dashboard-container">
    <!-- Main Header -->
    <el-header class="dashboard-header" height="72px">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-box">
            <div class="logo-mini">VB</div>
            <div class="logo-text">
              <h1 class="platform-name">VibeCoding</h1>
              <span class="platform-tag">教学实践平台</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="nav-actions">
            <el-button
              v-if="isAdmin"
              type="warning"
              plain
              @click="router.push('/admin')"
              class="nav-item"
            >
              <el-icon><Monitor /></el-icon>管理后台
            </el-button>
            <el-button
              v-if="!isAdmin"
              type="primary"
              @click="apiDialogVisible = true"
              class="nav-item action-btn-pro"
            >
              <el-icon><Connection /></el-icon>API 设置
            </el-button>
            <el-button
              v-if="!isAdmin"
              type="primary"
              @click="router.push('/topics')"
              class="nav-item action-btn-pro"
            >
              <el-icon><FolderAdd /></el-icon>选题管理
            </el-button>
          </div>
          <el-divider direction="vertical" class="header-divider" />
          <div class="user-profile">
            <el-dropdown trigger="click">
              <div class="user-info-trigger">
                <el-avatar :size="36" class="user-avatar">{{ user?.name?.charAt(0) }}</el-avatar>
                <div class="user-meta">
                  <span class="user-name">{{ user?.name }}</span>
                  <span class="user-role">{{ isAdmin ? '管理员' : '学生用户' }}</span>
                </div>
                <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="passwordDialogVisible = true">
                    <el-icon><Key /></el-icon>修改密码
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout" class="logout-item">
                    <el-icon><SwitchButton /></el-icon>退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </el-header>

    <div class="dashboard-content-wrapper">
      <!-- Welcome Section: Compact & Integrated -->
      <section class="welcome-banner">
        <div class="banner-inner">
          <div class="welcome-info">
            <h2 class="welcome-text">你好，{{ user?.name }} 👋</h2>
            <p class="welcome-subtext">欢迎回来！准备好开启新的编码旅程了吗？</p>
          </div>
          <div class="stats-overview" v-if="!isAdmin">
            <div class="stat-card">
              <div class="stat-icon projs"><el-icon><Folder /></el-icon></div>
              <div class="stat-content">
                <span class="stat-value">{{ projectStore.projectCount }}</span>
                <span class="stat-label">已参与项目</span>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon limit"><el-icon><DataLine /></el-icon></div>
              <div class="stat-content">
                <span class="stat-value">10</span>
                <span class="stat-label">总项目额度</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Layout Grid -->
      <div class="main-content-layout">
        <el-row :gutter="24">
          <!-- Left Column: Projects (Focus Area) -->
          <el-col :span="isAdmin ? 24 : 17">
            <div class="projects-section" v-if="!isAdmin">
              <div class="section-header-pro">
                <div class="title-group">
                  <h3>我的项目列表</h3>
                  <span class="subtitle">管理你的所有实践项目</span>
                </div>
              </div>

              <!-- Project Cards Grid -->
              <div v-if="projectStore.projects.length > 0" class="project-grid-pro">
                <el-card
                  v-for="project in projectStore.projects"
                  :key="project.id"
                  shadow="hover"
                  class="project-card-pro"
                  @click="handleProjectClick(project)"
                >
                  <div class="project-card-header">
                    <div class="project-type-tag" :class="project.topic?.domain">
                      {{ project.topic?.domain === 'SE' ? '软件工程' : '大数据' }}
                    </div>
                    <el-tag :type="projectStore.getStatusTagType(project.status)" effect="light" size="small">
                      {{ projectStore.getStatusText(project.status) }}
                    </el-tag>
                  </div>
                  <div class="project-card-main">
                    <h4 class="project-title-pro">{{ project.topic?.title }}</h4>
                    <p class="project-desc">{{ project.topic?.description }}</p>
                  </div>
                  <div class="project-card-footer">
                    <span class="create-time">
                      <el-icon><Calendar /></el-icon> {{ formatDate(project.createdAt) }}
                    </span>
                    <el-button
                      type="danger"
                      size="small"
                      link
                      class="delete-btn"
                      @click.stop="handleDeleteProject(project.id)"
                    >
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </el-card>
              </div>

              <!-- Empty State -->
              <el-empty
                v-else
                description="暂无进行中的项目"
                class="empty-projects-pro"
                :image-size="160"
              >
                <template #extra>
                  <p class="empty-hint">探索课题池，开启你的第一个项目</p>
                  <el-button type="primary" @click="router.push('/topics')" size="large" class="action-btn-pro">
                    前往选题池
                  </el-button>
                </template>
              </el-empty>
            </div>

            <!-- Admin Content Placeholder -->
            <div v-else class="admin-full-view">
              <el-card shadow="never" class="admin-welcome-card">
                <el-result
                  icon="success"
                  title="管理员控制台"
                  sub-title="欢迎使用 VibeCoding 管理系统"
                >
                  <template #extra>
                    <el-button type="primary" @click="router.push('/admin')">进入后台管理系统</el-button>
                  </template>
                </el-result>
              </el-card>
            </div>
          </el-col>

          <!-- Right Column: Info & Tools (Secondary Area) -->
          <el-col :span="7" v-if="!isAdmin">
            <div class="sidebar-info-stack">
              <!-- Announcement Card -->
              <el-card class="side-info-card" shadow="never">
                <template #header>
                  <div class="side-card-header">
                    <div class="side-card-title">
                      <el-icon><Bell /></el-icon>
                      <span>平台公告</span>
                    </div>
                  </div>
                </template>
                <div v-if="systemConfig.announcement" class="side-announcement-box">
                  <div class="announcement-text">{{ unescapeText(systemConfig.announcement) }}</div>
                  <div class="announcement-date" v-if="systemConfig.updatedAt.announcement">
                    {{ formatDateTime(systemConfig.updatedAt.announcement) }}
                  </div>
                </div>
                <el-empty v-else description="暂无公告" :image-size="48" class="mini-empty" />
              </el-card>

              <!-- Guide Card -->
              <el-card class="side-info-card" shadow="never">
                <template #header>
                  <div class="side-card-header">
                    <div class="side-card-title">
                      <el-icon><Reading /></el-icon>
                      <span>使用指南</span>
                    </div>
                  </div>
                </template>
                <div v-if="systemConfig.guide" class="side-guide-box">
                  <div class="guide-text">{{ unescapeText(systemConfig.guide) }}</div>
                </div>
                <el-empty v-else description="暂无指南" :image-size="48" class="mini-empty" />
              </el-card>

              <!-- Quick Start Card -->
              <el-card class="side-info-card quick-start-card" shadow="never">
                <div class="quick-start-content">
                  <h4>遇到问题？</h4>
                  <p>查看常见问题解答或联系导师指导</p>
                  <el-button type="primary" plain class="full-width" @click="contactDialogVisible = true">联系支持</el-button>
                </div>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <el-dialog
      v-model="apiDialogVisible"
      title="个人 API 设置"
      width="560px"
      :close-on-click-modal="false"
      align-center
    >
      <el-form :model="apiForm" label-position="top" ref="apiFormRef">
        <!-- Quota hint -->
        <el-alert
          v-if="apiForm.baseURL === DEFAULT_BASE_URL"
          type="info"
          :closable="false"
          show-icon
          class="quota-hint"
        >
          <template #title>
            ModelScope 免费额度：每日 2,000 次调用，
            <a href="https://modelscope.cn/my/myaccesstoken" target="_blank" class="quota-link">查看用量</a>
          </template>
        </el-alert>

        <el-form-item label="API 地址" prop="baseURL">
          <el-input v-model="apiForm.baseURL" placeholder="https://api-inference.modelscope.cn/v1">
            <template #prepend>URL</template>
          </el-input>
          <p class="form-hint">默认为 ModelScope 魔搭社区 API</p>
        </el-form-item>

        <el-form-item label="API Key" prop="apiKey">
          <el-input
            v-model="apiForm.apiKey"
            :placeholder="savedKeyHint || '请输入你的 ModelScope API Key'"
            show-password
            clearable
          >
            <template #prefix>
              <el-icon v-if="hasSavedSettings" color="#67c23a"><Lock /></el-icon>
            </template>
          </el-input>
          <p class="form-hint">
            <template v-if="hasSavedSettings">
              <el-icon color="#67c23a" style="vertical-align: middle;"><CircleCheckFilled /></el-icon>
              <span style="vertical-align: middle; margin-left: 4px;">Key 已保存，留空则不修改</span>
            </template>
            <template v-else>
              在
              <a href="https://modelscope.cn/my/myaccesstoken" target="_blank" class="quota-link">ModelScope 令牌管理</a>
              获取
            </template>
          </p>
        </el-form-item>

        <el-form-item label="选择模型" prop="model">
          <el-select v-model="apiForm.model" placeholder="请选择模型" style="width: 100%">
            <el-option
              v-for="m in modelOptions"
              :key="m.value"
              :label="m.label"
              :value="m.value"
            >
              <span>{{ m.label }}</span>
              <span class="model-id-hint">{{ m.value }}</span>
            </el-option>
          </el-select>
          <p class="form-hint">使用选中的模型进行文档生成</p>
        </el-form-item>

        <!-- Test result -->
        <div v-if="testResult" class="test-result" :class="{ success: testResult.success, fail: !testResult.success }">
          <el-icon v-if="testResult.success" color="#67c23a"><SuccessFilled /></el-icon>
          <el-icon v-else color="#f56c6c"><WarningFilled /></el-icon>
          <div class="test-result-text">
            <span>{{ testResult.message }}</span>
            <span v-if="testResult.response" class="test-response">回复: "{{ testResult.response }}"</span>
          </div>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="handleClearApiSettings" v-if="hasSavedSettings">清除设置</el-button>
        <el-button @click="apiDialogVisible = false">关闭</el-button>
        <el-button :loading="testing" @click="handleTestConnection">测试连接</el-button>
        <el-button type="primary" :loading="saving" @click="handleSaveApiSettings">保存设置</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="contactDialogVisible"
      title="联系支持"
      width="420px"
      :close-on-click-modal="true"
      align-center
    >
      <div class="contact-dialog-content">
        <p>如有问题，请通过以下邮箱联系：</p>
        <div class="email-box">liuxm2011@gmail.com</div>
      </div>
      <template #footer>
        <el-button type="primary" @click="contactDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <SelfPasswordDialog
      v-model:visible="passwordDialogVisible"
      @success="handlePasswordChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Monitor,
  FolderAdd,
  Folder,
  DataLine,
  Key,
  Bell,
  Reading,
  ArrowDown,
  Calendar,
  SwitchButton,
  Delete,
  Connection
} from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth.store';
import { useProjectStore } from '@/stores/project.store';
import { useAppModeStore } from '@/stores/appMode.store';
import type { Project } from '@/types/project';
import SelfPasswordDialog from '@/components/SelfPasswordDialog.vue';
import { fetchStudentSystemConfigApi } from '@/api/auth.api';
import {
  fetchUserApiSettingApi,
  saveUserApiSettingApi,
  testUserApiSettingApi,
} from '@/api/user.api';
import { SuccessFilled, WarningFilled, Lock, CircleCheckFilled } from '@element-plus/icons-vue';
import type { FormInstance } from 'element-plus';

const DEFAULT_BASE_URL = 'https://api-inference.modelscope.cn/v1';

const MODEL_OPTIONS = [
  { label: 'DeepSeek V4 Flash', value: 'deepseek-ai/DeepSeek-V4-Flash' },
  { label: 'Kimi K2.6', value: 'moonshotai/Kimi-K2.6' },
  { label: 'MiMo V2.5', value: 'XiaomiMiMo/MiMo-V2.5' },
  { label: 'GLM 5.1', value: 'ZhipuAI/GLM-5.1' },
] as const;

interface ApiForm {
  baseURL: string;
  apiKey: string;
  model: string;
}

interface TestResult {
  success: boolean;
  latencyMs: number;
  message: string;
  response?: string;
}

const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();
const appModeStore = useAppModeStore();
const passwordDialogVisible = ref(false);
const contactDialogVisible = ref(false);
const apiDialogVisible = ref(false);
const saving = ref(false);
const testing = ref(false);
const testResult = ref<TestResult | null>(null);
const hasSavedSettings = ref(false);
const savedKeyHint = ref('');
const apiFormRef = ref<FormInstance>();

const modelOptions = [...MODEL_OPTIONS];

watch(apiDialogVisible, (val) => {
  if (val) {
    testResult.value = null;
    loadApiSetting();
  }
});

const apiForm = ref<ApiForm>({
  baseURL: DEFAULT_BASE_URL,
  apiKey: '',
  model: MODEL_OPTIONS[0].value,
});

const systemConfig = ref({
  announcement: '',
  guide: '',
  updatedAt: {
    announcement: null as string | null,
    guide: null as string | null
  }
});

const user = computed(() => authStore.user);
const isAdmin = computed(() => authStore.user?.role === 'ADMIN');

onMounted(async () => {
  if (!isAdmin.value) {
    const [projectsLoaded] = await Promise.all([
      projectStore.fetchProjects(),
      loadStudentSystemConfig(),
      loadApiSetting(),
    ]);

    const success = projectsLoaded;
    if (!success) {
      ElMessage.error(projectStore.error || '获取项目列表失败');
    }
  }
});

async function handleLogout() {
  await authStore.logout();
  appModeStore.clearMode();
  ElMessage.success('已退出登录');
  router.push('/login');
}

function handlePasswordChanged() {
  ElMessage.success('密码已更新，下次登录请使用新密码');
}

function unescapeText(text: string): string {
  return text.replace(/\\n/g, '\n');
}

async function loadApiSetting() {
  try {
    const res = await fetchUserApiSettingApi();
    if (res.exists && res.setting) {
      hasSavedSettings.value = true;
      savedKeyHint.value = res.setting.hasRealKey ? '已保存的 Key（留空则不修改）' : '';
      apiForm.value.baseURL = res.setting.baseURL || DEFAULT_BASE_URL;
      apiForm.value.model = res.setting.model || MODEL_OPTIONS[0].value;
    }
  } catch {
    // Ignore errors on load
  }
}

async function handleSaveApiSettings() {
  if (!apiForm.value.apiKey.trim() && !hasSavedSettings.value) {
    ElMessage.warning('请输入 API Key');
    return;
  }
  if (!apiForm.value.baseURL.trim()) {
    ElMessage.warning('请输入 API 地址');
    return;
  }
  if (!apiForm.value.model) {
    ElMessage.warning('请选择模型');
    return;
  }

  saving.value = true;
  try {
    const keyToSave = apiForm.value.apiKey.trim() || undefined;
    await saveUserApiSettingApi({
      baseURL: apiForm.value.baseURL.trim(),
      apiKey: keyToSave,
      model: apiForm.value.model,
    });
    hasSavedSettings.value = true;
    savedKeyHint.value = '已保存的 Key（留空则不修改）';
    ElMessage.success('API 设置已保存');
    apiDialogVisible.value = false;
  } catch (e: any) {
    ElMessage.error(e?.message || '保存失败');
  } finally {
    saving.value = false;
  }
}

async function handleTestConnection() {
  const key = apiForm.value.apiKey.trim() || undefined;
  if (!key && !hasSavedSettings.value) {
    ElMessage.warning('请先输入 API Key');
    return;
  }
  if (!apiForm.value.baseURL.trim()) {
    ElMessage.warning('请输入 API 地址');
    return;
  }
  if (!apiForm.value.model) {
    ElMessage.warning('请选择模型');
    return;
  }

  testing.value = true;
  testResult.value = null;
  try {
    testResult.value = await testUserApiSettingApi({
      baseURL: apiForm.value.baseURL.trim(),
      apiKey: key || '__saved__',
      model: apiForm.value.model,
    });
  } catch (e: any) {
    testResult.value = { success: false, latencyMs: 0, message: e?.message || '测试失败' };
  } finally {
    testing.value = false;
  }
}

function handleClearApiSettings() {
  apiForm.value.apiKey = '';
  apiForm.value.baseURL = DEFAULT_BASE_URL;
  apiForm.value.model = MODEL_OPTIONS[0].value;
  testResult.value = null;
  hasSavedSettings.value = false;
  savedKeyHint.value = '';
}

async function loadStudentSystemConfig() {
  try {
    systemConfig.value = await fetchStudentSystemConfigApi();
  } catch (error: any) {
    ElMessage.error(error?.message || '获取平台公告失败');
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function handleProjectClick(project: Project): void {
  router.push(`/projects/${project.id}`);
}

async function handleDeleteProject(projectId: number): Promise<void> {
  try {
    await ElMessageBox.confirm(
      '确定要删除该项目吗？此操作不可恢复。',
      '删除项目',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        draggable: true,
      }
    );

    const success = await projectStore.deleteProject(projectId);
    if (success) {
      ElMessage.success('项目已删除');
    } else {
      ElMessage.error(projectStore.error || '删除失败');
    }
  } catch (e) {
    // User cancelled
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #f6f8fb;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

/* Header Refinement */
.dashboard-header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #edf2f7;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo-mini {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  font-weight: 800;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.platform-name {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
}

.platform-tag {
  font-weight: 500;
  color: #94a3b8;
  font-size: 12px;
  letter-spacing: 0.05em;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.header-divider {
  height: 24px !important;
  margin: 0 4px !important;
}

.nav-actions {
  display: flex;
  align-items: center;
}

.action-btn-pro {
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  border: none !important;
  padding: 0 20px;
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-pro:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.5);
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 12px;
  transition: all 0.2s;
  height: 48px;
}

.user-info-trigger:hover {
  background-color: #f1f5f9;
}

.user-meta {
  display: flex;
  flex-direction: column;
  justify-content: center;
  line-height: 1.2;
}

.user-name {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.user-role {
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

/* Welcome Banner */
.welcome-banner {
  background: white;
  margin-bottom: 32px;
  border-bottom: 1px solid #edf2f7;
}

.banner-inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-text {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.welcome-subtext {
  color: #64748b;
  margin: 8px 0 0;
  font-size: 16px;
}

.stats-overview {
  display: flex;
  gap: 24px;
}

.stat-card {
  background: #f8fafc;
  padding: 16px 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #f1f5f9;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-icon.projs { background: #e0e7ff; color: #4f46e5; }
.stat-icon.limit { background: #fef2f2; color: #ef4444; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
}

/* Main Layout Wrapper */
.dashboard-content-wrapper {
  padding-bottom: 60px;
}

.main-content-layout {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 40px;
}

/* Projects Section */
.section-header-pro {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
}

.title-group h3 {
  font-size: 22px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.subtitle {
  font-size: 14px;
  color: #94a3b8;
  font-weight: 500;
}

.project-grid-pro {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.project-card-pro {
  border-radius: 20px;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
}

.project-card-pro:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.05);
  border-color: #6366f1;
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.project-type-tag {
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 8px;
  letter-spacing: 0.02em;
}

.project-type-tag.SE { background: #eff6ff; color: #2563eb; }
.project-type-tag.BD { background: #fff1f2; color: #e11d48; }

.project-title-pro {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 12px;
  line-height: 1.4;
}

.project-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3.2em;
}

.project-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.create-time {
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 4px;
}

.delete-btn {
  color: #94a3b8 !important;
}

.delete-btn:hover {
  color: #ef4444 !important;
}

/* Sidebar Info Stack */
.sidebar-info-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.side-info-card {
  border-radius: 20px;
  border: 1px solid #f1f5f9;
}

.side-card-header {
  display: flex;
  align-items: center;
}

.side-card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
}

.side-card-title .el-icon {
  color: #6366f1;
}

.side-announcement-box, .side-guide-box {
  padding: 4px 0;
}

.announcement-text, .guide-text {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  white-space: pre-wrap;
}

.announcement-date {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 12px;
}

.quick-start-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.quick-start-content h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #1e293b;
}

.quick-start-content p {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 16px;
}

.full-width {
  width: 100%;
}

.contact-dialog-content {
  text-align: center;
  padding: 16px 0;
}

.contact-dialog-content p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px;
}

.email-box {
  font-size: 16px;
  font-weight: 700;
  color: #4338ca;
  background: #eef2ff;
  padding: 12px 20px;
  border-radius: 12px;
  word-break: break-all;
}

.form-hint {
  font-size: 12px;
  color: #94a3b8;
  margin: 4px 0 0;
}

.quota-hint {
  margin-bottom: 12px;
}
.quota-link {
  color: var(--primary-color);
  text-decoration: underline;
}
.model-id-hint {
  float: right;
  color: var(--text-secondary);
  font-size: 12px;
  font-family: monospace;
}
.form-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 4px 0 0;
  line-height: 1.4;
}
.test-result {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-top: 8px;
}
.test-result.success {
  background: #f0f9eb;
  border: 1px solid #e1f3d8;
}
.test-result.fail {
  background: #fef0f0;
  border: 1px solid #fde2e2;
}
.test-result-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.test-response {
  font-size: 12px;
  color: var(--text-secondary);
  word-break: break-all;
}

.empty-projects-pro {
  background: white;
  border-radius: 24px;
  padding: 80px 40px;
  border: 2px dashed #e2e8f0;
}

.empty-hint {
  color: #94a3b8;
  margin-bottom: 24px;
}

.admin-full-view {
  background: white;
  border-radius: 24px;
  padding: 40px;
}

.logout-item {
  color: #ef4444 !important;
  font-weight: 600;
}

.mini-empty {
  padding: 20px 0 !important;
}

@media (max-width: 1200px) {
  .project-grid-pro {
    grid-template-columns: 1fr;
  }
}
</style>
