<template>
  <div class="deploy-url-panel">
    <div class="panel-header">
      <span class="panel-title">访问地址</span>
      <el-button v-if="!isEditing" size="small" text @click="startEdit">
        {{ deployUrl ? '修改' : '填写' }}
      </el-button>
    </div>

    <template v-if="isEditing">
      <el-input
        v-model="inputUrl"
        placeholder="例：www.xxx.com 或 http://192.168.1.1:8080"
        size="small"
        clearable
        @keyup.enter="saveUrl"
      />
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      <div class="edit-actions">
        <el-button size="small" type="primary" @click="saveUrl">保存</el-button>
        <el-button size="small" @click="cancelEdit">取消</el-button>
      </div>
    </template>

    <template v-else>
      <div v-if="deployUrl" class="url-display">
        <a :href="normalizeUrl(deployUrl)" target="_blank" rel="noopener" class="url-link">
          {{ deployUrl }}
        </a>
        <el-button size="small" text type="danger" @click="handleClear">清除</el-button>
      </div>
      <div v-else class="no-url">未填写</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { ElMessageBox } from 'element-plus';

const props = defineProps<{
  deployUrl: string | null;
}>();
const emit = defineEmits<{
  (e: 'update:deployUrl', value: string | null): void;
}>();

const isEditing = ref(false);
const inputUrl = ref('');
const errorMsg = ref('');

function startEdit() {
  inputUrl.value = props.deployUrl ?? '';
  errorMsg.value = '';
  isEditing.value = true;
}

function cancelEdit() {
  isEditing.value = false;
  errorMsg.value = '';
}

function saveUrl() {
  const trimmed = inputUrl.value.trim();
  if (!trimmed) {
    errorMsg.value = '请输入访问地址';
    return;
  }
  errorMsg.value = '';
  isEditing.value = false;
  emit('update:deployUrl', trimmed);
}

async function handleClear() {
  await ElMessageBox.confirm('确定清除访问地址吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  });
  emit('update:deployUrl', null);
}

function normalizeUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  return `http://${url}`;
}

watch(() => props.deployUrl, () => {
  if (!isEditing.value) inputUrl.value = props.deployUrl ?? '';
});
</script>

<style scoped>
.deploy-url-panel {
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.edit-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.error-msg {
  color: #ef4444;
  font-size: 12px;
  margin-top: 4px;
}

.url-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.url-link {
  font-size: 13px;
  color: #3b82f6;
  text-decoration: none;
  word-break: break-all;
}

.url-link:hover {
  text-decoration: underline;
}

.no-url {
  color: #94a3b8;
  font-size: 13px;
}
</style>
