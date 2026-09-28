import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth-service';
import { prisma } from '@/lib/prisma';
import { RequestStatus, RoleType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // 1. Fetch user permissions (Active & Approved)
    const permissions = await prisma.userFeaturePermission.findMany({
      where: {
        userId: user.id,
        status: RequestStatus.APPROVED,
      },
      select: {
        id: true,
        featureKey: true,
        status: true,
        grantedAt: true,
        expiresAt: true,
        grantedByName: true,
      },
    });

    // 2. Fetch administrator scopes if Admin
    let adminScopes: Array<{ featureKey: string; canApprove: boolean; canRevoke: boolean }> = [];
    if (user.role === RoleType.ADMIN || user.role === RoleType.SUPER_ADMIN) {
      const scopes = await prisma.administratorScope.findMany({
        where: { adminId: user.id },
        select: {
          featureKey: true,
          canApprove: true,
          canRevoke: true,
        },
      });
      adminScopes = scopes;
    }

    // 3. Count unread notifications
    const unreadNotifications = await prisma.notification.count({
      where: { userId: user.id, isRead: false },
    });

    // 4. Count pending requests
    const pendingRequestsCount = await prisma.accessRequest.count({
      where: { userId: user.id, status: RequestStatus.PENDING },
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      permissions,
      adminScopes,
      unreadNotifications,
      pendingRequestsCount,
    });
  } catch (error: any) {
    console.error('GET /api/auth/me Error:', error);
    return NextResponse.json({ error: 'Failed to retrieve session profile.' }, { status: 500 });
  }
}
