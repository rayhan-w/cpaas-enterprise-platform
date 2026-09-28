import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedUser, verifyUserFeatureAccess, logAuditEvent } from '@/lib/auth-service';
import { resolveCellularTower } from '@/lib/cellular-service';
import { RoleType } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const { user, error, status } = await getAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json({ error }, { status });
    }

    // Role or feature permission check:
    // SUPER_ADMIN and ADMIN have access. Standard USER requires approved FEATURE_LOCATION.
    if (user.role === RoleType.USER) {
      const access = await verifyUserFeatureAccess(user.id, 'FEATURE_LOCATION');
      if (!access.granted) {
        return NextResponse.json({ error: access.error }, { status: 403 });
      }
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.lac || !body.cellId) {
      return NextResponse.json(
        { error: 'LAC (Location Area Code) and Cell ID (CID) are required.' },
        { status: 400 }
      );
    }

    const mcc = String(body.mcc || '470').trim();
    const mnc = String(body.mnc || '01').trim();
    const lac = String(body.lac).trim();
    const cellId = String(body.cellId).trim();
    const radio = body.radio || 'LTE';
    const caseId = body.caseId ? String(body.caseId).trim() : null;

    // Resolve Tower
    const towerResult = await resolveCellularTower({
      mcc,
      mnc,
      lac,
      cellId,
      radio,
    });

    let savedRecordId: string | null = null;

    // Optionally save to CellularTowerRecord
    if (body.saveRecord) {
      const record = await prisma.cellularTowerRecord.create({
        data: {
          caseId: caseId || undefined,
          userId: user.id,
          mcc,
          mnc,
          lac,
          cellId,
          radio,
          carrier: towerResult.carrier,
          latitude: towerResult.latitude,
          longitude: towerResult.longitude,
          range: towerResult.rangeMeters,
          address: towerResult.address,
          notes: body.notes || 'Cellular Tower resolution via TrackOps Telemetry',
        },
      });
      savedRecordId = record.id;

      await logAuditEvent({
        actor: { id: user.id, name: user.name, email: user.email, role: user.role },
        action: 'CELLULAR_TOWER_RESOLVED',
        resourceType: 'CELLULAR_TOWER',
        resourceId: record.id,
        details: {
          lac,
          cellId,
          carrier: towerResult.carrier,
          latitude: towerResult.latitude,
          longitude: towerResult.longitude,
        },
        ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      });
    }

    return NextResponse.json({
      success: true,
      tower: towerResult,
      savedRecordId,
    });
  } catch (err: any) {
    console.error('POST /api/features/cellular/lookup Error:', err);
    return NextResponse.json({ error: 'Failed to resolve cellular tower.' }, { status: 500 });
  }
}
