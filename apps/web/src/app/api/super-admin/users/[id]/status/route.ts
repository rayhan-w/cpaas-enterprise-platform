import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireRole, logAuditEvent, createNotification } from '@/lib/auth-service';
import { RoleType, UserStatus } from '@prisma/client';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const auth = requireRole(user, [RoleType.SUPER_ADMIN]);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found.' }, { status: 404 });
    }

    // Protection rule: Super Admin cannot be suspended
    if (targetUser.role === RoleType.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Security Protection: The Super Admin owner account cannot be suspended.' },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const newStatus = body?.status as UserStatus;
    const reason = body?.reason?.trim() || (newStatus === UserStatus.SUSPENDED ? 'Administrative security policy enforcement.' : null);

    if (!newStatus || !Object.values(UserStatus).includes(newStatus)) {
      return NextResponse.json({ error: 'Invalid user status specified.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        status: newStatus,
        suspensionReason: newStatus === UserStatus.SUSPENDED ? reason : null,
      },
      select: { id: true, name: true, email: true, role: true, status: true, suspensionReason: true },
    });

    // If suspended, immediately revoke all active sessions!
    if (newStatus === UserStatus.SUSPENDED) {
      await prisma.userSession.updateMany({
        where: { userId: targetUser.id },
        data: { isValid: false },
      });
    }

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: newStatus === UserStatus.SUSPENDED ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      resourceType: 'USER',
      resourceId: targetUser.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { previousStatus: targetUser.status, newStatus, reason },
    });

    await createNotification({
      userId: targetUser.id,
      title: newStatus === UserStatus.SUSPENDED ? 'Account Suspended' : 'Account Reactivated',
      message: newStatus === UserStatus.SUSPENDED
        ? `Your account has been suspended: ${reason}`
        : 'Your account has been reactivated. You may now resume using TrackOps.',
      type: newStatus === UserStatus.SUSPENDED ? 'SECURITY_ALERT' : 'SYSTEM',
    });

    return NextResponse.json({ message: `Account status updated to ${newStatus}.`, user: updated });
  } catch (err: any) {
    console.error('PATCH /api/super-admin/users/[id]/status Error:', err);
    return NextResponse.json({ error: 'Failed to update account status.' }, { status: 500 });
  }
}
