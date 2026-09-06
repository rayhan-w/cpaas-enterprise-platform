'use client';

import React, { useState } from 'react';
import { Layers, Plus, ExternalLink } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories] = useState(INITIAL_CATEGORIES);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl text-[#1A1512]">
            Category & Department Management
          </h1>
          <p className="text-xs text-[#6B5B58] mt-1">
            Organize multi-category marketplace departments and their subcategories.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-6 border border-[#EDE5E1] shadow-elevation-1 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop'}
                  alt={cat.name}
                  className="w-12 h-12 rounded-xl object-cover bg-[#F8F7F5] border border-[#EDE5E1]"
                />
                <div>
                  <h3 className="text-sm font-bold text-[#1A1512]">{cat.name}</h3>
                  <span className="font-mono text-[10px] text-[#9B8A86]">/{cat.slug}</span>
                </div>
              </div>

              <p className="text-xs text-[#6B5B58] leading-relaxed mb-3">{cat.description}</p>

              {cat.subCategories && cat.subCategories.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-[#F2EDEA]">
                  <p className="text-[10px] font-bold uppercase text-[#9B8A86] tracking-wider">
                    Subcategories ({cat.subCategories.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.subCategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="bg-[#F8F7F5] text-[#1A1512] text-[10px] font-semibold px-2 py-0.5 rounded-md border border-[#EDE5E1]"
                      >
                        {sub.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#F2EDEA] flex items-center justify-between text-xs">
              <span className="text-[#7A9C78] font-semibold text-[11px]">Active Department</span>
              <Link
                href={`/category/${cat.slug}`}
                target="_blank"
                className="text-[#C4737E] hover:underline font-semibold flex items-center gap-1 text-[11px]"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
