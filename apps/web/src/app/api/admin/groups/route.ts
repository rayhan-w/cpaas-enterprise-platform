import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { dbService } from '@/lib/db-service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('categorySlug') || undefined;
    const search = searchParams.get('search') || undefined;

    const groups = await dbService.getGroups({ categorySlug, search });
    return NextResponse.json(
      { groups },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    const group = await dbService.addGroup(body);

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/category/[slug]', 'page');
      revalidatePath('/group/[slug]', 'page');
    } catch {}

    return NextResponse.json({ success: true, group }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create group' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    const updated = await dbService.updateGroup(body.id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/category/[slug]', 'page');
      revalidatePath('/group/[slug]', 'page');
    } catch {}

    return NextResponse.json({ success: true, group: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update group' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    const deleted = await dbService.deleteGroup(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/category/[slug]', 'page');
    } catch {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete group' }, { status: 500 });
  }
}
