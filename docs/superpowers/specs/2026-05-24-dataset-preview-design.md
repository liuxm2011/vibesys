# 数据集预览页 — 设计文档

**日期:** 2026-05-24  
**状态:** 已确认，待实现

---

## 概述

在毕业设计选题页中，学生点击"查看数据集"后跳转到独立的数据集预览页，展示数据集说明、文件列表及 CSV 数据预览，并支持一键下载全部文件（压缩包）。

---

## 路由

```
/graduation/dataset?url=<encoded_folder_url>
```

参数 `url` 为 COS 文件夹的 base URL（如 `https://biyesheji-1258171495.cos.ap-guangzhou.myqcloud.com/机器学习-表格数据/乳腺癌诊断`）。

---

## 页面布局

**顶部 Header（绿色主色调）**
- 左：`← 返回选题列表` 按钮（router.back()）+ 数据集名称
- 右：`⬇️ 下载全部文件` 按钮（根据大小逻辑切换行为）

**主体：左右两栏**

| 左侧（280px 固定宽） | 右侧（flex:1） |
|---|---|
| 📄 数据集说明（来自 `数据集说明.txt`） | 📊 数据预览表格（前 10 行） |
| 📁 文件列表（文件名 + 大小 + 单文件下载按钮） | 非 CSV 文件仅显示提示，不预览 |
| 总大小汇总 | |

---

## 数据来源

### 静态文件索引

COS 不支持无鉴权的 List API，因此在构建时预生成索引：

- 工具：`coscmd` 扫描所有 131 个数据集文件夹
- 产物：`frontend/src/data/datasetIndex.json`

```json
{
  "https://.../机器学习-表格数据/乳腺癌诊断": [
    { "name": "data.csv", "size": 125204 },
    { "name": "数据集说明.txt", "size": 276 }
  ],
  "https://.../机器学习-表格数据/Netflix影视目录": [
    { "name": "netflix_titles.csv", "size": 3399671 },
    { "name": "数据集说明.txt", "size": 301 }
  ]
}
```

### 数据集说明

- 直接 `fetch(folderUrl + '/数据集说明.txt')` 获取文本内容
- 在左侧说明区展示

### CSV 预览

- 用 HTTP `Range: bytes=0-8191` 请求只取文件前 8KB
- 在浏览器内解析 CSV，展示前 10 行
- 仅对文件名以 `.csv` 结尾的文件执行；`.tgz`、`.zip` 等二进制文件跳过，显示"此文件不支持预览"

---

## 下载逻辑

### 总大小 < 50MB：JSZip 客户端打包

1. 用 `fetch` 并行下载所有文件
2. 用 JSZip 打包为 `<数据集名>.zip`
3. 触发浏览器下载
4. 下载期间按钮显示进度（如"打包中… 45%"）

### 总大小 ≥ 50MB：逐文件下载

- 不提供 zip 打包（防止浏览器内存溢出）
- 顶部按钮变为禁用状态并提示"文件过大，请单独下载"
- 文件列表中每行的 `↓` 按钮仍然可用，点击直接 `window.open(fileUrl)`

---

## 新增文件

| 文件 | 说明 |
|---|---|
| `frontend/src/views/graduation/DatasetPreview.vue` | 新页面组件 |
| `frontend/src/data/datasetIndex.json` | 静态文件索引（coscmd 预生成） |

## 修改文件

| 文件 | 改动 |
|---|---|
| `frontend/src/router/index.ts` | 新增 `/graduation/dataset` 路由 |
| `frontend/src/views/graduation/GraduationTopicPool.vue` | `openDataset` 改为 `router.push('/graduation/dataset?url=...')` |
| `frontend/package.json` | 新增依赖 `jszip` |

---

## 错误处理

- 说明文件 fetch 失败：显示"暂无数据集说明"
- CSV 解析失败：显示"数据预览加载失败"
- 文件索引中找不到对应 URL：显示"文件列表不可用"，仍可尝试直接下载

---

## 不在本次范围内

- 分页浏览超过 10 行
- 数据列统计信息（均值、缺失率等）
- 多数据集对比
