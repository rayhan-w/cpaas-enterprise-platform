import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireRole } from '@/lib/auth-service';
import { RoleType, UserStatus, RequestStatus, CaseStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // Strictly enforce Super Admin role
    const auth = requireRole(user, [RoleType.SUPER_ADMIN]);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    // Real-time aggregate metrics from database
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      totalAdmins,
      pendingRequests,
      approvedPermissions,
      revokedPermissions,
      activeLinks,
      totalEvents,
      activeCases,
      recentAuditLogs,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      prisma.user.count({ where: { status: UserStatus.SUSPENDED } }),
      prisma.user.count({ where: { role: { in: [RoleType.ADMIN, RoleType.SUPER_ADMIN] } } }),
      prisma.accessRequest.count({ where: { status: RequestStatus.PENDING } }),
      prisma.userFeaturePermission.count({ where: { status: RequestStatus.APPROVED } }),
      prisma.userFeaturePermission.count({ where: { status: RequestStatus.REVOKED } }),
      prisma.link.count({ where: { isActive: true } }),
      prisma.linkEvent.count(),
      prisma.investigationCase.count({ where: { status: { in: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS, CaseStatus.UNDER_REVIEW] } } }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Role breakdown
    const [regularUserCount, adminCount, superAdminCount] = await Promise.all([
      prisma.user.count({ where: { role: RoleType.USER } }),
      prisma.user.count({ where: { role: RoleType.ADMIN } }),
      prisma.user.count({ where: { role: RoleType.SUPER_ADMIN } }),
    ]);

    return NextResponse.json({
      metrics: {
        totalUsers,
        activeUsers,
        suspendedUsers,
        totalAdmins,
        regularUserCount,
        adminCount,
        superAdminCount,
        pendingRequests,
        approvedPermissions,
        revokedPermissions,
        activeLinks,
        totalEvents,
        activeCases,
      },
      recentAuditLogs,
    });
  } catch (err: any) {
    console.error('Super Admin Dashboard API Error:', err);
    return NextResponse.json({ error: 'Failed to fetch platform metrics.' }, { status: 500 });
  }
}
