'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export function RoiCalculator() {
  const [contacts, setContacts] = useState<number>(10000);
  const [avgOrderValue, setAvgOrderValue] = useState<number>(1500); // INR

  // Calculations
  const emailOpenRate = 0.15;
  const whatsappOpenRate = 0.84;
  const conversionRate = 0.04; // 4% purchase rate on opened messages

  const emailOpened = Math.round(contacts * emailOpenRate);
  const whatsappOpened = Math.round(contacts * whatsappOpenRate);

  const emailSales = Math.round(emailOpened * conversionRate);
  const whatsappSales = Math.round(whatsappOpened * conversionRate);

  const extraOrders = whatsappSales - emailSales;
  const extraRevenueInr = extraOrders * avgOrderValue;
  const estimatedCostInr = contacts * 0.12;
  const netRoiMultiplier = ((extraRevenueInr - estimatedCostInr) / Math.max(estimatedCostInr, 1)).toFixed(1);

  return (
    <section id="calculator" className="py-20 md:py-28 relative bg-slate-50/70 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-blue-800 font-mono">
            <Calculator className="w-4 h-4 text-blue-600" />
            <span>Interactive ROI &amp; Revenue Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Calculate Your Revenue Uplift with WhatsApp
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Compare WhatsApp’s 84%+ open rate against traditional email and SMS marketing to see your projected monthly ROI.
          </p>
        </div>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl">
          {/* Sliders & Inputs (Left 6 cols) */}
          <div className="lg:col-span-6 space-y-7">
            {/* Contacts Volume Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-extrabold text-slate-800">Monthly Subscribers / Contacts</span>
                <span className="font-mono text-base sm:text-lg font-extrabold text-blue-700">
                  {contacts.toLocaleString()} Contacts
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={contacts}
                onChange={(e) => setContacts(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono font-bold">
                <span>1K</span>
                <span>25K</span>
                <span>50K</span>
                <span>100K+</span>
              </div>
            </div>

            {/* Average Order Value Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="font-extrabold text-slate-800">Average Order Value (AOV)</span>
                <span className="font-mono text-base sm:text-lg font-extrabold text-emerald-700">
                  ₹{avgOrderValue.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-xs text-slate-500 font-mono font-bold">
                <span>₹500</span>
                <span>₹2,500</span>
                <span>₹5,000</span>
                <span>₹10,000+</span>
              </div>
            </div>

            {/* Comparison Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
                <div className="text-xs text-slate-500 font-extrabold uppercase">Traditional Email (15%)</div>
                <div className="text-2xl font-extrabold text-slate-800 font-mono mt-1">
                  {emailOpened.toLocaleString()} reads
                </div>
                <div className="text-xs text-slate-500 mt-1 font-semibold">~{emailSales} orders placed</div>
              </div>

              <div className="p-5 bg-blue-50/90 rounded-2xl border border-blue-300 shadow-xs">
                <div className="text-xs text-blue-800 font-extrabold uppercase">WhatsApp Reads (84%)</div>
                <div className="text-2xl font-extrabold text-blue-950 font-mono mt-1">
                  {whatsappOpened.toLocaleString()} reads
                </div>
                <div className="text-xs text-blue-700 mt-1 font-extrabold">~{whatsappSales} orders placed</div>
              </div>
            </div>
          </div>

          {/* Revenue Output Card (Right 6 cols) */}
          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-3xl p-7 sm:p-9 space-y-6 flex flex-col justify-between h-full shadow-md">
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                Projected Monthly Extra Revenue
              </span>
              <div className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 font-mono flex items-baseline space-x-3 flex-wrap">
                <span>₹{extraRevenueInr.toLocaleString()}</span>
                <span className="text-sm text-emerald-700 font-sans font-extrabold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-1" /> +{extraOrders} Extra Orders
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">
                By engaging subscribers on WhatsApp where messages are read within 3 minutes rather than lost in email spam filters.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
              <div>
                <div className="text-xs text-slate-500 uppercase font-extrabold">Estimated Message Cost</div>
                <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">
                  ₹{estimatedCostInr.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-500 uppercase font-extrabold">Estimated Net ROI</div>
                <div className="text-xl font-extrabold text-emerald-700 font-mono mt-1">
                  {netRoiMultiplier}x Return
                </div>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center space-x-2.5 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-800 hover:to-indigo-700 text-white font-extrabold text-base py-4 rounded-2xl shadow-xl shadow-blue-600/20 transition group"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-current" />
              <span>Unlock This Revenue in Console</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
