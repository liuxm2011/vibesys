import { prisma } from '../index.js';

/**
 * API Provider Configuration returned to consumers
 */
export interface ProviderConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  providerType: string;
  name: string;
  /**
   * Whether this config comes from database (true) or environment fallback (false)
   */
  fromDatabase: boolean;
}

/**
 * Service for managing AI API provider configurations.
 *
 * Supports two modes:
 * 1. Database-managed: admin can CRUD providers and switch active one via admin UI
 * 2. Environment fallback: when no active provider exists in DB, reads from .env (MINIMAX_BASE_URL, etc.)
 */
class ApiProviderService {
  /**
   * Get the effective provider configuration.
   *
   * Priority:
   * 1. Active provider from database (isActive = true)
   * 2. Fallback to environment variables (MINIMAX_BASE_URL, MINIMAX_API_KEY, MINIMAX_MODEL)
   */
  async getEffectiveConfig(): Promise<ProviderConfig> {
    // Try database first
    const activeProvider = await prisma.apiProvider.findFirst({
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

    // Fallback to environment variables
    console.log('[ApiProvider] No active provider in DB, falling back to environment variables');
    return {
      baseURL: process.env.MINIMAX_BASE_URL || 'https://api.minimax.chat/v1',
      apiKey: process.env.MINIMAX_API_KEY || '',
      model: process.env.MINIMAX_MODEL || 'minimax-m2-7',
      providerType: 'minimax',
      name: 'Environment (.env)',
      fromDatabase: false,
    };
  }

  /**
   * Get the effective configuration for a specific user.
   *
   * Priority:
   * 1. User's personal API setting (if they configured one)
   * 2. Active provider from database (admin-configured)
   * 3. Fallback to environment variables
   */
  async getConfigForUser(userId: number): Promise<ProviderConfig> {
    // 1. Check user's personal API setting
    const userSetting = await prisma.userApiSetting.findUnique({
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

    // 2. Fall back to system-level config
    return this.getEffectiveConfig();
  }

  /**
   * Check if a valid provider configuration is available
   */
  async isConfigured(): Promise<boolean> {
    const config = await this.getEffectiveConfig();
    return !!config.apiKey;
  }

  // ============================================================
  // CRUD operations (for admin routes)
  // ============================================================

  /**
   * Get all API providers
   */
  async getAllProviders() {
    return prisma.apiProvider.findMany({
      orderBy: { orderIndex: 'asc' }
    });
  }

  /**
   * Get provider by ID
   */
  async getProviderById(id: number) {
    return prisma.apiProvider.findUnique({ where: { id } });
  }

  /**
   * Create a new API provider.
   * If `isActive` is true, all other providers will be deactivated first.
   */
  async createProvider(data: {
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
      // If setting as active, deactivate all others
      if (isActive) {
        await tx.apiProvider.updateMany({
          where: { isActive: true },
          data: { isActive: false }
        });
      }

      // Get max orderIndex
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

  /**
   * Update an existing API provider.
   * If `isActive` is set to true, all other providers will be deactivated first.
   */
  async updateProvider(
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
      // If setting as active, deactivate all others
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

  /**
   * Delete an API provider
   */
  async deleteProvider(id: number) {
    return prisma.apiProvider.delete({ where: { id } });
  }

  /**
   * Set a provider as the active provider.
   * Deactivates all other providers.
   */
  async setActiveProvider(id: number) {
    return prisma.$transaction(async (tx) => {
      // Deactivate all
      await tx.apiProvider.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      });

      // Activate the target provider
      return tx.apiProvider.update({
        where: { id },
        data: { isActive: true }
      });
    });
  }

  /**
   * Test a provider's API connection by making a simple chat completion request.
   * Returns the test result including latency.
   */
  async testProviderConnection(id: number): Promise<{
    success: boolean;
    latencyMs: number;
    message: string;
  }> {
    const provider = await prisma.apiProvider.findUnique({ where: { id } });
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
        signal: AbortSignal.timeout(30000), // 30s timeout for test
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
