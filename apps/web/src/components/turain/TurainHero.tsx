'use client';

import React from 'react';
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
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';

export function TurainHero() {
  return (
    <section className="relative pt-44 pb-20 md:pt-52 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
      {/* Background Soft Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] sm:w-[1100px] h-[500px] bg-gradient-to-tr from-blue-100/70 via-indigo-100/50 to-purple-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f080_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f080_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Content (7 cols) */}
          <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center space-x-2.5 bg-white border border-blue-200 px-4 py-1.5 rounded-full shadow-xs">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                India’s Trusted Customer Engagement Platform
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs sm:text-sm text-blue-700 font-extrabold flex items-center">
                TRAI DLT Verified <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14]">
              CPaaS Platform in India for{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600">
                Customer Engagement
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Run <strong className="text-slate-900 font-bold">DLT-compliant Bulk SMS, WhatsApp Business API, RCS, Voice and IVR</strong> from one unified platform with automation, REST APIs, real-time reporting and 24/7 technical support built for growing Indian businesses.
            </p>

            {/* Real Brand & Channel Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
                <WhatsAppIcon className="w-4 h-4" />
                <span>WhatsApp API</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
                <Smartphone className="w-4 h-4 text-blue-600" />
                <span>Bulk SMS &amp; OTP</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>RCS Messaging</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
                <PhoneCall className="w-4 h-4 text-purple-600" />
                <span>Voice &amp; Cloud IVR</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-800">
                <Bot className="w-4 h-4 text-emerald-600" />
                <span>AI Chatbots</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="#consultation"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-800 hover:to-indigo-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-xl shadow-blue-600/25 transition duration-200 group"
              >
                <Zap className="w-5 h-5 text-amber-300 fill-current" />
                <span>Schedule a Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
              </Link>

              <Link
                href="#developer"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-slate-50 border-2 border-slate-300 text-slate-800 font-bold text-base px-7 py-3.5 rounded-2xl shadow-sm transition duration-200"
              >
                <Activity className="w-5 h-5 text-blue-600" />
                <span>Explore Developer APIs</span>
              </Link>
            </div>

            {/* Compliance Guarantee */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-600 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>TRAI DLT 100% Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Modular Monolith + SQS Queue</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>ISO 27001 Data Security</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Enterprise CPaaS Telemetry Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-slate-900/10 space-y-5 relative">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-900 uppercase">
                    Live Dispatch Telemetry
                  </span>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  HAProxy 42ms
                </span>
              </div>

              {/* Real-time Status Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">OTP Delivery SLA</div>
                  <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">99.98%</div>
                  <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">&lt; 3.2s Avg Latency</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">Daily API Dispatches</div>
                  <div className="text-2xl font-extrabold text-blue-700 font-mono mt-1">10M+</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Amazon SQS FIFO</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">WhatsApp Open Rate</div>
                  <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">84.2%</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Meta Official Cloud API</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-[11px] font-bold text-slate-500 uppercase">DLT Scrub Speed</div>
                  <div className="text-2xl font-extrabold text-purple-700 font-mono mt-1">0.02ms</div>
                  <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Automated TRAI Filter</div>
                </div>
              </div>

              {/* Live Route Channels */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Channel Routing:</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <WhatsAppIcon className="w-4 h-4" />
                      <span className="font-bold text-emerald-950">WhatsApp Business API</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-700">100% Operational</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-blue-700" />
                      <span className="font-bold text-blue-950">DLT Transactional SMS (SMPP)</span>
                    </div>
                    <span className="font-mono font-bold text-blue-700">Airtel / Jio / VIL</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-indigo-50/70 border border-indigo-200 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-indigo-700" />
                      <span className="font-bold text-indigo-950">RCS Rich Cards Gateway</span>
                    </div>
                    <span className="font-mono font-bold text-indigo-700">Google Jibe Cloud</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards (Turain Style) */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Projects Completed</div>
            <div className="text-4xl font-extrabold text-slate-900 font-mono mt-2">1,500+</div>
            <p className="text-xs text-slate-500 mt-1">Enterprise messaging deployments</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Worldwide Clients</div>
            <div className="text-4xl font-extrabold text-slate-900 font-mono mt-2">310K+</div>
            <p className="text-xs text-slate-500 mt-1">Across India &amp; global markets</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Telecom Direct Pipes</div>
            <div className="text-4xl font-extrabold text-blue-600 font-mono mt-2">Tier-1 Telco</div>
            <p className="text-xs text-slate-500 mt-1">Jio, Airtel, Vodafone Idea SMPP</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition">
            <div className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Core Security</div>
            <div className="text-4xl font-extrabold text-purple-600 font-mono mt-2">4-Layer</div>
            <p className="text-xs text-slate-500 mt-1">Cloudflare + HAProxy + NestJS + PostgreSQL</p>
          </div>
        </div>
      </div>
    </section>
  );
}
