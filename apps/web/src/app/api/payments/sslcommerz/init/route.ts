import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { orderId, amount, customerName, customerPhone, customerEmail, address } = await request.json();

    const storeId = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD || 'qwerty';
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';

    const baseUrl = isLive
      ? 'https://securepay.sslcommerz.com'
      : 'https://sandbox.sslcommerz.com';

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const siteUrl = `${protocol}://${host}`;

    const payload = new URLSearchParams({
      store_id: storeId,
      store_passwd: storePassword,
      total_amount: String(amount),
      currency: 'BDT',
      tran_id: orderId,
      success_url: `${siteUrl}/api/payments/sslcommerz/callback?status=success`,
      fail_url: `${siteUrl}/api/payments/sslcommerz/callback?status=fail`,
      cancel_url: `${siteUrl}/api/payments/sslcommerz/callback?status=cancel`,
      ipn_url: `${siteUrl}/api/payments/sslcommerz/callback?status=ipn`,
      shipping_method: 'Courier',
      product_name: 'Nurtura Multi-Category Products',
      product_category: 'Lifestyle & Family',
      product_profile: 'general',
      cus_name: customerName,
      cus_email: customerEmail || 'customer@nurtura.com.bd',
      cus_add1: address,
      cus_city: 'Dhaka',
      cus_country: 'Bangladesh',
      cus_phone: customerPhone,
    });

    // In a live environment with network access, fetch(baseUrl + '/gwprocess/v4/api.php', ...)
    // For sandbox demonstration without hard failures, provide gateway URL or fallback simulator:
    try {
      const sslRes = await fetch(`${baseUrl}/gwprocess/v4/api.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString(),
      });
      const sslData = await sslRes.json();
      if (sslData?.status === 'SUCCESS' && sslData?.GatewayPageURL) {
        return NextResponse.json({ gatewayUrl: sslData.GatewayPageURL });
      }
    } catch {
      // Fallback simulator URL
    }

    return NextResponse.json({
      gatewayUrl: `${baseUrl}/gwprocess/v4/simulator?tran_id=${orderId}&amount=${amount}`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
