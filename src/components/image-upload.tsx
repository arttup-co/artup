"use client";

import { useState, useRef } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  uploadEndpoint: string;
  currentImageUrl?: string;
  label?: string;
  aspectRatio?: number;
}

export default function ImageUpload({
  onUploadComplete,
  uploadEndpoint,
  currentImageUrl,
  label = "Image",
  aspectRatio = 1,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WEBP image");
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be less than 10MB");
      return;
    }

    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload immediately
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(uploadEndpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      onUploadComplete(data.url);
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const displayImageUrl = previewUrl || currentImageUrl;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
      </div>

      {/* Image Preview */}
      {displayImageUrl && (
        <div className="relative">
          <div
            className="relative w-full overflow-hidden rounded-lg border bg-muted"
            style={{ paddingTop: `${(1 / aspectRatio) * 100}%` }}
          >
            <img
              src={displayImageUrl}
              alt="Preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          {!isUploading && (
            <button
              type="button"
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground h-8 w-8 rounded-md hover:bg-destructive/90 flex items-center justify-center"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Upload Button */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full px-4 py-2 border border-border rounded-md bg-background hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload className="h-4 w-4" />
          {isUploading
            ? "Uploading..."
            : displayImageUrl
            ? `Change ${label}`
            : `Upload ${label}`}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Help Text */}
      <p className="text-xs text-muted-foreground">
        JPG, PNG or WEBP. Max 10MB.
      </p>
    </div>
  );
}
