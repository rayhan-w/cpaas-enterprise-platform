import { NextRequest, NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

const MIME_MAP: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
};

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string[] }> }
) {
  try {
    const { filename } = await context.params;
    const rawSegments = filename || [];
    const joinedPath = rawSegments.join('/');
    const safePath = path.normalize(joinedPath).replace(/^(\.\.[\/\\])+/, '');

    const candidateDirs = [
      path.join(/*turbopackIgnore: true*/ process.cwd(), 'apps', 'web', 'public', 'uploads'),
      path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads'),
      '/home/jawatama/jawatamart/apps/web/public/uploads',
      '/home/jawatama/jawatamart/public/uploads',
      path.join(/*turbopackIgnore: true*/ process.cwd(), '.next', 'standalone', 'apps', 'web', 'public', 'uploads'),
    ];

    let foundFileBuffer: Buffer | null = null;
    let foundExt = '.jpg';

    for (const dir of candidateDirs) {
      try {
        const fullPath = path.join(/*turbopackIgnore: true*/ dir, safePath);
        const s = await stat(fullPath);
        if (s.isFile()) {
          foundFileBuffer = await readFile(fullPath);
          foundExt = path.extname(fullPath).toLowerCase();
          break;
        }
      } catch {
        // try next candidate dir
      }
    }

    if (!foundFileBuffer) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const contentType = MIME_MAP[foundExt] || 'application/octet-stream';

    return new Response(new Uint8Array(foundFileBuffer), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err: any) {
    return new NextResponse('Internal server error', { status: 500 });
  }
}
