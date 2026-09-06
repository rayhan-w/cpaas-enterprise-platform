import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function POST(request: Request) {
  try {
    const { orderId, action, note } = await request.json();

    if (!orderId || !action) {
      return NextResponse.json({ error: 'Order ID and action are required' }, { status: 400 });
    }

    if (action !== 'VERIFY' && action !== 'REJECT') {
      return NextResponse.json({ error: 'Action must be VERIFY or REJECT' }, { status: 400 });
    }

    const newPaymentStatus = action === 'VERIFY' ? 'PAID' : 'REJECTED';
    const updated = await dbService.verifyPayment(orderId, newPaymentStatus, note);

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order: updated,
      message:
        action === 'VERIFY'
          ? 'Payment marked as Paid & Order Confirmed'
          : 'Payment marked as Rejected',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
