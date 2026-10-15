"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Check, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageChange: (url: string) => void;
  label?: string;
  helperText?: string;
}

export default function ImageUploader({
  currentImageUrl,
  onImageChange,
  label = "Upload Image",
  helperText = "Supported formats: JPEG, PNG, WebP (Max 5MB)",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(currentImageUrl || "");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync if prop changes
  React.useEffect(() => {
    if (currentImageUrl !== undefined) {
      setPreviewUrl(currentImageUrl);
    }
  }, [currentImageUrl]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("File exceeds 5MB size limit. Please choose a smaller image.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!validTypes.includes(file.type)) {
      setError("Invalid file type. Allowed formats: JPEG, PNG, WebP, GIF, AVIF.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Failed to upload image. Please try again.");
        setUploading(false);
        return;
      }

      setPreviewUrl(data.url);
      onImageChange(data.url);
    } catch {
      setError("Network error while uploading. Please check connection.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl.trim()) return;
    setPreviewUrl(manualUrl.trim());
    onImageChange(manualUrl.trim());
    setShowUrlInput(false);
    setManualUrl("");
  };

  const handleRemoveImage = () => {
    setPreviewUrl("");
    onImageChange("");
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
          {label}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#FF3028] hover:underline"
        >
          {showUrlInput ? "Use File Upload" : "Or Enter Image URL"}
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg or /sail-portrait.jpg"
            className="flex-1 bg-[#16161b] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-[#FF3028]"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-3 py-2 rounded-lg bg-[#FF3028] hover:bg-[#ff453e] text-xs font-medium text-white transition-all cursor-pointer"
          >
            Apply
          </button>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          {/* Image Preview Thumbnail */}
          <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#16161b] border border-white/[0.1] shrink-0 flex items-center justify-center group">
            {previewUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-red-400 cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="text-zinc-600 flex flex-col items-center gap-1">
                <ImageIcon className="w-6 h-6" />
                <span className="text-[10px]">No image</span>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1 space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              className="hidden"
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#202028] hover:bg-[#282834] border border-white/[0.1] text-xs font-medium text-white transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF3028]" />
                    <span>Processing & Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5 text-[#FF3028]" />
                    <span>{previewUrl ? "Replace Image" : "Select Image"}</span>
                  </>
                )}
              </button>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-xs text-zinc-400 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              )}
            </div>

            <p className="text-[11px] text-zinc-500 font-light">{helperText}</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 animate-in fade-in duration-150">{error}</p>
      )}
    </div>
  );
}
