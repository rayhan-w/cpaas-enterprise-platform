'use client';

import React from 'react';
import { ShieldCheck, Truck, Banknote, RefreshCw } from 'lucide-react';

export default function TrustBadgesStrip() {
  const badges = [
    {
      icon: ShieldCheck,
      title: '১০০% খাঁটি ও নিরাপদ',
      desc: 'সেরা কোয়ালিটির প্রাকৃতিক ও প্রিমিয়াম পণ্য',
    },
    {
      icon: Truck,
      title: 'দ্রুততম হোম ডেলিভারি',
      desc: 'ঢাকা ও সারাদেশে দ্রুততম সময়ে ডেলিভারি',
    },
    {
      icon: Banknote,
      title: 'ক্যাশ অন ডেলিভারি',
      desc: 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধের সুবিধা',
    },
    {
      icon: RefreshCw,
      title: 'সহজ রিটার্ন পলিসি',
      desc: 'পছন্দ না হলে বা সমস্যায় সহজ রিটার্ন সুবিধা',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 -mt-4 sm:-mt-6 relative z-10">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-[#DFECCE] shadow-lg shadow-[#DFECCE]/30 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {badges.map((b, i) => {
          const Icon = b.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-[#F1F8E8] transition-colors group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#F1F8E8] group-hover:bg-[#6CAE14] text-[#6CAE14] group-hover:text-white flex items-center justify-center shrink-0 transition-colors shadow-xs">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-[#0E140E] leading-snug">
                  {b.title}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-[#526052] line-clamp-1 mt-0.5">
                  {b.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
