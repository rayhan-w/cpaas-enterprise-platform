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
      return NextResponse.json({ error: 'Unauthorized. Regular users cannot reject requests.' }, { status: 403 });
    }

    const request = await prisma.accessRequest.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!request) {
      return NextResponse.json({ error: 'Access request not found.' }, { status: 404 });
    }

    if (request.status !== RequestStatus.PENDING) {
      return NextResponse.json(
        { error: `This request cannot be rejected because its status is '${request.status}'.` },
        { status: 400 }
      );
    }

    // Verify scope
    const scopeCheck = await verifyAdminFeatureScope(user.id, user.role, request.featureKey, 'APPROVE');
    if (!scopeCheck.allowed) {
      return NextResponse.json({ error: scopeCheck.reason }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const decisionReason = body.decisionReason?.trim() || 'Access denied based on security and operational review.';

    // Execute atomic rejection
    const updated = await prisma.$transaction(async (tx) => {
      const r = await tx.accessRequest.update({
        where: { id: request.id },
        data: {
          status: RequestStatus.REJECTED,
          reviewedById: user.id,
          reviewedByName: user.name,
          reviewedAt: new Date(),
          decisionReason,
        },
      });

      await tx.permissionHistory.create({
        data: {
          userId: request.userId,
          featureKey: request.featureKey,
          action: 'REJECTED',
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          reason: decisionReason,
        },
      });

      return r;
    });

    // Notify user
    await createNotification({
      userId: request.userId,
      title: 'Access Request Rejected',
      message: `Your request for ${request.featureKey} was rejected. Reason: ${decisionReason}`,
      type: 'REQUEST_REJECTED',
      link: '/dashboard/requests',
    });

    // Log audit event
    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'ACCESS_REQUEST_REJECTED',
      resourceType: 'ACCESS_REQUEST',
      resourceId: request.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: {
        featureKey: request.featureKey,
        targetUserId: request.userId,
        targetUserEmail: request.user.email,
        decisionReason,
      },
    });

    return NextResponse.json({ message: 'Request rejected.', request: updated });
  } catch (err: any) {
    console.error('Reject Access Request Error:', err);
    return NextResponse.json({ error: 'Failed to reject access request.' }, { status: 500 });
  }
}
