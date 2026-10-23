'use client';

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { ProductVariant } from '@/lib/types';
import { parseRobustPrice, formatPrice } from '@/lib/formatters';
import ImageUploadPicker from './ImageUploadPicker';

interface VariantEditorSectionProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  defaultPrice?: string | number;
  defaultImage?: string;
}

export default function VariantEditorSection({
  variants,
  onChange,
  defaultPrice = '',
  defaultImage = '',
}: VariantEditorSectionProps) {
  const handleAddVariant = () => {
    const nextIdx = variants.length + 1;
    const basePrice = typeof defaultPrice === 'number' ? defaultPrice : parseRobustPrice(defaultPrice) || 0;
    const newVariant: ProductVariant = {
      id: `var_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: `Variant ${nextIdx}`,
      sku: '',
      price: basePrice,
      regularPrice: null,
      stock: 20,
      image: defaultImage || '',
      images: defaultImage ? [defaultImage] : [],
      isActive: true,
      order: variants.length,
    };
    onChange([...variants, newVariant]);
  };

  const handleUpdateVariant = (index: number, updates: Partial<ProductVariant>) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], ...updates };
    onChange(updated);
  };

  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === variants.length - 1)
    ) {
      return;
    }
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    const updated = [...variants];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // re-assign order
    updated.forEach((v, idx) => {
      v.order = idx;
    });
    onChange(updated);
  };

  const totalVariantStock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);

  return (
    <div className="space-y-4 pt-4 border-t border-[#EDE5E1]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#1A1512]">Product Variants (রং / সাইজ / ডিজাইন)</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F3D6] text-[#4A7A0E]">
              {variants.length} Variant{variants.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-[11px] text-[#6B5B58] mt-0.5">
            একই প্রোডাক্টের বিভিন্ন মডেল বা রঙের জন্য আলাদা ভ্যারিয়েন্ট যোগ করুন। ভ্যারিয়েন্ট থাকলে মেইন স্টকের জায়গায় সব ভ্যারিয়েন্টের মোট স্টক প্রযোজ্য হবে।
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddVariant}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6CAE14] hover:bg-[#5B960E] text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Variant</span>
        </button>
      </div>

      {variants.length > 0 ? (
        <div className="space-y-3">
          {variants.map((variant, idx) => {
            const hasInvalidPrice = !variant.price || Number(variant.price) <= 0;
            return (
              <div
                key={variant.id || idx}
                className="bg-[#FAFAF9] border border-[#EDE5E1] rounded-2xl p-4 space-y-3 transition-all hover:border-[#6CAE14]/40"
              >
                {/* Top header row: Variant Name, Active Toggle, Reorder, Delete */}
                <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#EDE5E1]">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="w-6 h-6 rounded-full bg-[#1A1512] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleUpdateVariant(idx, { name: e.target.value })}
                      placeholder="Variant Name (e.g. Gold, Silver, XL, 500g)"
                      className="font-bold text-xs text-[#1A1512] bg-white border border-[#EDE5E1] rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#6CAE14] w-full max-w-xs"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="flex items-center gap-1.5 text-[11px] text-[#1A1512] font-semibold cursor-pointer mr-2">
                      <input
                        type="checkbox"
                        checked={variant.isActive !== false}
                        onChange={(e) => handleUpdateVariant(idx, { isActive: e.target.checked })}
                        className="rounded text-[#6CAE14] focus:ring-[#6CAE14]"
                      />
                      <span>Active</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-[#6B5B58] hover:text-[#1A1512] disabled:opacity-30 rounded hover:bg-white"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === variants.length - 1}
                      className="p-1 text-[#6B5B58] hover:text-[#1A1512] disabled:opacity-30 rounded hover:bg-white"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                      title="Delete Variant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Fields Grid: SKU, Price, Regular Price, Stock */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-[#6B5B58] uppercase mb-1">
                      SKU <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={variant.sku || ''}
                      onChange={(e) => handleUpdateVariant(idx, { sku: e.target.value.toUpperCase() })}
                      placeholder="e.g. JM-WATCH-GOLD"
                      className="w-full bg-white border border-[#EDE5E1] rounded-lg px-2.5 py-1.5 font-mono text-[11px] uppercase focus:outline-none focus:border-[#6CAE14]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#6B5B58] uppercase mb-1">
                      Price (৳) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={variant.price !== undefined ? variant.price : ''}
                      onChange={(e) => {
                        const parsed = parseRobustPrice(e.target.value);
                        handleUpdateVariant(idx, { price: parsed !== null ? parsed : (e.target.value as any) });
                      }}
                      placeholder="e.g. 1,200"
                      className={`w-full bg-white border rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none ${
                        hasInvalidPrice ? 'border-red-400 focus:border-red-500' : 'border-[#EDE5E1] focus:border-[#6CAE14]'
                      }`}
                    />
                    {hasInvalidPrice && (
                      <span className="text-[10px] text-red-500 block mt-0.5">Price &gt; 0 required</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#6B5B58] uppercase mb-1">
                      Regular Price (৳)
                    </label>
                    <input
                      type="text"
                      value={variant.regularPrice !== null && variant.regularPrice !== undefined ? variant.regularPrice : ''}
                      onChange={(e) => {
                        const val = e.target.value.trim();
                        if (!val) {
                          handleUpdateVariant(idx, { regularPrice: null });
                        } else {
                          const parsed = parseRobustPrice(val);
                          handleUpdateVariant(idx, { regularPrice: parsed });
                        }
                      }}
                      placeholder="Original price"
                      className="w-full bg-white border border-[#EDE5E1] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#6CAE14]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#6B5B58] uppercase mb-1">
                      Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={variant.stock !== undefined ? variant.stock : 0}
                      onChange={(e) => handleUpdateVariant(idx, { stock: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                      placeholder="Available stock"
                      className="w-full bg-white border border-[#EDE5E1] rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#6CAE14]"
                    />
                  </div>
                </div>

                {/* Variant Image Picker */}
                <div className="pt-2 border-t border-[#F2EDEA]">
                  <div className="flex items-center gap-3">
                    {variant.image ? (
                      <img
                        src={variant.image}
                        alt={variant.name}
                        className="w-12 h-12 object-cover rounded-lg border border-[#EDE5E1] bg-white shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg border border-dashed border-[#EDE5E1] bg-white flex items-center justify-center text-[#9B8A86] shrink-0">
                        <ImageIcon className="w-5 h-5 opacity-40" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <ImageUploadPicker
                        label="Variant Image (ভ্যারিয়েন্টের ছবি)"
                        value={variant.image || ''}
                        onChange={(url) => handleUpdateVariant(idx, { image: url, images: [url] })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="p-3 bg-[#EAF3E9] rounded-xl border border-[#DFECCE] flex items-center justify-between text-xs text-[#3E6511]">
            <span className="font-semibold">
              Total Variant Stock: <strong>{totalVariantStock} units</strong> across {variants.length} variant(s)
            </span>
            <span className="text-[11px] text-[#5B960E]">Parent product stock will automatically sync to {totalVariantStock}</span>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-[#F8F7F5] rounded-2xl border border-dashed border-[#EDE5E1] text-center">
          <p className="text-xs text-[#6B5B58]">
            এই প্রোডাক্টে এখনো কোনো ভ্যারিয়েন্ট যোগ করা হয়নি। ভ্যারিয়েন্ট না থাকলে প্রোডাক্টের মূল দাম ও স্টক সরাসরি কাজ করবে।
          </p>
          <button
            type="button"
            onClick={handleAddVariant}
            className="mt-2 text-xs font-bold text-[#6CAE14] hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ভ্যারিয়েন্ট যোগ করতে এখানে ক্লিক করুন</span>
          </button>
        </div>
      )}
    </div>
  );
}
