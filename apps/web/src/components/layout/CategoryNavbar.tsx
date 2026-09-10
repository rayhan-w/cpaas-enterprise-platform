'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, ChevronRight, Flame, Layers } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';

export default function CategoryNavbar() {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-category-navbar]') && !target.closest('[data-category-dropdown]')) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('mousedown', handleGlobalClick);
    return () => window.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  // Close dropdown on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeDropdown]);

  const openDropdown = (catId: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    const el = buttonRefs.current[catId];
    if (el) {
      const rect = el.getBoundingClientRect();
      const dropdownWidth = 240;
      // Calculate clamped horizontal position
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
      className="w-full bg-[#061811] border-t border-b border-white/10 select-none relative z-30 shadow-md"
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4">
        {/* Horizontal Category Items Container */}
        <div className="flex items-center overflow-x-auto scrollbar-hide py-1 sm:py-0">
          {/* 1. Special Offer Zone */}
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
                  {/* Category Link */}
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

                  {/* Dropdown Toggle Chevron Button */}
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
        </div>
      </div>

      {/* Floating Dropdown Box for Subcategories (Rendered Fixed to NEVER be clipped by overflow) */}
      {activeDropdown && activeCategory && activeCategory.subCategories && dropdownCoords && (
        <div
          data-category-dropdown
          style={{
            position: 'fixed',
            top: dropdownCoords.top,
            left: dropdownCoords.left,
          }}
          className="z-[9999] min-w-[230px] max-w-[300px] bg-[#0A1A13]/98 border border-[#6CAE14]/40 rounded-xl shadow-2xl backdrop-blur-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          onMouseEnter={cancelClose}
          onMouseLeave={closeDropdown}
        >
          {/* Dropdown Header: All [Category] */}
          <Link
            href={`/category/${activeCategory.slug}`}
            onClick={() => setActiveDropdown(null)}
            className="flex items-center justify-between px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#9ED114] bg-white/5 hover:bg-white/10 transition-colors border-b border-white/10 group"
          >
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#6CAE14]" />
              All {activeCategory.name}
            </span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Subcategories List */}
          <div className="py-1.5 divide-y divide-white/5 max-h-[360px] overflow-y-auto">
            {activeCategory.subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${activeCategory.slug}?sub=${sub.slug}`}
                onClick={() => setActiveDropdown(null)}
                className="flex items-center justify-between px-4 py-2.5 text-xs text-white/85 hover:text-[#9ED114] hover:bg-[#6CAE14]/15 transition-all group/sub"
              >
                <span className="font-normal group-hover/sub:font-medium">{sub.name}</span>
                <ChevronRight className="w-3 h-3 text-white/30 group-hover/sub:text-[#9ED114] group-hover/sub:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
