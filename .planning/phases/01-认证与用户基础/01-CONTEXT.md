# Phase 1: 认证与用户基础 - Context

**Gathered:** 2026-04-18
**Status:** Ready for planning

<domain>
## Phase Boundary

建立本地认证系统和用户数据模型。用户通过学号登录平台，管理员可导入学生数据。不集成学校SSO系统。

</domain>

<decisions>
## Implementation Decisions

### 认证方式
- **D-01:** 本地认证，不集成学校SSO系统（简化实现）
- **D-02:** 学号作为登录账号，初始密码默认为学号
- **D-03:** 管理员后台批量导入学生数据，自动创建账号

### 用户数据模型
- **D-04:** 用户表字段：学号(studentId)、姓名、专业、年级、班级、密码、角色、状态
- **D-05:** 角色设计：student（学生）和 admin（管理员）两种角色
- **D-06:** 状态字段：active（正常）、banned（封禁）
- **D-07:** 最小化字段设计，后续按需扩展

### 密码策略
- **D-08:** 初始密码 = 学号，学生可自行修改密码
- **D-09:** 密码加密使用 bcrypt 算法
- **D-10:** 修改密码功能在个人设置页面提供

### 会话管理
- **D-11:** JWT Token 方案，Token 有效期 7 天
- **D-12:** Token 存储在 httpOnly Cookie 中（防止 XSS 攻击）
- **D-13:** 浏览器刷新后保持登录状态
- **D-14:** 登出时清除 Cookie 和前端状态

### 管理员账号
- **D-15:** 系统预设默认管理员账号（初始化脚本创建）
- **D-16:** 默认管理员账号信息：admin / admin123（建议首次登录后修改）

### 前端实现
- **D-17:** 登录界面采用独立登录页（而非弹窗）
- **D-18:** 前端登录状态使用 Pinia Store 管理
- **D-19:** 全局路由守卫检查登录状态，未登录跳转登录页
- **D-20:** 登录失败统一错误提示（不区分具体错误原因）

### Claude's Discretion
- 登录页面具体布局和样式
- 登录表单验证规则细节
- 错误提示文案设计
- 密码修改页面具体设计
- Token 过期后的处理逻辑（自动跳转登录页或提示）

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### 认证方案
- `.planning/ROADMAP.md` — Phase 1 goal and requirements
- `.planning/REQUIREMENTS.md` — AUTH-01~04 requirements spec
- `VibeCoding教学实践平台-PRD文档.md` §5.2 — 技术栈建议（JWT + bcrypt）

No external specs — requirements are fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### 项目状态
- 新项目，无现有源代码
- 技术栈已确定：Vue 3 + TypeScript + Vite + Element Plus + Pinia (前端)
- 技术栈已确定：Node.js + Express + MySQL + Prisma + JWT (后端)

### 需新建模块
- 前端：登录页面组件、Pinia auth store、路由守卫
- 后端：认证路由、JWT 工具、用户模型、密码加密工具

</code_context>

<specifics>
## Specific Ideas

- 学号登录简化认证流程，降低对接学校系统复杂度
- 管理员导入学生数据批量创建账号，符合高校管理场景
- httpOnly Cookie 存储 Token 提升安全性

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 01-认证与用户基础*
*Context gathered: 2026-04-18*