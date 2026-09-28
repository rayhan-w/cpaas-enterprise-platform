import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, logAuditEvent } from '@/lib/auth-service';
import { validateDestinationUrl } from '@/lib/security';
import { RoleType } from '@prisma/client';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { events: true, abuseReports: true } },
      },
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found.' }, { status: 404 });
    }

    // Ownership check
    if (user.role === RoleType.USER && link.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to view this link.' }, { status: 403 });
    }

    // Generate QR Code Data URL
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const redirectUrl = `${protocol}://${host}/r/${link.slug}`;
    const qrCodeDataUrl = await QRCode.toDataURL(redirectUrl, {
      width: 300,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
    });

    return NextResponse.json({
      link: {
        ...link,
        redirectUrl,
        qrCodeDataUrl,
      },
    });
  } catch (err: any) {
    console.error('GET /api/links/[id] Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve link.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) {
      return NextResponse.json({ error: 'Link not found.' }, { status: 404 });
    }

    if (user.role === RoleType.USER && link.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to edit this link.' }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const updateData: any = {};

    if (body.title && typeof body.title === 'string') {
      updateData.title = body.title.trim();
    }

    if (body.destinationUrl) {
      const v = validateDestinationUrl(body.destinationUrl);
      if (!v.isValid) {
        return NextResponse.json({ error: v.error }, { status: 400 });
      }
      updateData.destinationUrl = v.cleanUrl;
    }

    if (typeof body.isActive === 'boolean') {
      updateData.isActive = body.isActive;
    }

    if (body.expiresAt !== undefined) {
      updateData.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;
    }

    const updated = await prisma.link.update({
      where: { id: link.id },
      data: updateData,
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'LINK_UPDATED',
      resourceType: 'LINK',
      resourceId: link.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { updatedFields: Object.keys(updateData) },
    });

    return NextResponse.json({ message: 'Link updated successfully.', link: updated });
  } catch (err: any) {
    console.error('PATCH /api/links/[id] Error:', err);
    return NextResponse.json({ error: 'Failed to update link.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) {
      return NextResponse.json({ error: 'Link not found.' }, { status: 404 });
    }

    if (user.role === RoleType.USER && link.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to delete this link.' }, { status: 403 });
    }

    await prisma.link.delete({ where: { id: link.id } });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'LINK_DELETED',
      resourceType: 'LINK',
      resourceId: link.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { slug: link.slug },
    });

    return NextResponse.json({ message: 'Link deleted successfully.' });
  } catch (err: any) {
    console.error('DELETE /api/links/[id] Error:', err);
    return NextResponse.json({ error: 'Failed to delete link.' }, { status: 500 });
  }
}
