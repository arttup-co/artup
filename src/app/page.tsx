import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Artup</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No posts published yet.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
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
                  <h2 className="text-2xl font-bold hover:text-primary transition-colors mb-2">
                    {post.title}
                  </h2>
                </Link>
                {post.excerpt && (
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
