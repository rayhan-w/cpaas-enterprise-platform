import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, logAuditEvent, createNotification } from '@/lib/auth-service';
import { RoleType, RequestStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const { searchParams } = new URL(req.url);
    const filterStatus = searchParams.get('status') as RequestStatus | null;

    let whereClause: any = {};
    if (filterStatus) {
      whereClause.status = filterStatus;
    }

    // Role-based visibility
    if (user.role === RoleType.SUPER_ADMIN) {
      // Super Admin sees all requests
    } else if (user.role === RoleType.ADMIN) {
      // Admin sees requests matching their assigned scopes
      const scopes = await prisma.administratorScope.findMany({
        where: { adminId: user.id },
        select: { featureKey: true },
      });
      const allowedFeatures = scopes.map((s) => s.featureKey);
      whereClause.featureKey = { in: allowedFeatures };
    } else {
      // Regular user only sees their own requests
      whereClause.userId = user.id;
    }

    const requests = await prisma.accessRequest.findMany({
      where: whereClause,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true, status: true },
        },
        reviewedBy: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ requests });
  } catch (err: any) {
    console.error('GET /api/access-requests Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve access requests.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
    }

    const { featureKey, purpose, requestedExpiryDays } = body;

    // Allowed sensitive features
    const validFeatures = [
      'FEATURE_CAMERA',
      'FEATURE_LOCATION',
      'FEATURE_EXPORT',
      'FEATURE_INVESTIGATION',
      'FEATURE_ANALYTICS_PRO',
    ];

    if (!featureKey || !validFeatures.includes(featureKey)) {
      return NextResponse.json(
        { error: `Invalid feature requested. Valid options: ${validFeatures.join(', ')}` },
        { status: 400 }
      );
    }

    if (!purpose || typeof purpose !== 'string' || purpose.trim().length < 5) {
      return NextResponse.json(
        { error: 'A clear business purpose / justification (at least 5 characters) is required.' },
        { status: 400 }
      );
    }

    // Prevent duplicate pending requests for the same user and feature
    const existingPending = await prisma.accessRequest.findFirst({
      where: {
        userId: user.id,
        featureKey,
        status: RequestStatus.PENDING,
      },
    });

    if (existingPending) {
      return NextResponse.json(
        { error: 'You already have an open pending access request for this feature. Please wait for review.' },
        { status: 409 }
      );
    }

    // Check if user already has an active approved permission
    const existingActive = await prisma.userFeaturePermission.findUnique({
      where: {
        userId_featureKey: {
          userId: user.id,
          featureKey,
        },
      },
    });

    if (existingActive && existingActive.status === RequestStatus.APPROVED) {
      if (!existingActive.expiresAt || existingActive.expiresAt > new Date()) {
        return NextResponse.json(
          { error: 'You already have an active approved permission for this feature.' },
          { status: 400 }
        );
      }
    }

    const requestedExpiry = requestedExpiryDays
      ? new Date(Date.now() + requestedExpiryDays * 86400000)
      : new Date(Date.now() + 30 * 86400000);

    const newRequest = await prisma.accessRequest.create({
      data: {
        userId: user.id,
        featureKey,
        purpose: purpose.trim(),
        status: RequestStatus.PENDING,
        requestedExpiry,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    // Record permission history
    await prisma.permissionHistory.create({
      data: {
        userId: user.id,
        featureKey,
        action: 'REQUESTED',
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        reason: purpose.trim(),
      },
    });

    // Notify authorized administrators and Super Admin
    const authorizedAdmins = await prisma.administratorScope.findMany({
      where: { featureKey, canApprove: true },
      select: { adminId: true },
    });

    for (const adm of authorizedAdmins) {
      await createNotification({
        userId: adm.adminId,
        title: 'New Access Request Pending',
        message: `${user.name} submitted an access request for ${featureKey}.`,
        type: 'SYSTEM',
        link: '/admin/requests',
      });
    }

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'ACCESS_REQUEST_SUBMITTED',
      resourceType: 'ACCESS_REQUEST',
      resourceId: newRequest.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { featureKey, purpose: purpose.trim() },
    });

    return NextResponse.json({ message: 'Access request submitted for administrative review.', request: newRequest }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/access-requests Error:', err);
    return NextResponse.json({ error: 'Failed to submit access request.' }, { status: 500 });
  }
}
