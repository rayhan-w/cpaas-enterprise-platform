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
  Flame,
  Info,
} from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { formatPrice } from '@/lib/formatters';
import { ProductItem } from '@/lib/types';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import CategoryNavbar from './CategoryNavbar';

export default function Header() {
  const router = useRouter();
  const { totalItems, subtotal, openCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>(null);
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
        const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=6`);
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
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-[#DFECCE] shadow-xs">
      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 text-[#0E140E] hover:text-[#6CAE14] transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-black ring-2 ring-[#9ED114]/80 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center shrink-0">
            <img
              src="/jawata-mart-logo.jpg"
              alt="Jawata Mart Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#0E140E] flex items-center leading-tight">
              Jawata Mart
              <span className="w-2 h-2 rounded-full bg-[#9ED114] ml-1 inline-block"></span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#6CAE14] font-bold block">
              Pure & Authentic Products
            </span>
          </div>
        </Link>

        {/* Desktop Search Bar */}
        <div ref={searchRef} className="hidden lg:flex flex-1 max-w-xl relative">
          <form onSubmit={handleSearchSubmit} className="w-full relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchDropdown(true)}
              placeholder="Search for products (e.g., honey, ghee, oil, bags, umbrellas)..."
              className="w-full bg-[#FAFCF7] border border-[#DFECCE] rounded-xl py-2.5 pl-10 pr-24 text-xs sm:text-sm text-[#0E140E] placeholder-[#879787] focus:outline-none focus:border-[#6CAE14] focus:ring-2 focus:ring-[#6CAE14]/10 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-[#879787] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#6CAE14] hover:bg-[#5B960E] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Search</span>
            </button>
          </form>

          {/* Search Dropdown Results */}
          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#DFECCE] shadow-2xl overflow-hidden z-50 animate-slide-in-up">
              {isSearching ? (
                <div className="p-5 text-center text-xs text-[#879787]">
                  Searching products...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-[#F2EDEA]">
                  <div className="p-3 text-xs font-bold text-[#526052] bg-[#FAFCF7]">
                    Matching Products ({searchResults.length})
                  </div>
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.slug}`}
                      onClick={() => setShowSearchDropdown(false)}
                      className="flex items-center gap-3 p-3 hover:bg-[#F1F8E8] transition-colors"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#FAFCF7] overflow-hidden shrink-0 border border-[#DFECCE]">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-[#0E140E] truncate">
                          {prod.name}
                        </p>
                        <p className="text-[11px] text-[#526052]">{prod.categoryName || 'General'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs sm:text-sm font-bold text-[#6CAE14]">
                          {formatPrice(prod.price)}
                        </span>
                        {prod.originalPrice && prod.originalPrice > prod.price && (
                          <span className="text-[10px] text-[#879787] line-through block">
                            {formatPrice(prod.originalPrice)}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                  <Link
                    href={`/category/all?search=${encodeURIComponent(searchQuery)}`}
                    onClick={() => setShowSearchDropdown(false)}
                    className="block p-3 text-center text-xs font-bold text-[#6CAE14] hover:bg-[#F1F8E8] transition-colors"
                  >
                    View all results for &ldquo;{searchQuery}&rdquo; →
                  </Link>
                </div>
              ) : (
                <div className="p-5 text-center text-xs text-[#879787]">
                  No products found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Actions: Hotline, Account, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hotline Call Button */}
          <a
            href="tel:01915210799"
            className="hidden md:flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#DFECCE] hover:border-[#6CAE14] hover:bg-[#F1F8E8] transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-[#F1F8E8] group-hover:bg-[#6CAE14] text-[#6CAE14] group-hover:text-white flex items-center justify-center transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight">
              <span className="text-[10px] text-[#526052] block font-medium">Customer Hotline</span>
              <span className="text-xs font-bold text-[#0E140E]">01915210799</span>
            </div>
          </a>

          {/* Cart Trigger Button with Live Subtotal */}
          <button
            onClick={openCart}
            className="flex items-center gap-2.5 bg-[#0E140E] hover:bg-[#1B241B] text-white px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all shadow-md group active:scale-95"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-[#9ED114] group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#6CAE14] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="text-[10px] text-white/70">Cart ({totalItems})</span>
              <span className="text-xs font-bold text-[#9ED114]">{formatPrice(subtotal)}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#FAFCF7] border border-[#DFECCE] rounded-xl py-2 pl-9 pr-20 text-xs text-[#0E140E] placeholder-[#879787] focus:outline-none focus:border-[#6CAE14]"
          />
          <Search className="w-4 h-4 text-[#879787] absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-[#6CAE14] text-white text-[11px] font-bold px-3 py-1 rounded-lg"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Navbar */}
      <CategoryNavbar />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#FAFCF7] h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-slide-in-right">
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#DFECCE] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-black ring-2 ring-[#9ED114]/80 flex items-center justify-center shrink-0">
                  <img
                    src="/jawata-mart-logo.jpg"
                    alt="Jawata Mart Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-serif text-lg font-bold text-[#0E140E]">Jawata Mart</span>
                  <p className="text-[10px] text-[#6CAE14] font-semibold">Pure & Authentic Products</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-[#526052] hover:text-[#0E140E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Categories List */}
            <div className="p-4 space-y-1 flex-1 overflow-y-auto">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-3 rounded-xl font-bold text-xs text-[#0E140E] hover:bg-[#F1F8E8] hover:text-[#6CAE14]"
              >
                Home
              </Link>
              <Link
                href="/category/all"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-3 rounded-xl font-bold text-xs text-[#0E140E] hover:bg-[#F1F8E8] hover:text-[#6CAE14]"
              >
                All Products
              </Link>
              <Link
                href="/category/all?offer=1"
                onClick={() => setMobileMenuOpen(false)}
                className="block p-3 rounded-xl font-bold text-xs text-[#F59E0B] hover:bg-[#F1F8E8]"
              >
                Hot Deals 🔥
              </Link>

              <div className="pt-2 pb-1 text-[11px] font-bold text-[#879787] uppercase tracking-wider px-3">
                Product Categories
              </div>

              {INITIAL_CATEGORIES.map((cat) => (
                <div key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold text-[#0E140E] hover:bg-[#F1F8E8] hover:text-[#6CAE14]"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-[#879787]">({cat.productCount || cat.itemCount || 10})</span>
                  </Link>
                </div>
              ))}

              <Link
                href="/category/weather-items"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-xs font-bold text-[#6CAE14] bg-[#F1F8E8]"
              >
                <span>Weather Gear ☔</span>
                <span className="text-[10px] text-[#6CAE14]">New</span>
              </Link>

              <div className="pt-4 border-t border-[#DFECCE] space-y-2">
                <Link
                  href="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl text-xs font-bold text-[#0E140E] hover:bg-[#F1F8E8] hover:text-[#6CAE14]"
                >
                  <Info className="w-4 h-4 text-[#6CAE14]" />
                  <span>About Us (আমাদের সম্পর্কে)</span>
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 p-3 rounded-xl text-xs font-bold text-[#0E140E] hover:bg-[#F1F8E8]"
                >
                  <Truck className="w-4 h-4 text-[#6CAE14]" />
                  <span>Track Order</span>
                </Link>
              </div>
            </div>

            {/* Mobile Drawer Footer with Helpline */}
            <div className="p-4 bg-white border-t border-[#DFECCE]">
              <a
                href="tel:01915210799"
                className="flex items-center justify-center gap-2 w-full bg-[#6CAE14] text-white py-3 rounded-xl font-bold text-xs"
              >
                <Phone className="w-4 h-4" />
                <span>Call Hotline: 01915210799</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
