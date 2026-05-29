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
            v-if="docSetMode === 'standard' && !isViewer"
            type="primary"
            class="generate-all-btn"
            :loading="documentStore.generating"
            @click="handleGenerateAll"
          >
            <el-icon><MagicStick /></el-icon>一键生成全部
          </el-button>
          <el-button
            v-if="docSetMode === 'standard'"
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
      <el-alert v-if="isViewer" type="info" :closable="false" style="margin-bottom: 12px">
        测试账号只读模式 — 仅可查看文档，无法生成、编辑或保存
      </el-alert>
      <!-- Main Column -->
      <div class="main-column" style="position: relative;">
        <!-- Review Streaming Overlay -->
        <TerminalGenerationOverlay
          :visible="documentStore.reviewStatus === 'reviewing'"
          title="Expert Panel Review — 智能文档审核系统"
          :content="documentStore.reviewLog"
          status="generating"
          :stats="{ tokenCount: 0, tokensPerSecond: 0, elapsedSeconds: 0 }"
          mode="review"
          @close="handleReviewOverlayClose"
        />

        <!-- Document Tabs & Editor -->
        <el-card class="editor-container-card" :body-style="{ padding: '0' }">
          <div class="editor-tabs-wrapper">
            <!-- Standard Development Document Tabs -->
            <DocumentTabs
              v-if="docSetMode === 'standard'"
              :documents="documentStore.documents"
              :active-doc-type="activeDocType"
              :generating="documentStore.generating"
              @update:active-doc-type="activeDocType = $event"
            >
              <template #prd="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingDoc('PRD')"
                    title="正在生成 PRD 文档"
                    :content="documentStore.generationContent"
                    :status="documentStore.generating && isGeneratingDoc('PRD') ? 'generating' : 'idle'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentModeToggle v-model:mode="docModes.PRD" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="docModes.PRD === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingDoc('PRD')"
                    :visible="true"
                    title="正在生成 PRD 文档"
                    :content="documentStore.generationContent"
                    :status="'generating'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingDoc('PRD')"
                    description="PRD文档尚未生成"
                    button-label="立即生成 PRD"
                    :disabled="isViewer || documentStore.generating"
                    @generate="handleGenerateSingle('PRD')"
                  />
                </div>
              </template>

              <template #frontend="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingDoc('FRONTEND')"
                    title="正在生成前端文档"
                    :content="documentStore.generationContent"
                    :status="documentStore.generating && isGeneratingDoc('FRONTEND') ? 'generating' : 'idle'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentModeToggle v-model:mode="docModes.FRONTEND" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="docModes.FRONTEND === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingDoc('FRONTEND')"
                    :visible="true"
                    title="正在生成前端文档"
                    :content="documentStore.generationContent"
                    :status="'generating'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingDoc('FRONTEND')"
                    description="前端文档尚未生成"
                    button-label="立即生成前端文档"
                    :blocked-reason="getGenerateBlockedReason('FRONTEND')"
                    :disabled="isViewer || !canGenerateDoc('FRONTEND')"
                    @generate="handleGenerateSingle('FRONTEND')"
                  />
                </div>
              </template>

              <template #backend="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingDoc('BACKEND')"
                    title="正在生成后端文档"
                    :content="documentStore.generationContent"
                    :status="documentStore.generating && isGeneratingDoc('BACKEND') ? 'generating' : 'idle'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentModeToggle v-model:mode="docModes.BACKEND" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="docModes.BACKEND === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingDoc('BACKEND')"
                    :visible="true"
                    title="正在生成后端文档"
                    :content="documentStore.generationContent"
                    :status="'generating'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingDoc('BACKEND')"
                    description="后端文档尚未生成"
                    button-label="立即生成后端文档"
                    :blocked-reason="getGenerateBlockedReason('BACKEND')"
                    :disabled="isViewer || !canGenerateDoc('BACKEND')"
                    @generate="handleGenerateSingle('BACKEND')"
                  />
                </div>
              </template>

              <template #api="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingDoc('API')"
                    title="正在生成 API 文档"
                    :content="documentStore.generationContent"
                    :status="documentStore.generating && isGeneratingDoc('API') ? 'generating' : 'idle'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentModeToggle v-model:mode="docModes.API" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="docModes.API === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingDoc('API')"
                    :visible="true"
                    title="正在生成 API 文档"
                    :content="documentStore.generationContent"
                    :status="'generating'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingDoc('API')"
                    description="API 文档尚未生成"
                    button-label="立即生成 API 文档"
                    :blocked-reason="getGenerateBlockedReason('API')"
                    :disabled="isViewer || !canGenerateDoc('API')"
                    @generate="handleGenerateSingle('API')"
                  />
                </div>
              </template>

              <template #task="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingDoc('TASK')"
                    title="正在生成任务清单"
                    :content="documentStore.generationContent"
                    :status="documentStore.generating && isGeneratingDoc('TASK') ? 'generating' : 'idle'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentModeToggle v-model:mode="docModes.TASK" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="docModes.TASK === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingDoc('TASK')"
                    :visible="true"
                    title="正在生成任务清单"
                    :content="documentStore.generationContent"
                    :status="'generating'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingDoc('TASK')"
                    description="任务清单尚未生成"
                    button-label="立即生成任务清单"
                    :blocked-reason="getGenerateBlockedReason('TASK')"
                    :disabled="isViewer || !canGenerateDoc('TASK')"
                    @generate="handleGenerateSingle('TASK')"
                  />
                </div>
              </template>

              <template #contextState="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingDoc('CONTEXT_STATE')"
                    title="正在生成状态追踪文档"
                    :content="documentStore.generationContent"
                    :status="documentStore.generating && isGeneratingDoc('CONTEXT_STATE') ? 'generating' : 'idle'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentModeToggle v-model:mode="docModes.CONTEXT_STATE" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="docModes.CONTEXT_STATE === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingDoc('CONTEXT_STATE')"
                    :visible="true"
                    title="正在生成状态追踪文档"
                    :content="documentStore.generationContent"
                    :status="'generating'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingDoc('CONTEXT_STATE')"
                    description="状态追踪文档尚未生成"
                    button-label="立即生成状态文档"
                    :blocked-reason="getGenerateBlockedReason('CONTEXT_STATE')"
                    :disabled="isViewer || !canGenerateDoc('CONTEXT_STATE')"
                    @generate="handleGenerateSingle('CONTEXT_STATE')"
                  />
                </div>
              </template>

              <template #agents="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingDoc('AGENTS')"
                    title="正在生成 AI 规则文档"
                    :content="documentStore.generationContent"
                    :status="documentStore.generating && isGeneratingDoc('AGENTS') ? 'generating' : 'idle'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentModeToggle v-model:mode="docModes.AGENTS" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="docModes.AGENTS === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingDoc('AGENTS')"
                    :visible="true"
                    title="正在生成 AI 规则文档"
                    :content="documentStore.generationContent"
                    :status="'generating'"
                    :stats="documentStore.generationStats"
                    @close="handleStandardGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingDoc('AGENTS')"
                    description="AI 规则文档尚未生成"
                    button-label="立即生成规则文档"
                    :blocked-reason="getGenerateBlockedReason('AGENTS')"
                    :disabled="isViewer || !canGenerateDoc('AGENTS')"
                    @generate="handleGenerateSingle('AGENTS')"
                  />
                </div>
              </template>
            </DocumentTabs>

            <!-- Graduation Design Document Tabs -->
            <GraduationDocumentTabs
              v-else
              :documents="graduationStore.documents"
              :active-doc-type="activeGraduationDocType"
              :generating="graduationStore.generating"
              @update:active-doc-type="activeGraduationDocType = $event"
            >
              <template #taskBook="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingGradDoc('TASK_BOOK')"
                    title="正在生成任务书"
                    :content="graduationStore.generationContent"
                    :status="graduationStore.generating && isGeneratingGradDoc('TASK_BOOK') ? 'generating' : 'idle'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <el-button
                    class="grad-doc-download-btn"
                    :disabled="isViewer || graduationStore.generating"
                    @click="handleDownloadGraduationDocument('TASK_BOOK')"
                  >
                    <el-icon><Download /></el-icon>
                    下载
                  </el-button>
                  <DocumentModeToggle v-model:mode="gradDocModes.TASK_BOOK" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="gradDocModes.TASK_BOOK === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleGraduationDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingGradDoc('TASK_BOOK')"
                    :visible="true"
                    title="正在生成任务书"
                    :content="graduationStore.generationContent"
                    :status="'generating'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingGradDoc('TASK_BOOK')"
                    description="任务书尚未生成"
                    button-label="立即生成任务书"
                    :disabled="isViewer || graduationStore.generating"
                    @generate="handleGenerateGraduationSingle('TASK_BOOK')"
                  />
                </div>
              </template>
              <template #proposal="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingGradDoc('PROPOSAL')"
                    title="正在生成开题报告"
                    :content="graduationStore.generationContent"
                    :status="graduationStore.generating && isGeneratingGradDoc('PROPOSAL') ? 'generating' : 'idle'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <el-button
                    class="grad-doc-download-btn"
                    :disabled="isViewer || graduationStore.generating"
                    @click="handleDownloadGraduationDocument('PROPOSAL')"
                  >
                    <el-icon><Download /></el-icon>
                    下载
                  </el-button>
                  <DocumentModeToggle v-model:mode="gradDocModes.PROPOSAL" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="gradDocModes.PROPOSAL === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleGraduationDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingGradDoc('PROPOSAL')"
                    :visible="true"
                    title="正在生成开题报告"
                    :content="graduationStore.generationContent"
                    :status="'generating'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingGradDoc('PROPOSAL')"
                    description="开题报告尚未生成"
                    button-label="立即生成开题报告"
                    :disabled="isViewer || graduationStore.generating"
                    @generate="handleGenerateGraduationSingle('PROPOSAL')"
                  />
                </div>
              </template>
              <template #preparation="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingGradDoc('PREPARATION')"
                    title="正在生成前期准备"
                    :content="graduationStore.generationContent"
                    :status="graduationStore.generating && isGeneratingGradDoc('PREPARATION') ? 'generating' : 'idle'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <el-button
                    class="grad-doc-download-btn"
                    :disabled="isViewer || graduationStore.generating"
                    @click="handleDownloadGraduationDocument('PREPARATION')"
                  >
                    <el-icon><Download /></el-icon>
                    下载
                  </el-button>
                  <DocumentModeToggle v-model:mode="gradDocModes.PREPARATION" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="gradDocModes.PREPARATION === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleGraduationDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingGradDoc('PREPARATION')"
                    :visible="true"
                    title="正在生成前期准备"
                    :content="graduationStore.generationContent"
                    :status="'generating'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingGradDoc('PREPARATION')"
                    description="前期准备尚未生成"
                    button-label="立即生成前期准备"
                    :disabled="isViewer || graduationStore.generating"
                    @generate="handleGenerateGraduationSingle('PREPARATION')"
                  />
                </div>
              </template>
              <template #drafting="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingGradDoc('DRAFTING')"
                    title="正在生成撰写阶段"
                    :content="graduationStore.generationContent"
                    :status="graduationStore.generating && isGeneratingGradDoc('DRAFTING') ? 'generating' : 'idle'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <el-button
                    class="grad-doc-download-btn"
                    :disabled="isViewer || graduationStore.generating"
                    @click="handleDownloadGraduationDocument('DRAFTING')"
                  >
                    <el-icon><Download /></el-icon>
                    下载
                  </el-button>
                  <DocumentModeToggle v-model:mode="gradDocModes.DRAFTING" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="gradDocModes.DRAFTING === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleGraduationDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingGradDoc('DRAFTING')"
                    :visible="true"
                    title="正在生成撰写阶段"
                    :content="graduationStore.generationContent"
                    :status="'generating'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingGradDoc('DRAFTING')"
                    description="撰写阶段尚未生成"
                    button-label="立即生成撰写阶段"
                    :disabled="isViewer || graduationStore.generating"
                    @generate="handleGenerateGraduationSingle('DRAFTING')"
                  />
                </div>
              </template>
              <template #midtermCheck="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingGradDoc('MIDTERM_CHECK')"
                    title="正在生成中期检查"
                    :content="graduationStore.generationContent"
                    :status="graduationStore.generating && isGeneratingGradDoc('MIDTERM_CHECK') ? 'generating' : 'idle'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <el-button
                    class="grad-doc-download-btn"
                    :disabled="isViewer || graduationStore.generating"
                    @click="handleDownloadGraduationDocument('MIDTERM_CHECK')"
                  >
                    <el-icon><Download /></el-icon>
                    下载
                  </el-button>
                  <DocumentModeToggle v-model:mode="gradDocModes.MIDTERM_CHECK" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="gradDocModes.MIDTERM_CHECK === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleGraduationDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingGradDoc('MIDTERM_CHECK')"
                    :visible="true"
                    title="正在生成中期检查"
                    :content="graduationStore.generationContent"
                    :status="'generating'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingGradDoc('MIDTERM_CHECK')"
                    description="中期检查尚未生成"
                    button-label="立即生成中期检查"
                    :disabled="isViewer || graduationStore.generating"
                    @generate="handleGenerateGraduationSingle('MIDTERM_CHECK')"
                  />
                </div>
              </template>
              <template #refinement="{ document }">
                <div v-if="document && document.content" class="document-wrapper">
                  <TerminalGenerationOverlay
                    :visible="isGeneratingGradDoc('REFINEMENT')"
                    title="正在生成完善"
                    :content="graduationStore.generationContent"
                    :status="graduationStore.generating && isGeneratingGradDoc('REFINEMENT') ? 'generating' : 'idle'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <el-button
                    class="grad-doc-download-btn"
                    :disabled="isViewer || graduationStore.generating"
                    @click="handleDownloadGraduationDocument('REFINEMENT')"
                  >
                    <el-icon><Download /></el-icon>
                    下载
                  </el-button>
                  <DocumentModeToggle v-model:mode="gradDocModes.REFINEMENT" class="mode-toggle" />
                  <MarkdownEditor
                    v-if="gradDocModes.REFINEMENT === 'edit'"
                    :content="document.content"
                    :document-id="document.id"
                    @save="handleGraduationDocumentSave"
                  />
                  <MarkdownPreview
                    v-else
                    :content="document.content"
                  />
                </div>
                <div v-else class="empty-doc-placeholder">
                  <TerminalGenerationOverlay
                    v-if="isGeneratingGradDoc('REFINEMENT')"
                    :visible="true"
                    title="正在生成完善"
                    :content="graduationStore.generationContent"
                    :status="'generating'"
                    :stats="graduationStore.generationStats"
                    @close="handleGraduationGenerationOverlayClose"
                  />
                  <DocumentEmptyState
                    v-if="!isGeneratingGradDoc('REFINEMENT')"
                    description="完善尚未生成"
                    button-label="立即生成完善"
                    :disabled="isViewer || graduationStore.generating"
                    @generate="handleGenerateGraduationSingle('REFINEMENT')"
                  />
                </div>
              </template>
            </GraduationDocumentTabs>

            <!-- Doc Set Toggle Button -->
            <div class="doc-set-toggle-wrapper">
              <el-button
                class="doc-set-toggle-btn"
                :type="docSetMode === 'graduation' ? 'primary' : 'default'"
                @click="toggleDocSet"
                plain
              >
                <el-icon><Files v-if="docSetMode === 'graduation'" /><Notebook v-else /></el-icon>
                {{ docSetMode === 'standard' ? '毕设文档' : '开发文档' }}
              </el-button>
            </div>
          </div>
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

        <RepoUrlPanel
          :repo-url="repoUrl"
          :repo-sync-data="repoSyncData"
          :syncing="repoSyncing"
          @update:repo-url="handleRepoUrlUpdate"
          @sync="handleRepoSync"
        />

        <DeployUrlPanel
          :deploy-url="deployUrl"
          @update:deploy-url="handleDeployUrlUpdate"
        />

        <!-- Quick Actions -->
        <el-card class="actions-card" v-if="docSetMode === 'standard'">
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
              :disabled="isViewer || documentStore.generating || !canGenerateDoc(type)"
              :title="getGenerateBlockedReason(type) || ''"
              :loading="isGeneratingDoc(type)"
              @click="handleGenerateSingle(type)"
            >
              <el-icon><RefreshRight /></el-icon>
              重新生成 {{ getDocTypeLabel(type) }}
            </el-button>
          </div>
        </el-card>

        <el-card class="actions-card" v-else>
          <template #header>
            <div class="sidebar-header">
              <el-icon><Cpu /></el-icon>
              <span>AI 辅助工具</span>
            </div>
          </template>
          <div class="action-list">
            <el-button
              v-for="type in ALL_GRAD_DOC_TYPES"
              :key="type"
              class="action-item"
              :disabled="isViewer || graduationStore.generating"
              :loading="isGeneratingGradDoc(type)"
              @click="handleGenerateGraduationSingle(type)"
            >
              <el-icon><RefreshRight /></el-icon>
              重新生成 {{ getGradDocLabel(type) }}
            </el-button>
          </div>
        </el-card>

        <!-- Expert Review Panel -->
        <ExpertReviewPanel
          v-if="docSetMode === 'standard' && documentStore.allDocsGenerated"
          :project-id="projectId"
          @fixed="handleReviewFixed"
        />

        <!-- Help Info -->
        <el-card class="help-card">
          <div class="help-info">
            <el-icon><InfoFilled /></el-icon>
            <p v-if="docSetMode === 'standard'">编辑器支持实时自动保存。生成的文档可以根据需要自行修改完善。全部 7 份文档生成后可导出 ZIP 包。</p>
            <p v-else>毕设文档是毕业设计全过程管理工具，涵盖任务书、开题报告、前期准备、撰写阶段、中期检查和完善等文档的生成与管理。</p>
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { buildGraduationDownloadHtml } from '../utils/graduation-download';
import {
  Back,
  Loading,
  MagicStick,
  Cpu,
  RefreshRight,
  InfoFilled,
  Download,
  Notebook,
  Files
} from '@element-plus/icons-vue';
import { useDocumentStore } from '@/stores/document.store';
import { useGraduationDocumentStore } from '@/stores/graduation.store';
import { useProjectStore } from '@/stores/project.store';
import { useAuthStore } from '@/stores/auth.store';
import { updateProjectTechStackApi, fetchProjectDetailApi, updateProjectRepoUrlApi, syncRepoApi, updateProjectDeployUrlApi } from '@/api/project.api';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import TerminalGenerationOverlay from '@/components/TerminalGenerationOverlay.vue';
import DocumentTabs from '@/components/DocumentTabs.vue';
import GraduationDocumentTabs from '@/components/GraduationDocumentTabs.vue';
import DocumentEmptyState from '@/components/DocumentEmptyState.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import MarkdownPreview from '@/components/MarkdownPreview.vue';
import DocumentModeToggle from '@/components/DocumentModeToggle.vue';
import TechStackPanel from '@/components/TechStackPanel.vue';
import ExpertReviewPanel from '@/components/ExpertReviewPanel.vue';
import RepoUrlPanel from '@/components/RepoUrlPanel.vue';
import DeployUrlPanel from '@/components/DeployUrlPanel.vue';
import type { DocType } from '@/types/document';
import type { GraduationDocType } from '@/types/graduation-document';
import type { ProjectStatus, RepoSyncData } from '@/types/project';
import {
  DOC_GENERATION_ORDER,
  DOC_TYPE_LABELS,
  canGenerateDocument,
  getGenerationBlockedReason
} from '@/utils/document-generation';
import {
  GRAD_DOC_GENERATION_ORDER,
  GRAD_DOC_TYPE_LABELS
} from '@/utils/graduation-document-generation';
const route = useRoute();
const router = useRouter();
const documentStore = useDocumentStore();
const graduationStore = useGraduationDocumentStore();
const projectStore = useProjectStore();
const authStore = useAuthStore();
const isViewer = computed(() => authStore.isViewer);

