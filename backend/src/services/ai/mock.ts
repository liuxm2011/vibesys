import { DocType } from '../../generated/prisma';
import type { TopicInfo, ReviewResult } from '../ai.service.js';

// Mock document/review generators used when MOCK_AI is enabled or no API key is
// configured. Pure functions (no instance state) extracted from ai.service.ts.

export function generateMockDocument(docType: DocType, topicInfo: TopicInfo): string {
  const domainLabel = topicInfo.domain === 'SE' ? '软件工程' : '大数据';
  const platformLabels: Record<string, string> = {
    WEB: 'Web应用',
    IOS: 'iOS原生应用',
    ANDROID: 'Android原生应用',
    WECHAT_MINI: '微信小程序',
    WINDOWS_DESKTOP: 'Windows桌面端',
    MAC_DESKTOP: 'Mac桌面端'
  };
  const platformLabel = platformLabels[topicInfo.platform] ?? topicInfo.platform;
  const timestamp = new Date().toLocaleString('zh-CN');

  if (docType === 'PRD') {
    return `# ${topicInfo.title} - 产品需求文档(PRD)

## 项目概述

**领域**: ${domainLabel}
**运行平台**: ${platformLabel}
**生成时间**: ${timestamp}
**项目描述**: ${topicInfo.description}
**项目目标**: ${topicInfo.objectives}

## 功能需求

### 核心功能模块

1. **用户管理模块**
 - 用户注册与登录
 - 个人信息管理
 - 权限控制

2. **业务核心模块**
 - 主要业务流程
 - 数据管理与展示
 - 统计分析功能

3. **系统管理模块**
 - 系统配置
 - 日志管理
 - 数据备份

## 技术建议

**推荐技术栈**: ${topicInfo.techStack.join(', ')}

- 前端采用现代化框架，确保良好的用户体验
- 后端采用微服务架构，保证系统可扩展性
- 数据库设计遵循第三范式，确保数据一致性

## 验收标准

- 功能完整性：所有核心功能均已实现
- 性能要求：页面加载时间 < 2秒
- 安全要求：通过基本的安全测试
- 兼容性：支持主流浏览器

---

*注：此为Mock模式生成的示例文档。配置有效的API密钥后将生成真实的AI文档。*
`;
  } else if (docType === 'FRONTEND') {
    return `# ${topicInfo.title} - 前端技术文档

## 项目概述

**领域**: ${domainLabel}
**运行平台**: ${platformLabel}
**生成时间**: ${timestamp}

## 技术栈

${topicInfo.techStack.map(tech => `- ${tech}`).join('\n')}

## 项目结构

\`\`\`
src/
├── components/     # 可复用组件
├── views/          # 页面视图
├── stores/         # 状态管理
├── api/            # API调用
├── router/         # 路由配置
└── utils/          # 工具函数
\`\`\`

## 核心组件设计

### 1. 布局组件
- Header: 顶部导航栏
- Sidebar: 侧边栏菜单
- Main: 主内容区域

### 2. 业务组件
- 根据具体业务需求设计
- 遵循单一职责原则

## 状态管理

使用 Pinia 进行全局状态管理，包括：
- 用户认证状态
- 业务数据缓存
- UI状态控制

---

*注：此为Mock模式生成的示例文档。*
`;
  } else if (docType === 'BACKEND') {
    return `# ${topicInfo.title} - 后端技术文档

## 项目概述

**领域**: ${domainLabel}
**运行平台**: ${platformLabel}
**生成时间**: ${timestamp}

## 技术栈

${topicInfo.techStack.map(tech => `- ${tech}`).join('\n')}

## API设计

### RESTful API规范

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/resource | 获取资源列表 |
| POST | /api/resource | 创建新资源 |
| PUT | /api/resource/:id | 更新资源 |
| DELETE | /api/resource/:id | 删除资源 |

## 数据库设计

### 核心表结构

- **users**: 用户信息表
- **projects**: 项目信息表
- **documents**: 文档记录表

## 安全设计

- JWT身份认证
- 请求速率限制
- 输入数据验证
- SQL注入防护

---

*注：此为Mock模式生成的示例文档。*
`;
  } else if (docType === 'API') {
    return `# ${topicInfo.title} - API 接口契约文档

## 项目概述
**领域**: ${domainLabel}
**运行平台**: ${platformLabel}
**生成时间**: ${timestamp}

## 认证机制
- JWT Bearer Token
- 请求头: Authorization: Bearer <token>

## 接口列表

### 用户认证
| 方法 | 路径 | 描述 |
|------|------|------|
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/register | 用户注册 |
| GET | /api/auth/profile | 获取用户信息 |

### 业务接口
| 方法 | 路径 | 描述 |
|------|------|------|
| GET | /api/resources | 获取资源列表 |
| POST | /api/resources | 创建资源 |
| GET | /api/resources/:id | 获取单个资源 |
| PUT | /api/resources/:id | 更新资源 |
| DELETE | /api/resources/:id | 删除资源 |

## 错误码
- 400: 请求参数错误
- 401: 未认证
- 403: 无权限
- 404: 资源不存在
- 500: 服务器错误

---

*注：此为Mock模式生成的示例文档。*
`;
  } else if (docType === 'TASK') {
    return `# ${topicInfo.title} - 开发任务清单

## 第一阶段：基础设施 (P0)

### T-01: 项目初始化
**类型**: 后端 | **依赖**: 无 | **预估**: 小
- [ ] 初始化项目框架
- [ ] 配置数据库连接

### T-02: 数据库设计
**类型**: 数据库 | **依赖**: T-01 | **预估**: 中
- [ ] 设计核心表结构
- [ ] 创建迁移脚本

## 第二阶段：核心功能 (P0)

### T-03: 用户认证模块
**类型**: 后端 | **依赖**: T-02 | **预估**: 中
- [ ] 实现 JWT 认证
- [ ] 登录/注册接口

### T-04: 核心业务模块
**类型**: 全栈 | **依赖**: T-03 | **预估**: 大
- [ ] 后端 API 实现
- [ ] 前端页面开发

---

*注：此为Mock模式生成的示例文档。*
`;
  } else if (docType === 'CONTEXT_STATE') {
    return `# ${topicInfo.title} - 项目状态追踪

## 项目概述
**领域**: ${domainLabel}
**运行平台**: ${platformLabel}
**生成时间**: ${timestamp}

## 任务完成状态

| 任务编号 | 任务名称 | 状态 | 备注 |
|---------|---------|------|------|
| T-01 | 项目初始化 | PENDING | - |
| T-02 | 数据库设计 | PENDING | - |
| T-03 | 用户认证模块 | PENDING | - |
| T-04 | 核心业务模块 | PENDING | - |

## 当前进度
- 已完成: 0/4
- 完成百分比: 0%
- 当前任务: 无

## 下一步行动
1. T-01: 项目初始化
2. T-02: 数据库设计
3. T-03: 用户认证模块

## 变更记录
- [${timestamp}] 初始化状态文档

---

*注：此为Mock模式生成的示例文档。每次完成任务后请更新此文件。*
`;
  } else if (docType === 'AGENTS') {
    return `# AGENTS.md — ${topicInfo.title}

## 项目概述
**领域**: ${domainLabel}
**运行平台**: ${platformLabel}
**项目描述**: ${topicInfo.description}
**项目目标**: ${topicInfo.objectives}

## 技术栈
${topicInfo.techStack.map(tech => `- ${tech}`).join('\n')}

## 开发规则
- 遵循 ESLint 代码规范
- 所有 API 接口需编写文档
- 核心功能需编写单元测试

## ContextState 更新规则
**重要：每次完成一个任务后，必须更新 context_state.md 文件：**
1. 将已完成任务状态更新为 COMPLETED
2. 记录完成时间
3. 更新下一步行动

## 文档引用
1. PRD.md — 产品需求文档
2. Frontend.md — 前端技术文档
3. Backend.md — 后端技术文档
4. API.md — API 接口契约文档
5. task.md — 开发任务清单
6. context_state.md — 项目状态追踪文档
7. AGENTS.md — 本文件

## 执行流程
1. 阅读 PRD.md 了解需求
2. 阅读技术文档了解方案
3. 阅读 task.md 了解任务
4. 按顺序执行任务
5. 每完成一个任务，立即更新 context_state.md

---

*注：此为Mock模式生成的示例文档。配置有效的API密钥后将生成真实的AI文档。*
`;
  }
  return '# 未知文档类型';
}

export function generateMockReviewResult(): ReviewResult {
  return {
    issues: [
      {
        id: 1,
        severity: 'warning',
        category: 'prd_vs_frontend',
        title: 'Mock模式：PRD与前端文档对齐检查',
        description: '此为Mock模式生成的示例审核结果。配置有效API密钥后将生成真实审核。',
        affectedDocTypes: ['PRD', 'FRONTEND'],
        suggestion: '在前端文档中补充PRD提到的用户管理模块设计',
        patchHints: [
          {
            docType: 'FRONTEND',
            changeType: 'replace_section',
            targetHeadingPath: ['## 核心组件设计'],
            replacementContent: `## 核心组件设计

### 用户管理模块

- 登录注册流程
- 个人资料管理
- 收藏与发布管理`
          }
        ]
      }
    ],
    summary: 'Mock模式审核完成。整体文档结构较为完整，建议检查各文档间的模块命名一致性。'
  };
}
