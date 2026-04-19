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
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { Refresh } from '@element-plus/icons-vue';

const store = useAdminStore();

async function loadAllStats() {
  await Promise.all([
    store.loadOverviewStats(),
    store.loadUserStats(),
    store.loadProjectStats()
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
</style>
