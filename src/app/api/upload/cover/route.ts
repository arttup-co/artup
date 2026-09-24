import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import sharp from 'sharp';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const OUTPUT_WIDTH = 1200; // 16:9 aspect ratio for blog covers
const OUTPUT_HEIGHT = 675;

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.type.split('/')[1];
    const filename = `cover-${timestamp}-${randomString}.${extension}`;

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'uploads', 'covers');
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Process image with Sharp - resize to target dimensions
    await sharp(buffer)
      .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, {
        fit: 'cover',
        position: 'center',
      })
      .toFile(join(uploadDir, filename));

    // Return public URL
    const publicUrl = `/api/uploads/covers/${filename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
    });
  } catch (error) {
    console.error('Cover image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload and process image' },
      { status: 500 }
    );
  }
}
