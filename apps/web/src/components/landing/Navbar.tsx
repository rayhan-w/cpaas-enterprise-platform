'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Radio,
  ChevronDown,
  Sparkles,
  Shield,
  Code2,
  Layers,
  ArrowRight,
  Menu,
  X,
  Zap,
  ShoppingBag,
  Send,
  MessageSquare,
  Bot,
  Globe,
  FileSpreadsheet,
  Users,
  CreditCard,
  BookOpen,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [channelsOpen, setChannelsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl border-b border-slate-200 py-3.5 shadow-md shadow-slate-900/5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Radio className="w-6 h-6 text-blue-600 group-hover:scale-110 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Solvear<span className="text-blue-600">.in</span>
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-100/80 text-blue-800 border border-blue-200 font-bold">
                  API &amp; AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">
                All-in-One WhatsApp &amp; CPaaS Platform
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1.5 bg-white border border-slate-200 rounded-full px-5 py-2 shadow-sm">
            {/* Channels Dropdown */}
            <div className="relative group">
              <button
                className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-full transition flex items-center space-x-1.5"
                onMouseEnter={() => setChannelsOpen(true)}
                onMouseLeave={() => setChannelsOpen(false)}
              >
                <span>Channels</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {channelsOpen && (
                <div
                  onMouseEnter={() => setChannelsOpen(true)}
                  onMouseLeave={() => setChannelsOpen(false)}
                  className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-3xl p-3 shadow-2xl shadow-slate-900/10 space-y-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <Link
                    href="#channels"
                    className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-emerald-50 transition"
                  >
                    <WhatsAppIcon className="w-7 h-7 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">WhatsApp Cloud API</div>
                      <div className="text-xs text-slate-500">Catalog, Broadcast, Flows</div>
                    </div>
                  </Link>
                  <Link
                    href="#channels"
                    className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-pink-50 transition"
                  >
                    <InstagramIcon className="w-7 h-7 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Instagram DM Bot</div>
                      <div className="text-xs text-slate-500">Comment to DM sales funnel</div>
                    </div>
                  </Link>
                  <Link
                    href="#channels"
                    className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-blue-50 transition"
                  >
                    <FacebookIcon className="w-7 h-7 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Facebook Messenger</div>
                      <div className="text-xs text-slate-500">Page auto-reply &amp; CTWA</div>
                    </div>
                  </Link>
                  <Link
                    href="#channels"
                    className="flex items-center space-x-3 p-2.5 rounded-2xl hover:bg-sky-50 transition"
                  >
                    <TelegramIcon className="w-7 h-7 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-slate-900">Telegram Bot</div>
                      <div className="text-xs text-slate-500">Unlimited free broadcasts</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="#simulator"
              className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-full transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Live Simulator</span>
            </Link>

            <Link
              href="#features"
              className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-full transition"
            >
              Features &amp; AI
            </Link>

            <Link
              href="#ecommerce"
              className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-full transition"
            >
              eCommerce
            </Link>

            <Link
              href="#integrations"
              className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-full transition"
            >
              Integrations
            </Link>

            <Link
              href="#architecture"
              className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-full transition flex items-center space-x-1.5"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Architecture</span>
            </Link>

            <Link
              href="#pricing"
              className="px-3.5 py-1.5 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-full transition"
            >
              Pricing
            </Link>

            <Link
              href="#reseller"
              className="px-3.5 py-1.5 text-sm font-bold text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-full transition"
            >
              White-Label
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-3.5">
            <div className="hidden xl:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs text-emerald-800 font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>HAProxy 42ms</span>
            </div>

            <Link
              href="/login"
              className="text-sm font-bold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-xl hover:bg-slate-100 transition"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition group"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
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
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-5 pt-4 pb-7 space-y-3 shadow-2xl mt-2 animate-in fade-in">
          <Link
            href="#channels"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-slate-900 py-2.5 border-b border-slate-100 flex items-center space-x-2"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>Omnichannel (WhatsApp, IG, FB, TG)</span>
          </Link>
          <Link
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-blue-600 py-2.5 border-b border-slate-100"
          >
            Live In-Browser Chatbot Simulator
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-slate-900 py-2.5 border-b border-slate-100"
          >
            Features &amp; AI Tokens (OpenAI &amp; Gemini)
          </Link>
          <Link
            href="#ecommerce"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-slate-900 py-2.5 border-b border-slate-100"
          >
            Shopify &amp; WooCommerce Automation
          </Link>
          <Link
            href="#integrations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-slate-900 py-2.5 border-b border-slate-100"
          >
            30+ Integrations &amp; 20+ Payment Gateways
          </Link>
          <Link
            href="#architecture"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-indigo-600 py-2.5 border-b border-slate-100"
          >
            Modular Monolith &amp; 4-Layer Security
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-slate-900 py-2.5 border-b border-slate-100"
          >
            Pricing &amp; Pay As You Go
          </Link>
          <Link
            href="#reseller"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-bold text-purple-700 py-2.5 border-b border-slate-100"
          >
            White-Label Reseller Solution
          </Link>
          <div className="pt-3 flex flex-col space-y-2.5">
            <Link
              href="/login"
              className="w-full text-center py-3 rounded-xl border border-slate-300 text-sm font-bold text-slate-800 bg-slate-50"
            >
              Sign In to Console
            </Link>
            <Link
              href="/dashboard"
              className="w-full text-center py-3.5 rounded-xl bg-blue-600 text-sm font-bold text-white shadow-md"
            >
              Start Free Trial (900 Days Trial)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
