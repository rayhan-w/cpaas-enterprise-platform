import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, verifyUserFeatureAccess, logAuditEvent } from '@/lib/auth-service';
import { RoleType, CaseStatus, CasePriority } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const { searchParams } = new URL(req.url);
    const caseStatus = searchParams.get('status') as CaseStatus | null;
    const priority = searchParams.get('priority') as CasePriority | null;

    const where: any = {};
    if (caseStatus) where.status = caseStatus;
    if (priority) where.priority = priority;

    // Strict authorization access control:
    // Super Admin can view all cases
    // Admin / User can only view cases they created OR are assigned to
    if (user.role !== RoleType.SUPER_ADMIN) {
      where.OR = [
        { createdById: user.id },
        { assignments: { some: { userId: user.id } } },
      ];
    }

    const cases = await prisma.investigationCase.findMany({
      where,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        assignments: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        _count: { select: { evidence: true, notes: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ cases });
  } catch (err: any) {
    console.error('GET /api/cases Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve cases.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // Role or feature permission check:
    // Super Admin and Admin can create cases; User must have approved FEATURE_INVESTIGATION
    if (user.role === RoleType.USER) {
      const feat = await verifyUserFeatureAccess(user.id, 'FEATURE_INVESTIGATION');
      if (!feat.granted) {
        return NextResponse.json(
          { error: feat.error || 'Access required. Investigation Case Management requires approved permission.' },
          { status: 403 }
        );
      }
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { title, description, priority } = body;
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      return NextResponse.json({ error: 'Case title must be at least 3 characters.' }, { status: 400 });
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json({ error: 'Case description is required.' }, { status: 400 });
    }

    // Unique case number
    const randomHex = crypto.randomBytes(2).toString('hex').toUpperCase();
    const caseNumber = `CAS-2026-${randomHex}`;

    const newCase = await prisma.investigationCase.create({
      data: {
        caseNumber,
        title: title.trim(),
        description: description.trim(),
        priority: priority || CasePriority.MEDIUM,
        status: CaseStatus.OPEN,
        createdById: user.id,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
      },
    });

    // Auto-assign creator as Lead Investigator
    await prisma.caseAssignment.create({
      data: {
        caseId: newCase.id,
        userId: user.id,
        assignedBy: user.id,
        role: 'LEAD_INVESTIGATOR',
      },
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'CASE_CREATED',
      resourceType: 'CASE',
      resourceId: newCase.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { caseNumber, title: newCase.title },
    });

    return NextResponse.json({ message: 'Investigation case created successfully.', case: newCase }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/cases Error:', err);
    return NextResponse.json({ error: 'Failed to create investigation case.' }, { status: 500 });
  }
}
