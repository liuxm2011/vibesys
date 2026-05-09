<script setup lang="ts">
import { Edit, View } from '@element-plus/icons-vue';

interface Props {
  mode: 'read' | 'edit';
}

defineProps<Props>();

const emit = defineEmits<{
  'update:mode': [mode: 'read' | 'edit'];
}>();
</script>

<template>
  <div class="mode-toggle">
    <button
      class="toggle-btn"
      :class="{ active: mode === 'read' }"
      @click="emit('update:mode', 'read')"
      title="阅读模式"
    >
      <el-icon :size="14"><View /></el-icon>
    </button>
    <button
      class="toggle-btn"
      :class="{ active: mode === 'edit' }"
      @click="emit('update:mode', 'edit')"
      title="编辑模式"
    >
      <el-icon :size="14"><Edit /></el-icon>
    </button>
  </div>
</template>

<style scoped>
.mode-toggle {
  display: flex;
  align-items: center;
  background-color: #f1f5f9;
  border-radius: 6px;
  padding: 2px;
  gap: 1px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 26px;
  border: none;
  border-radius: 5px;
  background: transparent;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  color: #64748b;
  background-color: #e2e8f0;
}

.toggle-btn.active {
  background-color: #ffffff;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}
</style>
