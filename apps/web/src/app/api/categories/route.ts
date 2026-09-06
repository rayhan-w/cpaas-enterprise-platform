import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET() {
  const categories = await dbService.getCategories();
  return NextResponse.json({ categories });
}
