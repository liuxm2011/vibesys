<template>
  <div class="graduation-dashboard">
    <el-header class="dashboard-header" height="72px">
      <div class="header-content">
        <div class="header-left">
          <div class="logo-box">
            <div class="logo-mini">VB</div>
            <div class="logo-text">
              <h1 class="platform-name">VibeCoding</h1>
              <span class="platform-tag">毕业设计</span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <template v-if="linkedProjectId && docSetMode === 'standard'">
            <div class="ai-status" v-if="documentStore.generating">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span>{{ currentGeneratingLabel }}文档正在生成中...</span>
            </div>
            <el-button
              v-if="!isViewer"
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
          </template>
          <el-button v-if="!isViewer" plain @click="switchMode">
            <el-icon><Refresh /></el-icon>切换模式
          </el-button>
          <el-button v-if="!isViewer" type="success" @click="router.push('/graduation/topics')">
            <el-icon><Collection /></el-icon>选题管理
          </el-button>
          <el-divider direction="vertical" />
          <el-dropdown trigger="click">
            <div class="user-info-trigger">
              <el-avatar :size="36">{{ user?.name?.charAt(0) }}</el-avatar>
              <div class="user-meta">
                <span class="user-name">{{ user?.name }}</span>
                <span class="user-role">{{ isViewer ? '测试账号' : '学生用户' }}</span>
              </div>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-if="!isViewer" @click="passwordDialogVisible = true">
                  <el-icon><Key /></el-icon>修改密码
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-header>

    <main class="dashboard-main" :class="{ 'dashboard-main--wide': !!linkedProjectId }">
      <div v-if="loading || initializingDocs" class="loading-state" v-loading="true" style="min-height: 400px" />

      <div v-else-if="!thesisProject" class="empty-state">
        <el-empty description="您还未选择毕业设计题目" :image-size="120">
          <el-button type="success" size="large" @click="router.push('/graduation/topics')">
            <el-icon><Plus /></el-icon>去选择题目
          </el-button>
        </el-empty>
      </div>

      <template v-else-if="thesisProject && linkedProjectId">
        <!-- Compact info bar -->
        <div class="thesis-info-bar">
          <div class="thesis-info-left">
            <el-tag type="success">已选题</el-tag>
            <span class="thesis-title">{{ thesisProject.topic.title }}</span>
            <el-tag size="small" type="info">{{ thesisProject.topic.category }}</el-tag>
            <el-tag size="small" type="info">{{ thesisProject.topic.datasetName }}</el-tag>
          </div>
          <div class="thesis-info-right">
            <el-link
              type="primary"
              @click="router.push(`/graduation/dataset?url=${encodeURIComponent(thesisProject.topic.datasetUrl)}`)"
            >数据集</el-link>
            <el-link type="primary" @click="openUrlDialog('repo')">
              {{ thesisProject.repoUrl ? '仓库地址' : isViewer ? '未填写仓库' : '填写仓库地址' }}
            </el-link>
            <el-link type="primary" @click="openUrlDialog('deploy')">
              {{ thesisProject.deployUrl ? '部署地址' : isViewer ? '未填写部署' : '填写部署地址' }}
            </el-link>
            <el-popconfirm
              v-if="!isViewer"
              title="放弃选题后，该题目将重新开放给其他同学。确定放弃吗？"
              confirm-button-text="确定放弃"
              cancel-button-text="取消"
              @confirm="handleRelease"
            >
              <template #reference>
                <el-button type="warning" plain size="small" :loading="releasing">放弃选题</el-button>
              </template>
            </el-popconfirm>
            <el-tag v-if="isViewer" type="info" size="small">只读模式</el-tag>
          </div>
        </div>

        <el-alert v-if="isViewer" type="info" :closable="false" style="margin-bottom: 12px">
          测试账号只读模式 — 仅可查看文档，无法生成、编辑或保存
        </el-alert>

        <div class="detail-layout">
          <!-- Main column -->
          <div class="main-column" style="position: relative;">
            <TerminalGenerationOverlay
              :visible="documentStore.reviewStatus === 'reviewing'"
              title="Expert Panel Review — 智能文档审核系统"
              :content="documentStore.reviewLog"
              status="generating"
              :stats="{ tokenCount: 0, tokensPerSecond: 0, elapsedSeconds: 0 }"
              mode="review"
              @close="handleReviewOverlayClose"
            />

            <el-card class="editor-container-card" :body-style="{ padding: '0' }">
              <div class="editor-tabs-wrapper">
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
                      <MarkdownEditor v-if="docModes.PRD === 'edit'" :content="document.content" :document-id="document.id" @save="handleDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingDoc('PRD')" :visible="true" title="正在生成 PRD 文档" :content="documentStore.generationContent" :status="'generating'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingDoc('PRD')" description="PRD文档尚未生成" button-label="立即生成 PRD" :disabled="isViewer || documentStore.generating" @generate="handleGenerateSingle('PRD')" />
                    </div>
                  </template>
                  <template #frontend="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingDoc('FRONTEND')" title="正在生成前端文档" :content="documentStore.generationContent" :status="documentStore.generating && isGeneratingDoc('FRONTEND') ? 'generating' : 'idle'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentModeToggle v-model:mode="docModes.FRONTEND" class="mode-toggle" />
                      <MarkdownEditor v-if="docModes.FRONTEND === 'edit'" :content="document.content" :document-id="document.id" @save="handleDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingDoc('FRONTEND')" :visible="true" title="正在生成前端文档" :content="documentStore.generationContent" :status="'generating'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingDoc('FRONTEND')" description="前端文档尚未生成" button-label="立即生成前端文档" :blocked-reason="getGenerateBlockedReason('FRONTEND')" :disabled="isViewer || !canGenerateDoc('FRONTEND')" @generate="handleGenerateSingle('FRONTEND')" />
                    </div>
                  </template>
                  <template #backend="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingDoc('BACKEND')" title="正在生成后端文档" :content="documentStore.generationContent" :status="documentStore.generating && isGeneratingDoc('BACKEND') ? 'generating' : 'idle'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentModeToggle v-model:mode="docModes.BACKEND" class="mode-toggle" />
                      <MarkdownEditor v-if="docModes.BACKEND === 'edit'" :content="document.content" :document-id="document.id" @save="handleDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingDoc('BACKEND')" :visible="true" title="正在生成后端文档" :content="documentStore.generationContent" :status="'generating'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingDoc('BACKEND')" description="后端文档尚未生成" button-label="立即生成后端文档" :blocked-reason="getGenerateBlockedReason('BACKEND')" :disabled="isViewer || !canGenerateDoc('BACKEND')" @generate="handleGenerateSingle('BACKEND')" />
                    </div>
                  </template>
                  <template #api="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingDoc('API')" title="正在生成 API 文档" :content="documentStore.generationContent" :status="documentStore.generating && isGeneratingDoc('API') ? 'generating' : 'idle'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentModeToggle v-model:mode="docModes.API" class="mode-toggle" />
                      <MarkdownEditor v-if="docModes.API === 'edit'" :content="document.content" :document-id="document.id" @save="handleDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingDoc('API')" :visible="true" title="正在生成 API 文档" :content="documentStore.generationContent" :status="'generating'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingDoc('API')" description="API 文档尚未生成" button-label="立即生成 API 文档" :blocked-reason="getGenerateBlockedReason('API')" :disabled="isViewer || !canGenerateDoc('API')" @generate="handleGenerateSingle('API')" />
                    </div>
                  </template>
                  <template #task="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingDoc('TASK')" title="正在生成任务清单" :content="documentStore.generationContent" :status="documentStore.generating && isGeneratingDoc('TASK') ? 'generating' : 'idle'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentModeToggle v-model:mode="docModes.TASK" class="mode-toggle" />
                      <MarkdownEditor v-if="docModes.TASK === 'edit'" :content="document.content" :document-id="document.id" @save="handleDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingDoc('TASK')" :visible="true" title="正在生成任务清单" :content="documentStore.generationContent" :status="'generating'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingDoc('TASK')" description="任务清单尚未生成" button-label="立即生成任务清单" :blocked-reason="getGenerateBlockedReason('TASK')" :disabled="isViewer || !canGenerateDoc('TASK')" @generate="handleGenerateSingle('TASK')" />
                    </div>
                  </template>
                  <template #contextState="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingDoc('CONTEXT_STATE')" title="正在生成状态追踪文档" :content="documentStore.generationContent" :status="documentStore.generating && isGeneratingDoc('CONTEXT_STATE') ? 'generating' : 'idle'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentModeToggle v-model:mode="docModes.CONTEXT_STATE" class="mode-toggle" />
                      <MarkdownEditor v-if="docModes.CONTEXT_STATE === 'edit'" :content="document.content" :document-id="document.id" @save="handleDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingDoc('CONTEXT_STATE')" :visible="true" title="正在生成状态追踪文档" :content="documentStore.generationContent" :status="'generating'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingDoc('CONTEXT_STATE')" description="状态追踪文档尚未生成" button-label="立即生成状态文档" :blocked-reason="getGenerateBlockedReason('CONTEXT_STATE')" :disabled="isViewer || !canGenerateDoc('CONTEXT_STATE')" @generate="handleGenerateSingle('CONTEXT_STATE')" />
                    </div>
                  </template>
                  <template #agents="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingDoc('AGENTS')" title="正在生成 AI 规则文档" :content="documentStore.generationContent" :status="documentStore.generating && isGeneratingDoc('AGENTS') ? 'generating' : 'idle'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentModeToggle v-model:mode="docModes.AGENTS" class="mode-toggle" />
                      <MarkdownEditor v-if="docModes.AGENTS === 'edit'" :content="document.content" :document-id="document.id" @save="handleDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingDoc('AGENTS')" :visible="true" title="正在生成 AI 规则文档" :content="documentStore.generationContent" :status="'generating'" :stats="documentStore.generationStats" @close="handleStandardGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingDoc('AGENTS')" description="AI 规则文档尚未生成" button-label="立即生成规则文档" :blocked-reason="getGenerateBlockedReason('AGENTS')" :disabled="isViewer || !canGenerateDoc('AGENTS')" @generate="handleGenerateSingle('AGENTS')" />
                    </div>
                  </template>
                </DocumentTabs>

                <GraduationDocumentTabs
                  v-else
                  :documents="graduationStore.documents"
                  :active-doc-type="activeGraduationDocType"
                  :generating="graduationStore.generating"
                  @update:active-doc-type="activeGraduationDocType = $event"
                >
                  <template #taskBook="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingGradDoc('TASK_BOOK')" title="正在生成任务书" :content="graduationStore.generationContent" :status="graduationStore.generating && isGeneratingGradDoc('TASK_BOOK') ? 'generating' : 'idle'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <el-button class="grad-doc-download-btn" :disabled="isViewer || graduationStore.generating" @click="handleDownloadGraduationDocument('TASK_BOOK')"><el-icon><Download /></el-icon>下载</el-button>
                      <DocumentModeToggle v-model:mode="gradDocModes.TASK_BOOK" class="mode-toggle" />
                      <MarkdownEditor v-if="gradDocModes.TASK_BOOK === 'edit'" :content="document.content" :document-id="document.id" @save="handleGraduationDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingGradDoc('TASK_BOOK')" :visible="true" title="正在生成任务书" :content="graduationStore.generationContent" :status="'generating'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingGradDoc('TASK_BOOK')" description="任务书尚未生成" button-label="立即生成任务书" :disabled="isViewer || graduationStore.generating" @generate="handleGenerateGraduationSingle('TASK_BOOK')" />
                    </div>
                  </template>
                  <template #proposal="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingGradDoc('PROPOSAL')" title="正在生成开题报告" :content="graduationStore.generationContent" :status="graduationStore.generating && isGeneratingGradDoc('PROPOSAL') ? 'generating' : 'idle'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <el-button class="grad-doc-download-btn" :disabled="isViewer || graduationStore.generating" @click="handleDownloadGraduationDocument('PROPOSAL')"><el-icon><Download /></el-icon>下载</el-button>
                      <DocumentModeToggle v-model:mode="gradDocModes.PROPOSAL" class="mode-toggle" />
                      <MarkdownEditor v-if="gradDocModes.PROPOSAL === 'edit'" :content="document.content" :document-id="document.id" @save="handleGraduationDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingGradDoc('PROPOSAL')" :visible="true" title="正在生成开题报告" :content="graduationStore.generationContent" :status="'generating'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingGradDoc('PROPOSAL')" description="开题报告尚未生成" button-label="立即生成开题报告" :disabled="isViewer || graduationStore.generating" @generate="handleGenerateGraduationSingle('PROPOSAL')" />
                    </div>
                  </template>
                  <template #preparation="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingGradDoc('PREPARATION')" title="正在生成前期准备" :content="graduationStore.generationContent" :status="graduationStore.generating && isGeneratingGradDoc('PREPARATION') ? 'generating' : 'idle'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <el-button class="grad-doc-download-btn" :disabled="isViewer || graduationStore.generating" @click="handleDownloadGraduationDocument('PREPARATION')"><el-icon><Download /></el-icon>下载</el-button>
                      <DocumentModeToggle v-model:mode="gradDocModes.PREPARATION" class="mode-toggle" />
                      <MarkdownEditor v-if="gradDocModes.PREPARATION === 'edit'" :content="document.content" :document-id="document.id" @save="handleGraduationDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingGradDoc('PREPARATION')" :visible="true" title="正在生成前期准备" :content="graduationStore.generationContent" :status="'generating'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingGradDoc('PREPARATION')" description="前期准备尚未生成" button-label="立即生成前期准备" :disabled="isViewer || graduationStore.generating" @generate="handleGenerateGraduationSingle('PREPARATION')" />
                    </div>
                  </template>
                  <template #drafting="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingGradDoc('DRAFTING')" title="正在生成撰写阶段" :content="graduationStore.generationContent" :status="graduationStore.generating && isGeneratingGradDoc('DRAFTING') ? 'generating' : 'idle'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <el-button class="grad-doc-download-btn" :disabled="isViewer || graduationStore.generating" @click="handleDownloadGraduationDocument('DRAFTING')"><el-icon><Download /></el-icon>下载</el-button>
                      <DocumentModeToggle v-model:mode="gradDocModes.DRAFTING" class="mode-toggle" />
                      <MarkdownEditor v-if="gradDocModes.DRAFTING === 'edit'" :content="document.content" :document-id="document.id" @save="handleGraduationDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingGradDoc('DRAFTING')" :visible="true" title="正在生成撰写阶段" :content="graduationStore.generationContent" :status="'generating'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingGradDoc('DRAFTING')" description="撰写阶段尚未生成" button-label="立即生成撰写阶段" :disabled="isViewer || graduationStore.generating" @generate="handleGenerateGraduationSingle('DRAFTING')" />
                    </div>
                  </template>
                  <template #midtermCheck="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingGradDoc('MIDTERM_CHECK')" title="正在生成中期检查" :content="graduationStore.generationContent" :status="graduationStore.generating && isGeneratingGradDoc('MIDTERM_CHECK') ? 'generating' : 'idle'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <el-button class="grad-doc-download-btn" :disabled="isViewer || graduationStore.generating" @click="handleDownloadGraduationDocument('MIDTERM_CHECK')"><el-icon><Download /></el-icon>下载</el-button>
                      <DocumentModeToggle v-model:mode="gradDocModes.MIDTERM_CHECK" class="mode-toggle" />
                      <MarkdownEditor v-if="gradDocModes.MIDTERM_CHECK === 'edit'" :content="document.content" :document-id="document.id" @save="handleGraduationDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingGradDoc('MIDTERM_CHECK')" :visible="true" title="正在生成中期检查" :content="graduationStore.generationContent" :status="'generating'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingGradDoc('MIDTERM_CHECK')" description="中期检查尚未生成" button-label="立即生成中期检查" :disabled="isViewer || graduationStore.generating" @generate="handleGenerateGraduationSingle('MIDTERM_CHECK')" />
                    </div>
                  </template>
                  <template #refinement="{ document }">
                    <div v-if="document && document.content" class="document-wrapper">
                      <TerminalGenerationOverlay :visible="isGeneratingGradDoc('REFINEMENT')" title="正在生成完善" :content="graduationStore.generationContent" :status="graduationStore.generating && isGeneratingGradDoc('REFINEMENT') ? 'generating' : 'idle'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <el-button class="grad-doc-download-btn" :disabled="isViewer || graduationStore.generating" @click="handleDownloadGraduationDocument('REFINEMENT')"><el-icon><Download /></el-icon>下载</el-button>
                      <DocumentModeToggle v-model:mode="gradDocModes.REFINEMENT" class="mode-toggle" />
                      <MarkdownEditor v-if="gradDocModes.REFINEMENT === 'edit'" :content="document.content" :document-id="document.id" @save="handleGraduationDocumentSave" />
                      <MarkdownPreview v-else :content="document.content" />
                    </div>
                    <div v-else class="empty-doc-placeholder">
                      <TerminalGenerationOverlay v-if="isGeneratingGradDoc('REFINEMENT')" :visible="true" title="正在生成完善" :content="graduationStore.generationContent" :status="'generating'" :stats="graduationStore.generationStats" @close="handleGraduationGenerationOverlayClose" />
                      <DocumentEmptyState v-if="!isGeneratingGradDoc('REFINEMENT')" description="完善尚未生成" button-label="立即生成完善" :disabled="isViewer || graduationStore.generating" @generate="handleGenerateGraduationSingle('REFINEMENT')" />
                    </div>
                  </template>
                </GraduationDocumentTabs>

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

          <!-- Sidebar -->
          <div class="sidebar-column">
            <TechStackPanel
              :tech-stack="documentStore.techStack"
              :editable="!isViewer"
              @update:tech-stack="handleTechStackUpdate"
            />

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

            <ExpertReviewPanel
              v-if="docSetMode === 'standard' && documentStore.allDocsGenerated"
              :project-id="linkedProjectId"
              @fixed="handleReviewFixed"
            />

            <el-card class="help-card">
              <div class="help-info">
                <el-icon><InfoFilled /></el-icon>
                <p v-if="docSetMode === 'standard'">编辑器支持实时自动保存。生成的文档可以根据需要自行修改完善。全部 7 份文档生成后可导出 ZIP 包。</p>
                <p v-else>毕设文档涵盖任务书、开题报告及四个阶段的进展情况记录，可单独下载为 HTML 格式打印提交。</p>
              </div>
            </el-card>
          </div>
        </div>
      </template>
    </main>

    <el-dialog
      v-model="urlDialogVisible"
      :title="urlDialogType === 'repo' ? '代码仓库地址' : '项目部署地址'"
      width="480px"
      @close="cancelUrlDialog"
    >
      <el-input
        v-model="urlDialogValue"
        :placeholder="urlDialogType === 'repo' ? '请填写 Gitee/GitHub 仓库地址' : '请填写项目运行演示地址'"
      />
      <template #footer>
        <el-button @click="cancelUrlDialog">取消</el-button>
        <el-button type="primary" :loading="savingUrl" @click="saveUrlDialog">保存</el-button>
      </template>
    </el-dialog>

    <SelfPasswordDialog v-model:visible="passwordDialogVisible" />

    <Transition name="el-fade-in">
      <div v-if="documentStore.error || graduationStore.error" class="error-toast">
        <el-alert
          :title="documentStore.error || graduationStore.error || ''"
          type="error"
          show-icon
          @close="documentStore.error = ''; graduationStore.error = ''"
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import DOMPurify from 'dompurify';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  Collection, ArrowDown, Key, SwitchButton, Plus, Refresh,
  Loading, MagicStick, Download, Notebook, Files, Cpu, RefreshRight, InfoFilled
} from '@element-plus/icons-vue';
import { useAuthStore } from '@/stores/auth.store';
import { useAppModeStore } from '@/stores/appMode.store';
import { useDocumentStore } from '@/stores/document.store';
import { useGraduationDocumentStore } from '@/stores/graduation.store';
import { getMyThesisProject, releaseThesisTopic, updateThesisProject, initThesisProjectDocsApi } from '@/api/thesis.api';
import { updateProjectTechStackApi } from '@/api/project.api';
import type { ThesisProject } from '@/types/thesis';
import type { DocType } from '@/types/document';
import type { GraduationDocType } from '@/types/graduation-document';
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
import SelfPasswordDialog from '@/components/SelfPasswordDialog.vue';
import TerminalGenerationOverlay from '@/components/TerminalGenerationOverlay.vue';
import DocumentTabs from '@/components/DocumentTabs.vue';
import GraduationDocumentTabs from '@/components/GraduationDocumentTabs.vue';
import DocumentEmptyState from '@/components/DocumentEmptyState.vue';
import MarkdownEditor from '@/components/MarkdownEditor.vue';
import MarkdownPreview from '@/components/MarkdownPreview.vue';
import DocumentModeToggle from '@/components/DocumentModeToggle.vue';
import TechStackPanel from '@/components/TechStackPanel.vue';
import ExpertReviewPanel from '@/components/ExpertReviewPanel.vue';

