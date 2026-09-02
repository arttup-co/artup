import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    title,
    slug,
    content,
    excerpt,
    coverImageUrl,
    metaDescription,
    published,
    publishedAt,
  } = body;

  if (!title || !slug) {
    return NextResponse.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );
  }

  try {
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImageUrl,
        metaDescription,
        published,
        publishedAt: published ? (publishedAt ? new Date(publishedAt) : new Date()) : null,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to create post:", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
