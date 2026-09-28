import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, verifyUserFeatureAccess, logAuditEvent } from '@/lib/auth-service';

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // Backend authorization recheck
    const check = await verifyUserFeatureAccess(user.id, 'FEATURE_LOCATION');
    if (!check.granted) {
      return NextResponse.json({ error: check.error }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const { latitude, longitude, accuracy, purpose } = body || {};

    if (latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: 'Coordinates latitude and longitude are required.' }, { status: 400 });
    }

    // Audit log location reading
    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'LOCATION_LOGGED_USER_CONSENTED',
      resourceType: 'PERMISSION',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: {
        purpose: purpose || 'Operational coordinate verification',
        accuracyMeters: accuracy || 10,
        latTruncated: Math.round(latitude * 100) / 100, // Privacy minimization
        lonTruncated: Math.round(longitude * 100) / 100,
      },
    });

    return NextResponse.json({
      message: 'Location verified and logged with user consent.',
      recordedAt: new Date(),
    });
  } catch (err: any) {
    console.error('Location log error:', err);
    return NextResponse.json({ error: 'Failed to record location.' }, { status: 500 });
  }
}
