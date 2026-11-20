<script setup lang="ts">
import { Notebook, EditPen, TrendCharts, Edit, Checked, Finished, Document } from '@element-plus/icons-vue';
import type { GraduationDocType, GraduationDocument } from '@/types/graduation-document';
import { GRAD_DOC_GENERATION_ORDER, GRAD_DOC_TYPE_LABELS } from '@/utils/graduation-document-generation';

const props = defineProps<{ documents: GraduationDocument[] }>();
const activeTab = defineModel<GraduationDocType>('activeDocType', { required: true });

const icons = {
  TASK_BOOK: Notebook, PROPOSAL: EditPen, PREPARATION: TrendCharts, DRAFTING: Edit,
  MIDTERM_CHECK: Checked, REFINEMENT: Finished, SUMMARY: Document,
};

function getDocument(type: GraduationDocType): GraduationDocument | undefined {
  return props.documents.find(document => document.docType === type && document.content.trim());
}
</script>

<template>
  <div class="custom-tabs-container">
    <el-tabs v-model="activeTab" class="modern-tabs">
      <el-tab-pane v-for="type in GRAD_DOC_GENERATION_ORDER" :key="type" :name="type" lazy>
        <template #label>
          <div class="tab-label">
            <el-icon><component :is="icons[type]" /></el-icon>
            <span>{{ GRAD_DOC_TYPE_LABELS[type] }}</span>
            <span class="status-dot" :class="getDocument(type) ? 'success' : 'empty'"></span>
          </div>
        </template>
        <div class="tab-content">
          <slot :type="type" :document="getDocument(type)" />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.custom-tabs-container {
  flex: 1;
  min-height: 0;
  min-width: 0;
}

.modern-tabs :deep(.el-tabs__content),
.modern-tabs :deep(.el-tab-pane) {
  height: 100%;
  min-height: 0;
}

.modern-tabs :deep(.el-tabs__content) {
  flex: 1;
}

.modern-tabs :deep(.el-tabs__header) {
  flex: none;
}

.modern-tabs {
  height: 100%;
}

:deep(.el-tabs__header) {
  margin: 0 !important;
  padding: 0 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

:deep(.el-tabs__active-bar) {
  height: 3px;
  border-radius: 3px;
  background-color: #4f46e5;
}

:deep(.el-tabs__item) {
  height: 56px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  transition: all 0.2s;
}

:deep(.el-tabs__item.is-active) {
  color: #4f46e5;
}

.tab-label {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-left: 4px;
}

.status-dot.empty {
  background-color: #cbd5e1;
}

.status-dot.success {
  background-color: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);
}

.tab-content {
  height: 100%;
}
</style>
