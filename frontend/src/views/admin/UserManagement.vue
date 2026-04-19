<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>添加学生
        </el-button>
        <el-button @click="openImportDialog">
          <el-icon><Upload /></el-icon>批量导入
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索学号或姓名"
        clearable
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="roleFilter" placeholder="角色筛选" clearable @change="handleFilter">
        <el-option label="全部" value="" />
        <el-option label="学生" value="STUDENT" />
        <el-option label="管理员" value="ADMIN" />
      </el-select>
      <el-select v-model="statusFilter" placeholder="状态筛选" clearable @change="handleFilter">
        <el-option label="全部" value="" />
        <el-option label="正常" value="ACTIVE" />
        <el-option label="已封禁" value="BANNED" />
      </el-select>
      <el-button @click="refresh">
        <el-icon><Refresh /></el-icon>刷新
      </el-button>
    </div>

    <!-- User Table -->
    <el-table :data="store.users" v-loading="store.usersLoading" stripe>
      <el-table-column prop="studentId" label="学号" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="major" label="专业" width="120" />
      <el-table-column prop="grade" label="年级" width="80" />
      <el-table-column prop="class" label="班级" width="80" />
      <el-table-column label="角色" width="100">
        <template #default="{ row }">
          <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'info'" size="small">
            {{ row.role === 'ADMIN' ? '管理员' : '学生' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'ACTIVE' ? 'success' : 'danger'" size="small">
            {{ row.status === 'ACTIVE' ? '正常' : '已封禁' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="projectCount" label="项目数" width="80" align="center" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button
            v-if="row.status === 'ACTIVE' && row.role !== 'ADMIN'"
            type="danger"
            size="small"
            text
            @click="handleToggleStatus(row)"
          >
            封禁
          </el-button>
          <el-button
            v-else-if="row.status === 'BANNED'"
            type="success"
            size="small"
            text
            @click="handleToggleStatus(row)"
          >
            解封
          </el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="store.userPagination.pageSize"
        :total="store.userPagination.total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- Add Student Dialog -->
    <el-dialog v-model="addDialogVisible" title="添加学生" width="500px">
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-position="top">
        <el-form-item label="学号" prop="studentId">
          <el-input v-model="addForm.studentId" placeholder="请输入学号（如231322083）" @blur="validateStudentId" />
          <div v-if="derivedInfo.major" class="derived-info">
            <el-tag type="success" size="small">专业：{{ derivedInfo.major }}</el-tag>
            <el-tag type="success" size="small">年级：{{ derivedInfo.grade }}</el-tag>
          </div>
          <div v-if="studentIdError" class="error-text">{{ studentIdError }}</div>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入姓名" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="addForm.class" placeholder="请输入班级（可选）" maxlength="10" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddStudent" :loading="addLoading">确定</el-button>
      </template>
    </el-dialog>

    <!-- Import Dialog -->
    <el-dialog v-model="importDialogVisible" title="批量导入学生" width="600px">
      <div class="import-tip">
        <p>请先下载模板，填写学生信息后上传Excel文件</p>
        <el-button type="primary" link @click="downloadTemplate">
          <el-icon><Download /></el-icon>下载学生导入模板
        </el-button>
      </div>
      <el-upload
        drag
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1"
        accept=".xlsx,.xls"
        ref="uploadRef"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">仅支持 .xlsx 和 .xls 格式的Excel文件</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImport" :loading="importLoading" :disabled="!importFile">
          开始导入
        </el-button>
      </template>
    </el-dialog>

    <!-- Import Result Dialog -->
    <el-dialog v-model="resultDialogVisible" title="导入结果" width="600px">
      <el-alert
        :title="`成功导入 ${importResult.imported} 个学生，失败 ${importResult.failed} 个`"
        :type="importResult.failed > 0 ? 'warning' : 'success'"
        :closable="false"
        show-icon
      />
      <div v-if="importResult.errors.length > 0" class="error-list">
        <h4>错误详情：</h4>
        <el-table :data="importResult.errors" stripe max-height="300">
          <el-table-column prop="row" label="行号" width="80" />
          <el-table-column prop="reason" label="错误原因" />
        </el-table>
      </div>
      <template #footer>
        <el-button type="primary" @click="resultDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { useDebounceFn } from '@vueuse/core';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadInstance, type UploadFile } from 'element-plus';
import { Search, Refresh, Plus, Upload, Download, UploadFilled } from '@element-plus/icons-vue';
import { downloadStudentTemplateApi } from '@/api/admin.api';
import type { ImportResult } from '@/types/admin';

const store = useAdminStore();
const searchKeyword = ref('');
const roleFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);

// Add student dialog
const addDialogVisible = ref(false);
const addFormRef = ref<FormInstance>();
const addLoading = ref(false);
const studentIdError = ref('');
const derivedInfo = reactive({ major: '', grade: '' });
const addForm = reactive({ studentId: '', name: '', class: '' });

const addRules: FormRules = {
  studentId: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { min: 9, max: 9, message: '学号长度为9位', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度2-20字符', trigger: 'blur' }
  ]
};

// Import dialog
const importDialogVisible = ref(false);
const uploadRef = ref<UploadInstance>();
const importFile = ref<File | null>(null);
const importLoading = ref(false);

// Result dialog
const resultDialogVisible = ref(false);
const importResult = ref<ImportResult>({ success: false, imported: 0, failed: 0, errors: [] });

const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1;
  loadUsers();
}, 300);

function handleSearch() {
  debouncedSearch();
}

function handleFilter() {
  currentPage.value = 1;
  loadUsers();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadUsers();
}

async function loadUsers() {
  await store.loadUsers({
    page: currentPage.value,
    search: searchKeyword.value || undefined,
    role: roleFilter.value || undefined,
    status: statusFilter.value || undefined
  });
}

async function refresh() {
  await loadUsers();
  ElMessage.success('已刷新');
}

async function handleToggleStatus(row: any) {
  const action = row.status === 'ACTIVE' ? '封禁' : '解封';
  const confirmMsg = row.status === 'ACTIVE'
    ? `确定要封禁用户"${row.name}"吗？封禁后该用户将无法登录。`
    : `确定要解封用户"${row.name}"吗？`;

  try {
    await ElMessageBox.confirm(confirmMsg, `确认${action}`, {
      confirmButtonText: `确认${action}`,
      cancelButtonText: '取消',
      type: row.status === 'ACTIVE' ? 'warning' : 'success'
    });

    await store.updateUserStatus(row.id, row.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE');
    ElMessage.success(`${action}成功`);
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e?.message || '操作失败');
    }
  }
}

