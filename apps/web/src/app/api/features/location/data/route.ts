import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, logAuditEvent } from '@/lib/auth-service';

export async function DELETE(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'LOCATION_DATA_DELETED_BY_USER',
      resourceType: 'PERMISSION',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: { note: 'User exercised data minimization deletion rights for location telemetry' },
    });

    return NextResponse.json({ message: 'All personal location telemetry records have been purged.' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to purge location records.' }, { status: 500 });
  }
}
