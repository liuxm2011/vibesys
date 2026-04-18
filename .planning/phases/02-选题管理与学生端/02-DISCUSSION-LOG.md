# Phase 2: 选题管理与学生端 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in 02-CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 02-选题管理与学生端
**Areas discussed:** Topic data structure, Topic locking rules (project model), Custom topic submission, UI layout & navigation

---

## Topic Data Structure

### Difficulty level
| Option | Description | Selected |
|--------|-------------|----------|
| 三档：初级/中级/高级 | 简单分类，学生易于筛选 | |
| 五档：入门/初级/中级/高级/挑战 | 更细致，但筛选复杂度增加 | |
| 无难度标记 | 不显示难度，学生自己判断 | ✓ |

**User's choice:** 无难度标记
**Notes:** 学生自行判断复杂度，不预设难度级别

### Domain classification
| Option | Description | Selected |
|--------|-------------|----------|
| 两类：软件工程/大数据 | 与 PRD 定义一致，覆盖两个专业方向 | ✓ |
| 多类：可扩展分类列表 | 支持更细分方向（如Web开发、数据分析） | |
| 无领域分类 | 简单列表，不做分类 | |

**User's choice:** 两类：软件工程/大数据
**Notes:** 与PRD定义一致

### Tech stack storage
| Option | Description | Selected |
|--------|-------------|----------|
| 存储推荐技术栈字段 (string) | 生成文档时填充技术栈模板 | |
| 存储多个技术栈选项 (JSON) | 每个选题可选多种技术栈方案 | ✓ |
| 不存储技术栈信息 | 不预设技术栈，Phase 3 完全由 AI 推荐 | |

**User's choice:** 存储多个技术栈选项 (JSON)
**Notes:** 支持多方案供学生选择

### Topic fields
| Option | Description | Selected |
|--------|-------------|----------|
| 简单：标题+描述+领域+技术栈 | 基础信息即可 | |
| 详细：标题+描述+背景+目标+领域+技术栈 | 让学生了解更多项目背景 | ✓ |
| 富文本：Markdown格式描述 | 支持不同展示场景 | |

**User's choice:** 详细：标题+描述+背景+目标+领域+技术栈
**Notes:** TOPIC-03 要求查看选题详情

---

## Topic Locking Rules (Project Model)

### Project count per student
| Option | Description | Selected |
|--------|-------------|----------|
| 每个学生只能选一个选题 | 符合PRD定义的单人项目 | |
| 学生可选多个选题（上限？） | 允许学生尝试多个项目 | ✓ |
| 必须完成一个才能选下一个 | 先测试完成一个才能选下一个 | |

**User's choice:** 每个选题就是一个项目，上限10个
**Notes:** 重要澄清：不是"锁定选题"，而是"创建项目"。学生可创建多个项目，上限10个

### Topic switching
| Option | Description | Selected |
|--------|-------------|----------|
| 锁定后不可更换 | 选定后不能更换 | |
| 可以更换选题 | 允许重新选择，项目状态重置 | |
| 有状态限制的更换 | 仅未开始的允许更换 | ✓ |

**User's choice:** 项目可删除，可修改文档，可开启新项目
**Notes:** 模型重构：选择选题=创建项目实例，项目可删除，同一选题可多次创建

### Visibility to other students
| Option | Description | Selected |
|--------|-------------|----------|
| 已选选题仍可见，标记"已锁定" | 其他学生仍能看到，但不能选 | |
| 已选选题从列表隐藏 | 已选选题从池中消失 | |
| 显示剩余名额 | 类似抢题场景 | ✓ |

**User's choice:** 所有学生所有选题可无限制选择
**Notes:** 不是考试平台，同题可多次做（不同学生或同一学生）

---

## Custom Topic Submission

### Required fields
| Option | Description | Selected |
|--------|-------------|----------|
| 简单：标题+描述+领域 | 学生自由填写 | |
| 详细：标题+描述+背景+目标+领域 | 学生需提供更完整的想法 | ✓ |
| 最少：标题+领域（描述可选） | 至少填写核心要素 | |

**User's choice:** 详细：标题+描述+背景+目标+领域
**Notes:** 与系统选题结构一致，无需审核

### Topic pool inclusion
| Option | Description | Selected |
|--------|-------------|----------|
| 自拟选题加入公共选题池 | 其他学生可以选择这个选题 | |
| 自拟选题仅自己可用 | 只有创建者可使用 | ✓ |
| 自拟选题可选公开或不公开 | 创建者决定是否公开 | |

**User's choice:** 自拟选题仅自己可用
**Notes:** 个人定制题目，不污染公共池

---

## UI Layout & Navigation

### Topic pool layout
| Option | Description | Selected |
|--------|-------------|----------|
| 卡片列表，顶部筛选栏 | 类似 Dashboard 卡片风格 | |
| 表格列表，侧边筛选栏 | 信息密度高，适合大量选题 | ✓ |
| 分领域 Tab 页 | 类似课程目录，按领域分组 | |

**User's choice:** 表格列表，侧边筛选栏
**Notes:** 已存在 Dashboard 卡片风格，选题池采用表格形式

### Navigation structure
| Option | Description | Selected |
|--------|-------------|----------|
| 顶部导航栏 + Dashboard 入口 | Dashboard 显示项目列表 | ✓ |
| 侧边栏导航 | 更灵活，所有功能平级 | |
| 单页切换（Tabs） | 学生端简单设计 | |

**User's choice:** 顶部导航栏 + Dashboard 入口
**Notes:** 延续Phase1 Header设计

### Project list location
| Option | Description | Selected |
|--------|-------------|----------|
| Dashboard 页面嵌入项目列表 | Dashboard 集中展示项目卡片 | ✓ |
| 独立"我的项目"页面 | 单独页面，更详细管理 | |
| Dashboard 即项目列表页 | 项目列表与 Dashboard 合并 | |

**User's choice:** Dashboard 页面嵌入项目列表
**Notes:** 替换现有"我的项目"占位卡片，DASH-01~03 要求

---

## Claude's Discretion

- 选题池表格具体列设计
- 筛选栏交互细节
- 项目卡片展示内容
- 项目详情页面结构
- 自拟选题提交表单交互流程

---

*Discussion completed: 2026-04-18*