<template>
  <div class="graduation-management">
    <div class="config-card">
      <div class="config-row">
        <div class="config-label">
          <span class="config-title">毕业设计选题开关</span>
          <span class="config-desc">关闭后，学生将无法进入毕业设计模块（管理员不受影响）</span>
        </div>
        <el-switch
          v-model="graduationEnabled"
          active-text="已开放"
          inactive-text="未开放"
          :loading="switchLoading"
          @change="handleToggleGraduation"
        />
      </div>
      <div class="config-row" style="margin-top: 12px">
        <div class="config-label">
          <span class="config-title">白名单学号</span>
          <span class="config-desc">不受开关影响的学号，多个学号用英文逗号分隔</span>
        </div>
        <div class="config-input-group">
          <el-input
            v-model="whitelistText"
            placeholder="如: 231311111,231312222"
            style="width: 320px"
            :disabled="switchLoading"
          />
          <el-button type="primary" :loading="whitelistSaving" @click="handleSaveWhitelist">保存白名单</el-button>
        </div>
      </div>
    </div>

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
import { ElMessage } from 'element-plus';
import { adminGetThesisTopics, adminGetThesisProjects } from '@/api/admin.api';
import { useAdminStore } from '@/stores/admin.store';

const adminStore = useAdminStore();
const activeTab = ref('topics');

// Graduation config
const graduationEnabled = ref(false);
const switchLoading = ref(false);
const whitelistText = ref('');
const whitelistSaving = ref(false);

async function loadGraduationConfig() {
  switchLoading.value = true;
  try {
    await adminStore.loadGraduationEnabled();
    graduationEnabled.value = adminStore.graduationEnabled?.value === 'true';
  } finally {
    switchLoading.value = false;
  }
  try {
    await adminStore.loadGraduationWhitelist();
    whitelistText.value = adminStore.graduationWhitelist?.value || '';
  } catch {
    // ignore whitelist load error
  }
}

async function handleToggleGraduation(val: boolean) {
  switchLoading.value = true;
  try {
    await adminStore.saveGraduationEnabled(val ? 'true' : 'false');
    ElMessage.success(val ? '毕业设计选题已开放' : '毕业设计选题已关闭');
  } catch (e: any) {
    graduationEnabled.value = !val;
    ElMessage.error(e?.message || '操作失败');
  } finally {
    switchLoading.value = false;
  }
}

async function handleSaveWhitelist() {
  whitelistSaving.value = true;
  try {
    await adminStore.saveGraduationWhitelist(whitelistText.value);
    ElMessage.success('白名单已保存');
  } catch (e: any) {
    ElMessage.error(e?.message || '保存白名单失败');
  } finally {
    whitelistSaving.value = false;
  }
}

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
  loadGraduationConfig();
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

.config-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}

.config-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.config-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.config-desc {
  font-size: 12px;
  color: #94a3b8;
}

.config-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>
