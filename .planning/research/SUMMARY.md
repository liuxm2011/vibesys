# Research Summary: 教学实践平台

**Research Date:** 2026-04-18

## Stack

**Frontend:** Vue 3 + TypeScript + Vite + Element Plus + Pinia + Tailwind CSS

**Backend:** Node.js + Express/NestJS + MySQL + Prisma + JWT

**AI:** Claude/OpenAI API + Redis限额管理

**Deploy:** 阿里云/腾讯云 + OSS/COS文件存储

## Table Stakes Features

- 学校SSO认证集成
- 选题池展示与分类
- PRD/前端/后端文档模板
- Markdown导出
- 用户管理后台
- 文档在线编辑

## Key Differentiators

- AI辅助文档生成
- 技术栈智能推荐（学生可修改）
- API调用限额管理
- 使用统计仪表板

## Architecture

- 前后端分离
- JWT认证（与SSO集成）
- AI服务独立模块
- Redis缓存API限额

## Build Order

1. **Phase 1:** 认证 + 用户基础 + 数据库设计
2. **Phase 2:** 选题管理 + 学生端基础
3. **Phase 3:** 文档模板 + AI服务 + 文档生成
4. **Phase 4:** 管理后台
5. **Phase 5:** 导出完善 + 性能优化

## Watch Out For

- **SSO对接复杂** — Phase 1预留充足时间，设计适配层
- **AI成本控制** — 设计用户限额机制
- **模板质量** — 领域特定Prompt设计
- **并发压力** — 云部署+缓存

## Files

- `.planning/research/STACK.md` — 技术栈推荐
- `.planning/research/FEATURES.md` — 功能分类
- `.planning/research/ARCHITECTURE.md` — 架构设计
- `.planning/research/PITFALLS.md` — 常见陷阱