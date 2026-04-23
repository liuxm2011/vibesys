<template>
  <el-dialog
    v-model="visible"
    title="提交自拟选题"
    width="640"
    @close="handleClose"
    class="modern-dialog wizard-dialog"
  >
    <!-- Step indicator -->
    <el-steps
      :active="currentStep"
      align-center
      class="wizard-steps"
      finish-status="success"
    >
      <el-step title="选题名称" />
      <el-step title="核心描述" />
      <el-step title="技术领域" />
      <el-step title="运行平台" />
      <el-step title="技术栈" />
    </el-steps>

    <!-- Step 1: Title -->
    <div v-if="currentStep === 1" class="wizard-step">
      <h3 class="step-title">给你的项目起一个响亮的名字</h3>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item prop="title">
          <el-input
            v-model="formData.title"
            placeholder="如：基于Vue的校园二手交易平台"
            maxlength="100"
            show-word-limit
            size="large"
            @keyup.enter="nextStep"
          />
        </el-form-item>
      </el-form>
      <div class="step-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="nextStep" :disabled="!formData.title || formData.title.length < 2">
          下一步
        </el-button>
      </div>
    </div>

    <!-- Step 2: Description -->
    <div v-if="currentStep === 2" class="wizard-step">
      <h3 class="step-title">简单描述一下你的项目</h3>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
      >
        <el-form-item prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            placeholder="描述项目要解决什么问题，实现什么功能..."
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
      <div class="step-footer">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep" :disabled="!formData.description || formData.description.length < 10">
          下一步
        </el-button>
      </div>
    </div>

    <!-- Step 3: Domain -->
    <div v-if="currentStep === 3" class="wizard-step">
      <h3 class="step-title">选择你的技术领域</h3>
      <el-form ref="formRef" :model="formData" :rules="formRules">
        <div class="domain-cards">
          <div
            :class="['domain-card', { active: formData.domain === 'SE' }]"
            @click="formData.domain = 'SE'"
          >
            <div class="card-icon">💻</div>
            <h4>软件工程</h4>
            <p>Web应用、管理系统、移动应用等</p>
          </div>
          <div
            :class="['domain-card', { active: formData.domain === 'BD' }]"
            @click="formData.domain = 'BD'"
          >
            <div class="card-icon">📊</div>
            <h4>大数据</h4>
            <p>数据分析、可视化、机器学习等</p>
          </div>
        </div>
      </el-form>
      <div class="step-footer">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep">
          下一步
        </el-button>
      </div>
    </div>

    <!-- Step 4: Platform -->
    <div v-if="currentStep === 4" class="wizard-step">
      <h3 class="step-title">选择你的项目运行平台</h3>
      <div class="platform-cards">
        <div
          v-for="platform in PLATFORM_LIST"
          :key="platform.key"
          :class="['platform-card', { active: formData.platform === platform.key }]"
          @click="formData.platform = platform.key"
        >
          <div class="card-icon">{{ platform.icon }}</div>
          <h4>{{ platform.name }}</h4>
          <p>{{ platform.desc }}</p>
        </div>
      </div>
      <div class="step-footer">
        <el-button @click="prevStep">上一步</el-button>
        <el-button type="primary" @click="nextStep" :disabled="!formData.platform">
          下一步
        </el-button>
      </div>
    </div>

    <!-- Step 5: Tech Stack -->
    <div v-if="currentStep === 5" class="wizard-step">
      <h3 class="step-title">选择你希望使用的技术栈</h3>
      <p class="step-hint">至少选择 3 项，将用于后续文档生成</p>

      <div v-for="cat in techCategories" :key="cat" class="tech-category-section">
        <h4 class="category-label">{{ cat }}</h4>
        <div class="tech-checkboxes">
          <el-checkbox
            v-for="tech in filteredByCategory(cat)"
            :key="tech.name"
            v-model="selectedTechStack"
            :label="tech.name"
            border
            class="tech-checkbox"
          >
            {{ tech.name }}
            <el-tag v-if="tech.recommended" size="small" type="warning" class="rec-tag">推荐</el-tag>
          </el-checkbox>
        </div>
      </div>

      <!-- Selected preview -->
      <div v-if="selectedTechStack.length > 0" class="tech-preview">
        <h4 class="category-label">
          已选技术栈 ({{ selectedTechStack.length }})
        </h4>
        <div class="selected-tags">
          <el-tag
            v-for="tech in selectedTechStack"
            :key="tech"
            closable
            @close="selectedTechStack = selectedTechStack.filter(t => t !== tech)"
            type="primary"
            effect="dark"
            class="tag-item"
          >
            {{ tech }}
          </el-tag>
        </div>
      </div>

      <div class="step-footer">
        <el-button @click="prevStep">上一步</el-button>
        <el-button
          type="primary"
          :disabled="selectedTechStack.length < 3"
          @click="handleSubmit"
          :loading="loading"
        >
          提交选题 (已选 {{ selectedTechStack.length }} 项)
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { useTopicStore } from '@/stores/topic.store';
import type { Domain, Platform } from '@/types/topic';
import { PLATFORM_LABELS, TechCategory } from '@/types/topic';
import { getTechOptionsByPlatform } from '@/constants/tech-options';

