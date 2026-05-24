<template>
  <div class="dataset-preview">
    <div class="preview-header">
      <el-button text @click="router.back()">
        <el-icon><ArrowLeft /></el-icon>返回选题列表
      </el-button>
      <span class="header-title">{{ datasetName }} · 数据集预览</span>
      <div class="header-actions">
        <el-button
          v-if="!isLarge && files.length > 0"
          type="success"
          :loading="downloading"
          @click="downloadZip"
        >
          <el-icon><Download /></el-icon>
          {{ downloading ? `打包中… ${downloadProgress}%` : '下载全部文件' }}
        </el-button>
        <el-tooltip v-else-if="isLarge" content="文件过大，请单独下载各文件" placement="bottom">
          <el-button type="success" disabled>
            <el-icon><Download /></el-icon>下载全部文件
          </el-button>
        </el-tooltip>
      </div>
    </div>

    <div class="preview-body">
      <div class="sidebar">
        <div class="sidebar-section">
          <div class="section-label">📄 数据集说明</div>
          <div class="description-box" v-loading="descLoading">
            <span v-if="description" style="white-space: pre-wrap; word-break: break-word">{{ description }}</span>
            <span v-else-if="!descLoading" class="muted-text">暂无数据集说明</span>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="section-label">📁 文件列表</div>
          <div class="file-list">
            <div v-if="files.length === 0" class="muted-text" style="padding: 10px">文件列表不可用</div>
            <div v-for="file in files" :key="file.name" class="file-item">
              <span class="file-name">{{ file.name }}</span>
              <span class="file-meta">
                {{ formatSize(file.size) }}
                <el-button size="small" link type="primary" @click="downloadSingle(file)">↓</el-button>
              </span>
            </div>
          </div>
          <div v-if="files.length > 0" class="total-size">
            总计 {{ formatSize(totalSize) }} · {{ files.length }} 个文件
          </div>
          <el-alert
            v-if="isLarge"
            type="warning"
            :closable="false"
            style="margin-top: 8px; font-size: 12px"
            description="文件较大，请点击各文件单独下载"
          />
        </div>
      </div>

      <div class="preview-area">
        <div class="section-label">
          📊 数据预览
          <span class="muted-label">· 前 10 行（Range 请求）</span>
        </div>
        <div v-if="csvLoading" v-loading="true" style="min-height: 200px" />
        <el-table
          v-else-if="csvHeaders.length > 0"
          :data="csvRows"
          border
          stripe
          size="small"
          class="csv-table"
          style="width: 100%"
        >
          <el-table-column
            v-for="col in csvHeaders"
            :key="col"
            :prop="col"
            :label="col"
            min-width="120"
            show-overflow-tooltip
          />
        </el-table>
        <el-empty v-else description="此数据集不包含 CSV 文件或暂不支持预览" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ElMessage } from 'element-plus';
import { ArrowLeft, Download } from '@element-plus/icons-vue';
import datasetIndex from '@/data/datasetIndex.json';

const LARGE_THRESHOLD = 50 * 1024 * 1024;
const CSV_RANGE_BYTES = 8192;

const router = useRouter();
const route = useRoute();

const folderUrl = computed(() => {
  const raw = Array.isArray(route.query.url) ? route.query.url[0] : route.query.url;
  return decodeURIComponent(raw || '').replace(/\/$/, '');
});
const datasetName = computed(() => folderUrl.value.split('/').pop() || '数据集');

const files = computed(() => {
  const idx = datasetIndex as Record<string, { name: string; size: number }[]>;
  return idx[folderUrl.value] ?? [];
});
const totalSize = computed(() => files.value.reduce((s, f) => s + f.size, 0));
const isLarge = computed(() => totalSize.value >= LARGE_THRESHOLD);

const description = ref('');
const descLoading = ref(true);
const csvHeaders = ref<string[]>([]);
const csvRows = ref<Record<string, string>[]>([]);
const csvLoading = ref(true);
const downloading = ref(false);
const downloadProgress = ref(0);

function fileUrl(file: { name: string }) {
  return `${folderUrl.value}/${file.name}`;
}

function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  if (bytes >= 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return bytes + ' B';
}

function parseCSV(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return { headers: [], rows: [] };
  const splitLine = (line: string): string[] => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    result.push(cur.trim());
    return result;
  };
  const headers = splitLine(lines[0]);
  const rows = lines.slice(1, 11).map(line => {
    const vals = splitLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
  });
  return { headers, rows };
}

async function loadDescription() {
  descLoading.value = true;
  try {
    const res = await fetch(`${folderUrl.value}/数据集说明.txt`);
    description.value = res.ok ? (await res.text()).trim() : '';
  } catch {
    description.value = '';
  } finally {
    descLoading.value = false;
  }
}

async function loadCSVPreview() {
  csvLoading.value = true;
  try {
    const csvFile = files.value.find(f => f.name.toLowerCase().endsWith('.csv'));
    if (!csvFile) return;
    const res = await fetch(fileUrl(csvFile), {
      headers: { Range: `bytes=0-${CSV_RANGE_BYTES - 1}` }
    });
    if (!res.ok && res.status !== 206) return;
    const text = await res.text();
    const trimmed = res.status === 206 ? text.substring(0, text.lastIndexOf('\n')) : text;
    const { headers, rows } = parseCSV(trimmed);
    csvHeaders.value = headers;
    csvRows.value = rows;
  } catch {
    // leave empty — el-empty shown
  } finally {
    csvLoading.value = false;
  }
}

function downloadSingle(file: { name: string }) {
  window.open(fileUrl(file), '_blank', 'noopener,noreferrer');
}

async function downloadZip() {
  downloading.value = true;
  downloadProgress.value = 0;
  try {
    const zip = new JSZip();
    const total = files.value.length;
    for (let i = 0; i < total; i++) {
      const file = files.value[i];
      const res = await fetch(fileUrl(file));
      if (!res.ok) throw new Error(`下载失败: ${file.name}`);
      zip.file(file.name, await res.blob());
      downloadProgress.value = Math.round(((i + 1) / total) * 90);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadProgress.value = 100;
    saveAs(blob, `${datasetName.value}.zip`);
  } catch (e) {
    ElMessage.error(e instanceof Error ? e.message : '下载失败，请重试');
  } finally {
    downloading.value = false;
    downloadProgress.value = 0;
  }
}

onMounted(() => {
  loadDescription();
  loadCSVPreview();
});
</script>

<style scoped>
.dataset-preview {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f7fa;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px;
  height: 56px;
  background: #18a058;
  color: #fff;
  flex-shrink: 0;
}

.header-title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
}

.preview-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.sidebar {
  width: 280px;
  min-width: 280px;
  background: #fff;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.muted-label {
  font-weight: 400;
  color: #9ca3af;
  text-transform: none;
  letter-spacing: 0;
}

.description-box {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 10px;
  min-height: 80px;
  overflow-wrap: break-word;
  word-break: break-word;
}

.description-box a {
  word-break: break-all;
}

.muted-text {
  color: #9ca3af;
  font-size: 12px;
}

.file-list {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  border-bottom: 1px solid #f3f4f6;
  font-size: 12px;
}

.file-item:last-child {
  border-bottom: none;
}

.file-name {
  color: #374151;
  word-break: break-all;
  flex: 1;
  margin-right: 8px;
}

.file-meta {
  color: #6b7280;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 4px;
}

.total-size {
  font-size: 11px;
  color: #9ca3af;
  text-align: right;
}

.preview-area {
  flex: 1;
  padding: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.csv-table {
  font-size: 12px;
}
</style>
