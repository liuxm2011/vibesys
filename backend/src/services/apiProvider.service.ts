import { PrismaClient } from '../generated/prisma';

export interface ProviderConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  providerType: string;
  name: string;
  fromDatabase: boolean;
}

class ApiProviderService {
  /**
   * Get Prisma client from caller context.
   * Workers environment requires prisma to be passed via c.get('prisma').
   * If no prisma provided, fall back to environment-only config (no DB queries).
   */
  private getPrisma(p?: PrismaClient): PrismaClient | null {
    return p || null;
  }

  async getEffectiveConfig(prisma?: PrismaClient, env?: { MINIMAX_BASE_URL?: string; MINIMAX_API_KEY?: string; MINIMAX_MODEL?: string }): Promise<ProviderConfig> {
    const p = this.getPrisma(prisma as any);

    // If prisma is available, try to get config from database first
    if (p) {
      const activeProvider = await p.apiProvider.findFirst({
        where: { isActive: true },
        orderBy: { updatedAt: 'desc' }
      });

      if (activeProvider) {
        console.log(`[ApiProvider] Using active provider from DB: "${activeProvider.name}" (${activeProvider.providerType})`);
        return {
          baseURL: activeProvider.baseURL,
          apiKey: activeProvider.apiKey,
          model: activeProvider.model,
          providerType: activeProvider.providerType,
          name: activeProvider.name,
          fromDatabase: true,
        };
      }
    }

    // Fall back to environment variables (works in both Node.js and Workers)
    console.log('[ApiProvider] No active provider in DB, falling back to environment variables');
    return {
      baseURL: env?.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1',
      apiKey: env?.MINIMAX_API_KEY || '',
      model: env?.MINIMAX_MODEL || 'minimax-m2-7',
      providerType: 'minimax',
      name: 'Environment',
      fromDatabase: false,
    };
  }

  async getConfigForUser(prisma: PrismaClient | number, userIdOrEnv?: number | { MINIMAX_BASE_URL?: string; MINIMAX_API_KEY?: string; MINIMAX_MODEL?: string }, env?: { MINIMAX_BASE_URL?: string; MINIMAX_API_KEY?: string; MINIMAX_MODEL?: string }): Promise<ProviderConfig> {
    let p: PrismaClient | null;
    let userId: number | undefined;
    let effectiveEnv: { MINIMAX_BASE_URL?: string; MINIMAX_API_KEY?: string; MINIMAX_MODEL?: string } | undefined;

    if (typeof prisma === 'number') {
      p = this.getPrisma();
      userId = prisma;
      effectiveEnv = userIdOrEnv as any;
    } else {
      p = this.getPrisma(prisma);
      userId = userIdOrEnv as number;
      effectiveEnv = env;
    }

    // If prisma is available and userId exists, check user's personal settings
    if (p && userId) {
      const userSetting = await p.userApiSetting.findUnique({
        where: { userId }
      });

      if (userSetting?.apiKey && userSetting?.baseURL && userSetting?.model) {
        console.log(`[ApiProvider] Using personal API config for user ${userId}: "${userSetting.model}"`);
        return {
          baseURL: userSetting.baseURL,
          apiKey: userSetting.apiKey,
          model: userSetting.model,
          providerType: 'openai_compatible',
          name: `${userSetting.model} (个人设置)`,
          fromDatabase: true,
        };
      }
    }

    return this.getEffectiveConfig(p as any, effectiveEnv);
  }

  async isConfigured(prisma?: PrismaClient, env?: { MINIMAX_BASE_URL?: string; MINIMAX_API_KEY?: string; MINIMAX_MODEL?: string }): Promise<boolean> {
    const config = await this.getEffectiveConfig(prisma, env);
    return !!config.apiKey;
  }

  async getAllProviders(prisma?: PrismaClient) {
    const p = this.getPrisma(prisma as any);
    if (!p) return [];
    return p.apiProvider.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  async getProviderById(prisma: PrismaClient | number, idOrUndefined?: number) {
    const p = typeof prisma === 'number' ? this.getPrisma() : this.getPrisma(prisma);
    const id = typeof prisma === 'number' ? prisma : idOrUndefined!;
    if (!p) return null;
    return p.apiProvider.findUnique({ where: { id } });
  }

  async createProvider(prisma: PrismaClient, data: {
    name: string;
    providerType: string;
    baseURL: string;
    apiKey: string;
    model: string;
    description?: string;
    isActive?: boolean;
  }) {
    const { isActive, ...rest } = data;

    return prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.apiProvider.updateMany({
          where: { isActive: true },
          data: { isActive: false }
        });
      }

      const maxOrder = await tx.apiProvider.aggregate({
        _max: { orderIndex: true }
      });

      return tx.apiProvider.create({
        data: {
          ...rest,
          isActive: isActive || false,
          orderIndex: (maxOrder._max.orderIndex ?? -1) + 1
        }
      });
    });
  }

  async updateProvider(
    prisma: PrismaClient,
    id: number,
    data: {
      name?: string;
      providerType?: string;
      baseURL?: string;
      apiKey?: string;
      model?: string;
      description?: string;
      isActive?: boolean;
    }
  ) {
    const { isActive, ...rest } = data;

    return prisma.$transaction(async (tx) => {
      if (isActive) {
        await tx.apiProvider.updateMany({
          where: { isActive: true, id: { not: id } },
          data: { isActive: false }
        });
      }

      return tx.apiProvider.update({
        where: { id },
        data: {
          ...rest,
          ...(isActive !== undefined ? { isActive } : {})
        }
      });
    });
  }

  async deleteProvider(prisma: PrismaClient, id: number) {
    return prisma.apiProvider.delete({ where: { id } });
  }

  async setActiveProvider(prisma: PrismaClient, id: number) {
    return prisma.$transaction(async (tx) => {
      await tx.apiProvider.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });

      return tx.apiProvider.update({
        where: { id },
        data: { isActive: true }
      });
    });
  }

  async testProviderConnection(prisma: PrismaClient | number, idOrUndefined?: number): Promise<{
    success: boolean;
    latencyMs: number;
    message: string;
  }> {
    const p = typeof prisma === 'number' ? this.getPrisma() : this.getPrisma(prisma);
    const id = typeof prisma === 'number' ? prisma : idOrUndefined!;

    if (!p) {
      return { success: false, latencyMs: 0, message: 'Database not available' };
    }

    const provider = await p.apiProvider.findUnique({ where: { id } });
    if (!provider) {
      return { success: false, latencyMs: 0, message: 'Provider not found' };
    }

    const startTime = Date.now();
    try {
      const response = await fetch(`${provider.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: 'Say "Hello" and nothing else.' }
          ],
          max_tokens: 10,
          temperature: 0,
        }),
        signal: AbortSignal.timeout(30000),
      });

      const latencyMs = Date.now() - startTime;

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          latencyMs,
          message: `API returned ${response.status}: ${errorText.slice(0, 200)}`
        };
      }

      const data = await response.json() as any;
      const reply = data?.choices?.[0]?.message?.content || '';

      return {
        success: true,
        latencyMs,
        message: `连接成功 (${latencyMs}ms)，响应: "${reply.slice(0, 50)}"`
      };
    } catch (error: any) {
      const latencyMs = Date.now() - startTime;
      return {
        success: false,
        latencyMs,
        message: `连接失败: ${error?.message || 'Unknown error'}`
      };
    }
  }
}

export const apiProviderService = new ApiProviderService();
