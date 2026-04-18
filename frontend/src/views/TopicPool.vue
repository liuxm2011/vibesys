<template>
  <div class="topic-pool-container">
    <el-container>
      <!-- Sidebar: Domain filter + Custom topic button -->
      <el-aside width="200px" class="sidebar">
        <el-card class="sidebar-card">
          <template #header>
            <span class="filter-header">领域筛选</span>
          </template>
          <el-radio-group
            v-model="topicStore.selectedDomain"
            @change="handleFilterChange"
            class="filter-group"
          >
            <el-radio-button :value="null">全部</el-radio-button>
            <el-radio-button value="SE">软件工程</el-radio-button>
            <el-radio-button value="BD">大数据</el-radio-button>
          </el-radio-group>
        </el-card>

        <el-button
          type="primary"
          class="custom-topic-btn"
          @click="showCustomDialog = true"
        >
          提交自拟选题
        </el-button>
      </el-aside>

      <!-- Main: Topic table -->
      <el-main class="main-content">
        <el-card>
          <el-table
            :data="topicStore.filteredTopics"
            v-loading="topicStore.loading"
            stripe
            border
            empty-text="暂无选题，系统选题由管理员添加，您也可以提交自拟选题"
          >
            <el-table-column prop="title" label="标题" width="200" show-overflow-tooltip />
            <el-table-column prop="domain" label="领域" width="100">
              <template #default="{ row }">
                <el-tag :type="row.domain === 'SE' ? 'primary' : 'success'">
                  {{ row.domain === 'SE' ? '软件工程' : '大数据' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="type" label="类型" width="100">
              <template #default="{ row }">
                <el-tag :type="row.type === 'SYSTEM' ? '' : 'warning'">
                  {{ row.type === 'SYSTEM' ? '系统' : '自拟' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="描述" show-overflow-tooltip />
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="showDetail(row)">详情</el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="quickCreate(row)"
                  :disabled="projectStore.maxProjectsReached"
                >
                  选择
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>

    <!-- Detail dialog -->
    <TopicDetailDialog
      v-model:visible="showDetailDialog"
      :topic="currentTopic"
      @selected="handleProjectCreated"
    />

    <!-- Custom topic dialog -->
    <CustomTopicDialog
      v-model:visible="showCustomDialog"
      @submitted="handleCustomSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useTopicStore } from '@/stores/topic.store';
import { useProjectStore } from '@/stores/project.store';
import TopicDetailDialog from '@/components/TopicDetailDialog.vue';
import CustomTopicDialog from '@/components/CustomTopicDialog.vue';
import type { Topic, Domain } from '@/types/topic';

const router = useRouter();
const topicStore = useTopicStore();
const projectStore = useProjectStore();

// Dialog visibility
const showDetailDialog = ref(false);
const showCustomDialog = ref(false);
const currentTopic = ref<Topic | null>(null);

// Fetch topics on mount (TOPIC-01)
onMounted(async () => {
  const success = await topicStore.fetchTopics();
  if (!success) {
    ElMessage.error(topicStore.error || '获取选题失败，请刷新页面重试');
  }
  // Also fetch projects to check max limit
  await projectStore.fetchProjects();
});

// TOPIC-02: Domain filter change
function handleFilterChange(domain: Domain | null): void {
  // Filter is handled by store's filteredTopics computed
}

// TOPIC-03: Show topic detail
function showDetail(topic: Topic): void {
  currentTopic.value = topic;
  showDetailDialog.value = true;
}

// TOPIC-04: Quick create project from table row
async function quickCreate(topic: Topic): Promise<void> {
  if (projectStore.maxProjectsReached) {
    ElMessage.warning('已达到项目上限(10个)，请删除现有项目后再创建');
    return;
  }

  const success = await projectStore.createProject(topic.id);
  if (success) {
    ElMessage.success('项目创建成功');
    // Optionally navigate to dashboard
    // router.push('/dashboard');
  } else {
    ElMessage.error(projectStore.error || '创建项目失败');
  }
}

// Handle project created from detail dialog
function handleProjectCreated(): void {
  // Refresh project list
  projectStore.fetchProjects();
}

// TOPIC-05: Handle custom topic submitted
function handleCustomSubmitted(): void {
  // Refresh topic list to show new custom topic
  topicStore.fetchTopics();
}
</script>

<style scoped>
.topic-pool-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.sidebar {
  margin-right: 20px;
}

.sidebar-card {
  margin-bottom: 20px;
}

.filter-header {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-topic-btn {
  width: 100%;
}

.main-content {
  padding: 0;
}
</style>