<template>
  <div class="user-management-container">
    <!-- 顶部统计信息 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card total">
            <div class="stat-icon"><el-icon><User /></el-icon></div>
            <div class="stat-info">
              <div class="stat-label">总用户数</div>
              <div class="stat-value">{{ store.userPagination.total }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card student">
            <div class="stat-icon"><el-icon><School /></el-icon></div>
            <div class="stat-info">
              <div class="stat-label">学生人数</div>
              <div class="stat-value">{{ getStudentCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card active">
            <div class="stat-icon"><el-icon><CircleCheckFilled /></el-icon></div>
            <div class="stat-info">
              <div class="stat-label">正常状态</div>
              <div class="stat-value">{{ getActiveCount }}</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card banned">
            <div class="stat-icon"><el-icon><WarnTriangleFilled /></el-icon></div>
            <div class="stat-info">
              <div class="stat-label">已封禁</div>
              <div class="stat-value">{{ getBannedCount }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 主要操作区 -->
    <div class="main-content-card">
      <div class="toolbar">
        <div class="left-actions">
          <h2 class="section-title">用户列表</h2>
          <div class="filter-group">
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
            <el-select v-model="majorFilter" placeholder="专业" clearable class="filter-select" @change="handleFilter">
              <el-option label="全部专业" value="" />
              <el-option
                v-for="major in store.userMajors"
                :key="major"
                :label="major"
                :value="major"
              />
            </el-select>
            <el-select v-model="statusFilter" placeholder="状态" clearable class="filter-select" @change="handleFilter">
              <el-option label="全部状态" value="" />
              <el-option label="正常" value="ACTIVE" />
              <el-option label="已封禁" value="BANNED" />
            </el-select>
            <el-button @click="refresh" circle>
              <el-icon><Refresh /></el-icon>
            </el-button>
          </div>
        </div>
        <div class="right-actions">
          <el-button-group>
            <el-button type="primary" @click="openAddDialog">
              <el-icon><Plus /></el-icon>添加学生
            </el-button>
            <el-button type="primary" plain @click="openImportDialog">
              <el-icon><Upload /></el-icon>批量导入
            </el-button>
          </el-button-group>
        </div>
      </div>

      <!-- 用户表格 -->
      <div class="table-container">
        <el-table 
          :data="store.users" 
          v-loading="store.usersLoading" 
          border 
          stripe
          highlight-current-row
          header-cell-class-name="table-header"
        >
          <el-table-column prop="studentId" label="学号" width="140">
            <template #default="{ row }">
              <span class="student-id">{{ row.studentId }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名" width="120">
            <template #default="{ row }">
              <span class="user-name">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="组织信息" min-width="220">
            <template #default="{ row }">
              <div class="org-info">
                <el-tag size="small" effect="plain">{{ row.major }}</el-tag>
                <el-tag size="small" type="info" effect="plain">{{ row.grade }}</el-tag>
                <span v-if="row.class" class="class-text">{{ row.class }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="角色" width="110">
            <template #default="{ row }">
              <el-tag 
                :type="row.role === 'ADMIN' ? 'danger' : 'success'" 
                size="small" 
                round
              >
                {{ row.role === 'ADMIN' ? '管理员' : '学生' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="{ row }">
              <el-badge :type="row.status === 'ACTIVE' ? 'success' : 'danger'" is-dot class="status-dot">
                <span :class="['status-text', row.status.toLowerCase()]">
                  {{ row.status === 'ACTIVE' ? '正常' : '封禁' }}
                </span>
              </el-badge>
            </template>
          </el-table-column>
          <el-table-column prop="projectCount" label="项目数" width="90" align="center" sortable>
            <template #default="{ row }">
              <el-link type="primary" :underline="false">{{ row.projectCount || 0 }}</el-link>
            </template>
          </el-table-column>
          <el-table-column label="密码状态" min-width="220">
            <template #default="{ row }">
              <div class="password-state-cell">
                <el-tag :type="row.passwordStatus === 'DEFAULT' ? 'success' : 'info'" size="small" effect="light">
                  {{ row.passwordStatus === 'DEFAULT' ? '默认密码' : '已修改' }}
                </el-tag>
                <span class="password-hint">{{ row.passwordHint }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="170" fixed="right" align="center">
            <template #default="{ row }">
              <div class="action-buttons">
                <el-tooltip content="查看或修改密码" placement="top">
                  <el-button size="small" circle @click="openPasswordDialog(row)">
                    <el-icon><Key /></el-icon>
                  </el-button>
                </el-tooltip>
                
                <el-popconfirm
                  v-if="row.role !== 'ADMIN'"
                  :title="row.status === 'ACTIVE' ? `确定封禁 ${row.name}？` : `确定解封 ${row.name}？`"
                  @confirm="handleToggleStatus(row)"
                >
                  <template #reference>
                    <el-button 
                      :type="row.status === 'ACTIVE' ? 'danger' : 'success'" 
                      size="small" 
                      circle 
                      plain
                    >
                      <el-icon><Lock v-if="row.status === 'ACTIVE'" /><Unlock v-else /></el-icon>
                    </el-button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 分页区 -->
      <div class="pagination-section">
        <span class="total-text">共 {{ store.userPagination.total }} 名用户</span>
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="store.userPagination.pageSize"
          :total="store.userPagination.total"
          layout="prev, pager, next"
          background
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- 添加学生对话框 -->
    <el-dialog v-model="addDialogVisible" title="添加学生账号" width="460px" border-radius="16px">
      <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-position="top">
        <el-form-item label="学号 (Student ID)" prop="studentId">
          <el-input 
            v-model="addForm.studentId" 
            placeholder="请输入9位学号 (如2311...)" 
            @input="validateStudentId"
            maxlength="9"
          >
            <template #prefix><el-icon><Postcard /></el-icon></template>
          </el-input>
          <div v-if="derivedInfo.major" class="derived-banner">
            <div class="banner-item">
              <span class="label">专业分配:</span>
              <span class="value">{{ derivedInfo.major }}</span>
            </div>
            <div class="banner-item">
              <span class="label">所属年级:</span>
              <span class="value">{{ derivedInfo.grade }}</span>
            </div>
          </div>
          <p v-if="studentIdError" class="input-error">{{ studentIdError }}</p>
        </el-form-item>
        
        <el-form-item label="学生姓名 (Full Name)" prop="name">
          <el-input v-model="addForm.name" placeholder="请输入真实姓名">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="班级信息 (Optional)">
          <el-input v-model="addForm.class" placeholder="例如：2班">
            <template #prefix><el-icon><HomeFilled /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-alert
          title="账号创建后，学生初始密码默认为其学号。"
          type="info"
          :closable="false"
          show-icon
        />
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAddStudent" :loading="addLoading" class="submit-btn">
            确认添加
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量导入对话框 -->
    <el-dialog v-model="importDialogVisible" title="批量导入学生" width="540px">
      <div class="import-container">
        <div class="step-card">
          <div class="step-num">1</div>
          <div class="step-body">
            <h4>下载标准模板</h4>
            <p>使用系统预设格式，确保导入数据准确无误。导入后学生初始密码默认为学号。</p>
            <el-button type="primary" link @click="downloadTemplate">
              <el-icon><Download /></el-icon>下载学生导入模板.xlsx
            </el-button>
          </div>
        </div>

        <div class="step-card">
          <div class="step-num">2</div>
          <div class="step-body">
            <h4>上传数据文件</h4>
            <el-upload
              drag
              :auto-upload="false"
              :on-change="handleFileChange"
              :limit="1"
              :on-exceed="handleFileExceed"
              accept=".xlsx,.xls"
              ref="uploadRef"
              class="upload-area"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">拖拽文件到此处或<em>点击上传</em></div>
            </el-upload>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImport" :loading="importLoading" :disabled="!importFile">
          开始批量导入
        </el-button>
      </template>
    </el-dialog>

    <!-- 导入结果对话框 (保持原逻辑但优化样式) -->
    <el-dialog v-model="resultDialogVisible" title="导入任务执行报告" width="560px">
      <div class="result-summary">
        <el-result
          :icon="importResult.failed > 0 ? 'warning' : 'success'"
          :title="importResult.failed > 0 ? '导入完成（存在失败项）' : '全部导入成功'"
          :sub-title="`成功: ${importResult.imported} | 失败: ${importResult.failed}`"
        >
        </el-result>
      </div>
      
      <div v-if="importResult.errors.length > 0" class="error-detail-section">
        <h4 class="error-title">异常条目详情</h4>
        <el-table :data="importResult.errors" stripe height="200" border size="small">
          <el-table-column prop="row" label="Excel行号" width="100" />
          <el-table-column prop="reason" label="失败原因" />
        </el-table>
      </div>
      <template #footer>
        <el-button type="primary" @click="resultDialogVisible = false">完成</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="passwordDialogVisible" title="用户密码管理" width="520px" @closed="resetPasswordDialog">
      <template v-if="selectedUser">
        <el-alert
          :title="`${selectedUser.name}（${selectedUser.studentId}）`"
          :description="passwordInfo?.passwordHint || selectedUser.passwordHint"
          type="info"
          :closable="false"
          show-icon
          class="password-alert"
        />

        <div class="password-panel">
          <div class="panel-block">
            <div class="panel-label">当前可见密码</div>
            <div class="password-preview" :class="{ muted: !passwordInfo?.canRevealPassword }">
              {{ passwordInfo?.revealedPassword || '当前密码已被修改，系统不保存明文；如需使用新密码，请直接重置或改密。' }}
            </div>
          </div>

          <div class="panel-actions">
            <el-button
              type="warning"
              plain
              :loading="passwordActionLoading"
              @click="handleResetPassword"
            >
              重置为默认密码
            </el-button>
          </div>

          <el-divider />

          <div class="panel-block">
            <div class="panel-label">管理员指定新密码</div>
            <el-form
              ref="passwordFormRef"
              :model="passwordForm"
              :rules="passwordRules"
              label-position="top"
              @submit.prevent
            >
              <el-form-item label="新密码" prop="newPassword">
                <el-input
                  v-model="passwordForm.newPassword"
                  type="password"
                  show-password
                  placeholder="请输入 6-32 位新密码"
                />
              </el-form-item>
              <el-form-item label="确认新密码" prop="confirmPassword">
                <el-input
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  show-password
                  placeholder="请再次输入新密码"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">关闭</el-button>
          <el-button
            type="primary"
            :loading="passwordActionLoading"
            @click="handleSetCustomPassword"
          >
            保存新密码
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { useDebounceFn } from '@vueuse/core';
import { ElMessage, type FormInstance, type FormRules, type UploadInstance, type UploadFile } from 'element-plus';
import { 
  Search, Refresh, Plus, Upload, Download, UploadFilled, 
  User, School, CircleCheckFilled, WarnTriangleFilled,
  Key, Lock, Unlock, Postcard, HomeFilled
} from '@element-plus/icons-vue';
import { downloadStudentTemplateApi } from '@/api/admin.api';
import type { AdminUser, ImportResult, UserPasswordInfo } from '@/types/admin';

const store = useAdminStore();
const searchKeyword = ref('');
const majorFilter = ref('');
const statusFilter = ref('');
const currentPage = ref(1);

// 统计信息计算
const getStudentCount = computed(() => store.users.filter(u => u.role === 'STUDENT').length);
const getActiveCount = computed(() => store.users.filter(u => u.status === 'ACTIVE').length);
const getBannedCount = computed(() => store.users.filter(u => u.status === 'BANNED').length);

// 对话框状态
const addDialogVisible = ref(false);
const addFormRef = ref<FormInstance>();
const addLoading = ref(false);
const studentIdError = ref('');
const derivedInfo = reactive({ major: '', grade: '' });
const addForm = reactive({ studentId: '', name: '', class: '' });
const passwordDialogVisible = ref(false);
const passwordFormRef = ref<FormInstance>();
const passwordActionLoading = ref(false);
const selectedUser = ref<AdminUser | null>(null);
const passwordInfo = ref<UserPasswordInfo | null>(null);
const passwordForm = reactive({ newPassword: '', confirmPassword: '' });

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

const passwordRules: FormRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 32, message: '密码长度需为 6-32 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (!value) {
          callback(new Error('请再次输入新密码'));
          return;
        }

        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的新密码不一致'));
          return;
        }

        callback();
      },
      trigger: 'blur'
    }
  ]
};

// 导入状态
const importDialogVisible = ref(false);
const uploadRef = ref<UploadInstance>();
const importFile = ref<File | null>(null);
const importLoading = ref(false);
const templateDownloading = ref(false);

// 结果状态
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
    major: majorFilter.value || undefined,
    status: statusFilter.value || undefined
  });
}

