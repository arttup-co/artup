import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        bio: true,
        avatarUrl: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, title, bio, avatarUrl } = body;

  // Validate required field
  if (!name || name.trim() === "") {
    return NextResponse.json(
      { error: "Name is required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name.trim(),
        title: title?.trim() || null,
        bio: bio?.trim() || null,
        avatarUrl: avatarUrl?.trim() || null,
        // Also update the image field for Auth.js compatibility
        image: avatarUrl?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        title: true,
        bio: true,
        avatarUrl: true,
        image: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Failed to update user profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
