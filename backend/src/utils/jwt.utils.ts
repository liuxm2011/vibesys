import { sign, verify } from 'hono/utils/jwt/jwt';

const JWT_EXPIRATION_SECONDS = 7 * 24 * 60 * 60;

export interface JwtPayload {
  userId: number;
  studentId: string;
  name: string;
  role: 'STUDENT' | 'ADMIN' | 'VIEWER';
}

export async function signToken(payload: JwtPayload, secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return sign(
    {
      ...payload,
      iat: now,
      exp: now + JWT_EXPIRATION_SECONDS,
    },
    secret
  );
}

export async function verifyToken(token: string, secret: string): Promise<JwtPayload | null> {
  try {
    const decoded = await verify(token, secret, 'HS256');
    return decoded as unknown as JwtPayload;
  } catch {
    return null;
  }
}

export function getJwtExpirationMs(): number {
  return JWT_EXPIRATION_SECONDS * 1000;
}
