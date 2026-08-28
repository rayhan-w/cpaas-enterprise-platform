'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  Headphones,
  Code2,
  Lock,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Radio,
  CheckCircle2,
  ShieldCheck,
  Zap,
  MessageSquare,
  Globe,
  Layers,
  Smartphone,
  PhoneCall,
  Bot,
  Building2,
  ShoppingBag,
  GraduationCap,
  HeartPulse,
  Truck,
  Landmark,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';

export function TurainNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility Bar (Turain Style) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a
              href="tel:+919876543210"
              className="flex items-center space-x-1.5 hover:text-white transition font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>+91 98765 43210 (India Sales)</span>
            </a>
            <a
              href="mailto:sales@turaingrp.com"
              className="flex items-center space-x-1.5 hover:text-white transition font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>sales@turaingrp.com</span>
            </a>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>TRAI DLT Ready • 99.98% Delivery SLA</span>
            </div>
          </div>

          <div className="flex items-center space-x-5 font-semibold text-slate-300">
            <Link href="#faq" className="hover:text-white transition flex items-center space-x-1">
              <Headphones className="w-3.5 h-3.5" />
              <span>Help Desk</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="#developer" className="hover:text-white transition flex items-center space-x-1">
              <Code2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Developer API</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/login" className="hover:text-white transition flex items-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Portal Login</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`bg-white transition-all duration-300 ${
          isScrolled
            ? 'shadow-md shadow-slate-900/5 py-3 border-b border-slate-200'
            : 'py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-700 p-0.5 shadow-md shadow-blue-700/20 group-hover:scale-105 transition duration-200">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Radio className="w-6 h-6 text-blue-700" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
                    Turain<span className="text-blue-600">Group</span>
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                    CPaaS India
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Customer Engagement &amp; Messaging Platform
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Products Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('products')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition flex items-center space-x-1">
                  <span>Products</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {activeDropdown === 'products' && (
                  <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-slate-200 rounded-3xl p-4 shadow-2xl shadow-slate-900/10 space-y-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="#products"
                      className="flex items-start space-x-3 p-3 rounded-2xl hover:bg-emerald-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-emerald-300">
                        <WhatsAppIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                          WhatsApp Business API
                        </div>
                        <div className="text-xs text-slate-500">Official Meta Gateway, Catalogs &amp; Flows</div>
                      </div>
                    </Link>

                    <Link
                      href="#products"
                      className="flex items-start space-x-3 p-3 rounded-2xl hover:bg-blue-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-blue-300">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                          Bulk SMS &amp; OTP Service
                        </div>
                        <div className="text-xs text-slate-500">DLT-approved transactional &amp; promo routes</div>
                      </div>
                    </Link>

                    <Link
                      href="#products"
                      className="flex items-start space-x-3 p-3 rounded-2xl hover:bg-indigo-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-indigo-300">
                        <MessageSquare className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-indigo-700">
                          RCS Business Messaging
                        </div>
                        <div className="text-xs text-slate-500">Next-gen verified cards &amp; rich interactive media</div>
                      </div>
                    </Link>

                    <Link
                      href="#products"
                      className="flex items-start space-x-3 p-3 rounded-2xl hover:bg-purple-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-purple-300">
                        <PhoneCall className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                          Voice Call &amp; Cloud IVR
                        </div>
                        <div className="text-xs text-slate-500">Automated outbound dialer &amp; smart call trees</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Solutions Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition flex items-center space-x-1">
                  <span>Solutions</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {activeDropdown === 'solutions' && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-slate-200 rounded-3xl p-4 shadow-2xl shadow-slate-900/10 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="#industries"
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-800 hover:text-blue-600"
                    >
                      <ShoppingBag className="w-4 h-4 text-emerald-600" />
                      <span>Retail &amp; E-commerce</span>
                    </Link>
                    <Link
                      href="#industries"
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-800 hover:text-blue-600"
                    >
                      <Landmark className="w-4 h-4 text-blue-600" />
                      <span>Banking &amp; Financial Services</span>
                    </Link>
                    <Link
                      href="#industries"
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-800 hover:text-blue-600"
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      <span>Education &amp; Admissions</span>
                    </Link>
                    <Link
                      href="#industries"
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-800 hover:text-blue-600"
                    >
                      <HeartPulse className="w-4 h-4 text-rose-600" />
                      <span>Healthcare &amp; Diagnostics</span>
                    </Link>
                    <Link
                      href="#industries"
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-800 hover:text-blue-600"
                    >
                      <Building2 className="w-4 h-4 text-amber-600" />
                      <span>Real Estate &amp; Builders</span>
                    </Link>
                    <Link
                      href="#industries"
                      className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-slate-50 text-sm font-bold text-slate-800 hover:text-blue-600"
                    >
                      <Truck className="w-4 h-4 text-cyan-600" />
                      <span>Transport &amp; Logistics</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="#steps"
                className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition"
              >
                How It Works
              </Link>

              <Link
                href="#architecture"
                className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition flex items-center space-x-1"
              >
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Architecture</span>
              </Link>

              <Link
                href="#developer"
                className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition"
              >
                APIs &amp; Webhooks
              </Link>

              <Link
                href="#pricing"
                className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition"
              >
                Pricing
              </Link>

              <Link
                href="#reseller"
                className="px-3.5 py-2 text-sm font-bold text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-xl transition"
              >
                White-Label
              </Link>
            </nav>

            {/* Right Action CTAs */}
            <div className="hidden lg:flex items-center space-x-3.5">
              <Link
                href="#consultation"
                className="text-sm font-extrabold text-blue-700 hover:text-blue-800 px-4 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition"
              >
                Book Demo
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-extrabold px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition group"
              >
                <span>Launch Console</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm"
              >
                Console
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 pt-3 pb-6 space-y-3 shadow-2xl animate-in fade-in">
          <Link
            href="#products"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-extrabold text-slate-900 py-2 border-b border-slate-100"
          >
            Products (Bulk SMS, WhatsApp, RCS, Voice IVR)
          </Link>
          <Link
            href="#industries"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-extrabold text-slate-900 py-2 border-b border-slate-100"
          >
            Industry Solutions (Retail, Banking, Education, Real Estate)
          </Link>
          <Link
            href="#steps"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-extrabold text-slate-900 py-2 border-b border-slate-100"
          >
            5-Step Onboarding Journey
          </Link>
          <Link
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-extrabold text-slate-900 py-2 border-b border-slate-100"
          >
            Modular Monolith &amp; 4-Layer Security
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-extrabold text-slate-900 py-2 border-b border-slate-100"
          >
            Pricing &amp; Pay As You Go
          </Link>
          <Link
            href="#consultation"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-extrabold text-blue-700 py-2 border-b border-slate-100"
          >
            Schedule a Consultation
          </Link>
          <div className="pt-2 flex flex-col space-y-2">
            <Link
              href="/login"
              className="w-full text-center py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-slate-50"
            >
              Sign In to Console
            </Link>
            <Link
              href="/dashboard"
              className="w-full text-center py-3 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md"
            >
              Start Free Trial (900 Days)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