const projectId = computed(() => {
  const id = route.params.id;
  return parseInt(Array.isArray(id) ? id[0] : id);
});

const activeDocType = ref<DocType>('PRD');
const docModes = ref<Record<DocType, 'read' | 'edit'>>({
  PRD: isViewer.value ? 'read' : 'edit',
  FRONTEND: isViewer.value ? 'read' : 'edit',
  BACKEND: isViewer.value ? 'read' : 'edit',
  API: isViewer.value ? 'read' : 'edit',
  TASK: isViewer.value ? 'read' : 'edit',
  CONTEXT_STATE: isViewer.value ? 'read' : 'edit',
  AGENTS: isViewer.value ? 'read' : 'edit',
});
const gradDocModes = ref<Record<GraduationDocType, 'read' | 'edit'>>({
  TASK_BOOK: isViewer.value ? 'read' : 'edit',
  PROPOSAL: isViewer.value ? 'read' : 'edit',
  PREPARATION: isViewer.value ? 'read' : 'edit',
  DRAFTING: isViewer.value ? 'read' : 'edit',
  MIDTERM_CHECK: isViewer.value ? 'read' : 'edit',
  REFINEMENT: isViewer.value ? 'read' : 'edit',
});

// Graduation document set mode
const docSetMode = ref<'standard' | 'graduation'>('standard');
const activeGraduationDocType = ref<GraduationDocType>('TASK_BOOK');

