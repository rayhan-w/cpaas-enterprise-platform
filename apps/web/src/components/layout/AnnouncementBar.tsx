'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, Truck, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#0E140E] text-white text-xs py-2 px-4 border-b border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs">
        {/* Left: Highlight message */}
        <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 text-white/95 font-medium">
            <Truck className="w-3.5 h-3.5 text-[#9ED114]" />
            <span>সারাদেশে ২,০০০ টাকার অর্ডারে <strong>ফ্রি হোম ডেলিভারি!</strong> 🎉</span>
          </div>
          <span className="hidden md:inline text-white/30">|</span>
          <div className="hidden md:flex items-center gap-1.5 text-white/80">
            <ShieldCheck className="w-3.5 h-3.5 text-[#6CAE14]" />
            <span>১০০% খাঁটি ও গুণগত মান সম্পন্ন পণ্য</span>
          </div>
        </div>

        {/* Right: Hotline & Track Order */}
        <div className="flex items-center gap-3 sm:gap-4 text-white/85">
          <Link
            href="/track-order"
            className="hover:text-[#9ED114] transition-colors flex items-center gap-1 font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-[#9ED114]" />
            <span>অর্ডার ট্র্যাক করুন</span>
          </Link>
          <span className="text-white/30">|</span>
          <a
            href="tel:01915210799"
            className="hover:text-[#9ED114] transition-colors flex items-center gap-1 font-bold text-white"
          >
            <Phone className="w-3.5 h-3.5 text-[#9ED114]" />
            <span>হটলাইন: 01915210799</span>
          </a>
        </div>
      </div>
    </div>
  );
}
