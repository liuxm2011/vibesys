<template>
  <div class="api-provider-management">
    <div class="page-header">
      <h2>API 服务管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>添加提供商
      </el-button>
    </div>

    <!-- Current active provider indicator -->
    <el-alert
      v-if="activeProvider"
      :title="`当前使用: ${activeProvider.name} (${activeProvider.model})`"
      :type="activeProvider.fromDatabase ? 'success' : 'warning'"
      :description="activeProvider.fromDatabase ? `BaseURL: ${activeProvider.baseURL}` : '使用环境变量配置，切换后需在下方管理'"
      show-icon
      :closable="false"
      class="active-provider-alert"
    />

    <!-- Provider list -->
    <el-table :data="providers" v-loading="loading" stripe style="width: 100%">
      <el-table-column prop="name" label="名称" min-width="140" />
      <el-table-column prop="providerType" label="类型" width="140">
        <template #default="{ row }">
          <el-tag :type="row.providerType === 'minimax' ? 'primary' : 'success'" size="small">
            {{ row.providerType === 'minimax' ? 'MiniMax' : '通用 OpenAI' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="baseURL" label="Base URL" min-width="260" show-overflow-tooltip />
      <el-table-column prop="model" label="模型" width="160" show-overflow-tooltip />
      <el-table-column prop="apiKey" label="API Key" width="160">
        <template #default="{ row }">
          <span class="masked-key">{{ row.apiKey }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-switch
            :model-value="row.isActive"
            @change="(val: boolean) => handleActivate(row.id, val)"
            :loading="activatingId === row.id"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="showEditDialog(row)">编辑</el-button>
          <el-button
            size="small"
            :type="testingId === row.id ? 'warning' : 'default'"
            :loading="testingId === row.id"
            @click="handleTest(row.id)"
          >
            {{ testingId === row.id ? '测试中...' : '测试' }}
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(row)"
            :disabled="row.isActive"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Test result dialog -->
    <el-dialog v-model="testResultVisible" title="连接测试结果" width="500px">
      <el-result
        :icon="testResult?.success ? 'success' : 'error'"
        :title="testResult?.success ? '连接成功' : '连接失败'"
      >
        <template #extra>
          <p class="test-result-message">{{ testResult?.message }}</p>
          <p v-if="testResult" class="test-result-latency">
            延迟: {{ testResult.latencyMs }}ms
          </p>
        </template>
      </el-result>
    </el-dialog>

    <!-- Add/Edit dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑API提供商' : '添加API提供商'"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        label-width="120px"
        label-position="top"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="例如: MiniMax 机房服务、NVIDIA 备用服务" />
        </el-form-item>

        <el-form-item label="提供商类型" prop="providerType">
          <el-radio-group v-model="form.providerType">
            <el-radio value="minimax">MiniMax</el-radio>
            <el-radio value="openai_compatible">通用 OpenAI 兼容</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Base URL" prop="baseURL">
          <el-input v-model="form.baseURL" placeholder="https://api.minimax.chat/v1 或 NVIDIA API endpoint">
            <template #prepend>URL</template>
          </el-input>
        </el-form-item>

        <el-form-item label="模型名称" prop="model">
          <el-input v-model="form.model" placeholder="例如: minimax-m2-7 或 gpt-3.5-turbo">
            <template #prepend>Model</template>
          </el-input>
        </el-form-item>

        <el-form-item label="API Key" prop="apiKey">
          <el-input
            v-model="form.apiKey"
            type="password"
            show-password
            :placeholder="isEditing ? '留空则不修改' : '输入API Key'"
          />
        </el-form-item>

        <el-form-item label="启用">
          <el-switch v-model="form.isActive" />
          <span class="form-hint">启用后该提供商将立即生效，其他提供商将被停用</span>
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="2"
            placeholder="可选：添加备注说明"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saving">
          {{ isEditing ? '保存' : '创建' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import {
  fetchApiProvidersApi,
  createApiProviderApi,
  updateApiProviderApi,
  deleteApiProviderApi,
  activateApiProviderApi,
  testApiProviderApi,
  fetchActiveApiProviderApi,
} from '@/api/admin.api';
import type { ApiProvider, ApiProviderForm, TestConnectionResult, ActiveProviderInfo } from '@/types/admin';

const providers = ref<ApiProvider[]>([]);
const activeProvider = ref<ActiveProviderInfo | null>(null);
const loading = ref(false);
const saving = ref(false);
const activatingId = ref<number | null>(null);
const testingId = ref<number | null>(null);
const dialogVisible = ref(false);
const isEditing = ref(false);
const editingId = ref<number | null>(null);
const testResultVisible = ref(false);
const testResult = ref<TestConnectionResult | null>(null);

const form = reactive<ApiProviderForm>({
  name: '',
  providerType: 'minimax',
  baseURL: '',
  apiKey: '',
  model: '',
  description: '',
  isActive: false,
});

const formRules = {
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  providerType: [{ required: true, message: '请选择提供商类型', trigger: 'change' }],
  baseURL: [{ required: true, message: '请输入Base URL', trigger: 'blur' }],
  apiKey: [{ required: true, message: '请输入API Key', trigger: 'blur' }],
  model: [{ required: true, message: '请输入模型名称', trigger: 'blur' }],
};

async function loadData() {
  loading.value = true;
  try {
    const [providersRes, activeRes] = await Promise.all([
      fetchApiProvidersApi(),
      fetchActiveApiProviderApi(),
    ]);
    providers.value = providersRes.providers;
    activeProvider.value = activeRes.active;
  } catch (e: any) {
    ElMessage.error(e?.message || '加载数据失败');
  } finally {
    loading.value = false;
  }
}

function showAddDialog() {
  isEditing.value = false;
  editingId.value = null;
  form.name = '';
  form.providerType = 'minimax';
  form.baseURL = '';
  form.apiKey = '';
  form.model = '';
  form.description = '';
  form.isActive = false;
  dialogVisible.value = true;
}

function showEditDialog(provider: ApiProvider) {
  isEditing.value = true;
  editingId.value = provider.id;
  form.name = provider.name;
  form.providerType = provider.providerType;
  form.baseURL = provider.baseURL;
  form.apiKey = ''; // Don't show existing key
  form.model = provider.model;
  form.description = provider.description || '';
  form.isActive = provider.isActive;
  dialogVisible.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    if (isEditing.value && editingId.value != null) {
      const updateData: Partial<ApiProviderForm> = {
        name: form.name,
        providerType: form.providerType,
        baseURL: form.baseURL,
        model: form.model,
        description: form.description || '',
        isActive: form.isActive,
      };
      if (form.apiKey) {
        updateData.apiKey = form.apiKey;
      }
      await updateApiProviderApi(editingId.value, updateData);
      ElMessage.success('API提供商已更新');
    } else {
      await createApiProviderApi({
        name: form.name,
        providerType: form.providerType,
        baseURL: form.baseURL,
        apiKey: form.apiKey,
        model: form.model,
        description: form.description || '',
        isActive: form.isActive,
      });
      ElMessage.success('API提供商已创建');
    }
    dialogVisible.value = false;
    await loadData();
  } catch (e: any) {
    ElMessage.error(e?.message || '保存失败');
  } finally {
    saving.value = false;
  }
}

async function handleActivate(id: number, active: boolean) {
  if (!active) return; // Can only activate, not deactivate directly
  activatingId.value = id;
  try {
    const res = await activateApiProviderApi(id);
    ElMessage.success(res.message);
    await loadData();
  } catch (e: any) {
    ElMessage.error(e?.message || '切换失败');
  } finally {
    activatingId.value = null;
  }
}

async function handleDelete(provider: ApiProvider) {
  if (provider.isActive) {
    ElMessage.warning('请先切换至其他提供商再删除当前活跃的提供商');
    return;
  }
  try {
    await ElMessageBox.confirm(
      `确定删除提供商"${provider.name}"吗？`,
      '确认删除',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    );
    await deleteApiProviderApi(provider.id);
    ElMessage.success('已删除');
    await loadData();
  } catch (e: any) {
    if (e !== 'cancel') {
      ElMessage.error(e?.message || '删除失败');
    }
  }
}

async function handleTest(id: number) {
  testingId.value = id;
  try {
    testResult.value = await testApiProviderApi(id);
    testResultVisible.value = true;
  } catch (e: any) {
    ElMessage.error(e?.message || '测试失败');
  } finally {
    testingId.value = null;
  }
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.api-provider-management {
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

.active-provider-alert {
  margin-bottom: 20px;
}

.masked-key {
  font-family: monospace;
  color: var(--text-secondary);
  font-size: 13px;
}

.form-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 8px;
}

.test-result-message {
  font-size: 14px;
  color: var(--text-secondary);
  word-break: break-all;
}

.test-result-latency {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 8px;
}
</style>
