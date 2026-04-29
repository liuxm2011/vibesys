import { Router, Request, Response } from 'express';
import { prisma } from '../index.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

// All user routes require authentication
router.use(authMiddleware);

/**
 * GET /api/user/api-setting
 * Get the current user's personal API setting
 */
router.get('/api-setting', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const setting = await prisma.userApiSetting.findUnique({
      where: { userId }
    });

    if (!setting) {
      return res.json({
        exists: false,
        setting: null
      });
    }

    // Mask API key for security
    const maskedKey = setting.apiKey
      ? `${setting.apiKey.slice(0, 8)}...${setting.apiKey.slice(-4)}`
      : '';

    res.json({
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
  } catch (error) {
    console.error('Get user API setting error:', error);
    res.status(500).json({ error: '获取API设置失败' });
  }
});

/**
 * PUT /api/user/api-setting
 * Save or update the current user's personal API setting
 */
router.put('/api-setting', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { baseURL, apiKey, model } = req.body;

    if (!baseURL) {
      return res.status(400).json({ error: 'API地址不能为空' });
    }
    if (!apiKey) {
      return res.status(400).json({ error: 'API Key不能为空' });
    }
    if (!model) {
      return res.status(400).json({ error: '请选择模型' });
    }

    const setting = await prisma.userApiSetting.upsert({
      where: { userId },
      update: { baseURL, apiKey, model },
      create: { userId, baseURL, apiKey, model }
    });

    res.json({
      message: 'API设置已保存',
      setting: {
        id: setting.id,
        baseURL: setting.baseURL,
        model: setting.model,
        updatedAt: setting.updatedAt
      }
    });
  } catch (error) {
    console.error('Save user API setting error:', error);
    res.status(500).json({ error: '保存API设置失败' });
  }
});

/**
 * POST /api/user/api-setting/test
 * Test the user's API connection
 */
router.post('/api-setting/test', async (req: Request, res: Response) => {
  try {
    const { baseURL, apiKey, model } = req.body;

    if (!baseURL || !apiKey || !model) {
      return res.status(400).json({ error: '请先填写完整的API配置' });
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
      return res.json({
        success: false,
        latencyMs,
        message: `API返回错误 ${response.status}: ${errorText.slice(0, 200)}`
      });
    }

    const data = await response.json() as any;
    const reply = data?.choices?.[0]?.message?.content || '';

    res.json({
      success: true,
      latencyMs,
      message: `连接成功 (${latencyMs}ms)`,
      response: reply.slice(0, 100)
    });
  } catch (error: any) {
    res.json({
      success: false,
      latencyMs: 0,
      message: `连接失败: ${error?.message || '未知错误'}`
    });
  }
});

export default router;
