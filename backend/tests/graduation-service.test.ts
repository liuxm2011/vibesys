import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GraduationService } from '../src/services/graduation.service.js';

test('graduation task book post-processing strips leaked reasoning preamble', () => {
  const service = new GraduationService() as unknown as {
    postProcess(content: string, docType: string): string;
  };

  const leakedContent = `开始输出
让我根据提供的 PRD、前端技术文档和后端技术文档来编写任务书内容。

我需要涵盖：

核心功能和模块
技术选型、开发规范、质量标准
预期成果形式

功能模块：

用户管理模块 - 注册、登录、账号管理、角色权限

现在我来编写任务书的具体内容。

<h2 style="font-weight: bold;">一、研究的主要内容及基本要求</h2>
<p style="line-height: 1.8; text-indent: 2em;">本课题围绕在线图书管理系统展开。</p>
<h2 style="font-weight: bold;">二、主要参考资料</h2>`;

  const cleaned = service.postProcess(leakedContent, 'TASK_BOOK');

  assert.match(cleaned, /^<h2[^>]*>一、研究的主要内容及基本要求<\/h2>/);
  assert.doesNotMatch(cleaned, /开始输出|让我根据|我需要涵盖|现在我来|功能模块/);
});

test('graduation task book post-processing removes inline generation markers', () => {
  const service = new GraduationService() as unknown as {
    postProcess(content: string, docType: string): string;
  };

  const leakedContent = `让我开始编写任务书内容：
一、研究的主要内容及基本要求

研究的主要工作内容
根据项目需求，系统应实现用户管理、图书管理、借阅管理、检索查询、系统配置和数据统计等核心功能。

技术选型采用 Vue 3、Node.js、MySQL 和 Element Plus，前端基于 Vue 3 的组合式 API 构建组件化界面。

现在开始生成 HTML 格式的任务书内容。

一、研究的主要内容及基本要求
`;

  const cleaned = service.postProcess(leakedContent, 'TASK_BOOK');

  assert.match(cleaned, /^一、研究的主要内容及基本要求/);
  assert.match(cleaned, /用户管理、图书管理、借阅管理/);
  assert.doesNotMatch(cleaned, /让我开始编写任务书内容|现在开始生成 HTML 格式的任务书内容/);
});

test('graduation proposal post-processing strips source document echoes', () => {
  const service = new GraduationService() as unknown as {
    postProcess(content: string, docType: string): string;
  };

  const leakedContent = `选题数据：
中文题目：在线图书管理系统

PRD文档内容：
- 项目背景与目标
- 功能模块

前端技术文档：
前端采用 Vue 3 框架配合 Element Plus 组件库进行开发。

后端技术文档：
后端基于 Node.js 和 Express 框架构建 RESTful API。

现在开始撰写开题报告：

<div class="graduation-proposal" style="font-family: SimSun, serif; line-height: 1.8;">
<h2 style="text-align: center;">在线图书管理系统 毕业设计开题报告</h2>
<h2>一、文献综述</h2>
<h3>1. 研究背景和意义</h3>
<p>在线图书管理系统能够提升图书流通效率。</p>
</div>`;

  const cleaned = service.postProcess(leakedContent, 'PROPOSAL');

  assert.match(cleaned, /^<div class="graduation-proposal"/);
  assert.doesNotMatch(cleaned, /选题数据|PRD文档内容|前端技术文档|后端技术文档|现在开始撰写开题报告/);
  assert.match(cleaned, /在线图书管理系统 毕业设计开题报告/);
});
