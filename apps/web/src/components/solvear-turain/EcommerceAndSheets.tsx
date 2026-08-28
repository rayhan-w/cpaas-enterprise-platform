'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ShieldCheck,
  Zap,
  Truck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Layers,
  FileSpreadsheet,
  FileText,
  Workflow,
  Globe,
} from 'lucide-react';
import {
  ShopifyIcon,
  WooCommerceIcon,
  WhatsAppIcon,
  GoogleSheetsIcon,
  GoogleFormsIcon,
  ZapierIcon,
} from '@/components/common/BrandIcons';

export function SolvearTurainEcommerceSheets() {
  return (
    <section id="ecommerce" className="py-20 md:py-28 relative bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-pink-800 font-mono">
            <ShoppingBag className="w-4 h-4 text-pink-600" />
            <span>Shopify &amp; WooCommerce Superpowers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Automate eCommerce Sales, Cut RTO &amp; Sync Google Sheets
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Connect your online store and Google Workspace in 2 minutes. Automate critical revenue workflows from abandoned cart recovery to 1-click COD confirmation and 2-way Google Sheets triggers.
          </p>
        </div>

        {/* 3 Main eCommerce Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          {/* Pillar 1: COD Verification */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-8 sm:p-9 space-y-5 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
                  <ShopifyIcon className="w-5 h-5" />
                  <WooCommerceIcon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">Automated COD Verification</h3>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Slash fake orders and RTO courier losses by up to 65%. Automatically send a WhatsApp verification prompt with 1-tap "Confirm" and "Cancel" buttons as soon as an order is placed.
              </p>
              <div className="space-y-2.5 pt-3">
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>1-Click Address Confirmation</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Auto-cancel unverified fake orders</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Convert COD to Prepaid with discounts</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-300 text-xs sm:text-sm text-amber-900 font-mono font-bold shadow-xs mt-2">
              ⚡ Metric: 65% Reduction in RTO Couriers
            </div>
          </div>

          {/* Pillar 2: Abandoned Cart Recovery */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-8 sm:p-9 space-y-5 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
                  <WhatsAppIcon className="w-5 h-5" />
                  <ShopifyIcon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">Abandoned Cart Recovery</h3>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Reach shoppers right on WhatsApp where they actually read your message. Deliver product images, pre-filled checkout links, and time-sensitive EXTRA15 promo codes.
              </p>
              <div className="space-y-2.5 pt-3">
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Automated 15m, 2h &amp; 24h triggers</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Dynamic product card attachment</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Unique 1-time discount code generator</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-300 text-xs sm:text-sm text-emerald-900 font-mono font-bold shadow-xs mt-2">
              ⚡ Metric: 28% Average Cart Recovery Rate
            </div>
          </div>

          {/* Pillar 3: Order Notifications & Live Tracking */}
          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-8 sm:p-9 space-y-5 flex flex-col justify-between hover:shadow-xl hover:border-slate-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
                  <Truck className="w-8 h-8" />
                </div>
                <div className="flex items-center space-x-2 bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl shadow-xs">
                  <WooCommerceIcon className="w-5 h-5" />
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">Real-Time Dispatch Tracking</h3>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Eliminate "Where Is My Order" (WISMO) support queries. Automatically alert customers at every step: Order Placed, Shipped, Out for Delivery, and Delivered.
              </p>
              <div className="space-y-2.5 pt-3">
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Direct courier live tracking link</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Automated review &amp; feedback collection</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Zero-cost support ticket reduction</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-blue-300 text-xs sm:text-sm text-blue-900 font-mono font-bold shadow-xs mt-2">
              ⚡ Metric: 70% Drop in WISMO Support Tickets
            </div>
          </div>
        </div>

        {/* 4 Google Sheets & Webhook Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-13 h-13 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-3 shadow-xs">
                <GoogleSheetsIcon className="w-full h-full" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Google Sheets 2-Way Sync</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Trigger WhatsApp messages automatically from new sheet rows and record bot survey answers back in real time.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-800 font-extrabold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              ✓ Automated Row Triggers
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-13 h-13 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-3 shadow-xs">
                <GoogleFormsIcon className="w-full h-full" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Google Forms &amp; WPForms</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Auto-respond to form entries instantly on WhatsApp and onboard leads before they leave your website.
              </p>
            </div>
            <div className="text-xs font-mono text-purple-800 font-extrabold bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200">
              ✓ Instant Form Auto-Reply
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-13 h-13 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-3 shadow-xs">
                <ZapierIcon className="w-full h-full" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">Zapier &amp; Webhook Flows</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Pass user intent and contact variables to 5,000+ external CRMs and ERPs with low-latency JSON webhooks.
              </p>
            </div>
            <div className="text-xs font-mono text-indigo-800 font-extrabold bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-200">
              ✓ 5,000+ Cloud Apps
            </div>
          </div>

          <div className="bg-slate-50/80 border border-slate-200 rounded-3xl p-7 space-y-4 shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs p-3">
                <Globe className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">SMS &amp; Email Fallback</h4>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">
                Automatically fallback to Twilio SMS or Postmark/SMTP emails if a user is not reachable on WhatsApp.
              </p>
            </div>
            <div className="text-xs font-mono text-blue-800 font-extrabold bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
              ✓ 100% Delivery Assurance
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
