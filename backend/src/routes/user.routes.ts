import { Hono } from 'hono';
import { authMiddleware, viewerBlockMiddleware } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../lib/handler.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

router.use('*', authMiddleware);

router.get('/api-setting', asyncHandler('获取API设置失败', async (c) => {
  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;
  const setting = await prisma.userApiSetting.findUnique({
    where: { userId }
  });

  if (!setting) {
    return c.json({
      exists: false,
      setting: null
    });
  }

  const maskedKey = setting.apiKey
    ? `${setting.apiKey.slice(0, 8)}...${setting.apiKey.slice(-4)}`
    : '';

  return c.json({
    exists: true,
    setting: {
      id: setting.id,
      baseURL: setting.baseURL,
      apiKey: maskedKey,
      model: setting.model,
      hasRealKey: !!setting.apiKey,
      updatedAt: setting.updatedAt
    }
  });
}));

router.delete('/api-setting', viewerBlockMiddleware, asyncHandler('清除API设置失败', async (c) => {
  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;

  await prisma.userApiSetting.deleteMany({ where: { userId } });
  return c.json({ message: '个人 API 设置已清除，已恢复使用系统默认 API' });
}));

router.put('/api-setting', viewerBlockMiddleware, asyncHandler('保存API设置失败', async (c) => {
  const user = c.get('user');
  const prisma = c.get('prisma');
  const userId = user.userId;
  const { baseURL, apiKey, model } = await c.req.json();

  if (!baseURL) {
    return c.json({ error: 'API地址不能为空' }, 400);
  }
  if (!model) {
    return c.json({ error: '请选择模型' }, 400);
  }

  let finalApiKey = apiKey;
  if (!finalApiKey) {
    const existing = await prisma.userApiSetting.findUnique({ where: { userId } });
    if (!existing) {
      return c.json({ error: '首次设置必须提供 API Key' }, 400);
    }
    finalApiKey = existing.apiKey;
  }

  const setting = await prisma.userApiSetting.upsert({
    where: { userId },
    update: { baseURL, apiKey: finalApiKey, model },
    create: { userId, baseURL: baseURL || '', apiKey: finalApiKey, model: model || '' }
  });

  return c.json({
    message: 'API设置已保存',
    setting: {
      id: setting.id,
      baseURL: setting.baseURL,
      model: setting.model,
      updatedAt: setting.updatedAt
    }
  });
}));

// Keeps its own try/catch: connection failures return a 200 { success: false } payload,
// not a 500, so it must not use asyncHandler.
router.post('/api-setting/test', viewerBlockMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const prisma = c.get('prisma');
    const userId = user.userId;
    let { baseURL, apiKey, model } = await c.req.json();

    if (apiKey === '__saved__') {
      const saved = await prisma.userApiSetting.findUnique({ where: { userId } });
      if (!saved?.apiKey) {
        return c.json({ success: false, latencyMs: 0, message: '未找到已保存的 API Key' });
      }
      apiKey = saved.apiKey;
      baseURL = baseURL || saved.baseURL;
      model = model || saved.model;
    }

    if (!baseURL || !apiKey || !model) {
      return c.json({ error: '请先填写完整的API配置' }, 400);
    }

    const startTime = Date.now();

    const response = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'user', content: 'Say hello in one word' }
        ],
        max_tokens: 10,
        temperature: 0,
      }),
      signal: AbortSignal.timeout(30000),
    });

    const latencyMs = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      return c.json({
        success: false,
        latencyMs,
        message: `API返回错误 ${response.status}: ${errorText.slice(0, 200)}`
      });
    }

    const data = await response.json() as any;
    const reply = data?.choices?.[0]?.message?.content || '';

    return c.json({
      success: true,
      latencyMs,
      message: `连接成功 (${latencyMs}ms)`,
      response: reply.slice(0, 100)
    });
  } catch (error: any) {
    return c.json({
      success: false,
      latencyMs: 0,
      message: `连接失败: ${error?.message || '未知错误'}`
    });
  }
});

export default router;
