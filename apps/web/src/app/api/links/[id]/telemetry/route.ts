import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const { eventId, latitude, longitude, accuracy, carrier, cellId, lac } = body || {};

    if (!id || !eventId) {
      return NextResponse.json({ error: 'Missing id or eventId' }, { status: 400 });
    }

    const updatedEvent = await prisma.linkEvent.update({
      where: { id: eventId },
      data: {
        ...(latitude !== undefined ? { latitude: Number(latitude) } : {}),
        ...(longitude !== undefined ? { longitude: Number(longitude) } : {}),
        ...(accuracy !== undefined ? { accuracy: Number(accuracy) } : {}),
        ...(carrier ? { carrier: String(carrier) } : {}),
        ...(cellId ? { cellId: String(cellId) } : {}),
        ...(lac ? { lac: String(lac) } : {}),
      },
    });

    return NextResponse.json({ success: true, eventId: updatedEvent.id });
  } catch (err: any) {
    console.error('Failed to update telemetry event:', err);
    return NextResponse.json({ error: 'Failed to record telemetry' }, { status: 500 });
  }
}
