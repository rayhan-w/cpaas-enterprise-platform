import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, logAuditEvent } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const c = await prisma.investigationCase.findUnique({
      where: { id },
      include: { assignments: true },
    });

    if (!c) {
      return NextResponse.json({ error: 'Case not found.' }, { status: 404 });
    }

    const isAssigned = c.assignments.some((a) => a.userId === user.id);
    if (user.role !== RoleType.SUPER_ADMIN && c.createdById !== user.id && !isAssigned) {
      return NextResponse.json({ error: 'Forbidden. You are not assigned to this case.' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.content || typeof body.content !== 'string' || body.content.trim().length === 0) {
      return NextResponse.json({ error: 'Note content cannot be empty.' }, { status: 400 });
    }

    const note = await prisma.caseNote.create({
      data: {
        caseId: c.id,
        authorId: user.id,
        authorName: user.name,
        content: body.content.trim(),
        isInternal: body.isInternal !== undefined ? Boolean(body.isInternal) : true,
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'CASE_NOTE_ADDED',
      resourceType: 'CASE',
      resourceId: c.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
    });

    return NextResponse.json({ message: 'Note added to case.', note }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/cases/[id]/notes Error:', err);
    return NextResponse.json({ error: 'Failed to add note.' }, { status: 500 });
  }
}
