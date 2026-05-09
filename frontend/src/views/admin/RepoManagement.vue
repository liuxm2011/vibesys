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

    <el-card shadow="never" v-loading="loading">
      <el-table :data="repos" stripe style="width: 100%" empty-text="暂无学生设置仓库地址">
        <el-table-column prop="studentId" label="学号" width="120" />
        <el-table-column prop="studentName" label="姓名" width="100" />
        <el-table-column prop="major" label="专业" width="140" />
        <el-table-column prop="topicTitle" label="选题名称" min-width="200" show-overflow-tooltip />
        <el-table-column label="仓库地址" min-width="260">
          <template #default="{ row }">
            <a v-if="row.repoUrl" :href="row.repoUrl" target="_blank" rel="noopener" class="repo-link">
              {{ row.repoUrl }}
            </a>
            <span v-else class="no-repo">未设置</span>
          </template>
        </el-table-column>
        <el-table-column label="最后同步" width="160">
          <template #default="{ row }">
            <span v-if="row.syncedAt">{{ formatTime(row.syncedAt) }}</span>
            <span v-else class="no-repo">未同步</span>
          </template>
        </el-table-column>
        <el-table-column prop="commitCount" label="提交数" width="80" align="center" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Refresh, Download } from '@element-plus/icons-vue';
import { fetchProjectReposApi, exportProjectReposApi } from '@/api/admin.api';
import type { ProjectRepoInfo } from '@/types/project';

const repos = ref<ProjectRepoInfo[]>([]);
const loading = ref(false);
const exporting = ref(false);

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
    await exportProjectReposApi();
    ElMessage.success('导出成功');
  } catch (e: any) {
    ElMessage.error(e.message || '导出失败');
  } finally {
    exporting.value = false;
  }
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('zh-CN');
}

onMounted(loadRepos);
</script>

<style scoped>
.repo-management {
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #1e293b;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.repo-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 13px;
}

.repo-link:hover {
  text-decoration: underline;
}

.no-repo {
  color: #94a3b8;
  font-size: 13px;
}
</style>
