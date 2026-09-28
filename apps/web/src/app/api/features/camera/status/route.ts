import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser, verifyUserFeatureAccess } from '@/lib/auth-service';

export async function GET(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    const check = await verifyUserFeatureAccess(user.id, 'FEATURE_CAMERA');

    return NextResponse.json({
      authorized: check.granted,
      permission: check.permission || null,
      error: check.error || null,
      requirements: [
        'Super Admin global feature toggle enabled',
        'Administrator verified access approval',
        'User explicit consent and activation',
        'Browser native camera hardware grant',
      ],
    });
  } catch (err: any) {
    console.error('Camera Status Error:', err);
    return NextResponse.json({ error: 'Failed to verify camera access authorization.' }, { status: 500 });
  }
}
