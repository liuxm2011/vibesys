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
        suggestion: '在功能需求章节补充实名认证与交易状态流转'
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

    const fixed = result.get('PRD');
    assert.ok(fixed);
    assert.equal(fetchCount, 0);
    assert.match(fixed, /## 功能需求[\s\S]*### 审核修订[\s\S]*实名认证/);
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
        suggestion: '统一功能名称'
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
    assert.equal(result.get('API'), original.trim());
  } finally {
    global.fetch = originalFetch;
    delete process.env.MINIMAX_API_KEY;
    delete process.env.MINIMAX_BASE_URL;
  }
});

test('fixDocuments appends review notes to global record when no target section is found', async () => {
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
    summary: '存在整体一致性建议',
    issues: [
      {
        id: 1,
        severity: 'warning',
        category: 'overall',
        title: '术语需要统一',
        description: '全文需统一关键术语。',
        affectedDocTypes: [DocType.API],
        suggestion: '统一接口中的对象命名'
      }
    ]
  };

  const original = `# API 文档

本文档当前没有标准章节结构。
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
      { API: original },
      findings
    );

    const fixed = result.get('API');
    assert.ok(fixed);
    assert.equal(fetchCount, 0);
    assert.match(fixed, /## 审核修订记录/);
    assert.match(fixed, /统一接口中的对象命名/);
  } finally {
    global.fetch = originalFetch;
    delete process.env.MINIMAX_API_KEY;
    delete process.env.MINIMAX_BASE_URL;
  }
});
