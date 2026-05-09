<template>
  <el-dialog
    v-model="visible"
    title="选题详细方案"
    width="640"
    @close="handleClose"
    class="modern-dialog"
    destroy-on-close
  >
    <div v-if="topic" class="topic-detail-body">
      <div class="detail-header">
        <h2 class="detail-title">{{ topic.title }}</h2>
        <div class="detail-tags">
          <el-tag :type="topic.domain === 'SE' ? 'primary' : 'success'" effect="light">
            {{ topic.domain === 'SE' ? '软件工程' : '大数据' }}
          </el-tag>
          <el-tag type="info" effect="light">
            {{ PLATFORM_LABELS[topic.platform as Platform]?.icon ?? '🌐' }} {{ PLATFORM_LABELS[topic.platform as Platform]?.name ?? topic.platform }}
          </el-tag>
          <el-tag :type="topic.type === 'SYSTEM' ? 'info' : 'warning'" plain>
            {{ topic.type === 'SYSTEM' ? '系统预设' : '自拟选题' }}
          </el-tag>
        </div>
      </div>

      <div class="detail-section">
        <h4 class="section-label">选题描述</h4>
        <p class="section-content">{{ topic.description }}</p>
      </div>

      <div class="detail-grid">
        <div class="detail-section">
          <h4 class="section-label">背景描述</h4>
          <p class="section-content secondary">{{ topic.background || '暂无详细背景说明' }}</p>
        </div>
        <div class="detail-section">
          <h4 class="section-label">预期目标</h4>
          <p class="section-content secondary">{{ topic.objectives || '暂无明确目标设定' }}</p>
        </div>
      </div>

      <div class="detail-section">
        <h4 class="section-label">技术栈建议</h4>
        <div v-if="topic.techStack && topic.techStack.length > 0" class="tech-tags">
          <el-tag v-for="tech in topic.techStack" :key="tech" class="tech-tag" effect="plain" round>
            {{ tech }}
          </el-tag>
        </div>
        <p v-else class="section-content secondary">暂无推荐，可自由发挥</p>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" class="cancel-btn">返回列表</el-button>
        <el-button
          v-if="!projectStore.hasSelectedTopic(topic?.id ?? 0)"
          type="primary"
          @click="handleSelect"
          :loading="loading"
          class="confirm-btn"
        >
          确认选择此选题
        </el-button>
        <el-tag v-else type="success" size="large" effect="light" class="confirm-btn selected-tag">
          已选此题
        </el-tag>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useProjectStore } from '@/stores/project.store';
import type { Topic, Platform } from '@/types/topic';
import { PLATFORM_LABELS } from '@/types/topic';

interface Props {
  visible: boolean;
  topic: Topic | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'selected'): void;
}>();

const router = useRouter();
const projectStore = useProjectStore();
const loading = ref(false);

const visible = ref(props.visible);
watch(() => props.visible, (val) => {
  visible.value = val;
});
watch(visible, (val) => {
  emit('update:visible', val);
});

async function handleSelect(): Promise<void> {
  if (!props.topic) return;

  if (projectStore.maxProjectsReached) {
    ElMessage.warning('已达到项目上限(10个)');
    return;
  }

  loading.value = true;
  const success = await projectStore.createProject(props.topic.id);
  loading.value = false;

  if (success) {
    ElMessage.success('项目创建成功');
    emit('selected');
    // Navigate to the newly created project detail page
    const newProject = projectStore.projects.find(p => p.topicId === props.topic?.id);
    if (newProject) {
      router.push(`/projects/${newProject.id}`);
    }
    handleClose();
  } else {
    ElMessage.error(projectStore.error || '创建项目失败');
  }
}

function handleClose(): void {
  visible.value = false;
}
</script>

<style scoped>
:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.el-dialog__title) {
  font-weight: 700;
  color: #1e293b;
}

.topic-detail-body {
  padding: 8px 0;
}

.detail-header {
  margin-bottom: 24px;
}

.detail-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 12px;
}

.detail-tags {
  display: flex;
  gap: 8px;
}

.detail-section {
  margin-bottom: 24px;
}

.section-label {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-label::after {
  content: '';
  flex: 1;
  height: 1px;
  background-color: #f1f5f9;
}

.section-content {
  font-size: 15px;
  color: #334155;
  line-height: 1.6;
  margin: 0;
  white-space: pre-wrap;
}

.section-content.secondary {
  color: #64748b;
  font-size: 14px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  border-radius: 8px;
}

.dialog-footer {
  display: flex;
  gap: 12px;
  padding-top: 12px;
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

.selected-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 600;
  cursor: default;
}
</style>