# Dataset Preview Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/graduation/dataset` page that shows dataset description, file list, CSV preview (first 10 rows via Range request), and zip download (JSZip client-side for <50MB, individual links for ≥50MB).

**Architecture:** Static `datasetIndex.json` (pre-generated via coscmd, bundled into frontend) drives the file list — no backend changes needed. COS bucket gets CORS rules so `fetch()` can read files directly from the browser. DatasetPreview.vue is a self-contained page component.

**Tech Stack:** Vue 3 + TypeScript, Element Plus, JSZip (already installed), file-saver (already installed), coscmd CLI for index generation.

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Create | `frontend/src/data/datasetIndex.json` | COS folder URL → file list (name + size) |
| Create | `frontend/src/views/graduation/DatasetPreview.vue` | Dataset preview page component |
| Modify | `frontend/src/router/index.ts` | Add `/graduation/dataset` route |
| Modify | `frontend/src/views/graduation/GraduationTopicPool.vue` | `openDataset` → router.push |
| Modify | `.gitignore` | Add `.superpowers/` |

---

## Task 1: Configure COS CORS

COS bucket needs CORS rules so browser `fetch()` can read files (needed for CSV preview + JSZip download).

**Files:** (no code files — COS config only)

- [ ] **Step 1: Write cors.xml**

Create `/tmp/cos-cors.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>https://vibesys.7878.cloud</AllowedOrigin>
    <AllowedOrigin>https://vibesys.pages.dev</AllowedOrigin>
    <AllowedOrigin>http://localhost:5173</AllowedOrigin>
    <AllowedOrigin>http://127.0.0.1:5173</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>Range</AllowedHeader>
    <AllowedHeader>Content-Type</AllowedHeader>
    <AllowedHeader>*</AllowedHeader>
    <ExposeHeader>Content-Range</ExposeHeader>
    <ExposeHeader>Accept-Ranges</ExposeHeader>
    <ExposeHeader>Content-Length</ExposeHeader>
    <MaxAgeSeconds>3600</MaxAgeSeconds>
  </CORSRule>
</CORSConfiguration>
```

- [ ] **Step 2: Apply CORS rules to bucket**

```bash
coscmd -b biyesheji-1258171495 -r ap-guangzhou putcors /tmp/cos-cors.xml
```

Expected: no error output.

- [ ] **Step 3: Verify CORS rules applied**

```bash
coscmd -b biyesheji-1258171495 -r ap-guangzhou getcors
```

Expected: output contains `AllowedOrigin` with `vibesys.7878.cloud`.

---

## Task 2: Generate datasetIndex.json

Pre-generate a static file list index for all 131 datasets from COS.

**Files:**
- Create: `frontend/src/data/datasetIndex.json`

- [ ] **Step 1: Run index generation script**

```bash
python3 << 'EOF'
import subprocess, json, re

BUCKET = "biyesheji-1258171495"
REGION = "ap-guangzhou"
BASE_URL = "https://biyesheji-1258171495.cos.ap-guangzhou.myqcloud.com"
CATEGORIES = ["机器学习-表格数据", "自然语言处理", "计算机视觉"]

index = {}

for cat in CATEGORIES:
    # List subdirectories (datasets) in this category
    result = subprocess.run(
        ["coscmd", "-b", BUCKET, "-r", REGION, "list", f"{cat}/"],
        capture_output=True, text=True
    )
    # Get folder names (DIR entries)
    folders = []
    for line in result.stdout.splitlines():
        if "DIR" in line:
            # Extract path like "机器学习-表格数据/乳腺癌诊断/"
            parts = line.strip().split()
            if parts:
                folders.append(parts[0].rstrip("/"))

    for folder in folders:
        # List files in this folder
        result2 = subprocess.run(
            ["coscmd", "-b", BUCKET, "-r", REGION, "list", f"{folder}/"],
            capture_output=True, text=True
        )
        files = []
        for line in result2.stdout.splitlines():
            if "DIR" in line:
                continue
            parts = line.strip().split()
            if len(parts) >= 2:
                filepath = parts[0]
                size = int(parts[1])
                filename = filepath.split("/")[-1]
                if filename:
                    files.append({"name": filename, "size": size})

        if files:
            key = f"{BASE_URL}/{folder}"
            index[key] = files

print(f"Generated index for {len(index)} datasets")
with open("frontend/src/data/datasetIndex.json", "w", encoding="utf-8") as f:
    json.dump(index, f, ensure_ascii=False, indent=2)
print("Saved to frontend/src/data/datasetIndex.json")
EOF
```

Expected output:
```
Generated index for 131 datasets
Saved to frontend/src/data/datasetIndex.json
```

- [ ] **Step 2: Verify index structure**

```bash
python3 -c "
import json
with open('frontend/src/data/datasetIndex.json') as f:
    d = json.load(f)
print(f'Total datasets: {len(d)}')
first_key = list(d.keys())[0]
print(f'Sample: {first_key}')
print(f'Files: {d[first_key]}')
"
```

Expected: 131 datasets, each with a file list containing name + size.

- [ ] **Step 3: Create data directory if missing and commit**

```bash
git -C /Users/liuxiangmiao/Desktop/vibesys add frontend/src/data/datasetIndex.json
git -C /Users/liuxiangmiao/Desktop/vibesys commit -m "feat: add static dataset file index for 131 thesis datasets"
```

