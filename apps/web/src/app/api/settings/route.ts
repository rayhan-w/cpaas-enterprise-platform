import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';
import { DEFAULT_DISTRICT_ZONE_MAPPING } from '@/lib/bd-locations';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const raw = await dbService.getSettings();
    return NextResponse.json({
      insideDhakaFee: Number(raw.insideDhakaFee) || 70,
      suburbsDhakaFee: Number(raw.suburbsDhakaFee) || 100,
      outsideDhakaFee: Number(raw.outsideDhakaFee) || 130,
      freeDeliveryThreshold: Number(raw.freeDeliveryThreshold) || 2000,
      districtZoneMapping: raw.districtZoneMapping || DEFAULT_DISTRICT_ZONE_MAPPING,
    });
  } catch (err: any) {
    return NextResponse.json({
      insideDhakaFee: 70,
      suburbsDhakaFee: 100,
      outsideDhakaFee: 130,
      freeDeliveryThreshold: 2000,
      districtZoneMapping: DEFAULT_DISTRICT_ZONE_MAPPING,
    });
  }
}
