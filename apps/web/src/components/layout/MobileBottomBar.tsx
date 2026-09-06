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
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EDE5E1] py-2 px-4 flex items-center justify-around lg:hidden shadow-lg">
      <Link
        href="/"
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname === '/' ? 'text-[#C4737E]' : 'text-[#6B5B58]'
        }`}
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </Link>

      <Link
        href="/category/all"
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname.startsWith('/category') ? 'text-[#C4737E]' : 'text-[#6B5B58]'
        }`}
      >
        <Grid className="w-5 h-5" />
        <span>Categories</span>
      </Link>

      <button
        onClick={openCart}
        className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#6B5B58] relative"
        aria-label="View Cart"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#1A1512]" />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#C4737E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <Link
        href="/track-order"
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          pathname === '/track-order' ? 'text-[#C4737E]' : 'text-[#6B5B58]'
        }`}
      >
        <Truck className="w-5 h-5" />
        <span>Track</span>
      </Link>

      <a
        href="tel:01700000000"
        className="flex flex-col items-center gap-1 text-[10px] font-medium text-[#6B5B58]"
      >
        <Phone className="w-5 h-5 text-[#F0B840]" />
        <span>Hotline</span>
      </a>
    </div>
  );
}
