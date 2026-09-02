import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href="/" className="text-lg font-semibold hover:text-primary transition-colors">
            ← Back to posts
          </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-muted-foreground mb-8 pb-8 border-b border-border">
          <Link
            href={`/author/${post.authorId}`}
            className="hover:text-primary transition-colors"
          >
            {post.author.name || post.author.email}
          </Link>
          <span>•</span>
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
