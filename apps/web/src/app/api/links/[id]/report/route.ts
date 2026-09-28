import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logAuditEvent, createNotification } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) {
      return NextResponse.json({ error: 'Link not found.' }, { status: 404 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.reason) {
      return NextResponse.json({ error: 'Abuse report reason is required.' }, { status: 400 });
    }

    const { reason, details, reporterEmail } = body;

    const report = await prisma.abuseReport.create({
      data: {
        linkId: link.id,
        reason: reason.trim(),
        details: details ? details.trim() : null,
        reporterEmail: reporterEmail ? reporterEmail.trim() : null,
        status: 'PENDING',
      },
    });

    // Mark link as reported
    await prisma.link.update({
      where: { id: link.id },
      data: { isReported: true },
    });

    // Notify Super Admin
    const superAdmins = await prisma.user.findMany({
      where: { role: RoleType.SUPER_ADMIN },
      select: { id: true },
    });

    for (const sa of superAdmins) {
      await createNotification({
        userId: sa.id,
        title: 'New Link Abuse Report Submitted',
        message: `Link "${link.title}" (${link.slug}) has been reported for: ${reason}.`,
        type: 'SECURITY_ALERT',
        link: '/super-admin/abuse-reports',
      });
    }

    await logAuditEvent({
      actor: { id: 'VISITOR_OR_USER', name: reporterEmail || 'Anonymous', email: reporterEmail || 'anonymous@visitor', role: 'USER' },
      action: 'LINK_ABUSE_REPORTED',
      resourceType: 'LINK',
      resourceId: link.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { reason, slug: link.slug },
    });

    return NextResponse.json({ message: 'Abuse report submitted. Platform moderators will review the link.', report }, { status: 201 });
  } catch (err: any) {
    console.error('Abuse report error:', err);
    return NextResponse.json({ error: 'Failed to submit abuse report.' }, { status: 500 });
  }
}
