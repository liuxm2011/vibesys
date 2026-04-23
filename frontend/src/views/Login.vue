<template>
  <div class="login-container">
    <!-- 左侧品牌展示区 -->
    <div class="login-brand-section">
      <div class="brand-content">
        <div class="brand-header">
          <div class="logo">VB</div>
          <h1 class="brand-name">VibeCoding</h1>
        </div>
        <div class="brand-main">
          <h2 class="slogan">AI 驱动的<br />教学实践新体验</h2>
          <p class="description">
            VibeCoding 致力于利用 AI 技术，为学生提供智能化的项目构建与选题指导，
            让教学实践更高效、更有趣。
          </p>
        </div>
        <div class="brand-footer">
          <div class="feature-item">
            <el-icon><Cpu /></el-icon>
            <span>智能选题</span>
          </div>
          <div class="feature-item">
            <el-icon><Document /></el-icon>
            <span>自动文档</span>
          </div>
          <div class="feature-item">
            <el-icon><Monitor /></el-icon>
            <span>实时协作</span>
          </div>
        </div>
      </div>
      <!-- 背景装饰 -->
      <div class="brand-bg-blobs">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
    </div>

    <!-- 右侧登录表单区 -->
    <div class="login-form-section">
      <div class="form-wrapper">
        <div class="form-header">
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-desc">请登录您的账号以继续使用平台功能</p>
        </div>

        <div class="form-body">
          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleLogin"
            size="large"
          >
            <el-form-item label="学号" prop="studentId">
              <el-input
                v-model="form.studentId"
                placeholder="请输入您的学号"
                :prefix-icon="User"
                :disabled="loading"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入您的密码"
                :prefix-icon="Lock"
                show-password
                :disabled="loading"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="rememberMe">记住我</el-checkbox>
              <el-button link type="primary">忘记密码？</el-button>
            </div>

            <el-button
              type="primary"
              native-type="submit"
              :loading="loading"
              class="login-button"
            >
              立即登录
            </el-button>
          </el-form>

          <Transition name="el-fade-in">
            <el-alert
              v-if="error"
              :title="error"
              type="error"
              show-icon
              :closable="false"
              class="error-alert"
            />
          </Transition>

          <div class="login-hint">
            <el-icon><InfoFilled /></el-icon>
            <span>初始密码默认为您的学号</span>
          </div>
        </div>

        <div class="form-footer">
          <p>© 2026 VibeCoding 教学实践平台</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, InfoFilled, Cpu, Document, Monitor } from '@element-plus/icons-vue';
import type { FormInstance, FormRules } from 'element-plus';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();
const form = ref({
  studentId: '',
  password: ''
});
const rememberMe = ref(false);

const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

const rules: FormRules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
};

async function handleLogin() {
  if (!formRef.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  const success = await authStore.login(form.value.studentId, form.value.password);

  if (success) {
    ElMessage.success('登录成功');
    const redirect = route.query.redirect as string;
    if (redirect) {
      await router.push(redirect);
    } else {
      const isAdmin = authStore.user?.role === 'ADMIN';
      await router.push(isAdmin ? '/admin' : '/dashboard');
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  background-color: #ffffff;
  overflow: hidden;
}

/* 左侧品牌区 */
.login-brand-section {
  position: relative;
  flex: 1.2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 80px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  overflow: hidden;
}

@media (max-width: 1024px) {
  .login-brand-section {
    display: none;
  }
}

.brand-content {
  position: relative;
  z-index: 10;
  max-width: 540px;
}

.brand-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 60px;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  font-weight: 800;
  font-size: 24px;
  border-radius: 16px;
}

.brand-name {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  letter-spacing: -0.025em;
}

.slogan {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 24px;
  letter-spacing: -0.02em;
}

.description {
  font-size: 18px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 60px;
}

.brand-footer {
  display: flex;
  gap: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.feature-item .el-icon {
  font-size: 20px;
}

/* 装饰性背景 */
.brand-bg-blobs {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
}

.blob-1 {
  width: 600px;
  height: 600px;
  background: #c084fc;
  top: -200px;
  right: -100px;
}

.blob-2 {
  width: 500px;
  height: 500px;
  background: #60a5fa;
  bottom: -150px;
  left: -50px;
}

/* 右侧表单区 */
.login-form-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f8fafc;
}

.form-wrapper {
  width: 100%;
  max-width: 440px;
  background: white;
  padding: 48px;
  border-radius: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 640px) {
  .form-wrapper {
    padding: 32px 24px;
    box-shadow: none;
    background: transparent;
  }
}

.form-header {
  margin-bottom: 32px;
}

.form-title {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 8px;
}

.form-desc {
  font-size: 15px;
  color: #64748b;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
  height: 52px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
  border: none !important;
  transition: all 0.2s ease !important;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
}

.error-alert {
  margin-top: 24px;
  border-radius: 12px;
}

.login-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
  color: #94a3b8;
  font-size: 14px;
}

.form-footer {
  margin-top: 48px;
  text-align: center;
  font-size: 13px;
  color: #94a3b8;
}

/* 覆盖 Element Plus 样式 */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #334155;
  margin-bottom: 6px !important;
}

:deep(.el-input__wrapper) {
  background-color: #f1f5f9;
  box-shadow: none !important;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.2s ease;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}

:deep(.el-checkbox__label) {
  color: #64748b;
}
</style>
