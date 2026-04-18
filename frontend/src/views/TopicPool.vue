<template>
  <div class="topic-pool-container">
    <!-- Reusable Header -->
    <el-header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-mini" @click="router.push('/dashboard')">VB</div>
          <h1 class="platform-name" @click="router.push('/dashboard')">VibeCoding <span>选题池</span></h1>
        </div>
        <div class="header-right">
          <div class="nav-actions">
            <el-button type="primary" plain @click="router.push('/dashboard')" class="nav-item">
              <el-icon><Back /></el-icon>返回看板
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
      <div class="pool-sidebar">
        <div class="sidebar-sticky">
          <el-card class="filter-card">
            <template #header>
              <div class="filter-title">
                <el-icon><Filter /></el-icon>
                <span>选题筛选</span>
              </div>
            </template>
            <div class="filter-section">
              <p class="filter-label">技术领域</p>
              <el-radio-group
                v-model="topicStore.selectedDomain"
                @change="handleFilterChange"
                class="modern-radio-group"
              >
                <el-radio-button :value="null">全部</el-radio-button>
                <el-radio-button value="SE">软件工程</el-radio-button>
                <el-radio-button value="BD">大数据</el-radio-button>
              </el-radio-group>
            </div>

            <div class="filter-section">
              <p class="filter-label">更多选项</p>
              <el-checkbox v-model="onlySystemTopics" label="仅看系统选题" />
            </div>

            <div class="sidebar-footer">
              <el-button
                type="primary"
                class="custom-btn"
                @click="showCustomDialog = true"
              >
                <el-icon><EditPen /></el-icon>自拟选题
              </el-button>
            </div>
          </el-card>

          <el-card class="stats-card">
            <div class="project-limit-info">
              <div class="limit-header">
                <span>项目额度</span>
                <span class="limit-count">{{ projectStore.projectCount }}/10</span>
              </div>
              <el-progress
                :percentage="(projectStore.projectCount / 10) * 100"
                :status="projectStore.maxProjectsReached ? 'exception' : ''"
                :show-text="false"
                stroke-width="8"
              />
              <p class="limit-hint" v-if="projectStore.maxProjectsReached">已达上限，请删除旧项目</p>
            </div>
          </el-card>
        </div>
      </div>

      <div class="pool-main">
        <div class="pool-header-actions">
          <h2 class="results-count">共有 {{ topicStore.filteredTopics.length }} 个选题可供选择</h2>
          <el-input
            v-model="searchQuery"
            placeholder="搜索选题名称或关键词..."
            class="search-input"
            clearable
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>

        <!-- Topics Grid -->
        <div v-if="topicStore.filteredTopics.length > 0" class="topic-grid">
          <el-card
            v-for="topic in topicStore.filteredTopics"
            :key="topic.id"
            class="topic-card-modern"
            shadow="hover"
          >
            <div class="topic-card-content">
              <div class="topic-tags">
                <el-tag :type="topic.domain === 'SE' ? 'primary' : 'success'" size="small" effect="light">
                  {{ topic.domain === 'SE' ? '软件工程' : '大数据' }}
                </el-tag>
                <el-tag :type="topic.type === 'SYSTEM' ? 'info' : 'warning'" size="small" plain>
                  {{ topic.type === 'SYSTEM' ? '系统' : '自拟' }}
                </el-tag>
              </div>
              <h3 class="topic-title">{{ topic.title }}</h3>
              <p class="topic-desc">{{ topic.description }}</p>

              <div class="topic-footer">
                <el-button text @click="showDetail(topic)">
                  <el-icon><Reading /></el-icon>详情描述
                </el-button>
                <el-button
                  type="primary"
                  @click="quickCreate(topic)"
                  :disabled="projectStore.maxProjectsReached"
                  class="select-btn"
                >
                  <el-icon><Plus /></el-icon>加入项目
                </el-button>
              </div>
            </div>
          </el-card>
        </div>

        <el-empty v-else description="没有找到符合条件的选题" />
      </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import {
  Back,
  ArrowDown,
  SwitchButton,
  Filter,
  EditPen,
  Search,
  Reading,
  Plus
} from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth.store';
import { useTopicStore } from '@/stores/topic.store';
import { useProjectStore } from '@/stores/project.store';
import TopicDetailDialog from '@/components/TopicDetailDialog.vue';
import CustomTopicDialog from '@/components/CustomTopicDialog.vue';
import type { Topic } from '@/types/topic';

const router = useRouter();
const authStore = useAuthStore();
const topicStore = useTopicStore();
const projectStore = useProjectStore();

const user = computed(() => authStore.user);
const showDetailDialog = ref(false);
const showCustomDialog = ref(false);
const currentTopic = ref<Topic | null>(null);
const searchQuery = ref('');
const onlySystemTopics = ref(false);

onMounted(async () => {
  const success = await topicStore.fetchTopics();
  if (!success) {
    ElMessage.error(topicStore.error || '获取选题失败');
  }
  await projectStore.fetchProjects();
});

function handleLogout() {
  authStore.logout();
  router.push('/login');
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
</script>

<style scoped>
.topic-pool-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

/* Header Re-used from Dashboard */
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
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
  gap: 16px;
}

.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
}

.user-avatar {
  background-color: #4f46e5;
  font-weight: 600;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

/* Pool Layout */
.pool-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
}

.pool-sidebar {
  position: relative;
}

.sidebar-sticky {
  position: sticky;
  top: 88px;
}

.filter-card {
  margin-bottom: 16px;
}

.filter-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #334155;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-label {
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 12px;
  letter-spacing: 0.05em;
}

.modern-radio-group {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
}

:deep(.el-radio-button__inner) {
  width: 100%;
  border: 1px solid #e2e8f0 !important;
  border-radius: 8px !important;
  box-shadow: none !important;
  text-align: left;
}

:deep(.el-radio-button:first-child .el-radio-button__inner),
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 8px !important;
}

.sidebar-footer {
  margin-top: 16px;
}

.custom-btn {
  width: 100%;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
  border: none !important;
}

.limit-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.limit-hint {
  font-size: 11px;
  color: #ef4444;
  margin-top: 8px;
}

/* Pool Main Area */
.pool-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.results-count {
  font-size: 16px;
  color: #64748b;
  margin: 0;
}

.search-input {
  width: 320px;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.topic-card-modern {
  border-radius: 16px;
  transition: all 0.3s;
}

.topic-card-content {
  padding: 4px;
}

.topic-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.topic-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px;
  line-height: 1.4;
}

.topic-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 20px;
  line-height: 1.6;
  height: 4.8em;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.topic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.select-btn {
  border-radius: 8px;
}

.logout-item {
  color: #ef4444 !important;
}
</style>