<template>
  <div class="admin-container">
    <el-header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-mini" @click="router.push('/dashboard')">VB</div>
          <h1 class="platform-name">VibeCoding <span>管理后台</span></h1>
        </div>
        <div class="header-right">
          <el-button type="primary" plain @click="router.push('/dashboard')">
            <el-icon><Back /></el-icon>返回看板
          </el-button>
        </div>
      </div>
    </el-header>

    <div class="admin-content">
      <el-card class="placeholder-card">
        <el-empty description="管理模块开发中">
          <template #extra>
            <p class="desc">系统管理功能（用户管理、选题管理、统计报表）将在 Phase 5 正式上线。</p>
            <el-button type="primary" @click="router.push('/dashboard')" size="large">
              先回个人看板看看
            </el-button>
          </template>
        </el-empty>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Back } from '@element-plus/icons-vue';

const router = useRouter();
</script>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
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
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.admin-content {
  max-width: 800px;
  margin: 60px auto;
  padding: 0 24px;
}

.placeholder-card {
  border-radius: 24px;
  padding: 40px;
}

.desc {
  max-width: 400px;
  margin: 0 auto 24px;
  color: #64748b;
  line-height: 1.6;
}
</style>