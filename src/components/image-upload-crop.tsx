'use client';

import { useState, useCallback, useRef } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Upload, X } from 'lucide-react';

interface ImageUploadCropProps {
  onUploadComplete: (url: string) => void;
  uploadEndpoint: '/api/upload/avatar' | '/api/upload/cover';
  currentImageUrl?: string;
  label?: string;
  aspectRatio?: number; // e.g., 4/5 for portrait, 16/9 for landscape
}

export default function ImageUploadCrop({
  onUploadComplete,
  uploadEndpoint,
  currentImageUrl,
  label = 'Image',
  aspectRatio = 4 / 5, // Default to portrait
}: ImageUploadCropProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaSize, setMediaSize] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedArea(croppedArea);
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const onMediaLoaded = useCallback((mediaSize: { width: number; height: number; naturalWidth: number; naturalHeight: number }) => {
    setMediaSize(mediaSize);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please select a JPG, PNG, or WEBP image');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !croppedArea || !mediaSize.naturalWidth) return;

    setIsUploading(true);
    setError(null);

    try {
      // Calculate crop coordinates relative to original image
      const scaleX = mediaSize.naturalWidth / mediaSize.width;
      const scaleY = mediaSize.naturalHeight / mediaSize.height;

      const cropX = croppedArea.x * scaleX;
      const cropY = croppedArea.y * scaleY;
      const cropWidth = croppedArea.width * scaleX;
      const cropHeight = croppedArea.height * scaleY;

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('cropX', cropX.toString());
      formData.append('cropY', cropY.toString());
      formData.append('cropWidth', cropWidth.toString());
      formData.append('cropHeight', cropHeight.toString());

      const response = await fetch(uploadEndpoint, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onUploadComplete(data.url);
      handleCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!imageSrc) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>

        {/* Current Image Preview */}
        {currentImageUrl && (
          <div className="mb-4 p-4 border border-border rounded-md bg-muted/50">
            <p className="text-xs text-muted-foreground mb-2">Current image:</p>
            <div
              className="mx-auto rounded-md overflow-hidden bg-muted"
              style={{
                aspectRatio: aspectRatio.toString(),
                maxWidth: aspectRatio > 1 ? '100%' : '192px'
              }}
            >
              <img
                src={currentImageUrl}
                alt="Current"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full px-4 py-8 border-2 border-dashed border-border rounded-md bg-background hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <Upload className="w-8 h-8" />
          <span className="text-sm font-medium">Upload New Image</span>
          <span className="text-xs">Supported: JPG, PNG, WEBP (Max 10MB)</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      <div className="space-y-4">
        {/* Crop Area */}
        <div className="relative w-full bg-black rounded-md overflow-hidden" style={{ height: '500px' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onMediaLoaded={onMediaLoaded}
            objectFit="contain"
          />
        </div>

        {/* Zoom Control */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-muted-foreground">
            Zoom
          </label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 px-4 py-2.5 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            {isUploading ? 'Uploading...' : 'Save & Upload'}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isUploading}
            className="flex-1 px-4 py-2.5 bg-background border border-border text-foreground rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Supported: JPG, PNG, WEBP (Max 10MB)
        </p>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
