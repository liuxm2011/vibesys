<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  Notebook,
  EditPen,
  TrendCharts,
  Edit,
  Checked,
  Finished
} from '@element-plus/icons-vue';
import type { GraduationDocType } from '@/types/graduation-document';

interface Props {
  documents: GraduationDocument[];
  activeDocType: GraduationDocType;
  generating?: boolean;
}

interface GraduationDocument {
  id: number;
  projectId: number;
  docType: GraduationDocType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const props = withDefaults(defineProps<Props>(), {
  generating: false
});

const emit = defineEmits<{
  'update:activeDocType': [docType: GraduationDocType];
}>();

const activeTab = ref<string>(props.activeDocType);

watch(() => props.activeDocType, (newType) => {
  activeTab.value = newType;
});

function getDocument(docType: GraduationDocType): GraduationDocument | undefined {
  return props.documents.find(d => d.docType === docType);
}

function hasContent(docType: GraduationDocType): boolean {
  const doc = getDocument(docType);
  return !!(doc && doc.content.length > 0);
}

function handleTabChange(tabName: any): void {
  emit('update:activeDocType', tabName as GraduationDocType);
}
</script>

<template>
  <div class="custom-tabs-container">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="modern-tabs">
      <el-tab-pane name="TASK_BOOK">
        <template #label>
          <div class="tab-label">
            <el-icon><Notebook /></el-icon>
            <span>任务书</span>
            <div v-if="!hasContent('TASK_BOOK')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="taskBook" :document="getDocument('TASK_BOOK')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="PROPOSAL">
        <template #label>
          <div class="tab-label">
            <el-icon><EditPen /></el-icon>
            <span>开题报告</span>
            <div v-if="!hasContent('PROPOSAL')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="proposal" :document="getDocument('PROPOSAL')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="PREPARATION">
        <template #label>
          <div class="tab-label">
            <el-icon><TrendCharts /></el-icon>
            <span>前期准备</span>
            <div v-if="!hasContent('PREPARATION')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="preparation" :document="getDocument('PREPARATION')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="DRAFTING">
        <template #label>
          <div class="tab-label">
            <el-icon><Edit /></el-icon>
            <span>撰写</span>
            <div v-if="!hasContent('DRAFTING')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="drafting" :document="getDocument('DRAFTING')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="MIDTERM_CHECK">
        <template #label>
          <div class="tab-label">
            <el-icon><Checked /></el-icon>
            <span>中期检查</span>
            <div v-if="!hasContent('MIDTERM_CHECK')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="midtermCheck" :document="getDocument('MIDTERM_CHECK')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="REFINEMENT">
        <template #label>
          <div class="tab-label">
            <el-icon><Finished /></el-icon>
            <span>完善</span>
            <div v-if="!hasContent('REFINEMENT')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="refinement" :document="getDocument('REFINEMENT')" />
        </div>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<style scoped>
.custom-tabs-container {
  height: 100%;
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