async function refresh() {
  await loadUsers();
  ElMessage.success('数据已更新');
}

async function handleToggleStatus(row: any) {
  const isLocking = row.status === 'ACTIVE';
  try {
    await store.updateUserStatus(row.id, isLocking ? 'BANNED' : 'ACTIVE');
    ElMessage.success(isLocking ? '账号已封禁' : '账号已恢复正常');
  } catch (e: any) {
    ElMessage.error(e?.message || '操作失败');
  }
}

async function openPasswordDialog(row: AdminUser) {
  selectedUser.value = row;
  passwordDialogVisible.value = true;
  passwordActionLoading.value = true;

  try {
    passwordInfo.value = await store.getUserPasswordInfo(row.id);
  } catch (e: any) {
    ElMessage.error(e?.message || '获取密码信息失败');
    passwordInfo.value = {
      userId: row.id,
      name: row.name,
      passwordStatus: row.passwordStatus,
      passwordHint: row.passwordHint,
      revealedPassword: row.revealedPassword,
      canRevealPassword: row.canRevealPassword
    };
  } finally {
    passwordActionLoading.value = false;
  }
}

function resetPasswordDialog() {
  selectedUser.value = null;
  passwordInfo.value = null;
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordFormRef.value?.clearValidate();
}

function validateStudentId() {
  const studentId = addForm.studentId;
  studentIdError.value = '';
  derivedInfo.major = '';
  derivedInfo.grade = '';

  if (!studentId || studentId.length < 4) return;

  const regex = /^23(11|13)\d{0,5}$/;
  if (!regex.test(studentId)) {
    studentIdError.value = '无效学号格式 (应为2311/2313开头)';
    return;
  }

  if (studentId.length >= 4) {
    const majorCode = studentId.substring(2, 4);
    derivedInfo.major = majorCode === '11' ? '软件工程' : '大数据';
    
    if (studentId.length >= 6) {
      const gradeCode = studentId.substring(4, 6);
      derivedInfo.grade = `20${gradeCode}级`;
    }
  }
}

