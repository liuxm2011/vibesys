<template>
  <div class="topic-pool-container">
    <!-- 顶部导航栏 (保持与 Dashboard 一致) -->
    <el-header class="dashboard-header">
      <div class="header-content">
        <div class="header-left" @click="router.push('/dashboard')">
          <div class="logo-mini">VB</div>
          <h1 class="platform-name">VibeCoding <span>选题池</span></h1>
        </div>
        <div class="header-right">
          <div class="nav-actions">
            <el-button @click="router.push('/dashboard')" class="nav-item-btn">
              <el-icon><Back /></el-icon>返回个人看板
            </el-button>
          </div>
          <el-divider direction="vertical" />
          <div class="user-profile">
            <el-dropdown trigger="click">
              <div class="user-info-trigger">
                <el-avatar :size="32" class="user-avatar">{{ user?.name?.charAt(0) }}</el-avatar>
                <span class="user-name">{{ user?.name }}</span>
                <el-icon><ArrowDown /></el-icon>
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

    <div class="pool-layout">
      <!-- 左侧筛选侧边栏 -->
      <aside class="pool-sidebar">
        <div class="sidebar-sticky">
          <!-- 核心筛选卡片 -->
          <div class="glass-card filter-panel">
            <div class="panel-header">
              <el-icon class="header-icon"><Filter /></el-icon>
              <h3>选题筛选</h3>
            </div>
            
            <div class="filter-group">
              <label class="group-label">技术领域</label>
              <div class="custom-radio-list">
                <div 
                  class="radio-item" 
                  :class="{ active: topicStore.selectedDomain === null }"
                  @click="setDomain(null)"
                >
                  <el-icon><Menu /></el-icon>
                  <span>全部领域</span>
                </div>
                <div 
                  class="radio-item" 
                  :class="{ active: topicStore.selectedDomain === 'SE' }"
                  @click="setDomain('SE')"
                >
                  <el-icon><Monitor /></el-icon>
                  <span>软件工程</span>
                </div>
                <div 
                  class="radio-item" 
                  :class="{ active: topicStore.selectedDomain === 'BD' }"
                  @click="setDomain('BD')"
                >
                  <el-icon><DataLine /></el-icon>
                  <span>大数据</span>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <label class="group-label">选题类型</label>
              <div class="custom-radio-list">
                <div
                  class="radio-item"
                  :class="{ active: topicStore.selectedType === null }"
                  @click="setType(null)"
                >
                  <el-icon><Menu /></el-icon>
                  <span>全部</span>
                </div>
                <div
                  class="radio-item"
                  :class="{ active: topicStore.selectedType === 'SYSTEM' }"
                  @click="setType('SYSTEM')"
                >
                  <el-icon><Box /></el-icon>
                  <span>仅查看系统内置</span>
                </div>
                <div
                  class="radio-item"
                  :class="{ active: topicStore.selectedType === 'CUSTOM' }"
                  @click="setType('CUSTOM')"
                >
                  <el-icon><EditPen /></el-icon>
                  <span>仅查看自拟</span>
                </div>
              </div>
            </div>

            <div class="panel-divider"></div>

            <div class="panel-footer">
              <el-button
                class="custom-topic-btn"
                @click="showCustomDialog = true"
              >
                <el-icon><EditPen /></el-icon>没有心仪的？自拟选题
              </el-button>
            </div>
          </div>

          <!-- 项目额度卡片 -->
          <div class="glass-card stats-panel">
            <div class="limit-info">
              <div class="limit-top">
                <span class="limit-label">我的项目额度</span>
                <span class="limit-value">
                  <strong>{{ projectStore.projectCount }}</strong> / 10
                </span>
              </div>
              <el-progress
                :percentage="(projectStore.projectCount / 10) * 100"
                :status="projectStore.maxProjectsReached ? 'exception' : ''"
                :show-text="false"
                :stroke-width="10"
                class="limit-progress"
              />
              <p class="limit-desc" v-if="!projectStore.maxProjectsReached">
                还可以创建 {{ 10 - projectStore.projectCount }} 个项目
              </p>
              <p class="limit-desc error" v-else>已达到上限，请先归档或删除</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- 右侧选题列表 -->
      <main class="pool-main">
        <div class="pool-top-bar">
          <div class="results-info">
            <span class="count-badge">共有 {{ topicStore.filteredTopics.length }} 个选题</span>
          </div>
          <div class="search-box">
            <el-input
              v-model="searchQuery"
              placeholder="输入关键词搜索选题..."
              class="modern-search"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>

        <!-- 选题网格 -->
        <div v-if="topicStore.filteredTopics.length > 0" class="topic-grid">
          <div
            v-for="topic in topicStore.filteredTopics"
            :key="topic.id"
            class="modern-topic-card"
          >
            <div class="card-badges">
              <span class="badge domain" :class="topic.domain.toLowerCase()">
                {{ topic.domain === 'SE' ? '软件工程' : '大数据' }}
              </span>
              <span class="badge platform">{{ platformLabel(topic.platform) }}</span>
              <span class="badge type" :class="topic.type.toLowerCase()">
                {{ topic.type === 'SYSTEM' ? '系统' : '自拟' }}
              </span>
            </div>
            
            <div class="card-body">
              <h3 class="title">{{ topic.title }}</h3>
              <p class="description">{{ topic.description }}</p>
            </div>

            <div class="card-actions">
              <el-button link @click="showDetail(topic)" class="detail-link">
                <el-icon><Reading /></el-icon>查看详情
              </el-button>
              
              <div class="action-right">
                <div v-if="projectStore.hasSelectedTopic(topic.id)" class="already-selected">
                  <el-icon><CircleCheck /></el-icon> 已加入项目
                </div>
                <el-button
                  v-else
                  type="primary"
                  size="default"
                  @click="quickCreate(topic)"
                  :disabled="projectStore.maxProjectsReached"
                  class="join-btn"
                >
                  <el-icon><Plus /></el-icon>加入项目
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <el-empty description="暂时没有符合条件的选题，换个关键词试试吧" />
        </div>
      </main>
    </div>

    <TopicDetailDialog
      v-model:visible="showDetailDialog"
      :topic="currentTopic"
      @selected="handleProjectCreated"
    />

    <CustomTopicDialog
      v-model:visible="showCustomDialog"
      @submitted="handleCustomSubmitted"
    />

    <SelfPasswordDialog
      v-model:visible="passwordDialogVisible"
      @success="handlePasswordChanged"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  Back,
  ArrowDown,
  Key,
  SwitchButton,
  Filter,
  EditPen,
  Search,
  Reading,
  Plus,
  CircleCheck,
  Menu,
  Monitor,
  DataLine,
  Box
} from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth.store';
import { useAppModeStore } from '@/stores/appMode.store';
import { useTopicStore } from '@/stores/topic.store';
import { useProjectStore } from '@/stores/project.store';
import TopicDetailDialog from '@/components/TopicDetailDialog.vue';
import CustomTopicDialog from '@/components/CustomTopicDialog.vue';
import SelfPasswordDialog from '@/components/SelfPasswordDialog.vue';
import type { Topic, Platform } from '@/types/topic';
import { PLATFORM_LABELS } from '@/types/topic';

