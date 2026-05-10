import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
  userId: number;
  studentId: string;
  name: string;
  role: 'STUDENT' | 'ADMIN';
}

export function signToken(payload: JwtPayload, secret: string): string {
  return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string, secret: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return null;
    }
    throw error;
  }
}

export function getJwtExpirationMs(): number {
  return 7 * 24 * 60 * 60 * 1000;
}
