"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageUpload from "@/components/image-upload";

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [username, setUsername] = useState("");
  const [emailContact, setEmailContact] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [location, setLocation] = useState("");
  const [availability, setAvailability] = useState("");
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
          setUsername(data.username || "");
          setEmailContact(data.emailContact || "");
          setGithubUrl(data.githubUrl || "");
          setTwitterUrl(data.twitterUrl || "");
          setLinkedinUrl(data.linkedinUrl || "");
          setWebsiteUrl(data.websiteUrl || "");
          setLocation(data.location || "");
          setAvailability(data.availability || "");
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
          emailContact,
          githubUrl,
          twitterUrl,
          linkedinUrl,
          websiteUrl,
          location,
          availability,
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
              Username
            </label>
            <input
              type="text"
              value={username}
              disabled
              className="w-full px-3 py-2 border border-border rounded-md bg-muted text-muted-foreground cursor-not-allowed"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Username cannot be changed
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
            <ImageUpload
              onUploadComplete={(url) => setAvatarUrl(url)}
              uploadEndpoint="/api/upload/avatar"
              currentImageUrl={avatarUrl}
              label="Profile Picture"
              aspectRatio={4 / 5}
            />
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={emailContact}
                  onChange={(e) => setEmailContact(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="contact@example.com"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Public email for readers to contact you
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  GitHub URL
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://github.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  X (Twitter) URL
                </label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://x.com/yourusername"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://linkedin.com/in/yourusername"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold mb-4">Footer Contact</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://yourblog.com"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your personal or blog website
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="San Francisco, USA"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your location or timezone
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Availability
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Available for freelance work"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your current availability status
                </p>
              </div>
            </div>
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
