import React from 'react';
import Link from 'next/link';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function CategoryPills() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] block">
            Explore Marketplace
          </span>
          <h2 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Shop By Department
          </h2>
        </div>
        <Link
          href="/category/all"
          className="text-xs font-semibold text-[#1A1512] hover:text-[#6CAE14] flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
        {INITIAL_CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="ag-float group bg-white rounded-2xl p-3 border border-[#EDE5E1] text-center flex flex-col items-center justify-between hover:border-[#6CAE14]/40 transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 bg-[#F8F7F5] border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop'}
                alt={cat.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-xs font-semibold text-[#1A1512] group-hover:text-[#6CAE14] transition-colors line-clamp-1">
              {cat.name}
            </h3>
            <span className="text-[10px] text-[#9B8A86] mt-0.5">
              {cat.subCategories?.length || 4}+ Subs
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
