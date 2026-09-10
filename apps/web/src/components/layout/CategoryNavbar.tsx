'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Flame } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';

export default function CategoryNavbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  const handleMouseEnter = (catId: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(catId);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <nav className="w-full bg-[#061811] border-t border-b border-white/10 select-none">
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Horizontal Category Items Container */}
        <div className="flex items-center overflow-x-auto scrollbar-hide py-1 sm:py-0">
          {/* 1. Special Offer Zone (Ghorer Bazar Style Prominent Link) */}
          <Link
            href="/category/all?offer=1"
            className="flex items-center gap-1.5 px-3 py-2.5 sm:py-3 text-xs font-bold text-[#F59E0B] hover:text-[#FBBF24] hover:bg-white/5 transition-all shrink-0 rounded-md group"
          >
            <Flame className="w-3.5 h-3.5 fill-current text-[#F59E0B] group-hover:scale-110 transition-transform animate-pulse" />
            <span className="tracking-wide uppercase text-[11px] sm:text-xs">Offer Zone</span>
          </Link>

          {/* Divider */}
          <div className="h-4 w-px bg-white/15 mx-1 shrink-0" />

          {/* 2. Customer Defined Categories with Dropdown */}
          {INITIAL_CATEGORIES.map((cat) => {
            const hasSub = cat.subCategories && cat.subCategories.length > 0;
            const isOpen = activeDropdown === cat.id;
            const isActive = pathname === `/category/${cat.slug}`;

            return (
              <div
                key={cat.id}
                className="relative shrink-0 group"
                onMouseEnter={() => handleMouseEnter(cat.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Category Header Link */}
                <Link
                  href={`/category/${cat.slug}`}
                  className={`flex items-center gap-1 px-3 py-2.5 sm:py-3 text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'text-[#9ED114] font-bold bg-white/10'
                      : 'text-white/90 hover:text-[#9ED114] hover:bg-white/5'
                  }`}
                >
                  <span>{cat.name}</span>
                  {hasSub && (
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 text-white/50 group-hover:text-[#9ED114] ${
                        isOpen ? 'rotate-180 text-[#9ED114]' : ''
                      }`}
                    />
                  )}
                </Link>

                {/* Dropdown Box for Subcategories */}
                {hasSub && (
                  <div
                    className={`absolute top-full left-0 pt-1 z-50 transition-all duration-200 ${
                      isOpen
                        ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                        : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                    }`}
                  >
                    <div className="min-w-[220px] bg-[#0A1A13] border border-[#6CAE14]/40 rounded-xl shadow-2xl py-1.5 backdrop-blur-md overflow-hidden">
                      {/* View All Header */}
                      <Link
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#9ED114] bg-white/5 hover:bg-white/10 transition-colors border-b border-white/5"
                      >
                        <span>All {cat.name}</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>

                      {/* Subcategory Links */}
                      {cat.subCategories!.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${cat.slug}?sub=${sub.slug}`}
                          className="flex items-center justify-between px-4 py-2 text-xs text-white/80 hover:text-[#9ED114] hover:bg-white/10 transition-all group/sub"
                        >
                          <span>{sub.name}</span>
                          <ChevronRight className="w-3 h-3 text-white/25 group-hover/sub:text-[#9ED114] group-hover/sub:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
