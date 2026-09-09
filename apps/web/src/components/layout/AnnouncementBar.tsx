import React from 'react';
import Link from 'next/link';
import { Phone, Truck, ShieldCheck, MapPin } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#1A1512] text-white/90 text-xs py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Highlight message */}
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 text-white/90 font-medium">
            <Truck className="w-3.5 h-3.5 text-[#F0B840]" />
            <span>Free delivery across Bangladesh on orders over ৳2,000</span>
          </div>
          <span className="hidden md:inline text-white/30">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-white/70">
            <ShieldCheck className="w-3.5 h-3.5 text-[#7A9C78]" />
            <span>100% Genuine & Authentic Products</span>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-4 text-white/75">
          <Link
            href="/track-order"
            className="hover:text-[#C4737E] transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C4737E]" />
            <span>Track Order</span>
          </Link>
          <span className="text-white/30">|</span>
          <a
            href="tel:01915210799"
            className="hover:text-[#F0B840] transition-colors flex items-center gap-1"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>01915210799</span>
          </a>
          <span className="text-white/30">|</span>
          <span className="font-semibold text-white/90 bg-white/10 px-1.5 py-0.5 rounded text-[11px]">
            BDT (৳)
          </span>
        </div>
      </div>
    </div>
  );
}
