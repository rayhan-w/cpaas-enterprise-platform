import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, logAuditEvent } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

export async function DELETE(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // Protection rule: Super Admin cannot delete account
    if (user.role === RoleType.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Security Protection: The Super Admin owner account cannot be deleted.' },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const { confirmationPassword } = body || {};

    if (!confirmationPassword) {
      return NextResponse.json({ error: 'Password confirmation is required to delete your account.' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const isValid = await bcrypt.compare(confirmationPassword, dbUser.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password confirmation.' }, { status: 400 });
    }

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'USER_ACCOUNT_DELETED_BY_SELF',
      resourceType: 'USER',
      resourceId: user.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
    });

    // Delete user and associated cascade relations
    await prisma.user.delete({ where: { id: user.id } });

    const response = NextResponse.json({ message: 'Account deleted successfully.' });
    response.cookies.set({
      name: 'trackops_session',
      value: '',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (err: any) {
    console.error('Account deletion error:', err);
    return NextResponse.json({ error: 'Failed to delete account.' }, { status: 500 });
  }
}
