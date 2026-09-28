import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, logAuditEvent } from '@/lib/auth-service';
import { RoleType, CaseStatus, CasePriority } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const c = await prisma.investigationCase.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true, role: true } },
        assignments: {
          include: { user: { select: { id: true, name: true, email: true, role: true } } },
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: { author: { select: { id: true, name: true, role: true } } },
        },
        evidence: {
          orderBy: { createdAt: 'desc' },
          include: { submittedBy: { select: { id: true, name: true } } },
        },
        cellularTowers: {
          orderBy: { recordedAt: 'desc' },
        },
      },
    });

    if (!c) {
      return NextResponse.json({ error: 'Investigation case not found.' }, { status: 404 });
    }

    // Access check: Super Admin, creator, or assigned user
    const isAssigned = c.assignments.some((a) => a.userId === user.id);
    if (user.role !== RoleType.SUPER_ADMIN && c.createdById !== user.id && !isAssigned) {
      return NextResponse.json({ error: 'Forbidden. You are not assigned to this investigation case.' }, { status: 403 });
    }

    return NextResponse.json({ case: c });
  } catch (err: any) {
    console.error('GET /api/cases/[id] Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve case details.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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
      return NextResponse.json({ error: 'Investigation case not found.' }, { status: 404 });
    }

    const isAssigned = c.assignments.some((a) => a.userId === user.id);
    if (user.role !== RoleType.SUPER_ADMIN && c.createdById !== user.id && !isAssigned) {
      return NextResponse.json({ error: 'Unauthorized to edit this case.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const updateData: any = {};

    if (body.status && Object.values(CaseStatus).includes(body.status)) {
      updateData.status = body.status;
      if (body.status === CaseStatus.CLOSED || body.status === CaseStatus.ARCHIVED) {
        updateData.closedAt = new Date();
      }
    }

    if (body.priority && Object.values(CasePriority).includes(body.priority)) {
      updateData.priority = body.priority;
    }

    if (body.description) {
      updateData.description = body.description.trim();
    }

    const updated = await prisma.investigationCase.update({
      where: { id: c.id },
      data: updateData,
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'CASE_UPDATED',
      resourceType: 'CASE',
      resourceId: c.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: updateData,
    });

    return NextResponse.json({ message: 'Case updated successfully.', case: updated });
  } catch (err: any) {
    console.error('PATCH /api/cases/[id] Error:', err);
    return NextResponse.json({ error: 'Failed to update case.' }, { status: 500 });
  }
}
