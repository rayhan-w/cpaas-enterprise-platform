'use client';

import React, { useState } from 'react';
import { Tag, Plus, CheckCircle2, X } from 'lucide-react';
import { INITIAL_COUPONS } from '@/lib/sample-data';
import { CouponItem } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';

export default function AdminCouponsPage() {
  const { success } = useToast();
  const [coupons, setCoupons] = useState<CouponItem[]>(INITIAL_COUPONS);
  const [showAddModal, setShowAddModal] = useState(false);

  const [code, setCode] = useState('');
  const [type, setType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [value, setValue] = useState('');
  const [minOrder, setMinOrder] = useState('1000');
  const [maxDiscount, setMaxDiscount] = useState('300');

  const handleAddCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !value) return;

    const newCoupon: CouponItem = {
      id: `c_${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value: Number(value),
      minOrder: Number(minOrder) || 500,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usedCount: 0,
      isActive: true,
    };

    setCoupons([newCoupon, ...coupons]);
    success(`Coupon "${newCoupon.code}" created successfully!`);
    setShowAddModal(false);
    setCode('');
    setValue('');
  };

  const toggleStatus = (id: string) => {
    setCoupons(
      coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Coupon & Discount Management
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Configure promo codes, percentage discounts, fixed vouchers, and order caps.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#C4737E] hover:bg-[#A85862] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-[#EDE5E1] p-6 sm:p-8 shadow-elevation-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F7F5] text-[#9B8A86] uppercase text-[10px] tracking-wider border-y border-[#EDE5E1]">
              <tr>
                <th className="p-3">Coupon Code</th>
                <th className="p-3">Discount Type</th>
                <th className="p-3">Value</th>
                <th className="p-3">Min Order</th>
                <th className="p-3">Max Cap</th>
                <th className="p-3">Times Used</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDEA]">
              {coupons.map((c) => (
                <tr key={c.id} className="hover:bg-[#FCF5F6]/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-[#1A1512] text-sm">
                    <span className="bg-[#FCF5F6] text-[#C4737E] px-2 py-1 rounded-md border border-[#C4737E]/20">
                      {c.code}
                    </span>
                  </td>
                  <td className="p-3 text-[#6B5B58]">{c.type}</td>
                  <td className="p-3 font-bold text-[#1A1512]">
                    {c.type === 'PERCENTAGE' ? `${c.value}% OFF` : `৳${c.value} OFF`}
                  </td>
                  <td className="p-3 text-[#6B5B58]">{formatPrice(c.minOrder)}</td>
                  <td className="p-3 text-[#6B5B58]">
                    {c.maxDiscount ? formatPrice(c.maxDiscount) : 'No limit'}
                  </td>
                  <td className="p-3 font-semibold text-[#1A1512]">{c.usedCount} times</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.isActive ? 'bg-[#EAF3E9] text-[#7A9C78]' : 'bg-[#FBDADA] text-[#D94040]'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleStatus(c.id)}
                      className={`text-[11px] font-semibold hover:underline ${
                        c.isActive ? 'text-[#D94040]' : 'text-[#7A9C78]'
                      }`}
                    >
                      {c.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-[#EDE5E1] shadow-2xl space-y-4 animate-modal-pop">
            <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-3">
              <h3 className="section-title text-xl text-[#1A1512]">Create Coupon</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#6B5B58]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#1A1512] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER25"
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 uppercase font-mono font-bold text-[#1A1512]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Discount Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512]"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={type === 'PERCENTAGE' ? '15 (for 15%)' : '150 (for ৳150)'}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Min Order (৳)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#1A1512] mb-1">Max Cap (৳)</label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder="300"
                    className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-[#1A1512]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EDE5E1]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-semibold text-[#6B5B58]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C4737E] hover:bg-[#A85862] text-white font-bold text-xs px-5 py-2 rounded-xl transition-all"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
