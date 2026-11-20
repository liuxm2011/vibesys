<script setup lang="ts">
import { nextTick, onUnmounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { saveAs } from 'file-saver';
import { fetchGraduationHandbookApi, updateGraduationHandbookApi } from '@/api/graduation.api';
import { useGraduationDocumentStore } from '@/stores/graduation.store';
import type {
  GraduationDocType, GraduationDocument, GraduationHandbookData, HandbookNoteType, HandbookProfile,
} from '@/types/graduation-document';
import { GRAD_DOC_GENERATION_ORDER, GRAD_DOC_TYPE_LABELS as labels } from '@/utils/graduation-document-generation';
import { buildGraduationDownloadHtml } from '@/utils/graduation-download';
import { buildGraduationHandbookWord, buildGraduationWord, safeGraduationFilename } from '@/utils/graduation-handbook-export';
import GraduationDocumentTabs from './GraduationDocumentTabs.vue';
import TerminalGenerationOverlay from './TerminalGenerationOverlay.vue';
import DocumentEmptyState from './DocumentEmptyState.vue';
import DocumentModeToggle from './DocumentModeToggle.vue';
import MarkdownEditor from './MarkdownEditor.vue';
import MarkdownPreview from './MarkdownPreview.vue';

const props = defineProps<{ projectId: number; projectTitle: string; readonly: boolean }>();
const store = useGraduationDocumentStore();
const activeTab = ref<GraduationDocType>('TASK_BOOK');
const modes = ref<Partial<Record<GraduationDocType, 'read' | 'edit'>>>({});
const batch = ref(false);
const exporting = ref(false);
const loadingProfile = ref(false);
const savingProfile = ref(false);
const profileVisible = ref(false);
const profile = ref<HandbookProfile>();
const handbook = ref<GraduationHandbookData>();
const profileTab = ref<'profile' | 'notes'>('profile');
let disposed = false;

const noteFields: Array<{ type: HandbookNoteType; placeholder: string }> = [
  { type: 'PREPARATION', placeholder: '例如查阅的资料、确定的需求与技术方案、准备的环境、开题报告进度' },
  { type: 'DRAFTING', placeholder: '例如完成的设计、实现的模块或实验、测试情况、说明书初稿进度' },
  { type: 'MIDTERM_CHECK', placeholder: '例如阶段成果、尚存问题、说明书进度和已取得的查重或 AIGC 检测报告' },
  { type: 'REFINEMENT', placeholder: '例如依据反馈完成的修改、测试和说明书进度、材料整理情况' },
  { type: 'SUMMARY', placeholder: '结合四阶段工作，填写你遇到的实际困难、处理办法、收获和仍可改进的地方' },
];

onUnmounted(() => {
  disposed = true;
  store.abortGeneration();
  store.clearGenerationDisplay();
});

async function openProfile(tab: 'profile' | 'notes') {
  loadingProfile.value = true;
  try {
    const data = await fetchGraduationHandbookApi(props.projectId);
    if (disposed) return;
    handbook.value = data;
    profile.value = { ...data.profile, notes: { ...data.profile.notes } };
    profileTab.value = tab;
    profileVisible.value = true;
  } catch (error) {
    if (!disposed) ElMessage.error(error instanceof Error ? error.message : '获取手册资料失败');
  } finally {
    loadingProfile.value = false;
  }
}

async function saveProfile() {
  if (!profile.value || !handbook.value) return;
  savingProfile.value = true;
  try {
    const saved = await updateGraduationHandbookApi(props.projectId, profile.value);
    handbook.value = { ...handbook.value, ...saved };
    profileVisible.value = false;
    ElMessage.success('手册资料已保存，新生成的文档将使用这些资料');
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : '手册资料保存失败');
  } finally {
    savingProfile.value = false;
  }
}

async function generate(type: GraduationDocType, forceRegenerate = false): Promise<boolean> {
  activeTab.value = type;
  await nextTick();
  if (disposed) return false;
  const success = await store.generateDocument(props.projectId, type, { forceRegenerate });
  if (!success && store.error && !disposed) ElMessage.error(store.error);
  return success;
}