function openAddDialog() {
  addForm.studentId = '';
  addForm.name = '';
  addForm.class = '';
  studentIdError.value = '';
  derivedInfo.major = '';
  derivedInfo.grade = '';
  addDialogVisible.value = true;
}

async function handleAddStudent() {
  if (!addFormRef.value) return;
  if (studentIdError.value) return;

  try {
    await addFormRef.value.validate();
    addLoading.value = true;
    const response = await store.createStudent({
      studentId: addForm.studentId,
      name: addForm.name,
      class: addForm.class || undefined
    });
    ElMessage.success(`新学生账号已创建，初始密码为学号：${response.initialPassword}`);
    addDialogVisible.value = false;
    loadUsers();
  } catch (e: any) {
    if (e?.message) ElMessage.error(e.message);
  } finally {
    addLoading.value = false;
  }
}

function openImportDialog() {
  importFile.value = null;
  importDialogVisible.value = true;
  if (uploadRef.value) uploadRef.value.clearFiles();
}

async function downloadTemplate() {
  if (templateDownloading.value) return;

  templateDownloading.value = true;
  try {
    await downloadStudentTemplateApi();
    ElMessage.success('模板下载已开始');
  } catch (e: any) {
    ElMessage.error(e?.message || '下载模板失败');
  } finally {
    templateDownloading.value = false;
  }
}

