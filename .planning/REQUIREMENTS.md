# Requirements: VibeCoding 教学实践平台

**Defined:** 2026-04-18
**Core Value:** 学生能够将模糊的想法转化为结构化文档，并利用AI工具高效完成软件开发

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: 用户可通过学校统一认证系统登录
- [ ] **AUTH-02**: 登录后获取用户基本信息（姓名、学号、院系）
- [ ] **AUTH-03**: 用户可安全登出
- [ ] **AUTH-04**: 会话在浏览器刷新后保持有效

### Topic Selection

- [ ] **TOPIC-01**: 学生可浏览选题池列表
- [ ] **TOPIC-02**: 选题按领域分类展示（软件工程/大数据）
- [ ] **TOPIC-03**: 学生可查看选题详情（描述、技术栈建议）
- [ ] **TOPIC-04**: 学生可选择并锁定一个选题
- [ ] **TOPIC-05**: 学生可提交自拟选题（无需审核）
- [ ] **TOPIC-06**: 选题显示难度级别标记

### Document Generation

- [ ] **DOC-01**: 学生可生成PRD文档框架
- [ ] **DOC-02**: 学生可生成前端开发文档模板
- [ ] **DOC-03**: 学生可生成后端开发文档模板
- [ ] **DOC-04**: AI根据选题内容填充文档初始内容
- [ ] **DOC-05**: 学生可在线编辑修改文档内容
- [ ] **DOC-06**: 学生可查看技术栈推荐方案
- [ ] **DOC-07**: 学生可修改技术栈选择
- [ ] **DOC-08**: 系统提示文档生成消耗API配额

### Export

- [ ] **EXPORT-01**: 学生可导出完整文档包（Markdown格式）
- [ ] **EXPORT-02**: 导出包含PRD、前端文档、后端文档
- [ ] **EXPORT-03**: 导出文件命名包含项目名称和日期

### User Dashboard

- [ ] **DASH-01**: 学生可查看自己的项目列表
- [ ] **DASH-02**: 学生可查看当前项目状态
- [ ] **DASH-03**: 学生可访问已生成的文档

### Admin Management

- [ ] **ADM-01**: 管理员可查看用户列表
- [ ] **ADM-02**: 管理员可添加/编辑/删除选题池中的项目
- [ ] **ADM-03**: 管理员可查看平台使用统计数据
- [ ] **ADM-04**: 管理员可配置平台公告内容
- [ ] **ADM-05**: 管理员可配置使用指南内容
- [ ] **ADM-06**: 管理员可封禁/解封用户
- [ ] **ADM-07**: 管理员可查看API调用统计

## v2 Requirements

Deferred to future release.

### Notifications

- **NOTF-01**: 学生接收平台公告通知
- **NOTF-02**: 项目状态变更通知

### Enhanced Documents

- **DOC-09**: 文档版本历史记录
- **DOC-10**: 文档差异对比功能

### Collaboration

- **COLL-01**: 多人协作项目支持
- **COLL-02**: 项目成员管理

## Out of Scope

| Feature | Reason |
|---------|--------|
| 教师审核评分 | 平台定位为学生自主创作，无需教师介入 |
| 项目进度跟踪 | 学生自行管理进度，平台不强制 |
| 内置AI编码工具 | 学生使用外部Claude Code/Codex等工具 |
| 团队协作 | v1仅支持单人项目 |
| 独立注册系统 | 必须使用学校统一认证 |
| 视频教学 | 非教学视频平台 |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| TOPIC-01 | Phase 2 | Pending |
| TOPIC-02 | Phase 2 | Pending |
| TOPIC-03 | Phase 2 | Pending |
| TOPIC-04 | Phase 2 | Pending |
| TOPIC-05 | Phase 2 | Pending |
| TOPIC-06 | Phase 2 | Pending |
| DOC-01 | Phase 3 | Pending |
| DOC-02 | Phase 3 | Pending |
| DOC-03 | Phase 3 | Pending |
| DOC-04 | Phase 3 | Pending |
| DOC-05 | Phase 3 | Pending |
| DOC-06 | Phase 3 | Pending |
| DOC-07 | Phase 3 | Pending |
| DOC-08 | Phase 3 | Pending |
| EXPORT-01 | Phase 4 | Pending |
| EXPORT-02 | Phase 4 | Pending |
| EXPORT-03 | Phase 4 | Pending |
| DASH-01 | Phase 2 | Pending |
| DASH-02 | Phase 2 | Pending |
| DASH-03 | Phase 2 | Pending |
| ADM-01 | Phase 5 | Pending |
| ADM-02 | Phase 5 | Pending |
| ADM-03 | Phase 5 | Pending |
| ADM-04 | Phase 5 | Pending |
| ADM-05 | Phase 5 | Pending |
| ADM-06 | Phase 5 | Pending |
| ADM-07 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 31
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-18*
*Last updated: 2026-04-18 after initial definition*