const router = useRouter();
const authStore = useAuthStore();
const appModeStore = useAppModeStore();
const topicStore = useTopicStore();
const projectStore = useProjectStore();

const user = computed(() => authStore.user);
const showDetailDialog = ref(false);
const showCustomDialog = ref(false);
const currentTopic = ref<Topic | null>(null);
const searchQuery = computed({
  get: () => topicStore.searchQuery,
  set: (v: string) => topicStore.searchQuery = v
});
const passwordDialogVisible = ref(false);

onMounted(async () => {
  const success = await topicStore.fetchTopics();
  if (!success) {
    ElMessage.error(topicStore.error || '获取选题失败');
  }
  await projectStore.fetchProjects();
});

function setDomain(domain: 'SE' | 'BD' | null) {
  topicStore.selectedDomain = domain;
  handleFilterChange();
}

function setType(type: 'SYSTEM' | 'CUSTOM' | null) {
  topicStore.setTypeFilter(type);
}

async function handleLogout() {
  appModeStore.clearMode();
  await authStore.logout();
  router.push('/login');
}

function handlePasswordChanged() {
  ElMessage.success('密码已更新，下次登录请使用新密码');
}

function handleFilterChange(): void {
  // Store handles filtering
}

function showDetail(topic: Topic): void {
  currentTopic.value = topic;
  showDetailDialog.value = true;
}

async function quickCreate(topic: Topic): Promise<void> {
  if (projectStore.maxProjectsReached) {
    ElMessage.warning('已达到项目上限(10个)');
    return;
  }

  const success = await projectStore.createProject(topic.id);
  if (success) {
    ElMessage.success('项目创建成功');
    const newProject = projectStore.projects.find(p => p.topicId === topic.id);
    if (newProject) {
      router.push(`/projects/${newProject.id}`);
    }
  } else {
    ElMessage.error(projectStore.error || '创建项目失败');
  }
}

