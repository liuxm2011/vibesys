<template>
  <el-card class="review-panel">
    <template #header>
      <div class="sidebar-header">
        <el-icon><UserFilled /></el-icon>
        <span>专家团审核</span>
      </div>
    </template>

    <!-- State 1: Idle -->
    <div v-if="reviewStatus === 'idle'" class="review-idle">
      <p class="review-desc">对已生成的 7 份文档进行跨文档一致性审核，检查前后端 PRD、API 文档的对齐程度。</p>
      <el-button
        type="primary"
        class="start-review-btn"
        :disabled="documentStore.generating"
        @click="handleStartReview"
      >
        <el-icon><MagicStick /></el-icon>
        启动专家团审核
      </el-button>
    </div>

    <!-- State 2: Reviewing -->
    <div v-else-if="reviewStatus === 'reviewing'" class="review-loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <p class="loading-text">专家团正在审核中</p>
    </div>

    <!-- State 3: Results -->
    <div v-else-if="reviewStatus === 'reviewed'" class="review-results">
      <div class="review-summary">
        <p>{{ documentStore.reviewResult?.summary }}</p>
      </div>

      <div class="issue-badges">
        <el-tag
          v-for="sev in severityCounts"
          :key="sev.key"
          :type="sev.type"
          size="small"
          class="severity-badge"
        >
          {{ sev.count }} {{ sev.label }}
        </el-tag>
      </div>

      <el-collapse v-if="documentStore.reviewResult?.issues?.length" class="issues-collapse">
        <el-collapse-item
          v-for="issue in documentStore.reviewResult.issues"
          :key="issue.id"
          :title="issue.title"
        >
          <div class="issue-detail">
            <el-tag :type="severityConfig[issue.severity].type" size="small">
              {{ severityConfig[issue.severity].label }}
            </el-tag>
            <el-tag size="small" class="category-tag">
              {{ categoryLabels[issue.category] || issue.category }}
            </el-tag>
            <p class="issue-desc">{{ issue.description }}</p>
            <div v-if="issue.affectedDocTypes.length" class="affected-docs">
              <span class="affected-label">影响文档：</span>
              <el-tag
                v-for="dt in issue.affectedDocTypes"
                :key="dt"
                size="small"
                type="info"
                class="affected-tag"
              >
                {{ (docTypeLabels as any)[dt] || dt }}
              </el-tag>
            </div>
            <p v-if="issue.suggestion" class="issue-suggestion">
              <strong>建议：</strong>{{ issue.suggestion }}
            </p>
          </div>
        </el-collapse-item>
      </el-collapse>

      <p v-else class="no-issues">未发现明显问题。</p>

      <div class="review-actions">
        <el-button type="primary" :loading="fixing" @click="handleApplyFixes">
          <el-icon><Check /></el-icon>
          一键修改
        </el-button>
        <el-button @click="handleDiscard">放弃修改</el-button>
      </div>
    </div>

    <!-- State 4: Fixing -->
    <div v-else-if="reviewStatus === 'fixing'" class="review-loading">
      <el-icon class="is-loading" :size="32"><Loading /></el-icon>
      <p class="loading-text">{{ fixLoadingText }}</p>
    </div>

    <!-- State 5: Fixed -->
    <div v-else-if="reviewStatus === 'fixed'" class="review-fixed">
      <el-result
        :icon="hasUnresolvedFixes ? 'warning' : 'success'"
        :title="hasUnresolvedFixes ? '部分修复完成' : '修复完成'"
        :sub-title="hasUnresolvedFixes ? '已自动修订可定位内容，未定位项请按提示人工整理文档结构' : '文档已根据审核建议更新'"
      >
        <template v-if="hasUnresolvedFixes" #extra>
          <div class="unresolved-summary">
            <p class="unresolved-desc">以下问题没有再被直接追加到文末，而是保留为待人工整理项，方便你按结构重新编排文档。</p>
            <el-collapse class="issues-collapse">
              <el-collapse-item
                v-for="item in documentStore.unresolvedFixes"
                :key="`${item.docType}-${item.issueId}-${item.reason}`"
                :title="`${(docTypeLabels as any)[item.docType] || item.docType} · 问题 #${item.issueId}`"
              >
                <div class="issue-detail">
                  <p class="issue-desc"><strong>未自动应用原因：</strong>{{ unresolvedReasonLabel(item.reason) }}</p>
                  <p v-if="item.targetHeadingPath?.length" class="issue-desc">
                    <strong>目标标题路径：</strong>{{ item.targetHeadingPath.join(' > ') }}
                  </p>
                  <p v-if="item.anchorBefore" class="issue-desc">
                    <strong>前锚点：</strong>{{ item.anchorBefore }}
                  </p>
                  <p v-if="item.anchorAfter" class="issue-desc">
                    <strong>后锚点：</strong>{{ item.anchorAfter }}
                  </p>
                  <p class="issue-suggestion">
                    <strong>建议人工整理：</strong>{{ item.fallbackNote }}
                  </p>
                </div>
              </el-collapse-item>
            </el-collapse>
            <div class="review-actions">
              <el-button type="primary" @click="handleNewReview">再次审核</el-button>
              <el-button @click="handleDiscard">关闭</el-button>
            </div>
          </div>
        </template>
        <template v-else #extra>
          <el-button type="primary" @click="handleNewReview">再次审核</el-button>
          <el-button @click="handleDiscard">关闭</el-button>
        </template>
      </el-result>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  UserFilled,
  MagicStick,
  Loading,
  Check
} from '@element-plus/icons-vue';
import { useDocumentStore } from '@/stores/document.store';
import { DOC_TYPE_LABELS, REVIEW_CATEGORY_LABELS, REVIEW_SEVERITY_CONFIG } from '@/utils/document-generation';
import type { DocType } from '@/types/document';

