<template>
  <div class="statistics">
    <div class="page-header">
      <h2>统计分析</h2>
      <el-button @click="loadAllStats" :loading="store.statsLoading">
        <el-icon><Refresh /></el-icon>刷新数据
      </el-button>
    </div>

    <!-- Overview Cards -->
    <div class="overview-cards" v-loading="store.statsLoading">
      <div class="stat-card">
        <div class="stat-value">{{ store.overviewStats?.totalUsers || 0 }}</div>
        <div class="stat-label">总用户数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ store.overviewStats?.totalTopics || 0 }}</div>
        <div class="stat-label">总选题数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ store.overviewStats?.totalProjects || 0 }}</div>
        <div class="stat-label">总项目数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ store.overviewStats?.totalDocuments || 0 }}</div>
        <div class="stat-label">总文档数</div>
      </div>
    </div>

    <!-- User Stats -->
    <div class="stats-section">
      <h3>用户统计</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>按专业分布</template>
            <div v-if="store.userStats?.byMajor.length">
              <div v-for="item in store.userStats.byMajor" :key="item.major" class="stat-row">
                <span class="stat-name">{{ item.major }}</span>
                <span class="stat-count">{{ item.count }}</span>
              </div>
            </div>
            <el-empty v-else description="暂无数据" :image-size="60" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>按年级分布</template>
            <div v-if="store.userStats?.byGrade.length">
              <div v-for="item in store.userStats.byGrade" :key="item.grade" class="stat-row">
                <span class="stat-name">{{ item.grade }}级</span>
                <span class="stat-count">{{ item.count }}</span>
              </div>
            </div>
            <el-empty v-else description="暂无数据" :image-size="60" />
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- Project Stats -->
    <div class="stats-section">
      <h3>项目统计</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>按领域分布</template>
            <div v-if="store.projectStats?.byDomain.length">
              <div v-for="item in store.projectStats.byDomain" :key="item.domain" class="stat-row">
                <span class="stat-name">{{ item.domain === 'SE' ? '软件工程' : '大数据' }}</span>
                <span class="stat-count">{{ item.count }}</span>
              </div>
            </div>
            <el-empty v-else description="暂无数据" :image-size="60" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>按状态分布</template>
            <div v-if="store.projectStats?.byStatus.length">
              <div v-for="item in store.projectStats.byStatus" :key="item.status" class="stat-row">
                <span class="stat-name">
                  {{ item.status === 'NOT_STARTED' ? '未开始' : item.status === 'IN_PROGRESS' ? '进行中' : '已完成' }}
                </span>
                <span class="stat-count">{{ item.count }}</span>
              </div>
            </div>
            <el-empty v-else description="暂无数据" :image-size="60" />
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover" class="avg-card">
        <div class="avg-content">
          <span class="avg-label">人均项目数</span>
          <span class="avg-value">{{ store.projectStats?.avgProjectsPerUser || 0 }}</span>
        </div>
      </el-card>
    </div>

    <!-- AI Usage Stats -->
    <div class="stats-section">
      <h3>AI 用量统计</h3>

      <!-- Overview Cards -->
      <div class="overview-cards ai-overview">
        <div class="stat-card">
          <div class="stat-value">{{ store.aiUsageStats?.overview.totalRequests || 0 }}</div>
          <div class="stat-label">总请求次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ formatTokens(store.aiUsageStats?.overview.totalPromptTokens || 0) }}</div>
          <div class="stat-label">Prompt Tokens</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ formatTokens(store.aiUsageStats?.overview.totalCompletionTokens || 0) }}</div>
          <div class="stat-label">Completion Tokens</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ formatTokens(store.aiUsageStats?.overview.totalTokens || 0) }}</div>
          <div class="stat-label">总 Token 消耗</div>
        </div>
      </div>

      <!-- Success/Error/Timeout -->
      <el-row :gutter="20" class="ai-status-row">
        <el-col :span="8">
          <el-card shadow="hover" class="status-card success">
            <div class="status-value">{{ store.aiUsageStats?.overview.successRequests || 0 }}</div>
            <div class="status-label">成功请求</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="status-card error">
            <div class="status-value">{{ store.aiUsageStats?.overview.errorRequests || 0 }}</div>
            <div class="status-label">失败请求</div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover" class="status-card timeout">
            <div class="status-value">{{ store.aiUsageStats?.overview.timeoutRequests || 0 }}</div>
            <div class="status-label">超时请求</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- User Usage Ranking -->
      <el-card shadow="hover" class="ai-card">
        <template #header>用户用量排行（Top 50）</template>
        <el-table
          :data="store.aiUsageStats?.userUsage || []"
          style="width: 100%"
          size="small"
          v-loading="store.statsLoading"
        >
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="studentId" label="学号" width="140" />
          <el-table-column prop="requestCount" label="请求次数" width="100" sortable />
          <el-table-column prop="promptTokens" label="Prompt Tokens" width="140" sortable>
            <template #default="scope">{{ formatTokens(scope.row.promptTokens) }}</template>
          </el-table-column>
          <el-table-column prop="completionTokens" label="Completion Tokens" width="160" sortable>
            <template #default="scope">{{ formatTokens(scope.row.completionTokens) }}</template>
          </el-table-column>
          <el-table-column prop="totalTokens" label="总 Tokens" width="140" sortable>
            <template #default="scope">{{ formatTokens(scope.row.totalTokens) }}</template>
          </el-table-column>
        </el-table>
        <el-empty v-if="!store.aiUsageStats?.userUsage.length" description="暂无数据" :image-size="60" />
      </el-card>

      <!-- DocType & Operation Distribution -->
      <el-row :gutter="20" class="ai-distribution-row">
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>按文档类型分布</template>
            <el-table :data="store.aiUsageStats?.docTypeUsage || []" size="small">
              <el-table-column prop="docType" label="文档类型" />
              <el-table-column prop="requestCount" label="请求数" width="90" />
              <el-table-column prop="totalTokens" label="Tokens" width="120">
                <template #default="scope">{{ formatTokens(scope.row.totalTokens) }}</template>
              </el-table-column>
            </el-table>
            <el-empty v-if="!store.aiUsageStats?.docTypeUsage.length" description="暂无数据" :image-size="60" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>按操作类型分布</template>
            <el-table :data="store.aiUsageStats?.operationUsage || []" size="small">
              <el-table-column prop="operation" label="操作类型" />
              <el-table-column prop="requestCount" label="请求数" width="90" />
              <el-table-column prop="totalTokens" label="Tokens" width="120">
                <template #default="scope">{{ formatTokens(scope.row.totalTokens) }}</template>
              </el-table-column>
            </el-table>
            <el-empty v-if="!store.aiUsageStats?.operationUsage.length" description="暂无数据" :image-size="60" />
          </el-card>
        </el-col>
      </el-row>

      <!-- Recent Failed Requests -->
      <el-card shadow="hover" class="ai-card">
        <template #header>
          <span>最近失败请求（最近 50 条）</span>
        </template>
        <el-table
          :data="store.aiUsageStats?.recentFailedRequests || []"
          style="width: 100%"
          size="small"
        >
          <el-table-column prop="createdAt" label="时间" width="180">
            <template #default="scope">{{ formatDate(scope.row.createdAt) }}</template>
          </el-table-column>
          <el-table-column prop="name" label="用户" width="120" />
          <el-table-column prop="studentId" label="学号" width="140" />
          <el-table-column prop="operation" label="操作" width="140" />
          <el-table-column prop="docType" label="文档类型" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="scope.row.status === 'timeout' ? 'warning' : 'danger'" size="small">
                {{ scope.row.status === 'timeout' ? '超时' : '失败' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="errorMessage" label="错误信息" show-overflow-tooltip />
        </el-table>
        <el-empty v-if="!store.aiUsageStats?.recentFailedRequests.length" description="暂无失败记录" :image-size="60" />
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { Refresh } from '@element-plus/icons-vue';

const store = useAdminStore();

function formatTokens(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + '万';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

async function loadAllStats() {
  await Promise.all([
    store.loadOverviewStats(),
    store.loadUserStats(),
    store.loadProjectStats(),
    store.loadAiUsageStats()
  ]);
}

onMounted(() => {
  loadAllStats();
});
</script>

<style scoped>
.statistics {
  background: white;
  border-radius: var(--radius-md);
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-main);
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  padding: 24px;
  border-radius: 12px;
  background: white;
  border: 1px solid var(--border-color);
  text-align: center;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.1);
}

.stat-value {
  font-size: 36px;
  font-weight: 700;
  color: var(--primary-color);
  line-height: 1.2;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 8px;
}

.stats-section {
  margin-bottom: 24px;
}

.stats-section h3 {
  font-size: 16px;
  color: var(--text-main);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border-color);
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed var(--border-color);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-name {
  font-size: 14px;
  color: var(--text-main);
}

.stat-count {
  font-weight: 600;
  color: var(--primary-color);
}

.avg-card {
  margin-top: 16px;
}

.avg-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.avg-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.avg-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

/* AI Usage Stats Styles */
.ai-overview {
  margin-bottom: 20px;
}

.ai-status-row {
  margin-bottom: 20px;
}

.status-card {
  text-align: center;
  padding: 16px;
}

.status-card.success .status-value {
  color: #67c23a;
}

.status-card.error .status-value {
  color: #f56c6c;
}

.status-card.timeout .status-value {
  color: #e6a23c;
}

.status-value {
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.status-label {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 6px;
}

.ai-card {
  margin-bottom: 20px;
}

.ai-distribution-row {
  margin-bottom: 20px;
}
</style>
