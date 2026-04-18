# VibeCoding 教学实践平台

## What This Is

一个面向高校学生的自主式软件开发实践平台。学生通过选题 → AI生成PRD → AI生成技术文档 → 外部AI编码工具开发的完整流程，体验现代AI驱动的软件开发范式。

平台覆盖软件工程和大数据两个领域的项目选题，学生自主完成从需求分析到代码生成的全过程。

## Core Value

学生能够将模糊的想法转化为结构化文档，并利用AI工具高效完成软件开发，掌握现代软件工程的完整流程。

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] 学生可从分类选题池中选择项目（软件工程/大数据）
- [ ] 学生可自拟选题，无需教师审核
- [ ] AI可根据选题自动生成PRD文档框架
- [ ] AI可根据PRD生成前端开发文档
- [ ] AI可根据PRD生成后端开发文档
- [ ] AI可提供技术栈推荐方案，学生可修改
- [ ] 学生可导出完整文档包用于外部AI编码工具
- [ ] 管理员可管理选题池（添加/编辑/删除）
- [ ] 管理员可查看学生数据统计
- [ ] 管理员可配置平台公告和使用指南
- [ ] 管理员可管理用户（封禁/解封）
- [ ] 集成学校统一认证系统

### Out of Scope

- 教师审核/评分功能 — 平台定位为学生自主创作，无需教师介入
- 项目进度跟踪/版本管理 — 学生自行管理，平台不强制跟踪
- 内置AI编码工具集成 — 学生在外部使用Claude Code/Codex等工具
- 实时协作/团队项目 — v1仅支持单人项目

## Context

- 目标用户：高校计算机/软件工程/大数据专业学生
- 使用场景：课程实践、毕业设计、自主技能提升
- AI集成方式：调用外部AI API（Claude/OpenAI）生成文档内容
- 认证系统：对接学校统一身份认证（SSO或LDAP）

## Constraints

- **认证**：必须对接学校统一认证系统 — 现有校园网用户体系
- **部署**：公有云部署（阿里云/腾讯云） — 需公网可访问
- **API成本**：AI API调用有成本限制 — 需设计调用限额策略

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 无教师角色 | 平台定位为学生自主创作平台，降低流程复杂度 | — Pending |
| AI辅助生成而非全自动 | 学生需参与文档编写过程以学习文档设计能力 | — Pending |
| 外部AI编码工具 | 避免平台过度复杂化，学生学习使用专业AI工具 | — Pending |
| 按领域分类选题池 | 软件工程与大数据选题特征不同，便于学生筛选 | — Pending |
| 技术栈可修改 | 不同项目适合不同技术栈，给学生选择空间 | — Pending |

---
*Last updated: 2026-04-18 after initialization*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state