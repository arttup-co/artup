"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@/components/editor";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [postId, setPostId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    params.then(({ id }) => {
      setPostId(id);
      loadPost(id);
    });
  }, []);

  const loadPost = async (id: string) => {
    try {
      const response = await fetch(`/api/posts/${id}`);
      if (response.ok) {
        const post = await response.json();
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || "");
        setCoverImageUrl(post.coverImageUrl || "");
        setMetaDescription(post.metaDescription || "");
        setContent(post.content);
        setPublished(post.published);
        // Format date for datetime-local input
        if (post.publishedAt) {
          const date = new Date(post.publishedAt);
          setPublishedAt(date.toISOString().slice(0, 16));
        }
      } else {
        alert("Failed to load post");
        router.push("/admin");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load post");
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (shouldPublish: boolean) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          coverImageUrl,
          metaDescription,
          published: shouldPublish,
          publishedAt: shouldPublish && publishedAt ? new Date(publishedAt).toISOString() : null,
        }),
      });

      if (response.ok) {
        alert("Post saved successfully");
        setPublished(shouldPublish);
      } else {
        alert("Failed to save post");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save post");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to delete post");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit Post</h1>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm border border-destructive text-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !title}
              className="px-4 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              {published ? "Unpublish" : "Save Draft"}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title || !slug}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {published ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="post-url-slug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
              placeholder="Brief summary of the post"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Meta Description (SEO)
            </label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={2}
              placeholder="Description for search engines"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Publish Date
            </label>
            <input
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Leave empty to use current date/time when publishing
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Content *</label>
            <Editor
              content={content}
              onChange={setContent}
              placeholder="Start writing your post..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}