const documentStore = useDocumentStore();
const props = defineProps<{ projectId: number }>();
const emit = defineEmits<{ (e: 'fixed', docTypes: DocType[]): void }>();

const severityConfig = REVIEW_SEVERITY_CONFIG;
const categoryLabels = REVIEW_CATEGORY_LABELS;
const docTypeLabels = DOC_TYPE_LABELS;

const reviewStatus = computed(() => documentStore.reviewStatus);
const fixing = computed(() => documentStore.fixing);
const hasUnresolvedFixes = computed(() => documentStore.unresolvedFixes.length > 0);

const fixMessages = [
  '正在根据审核建议定位受影响章节...',
  '正在局部修订受影响内容...',
  '正在保存修订结果...'
];
const fixLoadingText = ref(fixMessages[0]);
let fixTimer: ReturnType<typeof setInterval> | null = null;

function startLoadingRotation(messages: string[], textRef: { value: string }, duration = 3000) {
  let idx = 0;
  const timer = setInterval(() => {
    idx = (idx + 1) % messages.length;
    textRef.value = messages[idx];
  }, duration);
  return timer;
}

async function handleStartReview() {
  const success = await documentStore.triggerReview(props.projectId);

  if (success) {
    ElMessage.success('审核完成');
  } else {
    ElMessage.error(documentStore.error || '审核失败');
  }
}

const severityCounts = computed(() => {
  const issues = documentStore.reviewResult?.issues || [];
  const counts: Record<string, number> = { critical: 0, warning: 0, suggestion: 0 };
  for (const issue of issues) {
    counts[issue.severity] = (counts[issue.severity] || 0) + 1;
  }
  return [
    { key: 'critical', count: counts.critical, ...severityConfig.critical },
    { key: 'warning', count: counts.warning, ...severityConfig.warning },
    { key: 'suggestion', count: counts.suggestion, ...severityConfig.suggestion }
  ];
});

