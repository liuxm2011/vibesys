<template>
  <div class="topic-management">
    <div class="page-header">
      <h2>选题管理</h2>
      <div class="header-actions">
        <el-button @click="downloadTemplate">
          <el-icon><Download /></el-icon>下载模板
        </el-button>
        <el-button @click="showImportDialog">
          <el-icon><Upload /></el-icon>导入
        </el-button>
        <el-button type="primary" @click="showCreateDialog">
          <el-icon><Plus /></el-icon>新建选题
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索选题标题"
        clearable
        class="search-input"
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="domainFilter" placeholder="领域筛选" clearable @change="handleFilter">
        <el-option label="全部" value="" />
        <el-option label="软件工程" value="SE" />
        <el-option label="大数据" value="BD" />
      </el-select>
      <el-select v-model="typeFilter" placeholder="类型筛选" clearable @change="handleFilter">
        <el-option label="全部" value="" />
        <el-option label="系统选题" value="SYSTEM" />
        <el-option label="自拟选题" value="CUSTOM" />
      </el-select>
      <el-button @click="refresh">
        <el-icon><Refresh /></el-icon>刷新
      </el-button>
    </div>

    <!-- Topic Table -->
    <el-table :data="store.topics" v-loading="store.topicsLoading" stripe>
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
      <el-table-column label="领域" width="100">
        <template #default="{ row }">
          <el-tag :type="row.domain === 'SE' ? 'primary' : 'warning'" size="small">
            {{ row.domain === 'SE' ? '软件工程' : '大数据' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === 'SYSTEM' ? 'success' : 'info'" size="small">
            {{ row.type === 'SYSTEM' ? '系统' : '自拟' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="技术栈" min-width="150" show-overflow-tooltip>
        <template #default="{ row }">
          {{ (row.techStack || []).join(', ') }}
        </template>
      </el-table-column>
      <el-table-column label="项目引用" width="90" align="center">
        <template #default="{ row }">
          {{ row._count?.projects || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" text @click="showEditDialog(row)">编辑</el-button>
          <el-button
            type="danger"
            size="small"
            text
            @click="handleDelete(row)"
            :disabled="row._count?.projects > 0"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="store.topicPagination.pageSize"
        :total="store.topicPagination.total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- Create/Edit Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑选题' : '新建选题'"
      width="600px"
    >
      <el-form :model="formData" label-position="top" :rules="formRules" ref="formRef">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入选题标题" maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入选题描述" maxlength="500" show-word-limit />
        </el-form-item>
        <el-form-item label="背景">
          <el-input v-model="formData.background" type="textarea" :rows="2" placeholder="选题背景信息（可选）" />
        </el-form-item>
        <el-form-item label="目标">
          <el-input v-model="formData.objectives" type="textarea" :rows="2" placeholder="目标要求（可选）" />
        </el-form-item>
        <el-form-item label="领域" prop="domain">
          <el-radio-group v-model="formData.domain">
            <el-radio value="SE">软件工程</el-radio>
            <el-radio value="BD">大数据</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="技术栈">
          <el-select
            v-model="formData.techStack"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="输入技术栈，按回车添加"
            style="width: 100%"
          >
            <el-option v-for="tech in commonTech" :key="tech" :label="tech" :value="tech" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- Import Dialog -->
    <el-dialog v-model="importDialogVisible" title="批量导入选题" width="500px">
      <el-upload
        drag
        :auto-upload="false"
        :on-change="handleFileSelect"
        :limit="1"
        accept=".xlsx,.xls"
      >
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处，或 <em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">仅支持 Excel 文件 (.xlsx, .xls)</div>
        </template>
      </el-upload>
      <template #footer>
        <el-button @click="importDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleImport" :loading="importing" :disabled="!selectedFile">
          开始导入
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAdminStore } from '@/stores/admin.store';
import { useDebounceFn } from '@vueuse/core';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
import { Search, Refresh, Plus, Download, Upload, UploadFilled } from '@element-plus/icons-vue';
import { downloadTemplateApi } from '@/api/admin.api';

const store = useAdminStore();
const searchKeyword = ref('');
const domainFilter = ref('');
const typeFilter = ref('');
const currentPage = ref(1);
const dialogVisible = ref(false);
const importDialogVisible = ref(false);
const isEdit = ref(false);
const editId = ref(0);
const submitting = ref(false);
const importing = ref(false);
const selectedFile = ref<File | null>(null);
const formRef = ref<FormInstance>();

const commonTech = ['Vue', 'React', 'Angular', 'Node.js', 'Express', 'MySQL', 'MongoDB', 'Redis', 'Python', 'Java', 'Spring Boot', 'Django', 'FastAPI', 'TypeScript', 'Element Plus', 'Tailwind CSS', 'Docker', 'Git'];

const formData = ref({
  title: '',
  description: '',
  background: '',
  objectives: '',
  domain: 'SE' as 'SE' | 'BD',
  techStack: [] as string[]
});

const formRules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }, { min: 2, max: 100, message: '标题长度2-100字符', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }, { min: 10, max: 500, message: '描述长度10-500字符', trigger: 'blur' }],
  domain: [{ required: true, message: '请选择领域', trigger: 'change' }]
};

const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1;
  loadTopics();
}, 300);

