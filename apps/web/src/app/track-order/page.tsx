'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  MapPin,
  Calendar,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { OrderRecord } from '@/lib/types';
import { formatPrice, formatDate } from '@/lib/formatters';

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const [orderIdInput, setOrderIdInput] = useState(searchParams.get('orderId') || '');
  const [phoneInput, setPhoneInput] = useState(searchParams.get('phone') || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrder = async (orderId: string, phone: string) => {
    if (!orderId.trim() || !phone.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(
        `/api/orders/track?orderNumber=${encodeURIComponent(orderId.trim())}&phone=${encodeURIComponent(
          phone.trim()
        )}`
      );
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setOrder(null);
        setErrorMsg(data.error || 'No matching order found for this Order ID and Phone Number.');
      }
    } catch {
      setErrorMsg('Failed to query order tracking. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialOrderId = searchParams.get('orderId');
    const initialPhone = searchParams.get('phone');
    if (initialOrderId && initialPhone) {
      fetchOrder(initialOrderId, initialPhone);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderIdInput, phoneInput);
  };

  const steps = [
    { key: 'PENDING', label: 'Order Placed', desc: 'Received in system' },
    { key: 'CONFIRMED', label: 'Confirmed', desc: 'Payment & address verified' },
    { key: 'PROCESSING', label: 'Processing', desc: 'Item allocated in warehouse' },
    { key: 'PACKED', label: 'Packed', desc: 'Quality checked & sealed' },
    { key: 'SHIPPED', label: 'Shipped', desc: 'Handed to courier partner' },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'Rider on the way' },
    { key: 'DELIVERED', label: 'Delivered', desc: 'Successfully handed over' },
  ];

  const getStepIndex = (status: string) => {
    const idx = steps.findIndex((s) => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C4737E] block mb-1">
          Live Status
        </span>
        <h1 className="section-title text-3xl sm:text-4xl text-[#1A1512]">
          Track Your Delivery
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5B58] mt-2">
          Enter your Order Reference Number and Mobile Number to check real-time progress.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EDE5E1] shadow-elevation-1 max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#1A1512] mb-1">Order ID</label>
            <input
              type="text"
              required
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value.toUpperCase())}
              placeholder="e.g. NUR-1001"
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#1A1512] uppercase focus:outline-none focus:border-[#C4737E]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#1A1512] mb-1">Mobile Number</label>
            <input
              type="tel"
              required
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              placeholder="017XXXXXXXX"
              className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3.5 py-2.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#C4737E]"
            />
          </div>

          <div className="sm:col-span-1 flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C4737E] hover:bg-[#A85862] disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <span>...</span>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-[#FBDADA] border border-[#D94040]/30 rounded-xl flex items-center gap-2 text-xs text-[#D94040]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Result Card */}
      {order && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EDE5E1] shadow-elevation-2 space-y-8 animate-slide-in-up">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EDE5E1]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-lg text-[#1A1512]">
                  Order #{order.orderNumber}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    order.orderStatus === 'DELIVERED'
                      ? 'bg-[#EAF3E9] text-[#7A9C78]'
                      : order.orderStatus === 'CANCELLED'
                      ? 'bg-[#FBDADA] text-[#D94040]'
                      : 'bg-[#FCF5F6] text-[#C4737E]'
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <p className="text-xs text-[#9B8A86] mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>

            {/* Payment Status Pill */}
            <div className="text-right">
              <span className="text-xs text-[#9B8A86] block">Payment ({order.paymentMethod}):</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full inline-block mt-0.5 ${
                  order.paymentStatus === 'PAID'
                    ? 'bg-[#EAF3E9] text-[#7A9C78]'
                    : order.paymentStatus === 'REJECTED'
                    ? 'bg-[#FBDADA] text-[#D94040]'
                    : 'bg-[#FFF8F0] text-[#F4821F]'
                }`}
              >
                {order.paymentStatus === 'PENDING_VERIFICATION'
                  ? 'Pending Verification'
                  : order.paymentStatus}
              </span>
            </div>
          </div>

          {/* 7-Step Visual Timeline */}
          <div>
            <h3 className="section-title text-lg text-[#1A1512] mb-6">Delivery Progress</h3>
            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
              {steps.map((step, idx) => {
                const isCompleted = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div
                    key={step.key}
                    className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                      isCurrent
                        ? 'border-[#C4737E] bg-[#FCF5F6] shadow-xs'
                        : isCompleted
                        ? 'border-[#7A9C78]/40 bg-[#EAF3E9]/50'
                        : 'border-[#EDE5E1] bg-[#F8F7F5] opacity-50'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                        isCompleted
                          ? 'bg-[#7A9C78] text-white'
                          : 'bg-[#EDE5E1] text-[#9B8A86]'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <p className="text-[11px] font-bold text-[#1A1512] leading-tight">
                      {step.label}
                    </p>
                    <p className="text-[9px] text-[#9B8A86] mt-1 leading-tight">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Shipping & Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EDE5E1] text-xs">
            {/* Left: Destination */}
            <div className="space-y-3 bg-[#F8F7F5] p-5 rounded-2xl border border-[#EDE5E1]">
              <h4 className="font-bold text-[#1A1512] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C4737E]" />
                <span>Delivery Address</span>
              </h4>
              <p className="text-[#1A1512] font-semibold">{order.customerName}</p>
              <p className="text-[#6B5B58] leading-relaxed">
                {order.address}, {order.area}, {order.district}, {order.division}
              </p>
              <p className="text-[#9B8A86]">Contact: {order.customerPhone}</p>
              {order.deliveryNote && (
                <p className="text-[11px] italic text-[#C4737E]">
                  Note: &ldquo;{order.deliveryNote}&rdquo;
                </p>
              )}
            </div>

            {/* Right: Order Summary */}
            <div className="space-y-2 bg-[#F8F7F5] p-5 rounded-2xl border border-[#EDE5E1]">
              <h4 className="font-bold text-[#1A1512] flex items-center gap-1.5 mb-2">
                <Package className="w-4 h-4 text-[#7A9C78]" />
                <span>Items ({order.items.length})</span>
              </h4>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1 divide-y divide-[#EDE5E1]">
                {order.items.map((it) => (
                  <div key={it.id} className="pt-2 first:pt-0 flex justify-between gap-2">
                    <span className="text-[#1A1512] line-clamp-1">
                      {it.quantity}x {it.productName}
                    </span>
                    <span className="font-bold text-[#1A1512] shrink-0">
                      {formatPrice(it.total)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-[#EDE5E1] flex justify-between font-bold text-sm text-[#C4737E]">
                <span>Total Amount:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
