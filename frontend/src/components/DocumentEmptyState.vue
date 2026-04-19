<script setup lang="ts">
import { computed } from 'vue';
import { Loading, MagicStick } from '@element-plus/icons-vue';

interface Props {
  description: string;
  buttonLabel: string;
  blockedReason?: string | null;
  generating?: boolean;
  disabled?: boolean;
  progressLines?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  blockedReason: null,
  generating: false,
  disabled: false,
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

defineEmits<{
  generate: [];
}>();
</script>

<template>
  <div class="doc-empty-state">
    <div class="doc-empty-illustration" aria-hidden="true">
      <div class="doc-empty-halo"></div>
      <div class="doc-empty-cube">
        <span>AI</span>
      </div>
    </div>

    <Transition name="preview-fade">
      <div v-if="generating" class="generation-preview">
        <div class="generation-preview-header">
          <span class="generation-preview-title">实时渲染预览</span>
          <span class="generation-preview-badge">
            <el-icon class="is-loading"><Loading /></el-icon>
            数据流持续输出中
          </span>
        </div>
        <div class="generation-preview-viewport">
          <div class="generation-preview-track">
            <p v-for="(line, index) in previewLines" :key="`${line}-${index}`" class="generation-preview-line">
              {{ line }}
            </p>
          </div>
        </div>
      </div>
    </Transition>

    <p class="doc-empty-description">{{ description }}</p>
    <p v-if="blockedReason" class="doc-empty-hint">{{ blockedReason }}</p>

    <el-button
      type="primary"
      class="doc-empty-action"
      :loading="generating"
      :disabled="disabled"
      @click="$emit('generate')"
    >
      <el-icon><MagicStick /></el-icon>
      {{ buttonLabel }}
    </el-button>
  </div>
</template>

<style scoped>
.doc-empty-state {
  width: min(100%, 560px);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.doc-empty-illustration {
  position: relative;
  width: 180px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.doc-empty-halo {
  position: absolute;
  inset: auto 24px 6px;
  height: 16px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(148, 163, 184, 0.28), rgba(148, 163, 184, 0.02) 70%);
}

.doc-empty-cube {
  position: relative;
  width: 112px;
  height: 112px;
  border-radius: 30px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(226, 232, 240, 0.82)),
    linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(14, 165, 233, 0.1));
  border: 1px solid rgba(226, 232, 240, 0.95);
  box-shadow:
    0 20px 48px rgba(148, 163, 184, 0.18),
    inset -14px -16px 28px rgba(148, 163, 184, 0.12),
    inset 10px 10px 22px rgba(255, 255, 255, 0.96);
  transform: rotate(-12deg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.doc-empty-cube::before,
.doc-empty-cube::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.62);
}

.doc-empty-cube::before {
  inset: 16px auto 16px 50%;
  width: 1px;
}

.doc-empty-cube::after {
  inset: 50% 16px auto 16px;
  height: 1px;
}

.doc-empty-cube span {
  font-size: 24px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #94a3b8;
  transform: rotate(12deg);
}

.generation-preview {
  width: 100%;
  border-radius: 20px;
  padding: 14px 16px;
  background:
    linear-gradient(180deg, rgba(238, 242, 255, 0.96), rgba(248, 250, 252, 0.98));
  border: 1px solid rgba(165, 180, 252, 0.42);
  box-shadow:
    0 18px 36px rgba(99, 102, 241, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.85);
}

.generation-preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.generation-preview-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #6366f1;
}

.generation-preview-badge {
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

.generation-preview-viewport {
  height: 72px;
  overflow: hidden;
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.88), rgba(241, 245, 249, 0.92));
  border: 1px solid rgba(226, 232, 240, 0.88);
  position: relative;
}

.generation-preview-viewport::before,
.generation-preview-viewport::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 16px;
  z-index: 1;
  pointer-events: none;
}

.generation-preview-viewport::before {
  top: 0;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), rgba(248, 250, 252, 0));
}

.generation-preview-viewport::after {
  bottom: 0;
  background: linear-gradient(0deg, rgba(248, 250, 252, 0.98), rgba(248, 250, 252, 0));
}

.generation-preview-track {
  padding: 12px 16px;
  animation: preview-scroll 12s linear infinite;
}

.generation-preview-line {
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

.generation-preview-line::before {
  content: '>';
  margin-right: 10px;
  color: #818cf8;
  font-weight: 700;
}

.doc-empty-description {
  margin: 0;
  font-size: 16px;
  color: #94a3b8;
}

.doc-empty-hint {
  margin: -4px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
  max-width: 420px;
}

.doc-empty-action {
  min-width: 196px;
  height: 44px;
  border: none !important;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #7c3aed) !important;
  box-shadow: 0 12px 24px rgba(99, 102, 241, 0.2);
}

.preview-fade-enter-active,
.preview-fade-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.preview-fade-enter-from,
.preview-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes preview-scroll {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-96px);
  }
}
</style>