const router = useRouter();
const authStore = useAuthStore();
const appModeStore = useAppModeStore();
const documentStore = useDocumentStore();
const graduationStore = useGraduationDocumentStore();

const user = authStore.user;
const isViewer = computed(() => authStore.isViewer);

// Thesis state
const thesisProject = ref<ThesisProject | null>(null);
const linkedProjectId = ref<number | null>(null);
const loading = ref(false);
const initializingDocs = ref(false);
const releasing = ref(false);
const passwordDialogVisible = ref(false);
const urlDialogVisible = ref(false);
const urlDialogType = ref<'repo' | 'deploy'>('repo');
const urlDialogValue = ref('');
const savingUrl = ref(false);
const exporting = ref(false);

// Document state
const docSetMode = ref<'standard' | 'graduation'>('graduation');
const activeDocType = ref<DocType>('PRD');
const activeGraduationDocType = ref<GraduationDocType>('TASK_BOOK');
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

const ALL_DOC_TYPES: DocType[] = DOC_GENERATION_ORDER;
const ALL_GRAD_DOC_TYPES: GraduationDocType[] = GRAD_DOC_GENERATION_ORDER;

const allDocsGenerated = computed(() =>
  ALL_DOC_TYPES.every(dt => {
    const doc = documentStore.getDocumentByType(dt);
    return doc && doc.content.length > 0;
  })
);

