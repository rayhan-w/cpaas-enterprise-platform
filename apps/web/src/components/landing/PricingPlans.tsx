'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Coins,
  Shield,
  Layers,
} from 'lucide-react';
import { WhatsAppIcon } from '@/components/common/BrandIcons';

export function PricingPlans() {
  return (
    <section id="pricing" className="py-20 md:py-28 relative bg-slate-50/70 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-blue-800 font-mono">
            <Coins className="w-4 h-4 text-blue-600" />
            <span>Transparent Pricing &amp; Pay As You Go</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Flexible Plans for Businesses, Agencies &amp; Resellers
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Choose a plan that fits your growth stage. Unlock generous AI tokens, WhatsApp broadcasting, and white-label options.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {/* Plan 1: Starter Trial */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold font-mono uppercase px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-800">
                  Starter Trial
                </span>
                <span className="text-xs sm:text-sm text-slate-500 font-bold">Free Forever / Trial</span>
              </div>

              <div>
                <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 font-mono">₹0</div>
                <div className="text-sm sm:text-base text-slate-500 mt-1 font-semibold">Get started with full features</div>
              </div>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Perfect for exploring WhatsApp chatbot automation, testing Meta Cloud API, and trying AI replies.
              </p>

              <div className="space-y-3.5 pt-6 border-t border-slate-100 text-sm sm:text-base text-slate-700 font-semibold">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>10 Connected Accounts</strong> (WA, FB, IG, TG)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>1,000 Message Credits</strong> / Month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>5,000 Subscribers</strong> Storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span><strong>1,000 AI Tokens</strong> / Month (OpenAI &amp; Gemini)</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>WhatsApp Catalog &amp; Form Flows</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Live Chat Shared Inbox &amp; Translator</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full text-center py-4 px-6 rounded-2xl border-2 border-slate-300 hover:bg-slate-50 text-slate-900 text-base font-extrabold transition shadow-xs"
            >
              Start Free Trial (900 Days)
            </Link>
          </div>

          {/* Plan 2: Growth Business (Featured) */}
          <div className="bg-white border-2 border-blue-600 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-blue-600/15 flex flex-col justify-between space-y-8 relative ring-4 ring-blue-600/10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm font-extrabold px-6 py-1.5 rounded-full shadow-md">
              MOST POPULAR
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold font-mono uppercase px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200">
                  Growth Business
                </span>
                <span className="text-xs sm:text-sm text-blue-700 font-extrabold">Scaling Brands</span>
              </div>

              <div>
                <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 font-mono">
                  ₹1,499<span className="text-lg font-sans text-slate-500 font-normal"> / mo</span>
                </div>
                <div className="text-sm sm:text-base text-slate-500 mt-1 font-semibold">Billed monthly or yearly</div>
              </div>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                For fast-growing eCommerce shops on Shopify &amp; WooCommerce needing automated COD &amp; Cart Recovery.
              </p>

              <div className="space-y-3.5 pt-6 border-t border-slate-100 text-sm sm:text-base text-slate-700 font-semibold">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span><strong>Unlimited Connected Accounts</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span><strong>25,000 Message Credits</strong> / Month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span><strong>50,000 Subscribers</strong> Storage</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span><strong>10,000 AI Tokens</strong> / Month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>WooCommerce &amp; Shopify Auto-Sync</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Google Sheets 2-Way Automation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>5 Team Member Seats</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full text-center py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base font-extrabold shadow-xl shadow-blue-600/30 transition"
            >
              Get Started with Growth
            </Link>
          </div>

          {/* Plan 3: White-Label Reseller */}
          <div className="bg-white border border-purple-200 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold font-mono uppercase px-3.5 py-1.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                  White-Label Reseller
                </span>
                <span className="text-xs sm:text-sm text-purple-700 font-extrabold">Agencies &amp; SaaS</span>
              </div>

              <div>
                <div className="text-5xl sm:text-6xl font-extrabold text-slate-900 font-mono">
                  ₹4,999<span className="text-lg font-sans text-slate-500 font-normal"> / mo</span>
                </div>
                <div className="text-sm sm:text-base text-slate-500 mt-1 font-semibold">Keep 100% of client revenue</div>
              </div>

              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Launch your own branded AI chatbot &amp; CPaaS platform with custom CNAME domain and multi-tenant admin.
              </p>

              <div className="space-y-3.5 pt-6 border-t border-slate-100 text-sm sm:text-base text-slate-700 font-semibold">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                  <span><strong>Custom Domain (CNAME)</strong> + Auto SSL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                  <span><strong>100% Custom Branding &amp; Logo</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                  <span><strong>Create Custom Pricing Plans</strong></span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                  <span><strong>100,000+ Message Credits</strong> / Month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                  <span><strong>50,000 AI Tokens</strong> / Month</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>Dedicated SQS Queue &amp; HAProxy IP</span>
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full text-center py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-base font-extrabold shadow-md shadow-purple-600/20 transition"
            >
              Start Reseller Agency
            </Link>
          </div>
        </div>

        {/* Addons Callout Box */}
        <div className="mt-14 p-8 rounded-3xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
              <Zap className="w-7 h-7" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900">Need Extra AI Tokens or Addons?</div>
              <p className="text-sm text-slate-600 font-medium">Top-up AI tokens or add extra team member seats anytime with our flexible Pay As You Go addon system.</p>
            </div>
          </div>

          <Link
            href="/dashboard/billing"
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-extrabold px-6 py-3.5 rounded-2xl transition shrink-0"
          >
            <span>View Addons &amp; Top-Ups</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