async function handleApplyFixes() {
  const affectedTypes = new Set<string>();
  for (const issue of documentStore.reviewResult?.issues || []) {
    for (const t of issue.affectedDocTypes) {
      affectedTypes.add(t);
    }
  }

  if (affectedTypes.size === 0) {
    ElMessage.info('没有需要修改的文档');
    return;
  }

  const typeLabels = Array.from(affectedTypes).map(t => (docTypeLabels as any)[t] || t).join('、');

  try {
    await ElMessageBox.confirm(
      `将根据审核建议修改 ${affectedTypes.size} 份文档（${typeLabels}），原有内容将被覆盖。是否继续？`,
      '确认修改',
      { confirmButtonText: '一键修改', cancelButtonText: '取消', type: 'warning' }
    );
  } catch {
    return;
  }

  fixLoadingText.value = fixMessages[0];
  fixTimer = startLoadingRotation(fixMessages, fixLoadingText, 4000);

  const success = await documentStore.applyFixes(props.projectId);
  if (fixTimer) clearInterval(fixTimer);
  fixTimer = null;

  if (success) {
    const fixedTypes = documentStore.fixingDocTypes;
    emit('fixed', fixedTypes);
    if (documentStore.unresolvedFixes.length > 0) {
      ElMessage.warning(`已自动修改 ${fixedTypes.length} 份文档，另有 ${documentStore.unresolvedFixes.length} 项待人工整理`);
    } else {
      ElMessage.success(`已修改 ${fixedTypes.length} 份文档`);
    }
  } else {
    ElMessage.error(documentStore.error || '修复失败');
  }
}

async function handleDiscard() {
  if (reviewStatus.value === 'fixed') {
    documentStore.hydrateReviewState('NONE', null);
    return;
  }

  const success = await documentStore.discardReview(props.projectId);
  if (!success) {
    ElMessage.error(documentStore.error || '关闭审核结果失败');
  }
}

function handleNewReview() {
  void handleStartReview();
}

function unresolvedReasonLabel(reason: string): string {
  const labels: Record<string, string> = {
    missing_patch_hints: '审核结果没有给出可直接应用的结构化修订提示',
    patch_apply_failed: '结构化修订提示应用失败',
    target_heading_path_not_found: '未找到目标标题路径',
    missing_anchors: '缺少局部替换所需的前后锚点',
    anchor_before_not_found: '未找到前锚点',
    anchor_after_not_found: '未找到后锚点',
    invalid_anchor_order: '前后锚点顺序异常',
    anchors_not_found: '未找到可替换的锚点区间',
    unsupported_change_type: '遇到不支持的修订类型'
  };

  return labels[reason] || reason;
}

onUnmounted(() => {
  if (fixTimer) clearInterval(fixTimer);
});
</script>

<style scoped>
.review-panel {
  margin-top: 16px;
}

.review-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 16px;
}

.start-review-btn {
  width: 100%;
}

.review-loading {
  position: relative;
  text-align: center;
  padding: 24px 0;
}

.loading-text {
  margin-top: 12px;
  font-size: 13px;
  color: #606266;
}

.review-summary {
  font-size: 13px;
  color: #303133;
  line-height: 1.6;
  margin-bottom: 12px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.issue-badges {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.severity-badge {
  font-weight: 500;
}

.issues-collapse {
  margin-bottom: 16px;
}

.issue-detail {
  padding: 4px 0;
}

.issue-detail .el-tag {
  margin-right: 6px;
  margin-bottom: 8px;
}

.category-tag {
  background: #f0f0f0 !important;
  border-color: #dcdfe6 !important;
  color: #606266 !important;
}

.issue-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 8px 0;
}

.affected-docs {
  margin: 8px 0;
}

.affected-label {
  font-size: 13px;
  color: #909399;
  margin-right: 6px;
}

.affected-tag {
  margin-right: 4px;
}

.issue-suggestion {
  font-size: 13px;
  color: #409eff;
  line-height: 1.6;
  margin: 8px 0 0;
}

.no-issues {
  text-align: center;
  color: #909399;
  font-size: 13px;
  padding: 16px 0;
}

.review-actions {
  display: flex;
  gap: 8px;
}

.review-actions .el-button {
  flex: 1;
}

.review-fixed {
  padding: 8px 0;
}

.unresolved-summary {
  width: 100%;
  text-align: left;
}

.unresolved-desc {
  margin: 0 0 12px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}
</style>
