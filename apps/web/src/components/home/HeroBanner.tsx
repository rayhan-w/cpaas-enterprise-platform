'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { BannerItem } from '@/lib/types';
import { INITIAL_BANNERS } from '@/lib/sample-data';

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerItem[]>(INITIAL_BANNERS);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIdx((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIdx((prev) => (prev + 1) % banners.length);
  };

  const current = banners[currentIdx] || banners[0];
  const isGraphicCover = current.image.includes('cover') || !current.title;

  return (
    <div className="relative max-w-7xl mx-auto px-4 pt-4 pb-2">
      <div className="relative h-[240px] xs:h-[300px] sm:h-[380px] md:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden shadow-elevation-3 border border-[#EDE5E1] bg-gradient-to-r from-[#DDF2FD] via-[#F4FCF3] to-[#E5F5D4] group">
        
        {isGraphicCover ? (
          /* Pure Graphic Cover Banner (Full high-fidelity view) */
          <Link href={current.ctaLink || '/category/all'} className="block relative w-full h-full">
            <img
              src={current.image}
              alt="Jawata Mart Official Cover"
              className="w-full h-full object-cover sm:object-contain object-center group-hover:scale-[1.01] transition-transform duration-700"
            />
            
            {/* Interactive Floating CTA Button on Bottom Right */}
            <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10">
              <span className="inline-flex items-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] text-white font-bold text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all shadow-xl active:scale-95 border-2 border-white group/btn animate-pulse-glow">
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ) : (
          /* Text-overlay style for promotional banners */
          <>
            <div className="absolute inset-0">
              <img
                src={current.image}
                alt={current.title}
                className="w-full h-full object-cover object-center opacity-65 scale-100 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A1512] via-[#1A1512]/80 to-transparent" />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center max-w-xl p-6 sm:p-12 text-white">
              {current.badge && (
                <div className="inline-flex items-center gap-1.5 bg-[#F59E0B] text-[#0B0F0B] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 w-fit shadow-sm">
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
                  className="inline-flex items-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] text-white font-bold text-sm px-6 py-3 rounded-full transition-all shadow-lg group active:scale-95 border border-[#78B81B]"
                >
                  <span>{current.ctaText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#F59E0B]" />
                </Link>

                <div className="hidden sm:flex items-center gap-2 text-xs text-white/90 bg-white/15 backdrop-blur-xs px-3 py-2 rounded-full border border-white/20">
                  <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
                  <span>Cash on Delivery & bKash / Nagad</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Carousel Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/70 hover:bg-white text-[#1A1512] backdrop-blur-sm flex items-center justify-center transition-all shadow-md active:scale-90"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/70 hover:bg-white text-[#1A1512] backdrop-blur-sm flex items-center justify-center transition-all shadow-md active:scale-90"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentIdx ? 'w-8 bg-[#6CAE14] shadow-sm' : 'w-2 bg-black/30 hover:bg-black/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
