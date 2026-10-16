import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [orders, products] = await Promise.all([
      dbService.getOrders(),
      dbService.getProducts({ includeInactive: true }),
    ]);

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    const totalSales = orders
      .filter((o) => o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED')
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const todaySales = orders
      .filter(
        (o) =>
          (o.paymentStatus === 'PAID' || o.orderStatus === 'DELIVERED') &&
          new Date(o.createdAt).getTime() >= oneDayAgo
      )
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
      (o) =>
        o.orderStatus === 'PENDING' ||
        o.orderStatus === 'CONFIRMED' ||
        o.orderStatus === 'PROCESSING'
    ).length;

    const pendingPayments = orders.filter(
      (o) => o.paymentStatus === 'PENDING_VERIFICATION'
    ).length;

    const lowStockProducts = products.filter(
      (p) => (p.stock || 0) > 0 && (p.stock || 0) <= 5
    ).length;

    const recentOrders = [...orders]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10);

    return NextResponse.json({
      metrics: {
        totalSales,
        todaySales,
        totalOrders,
        pendingOrders,
        pendingPayments,
        lowStockProducts,
      },
      recentOrders,
    });
  } catch (err: any) {
    console.error('Admin Dashboard API Error:', err);
    return NextResponse.json(
      { error: 'Failed to retrieve admin dashboard metrics' },
      { status: 500 }
    );
  }
}
