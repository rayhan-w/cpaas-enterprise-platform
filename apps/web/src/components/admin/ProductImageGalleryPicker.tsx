'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  Link2,
  Image as ImageIcon,
  X,
  Check,
  Loader2,
  Eye,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Plus,
  Sparkles,
} from 'lucide-react';

interface ProductImageGalleryPickerProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  required?: boolean;
}

/**
 * Client-side image compressor using HTML5 Canvas.
 * Produces crisp, lightweight WebP/JPEG for fast load times.
 */
async function compressImageClient(file: File, maxDim = 1400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        try {
          const webpData = canvas.toDataURL('image/webp', quality);
          if (webpData.startsWith('data:image/webp')) {
            resolve(webpData);
            return;
          }
        } catch {
          // fallback
        }
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to parse image file'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

export default function ProductImageGalleryPicker({
  images,
  onChange,
  label = 'Product Photos (প্রোডাক্ট ছবি গ্যালারি)',
  required = false,
}: ProductImageGalleryPickerProps) {
  const [mode, setMode] = useState<'device' | 'link'>('device');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  
  // Full-size Large Preview Modal State
  const [previewIdx, setPreviewIdx] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process multiple selected files
  const handleFilesSelect = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) সিলেক্ট করুন।');
      return;
    }

    setIsProcessing(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setProcessingProgress(`ছবি আপলোড হচ্ছে (${i + 1}/${files.length})...`);
      try {
        // 1. Client-side compress
        const compressedDataUrl = await compressImageClient(file);

        // 2. Try server upload
        let uploadedUrl = compressedDataUrl;
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (res.ok && data.url) {
            uploadedUrl = data.url;
          }
        } catch {
          // fallback to compressed data URL
        }

        newUrls.push(uploadedUrl);
      } catch (err) {
        console.error('Image upload error:', err);
      }
    }

    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
    }

    setIsProcessing(false);
    setProcessingProgress('');
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelect(e.dataTransfer.files);
    }
  };

  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    onChange([...images, trimmed]);
    setUrlInput('');
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const filtered = images.filter((_, idx) => idx !== indexToRemove);
    onChange(filtered);
    if (previewIdx === indexToRemove) {
      setPreviewIdx(null);
    } else if (previewIdx !== null && previewIdx > indexToRemove) {
      setPreviewIdx(previewIdx - 1);
    }
  };

  const handleSetMain = (indexToMakeMain: number) => {
    if (indexToMakeMain === 0) return;
    const item = images[indexToMakeMain];
    const rest = images.filter((_, idx) => idx !== indexToMakeMain);
    onChange([item, ...rest]);
    if (previewIdx !== null) {
      setPreviewIdx(0);
    }
  };

  const handleMove = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= images.length) return;
    const copy = [...images];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    onChange(copy);
  };

  return (
    <div className="space-y-3">
      {/* Label and Upload Mode Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-[#1A1512]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <span className="text-[11px] text-[#9B8A86]">
            একসাথে একাধিক ছবি যোগ করতে পারবেন ({images.length} টি ছবি যুক্ত আছে)
          </span>
        </div>

        {/* Device vs Link Toggle */}
        <div className="flex items-center bg-[#F4F1EA] p-0.5 rounded-xl border border-[#EDE5E1] text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('device')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'device'
                ? 'bg-white text-[#6CAE14] shadow-xs font-bold'
                : 'text-[#6B5B58] hover:text-[#1A1512]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Device (ডিভাইস থেকে)
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              mode === 'link'
                ? 'bg-white text-[#6CAE14] shadow-xs font-bold'
                : 'text-[#6B5B58] hover:text-[#1A1512]'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            Link (অনলাইন লিংক)
          </button>
        </div>
      </div>

      {/* Mode 1: Device Multi-Upload */}
      {mode === 'device' && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png, image/jpeg, image/webp, image/gif, image/avif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilesSelect(e.target.files);
              }
            }}
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-[#6CAE14] bg-[#6CAE14]/10'
                : 'border-[#EDE5E1] bg-[#F8F7F5] hover:border-[#6CAE14] hover:bg-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-2 text-[#6CAE14] gap-2">
                <Loader2 className="w-7 h-7 animate-spin" />
                <span className="text-xs font-bold">{processingProgress || 'ছবি অপ্টিমাইজ ও আপলোড হচ্ছে...'}</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 gap-2">
                <div className="w-11 h-11 rounded-full bg-[#EBF5DC] text-[#6CAE14] flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#1A1512] font-bold">
                    কম্পিউটার বা মোবাইল থেকে এক বা একাধিক ছবি সিলেক্ট করুন
                  </div>
                  <div className="text-[11px] text-[#9B8A86] mt-0.5">
                    ফাইল ড্র্যাগ করে আনুন অথবা ক্লিক করুন (একসাথে কয়েকটি ছবি সিলেক্ট করা যাবে)
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Link Input */}
      {mode === 'link' && (
        <div className="space-y-1.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
                placeholder="https://images.unsplash.com/... বা অন্য কোনো ছবির লিংক পেস্ট করুন"
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14] focus:bg-white"
              />
              <Link2 className="w-4 h-4 text-[#9B8A86] absolute left-3 top-3" />
            </div>
            <button
              type="button"
              onClick={handleAddUrl}
              disabled={!urlInput.trim()}
              className="px-4 py-2.5 bg-[#0d1f61] hover:bg-[#162d85] disabled:opacity-40 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>ছবি যোগ করুন</span>
            </button>
          </div>
          <p className="text-[10px] text-[#9B8A86]">
            লিংক পেস্ট করে &quot;ছবি যোগ করুন&quot; বাটনে ক্লিক করলে গ্যালারিতে যুক্ত হবে।
          </p>
        </div>
      )}

      {/* Gallery of Uploaded Photos */}
      {images.length > 0 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs font-bold text-[#1A1512]">
            <span>প্রোডাক্টের ছবিসমূহ (প্রথমটি কভার/মেইন ছবি):</span>
            <span className="text-[11px] font-semibold text-[#6CAE14]">
              {images.length} {images.length === 1 ? 'টি ছবি' : 'টি ছবি যোগ হয়েছে'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img, idx) => {
              const isMain = idx === 0;
              return (
                <div
                  key={idx}
                  className={`group relative rounded-2xl overflow-hidden border-2 transition-all bg-white shadow-xs ${
                    isMain ? 'border-[#6CAE14] ring-2 ring-[#6CAE14]/20' : 'border-[#EDE5E1] hover:border-[#6CAE14]/60'
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div
                    onClick={() => setPreviewIdx(idx)}
                    className="relative aspect-square w-full bg-[#F8F7F5] cursor-pointer overflow-hidden flex items-center justify-center"
                    title="বড় করে দেখতে ক্লিক করুন (Click to zoom)"
                  >
                    <img
                      src={img}
                      alt={`Product Photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop';
                      }}
                    />

                    {/* Hover Overlay with Zoom Button */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <span className="inline-flex items-center gap-1 bg-white/95 text-[#1A1512] font-bold text-[10px] px-2.5 py-1 rounded-full shadow-lg">
                        <Eye className="w-3.5 h-3.5 text-[#6CAE14]" />
                        <span>বড় করে দেখুন</span>
                      </span>
                    </div>

                    {/* Main Cover Badge */}
                    {isMain ? (
                      <span className="absolute top-2 left-2 bg-[#6CAE14] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider z-10">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        মেইন ছবি
                      </span>
                    ) : (
                      <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md z-10">
                        #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons Toolbar */}
                  <div className="p-2 bg-[#FAF8F5] border-t border-[#EDE5E1] flex items-center justify-between gap-1 text-[11px]">
                    {/* Make Main Button */}
                    {!isMain ? (
                      <button
                        type="button"
                        onClick={() => handleSetMain(idx)}
                        className="text-[#6B5B58] hover:text-[#6CAE14] font-semibold text-[10px] flex items-center gap-0.5 transition-colors cursor-pointer"
                        title="এই ছবিকে মেইন বা কভার ছবি করুন"
                      >
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>মেইন করুন</span>
                      </button>
                    ) : (
                      <span className="text-[#6CAE14] font-bold text-[10px] flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>প্রাইমারি</span>
                      </span>
                    )}

                    {/* Action icons: Zoom & Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setPreviewIdx(idx)}
                        className="p-1 rounded-lg text-[#6B5B58] hover:text-[#0d1f61] hover:bg-white transition-colors cursor-pointer"
                        title="বড় করে দেখুন (Zoom)"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                        title="ছবিটি মুছে ফেলুন (Delete)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FULL-SIZE LARGE PREVIEW MODAL (LIGHTBOX) */}
      {previewIdx !== null && images[previewIdx] && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-between p-4 sm:p-6 animate-fade-in"
          onClick={() => setPreviewIdx(null)}
        >
          {/* Top Bar */}
          <div
            className="w-full max-w-5xl flex items-center justify-between text-white pb-3 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-wider">
                ছবি {previewIdx + 1} / {images.length}
              </span>
              {previewIdx === 0 && (
                <span className="bg-[#6CAE14] text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  মেইন ছবি (Cover Image)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setPreviewIdx(null)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
              title="বন্ধ করুন (Close - ESC)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Central Large Image View */}
          <div
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Image Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setPreviewIdx((prev) => (prev! > 0 ? prev! - 1 : images.length - 1))}
                className="absolute left-2 sm:left-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer shadow-xl active:scale-95"
                title="আগের ছবি (Previous)"
              >
                <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}

            {/* The Big Crisp Image */}
            <div className="relative max-h-[75vh] max-w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-neutral-900 flex items-center justify-center">
              <img
                src={images[previewIdx]}
                alt={`Large Preview ${previewIdx + 1}`}
                className="max-h-[75vh] w-auto max-w-full object-contain select-none"
              />
            </div>

            {/* Next Image Button */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => setPreviewIdx((prev) => (prev! < images.length - 1 ? prev! + 1 : 0))}
                className="absolute right-2 sm:right-4 z-20 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 transition-all cursor-pointer shadow-xl active:scale-95"
                title="পরের ছবি (Next)"
              >
                <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            )}
          </div>

          {/* Bottom Controls Bar */}
          <div
            className="w-full max-w-3xl flex items-center justify-between gap-3 pt-3 text-white border-t border-white/10 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-white/70 truncate max-w-xs sm:max-w-md">
              {images[previewIdx].startsWith('data:') ? 'অপ্টিমাইজড আপলোডেড ছবি' : images[previewIdx]}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {previewIdx !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetMain(previewIdx)}
                  className="px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg cursor-pointer transition-all active:scale-95"
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>মেইন ছবি হিসেবে সেট করুন</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(previewIdx)}
                className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-1 shadow-lg cursor-pointer transition-all active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>মুছুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
