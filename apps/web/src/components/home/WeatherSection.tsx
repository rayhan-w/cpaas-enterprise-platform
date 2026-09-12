'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CloudRain, 
  Sun, 
  Wind, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Umbrella, 
  Droplets,
  ChevronRight,
  Flame
} from 'lucide-react';
import { ProductItem } from '@/lib/types';
import ProductCard from '../product/ProductCard';

interface WeatherSectionProps {
  products: ProductItem[];
}

export default function WeatherSection({ products }: WeatherSectionProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'rain' | 'sun'>('all');

  // Filter weather items
  const weatherProducts = products.filter(
    (p) => p.categorySlug === 'weather-items' || p.name.toLowerCase().includes('umbrella') || p.name.toLowerCase().includes('raincoat')
  );

  const filteredProducts = weatherProducts.filter((p) => {
    if (activeTab === 'rain') {
      return p.name.toLowerCase().includes('rain') || p.name.toLowerCase().includes('transparent') || p.name.toLowerCase().includes('waterproof');
    }
    if (activeTab === 'sun') {
      return p.name.toLowerCase().includes('capsule') || p.name.toLowerCase().includes('fruit') || p.description.toLowerCase().includes('uv');
    }
    return true;
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 relative overflow-hidden">
      {/* Container with seasonal weather gradient and animated border */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#061811] via-[#0E281C] to-[#123625] border border-[#6CAE14]/30 shadow-2xl text-white overflow-hidden">
        
        {/* Animated Background Ambience (Raindrops & Sun glow) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
          <div className="absolute top-4 left-12 w-0.5 h-8 bg-sky-300 rounded-full animate-raindrop" style={{ animationDelay: '0s' }} />
          <div className="absolute top-8 left-1/4 w-0.5 h-10 bg-sky-300 rounded-full animate-raindrop" style={{ animationDelay: '0.4s' }} />
          <div className="absolute top-2 left-1/2 w-0.5 h-7 bg-sky-300 rounded-full animate-raindrop" style={{ animationDelay: '0.9s' }} />
          <div className="absolute top-6 left-3/4 w-0.5 h-12 bg-sky-300 rounded-full animate-raindrop" style={{ animationDelay: '0.2s' }} />
          <div className="absolute top-10 right-12 w-0.5 h-9 bg-sky-300 rounded-full animate-raindrop" style={{ animationDelay: '0.7s' }} />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#9ED114]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#00D1B2]/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Section Header */}
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/15 mb-8">
          <div className="space-y-3 max-w-2xl">
            {/* Live Bangladesh Weather Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-[#9ED114] font-medium animate-bounce-subtle">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9ED114] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#9ED114]"></span>
              </span>
              <CloudRain className="w-3.5 h-3.5 text-sky-300 animate-float-slow" />
              <span>Dhaka & BD Weather Hub</span>
              <span className="text-white/40">|</span>
              <span className="text-white/90">Monsoon Rain & Summer UV Shield</span>
            </div>

            <h2 className="section-title text-3xl sm:text-4xl text-white tracking-tight">
              Weather & Umbrella Collection
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
              Be prepared for heavy monsoon rains or bright summer heat with Jawata Mart&apos;s windproof umbrellas, compact pocket capsule umbrellas, and durable rainwear.
            </p>
          </div>

          {/* Interactive Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#6CAE14] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Weather ({weatherProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('rain')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'rain'
                  ? 'bg-[#6CAE14] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-sky-300" />
              <span>Rain & Monsoon</span>
            </button>

            <button
              onClick={() => setActiveTab('sun')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'sun'
                  ? 'bg-[#6CAE14] text-white shadow-md'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-300 animate-rotate-slow" />
              <span>UV Sun Protection</span>
            </button>
          </div>
        </div>

        {/* Feature Badges Row */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-sky-400/20 flex items-center justify-center text-sky-300 shrink-0">
              <CloudRain className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">100% Waterproof</p>
              <p className="text-[9px] text-white/60">Heavy Rain Protection</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-300 shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">UPF 50+ UV Block</p>
              <p className="text-[9px] text-white/60">Sunburn & Heat Shield</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-400/20 flex items-center justify-center text-emerald-300 shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">Windproof Ribs</p>
              <p className="text-[9px] text-white/60">Strong Fiberglass Frame</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 p-3 rounded-2xl backdrop-blur-xs">
            <div className="w-8 h-8 rounded-xl bg-purple-400/20 flex items-center justify-center text-purple-300 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-white">Compact & Durable</p>
              <p className="text-[9px] text-white/60">Easy to Carry in Bags</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div key={product.id} className="transition-all duration-300 hover:scale-[1.02]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Section Footer: View All Link */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <Umbrella className="w-4 h-4 text-[#9ED114] animate-float-slow" />
            <span>All umbrellas & rainwear imported with authentic warranty from Jawata Mart.</span>
          </div>

          <Link
            href="/category/weather-items"
            className="inline-flex items-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all shadow-lg hover:shadow-[#6CAE14]/30 active:scale-95 group"
          >
            <span>View All Weather Items ({weatherProducts.length})</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
