'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, ShoppingBag, Truck, Phone } from 'lucide-react';
import { useCart } from '@/context/cart-context';

export default function MobileBottomBar() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#DFECCE] py-2 px-3 flex items-center justify-around lg:hidden shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
          pathname === '/' ? 'text-[#6CAE14]' : 'text-[#526052]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        href="/category/all"
        className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
          pathname.startsWith('/category') ? 'text-[#6CAE14]' : 'text-[#526052]'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span>Categories</span>
      </Link>

      <button
        onClick={openCart}
        className="flex flex-col items-center gap-1 text-[11px] font-bold text-[#526052] relative"
        aria-label="View Cart"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#0E140E]" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#6CAE14] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <Link
        href="/track-order"
        className={`flex flex-col items-center gap-1 text-[11px] font-bold transition-colors ${
          pathname === '/track-order' ? 'text-[#6CAE14]' : 'text-[#526052]'
        }`}
      >
        <Truck className="w-5 h-5" />
        <span>Track</span>
      </Link>

      <a
        href="tel:01915210799"
        className="flex flex-col items-center gap-1 text-[11px] font-bold text-[#526052]"
      >
        <Phone className="w-5 h-5 text-[#6CAE14]" />
        <span>Call Us</span>
      </a>
    </div>
  );
}
