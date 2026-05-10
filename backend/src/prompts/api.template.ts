import { Domain } from '../generated/prisma'

/**
 * API 接口契约文档 Prompt 模板
 * 基于 PRD、前端、后端文档生成完整的 API 契约规范
 */

export function getAPIPromptTemplate(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  return `
# ${domainLabel}项目 API 接口契约文档模板

## API 设计规范（简写）
- RESTful API 命名规范
- 版本控制策略（/api/v1）
- 认证方案：JWT Bearer Token
- 统一响应格式：{ code, message, data }

## 接口列表（核心章节）

每个接口只需包含：HTTP方法 + URL路径 + 一句话功能描述 + 核心请求参数 + 响应示例。
每个业务模块最多 3-4 个核心接口，不要列出所有 CRUD。

### 用户认证模块
最多 3 个接口

### 业务核心模块
基于 PRD 推导核心接口，每个功能点 1-2 个接口，总共不超过 15 个接口

### 系统管理模块
最多 2 个接口

## 错误码设计
列出 8-10 个核心错误码即可

---

**强制长度约束（必须严格遵守，超长输出将被截断）：**
- 全文总计不超过 1500 行 Markdown
- 全文总计不超过 3000 个中文字符
- 接口表格尽量精简，每个接口的请求/响应示例不超过 5 行 JSON
- 只输出核心接口和关键字段，不要展开所有可能的字段和场景
- 不要输出附录、状态值说明、版本历史等非核心章节
- 如果预估会超长，优先精简接口数量而不是删减已有接口的细节
`;
}
