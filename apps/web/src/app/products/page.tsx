'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  Bot,
  ShoppingBag,
  Layers,
  ArrowRight,
  CheckCircle2,
  Workflow,
  Sparkles,
} from 'lucide-react';
import {
  WhatsAppIcon,
  InstagramIcon,
  FacebookIcon,
  TelegramIcon,
  ShopifyIcon,
  OpenAIIcon,
} from '@/components/common/BrandIcons';
import { SolvearTurainNavbar } from '@/components/solvear-turain/Navbar';
import { SolvearTurainFooter } from '@/components/solvear-turain/Footer';

const PRODUCTS = [
  {
    icon: WhatsAppIcon,
    title: 'WhatsApp Business Cloud API',
    desc: 'Official Meta Cloud API gateway with 84%+ open rates, in-chat catalogs, WhatsApp Pay/UPI, and TRAI DLT approved template broadcasting.',
    bullets: ['Embedded Meta Signup in 5 minutes', 'Interactive WhatsApp Form Flows', 'Dynamic variable support {{1}}', 'Real-time read receipts & analytics'],
  },
  {
    icon: InstagramIcon,
    title: 'Instagram DM & Reels Funnel',
    desc: 'Automatically convert Instagram post comments, Reels engagement, and Story mentions into direct message sales with auto-reply flows.',
    bullets: ['Comment-to-DM trigger on posts & reels', 'Story mention auto-thank you & coupons', 'Visual product showcase carousels', 'Human agent escalation routing'],
  },
  {
    icon: OpenAIIcon,
    title: 'AI Chatbot & AI Tokens',
    desc: 'Train custom AI chatbots using OpenAI GPT-4o and Google Gemini on your website FAQs, policy docs, and product descriptions.',
    bullets: ['Dual OpenAI & Google Gemini models', 'Transparent Pay As You Go token billing', 'Instant intent & sentiment detection', 'Multilingual support in 100+ languages'],
  },
  {
    icon: Workflow,
    title: 'Visual Drag & Drop Flow Builder',
    desc: 'Build sophisticated conversation journeys visually. Create conditional branches, user inputs, and time-delayed follow-up messages.',
    bullets: ['No-code drag-and-drop canvas', 'If/Else conditional logic rules', 'Custom user input capture & CRM sync', 'Automated drip follow-up sequences'],
  },
  {
    icon: ShopifyIcon,
    title: 'eCommerce COD & Cart Recovery',
    desc: 'Slash Return-to-Origin (RTO) losses by up to 65% with automated WhatsApp COD verification and recover abandoned carts with discount codes.',
    bullets: ['1-Click WhatsApp COD confirmation', 'Abandoned cart recovery with EXTRA15 code', 'Live courier dispatch tracking alerts', 'Official Shopify & WooCommerce webhooks'],
  },
  {
    icon: Layers,
    title: 'White-Label Reseller Hub',
    desc: 'Launch your own branded AI chatbot SaaS with custom CNAME domain, your own pricing plans, and a dedicated multi-tenant admin console.',
    bullets: ['Custom CNAME domain with auto SSL', '100% custom logo & brand colors', 'Keep 100% of client subscription revenue', 'Multi-tenant client management portal'],
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <SolvearTurainNavbar />

      <main className="flex-1 pt-36 pb-24">
        {/* Page Hero */}
        <section className="bg-mesh-pattern border-b border-slate-200 py-16 md:py-24 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-blue-800 font-mono">
              <span>Solvear Product Ecosystem</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
              Powerful Tools Built for Customer Growth
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Everything you need to automate conversations, boost sales conversions, and delight customers across all modern messaging channels.
            </p>
          </div>
        </section>

        {/* 6 Products Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-9 space-y-6 hover:shadow-xl hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-3 shadow-xs">
                      <Icon className="w-full h-full" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">{p.title}</h2>
                    <p className="text-base text-slate-600 leading-relaxed font-normal">{p.desc}</p>
                    <div className="space-y-2.5 pt-3 border-t border-slate-100">
                      {p.bullets.map((b, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm text-slate-700 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center space-x-2 text-sm font-extrabold text-blue-700 hover:text-blue-800 pt-3"
                  >
                    <span>Try in Sandbox</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <SolvearTurainFooter />
    </div>
  );
}
