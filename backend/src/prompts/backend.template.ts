import { Domain } from '@prisma/client';

/**
 * D-07: Backend document structure
 * D-08/09: Domain differentiation for SE vs BD
 */

export function getBackendPromptTemplate(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  const baseSections = `
## API接口设计
- API结构规划
- 接口命名规范
- 请求/响应格式
- 错误码设计

## 数据库设计
- 数据库选型
- 表结构设计
- 索引设计
- 数据关系设计

## 中间件配置
- 认证中间件
- 日志中间件
- 错误处理中间件

## 部署说明
- 部署环境要求
- 部署步骤
- 环境变量配置
`;

  const seSpecific = `
### 软件工程(SE)领域特定内容

#### RESTful API设计规范
- URL设计规范
- HTTP方法使用
- 版本控制策略

#### 认证与权限中间件
- JWT认证方案
- 权限校验逻辑
- 会话管理策略

#### 日志与监控配置
- 日志级别设置
- 日志格式规范
- 监控指标设计
`;

  const bdSpecific = `
### 大数据(BD)领域特定内容

#### 数据Pipeline设计
- Pipeline架构
- 数据流向设计
- Pipeline监控

#### ETL流程说明
- 数据抽取方案
- 数据转换规则
- 数据加载策略

#### 数据仓库架构
- 数据分层设计
- 数据质量保障
- 元数据管理

#### 分析引擎配置
- 分析引擎选型
- 分析任务调度
- 结果存储方案
`;

  return `
# ${domainLabel}项目后端技术文档模板

${baseSections}

${domain === 'SE' ? seSpecific : bdSpecific}

---

**输出要求**：
- 严格按照指定结构输出，使用Markdown格式
- API设计需包含端点、参数、返回值详细说明
- 数据库设计需包含表结构说明
- 内容需贴合${domainLabel}领域特点
`;
}