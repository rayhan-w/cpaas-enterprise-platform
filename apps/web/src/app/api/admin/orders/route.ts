import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function PUT(request: Request) {
  try {
    const { orderId, orderStatus } = await request.json();

    if (!orderId || !orderStatus) {
      return NextResponse.json(
        { error: 'Order ID and new order status are required' },
        { status: 400 }
      );
    }

    const updated = await dbService.updateOrderStatus(orderId, orderStatus);

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
