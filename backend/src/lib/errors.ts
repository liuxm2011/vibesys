import type { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * Application-level error carrying an HTTP status. Thrown from route handlers
 * and translated to a JSON response by `asyncHandler` / the global `onError`.
 * Use this for *intended* failures (validation, auth, not-found, conflict);
 * unexpected errors fall through to a generic 500.
 */
export class AppError extends Error {
  constructor(public readonly status: ContentfulStatusCode, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const badRequest = (message: string) => new AppError(400, message);
export const unauthorized = (message: string) => new AppError(401, message);
export const forbidden = (message: string) => new AppError(403, message);
export const notFound = (message: string) => new AppError(404, message);
export const conflict = (message: string) => new AppError(409, message);
