import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.utils.js';

// Extend Express Request to include user property
declare module 'express' {
  interface Request {
    user?: JwtPayload;
  }
}

/**
 * Auth middleware that verifies JWT from httpOnly cookie (D-12)
 * Sets req.user with decoded payload if valid
 * Returns unified error message per D-20
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ error: '请先登录' });
    return;
  }

  const payload = verifyToken(token);

  if (!payload) {
    // Token expired or invalid - unified error per D-20
    res.status(401).json({ error: '登录已过期，请重新登录' });
    return;
  }

  // Attach user to request for downstream handlers
  req.user = payload;
  next();
}

/**
 * Admin-only middleware (checks role after auth)
 * Must be used after authMiddleware
 */
export function adminOnlyMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ error: '权限不足' });
    return;
  }
  next();
}