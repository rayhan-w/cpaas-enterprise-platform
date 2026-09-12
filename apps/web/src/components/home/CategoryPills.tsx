'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { Sparkles, ArrowRight, Umbrella } from 'lucide-react';

export default function CategoryPills() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] block">
            আমাদের সেকশন সমূহ
          </span>
          <h2 className="section-title text-2xl sm:text-3xl text-[#0E140E]">
            জনপ্রিয় ক্যাটাগরি সমূহ
          </h2>
        </div>
        <Link
          href="/category/all"
          className="text-xs font-bold text-[#0E140E] hover:text-[#6CAE14] flex items-center gap-1 transition-colors"
        >
          <span>সব দেখুন</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
        {INITIAL_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group bg-white rounded-2xl p-3 border border-[#DFECCE] text-center flex flex-col items-center justify-between hover:border-[#6CAE14] hover:shadow-md transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 bg-[#FAFCF7] border-2 border-white ring-2 ring-[#DFECCE] group-hover:ring-[#6CAE14] shadow-xs group-hover:scale-105 transition-all">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop'}
                alt={cat.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-xs font-bold text-[#0E140E] group-hover:text-[#6CAE14] transition-colors line-clamp-1">
              {cat.name}
            </h3>
            <span className="text-[10px] text-[#526052] mt-0.5 font-medium">
              {cat.productCount || cat.itemCount || 10}+ পণ্য
            </span>
          </Link>
        ))}

        {/* Weather Items Category Card */}
        <Link
          href="/category/weather-items"
          className="group bg-white rounded-2xl p-3 border border-[#DFECCE] text-center flex flex-col items-center justify-between hover:border-[#6CAE14] hover:shadow-md transition-all"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 bg-[#F1F8E8] border-2 border-white ring-2 ring-[#DFECCE] group-hover:ring-[#6CAE14] shadow-xs group-hover:scale-105 transition-all flex items-center justify-center">
            <span className="text-3xl">☔</span>
          </div>
          <h3 className="text-xs font-bold text-[#6CAE14] group-hover:text-[#5B960E] transition-colors line-clamp-1">
            রোদ-বৃষ্টির সুরক্ষা
          </h3>
          <span className="text-[10px] text-[#6CAE14] mt-0.5 font-bold">
            ছাতা ও রেইনকোট
          </span>
        </Link>
      </div>
    </section>
  );
}
