import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, logAuditEvent } from '@/lib/auth-service';
import { validateDestinationUrl } from '@/lib/security';
import { RoleType } from '@prisma/client';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();

    const where: any = {};
    // Regular users can only see their own links
    if (user.role === RoleType.USER) {
      where.userId = user.id;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { slug: { contains: search, mode: 'insensitive' } },
        { destinationUrl: { contains: search, mode: 'insensitive' } },
      ];
    }

    const links = await prisma.link.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { events: true, abuseReports: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ links });
  } catch (err: any) {
    console.error('GET /api/links Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve links.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid JSON request payload.' }, { status: 400 });
    }

    const { title, destinationUrl, customSlug, expiresAt } = body;

    if (!title || typeof title !== 'string' || title.trim().length < 2) {
      return NextResponse.json({ error: 'Link title must be at least 2 characters.' }, { status: 400 });
    }

    // Validate Destination URL & SSRF prevention
    const urlValidation = validateDestinationUrl(destinationUrl);
    if (!urlValidation.isValid) {
      return NextResponse.json({ error: urlValidation.error }, { status: 400 });
    }

    // Generate or sanitize slug
    let slug = customSlug ? customSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') : null;
    if (slug) {
      if (slug.length < 3 || slug.length > 50) {
        return NextResponse.json({ error: 'Custom slug must be between 3 and 50 alphanumeric characters.' }, { status: 400 });
      }
      const existing = await prisma.link.findUnique({ where: { slug } });
      if (existing) {
        return NextResponse.json({ error: 'This custom URL slug is already taken. Please choose another.' }, { status: 409 });
      }
    } else {
      slug = crypto.randomBytes(4).toString('hex');
    }

    const expiryDate = expiresAt ? new Date(expiresAt) : null;

    const link = await prisma.link.create({
      data: {
        userId: user.id,
        title: title.trim(),
        destinationUrl: urlValidation.cleanUrl!,
        slug,
        expiresAt: expiryDate,
        isActive: true,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'LINK_CREATED',
      resourceType: 'LINK',
      resourceId: link.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { slug: link.slug, destination: link.destinationUrl },
    });

    return NextResponse.json({ message: 'Short link created successfully.', link }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/links Error:', err);
    return NextResponse.json({ error: 'Failed to create short link.' }, { status: 500 });
  }
}