const currentGeneratingLabel = computed(() => {
  const docType = documentStore.generatingDocType;
  return docType ? DOC_TYPE_LABELS[docType] : '当前';
});

function switchMode() {
  appModeStore.clearMode();
  router.push('/mode-select');
}

async function handleLogout() {
  await authStore.logout();
  appModeStore.clearMode();
  router.push('/login');
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('zh-CN');
}

async function initDocuments() {
  initializingDocs.value = true;
  try {
    const { projectId } = await initThesisProjectDocsApi();
    linkedProjectId.value = projectId;
    await Promise.all([
      documentStore.fetchDocuments(projectId),
      graduationStore.fetchDocuments(projectId)
    ]);
  } catch (err: any) {
    ElMessage.error(err?.message || '初始化文档失败');
  } finally {
    initializingDocs.value = false;
  }
}

onMounted(async () => {
  loading.value = true;
  try {
    thesisProject.value = await getMyThesisProject();
    if (thesisProject.value) {
      await initDocuments();
    }
  } finally {
    loading.value = false;
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

async function handleRelease() {
  releasing.value = true;
  try {
    await releaseThesisTopic();
    thesisProject.value = null;
    linkedProjectId.value = null;
    documentStore.abortGeneration();
    documentStore.clearGenerationDisplay();
    graduationStore.abortGeneration();
    graduationStore.clearGenerationDisplay();
    ElMessage.success('已放弃选题');
  } catch (err: any) {
    ElMessage.error(err?.message || '操作失败');
  } finally {
    releasing.value = false;
  }
}

function openUrlDialog(type: 'repo' | 'deploy') {
  if (isViewer.value) {
    ElMessage.warning('测试账号仅可查看，无法执行此操作');
    return;
  }
  urlDialogType.value = type;
  urlDialogValue.value = type === 'repo'
    ? (thesisProject.value?.repoUrl || '')
    : (thesisProject.value?.deployUrl || '');
  urlDialogVisible.value = true;
}

function cancelUrlDialog() {
  urlDialogVisible.value = false;
  urlDialogValue.value = '';
}

async function saveUrlDialog() {
  savingUrl.value = true;
  try {
    const payload = urlDialogType.value === 'repo'
      ? { repoUrl: urlDialogValue.value }
      : { deployUrl: urlDialogValue.value };
    thesisProject.value = await updateThesisProject(payload);
    urlDialogVisible.value = false;
    urlDialogValue.value = '';
    ElMessage.success('保存成功');
  } catch {
    ElMessage.error('保存失败');
  } finally {
    savingUrl.value = false;
  }
}

function toggleDocSet() {
  if (docSetMode.value === 'standard') {
    docSetMode.value = 'graduation';
    activeGraduationDocType.value = 'TASK_BOOK';
  } else {
    docSetMode.value = 'standard';
    activeDocType.value = 'PRD';
  }
}

// Document operations
async function handleDocumentSave(docId: number, content: string) {
  const success = await documentStore.updateDocument(docId, content);
  if (!success) ElMessage.error('保存失败');
}

async function handleGraduationDocumentSave(docId: number, content: string) {
  const success = await graduationStore.updateDocument(docId, content);
  if (!success) ElMessage.error('保存失败');
}

function getDocTypeLabel(type: DocType): string {
  return DOC_TYPE_LABELS[type];
}

function getGradDocLabel(type: GraduationDocType): string {
  return GRAD_DOC_TYPE_LABELS[type];
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

function isGeneratingGradDoc(docType: GraduationDocType): boolean {
  return graduationStore.isGeneratingDocument(docType);
}

function handleStandardGenerationOverlayClose() {
  documentStore.abortGeneration();
  documentStore.clearGenerationDisplay();
  ElMessage.info('已停止生成');
}

function handleGraduationGenerationOverlayClose() {
  graduationStore.abortGeneration();
  graduationStore.clearGenerationDisplay();
  ElMessage.info('已停止生成');
}

function handleReviewOverlayClose() {
  documentStore.abortReview();
  ElMessage.info('已停止审核');
}

function handleReviewFixed(fixedDocTypes: DocType[]) {
  if (fixedDocTypes.length > 0) activeDocType.value = fixedDocTypes[0];
}

async function handleGenerateSingle(docType: DocType) {
  if (!linkedProjectId.value) return;
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
      await ElMessageBox.confirm('文档已有内容，重新生成将覆盖现有内容。是否继续？', '重新生成', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      });
    } catch { return; }
  }
  activeDocType.value = docType;
  await nextTick();
  const success = await documentStore.generateDocument(linkedProjectId.value, docType, { forceRegenerate });
  if (success) {
    ElMessage.success(`${getDocTypeLabel(docType)}文档生成成功`);
  } else if (documentStore.error) {
    ElMessage.error(documentStore.error);
  }
}

async function handleGenerateAll() {
  if (!linkedProjectId.value) return;
  const hasContent = ALL_DOC_TYPES.some(dt => {
    const doc = documentStore.getDocumentByType(dt);
    return doc && doc.content.length > 0;
  });
  if (hasContent) {
    try {
      await ElMessageBox.confirm('部分文档已有内容，重新生成将覆盖现有内容。是否继续？', '批量生成', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      });
    } catch { return; }
  }
  for (const docType of ALL_DOC_TYPES) {
    const forceRegenerate = Boolean(documentStore.getDocumentByType(docType)?.content.trim());
    activeDocType.value = docType;
    await nextTick();
    const success = await documentStore.generateDocument(linkedProjectId.value, docType, { forceRegenerate });
    if (!success) {
      if (documentStore.error) ElMessage.error(documentStore.error);
      return;
    }
  }
  ElMessage.success('全部 7 份文档生成成功');
}

