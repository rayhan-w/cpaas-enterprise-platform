'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Star } from 'lucide-react';
import { ProductGroup } from '@/lib/types';
import { formatPrice } from '@/lib/formatters';

export default function GroupCard({ group }: { group: ProductGroup }) {
  const displayPrice =
    group.minPrice === group.maxPrice
      ? formatPrice(group.minPrice)
      : `${formatPrice(group.minPrice)} – ${formatPrice(group.maxPrice)}`;

  const hasDiscount = Boolean(
    group.maxRegularPrice && group.maxRegularPrice > group.minPrice
  );

  return (
    <div className="group bg-white rounded-2xl border border-[#DFECCE] hover:border-[#6CAE14] hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col relative h-full">
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between pointer-events-none">
        <span className="bg-[#0D1F61] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 pointer-events-auto">
          <Layers className="w-3 h-3 text-[#FD6B03]" />
          <span>{group.totalStyles || group.productIds?.length || 0} Styles</span>
        </span>
        {group.categoryName && (
          <span className="bg-orange-50 text-[#FD6B03] border border-orange-200 text-[9px] font-semibold px-2 py-0.5 rounded-full pointer-events-auto">
            {group.categoryName}
          </span>
        )}
      </div>

      {/* Image linking to group page */}
      <Link
        href={`/group/${group.slug}`}
        className="block relative aspect-square bg-[#FAFCF7] overflow-hidden p-2"
      >
        <img
          src={group.image || '/jawata-mart-logo.jpg'}
          alt={group.name}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/jawata-mart-logo.jpg';
          }}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <span className="text-white text-xs font-bold flex items-center gap-1">
            View All Styles <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Link>

      {/* Group Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6CAE14]">
              Collection / Group
            </span>
            <span className="text-[10px] text-[#879787] font-semibold">
              {group.totalStyles || group.productIds?.length || 0} Options
            </span>
          </div>

          <Link href={`/group/${group.slug}`}>
            <h3 className="text-xs sm:text-sm font-bold text-[#0E140E] group-hover:text-[#FD6B03] transition-colors line-clamp-2 leading-tight sm:leading-snug">
              {group.name}
            </h3>
          </Link>

          {group.description && (
            <p className="text-[11px] text-[#6B5B58] line-clamp-2 mt-1 leading-relaxed">
              {group.description}
            </p>
          )}
        </div>

        {/* Price & CTA */}
        <div className="mt-3 pt-2.5 border-t border-[#DFECCE]/60 flex flex-col gap-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm xs:text-base sm:text-lg font-bold text-[#0E140E]">
              {displayPrice}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-[#879787] line-through font-medium">
                {group.minRegularPrice === group.maxRegularPrice
                  ? formatPrice(group.maxRegularPrice!)
                  : `${formatPrice(group.minRegularPrice!)} – ${formatPrice(group.maxRegularPrice!)}`}
              </span>
            )}
          </div>

          <Link
            href={`/group/${group.slug}`}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-[#0D1F61] hover:bg-[#162D85] text-white transition-all shadow-xs active:scale-95 text-center"
          >
            <span>View Styles ({group.totalStyles || group.productIds?.length || 0})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FD6B03]" />
          </Link>
        </div>
      </div>
    </div>
  );
}