function handleProjectCreated(): void {
  projectStore.fetchProjects();
}

function handleCustomSubmitted(): void {
  topicStore.fetchTopics();
}

function platformLabel(platform: string): string {
  return PLATFORM_LABELS[platform as Platform]?.name ?? platform;
}
</script>

<style scoped>
.topic-pool-container {
  min-height: 100vh;
  background-color: #f1f5f9;
}

/* Header Styles */
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-mini {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  font-weight: 800;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.platform-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.platform-name span {
  font-weight: 400;
  color: #64748b;
  font-size: 14px;
  margin-left: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 16px;
  flex-shrink: 0;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.nav-item-btn {
  border: none;
  background: #f1f5f9;
  font-weight: 600;
  color: #475569;
  flex-shrink: 0;
}

.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.user-info-trigger:hover {
  background-color: #f1f5f9;
}

.user-avatar {
  background-color: #4f46e5;
  font-weight: 600;
}

.user-profile {
  flex-shrink: 0;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

/* Main Layout */
.pool-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 32px;
}

@media (max-width: 1024px) {
  .pool-layout {
    grid-template-columns: 1fr;
  }
}

.pool-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-sticky {
  position: sticky;
  top: 96px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Glass Card Component */
.glass-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

/* Filter Panel */
.panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.header-icon {
  font-size: 20px;
  color: #4f46e5;
}

.panel-header h3 {
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
}

.filter-group {
  margin-bottom: 24px;
}

.group-label {
  display: block;
  font-size: 12px;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 12px;
}

/* Custom Radio List */
.custom-radio-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748b;
  font-weight: 600;
  font-size: 14px;
}

.radio-item:hover {
  background-color: #f8fafc;
  color: #4f46e5;
}

.radio-item.active {
  background-color: #eef2ff;
  color: #4f46e5;
  box-shadow: inset 0 0 0 1px #c7d2fe;
}

.radio-item .el-icon {
  font-size: 16px;
}

.option-item {
  padding: 4px 0;
}

.checkbox-text {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

.panel-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 0 -20px 20px;
}

.custom-topic-btn {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.2s;
}

.custom-topic-btn:hover {
  background: #ffffff;
  border-color: #4f46e5;
  color: #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

/* Stats Panel */
.limit-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 12px;
}

.limit-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.limit-value {
  font-size: 13px;
  color: #94a3b8;
}

.limit-value strong {
  font-size: 20px;
  color: #1e293b;
}

.limit-progress {
  margin-bottom: 12px;
}

.limit-desc {
  font-size: 12px;
  color: #94a3b8;
  margin: 0;
}

.limit-desc.error {
  color: #ef4444;
  font-weight: 600;
}

/* Main Content Area */
.pool-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.count-badge {
  background: #e2e8f0;
  color: #475569;
  padding: 6px 16px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 600;
}

.modern-search {
  width: 360px;
}

:deep(.modern-search .el-input__wrapper) {
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02) !important;
  padding: 8px 16px;
}

/* Topic Cards Grid */
.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.modern-topic-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f1f5f9;
}

.modern-topic-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px -8px rgba(0, 0, 0, 0.08);
  border-color: #e2e8f0;
}

.card-badges {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 5px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge.domain.se { background: #e0e7ff; color: #4338ca; }
.badge.domain.bd { background: #dcfce7; color: #15803d; }
.badge.platform { background: #ede9fe; color: #6d28d9; }
.badge.type.system { background: #f1f5f9; color: #475569; }
.badge.type.custom { background: #fef3c7; color: #b45309; }

.card-body {
  flex: 1;
}

.card-body .title {
  font-size: 17px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 10px;
  line-height: 1.4;
}

.card-body .description {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 20px;
  height: 4.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid #f8fafc;
}

.detail-link {
  font-weight: 600;
  font-size: 13px;
  color: #64748b;
}

.detail-link:hover {
  color: #4f46e5;
}

.join-btn {
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  background: linear-gradient(to right, #4f46e5, #7c3aed);
  border: none;
  padding: 6px 14px;
}

.already-selected {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #10b981;
  font-weight: 700;
  font-size: 13px;
  background: #ecfdf5;
  padding: 5px 10px;
  border-radius: 6px;
}

.empty-state {
  padding: 100px 0;
}
</style>
