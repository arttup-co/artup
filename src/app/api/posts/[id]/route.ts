import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id, authorId: session.user.id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return NextResponse.json(
      { error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const {
    title,
    slug,
    content,
    excerpt,
    coverImageUrl,
    metaDescription,
    published,
  } = body;

  if (!title || !slug) {
    return NextResponse.json(
      { error: "Title and slug are required" },
      { status: 400 }
    );
  }

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost || existingPost.authorId !== session.user.id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImageUrl,
        metaDescription,
        published,
        publishedAt:
          published && !existingPost.published ? new Date() : existingPost.publishedAt,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("Failed to update post:", error);
    return NextResponse.json(
      { error: "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post || post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete post:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
