'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { BannerItem } from '@/lib/types';
import { INITIAL_BANNERS } from '@/lib/sample-data';

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % banners.length);
  };

  const current = banners[currentIdx] || banners[0];

  return (
    <div className="relative max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="relative h-[380px] sm:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden shadow-elevation-3 border border-[#EDE5E1] bg-[#1A1512]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover object-center opacity-65 scale-100 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1512] via-[#1A1512]/80 to-transparent" />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 h-full flex flex-col justify-center max-w-xl p-6 sm:p-12 text-white">
          {current.badge && (
            <div className="inline-flex items-center gap-1.5 bg-[#F59E0B] text-[#062919] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 w-fit shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.badge}</span>
            </div>
          )}

          <h1 className="section-title text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.15] text-white mb-4 tracking-tight">
            {current.title}
          </h1>

          {current.subtitle && (
            <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed mb-8 max-w-md">
              {current.subtitle}
            </p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href={current.ctaLink}
              className="inline-flex items-center gap-2 bg-[#0D5435] hover:bg-[#093D26] text-white font-bold text-sm px-6 py-3 rounded-full transition-all shadow-lg group active:scale-95 border border-[#107C41]"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F59E0B]" />
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-white/90 bg-white/15 backdrop-blur-xs px-3 py-2 rounded-full border border-white/20">
              <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
              <span>ক্যাশ অন ডেলিভারি ও bKash / Nagad</span>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1A1512] backdrop-blur-sm flex items-center justify-center transition-all shadow-md active:scale-90"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1A1512] backdrop-blur-sm flex items-center justify-center transition-all shadow-md active:scale-90"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIdx ? 'w-8 bg-[#0D5435]' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
