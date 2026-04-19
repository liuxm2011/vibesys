<template>
  <div class="project-detail-container">
    <!-- Header -->
    <el-header class="dashboard-header">
      <div class="header-content">
        <div class="header-left">
          <el-button circle @click="router.push('/dashboard')" class="back-btn">
            <el-icon><Back /></el-icon>
          </el-button>
          <div class="project-title-area">
            <h2 class="project-name">{{ project?.topic?.title }}</h2>
            <div class="project-meta">
              <el-tag :type="project?.topic?.domain === 'SE' ? 'primary' : 'success'" size="small" effect="light">
                {{ project?.topic?.domain === 'SE' ? '软件工程' : '大数据' }}
              </el-tag>
              <el-tag :type="getStatusTagType(project?.status)" size="small">
                {{ getStatusText(project?.status) }}
              </el-tag>
            </div>
          </div>
        </div>
        <div class="header-right">
          <div class="ai-status" v-if="documentStore.generating">
            <el-icon class="is-loading"><Loading /></el-icon>
            <span>{{ currentGeneratingLabel }}文档正在生成中...</span>
          </div>
          <el-button
            type="primary"
            class="generate-all-btn"
            :loading="documentStore.generating"
            @click="handleGenerateAll"
          >
            <el-icon><MagicStick /></el-icon>一键生成全部
          </el-button>
          <el-button
            class="export-btn"
            :loading="exporting"
            :disabled="!allDocsGenerated"
            @click="handleExportDocuments"
          >
            <el-icon><Download /></el-icon>导出全部文档
          </el-button>
        </div>
      </div>
    </el-header>

    <!-- Main Content Layout -->
    <div class="detail-layout">
      <!-- Main Column -->
      <div class="main-column">
        <!-- Document Tabs & Editor -->
        <el-card class="editor-container-card" :body-style="{ padding: '0' }">
          <DocumentTabs
            :documents="documentStore.documents"
            :active-doc-type="activeDocType"
            :generating="documentStore.generating"
            @update:active-doc-type="activeDocType = $event"
          >
            <template #prd="{ document }">
              <div v-if="document && document.content" class="document-wrapper">
                <Transition name="generation-overlay-fade">
                  <DocumentGenerationOverlay
                    v-if="isGeneratingDoc('PRD')"
                    :progress-lines="getGenerationPreviewLines('PRD')"
                  />
                </Transition>
                <MarkdownEditor
                  :content="document.content"
                  :document-id="document.id"
                  @save="handleDocumentSave"
                />
              </div>
              <div v-else class="empty-doc-placeholder">
                <DocumentEmptyState
                  description="PRD文档尚未生成"
                  button-label="立即生成 PRD"
                  :generating="isGeneratingDoc('PRD')"
                  :disabled="documentStore.generating && !isGeneratingDoc('PRD')"
                  :progress-lines="getGenerationPreviewLines('PRD')"
                  @generate="handleGenerateSingle('PRD')"
                />
              </div>
            </template>

            <template #frontend="{ document }">
              <div v-if="document && document.content" class="document-wrapper">
                <Transition name="generation-overlay-fade">
                  <DocumentGenerationOverlay
                    v-if="isGeneratingDoc('FRONTEND')"
                    :progress-lines="getGenerationPreviewLines('FRONTEND')"
                  />
                </Transition>
                <MarkdownEditor
                  :content="document.content"
                  :document-id="document.id"
                  @save="handleDocumentSave"
                />
              </div>
              <div v-else class="empty-doc-placeholder">
                <DocumentEmptyState
                  description="前端文档尚未生成"
                  button-label="立即生成前端文档"
                  :blocked-reason="getGenerateBlockedReason('FRONTEND')"
                  :generating="isGeneratingDoc('FRONTEND')"
                  :disabled="(documentStore.generating && !isGeneratingDoc('FRONTEND')) || !canGenerateDoc('FRONTEND')"
                  :progress-lines="getGenerationPreviewLines('FRONTEND')"
                  @generate="handleGenerateSingle('FRONTEND')"
                />
              </div>
            </template>

            <template #backend="{ document }">
              <div v-if="document && document.content" class="document-wrapper">
                <Transition name="generation-overlay-fade">
                  <DocumentGenerationOverlay
                    v-if="isGeneratingDoc('BACKEND')"
                    :progress-lines="getGenerationPreviewLines('BACKEND')"
                  />
                </Transition>
                <MarkdownEditor
                  :content="document.content"
                  :document-id="document.id"
                  @save="handleDocumentSave"
                />
              </div>
              <div v-else class="empty-doc-placeholder">
                <DocumentEmptyState
                  description="后端文档尚未生成"
                  button-label="立即生成后端文档"
                  :blocked-reason="getGenerateBlockedReason('BACKEND')"
                  :generating="isGeneratingDoc('BACKEND')"
                  :disabled="(documentStore.generating && !isGeneratingDoc('BACKEND')) || !canGenerateDoc('BACKEND')"
                  :progress-lines="getGenerationPreviewLines('BACKEND')"
                  @generate="handleGenerateSingle('BACKEND')"
                />
              </div>
            </template>

            <template #api="{ document }">
              <div v-if="document && document.content" class="document-wrapper">
                <Transition name="generation-overlay-fade">
                  <DocumentGenerationOverlay
                    v-if="isGeneratingDoc('API')"
                    :progress-lines="getGenerationPreviewLines('API')"
                  />
                </Transition>
                <MarkdownEditor
                  :content="document.content"
                  :document-id="document.id"
                  @save="handleDocumentSave"
                />
              </div>
              <div v-else class="empty-doc-placeholder">
                <DocumentEmptyState
                  description="API 文档尚未生成"
                  button-label="立即生成 API 文档"
                  :blocked-reason="getGenerateBlockedReason('API')"
                  :generating="isGeneratingDoc('API')"
                  :disabled="(documentStore.generating && !isGeneratingDoc('API')) || !canGenerateDoc('API')"
                  :progress-lines="getGenerationPreviewLines('API')"
                  @generate="handleGenerateSingle('API')"
                />
              </div>
            </template>

            <template #task="{ document }">
              <div v-if="document && document.content" class="document-wrapper">
                <Transition name="generation-overlay-fade">
                  <DocumentGenerationOverlay
                    v-if="isGeneratingDoc('TASK')"
                    :progress-lines="getGenerationPreviewLines('TASK')"
                  />
                </Transition>
                <MarkdownEditor
                  :content="document.content"
                  :document-id="document.id"
                  @save="handleDocumentSave"
                />
              </div>
              <div v-else class="empty-doc-placeholder">
                <DocumentEmptyState
                  description="任务清单尚未生成"
                  button-label="立即生成任务清单"
                  :blocked-reason="getGenerateBlockedReason('TASK')"
                  :generating="isGeneratingDoc('TASK')"
                  :disabled="(documentStore.generating && !isGeneratingDoc('TASK')) || !canGenerateDoc('TASK')"
                  :progress-lines="getGenerationPreviewLines('TASK')"
                  @generate="handleGenerateSingle('TASK')"
                />
              </div>
            </template>

            <template #contextState="{ document }">
              <div v-if="document && document.content" class="document-wrapper">
                <Transition name="generation-overlay-fade">
                  <DocumentGenerationOverlay
                    v-if="isGeneratingDoc('CONTEXT_STATE')"
                    :progress-lines="getGenerationPreviewLines('CONTEXT_STATE')"
                  />
                </Transition>
                <MarkdownEditor
                  :content="document.content"
                  :document-id="document.id"
                  @save="handleDocumentSave"
                />
              </div>
              <div v-else class="empty-doc-placeholder">
                <DocumentEmptyState
                  description="状态追踪文档尚未生成"
                  button-label="立即生成状态文档"
                  :blocked-reason="getGenerateBlockedReason('CONTEXT_STATE')"
                  :generating="isGeneratingDoc('CONTEXT_STATE')"
                  :disabled="(documentStore.generating && !isGeneratingDoc('CONTEXT_STATE')) || !canGenerateDoc('CONTEXT_STATE')"
                  :progress-lines="getGenerationPreviewLines('CONTEXT_STATE')"
                  @generate="handleGenerateSingle('CONTEXT_STATE')"
                />
              </div>
            </template>

            <template #agents="{ document }">
              <div v-if="document && document.content" class="document-wrapper">
                <Transition name="generation-overlay-fade">
                  <DocumentGenerationOverlay
                    v-if="isGeneratingDoc('AGENTS')"
                    :progress-lines="getGenerationPreviewLines('AGENTS')"
                  />
                </Transition>
                <MarkdownEditor
                  :content="document.content"
                  :document-id="document.id"
                  @save="handleDocumentSave"
                />
              </div>
              <div v-else class="empty-doc-placeholder">
                <DocumentEmptyState
                  description="AI 规则文档尚未生成"
                  button-label="立即生成规则文档"
                  :blocked-reason="getGenerateBlockedReason('AGENTS')"
                  :generating="isGeneratingDoc('AGENTS')"
                  :disabled="(documentStore.generating && !isGeneratingDoc('AGENTS')) || !canGenerateDoc('AGENTS')"
                  :progress-lines="getGenerationPreviewLines('AGENTS')"
                  @generate="handleGenerateSingle('AGENTS')"
                />
              </div>
            </template>
          </DocumentTabs>
        </el-card>
      </div>

      <!-- Sidebar Column -->
      <div class="sidebar-column">
        <!-- Tech Stack -->
        <TechStackPanel
          :tech-stack="documentStore.techStack"
          :editable="true"
          @update:tech-stack="handleTechStackUpdate"
        />

        <!-- Quick Actions -->
        <el-card class="actions-card">
          <template #header>
            <div class="sidebar-header">
              <el-icon><Cpu /></el-icon>
              <span>AI 辅助工具</span>
            </div>
          </template>
          <div class="action-list">
            <el-button
              v-for="type in ALL_DOC_TYPES"
              :key="type"
              class="action-item"
              :disabled="documentStore.generating || !canGenerateDoc(type)"
              :title="getGenerateBlockedReason(type) || ''"
              :loading="isGeneratingDoc(type)"
              @click="handleGenerateSingle(type)"
            >
              <el-icon><RefreshRight /></el-icon>
              重新生成 {{ getDocTypeLabel(type) }}
            </el-button>
          </div>
        </el-card>

        <!-- Help Info -->
        <el-card class="help-card">
          <div class="help-info">
            <el-icon><InfoFilled /></el-icon>
            <p>编辑器支持实时自动保存。生成的文档可以根据需要自行修改完善。全部 7 份文档生成后可导出 ZIP 包。</p>
          </div>
        </el-card>
      </div>
    </div>

    <!-- Global Error -->
    <Transition name="el-fade-in">
      <div v-if="documentStore.error" class="error-toast">
        <el-alert :title="documentStore.error" type="error" show-icon @close="documentStore.error = ''" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  Back,
  Loading,
  MagicStick,
  Cpu,
  RefreshRight,
  InfoFilled,
  Download
} from '@element-plus/icons-vue';
import { useDocumentStore } from '@/stores/document.store';
import { useProjectStore } from '@/stores/project.store';
import { updateProjectTechStackApi, fetchProjectDetailApi } from '@/api/project.api';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import DocumentGenerationOverlay from '@/components/DocumentGenerationOverlay.vue';
import DocumentTabs from '@/components/DocumentTabs.vue';
import DocumentEmptyState from '@/components/DocumentEmptyState.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import TechStackPanel from '@/components/TechStackPanel.vue';
import type { DocType } from '@/types/document';
import type { ProjectStatus } from '@/types/project';
import {
  DOC_GENERATION_ORDER,
  DOC_TYPE_LABELS,
  canGenerateDocument,
  getGenerationBlockedReason
} from '@/utils/document-generation';

