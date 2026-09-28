import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, signSessionToken } from '@/lib/security';
import { logAuditEvent } from '@/lib/auth-service';
import { RoleType, UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`register_${ip}`, 10, 60000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Too many registration requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    // 2. Check if Registration is Enabled in System Settings
    const regSetting = await prisma.systemSetting.findUnique({
      where: { key: 'registration_enabled' },
    });
    if (regSetting && regSetting.value === 'false') {
      return NextResponse.json(
        { error: 'Public registration is currently disabled by the platform owner.' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { name, email, password } = body;

    // 3. Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: 'Full name must be at least 2 characters.' }, { status: 400 });
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with letters and numbers.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 4. Check Existing User
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    // 5. Hash Password (12 rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    // 6. Create User - Default Role USER (Security rule: Never allow user-submitted role)
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: RoleType.USER,
        status: UserStatus.ACTIVE,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // 7. Sign Session Token
    const token = signSessionToken({
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      name: newUser.name,
    });

    // 8. Log Audit Event
    await logAuditEvent({
      actor: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
      action: 'USER_REGISTERED',
      resourceType: 'USER',
      resourceId: newUser.id,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || 'Browser',
    });

    // 9. Return Response with Secure Cookie
    const response = NextResponse.json(
      {
        message: 'Account created successfully.',
        user: newUser,
        token,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: 'trackops_session',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: 'Internal server error processing registration.' }, { status: 500 });
  }
}