async function generateSingle(type: GraduationDocType) {
  if (batch.value || store.generating) return;
  const existing = store.getDocumentByType(type)?.content.trim();
  if (existing) {
    try {
      await ElMessageBox.confirm('重新生成会覆盖当前文档，请先保存需要保留的内容。', '重新生成', {
        type: 'warning', confirmButtonText: '重新生成', cancelButtonText: '取消',
      });
    } catch { return; }
  }
  if (await generate(type, Boolean(existing)) && !disposed) ElMessage.success(`${labels[type]}已生成`);
}

async function generateMissing() {
  if (batch.value || store.generating) return;
  const pending = GRAD_DOC_GENERATION_ORDER.filter(type => !store.getDocumentByType(type)?.content.trim());
  batch.value = true;
  try {
    for (const type of pending) {
      if (!await generate(type)) return;
    }
    if (!disposed) ElMessage.success('缺少的毕设文档已生成');
  } finally {
    batch.value = false;
  }
}

function downloadHtml(doc: GraduationDocument) {
  const name = `${safeGraduationFilename(props.projectTitle)}_${labels[doc.docType]}`;
  const content = buildGraduationDownloadHtml(props.projectTitle, labels[doc.docType], doc.content);
  saveAs(new Blob([content], { type: 'text/html;charset=utf-8' }), `${name}.html`);
}

async function downloadWord(doc?: GraduationDocument) {
  exporting.value = true;
  try {
    const data = await fetchGraduationHandbookApi(props.projectId);
    const file = doc ? await buildGraduationWord(doc, data) : await buildGraduationHandbookWord(store.documents, data);
    if (disposed) return;
    const name = safeGraduationFilename(data.identity.title || props.projectTitle);
    saveAs(file, `${name}_${doc ? labels[doc.docType] : '过程管理手册'}.docx`);
  } catch (error) {
    ElMessage.error(error instanceof Error ? error.message : 'Word 下载失败');
  } finally {
    exporting.value = false;
  }
}

async function saveDocument(id: number, content: string) {
  if (!await store.updateDocument(id, content)) ElMessage.error(store.error || '文档保存失败');
}
</script>