const route = useRoute();
const router = useRouter();
const documentStore = useDocumentStore();
const projectStore = useProjectStore();

const projectId = computed(() => {
  const id = route.params.id;
  return parseInt(Array.isArray(id) ? id[0] : id);
});

const activeDocType = ref<DocType>('PRD');
const project = computed(() =>
  projectStore.projects.find(p => p.id === projectId.value)
);

const exporting = ref(false);

const ALL_DOC_TYPES: DocType[] = DOC_GENERATION_ORDER;

const allDocsGenerated = computed(() => {
  return ALL_DOC_TYPES.every(dt => {
    const doc = documentStore.getDocumentByType(dt);
    return doc && doc.content.length > 0;
  });
});

const currentGeneratingLabel = computed(() => {
  const docType = documentStore.generatingDocType;
  return docType ? getDocTypeLabel(docType) : '当前';
});

const generationPreviewContent: Record<DocType, string[]> = {
  PRD: [
    '正在梳理用户角色、核心场景与需求边界...',
    '正在拆分功能模块并补全验收标准...',
    '正在整理优先级、约束条件与交付节奏...',
    '正在优化章节层次与最终文档表达...'
  ],
  FRONTEND: [
    '正在规划页面结构、导航关系与状态流转...',
    '正在拆解组件层级与交互反馈细节...',
    '正在整理界面风格、响应式与异常态处理...',
    '正在汇总前端技术选型与实现建议...'
  ],
  BACKEND: [
    '正在拆分服务边界、数据模型与职责分层...',
    '正在梳理核心业务流程、权限控制与异常流...',
    '正在补全数据库关系、事务与接口约束...',
    '正在整合后端实现方案与交付结构...'
  ],
  API: [
    '正在整理接口分组、调用顺序与鉴权策略...',
    '正在补充请求参数、响应结构与错误码规范...',
    '正在对齐前后端字段命名与状态含义...',
    '正在完善接口示例与联调注意事项...'
  ],
  TASK: [
    '正在拆解里程碑、任务依赖与执行顺序...',
    '正在按角色分配开发项与验收责任...',
    '正在补充风险点、回归检查与交付节点...',
    '正在整理任务清单的可执行版本...'
  ],
  CONTEXT_STATE: [
    '正在整理当前阶段成果、状态与阻塞项...',
    '正在同步上下游依赖与待确认事项...',
    '正在补全阶段结论、后续动作与追踪点...',
    '正在汇总项目状态文档的持续更新内容...'
  ],
  AGENTS: [
    '正在提炼编码约束、输出规则与协作边界...',
    '正在整理生成顺序、修改原则与验证要求...',
    '正在补全 AI 使用规范与禁止项说明...',
    '正在收敛规则文档的最终结构...'
  ]
};

