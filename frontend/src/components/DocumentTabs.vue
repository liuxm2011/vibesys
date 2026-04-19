<script setup lang="ts">
import { ref, watch } from 'vue';
import { Link, List, Document as DocumentIcon, Reading, Files, Monitor, Cpu } from '@element-plus/icons-vue';
import type { Document as DocModel, DocType } from '@/types/document';

interface Props {
  documents: DocModel[];
  activeDocType: DocType;
  generating?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  generating: false
});

const emit = defineEmits<{
  'update:activeDocType': [docType: DocType];
}>();

const activeTab = ref<string>(props.activeDocType);

watch(() => props.activeDocType, (newType) => {
  activeTab.value = newType;
});

function getDocument(docType: DocType): DocModel | undefined {
  return props.documents.find(d => d.docType === docType);
}

function hasContent(docType: DocType): boolean {
  const doc = getDocument(docType);
  return !!(doc && doc.content.length > 0);
}

function handleTabChange(tabName: any): void {
  emit('update:activeDocType', tabName as DocType);
}
</script>

<template>
  <div class="custom-tabs-container">
    <el-tabs v-model="activeTab" @tab-change="handleTabChange" class="modern-tabs">
      <el-tab-pane name="PRD">
        <template #label>
          <div class="tab-label">
            <el-icon><Files /></el-icon>
            <span>PRD</span>
            <div v-if="!hasContent('PRD')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="prd" :document="getDocument('PRD')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="FRONTEND">
        <template #label>
          <div class="tab-label">
            <el-icon><Monitor /></el-icon>
            <span>前端</span>
            <div v-if="!hasContent('FRONTEND')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="frontend" :document="getDocument('FRONTEND')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="BACKEND">
        <template #label>
          <div class="tab-label">
            <el-icon><Cpu /></el-icon>
            <span>后端</span>
            <div v-if="!hasContent('BACKEND')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="backend" :document="getDocument('BACKEND')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="API">
        <template #label>
          <div class="tab-label">
            <el-icon><Link /></el-icon>
            <span>API</span>
            <div v-if="!hasContent('API')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="api" :document="getDocument('API')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="TASK">
        <template #label>
          <div class="tab-label">
            <el-icon><List /></el-icon>
            <span>任务清单</span>
            <div v-if="!hasContent('TASK')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="task" :document="getDocument('TASK')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="CONTEXT_STATE">
        <template #label>
          <div class="tab-label">
            <el-icon><DocumentIcon /></el-icon>
            <span>状态</span>
            <div v-if="!hasContent('CONTEXT_STATE')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="contextState" :document="getDocument('CONTEXT_STATE')" />
        </div>
      </el-tab-pane>

      <el-tab-pane name="AGENTS">
        <template #label>
          <div class="tab-label">
            <el-icon><Reading /></el-icon>
            <span>规则</span>
            <div v-if="!hasContent('AGENTS')" class="status-dot empty"></div>
            <div v-else class="status-dot success"></div>
          </div>
        </template>
        <div class="tab-content">
          <slot name="agents" :document="getDocument('AGENTS')" />
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
