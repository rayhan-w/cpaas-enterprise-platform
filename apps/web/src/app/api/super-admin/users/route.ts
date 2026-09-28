import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireRole } from '@/lib/auth-service';
import { RoleType, UserStatus } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const auth = requireRole(user, [RoleType.SUPER_ADMIN]);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const role = searchParams.get('role') as RoleType | null;
    const userStatus = searchParams.get('status') as UserStatus | null;

    const where: any = {};
    if (role) where.role = role;
    if (userStatus) where.status = userStatus;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        twoFactorEnabled: true,
        lastLoginAt: true,
        createdAt: true,
        adminScopes: {
          select: { featureKey: true, canApprove: true, canRevoke: true },
        },
        featurePermissions: {
          select: { featureKey: true, status: true, expiresAt: true, grantedByName: true },
        },
        _count: {
          select: {
            links: true,
            accessRequests: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ users });
  } catch (err: any) {
    console.error('GET /api/super-admin/users Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve users.' }, { status: 500 });
  }
}