function handleFileChange(uploadFile: UploadFile) {
  const rawFile = uploadFile.raw;
  if (!rawFile) {
    return;
  }

  const validationError = validateImportFile(rawFile);
  if (validationError) {
    importFile.value = null;
    uploadRef.value?.clearFiles();
    ElMessage.error(validationError);
    return;
  }

  importFile.value = rawFile;
}

function handleFileExceed(files: File[]) {
  uploadRef.value?.clearFiles();

  const nextFile = files[0];
  if (!nextFile) {
    importFile.value = null;
    return;
  }

  const validationError = validateImportFile(nextFile);
  if (validationError) {
    importFile.value = null;
    ElMessage.error(validationError);
    return;
  }

  importFile.value = nextFile;
  ElMessage.success(`已选择文件：${nextFile.name}`);
}

function validateImportFile(file: File): string | null {
  const isExcelFile = /\.(xlsx|xls)$/i.test(file.name);
  if (!isExcelFile) {
    return '仅支持上传 Excel 文件（.xlsx 或 .xls）';
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return '文件大小不能超过 5MB';
  }

  return null;
}

async function handleImport() {
  if (!importFile.value) return;
  importLoading.value = true;
  try {
    const result = await store.importStudents(importFile.value);
    importResult.value = result;
    importDialogVisible.value = false;
    resultDialogVisible.value = true;
    importFile.value = null;
    uploadRef.value?.clearFiles();
    await loadUsers();
    ElMessage.success(result.defaultPasswordRule || '导入完成，初始密码默认为学号');
  } catch (e: any) {
    ElMessage.error(e?.message || '导入任务执行失败');
  } finally {
    importLoading.value = false;
  }
}

