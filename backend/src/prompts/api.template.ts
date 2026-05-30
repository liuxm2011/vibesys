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

每个接口包含：HTTP方法 + URL路径 + 功能描述 + 完整请求参数（含类型与是否必填） + 完整响应示例 + 可能的错误码。
基于 PRD 完整覆盖各业务模块的接口，不要遗漏核心 CRUD。

### 用户认证模块

### 业务核心模块
基于 PRD 推导完整接口集合

### 系统管理模块

## 错误码设计
列出完整的核心错误码及其含义与触发场景

---

**篇幅要求：**
- 全文目标 6000-9000 中文字符，接口覆盖完整优先
- 每个接口都要给出完整的请求/响应 JSON 示例，关键字段都要说明
- 优先保证接口数量与字段完整，不要为了篇幅删减接口或字段
`;
}
