import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const runtime = "nodejs";

export default async function AdminDashboard() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.filter((p) => !p.published).length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {session.user.name || session.user.email}
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            View site →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-3xl font-bold">{posts.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-3xl font-bold">{publishedCount}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Drafts</p>
              <p className="text-3xl font-bold">{draftCount}</p>
            </div>
          </div>
          <Link
            href="/admin/posts/new"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground text-lg mb-4">
              No posts yet. Create your first post!
            </p>
            <Link
              href="/admin/posts/new"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              Create Post
            </Link>
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-sm font-medium">
                    Updated
                  </th>
                  <th className="text-right px-4 py-3 text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="font-medium hover:text-primary transition-colors"
                      >
                        {post.title || "Untitled"}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          post.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {post.updatedAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
