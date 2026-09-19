'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Truck, ShieldCheck, MapPin } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#0E140E] text-white text-xs py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
        {/* Left: Highlight message */}
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 text-white/95 font-medium">
            <Truck className="w-3.5 h-3.5 text-[#9ED114]" />
            <span>Free delivery across Bangladesh on orders over <strong>৳2,000!</strong> 🎉</span>
          </div>
          <span className="hidden md:inline text-white/30">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-white/80">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6CAE14]" />
            <span>100% Genuine & Authentic Products</span>
          </div>
        </div>

        {/* Right: About Us, Hotline & Track Order */}
        <div className="flex items-center gap-3 sm:gap-4 text-white/85">
          <Link
            href="/about"
            className="hover:text-[#9ED114] transition-colors flex items-center gap-1 font-medium"
          >
            <span>About Us</span>
          </Link>
          <span className="text-white/30">|</span>
          <Link
            href="/track-order"
            className="hover:text-[#9ED114] transition-colors flex items-center gap-1 font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-[#9ED114]" />
            <span>Track Order</span>
          </Link>
          <span className="text-white/30">|</span>
          <a
            href="tel:01915210799"
            className="hover:text-[#9ED114] transition-colors flex items-center gap-1 font-bold text-white"
          >
            <Phone className="w-3.5 h-3.5 text-[#9ED114]" />
            <span>Hotline: 01915210799</span>
          </a>
        </div>
      </div>
    </div>
  );
}
