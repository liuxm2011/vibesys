<template>
  <div class="dashboard-container">
    <el-container>
      <!-- Header with user info and logout -->
      <el-header class="dashboard-header">
        <div class="header-left">
          <h1>VibeCoding 教学实践平台</h1>
        </div>
        <div class="header-right">
          <span class="user-info">
            {{ user?.name }} ({{ user?.role === 'ADMIN' ? '管理员' : '学生' }})
          </span>
          <el-button type="danger" size="small" @click="handleLogout">
            退出登录
          </el-button>
        </div>
      </el-header>

      <!-- Main content -->
      <el-main class="dashboard-main">
        <el-card class="welcome-card">
          <template #header>
            <span>欢迎，{{ user?.name }}</span>
          </template>

          <el-descriptions :column="2" border>
            <el-descriptions-item label="学号">
              {{ user?.studentId }}
            </el-descriptions-item>
            <el-descriptions-item label="姓名">
              {{ user?.name }}
            </el-descriptions-item>
            <el-descriptions-item label="专业">
              {{ user?.major }}
            </el-descriptions-item>
            <el-descriptions-item label="年级">
              {{ user?.grade }}
            </el-descriptions-item>
            <el-descriptions-item label="班级">
              {{ user?.class }}
            </el-descriptions-item>
            <el-descriptions-item label="角色">
              {{ user?.role === 'ADMIN' ? '管理员' : '学生' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- Projects card (D-18, D-19, DASH-01, DASH-02) -->
        <el-card class="projects-card">
          <template #header>
            <div class="card-header">
              <span>我的项目 ({{ projectStore.projectCount }}/10)</span>
              <el-button
                type="primary"
                size="small"
                @click="router.push('/topics')"
              >
                去选题
              </el-button>
            </div>
          </template>

          <!-- Project list -->
          <div v-if="projectStore.projects.length > 0" class="project-list">
            <div
              v-for="project in projectStore.projects"
              :key="project.id"
              class="project-item"
              @click="handleProjectClick(project)"
            >
              <el-card shadow="hover" class="project-card-inner">
                <div class="project-header">
                  <span class="project-title">{{ project.topic?.title }}</span>
                  <el-tag :type="projectStore.getStatusTagType(project.status)">
                    {{ projectStore.getStatusText(project.status) }}
                  </el-tag>
                </div>
                <div class="project-info">
                  <span>{{ project.topic?.domain === 'SE' ? '软件工程' : '大数据' }}</span>
                  <span>创建于 {{ formatDate(project.createdAt) }}</span>
                </div>
                <div class="project-actions">
                  <el-button
                    type="danger"
                    size="small"
                    text
                    @click.stop="handleDeleteProject(project.id)"
                  >
                    删除
                  </el-button>
                </div>
              </el-card>
            </div>
          </div>

          <!-- Empty state (DASH-01) -->
          <el-empty v-else description="暂无项目，请在选题管理中选择或提交选题">
            <el-button type="primary" @click="router.push('/topics')">
              去选题
            </el-button>
          </el-empty>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '@/stores/auth.store';
import { useProjectStore } from '@/stores/project.store';
import type { Project, ProjectStatus } from '@/types/project';

const router = useRouter();
const authStore = useAuthStore();
const projectStore = useProjectStore();

// User info from auth store (AUTH-02)
const user = computed(() => authStore.user);

// Fetch projects on mount (DASH-01)
onMounted(async () => {
  const success = await projectStore.fetchProjects();
  if (!success) {
    ElMessage.error(projectStore.error || '获取项目列表失败');
  }
});

// Logout handler (AUTH-03, D-14)
async function handleLogout() {
  await authStore.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
}

// Format date helper
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
}

// Handle project click (navigate to detail - placeholder)
function handleProjectClick(project: Project): void {
  // TODO: Phase 3 will implement project detail page
  // For now, just show a message
  ElMessage.info('项目详情页面将在Phase 3实现');
}

// D-09: Handle project delete with confirmation
async function handleDeleteProject(projectId: number): Promise<void> {
  try {
    await ElMessageBox.confirm(
      '确定要删除该项目吗？删除后选题池中的原始选题不会受到影响。',
      '删除项目',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    const success = await projectStore.deleteProject(projectId);
    if (success) {
      ElMessage.success('项目已删除');
    } else {
      ElMessage.error(projectStore.error || '删除失败');
    }
  } catch (e) {
    // User cancelled - do nothing
    console.log('Delete cancelled');
  }
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: #f5f7fa;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
}

.header-left h1 {
  font-size: 20px;
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  color: #606266;
  font-size: 14px;
}

.dashboard-main {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

/* Project list styles */
.projects-card {
  min-height: 200px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-item {
  cursor: pointer;
}

.project-card-inner {
  transition: transform 0.2s ease;
}

.project-item:hover .project-card-inner {
  transform: translateY(-2px);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.project-info {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.project-actions {
  margin-top: 8px;
}
</style>