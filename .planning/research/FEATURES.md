# Features Research: 教学实践平台

**Research Date:** 2026-04-18
**Domain:** 教育平台 / 学生项目管理系统

## Feature Categories

### Authentication

**Table Stakes (必须):**
- 学校统一认证集成（SSO/CAS）
- 用户信息获取（姓名、学号、院系）
- 登出功能
- 会话持久化

**Differentiators (差异化):**
- 多终端登录支持
- 登录日志记录
- 密码修改（如SSO允许）

**Anti-features (不建):**
- 独立注册系统（必须用学校认证）

---

### Topic Management (选题管理)

**Table Stakes:**
- 选题列表展示
- 按领域分类（软件工程/大数据）
- 题目详情页
- 选题锁定

**Differentiators:**
- 题目难度标记
- 技术栈预览
- 学生自拟选题提交

**Complexity:** Medium

---

### Document Generation (文档生成)

**Table Stakes:**
- PRD模板填充
- 前端文档模板
- 后端文档模板
- Markdown导出

**Differentiators:**
- AI辅助生成内容
- 技术栈智能推荐
- 文档版本管理
- 文档校验提示

**Complexity:** High (核心功能)

**Dependencies:** 依赖选题数据和AI API

---

### Admin Management (后台管理)

**Table Stakes:**
- 用户列表查看
- 选题管理（增删改）
- 平台公告配置

**Differentiators:**
- 使用统计仪表板
- API调用统计
- 用户封禁功能
- 使用指南编辑

**Complexity:** Medium

---

### User Dashboard (学生端)

**Table Stakes:**
- 个人项目列表
- 文档查看/编辑
- 导出功能

**Differentiators:**
- 项目状态展示
- 文档在线预览
- 技术栈选择修改

**Complexity:** Medium

---

## Feature Dependencies

```
选题管理 → 文档生成 → 导出功能
     ↓           ↓
用户Dashboard ←──┘
```

## Anti-features Summary

| Feature | Why Exclude |
|---------|-------------|
| 教师审核评分 | 平台定位为学生自主创作 |
| 项目进度跟踪 | 学生自行管理 |
| 团队协作 | v1仅单人项目 |
| 内置AI编码 | 学生使用外部工具 |
| 视频直播 | 非教学直播平台 |
| 即时通讯 | 非协作场景 |