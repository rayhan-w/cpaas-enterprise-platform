'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { ProductItem } from '@/lib/types';
import ProductCard from '../product/ProductCard';

export default function FlashSaleSection({ products }: { products: ProductItem[] }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 35, seconds: 20 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.discount >= 15).slice(0, 4);

  if (dealProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-br from-[#F1F8E8]/60 via-white to-[#FAFCF7] rounded-3xl p-6 sm:p-8 border border-[#6CAE14]/20 shadow-elevation-2">
        {/* Header with Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DFECCE] mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6CAE14] mb-1">
              <Zap className="w-4 h-4 fill-current text-[#F59E0B]" />
              <span>Limited Time Deal</span>
            </div>
            <h2 className="section-title text-2xl sm:text-3xl text-[#0E140E]">
              Flash Deals of the Day
            </h2>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#526052] font-medium hidden md:inline flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6CAE14]" />
              Ends in:
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold">
              <div className="bg-[#0E140E] text-white px-2.5 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.hours).padStart(2, '0')}h
              </div>
              <span className="text-[#0E140E] font-bold">:</span>
              <div className="bg-[#0E140E] text-white px-2.5 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </div>
              <span className="text-[#0E140E] font-bold">:</span>
              <div className="bg-[#6CAE14] text-white px-2.5 py-1.5 rounded-lg shadow-sm">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {dealProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
