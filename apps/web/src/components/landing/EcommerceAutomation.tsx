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
} from 'lucide-react';
import {
  ShopifyIcon,
  WooCommerceIcon,
  WhatsAppIcon,
} from '@/components/common/BrandIcons';

export function EcommerceAutomation() {
  return (
    <section id="ecommerce" className="py-20 md:py-28 relative bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-pink-50 border border-pink-200 px-4 py-1.5 rounded-full text-xs font-bold text-pink-800 font-mono">
            <ShoppingBag className="w-4 h-4 text-pink-600" />
            <span>Shopify &amp; WooCommerce Superpowers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Automate eCommerce Sales &amp; Cut Return-to-Origin (RTO)
          </h2>
          <p className="text-base text-slate-600">
            Connect your online store in 2 minutes. Automate critical revenue workflows from abandoned cart reminders to automated COD verification.
          </p>
        </div>

        {/* 3 Main Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {/* Pillar 1: COD Verification */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1 rounded-xl">
                  <ShopifyIcon className="w-4 h-4" />
                  <WooCommerceIcon className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">Automated COD Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Slash fake orders and RTO courier losses by up to 65%. Automatically send a WhatsApp verification prompt with 1-tap "Confirm" and "Cancel" buttons as soon as an order is placed.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1-Click Address Confirmation</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Auto-cancel unverified fake orders</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Convert COD to Prepaid with discounts</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-amber-300 text-xs text-amber-900 font-mono font-bold shadow-xs">
              ⚡ Metric: 65% Reduction in RTO Couriers
            </div>
          </div>

          {/* Pillar 2: Abandoned Cart Recovery */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                  <Zap className="w-8 h-8" />
                </div>
                <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1 rounded-xl">
                  <WhatsAppIcon className="w-4 h-4" />
                  <ShopifyIcon className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">Abandoned Cart Recovery</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Reach shoppers right on WhatsApp where they actually read your message. Deliver product images, pre-filled checkout links, and time-sensitive promo codes.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated 15m, 2h &amp; 24h triggers</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Dynamic product card attachment</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unique 1-time discount code generator</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-emerald-300 text-xs text-emerald-900 font-mono font-bold shadow-xs">
              ⚡ Metric: 28% Average Cart Recovery Rate
            </div>
          </div>

          {/* Pillar 3: Order Notifications & Live Tracking */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-5 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
                  <Truck className="w-8 h-8" />
                </div>
                <div className="flex items-center space-x-1.5 bg-white border border-slate-200 px-3 py-1 rounded-xl">
                  <WooCommerceIcon className="w-4 h-4" />
                  <WhatsAppIcon className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-extrabold text-slate-900">Real-Time Dispatch Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Eliminate "Where Is My Order" (WISMO) support queries. Automatically alert customers at every step: Order Placed, Shipped, Out for Delivery, and Delivered.
              </p>
              <div className="space-y-2.5 pt-2">
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct courier live tracking link</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Automated review &amp; feedback collection</span>
                </div>
                <div className="flex items-center space-x-2.5 text-sm text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero-cost support ticket reduction</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-blue-300 text-xs text-blue-900 font-mono font-bold shadow-xs">
              ⚡ Metric: 70% Drop in WISMO Support Tickets
            </div>
          </div>
        </div>

        {/* Integration Callout */}
        <div className="mt-14 p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center space-x-5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-indigo-600 shadow-xs flex items-center space-x-2">
              <ShopifyIcon className="w-7 h-7" />
              <WooCommerceIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900">Ready for Shopify &amp; WooCommerce Official Plugins</div>
              <p className="text-sm text-slate-600">Install the official Solvear Webhook Plugin in 1 click and connect your store effortlessly.</p>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 rounded-2xl shadow-md shadow-blue-600/20 transition shrink-0"
          >
            <span>Connect Store in Console</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
