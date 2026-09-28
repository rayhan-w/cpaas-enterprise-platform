import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, verifyUserFeatureAccess } from '@/lib/auth-service';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const check = await verifyUserFeatureAccess(user.id, 'FEATURE_LOCATION');

    return NextResponse.json({
      authorized: check.granted,
      permission: check.permission || null,
      error: check.error || null,
      requirements: [
        'Super Admin global feature toggle enabled',
        'Administrator verified access approval',
        'User explicit button click to request location',
        'Native browser Geolocation API prompt',
      ],
    });
  } catch (err: any) {
    console.error('Location Status Error:', err);
    return NextResponse.json({ error: 'Failed to verify location authorization.' }, { status: 500 });
  }
}
