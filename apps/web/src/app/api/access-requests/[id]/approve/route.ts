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

    // Role check: Regular user cannot approve ANY request
    if (user.role === RoleType.USER) {
      return NextResponse.json(
        { error: 'Forbidden. Regular users cannot approve access requests.' },
        { status: 403 }
      );
    }

    // Find the request
    const request = await prisma.accessRequest.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Access request not found.' }, { status: 404 });
    }

    // User cannot approve their own request even if they hold admin credentials
    if (request.userId === user.id) {
      return NextResponse.json(
        { error: 'Security violation: You cannot approve your own access request.' },
        { status: 403 }
      );
    }

    if (request.status !== RequestStatus.PENDING) {
      return NextResponse.json(
        { error: `This request cannot be approved because its current status is '${request.status}'.` },
        { status: 400 }
      );
    }

    // Scope check: Admin must be authorized for this specific feature
    const scopeCheck = await verifyAdminFeatureScope(user.id, user.role, request.featureKey, 'APPROVE');
    if (!scopeCheck.allowed) {
      return NextResponse.json({ error: scopeCheck.reason }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const decisionReason = body.decisionReason || 'Approved following legitimate operational verification.';
    const expiresInDays = body.expiresInDays ? parseInt(body.expiresInDays, 10) : 30;
    const grantedExpiry = new Date(Date.now() + expiresInDays * 86400000);

    // Atomic Database Transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Update Request
      const updatedReq = await tx.accessRequest.update({
        where: { id: request.id },
        data: {
          status: RequestStatus.APPROVED,
          reviewedById: user.id,
          reviewedByName: user.name,
          reviewedAt: new Date(),
          decisionReason,
          grantedExpiry,
        },
      });

      // 2. Upsert UserFeaturePermission
      const permission = await tx.userFeaturePermission.upsert({
        where: {
          userId_featureKey: {
            userId: request.userId,
            featureKey: request.featureKey,
          },
        },
        update: {
          status: RequestStatus.APPROVED,
          grantedBy: user.id,
          grantedByName: user.name,
          grantedAt: new Date(),
          expiresAt: grantedExpiry,
          revokedAt: null,
          revocationReason: null,
          requestId: request.id,
        },
        create: {
          userId: request.userId,
          featureKey: request.featureKey,
          status: RequestStatus.APPROVED,
          grantedBy: user.id,
          grantedByName: user.name,
          grantedAt: new Date(),
          expiresAt: grantedExpiry,
          requestId: request.id,
        },
      });

      // 3. Record Permission History
      await tx.permissionHistory.create({
        data: {
          userId: request.userId,
          featureKey: request.featureKey,
          action: user.role === RoleType.SUPER_ADMIN ? 'APPROVED_BY_OWNER' : 'APPROVED',
          actorId: user.id,
          actorName: user.name,
          actorRole: user.role,
          reason: decisionReason,
          metadata: JSON.stringify({ grantedExpiry, requestId: request.id }),
        },
      });

      return { updatedReq, permission };
    });

    // Send In-App Notification to User
    await createNotification({
      userId: request.userId,
      title: 'Access Request Approved',
      message: `Your request for ${request.featureKey} has been approved by ${user.name}. Reason: ${decisionReason}`,
      type: 'REQUEST_APPROVED',
      link: `/dashboard/features`,
    });

    // Record Audit Log
    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'ACCESS_REQUEST_APPROVED',
      resourceType: 'ACCESS_REQUEST',
      resourceId: request.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: {
        featureKey: request.featureKey,
        targetUserId: request.userId,
        targetUserEmail: request.user.email,
        decisionReason,
        grantedExpiry,
      },
    });

    return NextResponse.json({
      message: `Access request for ${request.featureKey} approved successfully.`,
      request: result.updatedReq,
      permission: result.permission,
    });
  } catch (err: any) {
    console.error('Approve Access Request Error:', err);
    return NextResponse.json({ error: 'Failed to approve access request.' }, { status: 500 });
  }
}
