import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('caseId');

    let where: any = {};
    if (caseId) {
      where.caseId = caseId;
    } else if (user.role === RoleType.USER) {
      where.userId = user.id;
    }

    const records = await prisma.cellularTowerRecord.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      take: 50,
      include: {
        case: { select: { caseNumber: true, title: true } },
      },
    });

    return NextResponse.json({ records });
  } catch (err: any) {
    console.error('GET /api/features/cellular/records Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve cellular tower records.' }, { status: 500 });
  }
}
