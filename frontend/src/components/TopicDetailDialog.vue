<template>
  <el-dialog
    v-model="visible"
    title="选题详情"
    width="600"
    @close="handleClose"
  >
    <el-descriptions :column="1" border v-if="topic">
      <el-descriptions-item label="标题">
        {{ topic.title }}
      </el-descriptions-item>
      <el-descriptions-item label="描述">
        {{ topic.description }}
      </el-descriptions-item>
      <el-descriptions-item label="背景">
        {{ topic.background || '暂无' }}
      </el-descriptions-item>
      <el-descriptions-item label="目标">
        {{ topic.objectives || '暂无' }}
      </el-descriptions-item>
      <el-descriptions-item label="领域">
        <el-tag :type="topic.domain === 'SE' ? 'primary' : 'success'">
          {{ topic.domain === 'SE' ? '软件工程' : '大数据' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="类型">
        <el-tag :type="topic.type === 'SYSTEM' ? '' : 'warning'">
          {{ topic.type === 'SYSTEM' ? '系统预设' : '自拟选题' }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="技术栈建议">
        <div v-if="topic.techStack && topic.techStack.length > 0">
          <el-tag v-for="tech in topic.techStack" :key="tech" class="tech-tag">
            {{ tech }}
          </el-tag>
        </div>
        <span v-else>暂无建议</span>
      </el-descriptions-item>
    </el-descriptions>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSelect" :loading="loading">
        选择此选题
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useProjectStore } from '@/stores/project.store';
import type { Topic } from '@/types/topic';

interface Props {
  visible: boolean;
  topic: Topic | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'selected'): void;
}>();

const projectStore = useProjectStore();
const loading = ref(false);

// Sync visible prop with v-model
const visible = ref(props.visible);
watch(() => props.visible, (val) => {
  visible.value = val;
});
watch(visible, (val) => {
  emit('update:visible', val);
});

async function handleSelect(): Promise<void> {
  if (!props.topic) return;

  // Check if max projects reached
  if (projectStore.maxProjectsReached) {
    ElMessage.warning('已达到项目上限(10个)，请删除现有项目后再创建');
    return;
  }

  loading.value = true;
  const success = await projectStore.createProject(props.topic.id);
  loading.value = false;

  if (success) {
    ElMessage.success('项目创建成功');
    emit('selected');
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
.tech-tag {
  margin-right: 8px;
  margin-bottom: 4px;
}
</style>