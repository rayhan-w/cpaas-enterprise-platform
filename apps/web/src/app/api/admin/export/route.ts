import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';
import {
  filterOrdersByPeriod,
  generateExcelXml,
  generateCsv,
  ExportPeriod,
  ExportFormat,
} from '@/lib/excel-export';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'orders'; // 'orders' | 'products'
  const period = (searchParams.get('period') as ExportPeriod) || 'all';
  const format = (searchParams.get('format') as ExportFormat) || 'excel';
  const filter = searchParams.get('filter') || 'all';

  const dateStr = new Date().toISOString().split('T')[0];

  if (type === 'products') {
    const products = await dbService.getProducts({ limit: 1000 });
    let filtered = [...products];

    if (filter === 'low') {
      filtered = filtered.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
    } else if (filter === 'out') {
      filtered = filtered.filter((p) => (p.stock || 0) <= 0);
    } else if (filter === 'instock') {
      filtered = filtered.filter((p) => (p.stock || 0) > 10);
    }

    const headers = [
      'Product ID',
      'Product Name',
      'SKU',
      'Category',
      'Sub-Category',
      'Sale Price (৳)',
      'Regular Price (৳)',
      'Stock Available (Pcs)',
      'Stock Status',
      'Badge / Tag',
      'Rating',
      'Reviews',
    ];

    const rows = filtered.map((p) => {
      const stockQty = p.stock || 0;
      const stockStatus =
        stockQty <= 0 ? 'Out of Stock' : stockQty <= 10 ? 'Low Stock' : 'In Stock';
      return [
        p.id,
        p.name,
        p.sku || 'N/A',
        p.categoryName || 'Uncategorized',
        p.subCategoryName || 'General',
        p.price || 0,
        p.originalPrice || p.price || 0,
        stockQty,
        stockStatus,
        p.badge || (p.isBestSeller ? 'Best Seller' : p.isFeatured ? 'Featured' : ''),
        p.rating || 5,
        p.reviewCount || 0,
      ];
    });

    if (format === 'csv') {
      const csv = generateCsv(headers, rows);
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="Jawata_Mart_Products_${dateStr}.csv"`,
        },
      });
    } else {
      const xml = generateExcelXml('Products', headers, rows);
      return new NextResponse(xml, {
        headers: {
          'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
          'Content-Disposition': `attachment; filename="Jawata_Mart_Products_${dateStr}.xls"`,
        },
      });
    }
  }

  // ORDERS EXPORT
  const orders = await dbService.getOrders();
  const filtered = filterOrdersByPeriod(orders, period);

  const headers = [
    'Order ID',
    'Order Date & Time',
    'Customer Name',
    'Phone Number',
    'Email Address',
    'Division',
    'District',
    'Area',
    'Full Delivery Address',
    'Delivery Zone',
    'Delivery Charge (৳)',
    'Subtotal (৳)',
    'Discount (৳)',
    'Coupon Code',
    'Total Amount (৳)',
    'Payment Method',
    'Payment Status',
    'Order Status',
    'Total Items',
    'Ordered Items Details',
  ];

  const rows = filtered.map((o) => {
    const itemsSummary = o.items
      ? o.items.map((i) => `${i.productName} (x${i.quantity} @ ৳${i.price})`).join('; ')
      : '';

    const formattedDate = o.createdAt
      ? new Date(o.createdAt).toLocaleString('en-GB', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return [
      o.orderNumber || o.id,
      formattedDate,
      o.customerName || '',
      o.customerPhone || '',
      o.customerEmail || '',
      o.division || '',
      o.district || '',
      o.area || '',
      o.address || '',
      o.deliveryZone === 'INSIDE_DHAKA' ? 'Inside Dhaka' : 'Outside Dhaka',
      o.deliveryCharge || 0,
      o.subtotal || 0,
      o.discount || 0,
      o.couponCode || 'N/A',
      o.total || 0,
      o.paymentMethod || '',
      o.paymentStatus || '',
      o.orderStatus || '',
      o.items ? o.items.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0,
      itemsSummary,
    ];
  });

  const periodName =
    period === 'daily'
      ? 'Daily_Today'
      : period === 'weekly'
      ? 'Weekly_7Days'
      : period === 'monthly'
      ? 'Monthly'
      : 'All_Time';

  if (format === 'csv') {
    const csv = generateCsv(headers, rows);
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="Jawata_Mart_Orders_${periodName}_${dateStr}.csv"`,
      },
    });
  } else {
    const xml = generateExcelXml(`Orders_${periodName}`, headers, rows);
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/vnd.ms-excel; charset=utf-8',
        'Content-Disposition': `attachment; filename="Jawata_Mart_Orders_${periodName}_${dateStr}.xls"`,
      },
    });
  }
}
