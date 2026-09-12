import { NextResponse } from 'next/server';
import { dbService } from '@/lib/db-service';

export async function GET() {
  const categories = await dbService.getCategories();
  return NextResponse.json({ categories });
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
      return NextResponse.json({ success: true, subCategory }, { status: 201 });
    }

    // Otherwise adding a new category
    if (!body.name) {
      return NextResponse.json({ error: 'Category Name is required' }, { status: 400 });
    }

    const category = await dbService.addCategory(body);
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create category' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const updated = await dbService.updateCategory(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

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
      return NextResponse.json({ success });
    }

    if (id) {
      const success = await dbService.deleteCategory(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ error: 'Category ID or SubCategory IDs required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete category' }, { status: 500 });
  }
}
