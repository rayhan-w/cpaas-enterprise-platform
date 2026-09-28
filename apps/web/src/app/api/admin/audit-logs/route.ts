import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireRole } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

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

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const page = parseInt(searchParams.get('page') || '1', 10);

    let where: any = {};

    if (user.role === RoleType.SUPER_ADMIN) {
      // Super Admin sees all audit logs
      if (search) {
        where.OR = [
          { actorName: { contains: search, mode: 'insensitive' } },
          { actorEmail: { contains: search, mode: 'insensitive' } },
          { action: { contains: search, mode: 'insensitive' } },
          { details: { contains: search, mode: 'insensitive' } },
        ];
      }
    } else {
      // Delegated Administrator: scoped to their own actions or actions on features within their scope
      const scopes = await prisma.administratorScope.findMany({
        where: { adminId: user.id },
        select: { featureKey: true },
      });
      const featureKeys = scopes.map((s) => s.featureKey);

      where = {
        OR: [
          { actorId: user.id },
          { resourceType: { in: featureKeys } },
          { details: { in: featureKeys } },
        ],
      };

      if (search) {
        where = {
          AND: [
            where,
            {
              OR: [
                { actorName: { contains: search, mode: 'insensitive' } },
                { actorEmail: { contains: search, mode: 'insensitive' } },
                { action: { contains: search, mode: 'insensitive' } },
                { details: { contains: search, mode: 'insensitive' } },
              ],
            },
          ],
        };
      }
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error('GET /api/admin/audit-logs Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve scoped audit logs.' }, { status: 500 });
  }
}
