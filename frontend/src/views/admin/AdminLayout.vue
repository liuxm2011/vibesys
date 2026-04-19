<template>
  <div class="admin-layout">
    <!-- Header -->
    <header class="admin-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-mini" @click="router.push('/dashboard')">VB</div>
          <h1 class="platform-name">VibeCoding <span>管理后台</span></h1>
        </div>
        <div class="header-right">
          <el-button type="primary" plain @click="router.push('/dashboard')">
            <el-icon><Back /></el-icon>返回看板
          </el-button>
          <el-dropdown @command="handleCommand">
            <span class="user-dropdown">
              <el-avatar :size="32">{{ authStore.user?.name?.charAt(0) }}</el-avatar>
              <span class="username">{{ authStore.user?.name }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <div class="admin-body">
      <!-- Sidebar -->
      <aside class="admin-sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :router="true"
          background-color="#ffffff"
          text-color="#64748b"
          active-text-color="#4f46e5"
        >
          <el-menu-item index="/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/topics">
            <el-icon><Collection /></el-icon>
            <span>选题管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/stats">
            <el-icon><TrendCharts /></el-icon>
            <span>统计分析</span>
          </el-menu-item>
          <el-menu-item index="/admin/config">
            <el-icon><Setting /></el-icon>
            <span>系统配置</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- Main Content -->
      <main class="admin-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import { Back, User, Collection, TrendCharts, Setting, SwitchButton } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const activeMenu = computed(() => route.path);

async function handleCommand(command: string) {
  if (command === 'logout') {
    await authStore.logout();
    router.push('/login');
  }
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: white;
  border-bottom: 1px solid var(--border-color);
  height: 60px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-content {
  max-width: 100%;
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
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.platform-name {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.platform-name span {
  font-weight: 400;
  color: var(--text-secondary);
  font-size: 14px;
  margin-left: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: var(--text-main);
}

.admin-body {
  display: flex;
  margin-top: 60px;
  min-height: calc(100vh - 60px);
}

.admin-sidebar {
  width: 220px;
  background: white;
  border-right: 1px solid var(--border-color);
  position: fixed;
  top: 60px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
}

.sidebar-menu {
  border-right: none !important;
}

.admin-main {
  flex: 1;
  margin-left: 220px;
  padding: 24px;
  min-width: 800px;
}

:deep(.el-menu-item.is-active) {
  background-color: #f0f0ff !important;
  border-right: 3px solid var(--primary-color);
}
</style>
