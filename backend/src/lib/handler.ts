import type { Context } from 'hono';
import type { AppEnv } from '../types.js';
import { AppError } from './errors.js';
import { logger } from './logger.js';

type Handler = (c: Context<AppEnv>) => Response | Promise<Response>;

/**
 * Wrap a route handler with centralized error handling.
 *
 * - An `AppError` thrown inside the handler becomes `{ error: message }` with its status.
 * - Any other thrown error is logged and returned as `{ error: fallbackMessage }` with 500,
 *   preserving each endpoint's original domain-specific failure message.
 *
 * Handlers that need bespoke catch logic (e.g. Prisma P2002 handling, SSE streams)
 * should keep their own try/catch rather than using this wrapper.
 */
export function asyncHandler(fallbackMessage: string, handler: Handler): Handler {
  return async (c: Context<AppEnv>) => {
    try {
      return await handler(c);
    } catch (error) {
      if (error instanceof AppError) {
        return c.json({ error: error.message }, error.status);
      }
      logger.error(`${fallbackMessage}:`, error);
      return c.json({ error: fallbackMessage }, 500);
    }
  };
}
