<template>
  <el-dialog
    v-model="visible"
    title="提交自拟选题"
    width="560"
    @close="handleClose"
    class="modern-dialog"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-position="top"
      class="custom-form"
    >
      <el-form-item label="选题标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="给你的项目起一个响亮的名字..."
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="技术领域" prop="domain">
        <el-radio-group v-model="formData.domain" class="modern-radio">
          <el-radio-button value="SE">软件工程</el-radio-button>
          <el-radio-button value="BD">大数据</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="核心描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="简单描述一下这个项目要解决什么问题，实现什么功能..."
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <div class="form-grid">
        <el-form-item label="背景说明 (可选)" prop="background">
          <el-input
            v-model="formData.background"
            type="textarea"
            :rows="2"
            placeholder="项目来源或行业背景..."
          />
        </el-form-item>

        <el-form-item label="预期目标 (可选)" prop="objectives">
          <el-input
            v-model="formData.objectives"
            type="textarea"
            :rows="2"
            placeholder="希望达到的技术高度或应用价值..."
          />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="cancel-btn">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading" class="confirm-btn">
          提交选题
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useTopicStore } from '@/stores/topic.store';
import type { Domain } from '@/types/topic';

interface Props {
  visible: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submitted'): void;
}>();

const topicStore = useTopicStore();
const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = reactive({
  title: '',
  domain: 'SE' as Domain,
  description: '',
  background: '',
  objectives: ''
});

const formRules: FormRules = {
  title: [
    { required: true, message: '请输入选题标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度需要在2-100字符之间', trigger: 'blur' }
  ],
  domain: [
    { required: true, message: '请选择领域', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入选题描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度需要在10-500字符之间', trigger: 'blur' }
  ]
};

const visible = ref(props.visible);
watch(() => props.visible, (val) => {
  visible.value = val;
});
watch(visible, (val) => {
  emit('update:visible', val);
});

async function handleSubmit(): Promise<void> {
  if (!formRef.value) return;

  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  const success = await topicStore.createCustomTopic({
    title: formData.title,
    domain: formData.domain,
    description: formData.description,
    background: formData.background || undefined,
    objectives: formData.objectives || undefined
  });
  loading.value = false;

  if (success) {
    ElMessage.success('选题提交成功');
    emit('submitted');
    resetForm();
    handleClose();
  } else {
    ElMessage.error(topicStore.error || '提交选题失败');
  }
}

function resetForm(): void {
  formData.title = '';
  formData.domain = 'SE';
  formData.description = '';
  formData.background = '';
  formData.objectives = '';
  formRef.value?.resetFields();
}

function handleClose(): void {
  visible.value = false;
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 20px;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 24px 24px 12px;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.el-dialog__title) {
  font-weight: 700;
  color: #1e293b;
}

.custom-form {
  padding: 8px 0;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #475569;
  padding-bottom: 4px !important;
}

:deep(.el-input__wrapper), :deep(.el-textarea__inner) {
  border-radius: 12px;
  background-color: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
  transition: all 0.2s;
}

:deep(.el-input__wrapper:hover), :deep(.el-textarea__inner:hover) {
  border-color: #cbd5e1;
}

:deep(.el-input__wrapper.is-focus), :deep(.el-textarea__inner:focus) {
  background-color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}

.modern-radio {
  display: flex;
  width: 100%;
}

:deep(.el-radio-button) {
  flex: 1;
}

:deep(.el-radio-button__inner) {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px !important;
  border: 1px solid #e2e8f0 !important;
  margin: 0 4px;
}

:deep(.el-radio-button:first-child .el-radio-button__inner),
:deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 8px !important;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.dialog-footer {
  display: flex;
  gap: 12px;
}

.cancel-btn {
  flex: 1;
  border-radius: 12px;
  height: 44px;
}

.confirm-btn {
  flex: 2;
  border-radius: 12px;
  height: 44px;
  background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
  border: none !important;
  font-weight: 600;
}
</style>