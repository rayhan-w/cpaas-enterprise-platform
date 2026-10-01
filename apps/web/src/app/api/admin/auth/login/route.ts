import { NextResponse } from 'next/server';
import { signAdminToken, verifyPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Default master admin account check
    const normalizedEmail = email.toLowerCase().trim();
    const isMasterEmail =
      normalizedEmail === 'jawatamart3@gmail.com' ||
      normalizedEmail === 'jawatamart@gmail.com' ||
      normalizedEmail === 'admin@jawatamart.com' ||
      normalizedEmail === 'admin@jawata.com' ||
      normalizedEmail === 'admin@nurtura.com.bd' ||
      normalizedEmail === 'admin@trackops.dev' ||
      normalizedEmail === 'superadmin@trackops.dev';

    const isMasterPassword =
      password === 'admin123456' ||
      password === 'Admin@JawataMart2026!' ||
      password === 'Admin@TrackOps2026!';

    if (!isMasterEmail || !isMasterPassword) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const adminUser = {
      id: 'admin_master_1',
      email: normalizedEmail,
      name: 'Md. Abdur Rahim (Jawata Mart)',
      role: 'SUPERADMIN',
    };

    const token = signAdminToken(adminUser);

    const response = NextResponse.json({
      success: true,
      token,
      admin: adminUser,
    });

    response.cookies.set('nurtura_admin_token', token, {
      httpOnly: false, // accessible to client for Authorization header
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