---

## Task 3: Create DatasetPreview.vue

**Files:**
- Create: `frontend/src/views/graduation/DatasetPreview.vue`

- [ ] **Step 1: Create the component**

```vue
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
      <!-- Left sidebar -->
      <div class="sidebar">
        <div class="sidebar-section">
          <div class="section-label">📄 数据集说明</div>
          <div class="description-box" v-loading="descLoading">
            <span v-if="description" style="white-space: pre-wrap">{{ description }}</span>
            <span v-else-if="!descLoading" class="muted-text">暂无数据集说明</span>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="section-label">📁 文件列表</div>
          <div class="file-list">
            <div v-if="files.length === 0" class="muted-text">文件列表不可用</div>
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

      <!-- Right: preview -->
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
import { ArrowLeft, Download } from '@element-plus/icons-vue';
import datasetIndex from '@/data/datasetIndex.json';

const LARGE_THRESHOLD = 50 * 1024 * 1024;
const CSV_RANGE_BYTES = 8192;

const router = useRouter();
const route = useRoute();

const folderUrl = computed(() =>
  decodeURIComponent((route.query.url as string) || '').replace(/\/$/, '')
);
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
  const splitLine = (line: string) =>
    line.match(/(".*?"|[^,]+|(?<=,)(?=,)|^(?=,)|(?<=,)$)/g)
      ?.map(v => v.trim().replace(/^"|"$/g, '')) ?? line.split(',').map(v => v.trim());
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
    if (!csvFile) { csvLoading.value = false; return; }
    const res = await fetch(fileUrl(csvFile), {
      headers: { Range: `bytes=0-${CSV_RANGE_BYTES - 1}` }
    });
    if (!res.ok && res.status !== 206) { csvLoading.value = false; return; }
    const text = await res.text();
    // Drop last (possibly incomplete) line when we got a partial response
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
      zip.file(file.name, await res.blob());
      downloadProgress.value = Math.round(((i + 1) / total) * 90);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    downloadProgress.value = 100;
    saveAs(blob, `${datasetName.value}.zip`);
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
```

- [ ] **Step 2: Verify TypeScript compiles (no errors)**

```bash
cd /Users/liuxiangmiao/Desktop/vibesys/frontend && npx vue-tsc --noEmit 2>&1 | head -20
```

Expected: no errors (or only pre-existing unrelated errors).

- [ ] **Step 3: Commit**

```bash
git -C /Users/liuxiangmiao/Desktop/vibesys add frontend/src/views/graduation/DatasetPreview.vue
git -C /Users/liuxiangmiao/Desktop/vibesys commit -m "feat: add DatasetPreview page with description, file list, CSV preview and zip download"
```

---

## Task 4: Add Route

**Files:**
- Modify: `frontend/src/router/index.ts`

- [ ] **Step 1: Add the route after GraduationTopicPool entry**

In `frontend/src/router/index.ts`, find the block:

```typescript
  {
    path: '/graduation/topics',
    name: 'GraduationTopicPool',
    component: () => import('@/views/graduation/GraduationTopicPool.vue'),
    meta: { requiresAuth: true }
  },
```

Add immediately after it:

```typescript
  {
    path: '/graduation/dataset',
    name: 'DatasetPreview',
    component: () => import('@/views/graduation/DatasetPreview.vue'),
    meta: { requiresAuth: true, skipModeCheck: true }
  },
```

`skipModeCheck: true` is needed so the navigation guard doesn't interfere when navigating to the preview page.

- [ ] **Step 2: Commit**

```bash
git -C /Users/liuxiangmiao/Desktop/vibesys add frontend/src/router/index.ts
git -C /Users/liuxiangmiao/Desktop/vibesys commit -m "feat: add /graduation/dataset route for DatasetPreview"
```

---

## Task 5: Update openDataset in GraduationTopicPool.vue

**Files:**
- Modify: `frontend/src/views/graduation/GraduationTopicPool.vue`

- [ ] **Step 1: Replace the openDataset function**

Find:

```typescript
function openDataset(url: string) {
  const target = url.replace(/\/$/, '') + '/数据集说明.txt';
  window.open(target, '_blank', 'noopener,noreferrer');
}
```

Replace with:

```typescript
function openDataset(url: string) {
  router.push(`/graduation/dataset?url=${encodeURIComponent(url)}`);
}
```

- [ ] **Step 2: Commit**

```bash
git -C /Users/liuxiangmiao/Desktop/vibesys add frontend/src/views/graduation/GraduationTopicPool.vue
git -C /Users/liuxiangmiao/Desktop/vibesys commit -m "feat: navigate to DatasetPreview page on openDataset"
```

---

## Task 6: Update .gitignore and Push

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add .superpowers/ to .gitignore**

Append to `/Users/liuxiangmiao/Desktop/vibesys/.gitignore`:

```
.superpowers/
```

- [ ] **Step 2: Commit and push everything**

```bash
git -C /Users/liuxiangmiao/Desktop/vibesys add .gitignore
git -C /Users/liuxiangmiao/Desktop/vibesys commit -m "chore: ignore .superpowers/ brainstorm sessions"
git -C /Users/liuxiangmiao/Desktop/vibesys push origin main
```

Expected: push succeeds, CI triggers frontend build on Cloudflare Pages.
