import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, logAuditEvent } from '@/lib/auth-service';

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Current password and a new password of at least 8 characters are required.' },
        { status: 400 }
      );
    }

    // Retrieve password hash
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const validCurrent = await bcrypt.compare(currentPassword, dbUser.passwordHash);
    if (!validCurrent) {
      return NextResponse.json({ error: 'Incorrect current password provided.' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      // Revoke older sessions
      prisma.userSession.updateMany({
        where: { userId: user.id },
        data: { isValid: false },
      }),
    ]);

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'PASSWORD_CHANGED',
      resourceType: 'USER',
      resourceId: user.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
    });

    return NextResponse.json({ message: 'Password updated successfully. Other active sessions revoked.' });
  } catch (err: any) {
    console.error('Password change error:', err);
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 });
  }
}
