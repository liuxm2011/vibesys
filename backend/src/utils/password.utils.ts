import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

const BCRYPT_ROUNDS = 10;  // Standard for production (RESEARCH.md recommendation)
export const ADMIN_DEFAULT_PASSWORD = 'admin123';
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_PASSWORD_LENGTH = 32;

/**
 * Hash password using bcrypt with 10 rounds (D-09)
 * @param password Plain text password
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Compare password against bcrypt hash (constant-time, D-09)
 * @param password Plain text password to check
 * @param hash Stored bcrypt hash
 * @returns true if match, false otherwise
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return '密码不能为空';
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `密码长度不能少于 ${MIN_PASSWORD_LENGTH} 位`;
  }

  if (password.length > MAX_PASSWORD_LENGTH) {
    return `密码长度不能超过 ${MAX_PASSWORD_LENGTH} 位`;
  }

  return null;
}

export async function getPasswordDisplayInfo(
  studentId: string,
  role: Role,
  hash: string
): Promise<{
  canReveal: boolean;
  revealedPassword: string | null;
  passwordStatus: 'DEFAULT' | 'CUSTOM';
  passwordHint: string;
}> {
  if (role === Role.ADMIN) {
    const isDefaultAdminPassword = await comparePassword(ADMIN_DEFAULT_PASSWORD, hash);

    return isDefaultAdminPassword
      ? {
          canReveal: true,
          revealedPassword: ADMIN_DEFAULT_PASSWORD,
          passwordStatus: 'DEFAULT',
          passwordHint: '当前仍为系统默认管理员密码'
        }
      : {
          canReveal: false,
          revealedPassword: null,
          passwordStatus: 'CUSTOM',
          passwordHint: '管理员密码已修改，系统不保存明文'
        };
  }

  const isStudentIdPassword = await comparePassword(studentId, hash);

  return isStudentIdPassword
    ? {
        canReveal: true,
        revealedPassword: studentId,
        passwordStatus: 'DEFAULT',
        passwordHint: '当前仍为默认密码（学号）'
      }
    : {
        canReveal: false,
        revealedPassword: null,
        passwordStatus: 'CUSTOM',
        passwordHint: '学生已修改密码，系统不保存明文'
      };
}
