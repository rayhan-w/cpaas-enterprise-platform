import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbService } from '@/lib/db-service';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mainProductId, productIdsToMerge } = body;

    if (!mainProductId) {
      return NextResponse.json({ error: 'Main product ID is required.' }, { status: 400 });
    }

    if (!Array.isArray(productIdsToMerge) || productIdsToMerge.length === 0) {
      return NextResponse.json(
        { error: 'Select at least one product to merge into the main product.' },
        { status: 400 }
      );
    }

    const mergedProduct = await dbService.mergeProducts(mainProductId, productIdsToMerge);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/category/[slug]', 'page');
      revalidatePath('/products/[slug]', 'page');
    } catch {}

    return NextResponse.json({
      success: true,
      message: `Successfully merged ${productIdsToMerge.length} product(s) into "${mergedProduct.name}".`,
      product: mergedProduct,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to merge products.' },
      { status: 500 }
    );
  }
}
