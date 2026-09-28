import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const request = await prisma.accessRequest.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, role: true, status: true } },
        reviewedBy: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    if (!request) {
      return NextResponse.json({ error: 'Access request not found.' }, { status: 404 });
    }

    // Authorization: User can view their own; Admin and Super Admin can view
    if (user.role === RoleType.USER && request.userId !== user.id) {
      return NextResponse.json({ error: 'Forbidden. You do not own this request.' }, { status: 403 });
    }

    return NextResponse.json({ request });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to retrieve access request.' }, { status: 500 });
  }
}
