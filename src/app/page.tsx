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

      <main className="max-w-[960px] mx-auto px-6 py-12 lg:py-16 lg:px-0">
        <h2 className="text-2xl lg:text-5xl font-medium lg:font-semibold mb-8 lg:mb-12">
          Blog
        </h2>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts published yet.</p>
          </div>
        ) : (
          <div className="space-y-6 lg:space-y-8">
            {posts.map((post: any) => (
              <article
                key={post.id}
                className="bg-[#F5F5F5] rounded-2xl p-6 lg:p-10"
              >
                <div className="flex flex-row justify-between items-center space-x-8 gap-2 lg:gap-4 mb-4 lg:mb-6">
                  <Link href={`/${post.slug}`} className="flex-1">
                    <h3 className="text-lg lg:text-2xl font-normal text-black hover:opacity-80 transition-opacity">
                      {post.title}
                    </h3>
                  </Link>
                  <time
                    dateTime={post.publishedAt?.toISOString()}
                    className="text-[13px] lg:text-[15px] text-[#666666] flex-shrink-0 text-left lg:whitespace-nowrap"
                  >
                    <span className="lg:hidden">
                      {post.publishedAt?.toLocaleDateString("en-US", {
                        month: "long",
                      })}
                      <br />
                      {post.publishedAt?.getDate()}, {post.publishedAt?.getFullYear()}
                    </span>
                    <span className="hidden lg:inline">
                      {post.publishedAt?.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </time>
                </div>

                {post.excerpt && (
                  <p className="text-[14px] lg:text-[15.5px] text-black lg:leading-[1.7] mb-6 [display:-webkit-box] [-webkit-line-clamp:10] [-webkit-box-orient:vertical] [overflow:hidden] lg:[-webkit-line-clamp:4]">
                    {post.excerpt}
                  </p>
                )}

                <Link
                  href={`/${post.slug}`}
                  className="inline-flex items-center gap-2 text-base text-[#555555] hover:text-black transition-colors underline"
                >
                  Read more
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