<template>
  <div class="handbook" :class="{ 'handbook-readonly': readonly }">
    <div v-if="!readonly" class="handbook-toolbar">
      <el-button size="small" :disabled="store.generating || batch" :loading="loadingProfile" @click="openProfile('profile')">手册资料</el-button>
      <el-button size="small" :disabled="store.generating || batch" :loading="loadingProfile" @click="openProfile('notes')">填写阶段记录</el-button>
      <el-button size="small" type="primary" plain :disabled="store.loading || store.generating || store.allDocsGenerated" :loading="batch" @click="generateMissing">生成缺少的文档</el-button>
      <el-button size="small" :disabled="store.loading || store.generating || batch" :loading="exporting" @click="downloadWord()">导出整册 Word</el-button>
    </div>

    <GraduationDocumentTabs v-model:active-doc-type="activeTab" :documents="store.documents">
      <template #default="{ type, document }">
        <div class="handbook-body">
          <TerminalGenerationOverlay
            :visible="store.isGeneratingDocument(type)"
            :title="`正在生成${labels[type]}`"
            :content="store.generationContent"
            :status="store.isGeneratingDocument(type) ? 'generating' : 'idle'"
            :stats="store.generationStats"
            @close="store.clearGenerationDisplay"
          />

          <template v-if="document">
            <div v-if="!readonly" class="handbook-document-actions">
              <el-button size="small" :disabled="store.generating || batch" @click="generateSingle(type)">重新生成</el-button>
              <el-button size="small" :disabled="store.generating || batch || exporting" @click="downloadWord(document)">下载 Word</el-button>
              <el-button size="small" :disabled="store.generating || batch" @click="downloadHtml(document)">下载 HTML</el-button>
              <DocumentModeToggle :mode="modes[type] || 'edit'" @update:mode="modes[type] = $event" />
            </div>
            <MarkdownEditor v-if="!readonly && modes[type] !== 'read'" :key="document.id" :content="document.content" :document-id="document.id" @save="saveDocument" />
            <MarkdownPreview v-else :content="document.content" />
          </template>
          <DocumentEmptyState v-else-if="!store.isGeneratingDocument(type)"
            :description="`${labels[type]}尚未生成`"
            :button-label="`生成${labels[type]}`"
            :disabled="readonly || store.loading || store.generating || batch"
            @generate="generateSingle(type)"
          />
        </div>
      </template>
    </GraduationDocumentTabs>

    <el-dialog v-model="profileVisible" title="过程管理手册资料" width="min(680px, 95vw)"
      :close-on-click-modal="false" :show-close="!savingProfile">
      <el-tabs v-if="profile" v-model="profileTab">
        <el-tab-pane label="基础资料与文献" name="profile">
          <p v-if="handbook" class="handbook-hint">
            {{ handbook.identity.studentId }}　{{ handbook.identity.name }}　{{ handbook.identity.majorClass }}<br>
            {{ handbook.identity.title }}
          </p>
          <el-form label-position="top">
            <div class="handbook-form-grid">
              <el-form-item label="届别"><el-input v-model="profile.cohort" maxlength="4" placeholder="2027" /></el-form-item>
              <el-form-item label="教学学院"><el-input v-model="profile.college" maxlength="100" /></el-form-item>
              <el-form-item label="英文题目"><el-input v-model="profile.englishTitle" maxlength="250" /></el-form-item>
              <el-form-item label="选题编号"><el-input v-model="profile.topicCode" maxlength="60" /></el-form-item>
              <el-form-item label="指导教师姓名"><el-input v-model="profile.advisorName" maxlength="60" /></el-form-item>
              <el-form-item label="指导教师职称"><el-input v-model="profile.advisorTitle" maxlength="60" /></el-form-item>
              <el-form-item label="评阅教师姓名"><el-input v-model="profile.reviewerName" maxlength="60" /></el-form-item>
              <el-form-item label="评阅教师职称"><el-input v-model="profile.reviewerTitle" maxlength="60" /></el-form-item>
              <el-form-item label="开题日期（按指导教师安排调整）">
                <el-date-picker v-model="profile.proposalDate" type="date" value-format="YYYY-MM-DD" :value-on-clear="''"
                  :placeholder="handbook?.calendar?.proposalDeadline || '按届别日历填写'" />
              </el-form-item>
            </div>
            <el-form-item label="已核实参考文献（每行一条）">
              <el-input v-model="profile.references" type="textarea" :rows="4" maxlength="6000" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="阶段记录与个人反思" name="notes">
          <p class="handbook-hint">填写实际情况后可生成正文草稿。尚无记录的环节可以先生成待填写的表单。</p>
          <el-form label-position="top">
            <el-form-item v-for="item in noteFields" :key="item.type" :label="labels[item.type]">
              <el-input v-model="profile.notes[item.type]" type="textarea" :rows="3" maxlength="2500" :placeholder="item.placeholder" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <el-button :disabled="savingProfile" @click="profileVisible = false">取消</el-button>
        <el-button type="primary" :loading="savingProfile" @click="saveProfile">保存资料</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.handbook {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
}

.handbook-readonly {
  padding-top: 54px;
}

.handbook-toolbar, .handbook-document-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
}

.handbook-toolbar {
  padding-right: 118px;
}

.handbook-toolbar :deep(.el-button + .el-button),
.handbook-document-actions :deep(.el-button + .el-button) {
  margin-left: 0;
}

.handbook-body {
  position: relative;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;
  padding: 12px 16px 20px;
}

.handbook-body :deep(.markdown-editor-container),
.handbook-body :deep(.markdown-preview-container) {
  min-height: 0;
  flex: 1;
  overflow: auto;
}

.handbook-document-actions {
  flex: none;
  padding: 0 0 12px;
}

.handbook-form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 0 20px;
}

.handbook-hint {
  color: #475569;
  margin: 8px 0 16px;
  line-height: 1.65;
}
</style>
