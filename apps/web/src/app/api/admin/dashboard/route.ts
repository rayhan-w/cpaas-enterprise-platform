import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireRole } from '@/lib/auth-service';
import { RoleType, RequestStatus, CaseStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const auth = requireRole(user, [RoleType.ADMIN, RoleType.SUPER_ADMIN]);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    // 1. Get Admin's assigned scopes
    const scopes = await prisma.administratorScope.findMany({
      where: { adminId: user.id },
      select: { featureKey: true, canApprove: true, canRevoke: true },
    });

    const scopedFeatures = user.role === RoleType.SUPER_ADMIN
      ? ['FEATURE_CAMERA', 'FEATURE_LOCATION', 'FEATURE_EXPORT', 'FEATURE_INVESTIGATION', 'FEATURE_ANALYTICS_PRO']
      : scopes.map((s) => s.featureKey);

    // 2. Metrics within assigned authority
    const [
      pendingCount,
      approvedCount,
      rejectedCount,
      assignedCasesCount,
      recentRequests,
      recentCases,
    ] = await Promise.all([
      prisma.accessRequest.count({
        where: {
          featureKey: { in: scopedFeatures },
          status: RequestStatus.PENDING,
        },
      }),
      prisma.accessRequest.count({
        where: {
          featureKey: { in: scopedFeatures },
          status: RequestStatus.APPROVED,
        },
      }),
      prisma.accessRequest.count({
        where: {
          featureKey: { in: scopedFeatures },
          status: RequestStatus.REJECTED,
        },
      }),
      prisma.caseAssignment.count({
        where: { userId: user.id },
      }),
      prisma.accessRequest.findMany({
        where: { featureKey: { in: scopedFeatures } },
        include: { user: { select: { id: true, name: true, email: true } } },
        take: 8,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.investigationCase.findMany({
        where: {
          assignments: { some: { userId: user.id } },
          status: { in: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS, CaseStatus.UNDER_REVIEW] },
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return NextResponse.json({
      metrics: {
        pendingCount,
        approvedCount,
        rejectedCount,
        assignedCasesCount,
        assignedScopeCount: scopedFeatures.length,
      },
      scopes,
      recentRequests,
      recentCases,
    });
  } catch (err: any) {
    console.error('GET /api/admin/dashboard Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve admin dashboard metrics.' }, { status: 500 });
  }
}
