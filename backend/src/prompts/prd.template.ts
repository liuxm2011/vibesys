import { Domain } from '../generated/prisma'

/**
 * D-05: PRD standard structure
 * D-08/09: Domain differentiation for SE vs BD
 */

export function getPRDPromptTemplate(domain: Domain): string {
  const domainLabel = domain === 'SE' ? '软件工程' : '大数据';

  const baseSections = `
## 项目概述
- 项目背景与目标
- 目标用户群体
- 核心价值定位

## 功能需求（核心章节）
- 功能模块划分
- 详细功能列表
- 功能优先级排序
- 功能依赖关系

## 技术建议
- 技术栈选型理由
- 架构设计建议
- 关键技术决策

## 验收标准
- 功能验收标准
- 性能验收标准
- 安全验收标准
`;

  const seSpecific = `
### 软件工程(SE)领域特定内容

#### 功能流程
- 核心业务流程图
- 用户操作流程
- 异常处理流程

#### 用户交互设计
- 交互设计原则
- 关键界面设计要点
- 用户体验优化建议

#### 界面原型建议
- 核心页面布局建议
- 组件设计规范
`;

  const bdSpecific = `
### 大数据(BD)领域特定内容

#### 数据流程
- 数据采集流程图
- 数据处理Pipeline
- 数据输出流程

#### 数据采集方案
- 数据源识别
- 采集频率与方式
- 数据质量控制

#### 分析模型设计
- 分析目标定义
- 模型选型建议
- 模型评估标准

#### 数据存储架构
- 存储系统选型
- 数据分层设计
- 数据备份策略
`;

  return `
${domainLabel}项目产品需求文档(PRD)内容结构要求：

${baseSections}

${domain === 'SE' ? seSpecific : bdSpecific}

---

**篇幅要求**：
- 全文目标 6000-8000 中文字符，内容详实优先
- 每个核心功能模块都要展开：功能描述 + 用户故事 + 验收标准
- 用列表组织结构，但每个要点都要有充分说明，不要只写标题

**输出要求**：
- 严格按照指定结构输出，使用Markdown格式
- 内容需贴合${domainLabel}领域特点
- 每个章节内容充实详尽，具有实际指导意义
`;
}
