import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireRole, logAuditEvent } from '@/lib/auth-service';
import { RoleType } from '@prisma/client';

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

    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });

    return NextResponse.json({ settings });
  } catch (err: any) {
    console.error('GET /api/super-admin/settings Error:', err);
    return NextResponse.json({ error: 'Failed to retrieve system settings.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const auth = requireRole(user, [RoleType.SUPER_ADMIN]);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.settings || typeof body.settings !== 'object') {
      return NextResponse.json({ error: 'Settings object is required.' }, { status: 400 });
    }

    const updatedKeys: string[] = [];

    for (const [key, value] of Object.entries(body.settings)) {
      const stringValue = String(value);
      await prisma.systemSetting.upsert({
        where: { key },
        update: { value: stringValue, updatedBy: user.id },
        create: { key, value: stringValue, updatedBy: user.id },
      });
      updatedKeys.push(key);
    }

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'SYSTEM_SETTINGS_UPDATED',
      resourceType: 'SETTING',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { updatedKeys, changes: body.settings },
    });

    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: 'asc' },
    });

    return NextResponse.json({ message: 'Settings saved successfully.', settings });
  } catch (err: any) {
    console.error('PATCH /api/super-admin/settings Error:', err);
    return NextResponse.json({ error: 'Failed to update system settings.' }, { status: 500 });
  }
}
