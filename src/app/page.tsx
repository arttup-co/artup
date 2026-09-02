import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: { author: true },
  });

  // Fetch the site owner (first user) for the header
  const siteOwner = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      title: true,
      avatarUrl: true,
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {siteOwner && (siteOwner.name || siteOwner.avatarUrl) ? (
            <Link
              href={`/author/${siteOwner.id}`}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit"
            >
              {siteOwner.avatarUrl && (
                <Image
                  src={siteOwner.avatarUrl}
                  alt={siteOwner.name || "Author"}
                  width={48}
                  height={48}
                  className="rounded-full object-cover border-2 border-border"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">
                  {siteOwner.name || "Artup"}
                </h1>
                {siteOwner.title && (
                  <p className="text-sm text-muted-foreground">
                    {siteOwner.title}
                  </p>
                )}
              </div>
            </Link>
          ) : (
            <h1 className="text-3xl font-bold">Artup</h1>
          )}
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
            {posts.map((post: any) => (
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
                    className="flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    {post.author.avatarUrl && (
                      <Image
                        src={post.author.avatarUrl}
                        alt={post.author.name || "Author"}
                        width={20}
                        height={20}
                        className="rounded-full object-cover border border-border"
                      />
                    )}
                    <span>
                      {post.author.name || post.author.email}
                      {post.author.title && (
                        <span className="text-xs text-muted-foreground ml-1">
                          • {post.author.title}
                        </span>
                      )}
                    </span>
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
