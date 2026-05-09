import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DocType } from '@prisma/client';
import { AIService, type ReviewResult } from '../src/services/ai.service.js';

function createStreamResponse(markdown: string): Response {
  const payload = [
    'event: message',
    `data: ${JSON.stringify({
      choices: [{
        delta: { content: markdown },
        finish_reason: 'stop'
      }]
    })}`,
    '',
    ''
  ].join('\n');

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(payload));
      controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
      controller.close();
    }
  });

  return new Response(stream, {
    status: 200,
    headers: { 'Content-Type': 'text/event-stream' }
  });
}

function createChatCompletionResponse(content: string): Response {
  return new Response(JSON.stringify({
    choices: [
      {
        finish_reason: 'stop',
        message: {
          content
        }
      }
    ]
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}

test('forceRegenerate bypasses cached stream results and re-invokes model request', async () => {
  process.env.MINIMAX_API_KEY = 'test-key';
  process.env.MINIMAX_BASE_URL = 'https://example.test/v1';
  delete process.env.MOCK_AI;

  const aiService = new AIService();
  const originalFetch = global.fetch;
  const fetchCalls: string[] = [];

  global.fetch = (async (input: RequestInfo | URL) => {
    fetchCalls.push(String(input));
    return createStreamResponse(`# PRD ${fetchCalls.length}`);
  }) as typeof fetch;

  try {
    const topicInfo = {
      title: '缓存绕过测试',
      description: '验证重新生成时不能直接命中缓存。',
      domain: 'SE' as const,
      objectives: '重新生成时必须重新调用模型。',
      techStack: ['Vue 3', 'Node.js'],
      previousDocs: {} as Record<string, string>
    };

    const first = await aiService.generateDocumentStream(
      DocType.PRD,
      topicInfo,
      () => {}
    );
    const second = await aiService.generateDocumentStream(
      DocType.PRD,
      topicInfo,
      () => {},
      { bypassCache: true }
    );

    assert.equal(fetchCalls.length, 2);
    assert.match(first, /# PRD 1/);
    assert.match(second, /# PRD 2/);
  } finally {
    global.fetch = originalFetch;
  }
});

test('AGENTS document generation merges CLAUDE guidelines into final content', async () => {
  process.env.MOCK_AI = 'true';
  process.env.MINIMAX_API_KEY = 'mock-key';

  const aiService = new AIService();

  try {
    const content = await aiService.generateDocument(
      DocType.AGENTS,
      {
        title: '校园二手交易平台',
        description: '面向校园用户的闲置物品交易系统。',
        domain: 'SE',
        objectives: '输出完整的规则文档。',
        techStack: ['Vue 3', 'Spring Boot', 'MySQL'],
        previousDocs: {
          PRD: '# PRD\n\n项目背景',
          FRONTEND: '# Frontend\n\n前端说明',
          BACKEND: '# Backend\n\n后端说明'
        }
      }
    );

    assert.match(content, /^# AGENTS\.md/m);
    assert.match(content, /^## 最高优先规则$/m);
    assert.match(content, /当用户在 AI 编程工具中输入“了解项目规则，查看 AGENTS\.md 文档”时，必须立即先执行本规则/);
    assert.match(content, /^## CLAUDE\.md$/m);
    assert.match(content, /Behavioral guidelines to reduce common LLM coding mistakes\./);
    assert.match(content, /### 1\. Think Before Coding/);

    const highestPriorityIndex = content.indexOf('## 最高优先规则');
    const claudeIndex = content.indexOf('## CLAUDE.md');
    const overviewIndex = content.indexOf('## 项目概述');
    assert.ok(highestPriorityIndex > 0);
    assert.ok(claudeIndex > highestPriorityIndex);
    assert.ok(overviewIndex > highestPriorityIndex);
  } finally {
    delete process.env.MOCK_AI;
    delete process.env.MINIMAX_API_KEY;
  }
});

test('reviewDocuments recovers missing patchHints with a focused follow-up prompt', async () => {
  process.env.MINIMAX_API_KEY = 'test-key';
  process.env.MINIMAX_BASE_URL = 'https://example.test/v1';
  delete process.env.MOCK_AI;

  const aiService = new AIService();
  const originalFetch = global.fetch;
  let fetchCount = 0;

  global.fetch = (async () => {
    fetchCount += 1;

    if (fetchCount === 1) {
      return createChatCompletionResponse(JSON.stringify({
        issues: [
          {
            id: 3,
            severity: 'warning',
            category: 'prd_vs_backend',
            title: '定时报告推送缺少后端接口设计',
            description: 'PRD 中存在定时报告推送功能，但后端文档未补充接口设计。',
            affectedDocTypes: ['BACKEND'],
            suggestion: '在后端文档补充报告调度与推送接口',
            patchHints: []
          }
        ],
        summary: '发现 1 个需要补充后端设计的问题'
      }));
    }

    return createChatCompletionResponse(JSON.stringify({
      patchHintsByIssueId: {
        '3': [
          {
            docType: 'BACKEND',
            changeType: 'replace_section',
            targetHeadingPath: ['## API设计', '### 报告调度接口'],
            replacementContent: `### 报告调度接口

- POST /api/reports/schedules：创建定时报告任务
- PATCH /api/reports/schedules/:id：更新推送频率与接收人
- POST /api/reports/schedules/:id/dispatch：立即触发一次推送`
          }
        ]
      }
    }));
  }) as typeof fetch;

  try {
    const review = await aiService.reviewDocuments(
      {
        title: '校园二手交易平台',
        description: '面向校园用户的闲置交易系统',
        domain: 'SE',
        objectives: '提升文档一致性',
        techStack: ['Vue 3', 'Node.js']
      },
      {
        PRD: '# 产品需求文档\n\n## 通知功能\n\n支持定时报告推送。',
        BACKEND: '# 后端技术文档\n\n## API设计\n\n### 用户接口\n\n- GET /api/users/me'
      }
    );

    assert.equal(fetchCount, 2);
    assert.equal(review.issues.length, 1);
    assert.equal(review.issues[0]?.patchHints.length, 1);
    assert.equal(review.issues[0]?.patchHints[0]?.docType, DocType.BACKEND);
    assert.deepEqual(review.issues[0]?.patchHints[0]?.targetHeadingPath, ['## API设计', '### 报告调度接口']);
  } finally {
    global.fetch = originalFetch;
    delete process.env.MINIMAX_API_KEY;
    delete process.env.MINIMAX_BASE_URL;
  }
});

test('fixDocuments applies targeted section patches instead of regenerating whole document', async () => {
  process.env.MINIMAX_API_KEY = 'test-key';
  process.env.MINIMAX_BASE_URL = 'https://example.test/v1';
  delete process.env.MOCK_AI;

  const aiService = new AIService();
  const originalFetch = global.fetch;
  let fetchCount = 0;

  global.fetch = (async () => {
    fetchCount += 1;
    throw new Error('fix flow should not call external model');
  }) as typeof fetch;

  const findings: ReviewResult = {
    summary: 'PRD 与前后端文档存在少量对齐问题',
    issues: [
      {
        id: 1,
        severity: 'warning',
        category: 'prd_vs_frontend',
        title: '功能需求缺少实名认证约束',
        description: 'PRD 没有体现实名认证与交易状态流转。',
        affectedDocTypes: [DocType.PRD],
        suggestion: '在功能需求章节补充实名认证与交易状态流转',
        patchHints: [
          {
            docType: DocType.PRD,
            changeType: 'replace_section',
            targetHeadingPath: ['## 功能需求'],
            replacementContent: `## 功能需求

- 支持用户注册登录
- 支持实名认证后发布商品
- 支持商品发布
- 支持交易状态流转：待确认、进行中、已完成、已取消`
          }
        ]
      }
    ]
  };

  const original = `# 校园二手交易平台 PRD

## 项目概述

这里是项目概述。

## 功能需求

- 支持用户注册登录
- 支持商品发布

## 非功能需求

- 页面加载时间 < 2 秒
`;

  try {
    const result = await aiService.fixDocuments(
      {
        title: '校园二手交易平台',
        description: '面向校园用户的闲置交易系统',
        domain: 'SE',
        objectives: '提升文档一致性',
        techStack: ['Vue 3', 'Node.js']
      },
      { PRD: original },
      findings
    );

    const fixed = result.documents.get('PRD');
    assert.ok(fixed);
    assert.equal(fetchCount, 0);
    assert.equal(result.unresolved.length, 0);
    assert.match(fixed, /## 功能需求[\s\S]*实名认证后发布商品/);
    assert.doesNotMatch(fixed, /审核修订记录|审核修订/);
    assert.match(fixed, /## 非功能需求\n\n- 页面加载时间 < 2 秒/);
    assert.match(fixed, /- 支持用户注册登录/);
  } finally {
    global.fetch = originalFetch;
    delete process.env.MINIMAX_API_KEY;
    delete process.env.MINIMAX_BASE_URL;
  }
});

test('fixDocuments skips model call when document has no relevant findings', async () => {
  process.env.MINIMAX_API_KEY = 'test-key';
  process.env.MINIMAX_BASE_URL = 'https://example.test/v1';
  delete process.env.MOCK_AI;

  const aiService = new AIService();
  const originalFetch = global.fetch;
  let fetchCount = 0;

  global.fetch = (async () => {
    fetchCount += 1;
    throw new Error('should not be called');
  }) as typeof fetch;

  const original = `# API 文档

## 接口列表

- GET /api/projects
`;

  const findings: ReviewResult = {
    summary: '仅 PRD 需要调整',
    issues: [
      {
        id: 1,
        severity: 'suggestion',
        category: 'prd_vs_backend',
        title: 'PRD 术语可统一',
        description: '统一术语表达。',
        affectedDocTypes: [DocType.PRD],
        suggestion: '统一功能名称',
        patchHints: []
      }
    ]
  };

  try {
    const result = await aiService.fixDocuments(
      {
        title: '校园二手交易平台',
        description: '面向校园用户的闲置交易系统',
        domain: 'SE',
        objectives: '提升文档一致性',
        techStack: ['Vue 3', 'Node.js']
      },
      { API: original },
      findings
    );

    assert.equal(fetchCount, 0);
    assert.equal(result.documents.get('API'), original.trim());
    assert.equal(result.unresolved.length, 0);
  } finally {
    global.fetch = originalFetch;
    delete process.env.MINIMAX_API_KEY;
    delete process.env.MINIMAX_BASE_URL;
  }
});

test('fixDocuments falls back to anchor range replacement when section heading path is not found', async () => {
  process.env.MINIMAX_API_KEY = 'test-key';
  process.env.MINIMAX_BASE_URL = 'https://example.test/v1';
  delete process.env.MOCK_AI;

  const aiService = new AIService();
  const originalFetch = global.fetch;
  let fetchCount = 0;

  global.fetch = (async () => {
    fetchCount += 1;
    throw new Error('fix flow should not call external model');
  }) as typeof fetch;

  const findings: ReviewResult = {
    summary: '前端文档需要补充用户中心说明',
    issues: [
      {
        id: 1,
        severity: 'warning',
        category: 'prd_vs_frontend',
        title: '用户中心模块说明不完整',
        description: '用户中心缺少我的发布和我的收藏模块。',
        affectedDocTypes: [DocType.FRONTEND],
        suggestion: '补充用户中心模块说明',
        patchHints: [
          {
            docType: DocType.FRONTEND,
            changeType: 'replace_range',
            targetHeadingPath: ['## 不存在的标题'],
            anchorBefore: '用户中心页面支持四个功能模块：',
            anchorAfter: '### 1.2 组件职责划分',
            replacementContent: `个人信息展示、我的发布、我的收藏、购买记录、售出记录、我的举报。

### 1.1 用户中心模块详解

- **个人信息展示**：显示用户头像、昵称、认证状态、信用评分等信息
- **我的发布**：展示用户已发布的所有物品，支持编辑、下架、删除操作
- **我的收藏**：展示用户收藏的物品列表，支持取消收藏
- **购买记录**：展示作为买家的订单列表，支持按状态筛选（待交易、交易中、已完成、已取消）
- **售出记录**：展示作为卖家的订单列表，支持按状态筛选
- **我的举报**：展示用户提交的举报记录及处理状态，支持申诉功能

`
          }
        ]
      }
    ]
  };

  const original = `# 前端技术文档

## 1. 页面设计

### 1.1 用户中心

用户中心页面支持四个功能模块：
购买记录、售出记录、我的举报。

### 1.2 组件职责划分

- MainLayout 负责整体页面框架
`;

  try {
    const result = await aiService.fixDocuments(
      {
        title: '校园二手交易平台',
        description: '面向校园用户的闲置交易系统',
        domain: 'SE',
        objectives: '提升文档一致性',
        techStack: ['Vue 3', 'Node.js']
      },
      { FRONTEND: original },
      findings
    );

    const fixed = result.documents.get('FRONTEND');
    assert.ok(fixed);
    assert.equal(fetchCount, 0);
    assert.equal(result.unresolved.length, 0);
    assert.match(fixed, /我的发布/);
    assert.match(fixed, /我的收藏/);
    assert.match(fixed, /### 1\.2 组件职责划分/);
    assert.doesNotMatch(fixed, /审核修订记录|审核修订/);
  } finally {
    global.fetch = originalFetch;
    delete process.env.MINIMAX_API_KEY;
    delete process.env.MINIMAX_BASE_URL;
  }
});

test('fixDocuments returns unresolved items instead of appending trailing review notes when patch cannot be applied', async () => {
  process.env.MINIMAX_API_KEY = 'test-key';
  process.env.MINIMAX_BASE_URL = 'https://example.test/v1';
  delete process.env.MOCK_AI;

  const aiService = new AIService();
  const originalFetch = global.fetch;
  let fetchCount = 0;

  global.fetch = (async () => {
    fetchCount += 1;
    throw new Error('fix flow should not call external model');
  }) as typeof fetch;

  const findings: ReviewResult = {
    summary: '存在未能自动定位的问题',
    issues: [
      {
        id: 3,
        severity: 'warning',
        category: 'backend_vs_api',
        title: '订单状态章节需要补充取消原因',
        description: '后端文档缺少订单取消原因字段说明。',
        affectedDocTypes: [DocType.BACKEND],
        suggestion: '在订单状态章节补充取消原因字段说明',
        patchHints: [
          {
            docType: DocType.BACKEND,
            changeType: 'replace_section',
            targetHeadingPath: ['## 不存在的章节'],
            replacementContent: `## 不存在的章节

- 订单取消时记录取消原因`
          }
        ]
      }
    ]
  };

  const original = `# 后端技术文档

## 数据模型

- Order: id, status, amount
`;

  try {
    const result = await aiService.fixDocuments(
      {
        title: '校园二手交易平台',
        description: '面向校园用户的闲置交易系统',
        domain: 'SE',
        objectives: '提升文档一致性',
        techStack: ['Vue 3', 'Node.js']
      },
      { BACKEND: original },
      findings
    );

    const fixed = result.documents.get('BACKEND');
    assert.ok(fixed);
    assert.equal(fetchCount, 0);
    assert.equal(fixed, original.trim());
    assert.equal(result.unresolved.length, 1);
    assert.equal(result.unresolved[0]?.docType, DocType.BACKEND);
    assert.equal(result.unresolved[0]?.issueId, 3);
    assert.equal(result.unresolved[0]?.reason, 'target_heading_path_not_found');
    assert.match(result.unresolved[0]?.fallbackNote || '', /订单状态章节需要补充取消原因/);
    assert.doesNotMatch(fixed, /审核修订记录|审核修订/);
  } finally {
    global.fetch = originalFetch;
    delete process.env.MINIMAX_API_KEY;
    delete process.env.MINIMAX_BASE_URL;
  }
});
