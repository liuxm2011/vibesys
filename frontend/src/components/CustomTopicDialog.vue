<template>
  <el-dialog
    v-model="visible"
    title="提交自拟选题"
    width="500"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="formData.title"
          placeholder="请输入选题标题"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="领域" prop="domain">
        <el-radio-group v-model="formData.domain">
          <el-radio-button value="SE">软件工程</el-radio-button>
          <el-radio-button value="BD">大数据</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请描述选题内容"
          maxlength="500"
          show-word-limit
        />
      </el-form-item>

      <el-form-item label="背景" prop="background">
        <el-input
          v-model="formData.background"
          type="textarea"
          :rows="2"
          placeholder="选题背景（可选）"
        />
      </el-form-item>

      <el-form-item label="目标" prop="objectives">
        <el-input
          v-model="formData.objectives"
          type="textarea"
          :rows="2"
          placeholder="预期目标（可选）"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">
        提交选题
      </el-button>
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

// Form data
const formData = reactive({
  title: '',
  domain: 'SE' as Domain,
  description: '',
  background: '',
  objectives: ''
});

// Validation rules (D-12: title required, description required, domain required)
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

// Sync visible prop with v-model
const visible = ref(props.visible);
watch(() => props.visible, (val) => {
  visible.value = val;
});
watch(visible, (val) => {
  emit('update:visible', val);
});

async function handleSubmit(): Promise<void> {
  if (!formRef.value) return;

  const valid = await formRef.value.validate();
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
.el-input__textarea {
  min-height: 60px;
}
</style>