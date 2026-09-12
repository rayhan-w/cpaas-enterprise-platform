'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Flame, Layers, Menu, Grid, Sparkles, Umbrella } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';

export default function CategoryNavbar() {
  const pathname = usePathname();
  const [allCategoriesOpen, setAllCategoriesOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const allCategoriesRef = useRef<HTMLDivElement>(null);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setAllCategoriesOpen(false);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-category-navbar]') && !target.closest('[data-category-dropdown]')) {
        setActiveDropdown(null);
        setAllCategoriesOpen(false);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  const openDropdown = (catId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const el = buttonRefs.current[catId];
    if (el) {
      const rect = el.getBoundingClientRect();
      const dropdownWidth = 240;
      const left = Math.max(12, Math.min(rect.left, window.innerWidth - dropdownWidth - 16));
      setDropdownCoords({ top: rect.bottom + 1, left });
    }
    setActiveDropdown(catId);
  };

  const closeDropdown = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  const cancelClose = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const activeCategory = INITIAL_CATEGORIES.find((c) => c.id === activeDropdown);

  return (
    <nav
      data-category-navbar
      className="w-full bg-[#0E140E] border-t border-b border-white/10 select-none relative z-30 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        {/* Left: Ghorer Bazar Signature "সকল ক্যাটাগরি" Dropdown Button */}
        <div className="relative shrink-0" ref={allCategoriesRef}>
          <button
            type="button"
            onClick={() => setAllCategoriesOpen(!allCategoriesOpen)}
            className="flex items-center gap-2 bg-[#6CAE14] hover:bg-[#5B960E] text-white px-3.5 py-2.5 sm:py-3 text-xs font-bold transition-colors rounded-none tracking-wide"
          >
            <Menu className="w-4 h-4" />
            <span className="hidden sm:inline">সকল ক্যাটাগরি</span>
            <span className="sm:hidden">ক্যাটাগরি</span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                allCategoriesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* All Categories Dropdown Menu */}
          {allCategoriesOpen && (
            <div
              data-category-dropdown
              className="absolute left-0 top-full mt-0 w-64 bg-white border border-[#DFECCE] shadow-2xl rounded-b-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="px-3 py-1.5 text-[11px] font-bold text-[#526052] uppercase tracking-wider border-b border-[#DFECCE]/60">
                ক্যাটাগরি সমূহ
              </div>
              <div className="divide-y divide-[#F2EDEA] max-h-[380px] overflow-y-auto">
                {INITIAL_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setAllCategoriesOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs text-[#0E140E] hover:text-[#6CAE14] hover:bg-[#F1F8E8] transition-colors"
                  >
                    <span className="font-semibold">{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#879787]" />
                  </Link>
                ))}
                <Link
                  href="/category/weather-items"
                  onClick={() => setAllCategoriesOpen(false)}
                  className="flex items-center justify-between px-3.5 py-2.5 text-xs font-bold text-[#6CAE14] hover:bg-[#F1F8E8] transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Umbrella className="w-3.5 h-3.5" />
                    রোদ-বৃষ্টির সুরক্ষা
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#6CAE14]" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Center/Right: Horizontal Category Links */}
        <div className="flex items-center overflow-x-auto scrollbar-hide py-1 sm:py-0 flex-1 ml-2">
          <Link
            href="/"
            className="px-3 py-2.5 sm:py-3 text-xs font-semibold text-white/90 hover:text-[#9ED114] hover:bg-white/5 transition-all shrink-0 rounded-md"
          >
            হোম
          </Link>

          <Link
            href="/category/all"
            className="px-3 py-2.5 sm:py-3 text-xs font-semibold text-white/90 hover:text-[#9ED114] hover:bg-white/5 transition-all shrink-0 rounded-md"
          >
            সকল পণ্য
          </Link>

          {/* Hot Deals / Offer Zone */}
          <Link
            href="/category/all?offer=1"
            className="flex items-center gap-1 px-3 py-2.5 sm:py-3 text-xs font-bold text-[#F59E0B] hover:text-[#FBBF24] hover:bg-white/5 transition-all shrink-0 rounded-md group"
          >
            <Flame className="w-3.5 h-3.5 fill-current text-[#F59E0B] group-hover:scale-110 transition-transform animate-pulse" />
            <span className="tracking-wide">হট ডিলস 🔥</span>
          </Link>

          {/* Customer Defined Categories with Dropdown */}
          {INITIAL_CATEGORIES.slice(0, 6).map((cat) => {
            const hasSub = !!cat.subCategories && cat.subCategories.length > 0;
            const isOpen = activeDropdown === cat.id;
            const isActive = pathname === `/category/${cat.slug}`;

            return (
              <div
                key={cat.id}
                ref={(el) => {
                  buttonRefs.current[cat.id] = el;
                }}
                className="relative shrink-0"
                onMouseEnter={() => hasSub && openDropdown(cat.id)}
                onMouseLeave={closeDropdown}
              >
                <div className="flex items-center">
                  <Link
                    href={`/category/${cat.slug}`}
                    className={`flex items-center gap-1 pl-3 pr-1 py-2.5 sm:py-3 text-xs font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'text-[#9ED114] font-bold bg-white/10'
                        : isOpen
                        ? 'text-[#9ED114] bg-white/5'
                        : 'text-white/90 hover:text-[#9ED114] hover:bg-white/5'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </Link>

                  {hasSub && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isOpen) {
                          setActiveDropdown(null);
                        } else {
                          openDropdown(cat.id);
                        }
                      }}
                      className={`pr-2.5 pl-0.5 py-2.5 sm:py-3 text-white/50 hover:text-[#9ED114] transition-colors ${
                        isOpen ? 'text-[#9ED114]' : ''
                      }`}
                      aria-label={`Open ${cat.name} subcategories`}
                    >
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#9ED114]' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Weather Season Items */}
          <Link
            href="/category/weather-items"
            className="flex items-center gap-1 px-3 py-2.5 sm:py-3 text-xs font-semibold text-[#9ED114] hover:bg-white/5 transition-all shrink-0 rounded-md"
          >
            <Umbrella className="w-3.5 h-3.5" />
            <span>বৃষ্টির কালেকশন</span>
          </Link>
        </div>
      </div>

      {/* Floating Dropdown Box for Subcategories */}
      {activeDropdown && activeCategory && activeCategory.subCategories && dropdownCoords && (
        <div
          data-category-dropdown
          style={{
            position: 'fixed',
            top: dropdownCoords.top + 2,
            left: dropdownCoords.left,
          }}
          className="z-[9999] min-w-[240px] max-w-[300px] bg-white border border-[#DFECCE] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={cancelClose}
          onMouseLeave={closeDropdown}
        >
          <Link
            href={`/category/${activeCategory.slug}`}
            onClick={() => setActiveDropdown(null)}
            className="flex items-center justify-between px-4 py-3 text-xs font-bold text-[#0E140E] bg-[#F1F8E8] hover:bg-[#E5F3D4] transition-colors border-b border-[#DFECCE] group"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#6CAE14]" />
              সকল {activeCategory.name}
            </span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#6CAE14]" />
          </Link>

          <div className="py-1.5 divide-y divide-[#F2EDEA] max-h-[360px] overflow-y-auto">
            {activeCategory.subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${activeCategory.slug}?sub=${sub.slug}`}
                onClick={() => setActiveDropdown(null)}
                className="flex items-center justify-between px-4 py-2.5 text-xs text-[#526052] hover:text-[#0E140E] hover:bg-[#FAFCF7] transition-colors font-medium"
              >
                <span>{sub.name}</span>
                <ChevronRight className="w-3 h-3 text-[#879787]" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
