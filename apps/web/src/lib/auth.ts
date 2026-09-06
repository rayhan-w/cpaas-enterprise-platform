import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'nurtura_bangladesh_super_secret_admin_jwt_key_2026';
const JWT_EXPIRES_IN = '7d';

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAdminToken(payload: { id: string; email: string; role: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyAdminToken(token: string): { id: string; email: string; role: string; name: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string; name: string };
  } catch {
    return null;
  }
}
