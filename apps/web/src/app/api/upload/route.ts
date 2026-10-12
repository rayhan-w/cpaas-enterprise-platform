import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let buffer: Buffer | null = null;
    let fileName = `upload_${Date.now()}.jpg`;

    if (contentType.includes('application/json')) {
      const json = await req.json();
      const dataUrl = json.dataUrl || json.image || json.file;
      if (!dataUrl) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }

      if (typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
        const matches = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          const ext = matches[1].split('/')[1] || 'jpg';
          fileName = `${Date.now()}-${(json.filename || 'image').replace(/[^a-zA-Z0-9.-]/g, '_')}.${ext}`;
          buffer = Buffer.from(matches[2], 'base64');
        } else {
          return NextResponse.json({ url: dataUrl, success: true });
        }
      } else if (typeof dataUrl === 'string' && (dataUrl.startsWith('http://') || dataUrl.startsWith('https://'))) {
        return NextResponse.json({ url: dataUrl, success: true });
      }
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 });
      }
      const bytes = await file.arrayBuffer();
      buffer = Buffer.from(bytes);
      fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    }

    if (!buffer) {
      return NextResponse.json({ error: 'Could not process image payload' }, { status: 400 });
    }

    // Try saving to public/uploads directory
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      const filepath = path.join(uploadsDir, fileName);
      await writeFile(filepath, buffer);
      return NextResponse.json({ url: `/uploads/${fileName}`, success: true });
    } catch (fsErr) {
      // Fallback: return compressed base64 data URI
      const base64 = buffer.toString('base64');
      return NextResponse.json({ url: `data:image/jpeg;base64,${base64}`, success: true });
    }
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
