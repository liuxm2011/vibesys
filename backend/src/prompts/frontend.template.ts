import { Domain } from '../generated/prisma'

/**
 * D-06: Frontend document structure
 * D-08/09: Domain differentiation for SE vs BD
 */

export function getFrontendPromptTemplate(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  const baseSections = `
## 组件结构设计
- 组件树结构
- 组件职责划分
- 组件命名规范
- 组件复用策略

## 状态管理方案
- 状态结构设计
- 状态管理工具选型
- 状态更新流程
- 状态持久化方案

## 路由设计
- 路由结构规划
- 路由守卫设计
- 路由参数设计

## 样式方案
- 样式框架选择
- 样式组织方式
- 响应式设计方案
`;

  const seSpecific = `
### 软件工程(SE)领域特定内容

#### 用户体验优化
- 加载状态处理
- 错误提示设计
- 操作反馈机制

#### 表单验证与错误处理
- 表单验证规则
- 错误消息设计
- 表单提交流程

#### 响应式设计
- 断点设置
- 组件响应式策略
- 移动端适配方案
`;

  const bdSpecific = `
### 大数据(BD)领域特定内容

#### 数据可视化组件
- 图表类型选择
- 可视化交互设计
- 图表响应式适配

#### 图表库选择
- 图表库对比分析
- 推荐方案与理由
- 自定义图表需求

#### 仪表盘布局设计
- 布局结构设计
- 数据刷新机制
- 布局响应式方案

#### 实时数据更新
- WebSocket方案
- 数据轮询策略
- 状态同步机制
`;

  return `
${domainLabel}项目前端技术文档内容结构要求：

${baseSections}

${domain === 'SE' ? seSpecific : bdSpecific}

---

**长度要求（必须严格遵守，超长输出将被截断）**：
- 全文总计不超过 300 行 Markdown
- 全文总字数控制在 2500-3000 中文字符
- 组件描述用列表，不要为每个组件写大段说明

**输出要求**：
- 严格按照指定结构输出，使用Markdown格式
- 给出具体的组件命名和文件结构建议
- 状态管理方案需详细说明数据流
- 内容需贴合${domainLabel}领域特点
`;
}
