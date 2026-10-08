import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ExternalLink } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { BkashLogo, NagadLogo, CardLogosGroup, CodBadge } from '@/components/common/PaymentLogos';

export default function Footer() {
  return (
    <footer className="bg-[#141A14] text-white pt-8 sm:pt-10 pb-20 lg:pb-8 border-t border-white/10 text-xs">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main 4-Column Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-white/10">
          {/* 1. Brand & Contact (Spans 2 cols on mobile) */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white ring-2 ring-[#fd6b03]/40 flex items-center justify-center p-0.5 shrink-0 shadow-xs">
                <img
                  src="/jawata-mart-logo.jpg"
                  alt="Jawata Mart"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white font-serif block leading-tight">
                  Jawata Mart
                </span>
                <span className="text-[10px] text-[#fd6b03] font-semibold block">Pure & Authentic Products</span>
              </div>
            </div>

            <p className="text-white/60 text-[11px] leading-relaxed max-w-xs">
              Your trusted online destination in Bangladesh for authentic organic food, lifestyle & family essentials.
            </p>

            <div className="space-y-1.5 pt-1 text-[11px] text-white/70">
              <a
                href="tel:01915210799"
                className="flex items-center gap-2 text-white hover:text-[#fd6b03] font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#fd6b03] shrink-0" />
                <span>Hotline: 01915210799</span>
              </a>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#fd6b03] shrink-0" />
                <a href="mailto:support@jawatamart.com" className="hover:text-white transition-colors">support@jawatamart.com</a>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#fd6b03] shrink-0" />
                <span>Sector-12, Uttara, Dhaka-1230</span>
              </p>
            </div>
          </div>

          {/* 2. Top Categories */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#fd6b03] mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-[11px] text-white/70">
              {INITIAL_CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/category/weather-items" className="hover:text-white transition-colors">
                  Weather Protection
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Customer Care */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#fd6b03] mb-3">
              Customer Care
            </h4>
            <ul className="space-y-2 text-[11px] text-white/70">
              <li>
                <Link href="/about" className="hover:text-white transition-colors font-medium">
                  About Us (আমাদের সম্পর্কে)
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Fast Checkout
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Payment Methods & Trust */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#fd6b03] mb-3">
              We Accept
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <div className="bg-white px-2 py-1 rounded-md flex items-center shadow-xs">
                <BkashLogo className="h-4 w-auto" />
              </div>
              <div className="bg-white px-2 py-1 rounded-md flex items-center shadow-xs">
                <NagadLogo className="h-4 w-auto" />
              </div>
              <div className="bg-white px-2 py-1 rounded-md flex items-center shadow-xs">
                <CodBadge />
              </div>
              <div className="bg-white px-2 py-1 rounded-md flex items-center shadow-xs">
                <CardLogosGroup />
              </div>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              100% Secure Checkout with Cash on Delivery & Mobile Banking across 64 districts.
            </p>
            <div className="mt-3 pt-2 border-t border-white/10">
              <Link
                href="/admin/login"
                className="text-[10px] text-white/40 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>Staff Admin Portal</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/50">
          <p>© 2026 Jawata Mart. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span>Fast Nationwide Delivery</span>
            <span>•</span>
            <span>Dhaka, Bangladesh</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
