import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/security';
import { logAuditEvent } from '@/lib/auth-service';

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rate = checkRateLimit(`reset_pw_${ip}`, 5, 60000);
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const { token, newPassword } = body || {};

    if (!token || !newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Valid reset token and password of at least 8 characters are required.' },
        { status: 400 }
      );
    }

    // Find verification token
    const tokenRecord = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!tokenRecord || tokenRecord.type !== 'PASSWORD_RESET' || new Date() > tokenRecord.expiresAt) {
      return NextResponse.json(
        { error: 'Password reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: tokenRecord.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User associated with token not found.' }, { status: 400 });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update password, invalidate all existing user sessions, and delete the token
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.userSession.updateMany({
        where: { userId: user.id },
        data: { isValid: false },
      }),
      prisma.verificationToken.delete({
        where: { id: tokenRecord.id },
      }),
    ]);

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'PASSWORD_RESET_SUCCESS',
      resourceType: 'USER',
      resourceId: user.id,
      ipAddress: ip,
      userAgent: req.headers.get('user-agent') || 'Browser',
    });

    return NextResponse.json({ message: 'Password has been reset successfully. Please log in.' });
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
