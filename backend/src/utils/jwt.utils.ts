import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';  // D-11: 7-day validity

export interface JwtPayload {
  userId: number;
  studentId: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
}

/**
 * Sign JWT token with user payload (D-11)
 * @param payload User info to embed in token
 * @returns Signed JWT string
 */
export function signToken(payload: JwtPayload): string {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode JWT token
 * @param token JWT string to verify
 * @returns Decoded payload or null if invalid/expired
 */
export function verifyToken(token: string): JwtPayload | null {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET not configured');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // Token expired - caller should handle with redirect to login
      return null;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      // Invalid token
      return null;
    }
    throw error;  // Unexpected error
  }
}

/**
 * Get JWT expiration time in milliseconds (for cookie maxAge)
 * @returns 7 days in milliseconds (D-11)
 */
export function getJwtExpirationMs(): number {
  return 7 * 24 * 60 * 60 * 1000;  // 7 days
}