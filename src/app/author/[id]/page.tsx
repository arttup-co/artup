import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const author = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: {
        where: { published: true },
        orderBy: { publishedAt: "desc" },
      },
    },
  });

  if (!author) {
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

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          {author.avatarUrl && (
            <Image
              src={author.avatarUrl}
              alt={author.name || "Author"}
              width={96}
              height={96}
              className="rounded-full object-cover border-2 border-border mb-4"
            />
          )}
          <h1 className="text-4xl font-bold mb-2">
            {author.name || author.email}
          </h1>
          {author.title && (
            <p className="text-lg text-muted-foreground mb-2">{author.title}</p>
          )}
          {author.bio && (
            <p className="text-base text-muted-foreground">{author.bio}</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-6">
            Posts by {author.name || author.email}
          </h2>
          {author.posts.length === 0 ? (
            <p className="text-muted-foreground">No published posts yet.</p>
          ) : (
            <div className="space-y-8">
              {author.posts.map((post) => (
                <article key={post.id} className="border-b border-border pb-8">
                  {post.coverImageUrl && (
                    <Link href={`/${post.slug}`}>
                      <img
                        src={post.coverImageUrl}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    </Link>
                  )}
                  <Link href={`/${post.slug}`}>
                    <h3 className="text-2xl font-bold hover:text-primary transition-colors mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  {post.excerpt && (
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  )}
                  <time
                    className="text-sm text-muted-foreground"
                    dateTime={post.publishedAt?.toISOString()}
                  >
                    {post.publishedAt?.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
