'use client';

import React, { useState } from 'react';
import { Download, FileSpreadsheet, Calendar, Check, X, FileText } from 'lucide-react';
import { OrderRecord } from '@/lib/types';
import { exportOrders, filterOrdersByPeriod, ExportPeriod, ExportFormat } from '@/lib/excel-export';
import { formatPrice } from '@/lib/formatters';

interface ExportOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: OrderRecord[];
}

export default function ExportOrdersModal({ isOpen, onClose, orders }: ExportOrdersModalProps) {
  const [period, setPeriod] = useState<ExportPeriod>('daily');
  const [format, setFormat] = useState<ExportFormat>('excel');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const filteredOrders = filterOrdersByPeriod(orders, period);
  const totalAmount = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleDownload = () => {
    setIsExporting(true);
    try {
      exportOrders({ orders, period, format });
    } finally {
      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 600);
    }
  };

  const periodOptions: { id: ExportPeriod; title: string; subtitle: string; icon: string }[] = [
    {
      id: 'daily',
      title: 'Daily / Today',
      subtitle: 'আজকের সকল অর্ডার',
      icon: '⚡',
    },
    {
      id: 'weekly',
      title: 'Weekly (Last 7 Days)',
      subtitle: 'বিগত ৭ দিনের সকল অর্ডার',
      icon: '📅',
    },
    {
      id: 'monthly',
      title: 'Monthly (This Month)',
      subtitle: 'চলতি মাসের সকল অর্ডার',
      icon: '🗓️',
    },
    {
      id: 'all',
      title: 'All Time (Full History)',
      subtitle: 'শুরু থেকে সব অর্ডারের রেকর্ড',
      icon: '📁',
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
              <h3 className="font-bold text-base text-[#1A1512]">Export Orders to Excel</h3>
              <p className="text-xs text-[#6B5B58]">অর্ডার তালিকা এক্সেল বা CSV ফাইল হিসেবে ডাউনলোড করুন</p>
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
          {/* Period Selector */}
          <div>
            <label className="block text-xs font-bold text-[#1A1512] uppercase tracking-wider mb-2.5">
              1. Select Timeframe / সময়কাল বেছে নিন:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {periodOptions.map((opt) => {
                const isSelected = period === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPeriod(opt.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#6CAE14] bg-[#F1F8E8] shadow-xs'
                        : 'border-[#EDE5E1] bg-white hover:border-[#D0C5C0]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{opt.icon}</span>
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
                  <div className="text-[10px] text-[#6B5B58]">.xls (Styled green theme)</div>
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
                {filteredOrders.length} টি অর্ডার অন্তর্ভুক্ত
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-[#9B8A86] uppercase tracking-wider">
                মোট মূল্য (Total)
              </div>
              <div className="text-sm font-bold text-[#6CAE14] mt-0.5">
                {formatPrice(totalAmount)}
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
            disabled={isExporting || filteredOrders.length === 0}
            className="flex items-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] disabled:bg-[#D0C5C0] text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Downloading...' : `Download ${format.toUpperCase()} (${filteredOrders.length})`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
