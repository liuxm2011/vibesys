<template>
  <div class="repo-management">
    <div class="page-header">
      <h2>仓库管理</h2>
      <div class="header-actions">
        <el-button @click="loadRepos" :loading="loading">
          <el-icon><Refresh /></el-icon>刷新
        </el-button>
        <el-button type="primary" @click="handleExport" :loading="exporting">
          <el-icon><Download /></el-icon>导出 Excel
        </el-button>
      </div>
    </div>

    <div class="filter-bar">
      <el-select v-model="majorFilter" placeholder="全部专业" clearable filterable class="filter-select" @change="onMajorChange">
        <el-option v-for="m in majorOptions" :key="m" :label="m" :value="m" />
      </el-select>
      <el-select v-model="classFilter" placeholder="全部班级" clearable filterable class="filter-select">
        <el-option v-for="cls in classOptions" :key="cls" :label="cls" :value="cls" />
      </el-select>
      <el-radio-group v-model="deployFilter">
        <el-radio-button value="">全部</el-radio-button>
        <el-radio-button value="true">已填写访问地址</el-radio-button>
        <el-radio-button value="false">未填写访问地址</el-radio-button>
      </el-radio-group>
      <el-button
        :type="featuredOnly ? 'warning' : 'default'"
        :plain="!featuredOnly"
        class="featured-filter-btn"
        @click="featuredOnly = !featuredOnly"
      >
        <el-icon><StarFilled /></el-icon>仅看优秀
      </el-button>
      <span class="result-count">共 {{ filteredRepos.length }} 条</span>
    </div>

    <el-card shadow="never" v-loading="loading">
      <el-table :data="filteredRepos" stripe style="width: 100%" empty-text="暂无数据" :row-class-name="rowClassName">
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="studentName" label="姓名" width="100" />
        <el-table-column prop="major" label="专业" width="140" />
        <el-table-column prop="className" label="班级" width="110" />
        <el-table-column prop="topicTitle" label="选题名称" min-width="180" show-overflow-tooltip />
        <el-table-column label="仓库地址" min-width="220">
          <template #default="{ row }">
            <a v-if="row.repoUrl" :href="row.repoUrl" target="_blank" rel="noopener" class="url-link">
              {{ row.repoUrl }}
            </a>
            <span v-else class="no-value">未设置</span>
          </template>
        </el-table-column>
        <el-table-column label="访问地址" min-width="220">
          <template #default="{ row }">
            <div class="deploy-cell">
              <a
                v-if="row.deployUrl"
                :href="normalizeUrl(row.deployUrl)"
                target="_blank"
                rel="noopener"
                class="url-link"
              >{{ row.deployUrl }}</a>
              <span v-else class="no-value">未填写</span>
              <el-button size="small" text @click="openEditDialog(row)">编辑</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后同步" width="150">
          <template #default="{ row }">
            <span v-if="row.syncedAt">{{ formatTime(row.syncedAt) }}</span>
            <span v-else class="no-value">未同步</span>
          </template>
        </el-table-column>
        <el-table-column prop="commitCount" label="提交数" width="75" align="center" />
        <el-table-column label="优秀" width="70" align="center" fixed="right">
          <template #default="{ row }">
            <el-button
              text
              circle
              class="star-btn"
              :class="{ 'is-featured': row.isFeatured }"
              :title="row.isFeatured ? '取消优秀标记' : '标记为优秀'"
              @click="toggleFeatured(row)"
            >
              <el-icon :size="18">
                <StarFilled v-if="row.isFeatured" />
                <Star v-else />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="editDialogVisible" title="编辑访问地址" width="480px">
      <div class="edit-dialog-body">
        <div class="student-info">
          {{ editingRow?.studentName }}（{{ editingRow?.studentId }}）· {{ editingRow?.topicTitle }}
        </div>
        <el-input
          v-model="editingUrl"
          placeholder="例：www.xxx.com 或 http://192.168.1.1:8080，留空表示清除"
          clearable
        />
      </div>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="saveDeployUrl">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh, Download, Star, StarFilled } from '@element-plus/icons-vue';
import { fetchProjectReposApi, exportProjectReposApi, adminUpdateDeployUrlApi, adminUpdateFeaturedApi } from '@/api/admin.api';
import type { ProjectRepoInfo } from '@/types/project';

const repos = ref<ProjectRepoInfo[]>([]);
const loading = ref(false);
const exporting = ref(false);
const deployFilter = ref('');
const majorFilter = ref('');
const classFilter = ref('');
const featuredOnly = ref(false);

const editDialogVisible = ref(false);
const editingRow = ref<ProjectRepoInfo | null>(null);
const editingUrl = ref('');
const saving = ref(false);

