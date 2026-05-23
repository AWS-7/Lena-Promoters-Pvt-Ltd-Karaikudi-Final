"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Check, Loader2, AlertCircle, ImagePlus, Trash2, HardDrive, Cloud } from "lucide-react";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

type StorageProvider = "cloudinary" | "supabase";

interface CloudinaryUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  onLoadingChange?: (loading: boolean) => void;
}

function getStorageProvider(): StorageProvider {
  if (typeof window === "undefined") return "cloudinary";
  return (localStorage.getItem("lena_storage_provider") as StorageProvider) || "cloudinary";
}

export default function CloudinaryUpload({ value, onChange, label = "Upload Image", onLoadingChange }: CloudinaryUploadProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState<StorageProvider>("cloudinary");
  const inputRef = useRef<HTMLInputElement>(null);

  // Notify parent of loading state changes
  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  useEffect(() => {
    setProvider(getStorageProvider());
  }, []);

  // Listen for provider changes from other tabs/components
  useEffect(() => {
    const handler = () => setProvider(getStorageProvider());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Only JPG, PNG, and WEBP images are allowed. Got: ${file.type}`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File too large. Maximum size is ${MAX_SIZE_MB}MB. Got: ${(file.size / 1024 / 1024).toFixed(2)}MB`;
    }
    return null;
  };

  const handleFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    // Local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    try {
      const currentProvider = getStorageProvider();
      const folder = currentProvider === "supabase" ? "admin-images" : "backup-images";

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      formData.append("provider", currentProvider);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.error || JSON.stringify(data);
        setError(msg);
        console.error("Upload error:", data);
        return;
      }

      // Use the URL based on selected provider
      const url = currentProvider === "supabase" ? data.backup_url : data.image_url;
      if (url) {
        onChange(url);
        setPreview(url);
      } else {
        setError("Upload succeeded but no URL was returned.");
      }
    } catch (err: any) {
      setError(err.message || "Upload failed. Check console for details.");
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      {preview ? (
        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-8 h-8 bg-black/60 hover:bg-[#1195db] text-white rounded-full flex items-center justify-center transition-colors"
              title="Replace image"
            >
              <ImagePlus size={14} />
            </button>
            <button
              type="button"
              onClick={() => { setPreview(""); onChange(""); }}
              className="w-8 h-8 bg-black/60 hover:bg-red-500 text-white rounded-full flex items-center justify-center transition-colors"
              title="Remove image"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#1195db] hover:bg-[#1195db]/5 transition-all"
        >
          {loading ? (
            <Loader2 size={32} className="text-[#1195db] animate-spin mb-2" />
          ) : provider === "supabase" ? (
            <HardDrive size={32} className="text-emerald-500 mb-2" />
          ) : (
            <Cloud size={32} className="text-[#1195db] mb-2" />
          )}
          <span className="text-sm font-medium text-gray-600">
            {loading ? `Uploading to ${provider === "supabase" ? "Supabase Storage..." : "Cloudinary..."}` : "Click or drag image here"}
          </span>
          <span className="text-xs text-gray-400 mt-1">
            JPG, PNG, WEBP up to {MAX_SIZE_MB}MB
          </span>
        </div>
      )}

      {/* Single input element outside the conditional */}
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFile(file);
            // Reset input value to allow re-uploading the same file
            e.target.value = "";
          }
        }}
      />

      {error && (
        <div className="flex items-start gap-2 text-red-600 text-xs bg-red-50 p-2.5 rounded-lg">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}
      {value && !error && !loading && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <Check size={12} /> Uploaded to {provider === "supabase" ? "Supabase Storage" : "Cloudinary"}
        </p>
      )}
    </div>
  );
}
