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

    const auth = requireRole(user, [RoleType.SUPER_ADMIN]);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const targetAdmin = await prisma.user.findUnique({
      where: { id },
      include: { adminScopes: true },
    });

    if (!targetAdmin) {
      return NextResponse.json({ error: 'Administrator user not found.' }, { status: 404 });
    }

    if (targetAdmin.role !== RoleType.ADMIN) {
      return NextResponse.json({ error: 'Target user does not have administrator role.' }, { status: 400 });
    }

    const body = await req.json().catch(() => null);
    const { scopes } = body || {};

    if (!Array.isArray(scopes)) {
      return NextResponse.json({ error: 'Scopes array is required.' }, { status: 400 });
    }

    // Replace scopes in transaction
    await prisma.$transaction(async (tx) => {
      await tx.administratorScope.deleteMany({
        where: { adminId: targetAdmin.id },
      });

      for (const sc of scopes) {
        const featureKey = typeof sc === 'string' ? sc : sc.featureKey;
        const canApprove = sc.canApprove !== undefined ? Boolean(sc.canApprove) : true;
        const canRevoke = sc.canRevoke !== undefined ? Boolean(sc.canRevoke) : true;

        await tx.administratorScope.create({
          data: {
            adminId: targetAdmin.id,
            featureKey,
            canApprove,
            canRevoke,
            assignedBy: user.id,
          },
        });
      }
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'ADMIN_PERMISSIONS_UPDATED',
      resourceType: 'USER',
      resourceId: targetAdmin.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { adminEmail: targetAdmin.email, updatedScopes: scopes },
    });

    const updatedScopes = await prisma.administratorScope.findMany({
      where: { adminId: targetAdmin.id },
    });

    return NextResponse.json({ message: 'Administrator approval scopes updated.', scopes: updatedScopes });
  } catch (err: any) {
    console.error('PATCH /api/super-admin/admins/[id]/permissions Error:', err);
    return NextResponse.json({ error: 'Failed to update administrator scopes.' }, { status: 500 });
  }
}
