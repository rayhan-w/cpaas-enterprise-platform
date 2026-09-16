import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const orderId = searchParams.get('orderId');
  const orderNumber = searchParams.get('orderNumber');
  const sessionId = searchParams.get('session_id');

  const host = request.headers.get('host') || 'mysterious-einstein-iota.vercel.app';
  const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const siteUrl = `${protocol}://${host}`;

  const targetIdentifier = orderNumber || orderId || '';

  if (status === 'success' && targetIdentifier) {
    try {
      // Mark order as CONFIRMED and payment as PAID
      await dbService.updateOrderStatus(targetIdentifier, 'CONFIRMED');
      await dbService.verifyPayment(
        targetIdentifier,
        'PAID',
        `Stripe Checkout Session: ${sessionId || 'simulated'}`
      );
    } catch (e) {
      console.error('Failed to update order payment status on Stripe callback:', e);
    }

    return NextResponse.redirect(
      `${siteUrl}/order-success?orderNumber=${encodeURIComponent(targetIdentifier)}&paid=stripe`,
      303
    );
  }

  if (status === 'cancel') {
    return NextResponse.redirect(`${siteUrl}/checkout?notice=stripe_cancelled`, 303);
  }

  return NextResponse.redirect(`${siteUrl}/`, 303);
}

export async function POST(request: Request) {
  return GET(request);
}