// 专业选项：全部数据去重
const majorOptions = computed(() =>
  [...new Set(repos.value.map((r) => r.major).filter(Boolean))].sort()
);

// 班级选项：选定专业时仅显示该专业的班级（级联）
const classOptions = computed(() => {
  const pool = majorFilter.value
    ? repos.value.filter((r) => r.major === majorFilter.value)
    : repos.value;
  return [...new Set(pool.map((r) => r.className).filter(Boolean))].sort();
});

// 切换专业时，若已选班级不属于该专业则清空
function onMajorChange(): void {
  if (classFilter.value && !classOptions.value.includes(classFilter.value)) {
    classFilter.value = '';
  }
}

const filteredRepos = computed(() =>
  repos.value.filter((r) => {
    if (majorFilter.value && r.major !== majorFilter.value) return false;
    if (classFilter.value && r.className !== classFilter.value) return false;
    if (deployFilter.value === 'true' && !r.deployUrl) return false;
    if (deployFilter.value === 'false' && r.deployUrl) return false;
    if (featuredOnly.value && !r.isFeatured) return false;
    return true;
  })
);

function rowClassName({ row }: { row: ProjectRepoInfo }): string {
  return row.isFeatured ? 'featured-row' : '';
}

async function toggleFeatured(row: ProjectRepoInfo): Promise<void> {
  const next = !row.isFeatured;
  row.isFeatured = next; // 乐观更新
  try {
    await adminUpdateFeaturedApi(row.projectId, next);
    ElMessage.success(next ? '已标记为优秀' : '已取消优秀标记');
  } catch (e: any) {
    row.isFeatured = !next; // 失败回滚
    ElMessage.error(e.message || '操作失败');
  }
}

async function loadRepos(): Promise<void> {
  loading.value = true;
  try {
    const { repos: data } = await fetchProjectReposApi();
    repos.value = data;
  } catch (e: any) {
    ElMessage.error(e.message || '获取仓库信息失败');
  } finally {
    loading.value = false;
  }
}

async function handleExport(): Promise<void> {
  exporting.value = true;
  try {
    await exportProjectReposApi({
      hasDeployUrl:
        deployFilter.value === 'true' ? true :
        deployFilter.value === 'false' ? false :
        undefined,
      major: majorFilter.value || undefined,
      class: classFilter.value || undefined,
      featured: featuredOnly.value || undefined,
    });
    ElMessage.success('导出成功');
  } catch (e: any) {
    ElMessage.error(e.message || '导出失败');
  } finally {
    exporting.value = false;
  }
}

function openEditDialog(row: ProjectRepoInfo): void {
  editingRow.value = row;
  editingUrl.value = row.deployUrl ?? '';
  editDialogVisible.value = true;
}

async function saveDeployUrl(): Promise<void> {
  if (!editingRow.value) return;
  saving.value = true;
  try {
    const url = editingUrl.value.trim() || null;
    await adminUpdateDeployUrlApi(editingRow.value.projectId, url);
    editingRow.value.deployUrl = url;
    ElMessage.success('访问地址已更新');
    editDialogVisible.value = false;
  } catch (e: any) {
    ElMessage.error(e.message || '更新失败');
  } finally {
    saving.value = false;
  }
}

function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN');
}

onMounted(loadRepos);
</script>

<style scoped>
.repo-management {
  max-width: 1300px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.page-header h2 {
  margin: 0;
  color: #1e293b;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-bar {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.filter-select {
  width: 200px;
}

.result-count {
  color: #64748b;
  font-size: 13px;
  margin-left: auto;
}

.url-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 13px;
  word-break: break-all;
}

.url-link:hover {
  text-decoration: underline;
}

.no-value {
  color: #94a3b8;
  font-size: 13px;
}

.deploy-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}

.edit-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-info {
  font-size: 13px;
  color: #64748b;
}

/* 优秀星标按钮 */
.star-btn {
  color: #cbd5e1;
}
.star-btn:hover {
  color: #f59e0b;
}
.star-btn.is-featured {
  color: #f59e0b;
}

.featured-filter-btn .el-icon {
  margin-right: 4px;
}

/* 优秀行高亮：淡金底色 + 左侧金色竖条，覆盖 stripe 斑马纹 */
.repo-management :deep(.featured-row > td.el-table__cell) {
  background-color: #fffbeb !important;
}
.repo-management :deep(.featured-row:hover > td.el-table__cell) {
  background-color: #fef3c7 !important;
}
.repo-management :deep(.featured-row > td.el-table__cell:first-child) {
  box-shadow: inset 3px 0 0 #f59e0b;
}
</style>
