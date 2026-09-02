"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@/components/editor";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          coverImageUrl,
          metaDescription,
          published: publish,
        }),
      });

      if (response.ok) {
        const post = await response.json();
        router.push(`/admin/posts/${post.id}`);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">New Post</h1>
          <div className="flex gap-2">
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
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title || !slug}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Publish
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter post title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Slug *
            </label>
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
            <label className="block text-sm font-medium mb-2">
              Excerpt
            </label>
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
              Content *
            </label>
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
