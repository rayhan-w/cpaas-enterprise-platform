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
