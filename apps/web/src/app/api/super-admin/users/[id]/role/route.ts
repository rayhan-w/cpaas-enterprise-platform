import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireRole, logAuditEvent } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // Strictly enforce Super Admin role
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

    // Protection rule: Super Admin cannot downgrade themselves
    if (targetUser.id === user.id) {
      return NextResponse.json(
        { error: 'Security Protection: The Super Admin cannot modify or downgrade their own role.' },
        { status: 400 }
      );
    }

    // Protection rule: If target is another Super Admin, prevent accidental downgrade
    if (targetUser.role === RoleType.SUPER_ADMIN) {
      return NextResponse.json(
        { error: 'Security Protection: Cannot downgrade a Super Admin owner account directly.' },
        { status: 400 }
      );
    }

    const body = await req.json().catch(() => null);
    const newRole = body?.role as RoleType;

    if (!newRole || !Object.values(RoleType).includes(newRole)) {
      return NextResponse.json({ error: 'Invalid role specified.' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: targetUser.id },
      data: { role: newRole },
      select: { id: true, name: true, email: true, role: true, status: true },
    });

    // Invalidate user sessions to enforce immediate role update on backend
    await prisma.userSession.updateMany({
      where: { userId: targetUser.id },
      data: { isValid: false },
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'ROLE_MODIFIED',
      resourceType: 'USER',
      resourceId: targetUser.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { previousRole: targetUser.role, newRole },
    });

    return NextResponse.json({ message: `Role updated to ${newRole}.`, user: updated });
  } catch (err: any) {
    console.error('PATCH /api/super-admin/users/[id]/role Error:', err);
    return NextResponse.json({ error: 'Failed to update user role.' }, { status: 500 });
  }
}
