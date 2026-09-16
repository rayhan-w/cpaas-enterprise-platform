'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, Check, X, Layers, AlertTriangle, ShieldCheck, Ban } from 'lucide-react';
import { ProductItem, CategoryItem } from '@/lib/types';
import { exportProducts, ExportFormat } from '@/lib/excel-export';

interface ExportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: ProductItem[];
  categories: CategoryItem[];
}

export default function ExportProductsModal({
  isOpen,
  onClose,
  products,
  categories,
}: ExportProductsModalProps) {
  const [filter, setFilter] = useState<string>('all');
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  // Calculate filtered stats
  let filtered = [...products];
  if (filter === 'low') {
    filtered = filtered.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10);
  } else if (filter === 'out') {
    filtered = filtered.filter((p) => (p.stock || 0) <= 0);
  } else if (filter === 'instock') {
    filtered = filtered.filter((p) => (p.stock || 0) > 10);
  } else if (filter !== 'all') {
    filtered = filtered.filter(
      (p) =>
        p.categoryId === filter ||
        p.categorySlug === filter ||
        p.categoryName?.toLowerCase() === filter.toLowerCase()
    );
  }

  const totalUnits = filtered.reduce((s, p) => s + (p.stock || 0), 0);

  const handleDownload = () => {
    setIsExporting(true);
    try {
      exportProducts({ products, categories, filter, format });
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 600);
    }
  };

  const filterOptions = [
    {
      id: 'all',
      title: 'All Products (Full Catalog)',
      subtitle: 'সব প্রোডাক্ট ও পূর্ণ স্টক তথ্য',
      icon: <Layers className="w-4 h-4 text-[#6CAE14]" />,
    },
    {
      id: 'low',
      title: 'Low Stock Only (1 - 10 pcs)',
      subtitle: 'রি-অর্ডার করতে স্বল্প স্টকের তালিকা',
      icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    },
    {
      id: 'out',
      title: 'Out of Stock Only (0 pcs)',
      subtitle: 'যেসব প্রোডাক্টের স্টক শেষ হয়ে গেছে',
      icon: <Ban className="w-4 h-4 text-red-500" />,
    },
    {
      id: 'instock',
      title: 'Healthy Stock (> 10 pcs)',
      subtitle: 'পর্যাপ্ত মজুদ থাকা প্রোডাক্টসমূহ',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-[#EDE5E1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-[#F8F7F5] border-b border-[#EDE5E1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E8F5D8] text-[#4E820E] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5 text-[#6CAE14]" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#1A1512]">Export Product Catalog to Excel</h3>
              <p className="text-xs text-[#6B5B58]">প্রোডাক্ট ও স্টক তালিকা এক্সেল বা CSV ডাউনলোড করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-white text-[#9B8A86] hover:text-[#1A1512] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Stock Condition Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1A1512] uppercase tracking-wider mb-2.5">
              1. Choose Stock Scope / স্টকের ধরন নির্বাচন:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {filterOptions.map((opt) => {
                const isSelected = filter === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setFilter(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#6CAE14] bg-[#F1F8E8] shadow-xs'
                        : 'border-[#EDE5E1] bg-white hover:border-[#D0C5C0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="p-1.5 rounded-lg bg-white shadow-2xs">{opt.icon}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#6CAE14] text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="font-bold text-xs text-[#1A1512]">{opt.title}</div>
                      <div className="text-[10px] text-[#6B5B58]">{opt.subtitle}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Optional category filter */}
            {categories.length > 0 && (
              <div className="mt-3">
                <select
                  value={categories.some((c) => c.id === filter) ? filter : ''}
                  onChange={(e) => {
                    if (e.target.value) setFilter(e.target.value);
                  }}
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
                >
                  <option value="">Or filter by specific category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      Category: {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Format Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1A1512] uppercase tracking-wider mb-2.5">
              2. File Format / ফরম্যাট বেছে নিন:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormat('excel')}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  format === 'excel'
                    ? 'border-[#6CAE14] bg-[#F1F8E8]'
                    : 'border-[#EDE5E1] bg-white hover:border-[#D0C5C0]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  XLS
                </div>
                <div className="text-left">
                  <div className="font-bold text-xs text-[#1A1512]">Microsoft Excel</div>
                  <div className="text-[10px] text-[#6B5B58]">.xls (Styled & color coded)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormat('csv')}
                className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
                  format === 'csv'
                    ? 'border-[#6CAE14] bg-[#F1F8E8]'
                    : 'border-[#EDE5E1] bg-white hover:border-[#D0C5C0]'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                  CSV
                </div>
                <div className="text-left">
                  <div className="font-bold text-xs text-[#1A1512]">Standard CSV</div>
                  <div className="text-[10px] text-[#6B5B58]">UTF-8 BOM (Google Sheets)</div>
                </div>
              </button>
            </div>
          </div>

          {/* Data Preview Summary */}
          <div className="p-4 rounded-2xl bg-[#F8F7F5] border border-[#EDE5E1] flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#9B8A86] uppercase tracking-wider">
                Export Preview / তথ্য সারসংক্ষেপ
              </div>
              <div className="text-sm font-bold text-[#1A1512] mt-0.5">
                {filtered.length} টি প্রোডাক্ট অন্তর্ভুক্ত
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#9B8A86] uppercase tracking-wider">
                মোট মজুদ (Total Units)
              </div>
              <div className="text-sm font-bold text-[#6CAE14] mt-0.5">
                {totalUnits} pcs
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-[#F8F7F5] border-t border-[#EDE5E1] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#EDE5E1] text-xs font-semibold text-[#6B5B58] hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={isExporting || filtered.length === 0}
            className="flex items-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] disabled:bg-[#D0C5C0] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Downloading...' : `Download ${format.toUpperCase()} (${filtered.length})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
