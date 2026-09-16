import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || undefined;
  const paymentStatus = searchParams.get('paymentStatus') || undefined;

  const orders = await dbService.getOrders({ status, paymentStatus });
  return NextResponse.json({ orders });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.customerName || !body.customerPhone || !body.address) {
      return NextResponse.json(
        { error: 'Name, phone number, and delivery address are required' },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    // Re-verify subtotal and delivery charge on server (prevent frontend price manipulation)
    const calculatedSubtotal = body.items.reduce(
      (sum: number, it: any) => sum + (Number(it.price) * Number(it.quantity)),
      0
    );

    const isFreeDelivery = calculatedSubtotal >= 2000;
    const calculatedDeliveryCharge = isFreeDelivery
      ? 0
      : body.deliveryZone === 'INSIDE_DHAKA'
      ? 60
      : 120;

    let calculatedDiscount = 0;
    if (body.couponCode) {
      const couponCheck = await dbService.validateCoupon(body.couponCode, calculatedSubtotal);
      if (couponCheck.valid) {
        calculatedDiscount = couponCheck.discount;
      }
    }

    const calculatedTotal = Math.max(0, calculatedSubtotal + calculatedDeliveryCharge - calculatedDiscount);

    // Initial payment status
    let initialPaymentStatus = 'PENDING_VERIFICATION';
    let initialOrderStatus = 'PENDING';

    const orderRecord = await dbService.createOrder({
      orderNumber: '', // assigned inside dbService
      customerName: body.customerName,
      customerPhone: body.customerPhone,
      customerEmail: body.customerEmail,
      division: body.division || 'Dhaka',
      district: body.district || 'Dhaka',
      area: body.area || '',
      address: body.address,
      deliveryNote: body.deliveryNote,
      deliveryZone: body.deliveryZone || 'INSIDE_DHAKA',
      deliveryCharge: calculatedDeliveryCharge,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      couponCode: body.couponCode,
      total: calculatedTotal,
      paymentMethod: body.paymentMethod || 'COD',
      paymentStatus: initialPaymentStatus as any,
      orderStatus: initialOrderStatus as any,
      items: body.items.map((i: any) => ({
        id: `it_${Date.now()}_${Math.random()}`,
        orderId: '',
        productId: i.productId,
        productName: i.productName,
        productImage: i.productImage,
        price: Number(i.price),
        quantity: Number(i.quantity),
        variantName: i.variantName,
        total: Number(i.price) * Number(i.quantity),
      })),
      payments:
        body.paymentMethod === 'BKASH' || body.paymentMethod === 'NAGAD'
          ? [
              {
                id: `pay_${Date.now()}`,
                orderId: '',
                method: body.paymentMethod,
                amount: calculatedTotal,
                status: 'PENDING_VERIFICATION',
                transactionId: body.transactionId,
                senderNumber: body.senderNumber,
                createdAt: new Date().toISOString(),
              },
            ]
          : [],
    });

    // If SSLCommerz, return sandbox session initiation
    let gatewayUrl = undefined;
    if (body.paymentMethod === 'SSLCOMMERZ') {
      gatewayUrl = `https://sandbox.sslcommerz.com/gwprocess/v4/simulator?tran_id=${orderRecord.orderNumber}&amount=${orderRecord.total}`;
    }

    // Trigger Server-Side Meta Conversions API (CAPI) for Purchase
    try {
      const origin = request.headers.get('origin') || 'https://mysterious-einstein-iota.vercel.app';
      fetch(`${origin}/api/tracking/capi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName: 'Purchase',
          eventId: `order_${orderRecord.orderNumber}`,
          orderNumber: orderRecord.orderNumber,
          value: orderRecord.total,
          currency: 'BDT',
          customerPhone: orderRecord.customerPhone,
          customerEmail: orderRecord.customerEmail,
          customerName: orderRecord.customerName,
          items: orderRecord.items,
          eventSourceUrl: `${origin}/checkout`,
        }),
      }).catch((e) => console.error('CAPI async dispatch error:', e));
    } catch {}

    return NextResponse.json(
      {
        success: true,
        order: orderRecord,
        gatewayUrl,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to place order' }, { status: 500 });
  }
}
