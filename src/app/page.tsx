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

  // Fetch the site owner (first user) for the hero section
  const siteOwner = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      bio: true,
      avatarUrl: true,
    },
  });

  const defaultBio =
    "Welcome to my blog where I share insights and experiences from my journey.";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-[960px] mx-auto px-6 py-12 lg:py-24 lg:px-0">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-0">
            {/* Image - top on mobile, right on desktop */}
            {siteOwner?.avatarUrl && (
              <div className="lg:hidden w-full">
                <Image
                  src={siteOwner.avatarUrl}
                  alt={siteOwner.name || "Author"}
                  width={300}
                  height={387}
                  className="object-cover rounded-[20px]"
                  priority
                />
              </div>
            )}

            {/* Content */}
            <div className="space-y-6 lg:space-y-6">
              <div className="lg:space-y-3 space-y-4">
                <h1 className="font-normal lg:font-medium text-3xl lg:text-4xl leading-[1.1] tracking-[-0.02em] text-black">
                  {siteOwner?.name || "Artup"}
                </h1>
                {siteOwner?.title && (
                  <p className="text-[13.5px] lg:text-[14px] leading-[1.5] text-[#666666]">
                    {siteOwner.title}
                  </p>
                )}
              </div>

              <p className="text-[15.5px] lg:text-[18px] lg-leading-[1.7] text-[#555555] max-w-[520px]">
                {siteOwner?.bio || defaultBio}
              </p>

              {siteOwner?.email && (
                <div className="lg:pt-2">
                  <a
                    href={`mailto:${siteOwner.email}`}
                    className="inline-flex items-center justify-center px-6 lg:px-8 py-2 lg:py-3 border border-[#E0E0E0] rounded-full text-[14px] lg:text-[15px] font-normal text-[#555555] hover:bg-[#F9F9F9] hover:border-[#D0D0D0] transition-all duration-200"
                  >
                    Contacts
                  </a>
                </div>
              )}
            </div>

            {/* Desktop: Image on right */}
            {siteOwner?.avatarUrl && (
              <div className="hidden lg:block">
                <Image
                  src={siteOwner.avatarUrl}
                  alt={siteOwner.name || "Author"}
                  width={384}
                  height={476}
                  className="max-w-[384px] max-h-[476px] object-cover rounded-[20px]"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

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
