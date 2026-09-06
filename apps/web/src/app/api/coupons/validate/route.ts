import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function POST(request: Request) {
  try {
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: 'Coupon code is required' }, { status: 400 });
    }

    const result = await dbService.validateCoupon(code, Number(subtotal) || 0);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
  }
}
