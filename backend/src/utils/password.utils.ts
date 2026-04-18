import bcrypt from 'bcryptjs';

const BCRYPT_ROUNDS = 10;  // Standard for production (RESEARCH.md recommendation)

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