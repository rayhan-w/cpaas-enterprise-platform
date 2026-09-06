import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get('orderNumber');
  const phone = searchParams.get('phone');

  if (!orderNumber || !phone) {
    return NextResponse.json(
      { error: 'Both order number and phone number are required' },
      { status: 400 }
    );
  }

  const order = await dbService.getOrderByNumberAndPhone(orderNumber, phone);

  if (!order) {
    return NextResponse.json(
      { error: 'No matching order found for this Order ID and Phone Number.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
