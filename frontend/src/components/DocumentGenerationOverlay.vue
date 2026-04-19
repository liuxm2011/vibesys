<script setup lang="ts">
import { computed } from 'vue';
import { Loading } from '@element-plus/icons-vue';

interface Props {
  progressLines?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  progressLines: () => []
});

const previewLines = computed(() => {
  if (props.progressLines.length > 0) {
    return [...props.progressLines, ...props.progressLines];
  }

  return [
    '正在整理文档结构与章节顺序...',
    '正在生成关键模块说明与实现细节...',
    '正在补全内容并做一致性校验...',
    '正在润色最终输出格式与段落层级...'
  ];
});
</script>

<template>
  <div class="document-generation-overlay">
    <div class="document-generation-mask"></div>
    <div class="document-generation-card">
      <div class="document-generation-header">
        <span class="document-generation-title">实时渲染预览</span>
        <span class="document-generation-badge">
          <el-icon class="is-loading"><Loading /></el-icon>
          数据流持续输出中
        </span>
      </div>
      <div class="document-generation-viewport">
        <div class="document-generation-track">
          <p v-for="(line, index) in previewLines" :key="`${line}-${index}`" class="document-generation-line">
            {{ line }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.document-generation-overlay {
  position: absolute;
  inset: 0;
  z-index: 12;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  pointer-events: none;
}

.document-generation-mask {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(241, 245, 249, 0.12), rgba(241, 245, 249, 0.74));
  backdrop-filter: blur(6px);
}

.document-generation-card {
  position: relative;
  width: min(100%, 720px);
  border-radius: 24px;
  padding: 18px 20px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(238, 242, 255, 0.96));
  border: 1px solid rgba(165, 180, 252, 0.5);
  box-shadow:
    0 28px 60px rgba(99, 102, 241, 0.14),
    0 8px 20px rgba(15, 23, 42, 0.08);
}

.document-generation-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.document-generation-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #6366f1;
}

.document-generation-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(99, 102, 241, 0.1);
  color: #4f46e5;
  font-size: 12px;
  font-weight: 600;
}

.document-generation-viewport {
  height: 72px;
  overflow: hidden;
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(241, 245, 249, 0.92));
  border: 1px solid rgba(226, 232, 240, 0.88);
  position: relative;
}

.document-generation-viewport::before,
.document-generation-viewport::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 16px;
  z-index: 1;
  pointer-events: none;
}

.document-generation-viewport::before {
  top: 0;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(248, 250, 252, 0));
}

.document-generation-viewport::after {
  bottom: 0;
  background: linear-gradient(0deg, rgba(248, 250, 252, 0.98), rgba(248, 250, 252, 0));
}

.document-generation-track {
  padding: 12px 16px;
  animation: overlay-scroll 12s linear infinite;
}

.document-generation-line {
  margin: 0;
  height: 24px;
  line-height: 24px;
  text-align: left;
  font-size: 13px;
  color: #475569;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.document-generation-line::before {
  content: '>';
  margin-right: 10px;
  color: #818cf8;
  font-weight: 700;
}

@keyframes overlay-scroll {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-96px);
  }
}
</style>
