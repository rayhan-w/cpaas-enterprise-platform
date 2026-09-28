import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, logAuditEvent } from '@/lib/auth-service';

export async function POST(req: NextRequest) {
  try {
    const { user } = await getAuthenticatedUser(req);

    if (user) {
      await logAuditEvent({
        actor: { id: user.id, name: user.name, email: user.email, role: user.role },
        action: 'USER_LOGOUT',
        resourceType: 'USER',
        resourceId: user.id,
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
        userAgent: req.headers.get('user-agent') || 'Browser',
      });
    }

    const response = NextResponse.json({ message: 'Logged out successfully.' });
    response.cookies.set({
      name: 'trackops_session',
      value: '',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Logged out.' }, { status: 200 });
  }
}
