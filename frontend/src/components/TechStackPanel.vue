<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { Collection, Plus, Check } from '@element-plus/icons-vue';

interface Props {
  techStack: string[];
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true
});

const emit = defineEmits<{
  'update:techStack': [techStack: string];
}>();

const techOptions = [
  'Vue', 'React', 'Angular', 'Node.js', 'Express', 'Koa',
  'MySQL', 'MongoDB', 'PostgreSQL', 'Redis', 'Prisma',
  'Tailwind', 'Element Plus', 'Ant Design', 'Bootstrap',
  'TypeScript', 'JavaScript', 'Python', 'Java',
  'Docker', 'Nginx', 'Webpack', 'Vite', 'Spring Boot', 'Go'
];

const newTech = ref('');
const isEditing = ref(false);

const uniqueTechStack = computed(() => {
  return [...new Set(props.techStack)].filter(Boolean);
});

function addTech(): void {
  const trimmed = newTech.value.trim();
  if (!trimmed) return;

  if (uniqueTechStack.value.includes(trimmed)) {
    ElMessage.warning('该技术栈已存在');
    return;
  }

  const updated = [...props.techStack, trimmed];
  emit('update:techStack', updated.join(','));
  newTech.value = '';
}

function removeTech(tech: string): void {
  const updated = props.techStack.filter(t => t !== tech);
  emit('update:techStack', updated.join(','));
}

function toggleEdit(): void {
  isEditing.value = !isEditing.value;
}
</script>

<template>
  <el-card class="tech-stack-panel" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="title">
          <el-icon><Collection /></el-icon>
          <span>技术栈方案</span>
        </div>
        <el-button
          v-if="editable"
          :type="isEditing ? 'success' : 'primary'"
          size="small"
          circle
          @click="toggleEdit"
        >
          <el-icon><Check v-if="isEditing" /><Plus v-else /></el-icon>
        </el-button>
      </div>
    </template>

    <div class="tech-stack-content">
      <div v-if="uniqueTechStack.length > 0" class="tech-tags">
        <el-tag
          v-for="tech in uniqueTechStack"
          :key="tech"
          class="modern-tag"
          :closable="editable && isEditing"
          effect="light"
          round
          @close="removeTech(tech)"
        >
          {{ tech }}
        </el-tag>
      </div>

      <div v-else-if="!isEditing" class="tech-empty">
        <p>暂无技术栈方案</p>
      </div>

      <div v-if="editable && isEditing" class="tech-add-section">
        <el-select
          v-model="newTech"
          placeholder="选择或输入技术"
          filterable
          allow-create
          default-first-option
          clearable
          size="small"
          @change="addTech"
          class="tech-select"
        >
          <el-option
            v-for="option in techOptions"
            :key="option"
            :label="option"
            :value="option"
          />
        </el-select>
        <p class="hint">按回车确认添加</p>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.tech-stack-panel {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #334155;
}

.tech-stack-content {
  min-height: 40px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modern-tag {
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  color: #475569;
  font-weight: 500;
  padding: 4px 10px;
  height: auto;
}

:deep(.el-tag .el-tag__close) {
  color: #94a3b8;
}

:deep(.el-tag .el-tag__close:hover) {
  background-color: #ef4444;
  color: white;
}

.tech-empty {
  text-align: center;
  padding: 12px 0;
  color: #94a3b8;
  font-size: 13px;
}

.tech-add-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed #e2e8f0;
}

.tech-select {
  width: 100%;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: none !important;
  border: 1px solid #e2e8f0;
}

.hint {
  font-size: 11px;
  color: #94a3b8;
  margin-top: 8px;
  text-align: center;
}
</style>