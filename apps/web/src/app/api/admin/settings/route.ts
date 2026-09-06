import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET() {
  const settings = await dbService.getSettings();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await dbService.updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
