import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { tiptapJsonToHtml } from "@/lib/tiptap";

export const runtime = "nodejs";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { author: true },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const postUrl = `${siteUrl}/${post.slug}`;
  const description = post.excerpt || post.metaDescription || post.title;
  const imageUrl = post.coverImageUrl || post.author.avatarUrl || `${siteUrl}/og-image.png`;

  return {
    title: post.title,
    description,
    openGraph: {
      type: "article",
      url: postUrl,
      title: post.title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author.name || post.author.email || ""],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [imageUrl],
    },
  };
}

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

  // Convert Tiptap JSON to HTML
  const htmlContent = tiptapJsonToHtml(post.content);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[960px] mx-auto px-6 py-12 lg:py-16 lg:px-0">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-base text-[#555555] hover:text-black transition-colors mb-8"
        >
          ← Back to posts
        </Link>

        {post.coverImageUrl && (
          <div className="relative w-full max-h-[500px] mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              width={960}
              height={500}
              className="w-full object-cover"
              priority
            />
          </div>
        )}

        <article className="rounded-2xl p-6 lg:p-10">
          <div className="flex flex-row justify-between items-center gap-2 lg:gap-4 mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-medium text-black flex-1">
              {post.title}
            </h1>
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

          <div
            className="article-content text-[14px] lg:text-[15.5px] text-[#333333] leading-[1.7]"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </div>
    </div>
  );
}
