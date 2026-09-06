'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Tag, Truck } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/formatters';
import { useToast } from '@/context/toast-context';

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeItem,
    subtotal,
    deliveryCharge,
    discount,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { success, error } = useToast();
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const res = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (res.success) {
      success(res.message);
      setCouponInput('');
    } else {
      error(res.message);
    }
  };

  const freeDeliveryThreshold = 2000;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#F8F7F5] h-full shadow-2xl flex flex-col z-10 animate-slide-in-right">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#EDE5E1] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C4737E]" />
            <h2 className="section-title text-xl text-[#1A1512]">Your Shopping Bag</h2>
            <span className="bg-[#FCF5F6] text-[#C4737E] font-bold text-xs px-2 py-0.5 rounded-full">
              {items.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#6B5B58] hover:text-[#1A1512] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#FCF5F6] border-b border-[#EDE5E1] p-3 text-xs">
          <div className="flex items-center justify-between mb-1.5 font-medium text-[#1A1512]">
            <span className="flex items-center gap-1 text-[11px]">
              <Truck className="w-3.5 h-3.5 text-[#C4737E]" />
              {remainingForFree === 0 ? (
                <span className="text-[#7A9C78] font-bold">You qualify for FREE Delivery! 🎉</span>
              ) : (
                <span>
                  Add <strong className="text-[#C4737E]">{formatPrice(remainingForFree)}</strong> more for FREE delivery
                </span>
              )}
            </span>
            <span className="font-bold text-[10px] text-[#C4737E]">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#EDE5E1] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C4737E] to-[#7A9C78] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#9B8A86]">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#EDE5E1] mb-3">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <p className="text-sm font-semibold text-[#1A1512]">Your shopping bag is empty</p>
              <p className="text-xs text-[#6B5B58] mt-1 max-w-xs">
                Explore our collections and add your favorite items to checkout without any account required!
              </p>
              <button
                onClick={closeCart}
                className="mt-4 bg-[#C4737E] hover:bg-[#A85862] text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedVariant?.id || 'base'}`}
                className="bg-white rounded-2xl p-3 border border-[#EDE5E1] flex gap-3 shadow-xs"
              >
                {/* Product Thumbnail */}
                <div className="w-18 h-18 rounded-xl bg-[#F8F7F5] overflow-hidden shrink-0 border border-[#EDE5E1]">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-[#1A1512] hover:text-[#C4737E] transition-colors line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeItem(item.productId, item.selectedVariant?.id)}
                        className="text-[#9B8A86] hover:text-[#D94040] p-1 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {item.selectedVariant && (
                      <p className="text-[10px] text-[#9B8A86] mt-0.5">
                        {item.selectedVariant.name}: {item.selectedVariant.value}
                      </p>
                    )}
                  </div>

                  {/* Quantity and Price */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#F2EDEA]">
                    <div className="flex items-center border border-[#EDE5E1] rounded-lg bg-[#F8F7F5] overflow-hidden">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1, item.selectedVariant?.id)
                        }
                        className="p-1 hover:bg-white text-[#6B5B58] transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-[#1A1512]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1, item.selectedVariant?.id)
                        }
                        className="p-1 hover:bg-white text-[#6B5B58] transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-[#1A1512]">
                      {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer with Coupon & Checkout */}
        {items.length > 0 && (
          <div className="p-4 bg-white border-t border-[#EDE5E1] space-y-3 shadow-lg">
            {/* Coupon Code Input */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-[#EAF3E9] text-[#7A9C78] rounded-xl text-xs font-semibold border border-[#7A9C78]/20">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>
                    Coupon &ldquo;{appliedCoupon.code}&rdquo; applied ({formatPrice(appliedCoupon.discount)} off)
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-[#D94040] hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code (e.g. WELCOME10)"
                  className="flex-1 bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl px-3 py-2 text-xs text-[#1A1512] uppercase placeholder-[#9B8A86] focus:outline-none focus:border-[#C4737E]"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="bg-[#1A1512] hover:bg-[#2B2424] disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shrink-0"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-[#6B5B58] pt-1">
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
                <span>Est. Delivery:</span>
                <span className="font-semibold text-[#1A1512]">
                  {deliveryCharge === 0 ? (
                    <span className="text-[#7A9C78] font-bold">FREE</span>
                  ) : (
                    formatPrice(deliveryCharge)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#1A1512] pt-2 border-t border-[#F2EDEA]">
                <span>Total Amount:</span>
                <span className="text-base text-[#C4737E]">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-2 pt-1">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full flex items-center justify-center gap-2 bg-[#C4737E] hover:bg-[#A85862] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 text-center"
              >
                <span>Proceed to Guest Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <p className="text-[11px] text-[#9B8A86] text-center">
                🛡️ No account or login required • Instant order placement
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
