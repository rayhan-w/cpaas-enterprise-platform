import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAuthenticatedUser, verifyUserFeatureAccess, logAuditEvent } from '@/lib/auth-service';

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // Backend authorization recheck
    const check = await verifyUserFeatureAccess(user.id, 'FEATURE_CAMERA');
    if (!check.granted) {
      return NextResponse.json({ error: check.error }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.imageData) {
      return NextResponse.json({ error: 'Image capture payload is required.' }, { status: 400 });
    }

    // Compute cryptographic integrity fingerprint of the user-captured image
    const imageHash = crypto.createHash('sha256').update(body.imageData).digest('hex');

    await logAuditEvent({
      actor: { id: user.id, name: user.name, email: user.email, role: user.role },
      action: 'CAMERA_IMAGE_VERIFIED_USER_INITIATED',
      resourceType: 'PERMISSION',
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: req.headers.get('user-agent') || 'Browser',
      details: {
        feature: 'FEATURE_CAMERA',
        imageSha256: imageHash,
        timestamp: new Date().toISOString(),
      },
    });

    return NextResponse.json({
      message: 'Frame captured and integrity recorded successfully.',
      imageHash,
      timestamp: new Date(),
    });
  } catch (err: any) {
    console.error('Camera verify error:', err);
    return NextResponse.json({ error: 'Failed to record camera verification.' }, { status: 500 });
  }
}
