# Phase 1: 认证与用户基础 - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-18
**Phase:** 01-认证与用户基础
**Areas discussed:** 认证方式, 用户数据模型, 密码策略, 会话管理, 前端实现

---

## 认证方式

| Option | Description | Selected |
|--------|-------------|----------|
| 学校SSO集成 (CAS/OAuth) | 对接学校统一认证系统 | |
| 本地认证（学号登录） | 简化实现，管理员导入学生数据 | ✓ |

**User's choice:** 本地认证（学号登录）
**Notes:** 学生登录做简化处理，学生通过学号登录，第一次登录账号密码都是学号，由管理员后台导入。表基本信息有学号、姓名、专业、年级、班级。

---

## 密码策略

| Option | Description | Selected |
|--------|-------------|----------|
| 允许修改密码 | 学号作为初始密码，学生可以自行修改密码 | ✓ |
| 固定密码 | 密码始终为学号，学生不可修改 | |
| 强制修改密码 | 初始密码为学号，学生必须首次登录后强制修改 | |

**User's choice:** 允许修改密码

---

## 会话管理

| Option | Description | Selected |
|--------|-------------|----------|
| Session会话 | 浏览器关闭后登录失效 | |
| JWT Token | 浏览器刷新后保持登录，默认7天有效期 | ✓ |
| JWT + Refresh Token | 持久化存储，自动续期 | |

**User's choice:** JWT Token

---

## JWT存储位置

| Option | Description | Selected |
|--------|-------------|----------|
| localStorage | 前端直接读取，存在XSS风险 | |
| httpOnly Cookie | 后端设置Cookie，防止XSS | ✓ |

**User's choice:** httpOnly Cookie

---

## JWT有效期

| Option | Description | Selected |
|--------|-------------|----------|
| 7天有效期 | 简单实现，过期后重新登录 | ✓ |
| 双Token机制 | Access Token + Refresh Token | |
| 滑动过期 | 持续活跃则持续有效 | |

**User's choice:** 7天有效期

---

## 密码加密算法

| Option | Description | Selected |
|--------|-------------|----------|
| bcrypt | Node.js生态常用，成熟稳定 | ✓ |
| Node.js crypto | 原生模块，无需额外依赖 | |

**User's choice:** bcrypt

---

## 角色设计

| Option | Description | Selected |
|--------|-------------|----------|
| 两种角色 | 学生(student)和管理员(admin) | ✓ |
| 单一角色 | 仅学生角色，管理员通过特殊标识 | |

**User's choice:** 两种角色

---

## 管理员账号创建

| Option | Description | Selected |
|--------|-------------|----------|
| 与学生相同 | 管理员账号通过后台导入 | |
| 预设默认管理员 | 系统初始化时预设固定账号 | ✓ |

**User's choice:** 预设默认管理员

---

## 登录界面设计

| Option | Description | Selected |
|--------|-------------|----------|
| 登录弹窗 | 顶部导航栏登录按钮，弹出对话框 | |
| 独立登录页 | 完整表单布局的独立页面 | ✓ |

**User's choice:** 独立登录页

---

## 用户表字段

| Option | Description | Selected |
|--------|-------------|----------|
| 最小化字段 | 仅必要字段：学号、姓名、专业、年级、班级、密码、角色、状态 | ✓ |
| 预留扩展字段 | 添加手机号、邮箱、头像等 | |

**User's choice:** 最小化字段

---

## 前端状态管理

| Option | Description | Selected |
|--------|-------------|----------|
| Pinia Store | 全局状态管理，组件直接访问 | ✓ |
| 组件本地状态 | 无需全局状态管理 | |

**User's choice:** Pinia Store

---

## 路由权限保护

| Option | Description | Selected |
|--------|-------------|----------|
| 全局路由守卫 | 路由跳转前检查Token有效性 | ✓ |
| 组件内检查 | 每个页面组件内部检查 | |

**User's choice:** 全局路由守卫

---

## 登录错误提示

| Option | Description | Selected |
|--------|-------------|----------|
| 统一提示 | 统一错误提示，不区分具体原因 | ✓ |
| 详细错误信息 | 区分显示账号不存在、密码错误等 | |

**User's choice:** 统一提示

---

## Claude's Discretion

- 登录页面具体布局和样式
- 登录表单验证规则细节
- 错误提示文案设计
- 密码修改页面具体设计
- Token 过期后的处理逻辑

---

## Deferred Ideas

None — all discussed items were within Phase 1 scope.

---

*Discussion completed: 2026-04-18*