'use client';

import React, { useState } from 'react';
import { X, GitMerge, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert, Sparkles, Layers } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';

interface MergeProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: ProductItem[];
  onMergeSuccess: (updatedProduct: ProductItem) => void;
}

export default function MergeProductsModal({
  isOpen,
  onClose,
  selectedProducts,
  onMergeSuccess,
}: MergeProductsModalProps) {
  const [mainProductId, setMainProductId] = useState<string>(
    selectedProducts[0]?.id || ''
  );
  const [isMerging, setIsMerging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const mainProduct = selectedProducts.find((p) => p.id === mainProductId) || selectedProducts[0];
  const otherProducts = selectedProducts.filter((p) => p.id !== mainProduct?.id);

  const handleConfirmMerge = async () => {
    if (!mainProduct) return;
    if (otherProducts.length === 0) {
      setErrorMsg('কমপক্ষে ২টি প্রোডাক্ট সিলেক্ট করতে হবে মার্জ করার জন্য।');
      return;
    }

    setIsMerging(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/products/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mainProductId: mainProduct.id,
          productIdsToMerge: otherProducts.map((p) => p.id),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to merge products');
      }

      onMergeSuccess(data.product);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while merging products');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EDE5E1] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#F1F8E8] to-[#FFF8F0] border-b border-[#EDE5E1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6CAE14] text-white flex items-center justify-center shadow-xs">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1A1512]">
                Merge Products into 1 Product with Variants
              </h2>
              <p className="text-xs text-[#6B5B58]">
                সিলেক্ট করা {selectedProducts.length}টি প্রোডাক্টকে ১টি মূল প্রোডাক্টের ভ্যারিয়েন্ট হিসেবে যুক্ত করুন
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#9B8A86] hover:text-[#1A1512] rounded-xl hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-[#1A1512]">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Choose Main Parent Product */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-[#6B5B58] uppercase tracking-wider">
              ১. মেইন প্যারেন্ট প্রোডাক্ট বেছে নিন (Main Product Selection)
            </label>
            <p className="text-[11px] text-[#6B5B58]">
              যে প্রোডাক্টটিকে মেইন রাখবেন তার নাম, ডেসক্রিপশন এবং ক্যাটাগরি বজায় থাকবে:
            </p>

            <div className="space-y-2 mt-2">
              {selectedProducts.map((prod) => (
                <label
                  key={prod.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                    mainProductId === prod.id
                      ? 'border-[#6CAE14] bg-[#F1F8E8]/50 shadow-xs'
                      : 'border-[#EDE5E1] hover:border-[#6CAE14]/40 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="mainProductRadio"
                    value={prod.id}
                    checked={mainProductId === prod.id}
                    onChange={() => setMainProductId(prod.id)}
                    className="text-[#6CAE14] focus:ring-[#6CAE14]"
                  />
                  <img
                    src={prod.image || '/jawata-mart-logo.jpg'}
                    alt={prod.name}
                    className="w-10 h-10 object-cover rounded-xl border border-[#EDE5E1] bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1A1512] truncate">{prod.name}</p>
                    <p className="text-[10px] text-[#6B5B58]">
                      SKU: <span className="font-mono">{prod.sku || 'N/A'}</span> • Price: {formatPrice(prod.price)} • Stock: {prod.stock}
                    </p>
                  </div>
                  {mainProductId === prod.id && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6CAE14] text-white">
                      Main Product
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Step 2: Summary of what will happen */}
          <div className="space-y-3 pt-4 border-t border-[#EDE5E1]">
            <label className="block text-[11px] font-bold text-[#6B5B58] uppercase tracking-wider">
              ২. মার্জ প্রিভিউ সামারি (Merge Summary & Confirmation)
            </label>

            <div className="bg-[#FAFAF9] rounded-2xl p-4 border border-[#EDE5E1] space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#0D1F61]">
                <Sparkles className="w-4 h-4 text-[#FD6B03]" />
                <span>মেইন প্রোডাক্ট: {mainProduct?.name}</span>
              </div>

              <div className="text-[11px] text-[#6B5B58]">
                নিচের {otherProducts.length}টি প্রোডাক্ট মেইন প্রোডাক্টের আন্ডারে ভ্যারিয়েন্ট হিসেবে যুক্ত হবে:
              </div>

              <div className="divide-y divide-[#EDE5E1] bg-white rounded-xl border border-[#EDE5E1] overflow-hidden">
                {otherProducts.map((p) => (
                  <div key={p.id} className="p-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={p.image || '/jawata-mart-logo.jpg'}
                        alt={p.name}
                        className="w-8 h-8 object-cover rounded-lg border border-[#EDE5E1] shrink-0"
                      />
                      <div className="truncate">
                        <span className="font-semibold block truncate">{p.name}</span>
                        <span className="text-[10px] text-[#9B8A86]">
                          SKU: {p.sku} | Price: {formatPrice(p.price)} | Stock: {p.stock}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#6CAE14] bg-[#E8F3D6] px-2 py-0.5 rounded shrink-0">
                      → Variant
                    </span>
                  </div>
                ))}
              </div>

              {/* URL Redirect reassurance alert */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>স্বয়ংক্রিয় URL রিডাইরেক্ট নিশ্চিতকরণ</span>
                </div>
                <p>
                  ভ্যারিয়েন্ট হওয়া প্রোডাক্টগুলোর পুরনো লিংক (URL) স্বয়ংক্রিয়ভাবে মেইন প্রোডাক্টের পেজে রিডাইরেক্ট হবে এবং কাস্টমার সরাসরি সংশ্লিষ্ট ভ্যারিয়েন্টটি সিলেক্ট করা অবস্থায় দেখতে পাবে। কোনো পুরনো লিঙ্ক নষ্ট হবে না।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F8F7F5] border-t border-[#EDE5E1] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={isMerging}
            className="px-4 py-2 border border-[#EDE5E1] bg-white hover:bg-[#F2EDEA] text-[#6B5B58] text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmMerge}
            disabled={isMerging || otherProducts.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6CAE14] hover:bg-[#5B960E] text-white text-xs font-bold rounded-xl shadow-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            <GitMerge className="w-4 h-4" />
            <span>{isMerging ? 'Merging Products...' : 'Confirm & Merge Products'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
