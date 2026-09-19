import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, ShieldCheck, Truck, RefreshCw, Heart } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/lib/sample-data';
import { BkashLogo, NagadLogo, CardLogosGroup, CodBadge } from '@/components/common/PaymentLogos';

export default function Footer() {
  return (
    <footer className="bg-[#1A1512] text-white pt-16 pb-24 lg:pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Trust Features Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-white/10 text-left">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#F0B840]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Fast Nationwide Delivery</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Dhaka same-day & 1-3 days all 64 districts in Bangladesh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#7A9C78]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">100% Authentic Products</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Directly sourced from verified manufacturers & authorized distributors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#6CAE14]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Hassle-Free Returns</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Easy 7-day return policy on eligible damaged or unsealed goods.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#F4821F]">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Dedicated Support</h4>
              <p className="text-xs text-white/60 mt-1 leading-relaxed">
                Live customer support available daily from 9:00 AM to 11:00 PM.
              </p>
            </div>
          </div>
        </div>

        {/* Multi-column Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden bg-black ring-2 ring-[#9ED114]/80 shadow-md flex items-center justify-center shrink-0">
                <img
                  src="/jawata-mart-logo.jpg"
                  alt="Jawata Mart Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Jawata Mart
              </span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              Jawata Mart is your trusted Bangladeshi multi-category lifestyle & family shopping platform.
              From mother and baby care to men’s & women’s fashion, electronics, health & beauty, and
              home living—delivered with trust right to your doorstep.
            </p>
            <div className="space-y-2 pt-2 text-xs text-white/80">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#6CAE14] shrink-0" />
                <span>Uttara Sector-12, Dhaka, Bangladesh</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F0B840] shrink-0" />
                <a href="tel:01915210799" className="hover:text-white transition-colors">01915210799</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7A9C78] shrink-0" />
                <a href="mailto:jawatamart3@gmail.com" className="hover:text-white transition-colors">jawatamart3@gmail.com</a>
              </p>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              {INITIAL_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] mb-4">
              Company &amp; Care
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/about" className="hover:text-[#9ED114] text-white font-medium transition-colors flex items-center gap-1.5">
                  <span>About Us (আমাদের সম্পর্কে)</span>
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-white transition-colors">
                  Guest Checkout
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <span className="text-white/40 cursor-not-allowed">Shipping & Delivery Rates</span>
              </li>
              <li>
                <span className="text-white/40 cursor-not-allowed">Return & Refund Policy</span>
              </li>
              <li>
                <span className="text-white/40 cursor-not-allowed">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Payment & Security */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6CAE14] mb-4">
              Payment Methods
            </h4>
            <p className="text-xs text-white/60 mb-3">
              We accept safe and reliable local payments:
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-white px-2.5 py-1.5 rounded-lg flex items-center shadow-xs">
                <BkashLogo className="h-4.5 w-auto" />
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-lg flex items-center shadow-xs">
                <NagadLogo className="h-4.5 w-auto" />
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-lg flex items-center shadow-xs">
                <CardLogosGroup />
              </div>
              <div className="bg-white px-2.5 py-1.5 rounded-lg flex items-center shadow-xs">
                <CodBadge />
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10">
              <Link
                href="/admin/login"
                className="text-[11px] text-white/40 hover:text-[#6CAE14] transition-colors"
              >
                Staff Admin Portal →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© 2026 Jawata Mart (Proprietor: Md. Abdur Rahim). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="https://www.jawatamart.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              www.jawatamart.com
            </a>
            <span>Uttara Sector-12, Dhaka</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
