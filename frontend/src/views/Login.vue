<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">VibeCoding 教学实践平台</h1>
      <h2 class="login-subtitle">学生登录</h2>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="学号" prop="studentId">
          <el-input
            v-model="form.studentId"
            placeholder="请输入学号"
            :disabled="loading"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
            :disabled="loading"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            native-type="submit"
            :loading="loading"
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="error"
        :title="error"
        type="error"
        show-icon
        :closable="false"
        class="error-alert"
      />

      <div class="login-hint">
        <p>初始密码默认为学号</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { useAuthStore } from '@/stores/auth.store';

// Router will be added in Plan 04
// const router = useRouter();
// const route = useRoute();
const authStore = useAuthStore();

const formRef = ref<FormInstance>();
const form = ref({
  studentId: '',
  password: ''
});

const loading = computed(() => authStore.loading);
const error = computed(() => authStore.error);

// Form validation rules (D-02: studentId required)
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
    // Router redirect will be added in Plan 04
    // const redirect = route.query.redirect as string || '/dashboard';
    // router.push(redirect);
  }
  // Error already shown via authStore.error binding
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.login-title {
  text-align: center;
  margin-bottom: 10px;
  color: #333;
  font-size: 24px;
}

.login-subtitle {
  text-align: center;
  margin-bottom: 30px;
  color: #666;
  font-size: 16px;
}

.login-button {
  width: 100%;
}

.error-alert {
  margin-top: 20px;
}

.login-hint {
  margin-top: 20px;
  text-align: center;
  color: #999;
  font-size: 12px;
}
</style>