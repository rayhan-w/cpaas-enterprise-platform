'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bot,
  Inbox,
  Megaphone,
  ShoppingCart,
  PackageCheck,
  CalendarClock,
  ListOrdered,
  Sparkles,
  BarChart3,
  Users,
  Workflow,
  ShieldCheck,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { SolvearTurainNavbar } from '@/components/solvear-turain/Navbar';
import { SolvearTurainFooter } from '@/components/solvear-turain/Footer';

const ALL_FEATURES = [
  {
    icon: Megaphone,
    title: 'Broadcasting — 80%+ Open Rates',
    copy: 'Deliver personalized broadcasts across WhatsApp, Messenger, Instagram and Telegram — promotional offers, product updates, newsletters, event invites and alerts that always get noticed.',
  },
  {
    icon: Bot,
    title: 'Drag & Drop Chatbot Builder',
    copy: 'Build powerful automation flows visually with conditions, user inputs and API calls — no coding required.',
  },
  {
    icon: Inbox,
    title: 'Omni-Channel Shared Inbox',
    copy: 'WhatsApp, Messenger, Instagram DM, Telegram and WebChat in one unified dashboard, with agent assignment, smart routing and AI-assisted replies.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Assistant (OpenAI & Gemini)',
    copy: 'Train your AI with FAQs, document uploads and website content. Real-time intent detection delivers accurate, human-like, context-aware responses.',
  },
  {
    icon: ListOrdered,
    title: 'Sequence (Drip) Messaging',
    copy: 'Schedule customized, time-based messages that guide customers through onboarding, promotions, reminders and re-engagement — automatically.',
  },
  {
    icon: Workflow,
    title: 'User Input Flows',
    copy: 'Collect preferences, interests and feedback directly inside chat. Capture data effortlessly, segment audiences and deliver the right offers to the right people.',
  },
  {
    icon: ShoppingCart,
    title: 'Webhook Workflow Automation',
    copy: 'Connect Typeform, Google Forms, Elementor, WooCommerce and Shopify. Trigger real-time order confirmations, cart reminders, delivery notifications and payment receipts.',
  },
  {
    icon: PackageCheck,
    title: 'Shopify & WooCommerce Integration',
    copy: 'Instant order notifications, Cash on Delivery confirmation and abandoned cart recovery delivered directly via WhatsApp.',
  },
  {
    icon: CalendarClock,
    title: 'WhatsApp Form Flows',
    copy: 'Interactive forms built right into WhatsApp — schedule appointments, collect feedback, capture leads and gather customer information effortlessly.',
  },
  {
    icon: BarChart3,
    title: 'WhatsApp Catalog Integration',
    copy: 'Showcase products and let customers browse and buy directly within WhatsApp — a smooth shopping experience that boosts conversions.',
  },
  {
    icon: Users,
    title: 'Live Chat Mobile App',
    copy: 'Android, iOS and desktop apps with instant notifications — even offline or in the background. Manage chats on the go and collaborate with your team.',
  },
  {
    icon: ShieldCheck,
    title: 'HTTP API Inside Bot Flow',
    copy: 'Connect external systems, fetch real-time data like order status or inventory, and trigger dynamic personalized responses — no-code setup.',
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <SolvearTurainNavbar />

      <main className="flex-1 pt-36 pb-24">
        {/* Page Hero */}
        <section className="bg-mesh-pattern border-b border-slate-200 py-16 md:py-24 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-blue-800 font-mono">
              <span>Solvear Core Features</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
              Chat, sell &amp; scale with AI — all in one platform
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Broadcasts, commerce, Shared Inbox and AI Tokens — everything Solvear API automates, from the first message to repeat orders.
            </p>
          </div>
        </section>

        {/* 12 Features Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ALL_FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 hover:shadow-xl hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{f.title}</h2>
                    <p className="text-base text-slate-600 leading-relaxed font-normal">{f.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Scale & Platform Overview */}
        <section className="bg-white border-y border-slate-200 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <img
              src="/assets/platform.jpg"
              alt="Solvear analytics and campaign dashboard"
              className="rounded-3xl shadow-xl border border-slate-200 w-full object-cover"
            />
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-800 font-mono">
                <span>Built for Scale</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Webhooks, HTTP API &amp; AI Control
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-medium">
                Automate workflows with webhooks and plug third-party systems straight into your bot flows — then manage AI configurations, response logic, business hours and automation from one intuitive dashboard.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-sm font-extrabold text-slate-900">Effortless API connectivity</div>
                  <p className="text-xs text-slate-600 mt-1">Integrate third-party apps, databases and CRMs directly.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="text-sm font-extrabold text-slate-900">Dynamic personalized replies</div>
                  <p className="text-xs text-slate-600 mt-1">Fetch order status, account details or live inventory in real time.</p>
                </div>
              </div>
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-md transition"
              >
                <span>Try All Features Free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SolvearTurainFooter />
    </div>
  );
}
