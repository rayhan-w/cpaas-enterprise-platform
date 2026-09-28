import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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
      return NextResponse.json({ error: 'Investigation case not found.' }, { status: 404 });
    }

    const isAssigned = c.assignments.some((a) => a.userId === user.id);
    if (user.role !== RoleType.SUPER_ADMIN && c.createdById !== user.id && !isAssigned) {
      return NextResponse.json({ error: 'Forbidden. You cannot add evidence to this case.' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { title, description, evidenceType, fileUrl, rawData } = body;
    if (!title || !description) {
      return NextResponse.json({ error: 'Evidence title and description are required.' }, { status: 400 });
    }

    // Compute integrity hash
    const contentToHash = rawData || fileUrl || `${title}:${description}:${Date.now()}`;
    const fileHash = crypto.createHash('sha256').update(contentToHash).digest('hex');

    // Chain of custody initialization
    const initialCustody = [
      {
        action: 'EVIDENCE_SUBMITTED',
        timestamp: new Date().toISOString(),
        actorId: user.id,
        actorName: user.name,
        actorRole: user.role,
        hashVerified: true,
      },
    ];

    const evidence = await prisma.evidenceRecord.create({
      data: {
        caseId: c.id,
        title: title.trim(),
        description: description.trim(),
        evidenceType: evidenceType || 'TELEMETRY',
        fileUrl: fileUrl || null,
        fileHash,
        chainOfCustody: JSON.stringify(initialCustody),
        submittedById: user.id,
      },
      include: {
        submittedBy: { select: { id: true, name: true } },
      },
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'EVIDENCE_RECORD_ATTACHED',
      resourceType: 'CASE',
      resourceId: c.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { evidenceId: evidence.id, title: evidence.title, fileHash },
    });

    return NextResponse.json({ message: 'Evidence record attached securely.', evidence }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/cases/[id]/evidence Error:', err);
    return NextResponse.json({ error: 'Failed to attach evidence.' }, { status: 500 });
  }
}
