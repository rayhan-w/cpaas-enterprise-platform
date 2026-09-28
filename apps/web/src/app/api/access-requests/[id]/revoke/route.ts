import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, verifyAdminFeatureScope, logAuditEvent, createNotification } from '@/lib/auth-service';
import { RoleType, RequestStatus } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    if (user.role === RoleType.USER) {
      return NextResponse.json({ error: 'Unauthorized. Regular users cannot revoke permissions.' }, { status: 403 });
    }

    const request = await prisma.accessRequest.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!request) {
      return NextResponse.json({ error: 'Access request not found.' }, { status: 404 });
    }

    // Check scope
    const scopeCheck = await verifyAdminFeatureScope(user.id, user.role, request.featureKey, 'REVOKE');
    if (!scopeCheck.allowed) {
      return NextResponse.json({ error: scopeCheck.reason }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const revocationReason = body.revocationReason?.trim() || 'Access revoked by administration.';

    // Immediate atomic revocation
    await prisma.$transaction(async (tx) => {
      // 1. Update Access Request
      await tx.accessRequest.update({
        where: { id: request.id },
        data: {
          status: RequestStatus.REVOKED,
          decisionReason: revocationReason,
        },
      });

      // 2. Immediately revoke UserFeaturePermission
      await tx.userFeaturePermission.updateMany({
        where: {
          userId: request.userId,
          featureKey: request.featureKey,
        },
        data: {
          status: RequestStatus.REVOKED,
          revokedAt: new Date(),
          revokedBy: user.id,
          revocationReason,
        },
      });

      // 3. Record Permission History
      await tx.permissionHistory.create({
        data: {
          userId: request.userId,
          featureKey: request.featureKey,
          action: 'REVOKED',
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          reason: revocationReason,
        },
      });
    });

    // Notify user
    await createNotification({
      userId: request.userId,
      title: 'Permission Revoked',
      message: `Your access permission for ${request.featureKey} has been revoked immediately. Reason: ${revocationReason}`,
      type: 'PERMISSION_REVOKED',
      link: '/dashboard/features',
    });

    // Audit log
    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'PERMISSION_REVOKED_IMMEDIATELY',
      resourceType: 'PERMISSION',
      resourceId: request.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: {
        featureKey: request.featureKey,
        targetUserId: request.userId,
        targetUserEmail: request.user.email,
        revocationReason,
      },
    });

    return NextResponse.json({ message: 'Permission has been revoked immediately.' });
  } catch (err: any) {
    console.error('Revoke Access Request Error:', err);
    return NextResponse.json({ error: 'Failed to revoke access permission.' }, { status: 500 });
  }
}