function toggleDocSet(): void {
  if (docSetMode.value === 'standard') {
    docSetMode.value = 'graduation';
    activeGraduationDocType.value = 'TASK_BOOK';
  } else {
    docSetMode.value = 'standard';
    activeDocType.value = 'PRD';
  }
}
const project = computed(() =>
  projectStore.projects.find(p => p.id === projectId.value)
);

const exporting = ref(false);

const ALL_DOC_TYPES: DocType[] = DOC_GENERATION_ORDER;
const ALL_GRAD_DOC_TYPES: GraduationDocType[] = GRAD_DOC_GENERATION_ORDER;

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

onMounted(async () => {
  if (projectStore.projects.length === 0) {
    await projectStore.fetchProjects();
  }
  if (projectId.value) {
    const documentsPromise = documentStore.fetchDocuments(projectId.value);
    const gradDocsPromise = graduationStore.fetchDocuments(projectId.value);
    const detailPromise = fetchProjectDetailApi(projectId.value)
      .then(detail => {
        documentStore.hydrateReviewState(
          detail.project.reviewStatus,
          detail.project.reviewResult
        );
        repoUrl.value = detail.project.repoUrl ?? null;
        repoSyncData.value = detail.project.repoSyncData ?? null;
        deployUrl.value = detail.project.deployUrl ?? null;
        return true;
      })
      .catch(() => false);

    const [documentsSuccess, gradSuccess, detailSuccess] = await Promise.all([
      documentsPromise,
      gradDocsPromise,
      detailPromise
    ]);

    if (!documentsSuccess) {
      ElMessage.error(documentStore.error || '获取文档失败');
    }
    if (!gradSuccess) {
      ElMessage.error(graduationStore.error || '获取毕设文档失败');
    }
    if (!detailSuccess) {
      ElMessage.warning('项目审核状态恢复失败，已使用当前页面默认状态');
    }
  }
});

