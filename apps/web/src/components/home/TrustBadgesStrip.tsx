'use client';

import React from 'react';
import { ShieldCheck, Truck, Banknote, RefreshCw } from 'lucide-react';

export default function TrustBadgesStrip() {
  const badges = [
    {
      icon: ShieldCheck,
      title: '100% Pure & Authentic',
      desc: 'Premium quality organic & verified products',
    },
    {
      icon: Truck,
      title: 'Fast Home Delivery',
      desc: 'Dhaka and nationwide express delivery',
    },
    {
      icon: Banknote,
      title: 'Cash on Delivery',
      desc: 'Inspect parcel and pay upon arrival',
    },
    {
      icon: RefreshCw,
      title: 'Easy Return Policy',
      desc: 'Hassle-free 7-day replacement warranty',
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
