<script setup lang="ts">
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Link, Refresh, Delete, Check, Edit, Clock, Document } from '@element-plus/icons-vue';
import type { RepoSyncData, GiteeCommit } from '@/types/project';

interface Props {
  repoUrl: string | null;
  repoSyncData: RepoSyncData | null;
  syncing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  syncing: false
});

const emit = defineEmits<{
  'update:repoUrl': [repoUrl: string | null];
  'sync': [];
}>();

const isEditing = ref(false);
const inputUrl = ref('');
const showReadme = ref(false);

function startEdit(): void {
  inputUrl.value = props.repoUrl || '';
  isEditing.value = true;
}

function cancelEdit(): void {
  isEditing.value = false;
  inputUrl.value = '';
}

async function saveUrl(): Promise<void> {
  const url = inputUrl.value.trim();
  if (!url) {
    emit('update:repoUrl', null);
    isEditing.value = false;
    return;
  }

  try {
    new URL(url);
    if (!url.includes('gitee.com')) {
      ElMessage.warning('请输入 Gitee 仓库地址');
      return;
    }
  } catch {
    ElMessage.warning('请输入有效的 URL 地址');
    return;
  }

  emit('update:repoUrl', url);
  isEditing.value = false;
}

async function clearUrl(): Promise<void> {
  try {
    await ElMessageBox.confirm('确定要清除仓库地址吗？同步数据也将被清除。', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    emit('update:repoUrl', null);
  } catch {}
}

function handleSync(): void {
  emit('sync');
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return date.toLocaleDateString('zh-CN');
}

const recentCommits = computed<GiteeCommit[]>(() => {
  return props.repoSyncData?.commits?.slice(0, 5) ?? [];
});

const readmeContent = computed<string>(() => {
  return props.repoSyncData?.readme ?? '';
});

const syncedAt = computed<string>(() => {
  if (!props.repoSyncData?.syncedAt) return '';
  return formatTime(props.repoSyncData.syncedAt);
});
</script>

<template>
  <el-card class="repo-url-panel" shadow="never">
    <template #header>
      <div class="card-header">
        <div class="title">
          <el-icon><Link /></el-icon>
          <span>仓库地址</span>
        </div>
        <div class="header-actions">
          <el-button
            v-if="repoUrl && !isEditing"
            type="primary"
            size="small"
            :loading="syncing"
            @click="handleSync"
          >
            <el-icon><Refresh /></el-icon>同步
          </el-button>
          <el-button
            v-if="!isEditing"
            size="small"
            circle
            @click="startEdit"
          >
            <el-icon><Edit /></el-icon>
          </el-button>
        </div>
      </div>
    </template>

    <div class="repo-content">
      <div v-if="isEditing" class="repo-edit-section">
        <el-input
          v-model="inputUrl"
          placeholder="https://gitee.com/owner/repo"
          size="small"
          clearable
          @keyup.enter="saveUrl"
        />
        <div class="edit-actions">
          <el-button size="small" type="primary" @click="saveUrl">
            <el-icon><Check /></el-icon>保存
          </el-button>
          <el-button size="small" @click="cancelEdit">取消</el-button>
        </div>
      </div>

      <div v-else-if="repoUrl" class="repo-display">
        <div class="repo-link-row">
          <a :href="repoUrl" target="_blank" rel="noopener" class="repo-link">{{ repoUrl }}</a>
          <el-button size="small" circle type="danger" plain @click="clearUrl">
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>

        <div v-if="syncedAt" class="sync-info">
          <el-icon><Clock /></el-icon>
          <span>上次同步：{{ syncedAt }}</span>
          <span v-if="repoSyncData" class="commit-count">（{{ repoSyncData.commitCount }} 次提交）</span>
        </div>

        <div v-if="recentCommits.length > 0" class="commits-section">
          <div class="section-label">
            <el-icon><Clock /></el-icon>
            <span>最近提交</span>
          </div>
          <div class="commit-list">
            <div v-for="commit in recentCommits" :key="commit.sha" class="commit-item">
              <span class="commit-sha">{{ commit.sha }}</span>
              <span class="commit-msg">{{ commit.message }}</span>
              <span class="commit-time">{{ formatTime(commit.authorDate) }}</span>
            </div>
          </div>
        </div>

        <div v-if="readmeContent" class="readme-section">
          <div class="section-label clickable" @click="showReadme = !showReadme">
            <el-icon><Document /></el-icon>
            <span>README</span>
            <el-icon class="toggle-icon" :class="{ 'is-expanded': showReadme }">
              <svg viewBox="0 0 1024 1024" width="12" height="12"><path d="M384 192l384 320-384 320z" fill="currentColor"/></svg>
            </el-icon>
          </div>
          <div v-if="showReadme" class="readme-content">
            <pre>{{ readmeContent }}</pre>
          </div>
        </div>
      </div>

      <div v-else class="repo-empty">
        <p>暂未设置仓库地址</p>
        <el-button size="small" type="primary" plain @click="startEdit">
          <el-icon><Link /></el-icon>添加 Gitee 仓库
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.repo-url-panel {
  border-radius: 16px;
  border: 1px solid #e2e8f0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header .title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: #334155;
}

.header-actions {
  display: flex;
  gap: 6px;
  align-items: center;
}

.repo-content {
  min-height: 40px;
}

.repo-edit-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-actions {
  display: flex;
  gap: 6px;
}

.repo-display {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.repo-link-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.repo-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 13px;
  word-break: break-all;
  flex: 1;
}

.repo-link:hover {
  text-decoration: underline;
}

.sync-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #94a3b8;
}

.commit-count {
  color: #64748b;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}

.section-label.clickable {
  cursor: pointer;
  user-select: none;
}

.toggle-icon {
  transition: transform 0.2s;
}

.toggle-icon.is-expanded {
  transform: rotate(90deg);
}

.commit-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.commit-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 12px;
  padding: 4px 0;
  border-bottom: 1px solid #f1f5f9;
}

.commit-item:last-child {
  border-bottom: none;
}

.commit-sha {
  color: #3b82f6;
  font-family: monospace;
  font-size: 11px;
  flex-shrink: 0;
}

.commit-msg {
  color: #334155;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.commit-time {
  color: #94a3b8;
  flex-shrink: 0;
}

.readme-content {
  max-height: 300px;
  overflow: auto;
  background: #f8fafc;
  border-radius: 8px;
  padding: 12px;
}

.readme-content pre {
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
  color: #334155;
  margin: 0;
}

.repo-empty {
  text-align: center;
  padding: 8px 0;
  color: #94a3b8;
  font-size: 13px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
</style>