async function handleGenerateGraduationSingle(docType: GraduationDocType) {
  if (!linkedProjectId.value) return;
  const existingDoc = graduationStore.getDocumentByType(docType);
  const forceRegenerate = Boolean(existingDoc?.content.trim());
  if (existingDoc && existingDoc.content.length > 0) {
    try {
      await ElMessageBox.confirm('文档已有内容，重新生成将覆盖现有内容。是否继续？', '重新生成', {
        confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      });
    } catch { return; }
  }
  activeGraduationDocType.value = docType;
  await nextTick();
  const success = await graduationStore.generateDocument(linkedProjectId.value, docType, { forceRegenerate });
  if (success) {
    ElMessage.success(`${getGradDocLabel(docType)}生成成功`);
  } else if (graduationStore.error) {
    ElMessage.error(graduationStore.error);
  }
}

async function handleExportDocuments() {
  const docs = documentStore.documents.filter(d => d.content && d.content.length > 0);
  if (docs.length === 0) { ElMessage.warning('暂无可导出的文档内容'); return; }
  exporting.value = true;
  try {
    const projectName = thesisProject.value?.topic.title || '毕业设计';
    const dateStr = new Date().toISOString().split('T')[0];
    const safeName = projectName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    const zip = new JSZip();
    const filenameMap: Record<DocType, string> = {
      PRD: 'PRD.md', FRONTEND: 'Frontend.md', BACKEND: 'Backend.md',
      API: 'API.md', TASK: 'task.md', CONTEXT_STATE: 'context_state.md', AGENTS: 'AGENTS.md'
    };
    docs.forEach(doc => {
      const filename = filenameMap[doc.docType];
      if (filename && doc.content) zip.file(filename, doc.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${safeName}_${dateStr}.zip`);
    ElMessage.success('文档导出成功');
  } catch {
    ElMessage.error('导出失败，请重试');
  } finally {
    exporting.value = false;
  }
}

async function handleDownloadGraduationDocument(docType: GraduationDocType) {
  const document = graduationStore.getDocumentByType(docType);
  if (!document?.content?.trim()) { ElMessage.warning('当前文档暂无可下载内容'); return; }
  try {
    const projectName = thesisProject.value?.topic.title || '毕业设计';
    const safeProjectName = projectName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    const safeDocName = getGradDocLabel(docType).replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    const content = buildGraduationDownloadHtml(projectName, getGradDocLabel(docType), document.content);
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    saveAs(blob, `${safeProjectName}_${safeDocName}.html`);
    ElMessage.success(`${getGradDocLabel(docType)}下载成功`);
  } catch {
    ElMessage.error('下载失败，请重试');
  }
}

function buildGraduationDownloadHtml(projectName: string, docName: string, content: string): string {
  const bodyContent = content.trim().startsWith('<')
    ? DOMPurify.sanitize(content)
    : markdownToSimpleHtml(content);
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(projectName)} - ${escapeHtml(docName)}</title>
  <style>
    body { margin: 0; padding: 40px; background: #f8fafc; color: #1f2937; font-family: SimSun, "Songti SC", serif; }
    .page { max-width: 820px; min-height: 1120px; margin: 0 auto; padding: 48px 56px; background: #fff; box-shadow: 0 8px 30px rgba(15, 23, 42, 0.08); }
    h1, h2, h3 { color: #111827; }
    p, li { font-size: 14px; line-height: 1.8; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #d1d5db; padding: 8px 10px; text-align: left; }
    @media print { body { padding: 0; background: #fff; } .page { box-shadow: none; min-height: auto; } }
  </style>
</head>
<body><main class="page">${bodyContent}</main></body>
</html>`;
}

function markdownToSimpleHtml(markdown: string): string {
  return markdown
    .split('\n').map(l => l.trim()).filter(Boolean)
    .map(line => {
      if (line.startsWith('### ')) return `<h3>${escapeHtml(line.slice(4))}</h3>`;
      if (line.startsWith('## ')) return `<h2>${escapeHtml(line.slice(3))}</h2>`;
      if (line.startsWith('# ')) return `<h1>${escapeHtml(line.slice(2))}</h1>`;
      if (line.startsWith('- ')) return `<p>• ${escapeHtml(line.slice(2))}</p>`;
      return `<p>${escapeHtml(line)}</p>`;
    }).join('\n');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function handleTechStackUpdate(techStack: string) {
  if (!linkedProjectId.value) return;
  try {
    await updateProjectTechStackApi(linkedProjectId.value, techStack);
    documentStore.techStack = techStack.split(',').map(t => t.trim());
    ElMessage.success('技术栈更新成功');
  } catch {
    ElMessage.error('更新失败');
  }
}
</script>

<style scoped>
.graduation-dashboard {
  min-height: 100vh;
  background: #f1f5f9;
  display: flex;
  flex-direction: column;
}

.dashboard-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.header-content {
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.header-left { display: flex; align-items: center; }

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mini {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 800;
  font-size: 14px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.platform-name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.platform-tag {
  font-size: 12px;
  color: #10b981;
  display: block;
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

.user-info-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.user-meta { display: flex; flex-direction: column; }

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.user-role {
  font-size: 12px;
  color: #64748b;
}

.dashboard-main {
  flex: 1;
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.dashboard-main--wide {
  max-width: 1400px;
}

.loading-state { min-height: 400px; }

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

/* Compact info bar */
.thesis-info-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 14px 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  flex-wrap: wrap;
  gap: 12px;
}

.thesis-info-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.thesis-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
}

.thesis-info-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  flex-wrap: wrap;
}

/* Document layout */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.main-column { position: relative; }

.editor-container-card {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
}

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
  border-color: #10b981;
  color: #10b981;
  background-color: #ecfdf5;
}

.document-wrapper {
  height: calc(100vh - 264px);
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
  border-color: #10b981;
  color: #10b981;
  background-color: #ecfdf5;
}

.empty-doc-placeholder {
  height: calc(100vh - 264px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
  position: relative;
}

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
