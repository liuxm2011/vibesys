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

        <!-- Placeholder for Phase 2 content -->
        <el-card class="projects-card">
          <template #header>
            <span>我的项目</span>
          </template>
          <el-empty description="暂无项目，请在选题管理中选择或提交选题">
            <el-button type="primary">去选题</el-button>
          </el-empty>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

// User info from auth store (AUTH-02)
const user = computed(() => authStore.user);

// Logout handler (AUTH-03, D-14)
async function handleLogout() {
  await authStore.logout();
  ElMessage.success('已退出登录');
  router.push('/login');
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
  gap: 15px;
}

.user-info {
  color: #666;
  font-size: 14px;
}

.dashboard-main {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.projects-card {
  min-height: 200px;
}
</style>