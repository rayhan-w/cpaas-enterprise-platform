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
  Sparkles,
  Award,
  Coins,
  Workflow,
  FileSpreadsheet,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  ShopifyIcon,
  WooCommerceIcon,
  GoogleSheetsIcon,
  OpenAIIcon,
} from '@/components/common/BrandIcons';

export function SolvearTurainNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans">
      {/* Top Utility Bar (Turain Design Language) */}
      <div className="bg-slate-900 text-slate-200 text-xs sm:text-sm py-2.5 border-b border-slate-800 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <a
              href="tel:+919876543210"
              className="flex items-center space-x-2 hover:text-white transition font-bold"
            >
              <Phone className="w-4 h-4 text-blue-400" />
              <span>+91 98765 43210 (India Sales)</span>
            </a>
            <a
              href="mailto:support@solvear.in"
              className="flex items-center space-x-2 hover:text-white transition font-medium"
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>support@solvear.in</span>
            </a>
            <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Official Meta Cloud API • TRAI DLT Ready</span>
            </div>
          </div>

          <div className="flex items-center space-x-5 font-bold text-slate-200 text-xs sm:text-sm">
            <Link href="#faq" className="hover:text-white transition flex items-center space-x-1.5">
              <Headphones className="w-4 h-4 text-slate-400" />
              <span>Help Desk</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="#developer" className="hover:text-white transition flex items-center space-x-1.5">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Developer API</span>
            </Link>
            <span className="text-slate-700">|</span>
            <Link href="/login" className="hover:text-white transition flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Sign In</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`bg-white/95 backdrop-blur-xl transition-all duration-300 ${
          isScrolled
            ? 'shadow-lg shadow-slate-900/5 py-3 border-b border-slate-200'
            : 'py-4 border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo: Solvear.in */}
            <Link href="/" className="flex items-center space-x-3.5 group shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-purple-700 p-0.5 shadow-md shadow-blue-700/20 group-hover:scale-105 transition duration-200">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Radio className="w-7 h-7 text-blue-700" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-sans">
                    Solvear<span className="text-blue-600">.in</span>
                  </span>
                  <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-extrabold">
                    API &amp; AI
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold tracking-wide hidden sm:block">
                  WhatsApp Marketing, AI Chatbot &amp; CPaaS Platform
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {/* Channels Mega Menu */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('channels')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-4 py-2 text-base font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition flex items-center space-x-1.5">
                  <span>Channels</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {activeDropdown === 'channels' && (
                  <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-slate-200 rounded-3xl p-4 shadow-2xl shadow-slate-900/10 space-y-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="#channels"
                      className="flex items-start space-x-3.5 p-3 rounded-2xl hover:bg-emerald-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-emerald-300">
                        <WhatsAppIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700">
                          WhatsApp Cloud API
                        </div>
                        <div className="text-xs text-slate-500 font-medium">Official Meta Gateway, Catalogs &amp; Flows</div>
                      </div>
                    </Link>

                    <Link
                      href="#channels"
                      className="flex items-start space-x-3.5 p-3 rounded-2xl hover:bg-pink-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-pink-300">
                        <InstagramIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 group-hover:text-pink-700">
                          Instagram DM Automation
                        </div>
                        <div className="text-xs text-slate-500 font-medium">Post &amp; Reel comments to DM sales funnel</div>
                      </div>
                    </Link>

                    <Link
                      href="#channels"
                      className="flex items-start space-x-3.5 p-3 rounded-2xl hover:bg-blue-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-blue-300">
                        <FacebookIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 group-hover:text-blue-700">
                          Facebook Messenger Bot
                        </div>
                        <div className="text-xs text-slate-500 font-medium">Page comment auto-reply &amp; CTWA Ads</div>
                      </div>
                    </Link>

                    <Link
                      href="#channels"
                      className="flex items-start space-x-3.5 p-3 rounded-2xl hover:bg-sky-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-sky-300">
                        <TelegramIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 group-hover:text-sky-700">
                          Telegram Bot Engine
                        </div>
                        <div className="text-xs text-slate-500 font-medium">100% Free unlimited broadcasts</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Features & AI Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('features')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="px-4 py-2 text-base font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition flex items-center space-x-1.5">
                  <span>Features &amp; AI</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {activeDropdown === 'features' && (
                  <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-slate-200 rounded-3xl p-4 shadow-2xl shadow-slate-900/10 space-y-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <Link
                      href="#features"
                      className="flex items-start space-x-3.5 p-3 rounded-2xl hover:bg-purple-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-purple-300">
                        <OpenAIIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 group-hover:text-purple-700">
                          AI Bot Reply &amp; Tokens
                        </div>
                        <div className="text-xs text-slate-500 font-medium">OpenAI GPT-4o &amp; Google Gemini Models</div>
                      </div>
                    </Link>

                    <Link
                      href="#features"
                      className="flex items-start space-x-3.5 p-3 rounded-2xl hover:bg-indigo-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-indigo-300">
                        <Workflow className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 group-hover:text-indigo-700">
                          Visual Drag &amp; Drop Builder
                        </div>
                        <div className="text-xs text-slate-500 font-medium">No-code multi-branch conversation canvas</div>
                      </div>
                    </Link>

                    <Link
                      href="#features"
                      className="flex items-start space-x-3.5 p-3 rounded-2xl hover:bg-emerald-50 transition group"
                    >
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs group-hover:border-emerald-300">
                        <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <div className="text-base font-extrabold text-slate-900 group-hover:text-emerald-700">
                          Google Sheets &amp; Webhooks
                        </div>
                        <div className="text-xs text-slate-500 font-medium">2-Way Sheet automation &amp; Webform auto-reply</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="#ecommerce"
                className="px-4 py-2 text-base font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition"
              >
                eCommerce
              </Link>

              <Link
                href="#industries"
                className="px-4 py-2 text-base font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition"
              >
                Solutions
              </Link>

              <Link
                href="#simulator"
                className="px-4 py-2 text-base font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition flex items-center space-x-1.5"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Simulator</span>
              </Link>

              <Link
                href="#pricing"
                className="px-4 py-2 text-base font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition"
              >
                Pricing
              </Link>

              <Link
                href="#reseller"
                className="px-4 py-2 text-base font-bold text-purple-700 hover:text-purple-900 hover:bg-purple-50 rounded-xl transition"
              >
                White-Label
              </Link>
            </nav>

            {/* Right Action CTAs */}
            <div className="hidden lg:flex items-center space-x-3.5">
              <Link
                href="#consultation"
                className="text-base font-extrabold text-blue-700 hover:text-blue-800 px-5 py-2.5 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition shadow-xs"
              >
                Book Demo
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-800 hover:to-indigo-700 text-white text-base font-extrabold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 transition group"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>

            {/* Mobile Hamburger Toggle */}
            <div className="lg:hidden flex items-center space-x-2">
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white text-sm font-bold px-4 py-2.5 rounded-xl shadow-sm"
              >
                Console
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 text-slate-800 hover:text-slate-950 hover:bg-slate-100 rounded-xl"
                aria-label="Toggle mobile menu"
              >
                {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (100% Touch & Responsive) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 pt-4 pb-8 space-y-3.5 shadow-2xl animate-in fade-in max-h-[85vh] overflow-y-auto">
          <Link
            href="#channels"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-extrabold text-slate-900 py-3 border-b border-slate-100 flex items-center space-x-3"
          >
            <WhatsAppIcon className="w-5 h-5" />
            <span>Channels (WhatsApp, IG, FB, TG, Webchat)</span>
          </Link>
          <Link
            href="#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-extrabold text-slate-900 py-3 border-b border-slate-100 flex items-center space-x-3"
          >
            <OpenAIIcon className="w-5 h-5" />
            <span>Features &amp; AI Tokens (OpenAI &amp; Gemini)</span>
          </Link>
          <Link
            href="#ecommerce"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-extrabold text-slate-900 py-3 border-b border-slate-100 flex items-center space-x-3"
          >
            <ShopifyIcon className="w-5 h-5" />
            <span>Shopify &amp; WooCommerce (COD &amp; Cart)</span>
          </Link>
          <Link
            href="#industries"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-extrabold text-slate-900 py-3 border-b border-slate-100"
          >
            Industry Solutions (Retail, Banking, Education, Healthcare)
          </Link>
          <Link
            href="#steps"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-extrabold text-slate-900 py-3 border-b border-slate-100"
          >
            5-Step Onboarding Journey
          </Link>
          <Link
            href="#integrations"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-extrabold text-slate-900 py-3 border-b border-slate-100"
          >
            30+ Integrations &amp; Payment Gateways
          </Link>
          <Link
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-extrabold text-slate-900 py-3 border-b border-slate-100"
          >
            Pricing Plans (900 Days Free Trial / Growth)
          </Link>
          <Link
            href="#reseller"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-extrabold text-purple-700 py-3 border-b border-slate-100"
          >
            White-Label Reseller Solution
          </Link>
          <div className="pt-3 flex flex-col space-y-2.5">
            <Link
              href="/login"
              className="w-full text-center py-3.5 rounded-2xl border border-slate-300 text-base font-bold text-slate-800 bg-slate-50"
            >
              Sign In to Console
            </Link>
            <Link
              href="/dashboard"
              className="w-full text-center py-4 rounded-2xl bg-blue-600 text-base font-extrabold text-white shadow-md"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
