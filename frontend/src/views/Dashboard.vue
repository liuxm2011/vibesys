<template>
  <div class="dashboard-container">
    <!-- Main Header -->
    <el-header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-mini">VB</div>
          <h1 class="platform-name">VibeCoding <span>教学实践平台</span></h1>
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
              v-else
              type="primary"
              @click="router.push('/topics')"
              class="nav-item action-btn"
            >
              <el-icon><FolderAdd /></el-icon>选题管理
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
                  <el-dropdown-item disabled>
                    <el-icon><User /></el-icon>{{ isAdmin ? '管理员' : '学生' }}
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

    <div class="dashboard-content">
      <!-- Welcome Section -->
      <section class="welcome-section">
        <div class="welcome-card-modern">
          <div class="welcome-info">
            <h2 class="welcome-text">你好，{{ user?.name }} 👋</h2>
            <p class="welcome-subtext">欢迎回来！今天想开始哪个项目的编码？</p>
          </div>
          <div class="stats-row" v-if="!isAdmin">
            <div class="stat-item">
              <span class="stat-value">{{ projectStore.projectCount }}</span>
              <span class="stat-label">我的项目</span>
            </div>
            <el-divider direction="vertical" />
            <div class="stat-item">
              <span class="stat-value">10</span>
              <span class="stat-label">额度上限</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Grid -->
      <el-main class="main-layout">
        <el-row :gutter="24">
          <!-- Left Column: User Info & Quick Links -->
          <el-col :span="6">
            <el-card class="info-sidebar-card">
              <template #header>
                <div class="sidebar-header">
                  <el-icon><InfoFilled /></el-icon>
                  <span>个人信息</span>
                </div>
              </template>
              <div class="info-list">
                <div class="info-item">
                  <span class="label">学号</span>
                  <span class="value">{{ user?.studentId }}</span>
                </div>
                <div class="info-item">
                  <span class="label">专业</span>
                  <span class="value">{{ user?.major }}</span>
                </div>
                <div class="info-item">
                  <span class="label">班级</span>
                  <span class="value">{{ user?.grade }}级 {{ user?.class }}</span>
                </div>
                <div class="info-item">
                  <span class="label">当前角色</span>
                  <el-tag size="small" :type="isAdmin ? 'warning' : 'success'">
                    {{ isAdmin ? '管理员' : '学生' }}
                  </el-tag>
                </div>
              </div>
            </el-card>

            <el-card class="quick-links-card" v-if="isAdmin">
              <template #header>
                <div class="sidebar-header">
                  <el-icon><Tools /></el-icon>
                  <span>快速入口</span>
                </div>
              </template>
              <el-button type="primary" class="full-width-btn" @click="router.push('/admin')">
                进入管理后台
              </el-button>
            </el-card>
          </el-col>

          <!-- Right Column: Projects -->
          <el-col :span="18">
            <div class="projects-section" v-if="!isAdmin">
              <div class="section-header">
                <h3>我的项目列表</h3>
                <el-button type="primary" link @click="router.push('/topics')">
                  查看选题池 <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>

              <!-- Project Cards Grid -->
              <div v-if="projectStore.projects.length > 0" class="project-grid">
                <el-card
                  v-for="project in projectStore.projects"
                  :key="project.id"
                  shadow="hover"
                  class="project-card-modern"
                  @click="handleProjectClick(project)"
                >
                  <div class="project-card-body">
                    <div class="project-type-badge" :class="project.topic?.domain">
                      {{ project.topic?.domain === 'SE' ? '软件工程' : '大数据' }}
                    </div>
                    <h4 class="project-title">{{ project.topic?.title }}</h4>
                    <p class="project-date">创建于 {{ formatDate(project.createdAt) }}</p>

                    <div class="project-footer">
                      <el-tag :type="projectStore.getStatusTagType(project.status)" size="small">
                        {{ projectStore.getStatusText(project.status) }}
                      </el-tag>
                      <el-button
                        type="danger"
                        size="small"
                        link
                        @click.stop="handleDeleteProject(project.id)"
                      >
                        <el-icon><Delete /></el-icon>删除
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </div>

              <!-- Empty State -->
              <el-empty
                v-else
                description="暂无项目，快去选题吧！"
                class="empty-projects"
              >
                <el-button type="primary" @click="router.push('/topics')" size="large">
                  前往选题池
                </el-button>
              </el-empty>
            </div>

            <!-- Admin Placeholder -->
            <div v-else class="admin-placeholder">
              <el-card class="placeholder-card">
                <el-empty description="管理员控制面板">
                  <template #extra>
                    <p class="placeholder-text">完整管理功能正在开发中...</p>
                    <el-button type="primary" @click="router.push('/admin')">
                      进入管理后台 (Phase 5)
                    </el-button>
                  </template>
                </el-empty>
              </el-card>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Monitor,
  FolderAdd,
  User,
  ArrowDown,
  SwitchButton,
  InfoFilled,
  Tools,
  ArrowRight,
  Delete
} from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth.store';
import { useProjectStore } from '@/stores/project.store';
import type { Project } from '@/types/project';

const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();

const user = computed(() => authStore.user);
const isAdmin = computed(() => authStore.user?.role === 'ADMIN');

onMounted(async () => {
  if (!isAdmin.value) {
    const success = await projectStore.fetchProjects();
    if (!success) {
      ElMessage.error(projectStore.error || '获取项目列表失败');
    }
  }
});

async function handleLogout() {
  await authStore.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
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
  background-color: #f8fafc;
}

/* Header Styles */
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

.nav-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
  border: none !important;
}

.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.user-info-trigger:hover {
  background-color: #f1f5f9;
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

/* Welcome Section */
.welcome-section {
  max-width: 1400px;
  margin: 24px auto 0;
  padding: 0 24px;
}

.welcome-card-modern {
  background: white;
  padding: 32px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-image: radial-gradient(at 100% 0%, rgba(79, 70, 229, 0.05) 0px, transparent 50%),
                    radial-gradient(at 0% 100%, rgba(124, 58, 237, 0.05) 0px, transparent 50%);
}

.welcome-text {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.welcome-subtext {
  color: #64748b;
  margin: 8px 0 0;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #4f46e5;
}

.stat-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Main Layout */
.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

.main-layout {
  padding: 24px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #334155;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-item .label {
  font-size: 13px;
  color: #64748b;
}

.info-item .value {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.quick-links-card {
  margin-top: 24px;
}

.full-width-btn {
  width: 100%;
}

/* Projects Grid */
.projects-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.project-card-modern {
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card-modern:hover {
  transform: translateY(-4px);
  border-color: #4f46e5;
}

.project-card-body {
  padding: 4px;
}

.project-type-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  border-radius: 6px;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.project-type-badge.SE {
  background-color: #ecfeff;
  color: #0891b2;
}

.project-type-badge.BD {
  background-color: #fef2f2;
  color: #dc2626;
}

.project-title {
  font-size: 16px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  height: 2.8em;
}

.project-date {
  font-size: 12px;
  color: #94a3b8;
  margin-bottom: 16px;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.empty-projects {
  background: white;
  border-radius: 20px;
  padding: 60px 0;
}

.logout-item {
  color: #ef4444 !important;
}
</style>