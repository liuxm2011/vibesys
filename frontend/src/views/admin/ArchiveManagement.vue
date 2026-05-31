<template>
  <div class="archive-management">
    <!-- 归档操作 -->
    <div class="config-card">
      <div class="config-row">
        <div class="config-label">
          <span class="config-title">归档一个年级</span>
          <span class="config-desc">
            归档后该年级的学生、项目设计、毕业设计将从管理后台所有模块隐藏（数据不删除，可在下方查阅）。
            该年级锁定的毕设题目会释放回题库供下届使用；学生仍可正常登录使用学生端。
          </span>
        </div>
        <div class="config-input-group">
          <el-select
            v-model="selectedGrade"
            placeholder="选择要归档的年级"
            style="width: 220px"
            :disabled="authStore.isViewer"
            no-data-text="暂无可归档的年级"
          >
            <el-option
              v-for="g in activeGrades"
              :key="g.grade"
              :label="`${g.grade}（${g.studentCount} 名学生）`"
              :value="g.grade"
            />
          </el-select>
          <el-button
            type="danger"
            :loading="archiving"
            :disabled="!selectedGrade || authStore.isViewer"
            @click="handleArchive"
          >
            归档此年级
          </el-button>
        </div>
      </div>
    </div>

    <!-- 已归档年级 -->
    <div class="section-title">已归档年级</div>
    <el-table :data="archivedGrades" v-loading="loading" stripe>
      <el-table-column prop="grade" label="年级" width="140" />
      <el-table-column prop="studentCount" label="学生数" width="100" />
      <el-table-column prop="projectCount" label="项目数" width="100" />
      <el-table-column prop="thesisCount" label="毕设选题" width="100" />
      <el-table-column label="归档时间" width="180">
        <template #default="{ row }">{{ formatDateTime(row.archivedAt) }}</template>
      </el-table-column>
      <el-table-column label="操作" min-width="200">
        <template #default="{ row }">
          <el-button size="small" @click="openDetail(row.grade)">查看数据</el-button>
          <el-button
            size="small"
            type="warning"
            :disabled="authStore.isViewer"
            @click="handleUnarchive(row.grade)"
          >
            恢复
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <span class="text-secondary">暂无已归档年级</span>
      </template>
    </el-table>

    <!-- 归档数据查看 -->
    <el-dialog v-model="detailVisible" :title="`归档数据 — ${detailGrade}`" width="900px" top="6vh">
      <el-tabs v-model="detailTab" type="border-card">
        <!-- 学生 -->
        <el-tab-pane label="学生" name="students">
          <div class="tab-toolbar">
            <el-input
              v-model="studentSearch"
              placeholder="搜索学号/姓名"
              style="width: 260px"
              clearable
              @input="onStudentSearch"
            >
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-tag type="info" style="margin-left: auto">共 {{ students.length }} 人</el-tag>
          </div>
          <el-table :data="students" v-loading="studentsLoading" stripe max-height="440">
            <el-table-column prop="studentId" label="学号" width="130" />
            <el-table-column prop="name" label="姓名" width="110" />
            <el-table-column prop="major" label="专业" width="120" />
            <el-table-column prop="class" label="班级" width="110" />
            <el-table-column prop="projectCount" label="项目数" width="90" />
          </el-table>
        </el-tab-pane>

        <!-- 项目设计 -->
        <el-tab-pane label="项目设计" name="projects">
          <div class="tab-toolbar">
            <el-tag type="info" style="margin-left: auto">共 {{ repos.length }} 个项目</el-tag>
          </div>
          <el-table :data="repos" v-loading="reposLoading" stripe max-height="440">
            <el-table-column label="学生" width="150">
              <template #default="{ row }">
                <div>{{ row.studentName }}</div>
                <div class="text-secondary">{{ row.studentId }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="className" label="班级" width="100" />
            <el-table-column prop="topicTitle" label="选题" min-width="200" />
            <el-table-column label="仓库地址" min-width="180">
              <template #default="{ row }">
                <el-link v-if="row.repoUrl" :href="row.repoUrl" target="_blank" type="primary">{{ row.repoUrl }}</el-link>
                <span v-else class="text-secondary">未填写</span>
              </template>
            </el-table-column>
            <el-table-column label="访问地址" min-width="160">
              <template #default="{ row }">
                <el-link v-if="row.deployUrl" :href="row.deployUrl" target="_blank" type="success">{{ row.deployUrl }}</el-link>
                <span v-else class="text-secondary">未填写</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 毕业设计 -->
        <el-tab-pane label="毕业设计" name="thesis">
          <div class="tab-toolbar">
            <el-input
              v-model="thesisSearch"
              placeholder="搜索学号/姓名/题目"
              style="width: 260px"
              clearable
              @input="onThesisSearch"
            >
              <template #prefix><el-icon><Search /></el-icon></template>
            </el-input>
            <el-tag type="info" style="margin-left: auto">共 {{ archivedThesis.length }} 条选题</el-tag>
          </div>
          <el-table :data="archivedThesis" v-loading="thesisLoading" stripe max-height="440">
            <el-table-column label="学生" width="150">
              <template #default="{ row }">
                <div>{{ row.studentName }}</div>
                <div class="text-secondary">{{ row.studentId }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="className" label="班级" width="100" />
            <el-table-column label="毕设题目" min-width="220">
              <template #default="{ row }">
                <div>{{ row.topicTitle }}</div>
                <el-tag size="small" type="info" style="margin-top: 4px">{{ row.topicCategory }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="仓库/访问地址" min-width="180">
              <template #default="{ row }">
                <el-link v-if="row.repoUrl" :href="row.repoUrl" target="_blank" type="primary">{{ row.repoUrl }}</el-link>
                <div v-if="row.deployUrl">
                  <el-link :href="row.deployUrl" target="_blank" type="success">{{ row.deployUrl }}</el-link>
                </div>
                <span v-if="!row.repoUrl && !row.deployUrl" class="text-secondary">未填写</span>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '@/stores/auth.store';
import {
  fetchArchivedGradesApi,
  fetchActiveGradesApi,
  archiveGradeApi,
  unarchiveGradeApi,
  fetchArchivedThesisApi,
  fetchAdminUsersApi,
  fetchProjectReposApi,
  type ArchivedGrade,
  type ActiveGradeOption,
  type ArchivedThesis,
} from '@/api/admin.api';

const authStore = useAuthStore();

const loading = ref(false);
const archiving = ref(false);
const archivedGrades = ref<ArchivedGrade[]>([]);
const activeGrades = ref<ActiveGradeOption[]>([]);
const selectedGrade = ref('');

function formatDateTime(s: string): string {
  return new Date(s).toLocaleString('zh-CN');
}

async function loadOverview() {
  loading.value = true;
  try {
    const [archived, active] = await Promise.all([
      fetchArchivedGradesApi(),
      fetchActiveGradesApi(),
    ]);
    archivedGrades.value = archived.grades;
    activeGrades.value = active.grades;
  } catch (e: any) {
    ElMessage.error(e?.message || '加载归档信息失败');
  } finally {
    loading.value = false;
  }
}

async function handleArchive() {
  const grade = selectedGrade.value;
  if (!grade) return;
  const opt = activeGrades.value.find((g) => g.grade === grade);
  try {
    await ElMessageBox.confirm(
      `确认归档 ${grade}？\n\n` +
        `· 该年级${opt ? ` ${opt.studentCount} 名` : ''}学生及其项目设计、毕业设计将从管理后台所有模块隐藏\n` +
        `· 该年级锁定的毕设题目将释放回题库，供下届学生重新选用\n` +
        `· 毕设选题记录将归档保留，可随时查阅\n` +
        `· 学生仍可正常登录使用学生端\n\n此操作可在“已归档年级”中恢复显示。`,
      '归档确认',
      { confirmButtonText: '确认归档', cancelButtonText: '取消', type: 'warning' }
    );
  } catch {
    return; // 用户取消
  }

  archiving.value = true;
  try {
    const res = await archiveGradeApi(grade);
    ElMessage.success(`${res.message}（学生 ${res.studentCount}，项目 ${res.projectCount}，毕设 ${res.thesisCount}）`);
    selectedGrade.value = '';
    await loadOverview();
  } catch (e: any) {
    ElMessage.error(e?.message || '归档失败');
  } finally {
    archiving.value = false;
  }
}

async function handleUnarchive(grade: string) {
  try {
    await ElMessageBox.confirm(
      `确认恢复 ${grade}？\n\n` +
        `· 该年级的学生与项目设计将重新显示在管理后台\n` +
        `· 注意：毕业设计选题不会自动恢复（题目可能已被下届学生重新选用），其归档快照仍可在此查阅`,
      '恢复确认',
      { confirmButtonText: '确认恢复', cancelButtonText: '取消', type: 'warning' }
    );
  } catch {
    return;
  }
  try {
    const res = await unarchiveGradeApi(grade);
    ElMessage.success(res.message);
    await loadOverview();
  } catch (e: any) {
    ElMessage.error(e?.message || '恢复失败');
  }
}

// ---- 归档数据查看 ----
const detailVisible = ref(false);
const detailGrade = ref('');
const detailTab = ref('students');

const students = ref<any[]>([]);
const studentsLoading = ref(false);
const studentSearch = ref('');

const repos = ref<any[]>([]);
const reposLoading = ref(false);

const archivedThesis = ref<ArchivedThesis[]>([]);
const thesisLoading = ref(false);
const thesisSearch = ref('');

let studentTimer: ReturnType<typeof setTimeout> | null = null;
let thesisTimer: ReturnType<typeof setTimeout> | null = null;

function openDetail(grade: string) {
  detailGrade.value = grade;
  detailTab.value = 'students';
  studentSearch.value = '';
  thesisSearch.value = '';
  detailVisible.value = true;
  loadStudents();
  loadRepos();
  loadThesis();
}

async function loadStudents() {
  studentsLoading.value = true;
  try {
    const res = await fetchAdminUsersApi({
      grade: detailGrade.value,
      search: studentSearch.value || undefined,
      pageSize: 500,
    });
    students.value = res.users;
  } catch (e: any) {
    ElMessage.error(e?.message || '加载学生失败');
  } finally {
    studentsLoading.value = false;
  }
}

async function loadRepos() {
  reposLoading.value = true;
  try {
    const res = await fetchProjectReposApi({ grade: detailGrade.value });
    repos.value = res.repos;
  } catch (e: any) {
    ElMessage.error(e?.message || '加载项目失败');
  } finally {
    reposLoading.value = false;
  }
}

async function loadThesis() {
  thesisLoading.value = true;
  try {
    const res = await fetchArchivedThesisApi(detailGrade.value, thesisSearch.value || '');
    archivedThesis.value = res.projects;
  } catch (e: any) {
    ElMessage.error(e?.message || '加载毕设失败');
  } finally {
    thesisLoading.value = false;
  }
}

function onStudentSearch() {
  if (studentTimer) clearTimeout(studentTimer);
  studentTimer = setTimeout(loadStudents, 300);
}

function onThesisSearch() {
  if (thesisTimer) clearTimeout(thesisTimer);
  thesisTimer = setTimeout(loadThesis, 300);
}

onMounted(loadOverview);
</script>

<style scoped>
.archive-management {
  padding: 0;
}

.config-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
}

.config-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.config-label {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 560px;
}

.config-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.config-desc {
  font-size: 12px;
  color: #94a3b8;
  line-height: 1.6;
}

.config-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.tab-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.text-secondary {
  color: #94a3b8;
  font-size: 12px;
}
</style>
