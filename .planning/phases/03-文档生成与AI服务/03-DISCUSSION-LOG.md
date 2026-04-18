# Phase 3: 文档生成与AI服务 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 03-文档生成与AI服务
**Areas discussed:** AI服务商, 文档模板结构, API配额管理, 文档存储方案

---

## AI服务商

| Option | Description | Selected |
|--------|-------------|----------|
| Claude API | 当前最强模型、长文本能力强、中文表达优秀 | |
| OpenAI API | 生态成熟、文档丰富、模型多样 | |
| 双服务商兼容 | 配置灵活、可随时切换 | |
| **自部署MiniMax** | 学校服务器自部署，无外部成本 | ✓ |

**User's choice:** 学校自部署MiniMax模型API
**Notes:** 集成方式选择"独立服务模块"，便于未来扩展替换

---

## 文档模板结构

### PRD章节

| Option | Description | Selected |
|--------|-------------|----------|
| **标准PRD结构** | 项目概述、功能需求(核心)、技术建议、验收标准 | ✓ |
| 完整PRD结构 | 增加背景分析、用户画像、竞品分析、风险评估 | |
| 精简结构 | 仅项目概述+核心功能+技术栈 | |

**User's choice:** 标准PRD结构

### 技术文档结构

| Option | Description | Selected |
|--------|-------------|----------|
| 统一结构 | 技术栈说明、项目结构、模块设计、API设计、数据库设计 | |
| **分别定制结构** | 前端:组件/状态/路由；后端:API/数据库/中间件 | ✓ |

**User's choice:** 前端和后端文档分别定制结构

### 领域模板

| Option | Description | Selected |
|--------|-------------|----------|
| **领域差异化模板** | SE侧重功能流程；BD侧重数据Pipeline | ✓ |
| 统一模板 | AI根据选题内容自行调整侧重 | |

**User's choice:** 软件工程和大数据领域使用差异化模板

---

## API配额管理

### 配额策略

| Option | Description | Selected |
|--------|-------------|----------|
| 每日限额 | 每日固定次数（如10次） | |
| 项目限额 | 每项目可生成一次完整文档包 | |
| **无限制** | 自部署服务无需配额控制 | ✓ |

**User's choice:** 无限制（自部署MiniMax）

### 配额显示

| Option | Description | Selected |
|--------|-------------|----------|
| **不显示配额** | 简化用户体验 | ✓ |
| 显示统计信息 | 显示已生成次数但不限制 | |

**User's choice:** 不显示配额（DOC-08调整）

---

## 文档存储方案

### 存储方式

| Option | Description | Selected |
|--------|-------------|----------|
| **新建Document表** | 支持版本历史和元数据管理 | ✓ |
| 存Project.documentsRef | 复用现有JSON字段 | |

**User's choice:** 新建Document表

### 版本历史

| Option | Description | Selected |
|--------|-------------|----------|
| **单版本存储** | 每次生成覆盖，编辑实时保存 | ✓ |
| 多版本历史 | 可回溯查看历史版本 | |

**User's choice:** 单版本存储

---

## Claude's Discretion

- Markdown编辑器选择
- 技术栈推荐展示UI
- 文档编辑保存策略
- 生成按钮交互流程
- 项目详情页面布局结构

---

## Deferred Ideas

None — discussion stayed within phase scope.