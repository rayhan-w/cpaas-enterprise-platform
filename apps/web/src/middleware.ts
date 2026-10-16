import { NextResponse, type NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'nurtura_bangladesh_super_secret_admin_jwt_key_2026';

async function verifyAdminJwt(token: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    const [headerB64, payloadB64, sigB64] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(JWT_SECRET),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = enc.encode(`${headerB64}.${payloadB64}`);
    const sigBinary = Uint8Array.from(
      atob(sigB64.replace(/-/g, '+').replace(/_/g, '/')),
      (c) => c.charCodeAt(0)
    );

    const isValid = await crypto.subtle.verify('HMAC', key, sigBinary, data);
    if (!isValid) return false;

    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'))
    );
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Page Protection: /admin/:path* (excluding /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const cookieToken = request.cookies.get('nurtura_admin_token')?.value;
    const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = cookieToken || authHeader;

    if (!token || !(await verifyAdminJwt(token))) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Admin API Endpoint Protection: /api/admin/:path* (excluding /api/admin/auth/login)
  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/auth/login')) {
    const cookieToken = request.cookies.get('nurtura_admin_token')?.value;
    const authHeader = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = cookieToken || authHeader;

    if (!token || !(await verifyAdminJwt(token))) {
      return NextResponse.json(
        { error: 'Unauthorized. Valid admin session or bearer token required.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
