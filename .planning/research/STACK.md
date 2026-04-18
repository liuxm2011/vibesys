# Stack Research: 教学实践平台

**Research Date:** 2026-04-18
**Domain:** 教育平台 / AI辅助开发平台

## Recommended Stack

### Frontend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | Vue 3 + TypeScript | 学习曲线平缓，中文社区活跃，适合教育场景 |
| Build Tool | Vite | 快速构建，现代开发体验 |
| UI Library | Element Plus | 国内团队维护，组件丰富，中文文档完善 |
| State Management | Pinia | Vue 3官方推荐，简洁易用 |
| HTTP Client | Axios | 成熟稳定，拦截器机制完善 |
| CSS | Tailwind CSS | 快速样式开发，响应式友好 |

### Backend

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language/Framework | Node.js + Express/NestJS | 与前端技术栈统一，全栈开发效率高 |
| Database | MySQL 8.0 | 关系型数据适合结构化文档存储 |
| ORM | Prisma | TypeScript友好，类型安全 |
| Auth | JWT + 学校SSO对接 | 灵活的认证方案，支持统一认证集成 |
| API Docs | Swagger/OpenAPI | 自动生成文档，便于前后端协作 |

### AI Integration

| Component | Choice | Rationale |
|-----------|--------|-----------|
| AI API | Claude API / OpenAI API | 主流AI服务，文档生成能力强 |
| Rate Limiting | Redis | API调用限额管理 |
| Prompt Templates | 模板引擎 | 结构化提示词生成 |

### Infrastructure

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Deployment | 阿里云/腾讯云 | 国内公有云，访问稳定 |
| File Storage | OSS/COS | 文档文件存储 |
| Cache | Redis | API限额、会话缓存 |

## Confidence Levels

- Frontend Stack: **High** (Vue生态成熟，教育平台广泛使用)
- Backend Stack: **High** (Node.js全栈方案验证度高)
- AI Integration: **Medium** (API成本控制需设计)
- SSO Integration: **Medium** (需与学校具体认证系统对接)

## Not Recommended

- **React + Python**: 前后端技术栈不统一，增加学习成本
- **MongoDB**: 文档数据有强结构化需求，关系型更合适
- **自建AI模型**: 成本过高，调用外部API更经济