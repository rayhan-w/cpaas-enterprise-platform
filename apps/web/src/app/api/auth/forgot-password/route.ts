import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security';
import { logAuditEvent } from '@/lib/auth-service';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`forgot_pw_${ip}`, 5, 60000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const email = body?.email;

    // Security rule: Always return generic success message to prevent user enumeration
    const genericResponse = NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been dispatched.',
    });

    if (!email || typeof email !== 'string') {
      return genericResponse;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return genericResponse;
    }

    // Generate cryptographic reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour

    await prisma.verificationToken.create({
      data: {
        email: normalizedEmail,
        token,
        type: 'PASSWORD_RESET',
        expiresAt,
      },
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'PASSWORD_RESET_REQUESTED',
      resourceType: 'USER',
      resourceId: user.id,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || 'Browser',
    });

    return genericResponse;
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request.' }, { status: 500 });
  }
}
