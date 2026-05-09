import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

/**
 * Login endpoint rate limiter - 20 attempts per minute per IP+studentId
 * Prevents brute force attacks
 */
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: { error: '登录尝试次数过多，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const studentId = req.body.studentId || 'unknown';
    return `${ipKeyGenerator(req.ip ?? '')}:${studentId}`;
  }
});

/**
 * General API rate limiter - 1000 requests per 15 minutes
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: { error: '请求过于频繁，请稍后再试' },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * AI generation rate limiter - 10 requests per hour per user
 * Prevents API quota exhaustion
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { error: 'AI生成次数已达上限，请稍后再试' },
  keyGenerator: (req) => req.user?.userId?.toString() || ipKeyGenerator(req.ip ?? '') || 'unknown'
});

/**
 * Document update rate limiter - 30 updates per minute
 */
export const documentUpdateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: { error: '操作过于频繁，请稍后再试' }
});