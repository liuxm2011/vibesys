<template>
  <div class="login-container">
    <div class="background-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="login-card-wrapper">
      <div class="login-card">
        <div class="brand">
          <div class="logo">VB</div>
          <h1 class="login-title">VibeCoding</h1>
          <p class="login-subtitle">教学实践平台</p>
        </div>

        <div class="login-body">
          <h2 class="form-title">欢迎回来</h2>
          <p class="form-desc">请输入学号和密码以继续</p>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            @submit.prevent="handleLogin"
          >
            <el-form-item label="学号" prop="studentId">
              <el-input
                v-model="form.studentId"
                placeholder="20240001"
                :prefix-icon="User"
                size="large"
                :disabled="loading"
              />
            </el-form-item>

            <el-form-item label="密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                :prefix-icon="Lock"
                show-password
                size="large"
                :disabled="loading"
              />
            </el-form-item>

            <div class="form-footer">
              <el-button
                type="primary"
                native-type="submit"
                :loading="loading"
                class="login-button"
                size="large"
              >
                登录
              </el-button>
            </div>
          </el-form>

          <el-transition name="el-fade-in">
            <el-alert
              v-if="error"
              :title="error"
              type="error"
              show-icon
              :closable="false"
              class="error-alert"
            />
          </el-transition>

          <div class="login-hint">
            <el-icon><InfoFilled /></el-icon>
            <span>初始密码默认为学号</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { User, Lock, InfoFilled } from '@element-plus/icons-vue';
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8fafc;
  overflow: hidden;
}

.background-blobs {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.blob {
  position: absolute;
  filter: blur(80px);
  opacity: 0.4;
  border-radius: 50%;
  z-index: 0;
}

.blob-1 {
  width: 400px;
  height: 400px;
  background-color: #818cf8;
  top: -100px;
  left: -100px;
}

.blob-2 {
  width: 350px;
  height: 350px;
  background-color: #c084fc;
  bottom: -50px;
  right: -50px;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background-color: #60a5fa;
  top: 50%;
  left: 60%;
}

.login-card-wrapper {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 440px;
  padding: 20px;
}

.login-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.brand {
  padding: 40px 40px 20px;
  text-align: center;
}

.logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  font-weight: 800;
  font-size: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.3);
}

.login-title {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.025em;
}

.login-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 4px 0 0;
}

.login-body {
  padding: 0 40px 40px;
}

.form-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 24px 0 8px;
}

.form-desc {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 24px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  margin-top: 12px;
  background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
  border: none !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease !important;
}

.login-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 15px -3px rgba(79, 70, 229, 0.4);
}

.login-button:active {
  transform: translateY(0);
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
  margin-top: 24px;
  color: #94a3b8;
  font-size: 13px;
}

/* Override Element Plus Form styles */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #475569;
  padding-bottom: 4px !important;
}

:deep(.el-input__wrapper) {
  background-color: #f1f5f9;
  box-shadow: none !important;
  border: 1px solid transparent;
  border-radius: 12px;
  padding: 0 12px;
  transition: all 0.2s ease;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}
</style>