const PLATFORM_LIST = Object.entries(PLATFORM_LABELS).map(([key, val]) => ({
  key: key as Platform,
  ...val,
}));

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
const currentStep = ref(1);

const formData = reactive({
  title: '',
  domain: 'SE' as Domain,
  platform: '' as Platform,
  description: '',
  background: '',
  objectives: ''
});

const selectedTechStack = ref<string[]>([]);

const techCategories = Object.values(TechCategory);

const platformFilteredTechOptions = computed(() =>
  formData.platform ? getTechOptionsByPlatform(formData.platform) : []
);

function filteredByCategory(category: TechCategory) {
  return platformFilteredTechOptions.value.filter(t => t.category === category);
}

const formRules: FormRules = {
  title: [
    { required: true, message: '请输入选题标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度需要在2-100字符之间', trigger: 'blur' }
  ],
  domain: [
    { required: true, message: '请选择领域', trigger: 'change' }
  ],
  platform: [
    { required: true, message: '请选择运行平台', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入选题描述', trigger: 'blur' },
    { min: 10, max: 500, message: '描述长度需要在10-500字符之间', trigger: 'blur' }
  ]
};

const visible = ref(props.visible);
watch(() => props.visible, (val) => {
  visible.value = val;
  if (val) {
    currentStep.value = 1;
  }
});
watch(visible, (val) => {
  emit('update:visible', val);
});

function nextStep() {
  if (currentStep.value === 1 && (!formData.title || formData.title.length < 2)) {
    ElMessage.warning('请输入选题名称（至少2个字符）');
    return;
  }
  if (currentStep.value === 2 && (!formData.description || formData.description.length < 10)) {
    ElMessage.warning('请输入核心描述（至少10个字符）');
    return;
  }
  if (currentStep.value === 4 && !formData.platform) {
    ElMessage.warning('请选择运行平台');
    return;
  }
  if (currentStep.value < 5) {
    currentStep.value++;
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
}

async function handleSubmit(): Promise<void> {
  if (selectedTechStack.value.length < 3) {
    ElMessage.warning('请至少选择3项技术');
    return;
  }

  loading.value = true;
  const success = await topicStore.createCustomTopic({
    title: formData.title,
    description: formData.description,
    background: formData.background || undefined,
    objectives: formData.objectives || undefined,
    domain: formData.domain,
    platform: formData.platform,
    techStack: selectedTechStack.value,
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
  formData.platform = '' as Platform;
  formData.description = '';
  formData.background = '';
  formData.objectives = '';
  selectedTechStack.value = [];
  currentStep.value = 1;
  formRef.value?.resetFields();
}

function handleCancel(): void {
  resetForm();
  handleClose();
}

function handleClose(): void {
  visible.value = false;
}
</script>

<style scoped>
.wizard-steps {
  margin-bottom: 28px;
}

.wizard-step {
  padding: 4px 0;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px;
}

.step-hint {
  font-size: 13px;
  color: #94a3b8;
  margin: 0 0 16px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Domain cards */
.domain-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.domain-card,
.platform-card {
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #f8fafc;
}

.domain-card:hover,
.platform-card:hover {
  border-color: #a5b4fc;
  background: #eef2ff;
}

.domain-card.active,
.platform-card.active {
  border-color: #4f46e5;
  background: #eef2ff;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
}

.card-icon {
  font-size: 36px;
  margin-bottom: 8px;
}

.domain-card h4,
.platform-card h4 {
  margin: 8px 0 4px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.domain-card p,
.platform-card p {
  margin: 0;
  font-size: 13px;
  color: #64748b;
}

/* Platform cards — 3 columns */
.platform-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 640px) {
  .platform-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tech stack */
.tech-category-section {
  margin-bottom: 16px;
}

.category-label {
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  margin: 0 0 8px;
}

.tech-checkboxes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-checkbox {
  margin-right: 0 !important;
}

.rec-tag {
  margin-left: 4px;
  vertical-align: middle;
}

.tech-preview {
  margin-top: 16px;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 12px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.tag-item {
  cursor: pointer;
}

/* Footer */
.step-footer {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.step-footer .el-button {
  flex: 1;
  border-radius: 12px;
  height: 44px;
}

.step-footer .el-button--primary {
  background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
  border: none !important;
  font-weight: 600;
}

/* Dialog overrides */
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

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #475569;
}

:deep(.el-input__wrapper), :deep(.el-textarea__inner) {
  border-radius: 12px;
  background-color: #f8fafc;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
}

:deep(.el-input__wrapper.is-focus), :deep(.el-textarea__inner:focus) {
  background-color: #ffffff;
  border-color: #4f46e5;
  box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1) !important;
}

/* Mobile responsive */
@media (max-width: 640px) {
  .domain-cards {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
