<!-- frontend/src/views/ModeSelect.vue -->
<template>
  <div class="mode-select-container">
    <div class="mode-header">
      <div class="logo-box">
        <div class="logo-mini">VB</div>
        <div class="logo-text">
          <h1 class="platform-name">VibeCoding</h1>
          <span class="platform-tag">教学实践平台</span>
        </div>
      </div>
      <p class="mode-subtitle">请选择您本次使用的功能模块</p>
    </div>

    <div class="mode-cards">
      <div class="mode-card" @click="selectMode('project')">
        <div class="card-icon project-icon">
          <el-icon :size="48"><Monitor /></el-icon>
        </div>
        <h2 class="card-title">项目设计</h2>
        <p class="card-desc">
          软件工程 / 大数据专业<br>
          完成选题 → AI生成文档 → 编码实践的全流程软件项目
        </p>
        <el-button type="primary" size="large" class="card-btn">进入项目设计</el-button>
      </div>

      <div class="mode-card mode-card--graduation" @click="selectMode('graduation')">
        <div class="card-icon graduation-icon">
          <el-icon :size="48"><Document /></el-icon>
        </div>
        <h2 class="card-title">毕业设计</h2>
        <p class="card-desc">
          大数据专业专属<br>
          从数据集题库中选择毕业设计课题，完成数据分析与模型实践
        </p>
        <el-button type="success" size="large" class="card-btn">进入毕业设计</el-button>
      </div>
    </div>

    <div class="mode-footer">
      <el-button text @click="handleLogout">
        <el-icon><SwitchButton /></el-icon>退出登录
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { Monitor, Document, SwitchButton } from '@element-plus/icons-vue';
import { useAppModeStore } from '@/stores/appMode.store';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const appModeStore = useAppModeStore();
const authStore = useAuthStore();

function selectMode(mode: 'project' | 'graduation') {
  appModeStore.setMode(mode);
  if (mode === 'project') {
    router.push('/dashboard');
  } else {
    router.push('/graduation');
  }
}

async function handleLogout() {
  await authStore.logout();
  appModeStore.clearMode();
  router.push('/login');
}
</script>

<style scoped>
.mode-select-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 48px;
}

.mode-header {
  text-align: center;
}

.logo-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.logo-mini {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  font-weight: 800;
  font-size: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  text-align: left;
}

.platform-name {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.platform-tag {
  font-size: 13px;
  color: #64748b;
}

.mode-subtitle {
  font-size: 18px;
  color: #475569;
  margin: 0;
}

.mode-cards {
  display: flex;
  gap: 32px;
  align-items: stretch;
}

.mode-card {
  background: white;
  border-radius: 20px;
  padding: 48px 40px;
  width: 300px;
  text-align: center;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.mode-card:hover {
  border-color: #4f46e5;
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(79, 70, 229, 0.15);
}

.mode-card--graduation:hover {
  border-color: #10b981;
  box-shadow: 0 12px 40px rgba(16, 185, 129, 0.15);
}

.project-icon {
  color: #4f46e5;
}

.graduation-icon {
  color: #10b981;
}

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.card-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 0;
}

.card-btn {
  width: 100%;
  margin-top: 8px;
}

.mode-footer {
  color: #94a3b8;
}
</style>