onMounted(async () => {
  if (projectStore.projects.length === 0) {
    await projectStore.fetchProjects();
  }
  if (projectId.value) {
    const success = await documentStore.fetchDocuments(projectId.value);
    if (!success) {
      ElMessage.error(documentStore.error || '获取文档失败');
    }
  }
});

async function handleDocumentSave(docId: number, content: string): Promise<void> {
  const success = await documentStore.updateDocument(docId, content);
  if (!success) {
    ElMessage.error('保存失败');
  }
}

function getDocTypeLabel(type: DocType): string {
  return DOC_TYPE_LABELS[type];
}

function getGenerateBlockedReason(docType: DocType): string | null {
  return getGenerationBlockedReason(docType, documentStore.documents);
}

function canGenerateDoc(docType: DocType): boolean {
  return canGenerateDocument(docType, documentStore.documents);
}

function isGeneratingDoc(docType: DocType): boolean {
  return documentStore.isGeneratingDocument(docType);
}

function getGenerationPreviewLines(docType: DocType): string[] {
  if (isGeneratingDoc(docType) && documentStore.generationPreviewLines.length > 0) {
    return documentStore.generationPreviewLines;
  }

  return generationPreviewContent[docType];
}

async function handleGenerateSingle(docType: DocType): Promise<void> {
  const blockedReason = getGenerateBlockedReason(docType);
  if (blockedReason) {
    documentStore.error = blockedReason;
    ElMessage.warning(blockedReason);
    return;
  }

  const existingDoc = documentStore.getDocumentByType(docType);
  if (existingDoc && existingDoc.content.length > 0) {
    try {
      await ElMessageBox.confirm(
        '文档已有内容，重新生成将覆盖现有内容。是否继续？',
        '重新生成',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      );
    } catch {
      return;
    }
  }

  activeDocType.value = docType;
  await nextTick();

  const success = await documentStore.generateDocument(projectId.value, docType);
  if (success) {
    ElMessage.success(`${getDocTypeLabel(docType)}文档生成成功`);
  } else {
    ElMessage.error(documentStore.error || '生成失败');
  }
}

