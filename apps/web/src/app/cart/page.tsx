'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryZone,
    setDeliveryZone,
    deliveryCharge,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { success, error } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setLoading(true);
    const res = await applyCoupon(couponInput.trim());
    setLoading(false);
    if (res.success) {
      success(res.message);
      setCouponInput('');
    } else {
      error(res.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#EDE5E1] pb-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Your Shopping Bag
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Review your selected products before proceeding to high-speed guest checkout.
          </p>
        </div>
        <Link
          href="/"
          className="text-xs font-semibold text-[#1A1512] hover:text-[#0D5435] flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center max-w-md mx-auto border border-[#EDE5E1] shadow-elevation-1 space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#E7F2EC] flex items-center justify-center mx-auto text-[#0D5435]">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="section-title text-xl text-[#1A1512]">Your Bag is Currently Empty</h2>
          <p className="text-xs text-[#6B5B58]">
            Browse our top lifestyle, baby care, fashion, and electronics categories to add items.
          </p>
          <Link
            href="/"
            className="inline-block bg-[#0D5435] hover:bg-[#093D26] text-white font-semibold text-xs px-6 py-3 rounded-full transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Items Table / Cards */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-3xl border border-[#EDE5E1] p-6 shadow-elevation-1 divide-y divide-[#F2EDEA]">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.selectedVariant?.id || 'base'}`}
                  className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover bg-[#F8F7F5] border border-[#EDE5E1] shrink-0"
                    />
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="text-sm font-semibold text-[#1A1512] hover:text-[#0D5435] transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      {item.selectedVariant && (
                        <p className="text-xs text-[#9B8A86] mt-0.5">
                          {item.selectedVariant.name}: {item.selectedVariant.value}
                        </p>
                      )}
                      <p className="text-xs font-bold text-[#0D5435] mt-1 sm:hidden">
                        {formatPrice(item.unitPrice)} each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                    <div className="flex items-center border border-[#EDE5E1] rounded-xl bg-[#F8F7F5] overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.selectedVariant?.id)
                        }
                        className="p-1.5 hover:bg-white text-[#6B5B58]"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-[#1A1512]">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.selectedVariant?.id)
                        }
                        className="p-1.5 hover:bg-white text-[#6B5B58]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#1A1512] block">
                        {formatPrice(item.totalPrice)}
                      </span>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, item.selectedVariant?.id)}
                      className="text-[#9B8A86] hover:text-[#D94040] p-1.5 transition-colors"
                      title="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Destination quick toggle */}
            <div className="bg-white rounded-2xl border border-[#EDE5E1] p-4 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#1A1512] font-semibold">
                <Truck className="w-4 h-4 text-[#0D5435]" />
                <span>Delivery Location:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeliveryZone('INSIDE_DHAKA')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                    deliveryZone === 'INSIDE_DHAKA'
                      ? 'bg-[#E7F2EC] border-[#0D5435] text-[#0D5435]'
                      : 'border-[#EDE5E1] text-[#6B5B58]'
                  }`}
                >
                  Inside Dhaka (৳60)
                </button>
                <button
                  onClick={() => setDeliveryZone('OUTSIDE_DHAKA')}
                  className={`px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                    deliveryZone === 'OUTSIDE_DHAKA'
                      ? 'bg-[#E7F2EC] border-[#0D5435] text-[#0D5435]'
                      : 'border-[#EDE5E1] text-[#6B5B58]'
                  }`}
                >
                  Outside Dhaka (৳120)
                </button>
              </div>
            </div>
          </div>

          {/* Right: Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-[#EDE5E1] shadow-elevation-1 space-y-4">
              <h2 className="section-title text-xl text-[#1A1512] border-b border-[#EDE5E1] pb-3">
                Order Breakdown
              </h2>

              {/* Coupon */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#EAF3E9] text-[#7A9C78] rounded-xl text-xs font-semibold border border-[#7A9C78]/20">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon: {appliedCoupon.code}</span>
                  </div>
                  <button onClick={removeCoupon} className="text-[#D94040] hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs uppercase"
                  />
                  <button
                    type="submit"
                    disabled={loading || !couponInput.trim()}
                    className="bg-[#1A1512] hover:bg-[#2B2424] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              <div className="space-y-2 text-xs text-[#6B5B58] pt-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#1A1512]">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#7A9C78]">
                    <span>Discount:</span>
                    <span className="font-semibold">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold text-[#1A1512]">
                    {deliveryCharge === 0 ? (
                      <span className="text-[#7A9C78] font-bold">FREE</span>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#1A1512] pt-3 border-t border-[#EDE5E1]">
                  <span>Total:</span>
                  <span className="text-xl text-[#0D5435]">{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-[#0D5435] hover:bg-[#093D26] text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95 text-center"
              >
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
