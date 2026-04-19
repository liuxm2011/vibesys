import { Domain } from '@prisma/client';

/**
 * API 接口契约文档 Prompt 模板
 * 基于 PRD、前端、后端文档生成完整的 API 契约规范
 */

export function getAPIPromptTemplate(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  return `
# ${domainLabel}项目 API 接口契约文档模板

## API 设计规范
- RESTful API 命名规范
- 版本控制策略
- 认证与鉴权方案（JWT）
- 请求/响应格式约定
- 错误码统一规范

## 接口列表（核心章节）

### 用户认证模块
- POST /api/auth/login — 用户登录
- POST /api/auth/register — 用户注册
- POST /api/auth/logout — 用户登出
- GET /api/auth/profile — 获取当前用户信息

### 业务核心模块
根据 PRD 中的功能需求，推导对应的 CRUD 接口。每个接口必须包含：
- HTTP 方法与 URL 路径
- 请求参数（Query / Path / Body）
- 请求头要求
- 响应数据结构（成功 / 失败）
- 权限要求

### 系统管理模块
- 配置管理接口
- 日志查询接口
- 健康检查接口

## 错误码设计
- 400 系列：客户端错误
- 401：未认证
- 403：无权限
- 404：资源不存在
- 500 系列：服务端错误

## 安全要求
- 请求签名机制
- CORS 配置
- 速率限制策略
- 输入验证规则

---

**长度要求**：
- 全文总字数控制在 2500-3000 中文字符
- 接口列表是核心，每个主要业务模块至少 3 个接口

**输出要求**：
- 严格按照指定结构输出，使用 Markdown 格式
- 接口必须使用 Markdown 表格或代码块详细描述
- 请求/响应示例必须使用 JSON 格式
- 内容需贴合${domainLabel}领域特点
`;
}