async function handleGenerateAll(): Promise<void> {
  const hasContent = ALL_DOC_TYPES.some(dt => {
    const doc = documentStore.getDocumentByType(dt);
    return doc && doc.content.length > 0;
  });

  if (hasContent) {
    try {
      await ElMessageBox.confirm(
        '部分文档已有内容，重新生成将覆盖现有内容。是否继续？',
        '批量生成',
        { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
      );
    } catch {
      return;
    }
  }

  for (const docType of ALL_DOC_TYPES) {
    activeDocType.value = docType;
    await nextTick();
    const success = await documentStore.generateDocument(projectId.value, docType);
    if (!success) {
      ElMessage.error(documentStore.error || `${getDocTypeLabel(docType)}文档生成失败`);
      return;
    }
  }
  ElMessage.success('全部 7 份文档生成成功');
}

async function handleExportDocuments(): Promise<void> {
  const docs = documentStore.documents.filter(d => d.content && d.content.length > 0);
  if (docs.length === 0) {
    ElMessage.warning('暂无可导出的文档内容');
    return;
  }

  exporting.value = true;
  try {
    const detail = await fetchProjectDetailApi(projectId.value);
    const projectName = detail.project.topic.title;

    const dateStr = new Date().toISOString().split('T')[0];
    const safeName = projectName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    const fileName = `${safeName}_${dateStr}.zip`;

    const zip = new JSZip();

    const filenameMap: Record<DocType, string> = {
      PRD: 'PRD.md',
      FRONTEND: 'Frontend.md',
      BACKEND: 'Backend.md',
      API: 'API.md',
      TASK: 'task.md',
      CONTEXT_STATE: 'context_state.md',
      AGENTS: 'AGENTS.md'
    };

    docs.forEach(doc => {
      const filename = filenameMap[doc.docType];
      if (filename && doc.content) {
        zip.file(filename, doc.content);
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, fileName);

    ElMessage.success('文档导出成功');
  } catch (error) {
    console.error('Export error:', error);
    ElMessage.error('导出失败，请重试');
  } finally {
    exporting.value = false;
  }
}

async function handleTechStackUpdate(techStack: string): Promise<void> {
  try {
    await updateProjectTechStackApi(projectId.value, techStack);
    documentStore.techStack = techStack.split(',').map(t => t.trim());
    ElMessage.success('技术栈更新成功');
  } catch (e) {
    ElMessage.error('更新失败');
  }
}

function getStatusText(status: ProjectStatus | undefined): string {
  if (!status) return '';
  const map: Record<string, string> = { 'NOT_STARTED': '未开始', 'IN_PROGRESS': '进行中', 'COMPLETED': '已完成' };
  return map[status] || '';
}

function getStatusTagType(status: ProjectStatus | undefined): 'info' | 'warning' | 'success' {
  if (!status) return 'info';
  const map: Record<string, any> = { 'NOT_STARTED': 'info', 'IN_PROGRESS': 'warning', 'COMPLETED': 'success' };
  return map[status] || 'info';
}
</script>

<style scoped>
.project-detail-container {
  min-height: 100vh;
  background-color: #f1f5f9;
}

/* Header Styles */
.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  border-color: #e2e8f0;
}

.project-title-area {
  display: flex;
  flex-direction: column;
}

.project-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.project-meta {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4f46e5;
  font-size: 14px;
  font-weight: 600;
}

.generate-all-btn {
  background: linear-gradient(to right, #4f46e5, #7c3aed) !important;
  border: none !important;
  border-radius: 10px;
}

.export-btn {
  border-radius: 10px;
  border-color: #d1d5db;
  color: #374151;
}

.export-btn:hover {
  border-color: #9ca3af;
  color: #1f2937;
  background-color: #f9fafb;
}

/* Layout */
.detail-layout {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.editor-container-card {
  height: calc(100vh - 136px);
  display: flex;
  flex-direction: column;
}

.document-wrapper {
  height: calc(100vh - 200px);
  position: relative;
}

.empty-doc-placeholder {
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.generation-overlay-fade-enter-active,
.generation-overlay-fade-leave-active {
  transition: opacity 0.24s ease, transform 0.24s ease;
}

.generation-overlay-fade-enter-from,
.generation-overlay-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Sidebar Columns */
.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #334155;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 380px;
  overflow-y: auto;
}

.action-item {
  width: 100%;
  margin-left: 0 !important;
  justify-content: flex-start;
  height: 40px;
  border-radius: 10px;
  padding-left: 16px;
  font-size: 13px;
}

.help-card {
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
}

.help-info {
  display: flex;
  gap: 10px;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.help-info .el-icon {
  margin-top: 2px;
  flex-shrink: 0;
}

.error-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  width: 320px;
}
</style>
