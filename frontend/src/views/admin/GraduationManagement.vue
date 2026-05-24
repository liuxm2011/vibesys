<template>
  <div class="graduation-management">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- Tab 1: Topic overview -->
      <el-tab-pane label="选题概况" name="topics">
        <div class="tab-toolbar">
          <el-tag type="info">共 {{ thesisTopics.length }} 个题目</el-tag>
          <el-tag type="danger">已锁定 {{ lockedCount }} 个</el-tag>
          <el-tag type="success">剩余 {{ thesisTopics.length - lockedCount }} 个</el-tag>
          <el-select
            v-model="topicCategoryFilter"
            placeholder="按分类筛选"
            clearable
            style="width: 200px; margin-left: auto"
          >
            <el-option v-for="c in topicCategories" :key="c" :label="c" :value="c" />
          </el-select>
        </div>

        <el-table :data="filteredTopics" v-loading="topicsLoading" stripe>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="category" label="分类" width="160" />
          <el-table-column prop="datasetName" label="数据集" width="180" />
          <el-table-column prop="title" label="毕业设计题目" min-width="260" />
          <el-table-column prop="datasetSize" label="数据集大小" width="110" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag :type="row.isLocked ? 'danger' : 'success'" size="small">
                {{ row.isLocked ? '已选' : '可选' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="选题学生" min-width="180">
            <template #default="{ row }">
              <template v-if="row.lockedBy">
                <div>{{ row.lockedBy.name }}（{{ row.lockedBy.studentId }}）</div>
                <div class="text-secondary">{{ row.lockedBy.class }}</div>
              </template>
              <span v-else class="text-secondary">—</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- Tab 2: Student selections -->
      <el-tab-pane label="学生选题情况" name="projects">
        <div class="tab-toolbar">
          <el-input
            v-model="projectSearch"
            placeholder="搜索姓名/学号/题目"
            style="width: 280px"
            clearable
            @input="handleSearchInput"
          >
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
          <el-tag type="info" style="margin-left: auto">共 {{ projectTotal }} 条记录</el-tag>
        </div>

        <el-table :data="thesisProjects" v-loading="projectsLoading" stripe>
          <el-table-column label="学生" width="150">
            <template #default="{ row }">
              <div>{{ row.user.name }}</div>
              <div class="text-secondary">{{ row.user.studentId }}</div>
            </template>
          </el-table-column>
          <el-table-column label="班级/年级" width="130">
            <template #default="{ row }">
              <div>{{ row.user.class }}</div>
              <div class="text-secondary">{{ row.user.grade }}</div>
            </template>
          </el-table-column>
          <el-table-column label="毕业设计题目" min-width="240">
            <template #default="{ row }">
              <div>{{ row.topic.title }}</div>
              <el-tag size="small" type="info" style="margin-top: 4px">{{ row.topic.category }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="代码仓库" min-width="180">
            <template #default="{ row }">
              <el-link v-if="row.repoUrl" :href="row.repoUrl" target="_blank" type="primary">
                {{ row.repoUrl }}
              </el-link>
              <span v-else class="text-secondary">未填写</span>
            </template>
          </el-table-column>
          <el-table-column label="部署地址" min-width="180">
            <template #default="{ row }">
              <el-link v-if="row.deployUrl" :href="row.deployUrl" target="_blank" type="success">
                {{ row.deployUrl }}
              </el-link>
              <span v-else class="text-secondary">未填写</span>
            </template>
          </el-table-column>
          <el-table-column label="选题时间" width="120">
            <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
          </el-table-column>
        </el-table>

        <div class="pagination-bar">
          <el-pagination
            v-model:current-page="projectPage"
            :page-size="20"
            :total="projectTotal"
            layout="prev, pager, next, total"
            @current-change="loadProjects"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { adminGetThesisTopics, adminGetThesisProjects } from '@/api/admin.api';

const activeTab = ref('topics');

// Topics tab
const thesisTopics = ref<any[]>([]);
const topicsLoading = ref(false);
const topicCategoryFilter = ref('');

const topicCategories = computed(() =>
  [...new Set(thesisTopics.value.map((t: any) => t.category as string))].sort()
);

const lockedCount = computed(() =>
  thesisTopics.value.filter((t: any) => t.isLocked).length
);

const filteredTopics = computed(() =>
  topicCategoryFilter.value
    ? thesisTopics.value.filter((t: any) => t.category === topicCategoryFilter.value)
    : thesisTopics.value
);

// Projects tab
const thesisProjects = ref<any[]>([]);
const projectsLoading = ref(false);
const projectTotal = ref(0);
const projectPage = ref(1);
const projectSearch = ref('');

let searchTimer: ReturnType<typeof setTimeout> | null = null;

function handleSearchInput() {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    projectPage.value = 1;
    loadProjects();
  }, 300);
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('zh-CN');
}

async function loadTopics() {
  topicsLoading.value = true;
  try {
    thesisTopics.value = await adminGetThesisTopics();
  } finally {
    topicsLoading.value = false;
  }
}

async function loadProjects() {
  projectsLoading.value = true;
  try {
    const result = await adminGetThesisProjects({
      page: projectPage.value,
      pageSize: 20,
      search: projectSearch.value || undefined,
    });
    thesisProjects.value = result.projects;
    projectTotal.value = result.total;
  } finally {
    projectsLoading.value = false;
  }
}

onMounted(() => {
  loadTopics();
  loadProjects();
});
</script>

<style scoped>
.graduation-management {
  padding: 0;
}

.tab-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.pagination-bar {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.text-secondary {
  color: #94a3b8;
  font-size: 12px;
}
</style>
