import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET() {
  const orders = await dbService.getOrders();
  const products = await dbService.getProducts();

  const totalSales = orders
    .filter((o) => o.paymentStatus === 'PAID')
    .reduce((sum, o) => sum + o.total, 0);

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const todaySales = orders
    .filter((o) => o.paymentStatus === 'PAID' && o.createdAt.startsWith(todayStr))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.orderStatus === 'PENDING').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'DELIVERED').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'CANCELLED').length;

  const pendingPayments = orders.filter((o) => o.paymentStatus === 'PENDING_VERIFICATION').length;
  const pendingBkash = orders.filter(
    (o) => o.paymentMethod === 'BKASH' && o.paymentStatus === 'PENDING_VERIFICATION'
  ).length;
  const pendingNagad = orders.filter(
    (o) => o.paymentMethod === 'NAGAD' && o.paymentStatus === 'PENDING_VERIFICATION'
  ).length;

  const lowStockProducts = products.filter((p) => p.stock <= 10).length;

  // Recent 10 orders
  const recentOrders = orders.slice(0, 10);

  return NextResponse.json({
    metrics: {
      totalSales,
      todaySales,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalProducts: products.length,
      lowStockProducts,
      pendingPayments,
      pendingBkash,
      pendingNagad,
    },
    recentOrders,
  });
}
