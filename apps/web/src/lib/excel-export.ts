import { OrderRecord, ProductItem, CategoryItem } from './types';

export type ExportPeriod = 'daily' | 'weekly' | 'monthly' | 'all';
export type ExportFormat = 'excel' | 'csv';

/**
 * Filter orders based on chosen timeframe:
 * - daily: orders placed today (since 00:00:00)
 * - weekly: orders placed in the last 7 days
 * - monthly: orders placed in the current month (or last 30 days)
 * - all: all orders
 */
export function filterOrdersByPeriod(orders: OrderRecord[], period: ExportPeriod): OrderRecord[] {
  if (period === 'all') return orders;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const sevenDaysAgo = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  return orders.filter((order) => {
    const orderDate = new Date(order.createdAt).getTime();
    if (isNaN(orderDate)) return true;

    switch (period) {
      case 'daily':
        return orderDate >= startOfToday;
      case 'weekly':
        return orderDate >= sevenDaysAgo;
      case 'monthly':
        return orderDate >= startOfMonth;
      default:
        return true;
    }
  });
}

/**
 * Clean string for XML/Excel compatibility
 */
function escapeXml(str: any): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Clean string for CSV compatibility
 */
function escapeCsv(str: any): string {
  if (str === null || str === undefined) return '""';
  const val = String(str).replace(/"/g, '""');
  return `"${val}"`;
}

/**
 * Generate Microsoft Excel XML Spreadsheet (.xls)
 * Opens natively in Microsoft Excel with styling, colors, and perfect UTF-8 support
 */
export function generateExcelXml(sheetName: string, headers: string[], rows: (string | number)[][]): string {
  const headerCells = headers
    .map((h) => `<Cell ss:StyleID="Header"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`)
    .join('');

  const rowXml = rows
    .map((row, idx) => {
      const styleId = idx % 2 === 0 ? 'DataRowEven' : 'DataRowOdd';
      const cells = row
        .map((val) => {
          const isNum = typeof val === 'number';
          const type = isNum ? 'Number' : 'String';
          return `<Cell ss:StyleID="${styleId}"><Data ss:Type="${type}">${escapeXml(val)}</Data></Cell>`;
        })
        .join('');
      return `<Row>${cells}</Row>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Author>Jawata Mart</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#1A1512"/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#4E820E"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#6CAE14" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="DataRowEven">
   <Alignment ss:Vertical="Center"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#EDE5E1"/>
   </Borders>
  </Style>
  <Style ss:ID="DataRowOdd">
   <Alignment ss:Vertical="Center"/>
   <Interior ss:Color="#F9F8F6" ss:Pattern="Solid"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#EDE5E1"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="${escapeXml(sheetName)}">
  <Table ss:DefaultRowHeight="22">
   <Row ss:StyleID="Header" ss:Height="26">
    ${headerCells}
   </Row>
   ${rowXml}
  </Table>
 </Worksheet>
</Workbook>`;
}

/**
 * Generate CSV with UTF-8 BOM (\uFEFF)
 */
export function generateCsv(headers: string[], rows: (string | number)[][]): string {
  const headerLine = headers.map(escapeCsv).join(',');
  const rowLines = rows.map((r) => r.map(escapeCsv).join(','));
  return '\uFEFF' + [headerLine, ...rowLines].join('\r\n');
}

/**
 * Trigger file download in browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Orders Excel / CSV Export Builder
 */
export function exportOrders({
  orders,
  period = 'all',
  format = 'excel',
}: {
  orders: OrderRecord[];
  period?: ExportPeriod;
  format?: ExportFormat;
}) {
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
    'Total Items Count',
    'Ordered Items (Name x Qty @ Price)',
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

  const dateStr = new Date().toISOString().split('T')[0];

  if (format === 'excel') {
    const xml = generateExcelXml(`Orders_${periodName}`, headers, rows);
    const filename = `Jawata_Mart_Orders_${periodName}_${dateStr}.xls`;
    downloadFile(xml, filename, 'application/vnd.ms-excel;charset=utf-8');
  } else {
    const csv = generateCsv(headers, rows);
    const filename = `Jawata_Mart_Orders_${periodName}_${dateStr}.csv`;
    downloadFile(csv, filename, 'text/csv;charset=utf-8');
  }

  return { count: filtered.length, totalAmount: filtered.reduce((s, o) => s + (o.total || 0), 0) };
}

/**
 * Products Catalog Excel / CSV Export Builder
 */
export function exportProducts({
  products,
  categories = [],
  filter = 'all',
  format = 'excel',
}: {
  products: ProductItem[];
  categories?: CategoryItem[];
  filter?: string;
  format?: ExportFormat;
}) {
  let filtered = [...products];

  if (filter === 'low') {
    filtered = filtered.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
  } else if (filter === 'out') {
    filtered = filtered.filter((p) => (p.stock || 0) <= 0);
  } else if (filter === 'instock') {
    filtered = filtered.filter((p) => (p.stock || 0) > 10);
  } else if (filter && filter !== 'all') {
    filtered = filtered.filter(
      (p) =>
        p.categoryId === filter ||
        p.categorySlug === filter ||
        p.categoryName?.toLowerCase() === filter.toLowerCase()
    );
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
    'Product Rating',
    'Reviews Count',
    'Image URL',
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
      p.badge || (p.isBestSeller ? 'Best Seller' : p.isFeatured ? 'Featured' : p.isNew ? 'New' : ''),
      p.rating || 5,
      p.reviewCount || 0,
      p.image || '',
    ];
  });

  const filterSuffix =
    filter === 'low'
      ? 'Low_Stock'
      : filter === 'out'
      ? 'Out_Of_Stock'
      : filter === 'instock'
      ? 'In_Stock'
      : filter !== 'all'
      ? 'Filtered'
      : 'Full_Catalog';

  const dateStr = new Date().toISOString().split('T')[0];

  if (format === 'excel') {
    const xml = generateExcelXml('Products', headers, rows);
    const filename = `Jawata_Mart_Products_${filterSuffix}_${dateStr}.xls`;
    downloadFile(xml, filename, 'application/vnd.ms-excel;charset=utf-8');
  } else {
    const csv = generateCsv(headers, rows);
    const filename = `Jawata_Mart_Products_${filterSuffix}_${dateStr}.csv`;
    downloadFile(csv, filename, 'text/csv;charset=utf-8');
  }

  return {
    count: filtered.length,
    totalUnits: filtered.reduce((s, p) => s + (p.stock || 0), 0),
  };
}
