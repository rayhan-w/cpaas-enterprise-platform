'use client';

import React from 'react';
import {
  TrendingDown,
  Clock,
  Layers,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  ShoppingBag,
  Bot,
  MessageSquare,
} from 'lucide-react';
import {
  WhatsAppIcon,
  InstagramIcon,
  ShopifyIcon,
  GoogleSheetsIcon,
} from '@/components/common/BrandIcons';

const SOLVEAR_CHALLENGES = [
  {
    category: 'Deliverability & Opens',
    problem: 'Email Ignored & Traditional SMS Saturated',
    problemDesc: 'Marketing emails get buried in spam folders with under 15% open rates, while plain text SMS lacks product images, interactive buttons, and checkout capability.',
    solutionTitle: 'Official WhatsApp Cloud API (84%+ Open Rate)',
    solutionDesc: 'Deliver rich media broadcasts, image carousels, and DLT-approved templates directly where users check messages within 3 minutes.',
    color: 'text-emerald-800 bg-emerald-100/80 border-emerald-300',
    stat: '84.2% Read Rate',
  },
  {
    category: 'eCommerce RTO Losses',
    problem: 'High COD Return-to-Origin & Cart Abandonment',
    problemDesc: 'Online stores suffer 30-40% RTO courier losses from unverified COD orders, plus over 70% of potential buyers abandon their carts without purchasing.',
    solutionTitle: '1-Click COD Confirmation & Cart Recovery',
    solutionDesc: 'Automatically verify COD address via WhatsApp 1-tap buttons and trigger timed discount nudges (EXTRA15) to recover up to 28% lost cart revenue.',
    color: 'text-amber-800 bg-amber-100/80 border-amber-300',
    stat: '65% RTO Drop',
  },
  {
    category: 'Vendor Sprawl',
    problem: 'Fragmented Messaging Channels & Multi-Tool Chaos',
    problemDesc: 'Switching between WhatsApp Web, Instagram inbox, Telegram bots, and website chat creates lost leads, slow responses, and agent burnout.',
    solutionTitle: 'Unified Multi-Channel Shared Team Inbox',
    solutionDesc: 'Consolidate WhatsApp, Instagram DMs, Facebook Messenger, Telegram, and Webchat into 1 shared dashboard with real-time 100+ language auto-translation.',
    color: 'text-blue-800 bg-blue-100/80 border-blue-300',
    stat: '5 Channels in 1',
  },
  {
    category: 'AI & Bot Complexity',
    problem: 'Coding Headaches & Skyrocketing AI Token Costs',
    problemDesc: 'Custom AI chatbots require complex backend code, while SaaS providers lock you into expensive subscriptions with zero token visibility.',
    solutionTitle: 'Visual Drag-and-Drop Builder & AI Tokens',
    solutionDesc: 'Build multi-branch logic visually, sync with Google Sheets in real time, and pay only for OpenAI/Gemini tokens you actually consume.',
    color: 'text-purple-800 bg-purple-100/80 border-purple-300',
    stat: 'Pay As You Go',
  },
];

export function SolvearTurainChallenges() {
  return (
    <section className="py-20 md:py-28 relative bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-blue-800 font-mono">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Problem to Performance</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Common Customer Communication Challenges Solvear Helps Solve
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Solvear removes telecom friction, e-commerce cart abandonment, and vendor sprawl so you can automate customer acquisition and scale support effortlessly.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SOLVEAR_CHALLENGES.map((item, i) => (
            <div
              key={i}
              className="bg-slate-50/90 border border-slate-200 rounded-3xl p-8 sm:p-10 space-y-6 hover:shadow-xl hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs sm:text-sm font-mono font-extrabold px-3.5 py-1.5 rounded-full border ${item.color}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold font-mono text-slate-900 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-xs">
                    {item.stat}
                  </span>
                </div>

                {/* Problem */}
                <div className="space-y-2">
                  <div className="text-xs font-extrabold text-red-600 uppercase tracking-wider">The Bottleneck:</div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">{item.problem}</h3>
                  <p className="text-base text-slate-600 leading-relaxed font-normal">{item.problemDesc}</p>
                </div>

                {/* Solution */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs">
                  <div className="flex items-center space-x-2 text-sm font-extrabold text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Solvear Solution: {item.solutionTitle}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">{item.solutionDesc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
