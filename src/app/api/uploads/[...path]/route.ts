import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { stat } from "fs/promises";

const UPLOAD_DIR = join(process.cwd(), "uploads");

// Allowed file extensions for security
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

// MIME type mapping
const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;

    // Security: Validate path segments to prevent directory traversal
    if (!path || path.length === 0) {
      return NextResponse.json(
        { error: "Invalid path" },
        { status: 400 }
      );
    }

    // Security: Check for directory traversal attempts
    for (const segment of path) {
      if (segment.includes("..") || segment.includes("/") || segment.includes("\\")) {
        return NextResponse.json(
          { error: "Invalid path" },
          { status: 400 }
        );
      }
    }

    // Construct file path
    const filePath = join(UPLOAD_DIR, ...path);

    // Security: Ensure the resolved path is still within UPLOAD_DIR
    if (!filePath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json(
        { error: "Invalid path" },
        { status: 400 }
      );
    }

    // Security: Validate file extension
    const extension = path[path.length - 1].substring(
      path[path.length - 1].lastIndexOf(".")
    ).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { error: "File type not allowed" },
        { status: 400 }
      );
    }

    // Check if file exists
    try {
      const stats = await stat(filePath);
      if (!stats.isFile()) {
        return NextResponse.json(
          { error: "Not found" },
          { status: 404 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = await readFile(filePath);

    // Get MIME type
    const mimeType = MIME_TYPES[extension] || "application/octet-stream";

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Only allow GET and HEAD methods
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;

    if (!path || path.length === 0) {
      return new NextResponse(null, { status: 400 });
    }

    for (const segment of path) {
      if (segment.includes("..") || segment.includes("/") || segment.includes("\\")) {
        return new NextResponse(null, { status: 400 });
      }
    }

    const filePath = join(UPLOAD_DIR, ...path);

    if (!filePath.startsWith(UPLOAD_DIR)) {
      return new NextResponse(null, { status: 400 });
    }

    const extension = path[path.length - 1].substring(
      path[path.length - 1].lastIndexOf(".")
    ).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return new NextResponse(null, { status: 400 });
    }

    try {
      const stats = await stat(filePath);
      if (!stats.isFile()) {
        return new NextResponse(null, { status: 404 });
      }

      const mimeType = MIME_TYPES[extension] || "application/octet-stream";

      return new NextResponse(null, {
        status: 200,
        headers: {
          "Content-Type": mimeType,
          "Cache-Control": "public, max-age=31536000, immutable",
          "Content-Length": stats.size.toString(),
        },
      });
    } catch (error) {
      return new NextResponse(null, { status: 404 });
    }
  } catch (error) {
    console.error("Error checking file:", error);
    return new NextResponse(null, { status: 500 });
  }
}
