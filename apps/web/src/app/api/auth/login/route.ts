import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, signSessionToken } from '@/lib/security';
import { logAuditEvent } from '@/lib/auth-service';
import { UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';

    // 1. Rate Limiting to prevent Brute-Force attacks (5 attempts per minute per IP)
    const rate = checkRateLimit(`login_${ip}`, 10, 60000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 1 minute before trying again.' },
        { status: 429 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Query User
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // 3. Verify Account Status
    if (user.status === UserStatus.SUSPENDED) {
      await logAuditEvent({
        actor: { id: user.id, name: user.name, email: user.email, role: user.role },
        action: 'FAILED_LOGIN_SUSPENDED',
        resourceType: 'USER',
        resourceId: user.id,
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || 'Browser',
        details: { reason: user.suspensionReason || 'Account suspended by administrator' },
      });

      return NextResponse.json(
        { error: 'This account has been suspended. Reason: ' + (user.suspensionReason || 'Contact platform administration.') },
        { status: 403 }
      );
    }

    // 4. Verify Password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      await logAuditEvent({
        actor: { id: user.id, name: user.name, email: user.email, role: user.role },
        action: 'FAILED_LOGIN_BAD_CREDENTIALS',
        resourceType: 'USER',
        resourceId: user.id,
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || 'Browser',
      });

      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // 5. Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // 6. Sign JWT
    const token = signSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      name: user.name,
    });

    // 7. Record Session in Database
    await prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: token.substring(token.length - 32), // Store unique signature fragment
        ipAddress: ip,
        userAgent: req.headers.get('user-agent') || 'Browser',
        expiresAt: new Date(Date.now() + 86400000), // 24h
      },
    });

    // 8. Log Successful Audit Event
    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'USER_LOGIN_SUCCESS',
      resourceType: 'USER',
      resourceId: user.id,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || 'Browser',
    });

    // 9. Clean response data (Never expose password hash)
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
    };

    const response = NextResponse.json(
      {
        message: 'Login successful.',
        user: safeUser,
        token,
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'trackops_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400,
    });

    return response;
  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json({ error: 'Internal server error processing login.' }, { status: 500 });
  }
}