function handleSearch() {
  debouncedSearch();
}

function handleFilter() {
  currentPage.value = 1;
  loadTopics();
}

function handlePageChange(page: number) {
  currentPage.value = page;
  loadTopics();
}

async function loadTopics() {
  await store.loadTopics({
    page: currentPage.value,
    search: searchKeyword.value || undefined,
    domain: domainFilter.value || undefined,
    type: typeFilter.value || undefined
  });
}

async function refresh() {
  await loadTopics();
  ElMessage.success('已刷新');
}

function showCreateDialog() {
  isEdit.value = false;
  editId.value = 0;
  formData.value = { title: '', description: '', background: '', objectives: '', domain: 'SE', techStack: [] };
  dialogVisible.value = true;
}

function showEditDialog(row: any) {
  isEdit.value = true;
  editId.value = row.id;
  formData.value = {
    title: row.title,
    description: row.description,
    background: row.background || '',
    objectives: row.objectives || '',
    domain: row.domain,
    techStack: row.techStack || []
  };
  dialogVisible.value = true;
}

async function handleSubmit() {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (!valid) return;

    submitting.value = true;
    try {
      if (isEdit.value) {
        await store.updateTopic(editId.value, formData.value);
        ElMessage.success('选题已更新');
      } else {
        await store.createTopic(formData.value);
        ElMessage.success('选题已创建');
      }
      dialogVisible.value = false;
    } catch (e: any) {
      ElMessage.error(e?.message || '操作失败');
    } finally {
      submitting.value = false;
    }
  });
}

async function handleDelete(row: any) {
  try {
    await ElMessageBox.confirm(`确定要删除选题"${row.title}"吗？此操作不可恢复。`, '确认删除', {
      confirmButtonText: '确认删除',
      cancelButtonText: '取消',
      type: 'warning'
    });

    await store.deleteTopic(row.id);
    ElMessage.success('选题已删除');
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e?.message || '删除失败');
    }
  }
}

function downloadTemplate() {
  downloadTemplateApi();
}

function showImportDialog() {
  selectedFile.value = null;
  importDialogVisible.value = true;
}

function handleFileSelect(file: any) {
  selectedFile.value = file.raw;
}

async function handleImport() {
  if (!selectedFile.value) return;
  importing.value = true;
  try {
    const result = await store.importTopics(selectedFile.value);
    ElMessage.success(`导入完成：成功 ${result.imported} 条，失败 ${result.failed} 条`);
    if (result.errors.length > 0) {
      console.warn('导入错误:', result.errors);
    }
    importDialogVisible.value = false;
  } catch (e: any) {
    ElMessage.error(e?.message || '导入失败');
  } finally {
    importing.value = false;
  }
}

onMounted(() => {
  loadTopics();
});
</script>

<style scoped>
.topic-management {
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
  gap: 8px;
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

.el-icon--upload {
  font-size: 48px;
  color: var(--text-secondary);
}
</style>
