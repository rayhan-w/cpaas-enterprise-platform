'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Phone,
  Truck,
  Heart,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/formatters';
import { ProductItem } from '@/lib/types';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';

export default function Header() {
  const router = useRouter();
  const { totalItems, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
        const data = await res.json();
        setSearchResults(data.products || []);
        setShowSearchDropdown(true);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside search
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchDropdown(false);
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F5]/95 backdrop-blur-md border-b border-[#EDE5E1]">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4 md:gap-8">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-[#1A1512] hover:text-[#C4737E] transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C4737E] to-[#8B3D47] flex items-center justify-center text-white font-serif font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
            J
          </div>
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight text-[#1A1512] flex items-center">
              Jawata Mart
              <span className="w-2 h-2 rounded-full bg-[#C4737E] ml-0.5 inline-block"></span>
            </div>
            <span className="text-[10px] text-[#9B8A86] tracking-wider uppercase font-semibold block -mt-1">
              Bangladesh
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div ref={searchRef} className="hidden lg:flex flex-1 max-w-xl relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
              placeholder="Search across 10,000+ products, brands, baby care, fashion, electronics..."
              className="w-full bg-white border border-[#EDE5E1] rounded-full py-2.5 pl-11 pr-24 text-sm text-[#1A1512] placeholder-[#9B8A86] focus:outline-none focus:border-[#C4737E] focus:ring-2 focus:ring-[#C4737E]/10 transition-all shadow-sm"
            />
            <Search className="w-4 h-4 text-[#9B8A86] absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#C4737E] hover:bg-[#A85862] text-white text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
            >
              Search
            </button>
          </form>

          {/* Search Dropdown Results */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#EDE5E1] shadow-2xl overflow-hidden z-50 animate-slide-in-up">
              {isSearching ? (
                <div className="p-6 text-center text-sm text-[#9B8A86]">
                  Searching catalogue...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-[#F2EDEA]">
                  <div className="p-3 text-xs font-semibold uppercase text-[#9B8A86] tracking-wider bg-[#F8F7F5]">
                    Matching Products ({searchResults.length})
                  </div>
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-3 p-3 hover:bg-[#FCF5F6] transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg bg-[#F8F7F5] overflow-hidden shrink-0 border border-[#EDE5E1]">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1A1512] truncate">
                          {prod.name}
                        </p>
                        <p className="text-xs text-[#9B8A86]">{prod.categoryName || 'General'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-[#C4737E]">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.originalPrice && (
                          <span className="text-xs text-[#9B8A86] line-through block">
                            {formatPrice(prod.originalPrice)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/category/all?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block p-3 text-center text-xs font-semibold text-[#C4737E] hover:bg-[#FCF5F6] transition-colors"
                  >
                    View all results for &ldquo;{searchQuery}&rdquo; →
                  </Link>
                </div>
              ) : (
                <div className="p-6 text-center text-sm text-[#9B8A86]">
                  No products found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Hotline, Track, Cart */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/track-order"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-[#1A1512] hover:bg-white hover:text-[#C4737E] transition-all border border-transparent hover:border-[#EDE5E1]"
          >
            <Truck className="w-4 h-4 text-[#C4737E]" />
            <span>Track Order</span>
          </Link>

          {/* Cart Trigger Button */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 bg-[#1A1512] hover:bg-[#2B2424] text-white px-4 py-2.5 rounded-full text-xs font-semibold transition-all shadow-md group active:scale-95"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#C4737E] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-[#C4737E] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
              {totalItems}
            </span>
          </button>
        </div>
      </div>

      {/* Categories Sub-Navbar (Desktop) */}
      <div className="hidden lg:block border-t border-[#EDE5E1]/60 bg-white/70">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs font-medium text-[#1A1512]">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 scrollbar-hide">
            <Link
              href="/category/all"
              className="font-bold text-[#C4737E] flex items-center gap-1 hover:text-[#A85862] shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>All Products</span>
            </Link>

            {INITIAL_CATEGORIES.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-[#6B5B58] hover:text-[#C4737E] transition-colors shrink-0 py-1"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0 pl-4 text-xs font-semibold text-[#7A9C78]">
            <span className="w-2 h-2 rounded-full bg-[#7A9C78] animate-pulse"></span>
            <span>Same-Day Dhaka Delivery</span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#F8F7F5] h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#EDE5E1] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C4737E] flex items-center justify-center text-white font-serif font-bold">
                  J
                </div>
                <span className="font-serif text-xl font-bold text-[#1A1512]">Jawata Mart</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#6B5B58] hover:text-[#1A1512]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 bg-white border-b border-[#EDE5E1]">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-full py-2 pl-9 pr-4 text-xs text-[#1A1512] focus:outline-none focus:border-[#C4737E]"
                />
                <Search className="w-4 h-4 text-[#9B8A86] absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Category Links */}
            <div className="p-4 space-y-1 flex-1">
              <p className="text-[11px] font-bold uppercase text-[#9B8A86] tracking-wider mb-2 px-2">
                Shop By Category
              </p>
              <Link
                href="/category/all"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#C4737E] bg-[#FCF5F6]"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  All Products
                </span>
              </Link>
              {INITIAL_CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-[#1A1512] hover:bg-white hover:text-[#C4737E] transition-colors"
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-[#9B8A86]">→</span>
                </Link>
              ))}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-[#EDE5E1] bg-white space-y-3">
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#EDE5E1] rounded-xl text-xs font-semibold text-[#1A1512] hover:bg-[#F8F7F5]"
              >
                <Truck className="w-4 h-4 text-[#C4737E]" />
                <span>Track My Order</span>
              </Link>
              <a
                href="tel:01700000000"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1A1512] text-white rounded-xl text-xs font-semibold"
              >
                <Phone className="w-4 h-4 text-[#F0B840]" />
                <span>Call Hotline (01700-000000)</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
