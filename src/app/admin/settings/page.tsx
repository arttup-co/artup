"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Fetch current user profile
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/users/profile");
        if (response.ok) {
          const data = await response.json();
          setName(data.name || "");
          setTitle(data.title || "");
          setBio(data.bio || "");
          setAvatarUrl(data.avatarUrl || "");
          setEmail(data.email || "");
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          bio,
          avatarUrl,
        }),
      });

      if (response.ok) {
        router.push("/admin");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to save profile");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile");
    } finally {
      setSaving(false);
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
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">Manage your author profile</p>
          </div>
          <Link
            href="/admin"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Title/Role
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Founder & CEO, Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Tell readers about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Profile Picture URL
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://example.com/your-photo.jpg"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Image upload will be available in v1.1. For now, use a direct URL.
            </p>
            {avatarUrl && (
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <img
                  src={avatarUrl}
                  alt="Profile preview"
                  className="w-24 h-24 rounded-full object-cover border-2 border-border"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <Link
              href="/admin"
              className="px-6 py-2 border border-border rounded-md hover:bg-muted transition-colors font-medium inline-block"
            >
              Cancel
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
