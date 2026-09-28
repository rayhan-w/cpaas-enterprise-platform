import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'trackops_enterprise_production_secret_key_2026_x89f_vault';
const JWT_EXPIRES_IN = '24h';

export interface TokenPayload {
  userId: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
  status: string;
  name: string;
}

/**
 * Sign JWT token for authenticated session
 */
export function signSessionToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify JWT token and return decoded payload
 */
export function verifySessionToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

/**
 * Extract token from Authorization header or cookies
 */
export function extractTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  const cookieToken = req.cookies.get('trackops_session')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

/**
 * Salted SHA-256 hash for privacy-friendly visitor analytics.
 * Never stores raw IP addresses in the database.
 */
export function hashVisitorIp(ip: string, salt: string = 'trackops_telemetry_salt'): string {
  return crypto.createHash('sha256').update(`${ip}:${salt}`).digest('hex').substring(0, 32);
}

/**
 * Validate destination URLs to prevent Open Redirects, XSS, and SSRF attacks.
 */
export function validateDestinationUrl(urlStr: string): { isValid: boolean; error?: string; cleanUrl?: string } {
  if (!urlStr || typeof urlStr !== 'string') {
    return { isValid: false, error: 'Destination URL is required.' };
  }

  const trimmed = urlStr.trim();

  // Block dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return { isValid: false, error: 'URL contains an unsafe protocol scheme.' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { isValid: false, error: 'Malformed URL format. Must include protocol (e.g. https://).' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Only HTTP and HTTPS destination URLs are allowed.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // SSRF prevention: prevent pointing to loopback, link-local, private cloud metadata endpoints
  const blockedHosts = [
    'localhost',
    '127.0.0.1',
    '0.0.0.0',
    '169.254.169.254', // AWS/GCP/Azure instance metadata
    'metadata.google.internal',
    '::1',
  ];

  if (blockedHosts.includes(hostname)) {
    return { isValid: false, error: 'Destination hostname is restricted for security.' };
  }

  // Prevent private IP ranges (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
  if (
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
  ) {
    return { isValid: false, error: 'Private network addresses are not allowed as destinations.' };
  }

  return { isValid: true, cleanUrl: parsed.toString() };
}

/**
 * In-Memory Sliding-Window Rate Limiter for Authentication & API Endpoints
 */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetInMs: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetInMs: windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetInMs: entry.resetAt - now };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetInMs: entry.resetAt - now };
}