async function handleResetPassword() {
  if (!selectedUser.value) {
    return;
  }

  passwordActionLoading.value = true;
  try {
    const response = await store.updateUserPassword(selectedUser.value.id, {
      action: 'RESET_TO_DEFAULT'
    });
    passwordInfo.value = {
      userId: selectedUser.value.id,
      name: selectedUser.value.name,
      passwordStatus: response.passwordStatus,
      passwordHint: response.passwordHint,
      revealedPassword: response.revealedPassword,
      canRevealPassword: true
    };
    ElMessage.success(`密码已重置，新密码为：${response.revealedPassword}`);
  } catch (e: any) {
    ElMessage.error(e?.message || '重置密码失败');
  } finally {
    passwordActionLoading.value = false;
  }
}

async function handleSetCustomPassword() {
  if (!selectedUser.value || !passwordFormRef.value) {
    return;
  }

  const valid = await passwordFormRef.value.validate().catch(() => false);
  if (!valid) {
    return;
  }

  passwordActionLoading.value = true;
  try {
    const response = await store.updateUserPassword(selectedUser.value.id, {
      action: 'SET_CUSTOM',
      newPassword: passwordForm.newPassword
    });
    passwordInfo.value = {
      userId: selectedUser.value.id,
      name: selectedUser.value.name,
      passwordStatus: response.passwordStatus,
      passwordHint: response.passwordHint,
      revealedPassword: response.revealedPassword,
      canRevealPassword: true
    };
    passwordForm.newPassword = '';
    passwordForm.confirmPassword = '';
    passwordFormRef.value.clearValidate();
    ElMessage.success(`密码修改成功，新密码为：${response.revealedPassword}`);
  } catch (e: any) {
    ElMessage.error(e?.message || '修改密码失败');
  } finally {
    passwordActionLoading.value = false;
  }
}

onMounted(loadUsers);
</script>

<style scoped>
.user-management-container {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 统计卡片样式 */
.stats-overview {
  margin-bottom: 8px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.total .stat-icon { background: #eef2ff; color: #4f46e5; }
.student .stat-icon { background: #ecfdf5; color: #10b981; }
.active .stat-icon { background: #f0fdf4; color: #22c55e; }
.banned .stat-icon { background: #fff1f2; color: #f43f5e; }

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.2;
}

/* 主内容卡片 */
.main-content-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input { width: 220px; }
.filter-select { width: 130px; }

/* 表格定制 */
.table-container {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #f1f5f9;
}

:deep(.table-header) {
  background-color: #f8fafc !important;
  color: #475569 !important;
  font-weight: 700 !important;
}

.student-id {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: #4f46e5;
}

.user-name {
  font-weight: 600;
  color: #1e293b;
}

.org-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.class-text {
  font-size: 13px;
  color: #64748b;
}

.status-dot {
  display: flex;
  align-items: center;
}

.status-text {
  font-size: 13px;
  font-weight: 600;
  margin-left: 4px;
}

.status-text.active { color: #10b981; }
.status-text.banned { color: #ef4444; }

.password-state-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}

.password-hint {
  font-size: 12px;
  line-height: 1.5;
  color: #64748b;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.password-alert {
  margin-bottom: 16px;
}

.password-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.panel-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-label {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.password-preview {
  padding: 14px 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.6;
  word-break: break-all;
}

.password-preview.muted {
  font-family: inherit;
  color: #64748b;
}

.panel-actions {
  display: flex;
  justify-content: flex-start;
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.total-text {
  font-size: 14px;
  color: #64748b;
}

/* 对话框增强 */
.derived-banner {
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.banner-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.banner-item .label { color: #64748b; }
.banner-item .value { color: #10b981; font-weight: 600; }

.input-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.submit-btn {
  padding: 10px 24px;
  font-weight: 600;
}

.import-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
}

.step-num {
  width: 32px;
  height: 32px;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  flex-shrink: 0;
}

.step-body h4 {
  margin: 0 0 4px;
  font-size: 15px;
  color: #1e293b;
}

.step-body p {
  margin: 0 0 12px;
  font-size: 13px;
  color: #64748b;
}

.upload-area {
  width: 100%;
}

.error-detail-section {
  margin-top: 20px;
}

.error-title {
  font-size: 14px;
  color: #ef4444;
  margin-bottom: 12px;
}

:deep(.el-dialog) {
  border-radius: 20px !important;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  margin-right: 0;
}

:deep(.el-input__wrapper) {
  border-radius: 10px;
}
</style>
