import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbService } from '@/lib/db-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  const categories = await dbService.getCategories();
  return NextResponse.json(
    { categories },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if adding a subcategory
    if (body.type === 'subcategory' || (body.categoryId && (body.subCategoryName || body.name))) {
      const catId = body.categoryId;
      const subName = body.name || body.subCategoryName;
      if (!catId || !subName) {
        return NextResponse.json({ error: 'Category ID and Subcategory Name are required' }, { status: 400 });
      }
      const subCategory = await dbService.addSubCategory(catId, {
        name: subName.trim(),
        slug: body.slug,
      });
      if (!subCategory) {
        return NextResponse.json({ error: 'Category not found to add subcategory' }, { status: 404 });
      }
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/category/[slug]', 'page');
      } catch {}
      return NextResponse.json({ success: true, subCategory }, { status: 201 });
    }

    // Otherwise adding a new category
    if (!body.name) {
      return NextResponse.json({ error: 'Category Name is required' }, { status: 400 });
    }

    const category = await dbService.addCategory(body);
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/category/[slug]', 'page');
    } catch {}
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (body.type === 'subcategory' || (body.categoryId && body.subCategoryId)) {
      const { categoryId, subCategoryId, name, slug } = body;
      if (!categoryId || !subCategoryId || !name) {
        return NextResponse.json({ error: 'Category ID, Subcategory ID and Name are required' }, { status: 400 });
      }
      const updatedSub = await dbService.updateSubCategory(categoryId, subCategoryId, { name, slug });
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/category/[slug]', 'page');
      } catch {}
      return NextResponse.json({ success: true, subCategory: updatedSub });
    }

    if (!body.id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const updated = await dbService.updateCategory(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/category/[slug]', 'page');
    } catch {}
    return NextResponse.json({ success: true, category: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const categoryId = searchParams.get('categoryId');
    const subCategoryId = searchParams.get('subCategoryId');

    if (categoryId && subCategoryId) {
      const success = await dbService.deleteSubCategory(categoryId, subCategoryId);
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/category/[slug]', 'page');
      } catch {}
      return NextResponse.json({ success });
    }

    if (id) {
      const success = await dbService.deleteCategory(id);
      try {
        revalidatePath('/', 'layout');
        revalidatePath('/category/[slug]', 'page');
      } catch {}
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Category ID or SubCategory IDs required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 500 });
  }
}
