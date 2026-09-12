import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category') || undefined;
  const search = searchParams.get('search') || undefined;
  const isFeatured = searchParams.get('featured') === 'true' ? true : undefined;
  const isBestSeller = searchParams.get('bestseller') === 'true' ? true : undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  const products = await dbService.getProducts({
    categorySlug,
    search,
    isFeatured,
    isBestSeller,
    limit,
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price) {
      return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
    }
    const product = await dbService.addProduct(body);
    return NextResponse.json({ product }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create product' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    const updated = await dbService.updateProduct(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, product: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    const deleted = await dbService.deleteProduct(id);
    return NextResponse.json({ success: deleted });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 500 });
  }
}
