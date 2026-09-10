'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface SubCategoryFilterProps {
  categorySlug: string;
  categoryName: string;
  subCategories: Array<{ id: string; name: string; slug: string }>;
  currentSub?: string;
}

export default function SubCategoryFilter({
  categorySlug,
  categoryName,
  subCategories,
  currentSub,
}: SubCategoryFilterProps) {
  const router = useRouter();

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val) {
      router.push(`/category/${categorySlug}?sub=${val}`);
    } else {
      router.push(`/category/${categorySlug}`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-[#EDE5E1] shadow-xs">
      {/* Pills for fast clicking */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide flex-1">
        <Link
          href={`/category/${categorySlug}`}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all border ${
            !currentSub
              ? 'bg-[#6CAE14] text-white border-[#6CAE14] shadow-xs'
              : 'bg-[#FAFCF7] border-[#EDE5E1] text-[#0E140E] hover:border-[#6CAE14]'
          }`}
        >
          All {categoryName}
        </Link>
        {subCategories.map((s) => {
          const isSelected = currentSub === s.slug;
          return (
            <Link
              key={s.id}
              href={`/category/${categorySlug}?sub=${s.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                isSelected
                  ? 'bg-[#6CAE14] text-white border-[#6CAE14] shadow-xs'
                  : 'bg-[#FAFCF7] border-[#EDE5E1] text-[#0E140E] hover:border-[#6CAE14]'
              }`}
            >
              {s.name}
            </Link>
          );
        })}
      </div>

      {/* Direct Dropdown Filter Box */}
      <div className="shrink-0 flex items-center gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-[#EDE5E1]">
        <span className="text-xs font-semibold text-[#6B5B58] whitespace-nowrap">
          Subcategory:
        </span>
        <div className="relative">
          <select
            value={currentSub || ''}
            onChange={handleSelectChange}
            className="bg-[#FAFCF7] border border-[#EDE5E1] rounded-xl px-3.5 py-1.5 text-xs text-[#0E140E] font-medium focus:outline-none focus:border-[#6CAE14] cursor-pointer shadow-xs"
          >
            <option value="">All {categoryName}</option>
            {subCategories.map((s) => (
              <option key={s.id} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