onBeforeRouteLeave(() => {
  documentStore.abortGeneration();
  documentStore.abortReview();
  documentStore.clearGenerationDisplay();
  graduationStore.abortGeneration();
  graduationStore.clearGenerationDisplay();
});

onUnmounted(() => {
  documentStore.abortGeneration();
  documentStore.abortReview();
  documentStore.clearGenerationDisplay();
  graduationStore.abortGeneration();
  graduationStore.clearGenerationDisplay();
});

async function handleDocumentSave(docId: number, content: string): Promise<void> {
  const success = await documentStore.updateDocument(docId, content);
  if (!success) {
    ElMessage.error('保存失败');
  }
}

async function handleGraduationDocumentSave(docId: number, content: string): Promise<void> {
  const success = await graduationStore.updateDocument(docId, content);
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

function handleStandardGenerationOverlayClose(): void {
  documentStore.abortGeneration();
  documentStore.clearGenerationDisplay();
  ElMessage.info('已停止生成');
}

function handleGraduationGenerationOverlayClose(): void {
  graduationStore.abortGeneration();
  graduationStore.clearGenerationDisplay();
  ElMessage.info('已停止生成');
}

function handleReviewOverlayClose(): void {
  documentStore.abortReview();
  ElMessage.info('已停止审核');
}

async function handleGenerateSingle(docType: DocType): Promise<void> {
  const blockedReason = getGenerateBlockedReason(docType);
  if (blockedReason) {
    documentStore.error = blockedReason;
    ElMessage.warning(blockedReason);
    return;
  }

  const existingDoc = documentStore.getDocumentByType(docType);
  const forceRegenerate = Boolean(existingDoc?.content.trim());
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

  const success = await documentStore.generateDocument(projectId.value, docType, {
    forceRegenerate
  });
  if (success) {
    ElMessage.success(`${getDocTypeLabel(docType)}文档生成成功`);
  } else if (documentStore.error) {
    ElMessage.error(documentStore.error);
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
    const forceRegenerate = Boolean(documentStore.getDocumentByType(docType)?.content.trim());
    activeDocType.value = docType;
    await nextTick();
    const success = await documentStore.generateDocument(projectId.value, docType, {
      forceRegenerate
    });
    if (!success) {
      if (documentStore.error) {
        ElMessage.error(documentStore.error || `${getDocTypeLabel(docType)}文档生成失败`);
      }
      return;
    }
  }
  ElMessage.success('全部 7 份文档生成成功');
}

function handleReviewFixed(fixedDocTypes: DocType[]): void {
  if (fixedDocTypes.length > 0) {
    activeDocType.value = fixedDocTypes[0];
  }
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

async function handleDownloadGraduationDocument(docType: GraduationDocType): Promise<void> {
  const document = graduationStore.getDocumentByType(docType);
  if (!document?.content?.trim()) {
    ElMessage.warning('当前文档暂无可下载内容');
    return;
  }

  try {
    const detail = await fetchProjectDetailApi(projectId.value);
    const projectName = detail.project.topic.title;
    const safeProjectName = projectName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    const safeDocName = getGradDocLabel(docType).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    const content = buildGraduationDownloadHtml(projectName, getGradDocLabel(docType), document.content);
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${safeProjectName}_${safeDocName}.html`);
    ElMessage.success(`${getGradDocLabel(docType)}下载成功`);
  } catch (error) {
    console.error('Graduation document download error:', error);
    ElMessage.error('下载失败，请重试');
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

const repoUrl = ref<string | null>(null);
const repoSyncData = ref<RepoSyncData | null>(null);
const repoSyncing = ref(false);
const deployUrl = ref<string | null>(null);

async function handleRepoUrlUpdate(url: string | null): Promise<void> {
  try {
    await updateProjectRepoUrlApi(projectId.value, url);
    repoUrl.value = url;
    if (!url) {
      repoSyncData.value = null;
    }
    ElMessage.success(url ? '仓库地址已更新' : '仓库地址已清除');
  } catch (e: any) {
    ElMessage.error(e.message || '更新仓库地址失败');
  }
}

async function handleDeployUrlUpdate(url: string | null): Promise<void> {
  try {
    await updateProjectDeployUrlApi(projectId.value, url);
    deployUrl.value = url;
    ElMessage.success(url ? '访问地址已更新' : '访问地址已清除');
  } catch (e: any) {
    ElMessage.error(e.message || '更新访问地址失败');
  }
}

async function handleRepoSync(): Promise<void> {
  repoSyncing.value = true;
  try {
    const { syncData } = await syncRepoApi(projectId.value);
    repoSyncData.value = syncData;
    ElMessage.success('同步成功');
  } catch (e: any) {
    ElMessage.error(e.message || '同步失败');
  } finally {
    repoSyncing.value = false;
  }
}

function getGradDocLabel(type: GraduationDocType): string {
  return GRAD_DOC_TYPE_LABELS[type];
}

function isGeneratingGradDoc(docType: GraduationDocType): boolean {
  return graduationStore.isGeneratingDocument(docType);
}

async function handleGenerateGraduationSingle(docType: GraduationDocType): Promise<void> {
  const existingDoc = graduationStore.getDocumentByType(docType);
  const forceRegenerate = Boolean(existingDoc?.content.trim());

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

  activeGraduationDocType.value = docType;
  await nextTick();

  const success = await graduationStore.generateDocument(projectId.value, docType, {
    forceRegenerate
  });
  if (success) {
    ElMessage.success(`${getGradDocLabel(docType)}生成成功`);
  } else if (graduationStore.error) {
    ElMessage.error(graduationStore.error);
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

/* Tabs wrapper with toggle button */
.editor-tabs-wrapper {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.doc-set-toggle-wrapper {
  position: absolute;
  right: 8px;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 8px;
  background: linear-gradient(to right, transparent 0%, #f8fafc 40%, #f8fafc 100%);
}

.doc-set-toggle-btn {
  height: 36px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.25s ease;
  border: 1px solid #e2e8f0;
}

.doc-set-toggle-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
  background-color: #eef2ff;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.doc-set-toggle-btn .el-icon {
  margin-right: 4px;
}

.document-wrapper {
  height: calc(100vh - 200px);
  position: relative;
}

.mode-toggle {
  position: absolute;
  top: 8px;
  right: 12px;
  z-index: 10;
}

.grad-doc-download-btn {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 10;
  height: 36px;
  min-width: 88px;
  border-radius: 10px;
  border-color: #d1d5db;
  background-color: rgba(255, 255, 255, 0.94);
  color: #374151;
  font-weight: 600;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(8px);
}

.grad-doc-download-btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
  background-color: #eef2ff;
}

.empty-doc-placeholder {
  height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  position: relative;
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
