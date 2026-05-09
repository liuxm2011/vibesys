<script setup lang="ts">
import { MagicStick } from '@element-plus/icons-vue';

interface Props {
  description: string;
  buttonLabel: string;
  blockedReason?: string | null;
  generating?: boolean;
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  blockedReason: null,
  generating: false,
  disabled: false
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
  position: relative;
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
</style>
