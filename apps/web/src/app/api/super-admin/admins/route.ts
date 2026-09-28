import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, requireRole, logAuditEvent, createNotification } from '@/lib/auth-service';
import { RoleType, UserStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
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
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
    }

    const { name, email, password, scopes } = body;

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'Name, valid email, and password of at least 8 characters are required.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check existing
    let targetAdmin = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    const passwordHash = await bcrypt.hash(password, 12);

    if (targetAdmin) {
      // If already Super Admin, prevent downgrade
      if (targetAdmin.role === RoleType.SUPER_ADMIN) {
        return NextResponse.json({ error: 'Cannot modify Super Admin platform owner account.' }, { status: 400 });
      }

      targetAdmin = await prisma.user.update({
        where: { id: targetAdmin.id },
        data: {
          role: RoleType.ADMIN,
          name: name.trim(),
          passwordHash,
          status: UserStatus.ACTIVE,
        },
      });
    } else {
      targetAdmin = await prisma.user.create({
        data: {
          name: name.trim(),
          email: normalizedEmail,
          passwordHash,
          role: RoleType.ADMIN,
          status: UserStatus.ACTIVE,
        },
      });
    }

    // Set Administrator Scopes
    if (Array.isArray(scopes) && scopes.length > 0) {
      // Clear previous scopes
      await prisma.administratorScope.deleteMany({
        where: { adminId: targetAdmin.id },
      });

      // Insert new scopes
      for (const sc of scopes) {
        const featureKey = typeof sc === 'string' ? sc : sc.featureKey;
        const canApprove = sc.canApprove !== undefined ? Boolean(sc.canApprove) : true;
        const canRevoke = sc.canRevoke !== undefined ? Boolean(sc.canRevoke) : true;

        await prisma.administratorScope.create({
          data: {
            adminId: targetAdmin.id,
            featureKey,
            canApprove,
            canRevoke,
            assignedBy: user.id,
          },
        });
      }
    }

    // Audit log
    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'ADMIN_ACCOUNT_CONFIGURED',
      resourceType: 'USER',
      resourceId: targetAdmin.id,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { adminEmail: targetAdmin.email, assignedScopes: scopes },
    });

    await createNotification({
      userId: targetAdmin.id,
      title: 'Administrator Privileges Assigned',
      message: 'You have been appointed as an Administrator. Access the Admin Dashboard to manage requests.',
      type: 'SYSTEM',
      link: '/admin',
    });

    return NextResponse.json({
      message: `Administrator account configured for ${targetAdmin.email}.`,
      admin: {
        id: targetAdmin.id,
        name: targetAdmin.name,
        email: targetAdmin.email,
        role: targetAdmin.role,
        status: targetAdmin.status,
      },
    });
  } catch (err: any) {
    console.error('POST /api/super-admin/admins Error:', err);
    return NextResponse.json({ error: 'Failed to configure administrator account.' }, { status: 500 });
  }
}
