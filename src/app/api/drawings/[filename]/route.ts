import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const DRAWINGS_DIR = path.join(process.cwd(), '..', 'data', 'drawings');

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename } = await params;
  const decodedFilename = decodeURIComponent(filename);
  const filePath = path.join(DRAWINGS_DIR, decodedFilename);

  // Prevent path traversal
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(DRAWINGS_DIR))) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const file = await fs.readFile(filePath);
    const ext = path.extname(decodedFilename).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : 'image/jpeg';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}
