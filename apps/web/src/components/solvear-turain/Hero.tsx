'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Award,
  PhoneCall,
  Smartphone,
  MessageSquare,
  Bot,
  Activity,
  Layers,
  ChevronRight,
  Play,
  X,
  Sparkles,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';

export function SolvearTurainHero() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  return (
    <section className="relative pt-44 pb-20 md:pt-52 md:pb-32 overflow-hidden bg-mesh-pattern border-b border-slate-200/80 font-sans">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[850px] sm:w-[1200px] h-[550px] bg-gradient-to-tr from-blue-300/35 via-indigo-300/30 to-purple-300/25 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy (7 cols) */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2.5 bg-white/95 backdrop-blur-md border border-blue-200/90 px-4 py-2 rounded-full shadow-sm">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
              </span>
              <span className="text-xs sm:text-sm font-extrabold text-slate-800">
                White-Label Ready Reseller Platform
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs sm:text-sm text-blue-700 font-extrabold flex items-center">
                310K+ Businesses Trusted <ChevronRight className="w-4 h-4 ml-0.5" />
              </span>
            </div>

            {/* Main Headline (Massive & Punchy) */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Turn WhatsApp into Your{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600">
                #1 Sales &amp; AI Engine
              </span>
            </h1>

            {/* Subtitle (Large & Clear) */}
            <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Chat, sell &amp; scale with AI across <strong className="text-slate-900 font-extrabold">WhatsApp, Instagram, Facebook, Telegram &amp; Webchat</strong> — all in one unified platform. DLT-Compliant broadcasts, commerce catalogs, shared inboxes &amp; AI tokens built for businesses, agencies &amp; resellers.
            </p>

            {/* Real Brand & Channel Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <div className="flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs text-sm font-bold text-slate-800 hover:border-emerald-300 transition">
                <WhatsAppIcon className="w-5 h-5" />
                <span>WhatsApp Cloud API</span>
              </div>
              <div className="flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs text-sm font-bold text-slate-800 hover:border-pink-300 transition">
                <InstagramIcon className="w-5 h-5" />
                <span>Instagram DM</span>
              </div>
              <div className="flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs text-sm font-bold text-slate-800 hover:border-blue-300 transition">
                <FacebookIcon className="w-5 h-5" />
                <span>Facebook Bot</span>
              </div>
              <div className="flex items-center space-x-2.5 px-4 py-2 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xs text-sm font-bold text-slate-800 hover:border-sky-300 transition">
                <TelegramIcon className="w-5 h-5" />
                <span>Telegram Engine</span>
              </div>
            </div>

            {/* CTA Buttons + Video Watch Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-800 hover:to-indigo-700 text-white font-extrabold text-base sm:text-lg px-9 py-4 rounded-2xl shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 transition duration-200 group"
              >
                <Zap className="w-5 h-5 text-amber-300 fill-current" />
                <span>Get Started Free (900 Days)</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>

              {/* Turain-Style Video Walkthrough Trigger */}
              <button
                onClick={() => setVideoModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white/95 hover:bg-white border-2 border-slate-200 text-slate-900 font-extrabold text-base sm:text-lg px-7 py-4 rounded-2xl shadow-sm hover:border-slate-300 transition duration-200 group"
              >
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition shadow-xs">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>Watch Product Tour (2 Min)</span>
              </button>
            </div>

            {/* Compliance Guarantee */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2.5 gap-x-8 text-sm text-slate-700 font-semibold">
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
                <span>20+ Payment Gateways</span>
              </div>
            </div>
          </div>

          {/* Right Column: Turain-Style Interactive Video & Dashboard Showcase (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Soft Ambient Glow under video frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] blur-xl opacity-30 group-hover:opacity-45 transition duration-300" />

              {/* Video Player Card Container */}
              <div className="relative bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-[2rem] p-5 sm:p-6 shadow-2xl shadow-slate-900/10 space-y-4 overflow-hidden">
                {/* Top Video Header Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono font-extrabold text-slate-800 ml-2">
                      Solvear Platform Tour
                    </span>
                  </div>
                  <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                    Live Demo
                  </span>
                </div>

                {/* Main Video Thumbnail & Play Trigger Area */}
                <div
                  onClick={() => setVideoModalOpen(true)}
                  className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-slate-900 cursor-pointer group/video border border-slate-200"
                >
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80"
                    alt="Platform Overview Video Preview"
                    className="w-full h-full object-cover opacity-60 group-hover/video:scale-105 transition duration-500"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                  {/* Pulsing Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      <div className="absolute -inset-3 bg-blue-500/40 rounded-full animate-ping" />
                      <div className="relative w-18 h-18 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl group-hover/video:scale-110 transition duration-300">
                        <Play className="w-8 h-8 fill-current ml-1" />
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-white tracking-wide bg-slate-900/90 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-md">
                      Click to Watch Demo Video
                    </span>
                  </div>

                  {/* Bottom Video Badge */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white font-mono">
                    <span className="bg-emerald-600 px-3 py-1 rounded-lg font-extrabold shadow-xs">
                      WhatsApp + AI Bot Workflow
                    </span>
                    <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg font-bold">02:14 HD</span>
                  </div>
                </div>

                {/* Floating Metric Badges Below Video */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase">WhatsApp Open Rate</div>
                    <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">84.2%</div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="text-[11px] font-extrabold text-slate-500 uppercase">Daily API Dispatches</div>
                    <div className="text-2xl font-extrabold text-blue-700 font-mono mt-0.5">10M+</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards (Turain Grid Style with Bold Sizing) */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition">
            <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Broadcasting Read Rate</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono mt-2 flex items-baseline space-x-2">
              <span>80%+</span>
              <span className="text-xs text-emerald-700 font-sans font-extrabold flex items-center">
                <TrendingUp className="w-4 h-4 mr-0.5" /> High Read
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-2 font-medium">Instant delivery with read receipts</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition">
            <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Worldwide Platform Reach</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-mono mt-2">310K+</div>
            <p className="text-sm text-slate-600 mt-2 font-medium">Businesses &amp; agencies trust Solvear</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition">
            <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Built-In Payment Methods</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-blue-600 font-mono mt-2">20+ Gateways</div>
            <p className="text-sm text-slate-600 mt-2 font-medium">Stripe, Razorpay, PhonePe, WhatsApp Pay</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition">
            <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Gateway Speed</div>
            <div className="text-4xl sm:text-5xl font-extrabold text-purple-600 font-mono mt-2">&lt; 42ms</div>
            <p className="text-sm text-slate-600 mt-2 font-medium">HAProxy + Amazon SQS + PostgreSQL</p>
          </div>
        </div>
      </div>

      {/* Video Modal Player (Turain Style) */}
      {videoModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Play className="w-5 h-5 text-blue-400 fill-current" />
                <span className="text-base font-extrabold">Solvear.in • 2-Minute Platform Walkthrough</span>
              </div>
              <button
                onClick={() => setVideoModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Solvear Platform Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-sm text-slate-400">
              <span>Ready to automate WhatsApp for your store or agency?</span>
              <Link
                href="/dashboard"
                onClick={() => setVideoModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 rounded-xl transition shadow-md"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
