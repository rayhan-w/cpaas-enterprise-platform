import React from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, Lock } from 'lucide-react';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export const metadata = {
  title: 'Guest Checkout | Nurtura Bangladesh',
  description: 'Fast guest checkout with Cash on Delivery, bKash, and Nagad.',
};

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-[#9B8A86]">
        <Link href="/" className="hover:text-[#C4737E] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/cart" className="hover:text-[#C4737E] transition-colors">
          Cart
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1A1512] font-semibold">Guest Checkout</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EDE5E1] pb-4">
        <div>
          <h1 className="section-title text-3xl sm:text-4xl text-[#1A1512]">
            Guest Checkout
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Complete your order across Bangladesh in 60 seconds without account creation.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#7A9C78] bg-[#EAF3E9] px-3.5 py-1.5 rounded-full border border-[#7A9C78]/20 w-fit">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit SSL Encrypted & Verified</span>
        </div>
      </div>

      {/* Checkout Form */}
      <CheckoutForm />
    </div>
  );
}
