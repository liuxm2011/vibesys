import { Domain } from '@prisma/client';

/**
 * AI 编码规则文档 Prompt 模板
 * 基于所有前置文档生成 AGENTS.md，用于指导 AI Coding 工具
 */

export function getAgentsPromptTemplate(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  return `
# AGENTS.md — ${domainLabel}项目 AI 编码规则文档

## 项目概述
从 PRD 中提取项目背景、目标和核心价值定位。

## 技术栈
从前端和后端文档中提取完整的技术栈清单：
- 前端框架与库
- 后端框架与中间件
- 数据库与缓存
- 构建工具
- 测试框架

## 项目结构
描述项目的目录结构和文件组织方式。

## API 契约摘要
从 API 文档中提取关键接口信息：
- 认证方式
- 基础 URL
- 核心接口列表

## 任务执行指南
从 Task 文档中提取：
- 任务执行顺序
- 任务依赖关系
- 每个任务的验收标准

## 开发规则

### 代码规范
- 代码风格要求
- 命名规范
- 注释要求

### 安全要求
- 输入验证
- 认证授权
- 数据加密

### 测试要求
- 单元测试覆盖
- 集成测试范围

## ContextState 更新规则
**重要：每次完成一个任务后，必须按以下步骤更新 context_state.md 文件：**

1. 将已完成任务的状态从 PENDING 更新为 COMPLETED
2. 记录完成时间
3. 更新已完成任务数 / 总任务数
4. 根据任务依赖关系，确定下一个应该执行的任务
5. 更新"下一步行动"部分
6. 如有问题，记录到"遇到的问题"部分

**更新格式示例：**
\`\`\`markdown
## 变更记录
- [YYYY-MM-DD HH:MM] 完成 T-01: xxx，下一步执行 T-02: xxx
\`\`\`

## 文档引用
本项目包含以下文档：
1. PRD.md — 产品需求文档
2. Frontend.md — 前端技术文档
3. Backend.md — 后端技术文档
4. API.md — API 接口契约文档
5. task.md — 开发任务清单
6. context_state.md — 项目状态追踪文档（每次完成任务后更新此文件）
7. AGENTS.md — 本文件（AI 编码规则）

## 执行流程
1. 首先阅读 PRD.md 了解项目需求
2. 阅读 Frontend.md 和 Backend.md 了解技术方案
3. 阅读 API.md 了解接口契约
4. 阅读 task.md 了解任务清单
5. 阅读 context_state.md 了解当前进度
6. 按照任务清单顺序执行开发任务
7. 每完成一个任务，立即更新 context_state.md

---

**长度要求**：
- 全文总字数控制在 2000-2500 中文字符
- 各部分内容需精炼准确

**输出要求**：
- 严格按照指定结构输出，使用 Markdown 格式
- 这是 AI Coding 工具的主要参考文档，内容必须准确完整
- ContextState 更新规则部分必须清晰明确
- 内容需贴合${domainLabel}领域特点
`;
}
