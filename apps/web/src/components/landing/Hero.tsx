'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Send,
  MessageCircle,
  ShoppingBag,
  Bot,
  ChevronRight,
  TrendingUp,
  Award,
  Users,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';

export function Hero() {
  return (
    <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Soft Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[1000px] h-[450px] bg-gradient-to-tr from-blue-200/40 via-indigo-200/30 to-purple-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-12 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-7">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2.5 bg-white border border-slate-300/90 px-4 py-1.5 rounded-full shadow-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
            </span>
            <span className="text-sm font-bold text-slate-800">
              White-label Ready Reseller Solution
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-sm text-blue-700 font-extrabold flex items-center">
              310K+ Used This Platform <ChevronRight className="w-4 h-4 ml-0.5" />
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
            Turn WhatsApp into Your{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              #1 Sales Channel
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto font-normal leading-relaxed">
            Chat, sell &amp; scale with AI across <strong className="text-slate-900 font-bold">WhatsApp, Facebook, Instagram, Telegram &amp; Webchat</strong> — all in one powerful platform. Broadcasts, Commerce, Shared Inbox &amp; AI Tokens — built for businesses, agencies &amp; resellers.
          </p>

          {/* Channel Badges Row */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
              <WhatsAppIcon className="w-4 h-4" />
              <span>WhatsApp</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
              <InstagramIcon className="w-4 h-4" />
              <span>Instagram</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
              <FacebookIcon className="w-4 h-4" />
              <span>Facebook</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
              <TelegramIcon className="w-4 h-4" />
              <span>Telegram</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 transition duration-200 group"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-current" />
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="#simulator"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-bold text-base px-7 py-3.5 rounded-2xl shadow-sm transition duration-200"
            >
              <Bot className="w-5 h-5 text-blue-600" />
              <span>Try Live Simulator</span>
            </Link>

            <Link
              href="#reseller"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-base px-6 py-3.5 rounded-2xl transition duration-200"
            >
              <Award className="w-5 h-5 text-purple-600" />
              <span>Reseller Program</span>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-8 text-sm text-slate-600 font-medium">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Official Meta Cloud API</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>TRAI DLT &amp; GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Modular Monolith + SQS Zero-Loss</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>PostgreSQL &amp; MySQL Ready</span>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5 max-w-5xl mx-auto">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition group">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Broadcasting Open Rate</div>
            <div className="text-4xl font-extrabold text-slate-900 font-mono mt-2 flex items-baseline space-x-1.5">
              <span>80%+</span>
              <span className="text-xs text-emerald-600 font-sans font-bold flex items-center">
                <TrendingUp className="w-4 h-4 mr-0.5" /> High Impact
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">Instant delivery with read receipts</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition group">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Platform Community</div>
            <div className="text-4xl font-extrabold text-slate-900 font-mono mt-2">310K+</div>
            <p className="text-xs text-slate-500 mt-1.5">Used this platform worldwide</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition group">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Payment Methods</div>
            <div className="text-4xl font-extrabold text-blue-600 font-mono mt-2">20+ Gateways</div>
            <p className="text-xs text-slate-500 mt-1.5">Stripe, Razorpay, PhonePe, PayPal</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 transition group">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Architecture Speed</div>
            <div className="text-4xl font-extrabold text-indigo-600 font-mono mt-2 flex items-baseline space-x-1">
              <span>&lt; 42ms</span>
              <span className="text-xs text-slate-500 font-sans font-normal">avg</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">HAProxy + SQS + Dual AI Core</p>
          </div>
        </div>
      </div>
    </section>
  );
}