// Validate student ID and derive info
function validateStudentId() {
  const studentId = addForm.studentId;
  studentIdError.value = '';
  derivedInfo.major = '';
  derivedInfo.grade = '';

  if (!studentId) return;

  // Validate format: 23(11|13) + 5 digits
  const regex = /^23(11|13)\d{5}$/;
  if (!regex.test(studentId)) {
    studentIdError.value = '学号格式错误，应为2311xxxxx或2313xxxxx';
    return;
  }

  // Derive major and grade
  const majorCode = studentId.substring(2, 4);
  const gradeCode = studentId.substring(4, 6);

  derivedInfo.major = majorCode === '11' ? '软件工程' : '大数据';
  derivedInfo.grade = `20${gradeCode}级`;
}

// Open add dialog
function openAddDialog() {
  addForm.studentId = '';
  addForm.name = '';
  addForm.class = '';
  studentIdError.value = '';
  derivedInfo.major = '';
  derivedInfo.grade = '';
  addDialogVisible.value = true;
}

// Add student
async function handleAddStudent() {
  if (!addFormRef.value) return;

  if (studentIdError.value) {
    ElMessage.error(studentIdError.value);
    return;
  }

  try {
    await addFormRef.value.validate();
    addLoading.value = true;

    await store.createStudent({
      studentId: addForm.studentId,
      name: addForm.name,
      class: addForm.class || undefined
    });

    ElMessage.success('学生添加成功');
    addDialogVisible.value = false;
    currentPage.value = 1;
    loadUsers();
  } catch (e: any) {
    if (e?.message) {
      ElMessage.error(e.message);
    }
  } finally {
    addLoading.value = false;
  }
}

// Open import dialog
function openImportDialog() {
  importFile.value = null;
  importDialogVisible.value = true;
  if (uploadRef.value) {
    uploadRef.value.clearFiles();
  }
}

// Download template
function downloadTemplate() {
  downloadStudentTemplateApi();
}

// Handle file change
function handleFileChange(uploadFile: UploadFile) {
  if (uploadFile.raw) {
    importFile.value = uploadFile.raw;
  }
}

// Import students
async function handleImport() {
  if (!importFile.value) {
    ElMessage.warning('请先选择文件');
    return;
  }

  importLoading.value = true;
  try {
    const result = await store.importStudents(importFile.value);
    importResult.value = result;
    importDialogVisible.value = false;
    resultDialogVisible.value = true;
    currentPage.value = 1;
    loadUsers();
  } catch (e: any) {
    ElMessage.error(e?.message || '导入失败');
  } finally {
    importLoading.value = false;
  }
}

onMounted(() => {
  loadUsers();
});
</script>

<style scoped>
.user-management {
  background: white;
  border-radius: var(--radius-md);
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: var(--text-main);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  width: 240px;
}

.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.derived-info {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.error-text {
  color: var(--el-color-danger);
  font-size: 12px;
  margin-top: 4px;
}

.import-tip {
  margin-bottom: 20px;
  color: var(--text-secondary);
}

.import-tip p {
  margin-bottom: 8px;
}

.error-list {
  margin-top: 16px;
}

.error-list h4 {
  margin-bottom: 12px;
  color: var(--el-color-warning);
}
</style>