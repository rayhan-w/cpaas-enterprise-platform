'use client';

import React, { useState, useRef } from 'react';
import { Upload, Link2, Image as ImageIcon, X, Check, Loader2, RefreshCw } from 'lucide-react';

interface ImageUploadPickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

/**
 * Client-side image compressor using HTML5 Canvas.
 * Converts heavy camera photos (e.g. 5MB-10MB) to crisp, lightweight WebP/JPEG (~80KB-150KB).
 */
async function compressImageClient(file: File, maxDim = 1200, quality = 0.82): Promise<string> {
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

        // Try WebP first, fallback to JPEG
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

export default function ImageUploadPicker({
  value,
  onChange,
  label = 'Image (ছবি)',
  required = false,
}: ImageUploadPickerProps) {
  // Determine initial tab: if value starts with data: or /uploads/, default to 'device', else 'link'
  const [mode, setMode] = useState<'device' | 'link'>(
    value && (value.startsWith('data:') || value.startsWith('/uploads/')) ? 'device' : 'device'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) সিলেক্ট করুন।');
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Client-side compress to high-performance lightweight WebP/JPEG
      const compressedDataUrl = await compressImageClient(file);

      // 2. Also try uploading via /api/upload
      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          onChange(data.url);
          setIsProcessing(false);
          return;
        }
      } catch {
        // If server upload fails (e.g. serverless read-only), fallback cleanly to compressed Data URL
      }

      onChange(compressedDataUrl);
    } catch (err: any) {
      console.error('Image compression error:', err);
      alert('ছবি প্রসেস করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const isDataUrl = value?.startsWith('data:');
  const isLocalUpload = value?.startsWith('/uploads/');
  const isWebLink = value && !isDataUrl && !isLocalUpload;

  return (
    <div className="space-y-2">
      {/* Label and Source Toggle */}
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-[#1A1512]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        
        {/* Toggle Mode: Device vs Link */}
        <div className="flex items-center bg-[#F4F1EA] p-0.5 rounded-lg border border-[#EDE5E1] text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => setMode('device')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'device'
                ? 'bg-white text-[#6CAE14] shadow-xs font-bold'
                : 'text-[#6B5B58] hover:text-[#1A1512]'
            }`}
          >
            <Upload className="w-3 h-3" />
            Device (ডিভাইস)
          </button>
          <button
            type="button"
            onClick={() => setMode('link')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'link'
                ? 'bg-white text-[#6CAE14] shadow-xs font-bold'
                : 'text-[#6B5B58] hover:text-[#1A1512]'
            }`}
          >
            <Link2 className="w-3 h-3" />
            Link (ইউআরএল)
          </button>
        </div>
      </div>

      {/* Mode 1: Device Upload */}
      {mode === 'device' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/gif, image/avif"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
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
            className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-[#6CAE14] bg-[#6CAE14]/10'
                : 'border-[#EDE5E1] bg-[#F8F7F5] hover:border-[#6CAE14] hover:bg-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center justify-center py-2 text-[#6CAE14] gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs font-medium">ছবি অপ্টিমাইজ ও আপলোড হচ্ছে...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2 gap-1.5">
                <div className="w-10 h-10 rounded-full bg-[#EBF5DC] text-[#6CAE14] flex items-center justify-center shadow-xs">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs text-[#1A1512] font-semibold">
                  কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন
                </div>
                <div className="text-[11px] text-[#9B8A86]">
                  ফাইল টেনে এনে এখানে ছাড়ুন অথবা ক্লিক করুন (JPG, PNG, WebP)
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
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
              />
              <Link2 className="w-4 h-4 text-[#9B8A86] absolute left-3 top-2.5" />
            </div>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-2.5 py-2 text-xs rounded-xl border border-[#EDE5E1] text-[#9B8A86] hover:text-red-500 hover:bg-red-50 cursor-pointer"
                title="Clear link"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-[10px] text-[#9B8A86]">
            ইন্টারনেট বা অন্য কোনো সাইট থেকে ছবির সরাসরি লিংক (Direct Image URL) পেস্ট করুন।
          </p>
        </div>
      )}

      {/* Preview Card */}
      {value && (
        <div className="relative flex items-center gap-3 p-2.5 bg-white rounded-xl border border-[#EDE5E1] shadow-xs">
          <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F8F7F5] border border-[#EDE5E1] shrink-0">
            <img
              src={value}
              alt="Selected Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Image broken fallback
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&h=600&fit=crop';
              }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1512]">
              <Check className="w-3.5 h-3.5 text-[#6CAE14]" />
              <span>ছবি রেডি আছে</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold uppercase ${
                  isWebLink
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {isWebLink ? 'Web Link' : 'Device Upload'}
              </span>
            </div>
            <div className="text-[10px] text-[#9B8A86] truncate max-w-xs mt-0.5">
              {isDataUrl ? 'Compressed Base64 Image' : value}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (mode === 'device') {
                  fileInputRef.current?.click();
                } else {
                  onChange('');
                }
              }}
              className="p-1.5 text-[#6B5B58] hover:text-[#1A1512] hover:bg-[#F8F7F5] rounded-lg cursor-pointer"
              title="Change Image"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
