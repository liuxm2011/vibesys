# Pitfalls Research: 教学实践平台

**Research Date:** 2026-04-18
**Domain:** 教育平台 / AI辅助开发

## Common Pitfalls

### 1. SSO集成复杂性

**问题:** 学校统一认证系统各异（CAS、OAuth、SAML等），对接复杂。

**Warning Signs:**
- 学校IT部门响应慢
- 认证协议文档不完整
- 测试环境不可用

**Prevention:**
- Phase 1尽早对接，预留充足时间
- 设计灵活的认证适配层
- 准备备用方案（临时邮箱注册供测试）

**Phase:** Phase 1 认证阶段

---

### 2. AI API成本失控

**问题:** 文档生成依赖AI API，大量调用导致成本超预算。

**Warning Signs:**
- 无调用限额机制
- 学生频繁重新生成
- 未预估调用量

**Prevention:**
- 设计每用户每日限额
- Redis记录调用次数
- 生成前提示"将消耗X次配额"
- 监控API费用

**Phase:** Phase 3 AI服务阶段

---

### 3. 文档模板过于通用

**问题:** 模板不够具体，AI生成内容空泛，学生无法直接使用。

**Warning Signs:**
- 模板字段过于简单
- 缺乏领域特定提示
- 生成文档质量反馈差

**Prevention:**
- 按领域设计不同模板（软件工程/大数据）
- Prompt包含领域背景信息
- 提供示例文档供参考

**Phase:** Phase 3 文档服务阶段

---

### 4. 技术栈推荐不匹配

**问题:** AI推荐的技术栈不适合选题实际需求或学生学习水平。

**Warning Signs:**
- 推荐过于复杂的技术
- 与学生已学内容脱节
- 无法提供备选方案

**Prevention:**
- 提供多套推荐方案（入门/进阶）
- 学生可手动修改选择
- 显示每方案的学习难度预估

**Phase:** Phase 3 文档服务阶段

---

### 5. 并发访问压力

**问题:** 课程集中使用时段，平台并发压力大。

**Warning Signs:**
- 单服务器部署
- 无缓存机制
- AI API调用排队阻塞

**Prevention:**
- 公有云弹性部署
- Redis缓存热点数据
- AI调用异步队列

**Phase:** Phase 5 完善阶段

---

### 6. 数据库设计遗漏

**问题:** 初期数据模型设计不完整，后期频繁改表。

**Warning Signs:**
- 未设计文档版本表
- 缺少项目状态字段
- API调用记录未存储

**Prevention:**
- Phase 1详细设计完整ER图
- 包含：用户、选题、项目、文档、API日志
- 预留扩展字段

**Phase:** Phase 1 数据库设计

---

## Summary Checklist

| Pitfall | Phase | Prevention |
|---------|-------|------------|
| SSO集成复杂 | Phase 1 | 早期对接，适配层设计 |
| API成本失控 | Phase 3 | 限额机制，Redis计数 |
| 模板过于通用 | Phase 3 | 领域特定模板，Prompt优化 |
| 技术栈不匹配 | Phase 3 | 多方案推荐，学生可修改 |
| 并发压力 | Phase 5 | 云部署，缓存，异步队列 |
| 数据库遗漏 | Phase 1 | 完整ER图设计 |