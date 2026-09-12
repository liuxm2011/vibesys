import { test, expect } from 'vitest';
import type { PrismaClient } from '../src/generated/prisma';
import { AIService } from '../src/services/ai.service.js';

/**
 * 回归测试：修复 B —— Provider 解析静默降级（userId 透传）。
 *
 * 断言口径：当传入 userId 时，模型请求必须命中「用户个人设置」的
 * baseURL / apiKey；不传 userId 时回退到系统配置。若透传链路再次断掉
 * （例如 executeWithRetry 漏传 userId），前者的断言会失败。
 */

const PERSONAL = {
  baseURL: 'https://personal.example.test/v1',
  apiKey: 'personal-key',
  model: 'personal-model'
};

const SYSTEM_ENV = {
  MINIMAX_API_KEY: 'system-key',
  MINIMAX_BASE_URL: 'https://system.example.test/v1',
  MINIMAX_MODEL: 'system-model'
};

/** 桩 Prisma：仅当 userId 命中时返回个人设置，且 DB 中无启用的 provider。 */
function stubPrisma(personalUserId: number): PrismaClient {
  return {
    apiProvider: { findFirst: async () => null },
    userApiSetting: {
      findUnique: async ({ where }: { where?: { userId?: number } }) =>
        where?.userId === personalUserId ? { userId: personalUserId, ...PERSONAL } : null
    }
  } as unknown as PrismaClient;
}

function chatResponse(content: string): Response {
  return new Response(
    JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content } }] }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

const topicInfo = {
  title: '校园二手交易平台',
  description: '面向校园用户的闲置交易系统',
  domain: 'SE' as const,
  platform: 'WEB' as const,
  objectives: '提升文档一致性',
  techStack: ['Vue 3', 'Node.js']
};

interface CapturedCall {
  url: string;
  auth: string | undefined;
}

function installFetchCapture(handler: (callIndex: number) => Response): {
  calls: CapturedCall[];
  restore: () => void;
} {
  const originalFetch = global.fetch;
  const calls: CapturedCall[] = [];
  let n = 0;
  global.fetch = (async (input: unknown, init?: { headers?: Record<string, string> }) => {
    calls.push({ url: String(input), auth: init?.headers?.Authorization });
    const response = handler(n);
    n += 1;
    return response;
  }) as typeof fetch;
  return { calls, restore: () => { global.fetch = originalFetch; } };
}

test('reviewDocuments 传入 userId 时使用用户个人 API Key（而非系统 Key）', async () => {
  delete process.env.MOCK_AI;
  const userId = 4242;
  const prisma = stubPrisma(userId);
  const svc = new AIService();
  svc.setContext(prisma, SYSTEM_ENV);

  const capture = installFetchCapture(() =>
    chatResponse(JSON.stringify({ issues: [], summary: 'ok' }))
  );

  try {
    await svc.reviewDocuments(topicInfo, { BACKEND: '# 后端\n\n## API设计\n\n无' }, userId, prisma, SYSTEM_ENV);

    expect(capture.calls.length).toBe(1);
    expect(capture.calls[0].url).toBe('https://personal.example.test/v1/chat/completions');
    expect(capture.calls[0].auth).toBe('Bearer personal-key');
  } finally {
    capture.restore();
    delete process.env.MOCK_AI;
  }
});

test('reviewDocuments 不传 userId 时回退系统配置（还原修复前的静默降级行为基线）', async () => {
  delete process.env.MOCK_AI;
  const prisma = stubPrisma(4242);
  const svc = new AIService();
  svc.setContext(prisma, SYSTEM_ENV);

  const capture = installFetchCapture(() =>
    chatResponse(JSON.stringify({ issues: [], summary: 'ok' }))
  );

  try {
    await svc.reviewDocuments(topicInfo, { BACKEND: '# 后端\n\n## API设计\n\n无' });

    expect(capture.calls.length).toBe(1);
    expect(capture.calls[0].url).toBe('https://system.example.test/v1/chat/completions');
    expect(capture.calls[0].auth).toBe('Bearer system-key');
  } finally {
    capture.restore();
    delete process.env.MOCK_AI;
  }
});

test('patchHints 恢复的二级回退调用同样透传 userId', async () => {
  delete process.env.MOCK_AI;
  const userId = 4242;
  const prisma = stubPrisma(userId);
  const svc = new AIService();
  svc.setContext(prisma, SYSTEM_ENV);

  // 第一次返回「缺少 patchHint」的审核结果触发恢复；第二次返回补全结果。
  const capture = installFetchCapture((callIndex) => {
    if (callIndex === 0) {
      return chatResponse(JSON.stringify({
        issues: [{
          id: 7,
          severity: 'warning',
          category: 'prd_vs_backend',
          title: '后端缺少接口设计',
          description: '后端文档未补充报告调度接口。',
          affectedDocTypes: ['BACKEND'],
          suggestion: '补充接口',
          patchHints: []
        }],
        summary: '发现 1 个问题'
      }));
    }
    return chatResponse(JSON.stringify({
      patchHintsByIssueId: {
        '7': [{
          docType: 'BACKEND',
          changeType: 'replace_section',
          targetHeadingPath: ['## API设计'],
          replacementContent: '## API设计\n\n- GET /api/reports/schedules'
        }]
      }
    }));
  });

  try {
    await svc.reviewDocuments(topicInfo, { BACKEND: '# 后端\n\n## API设计\n\n无' }, userId, prisma, SYSTEM_ENV);

    // 两级调用（初次审核 + patchHints 恢复）都必须走个人配置。
    expect(capture.calls.length).toBe(2);
    for (const call of capture.calls) {
      expect(call.url).toBe('https://personal.example.test/v1/chat/completions');
      expect(call.auth).toBe('Bearer personal-key');
    }
  } finally {
    capture.restore();
    delete process.env.MOCK_AI;
  }
});
