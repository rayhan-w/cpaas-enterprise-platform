'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  PhoneCall,
  MessageSquare,
  Bot,
  Workflow,
  Code2,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
  ShoppingBag,
  FileSpreadsheet,
  Coins,
  ShieldCheck,
} from 'lucide-react';
import {
  WhatsAppIcon,
  InstagramIcon,
  ShopifyIcon,
  WooCommerceIcon,
  GoogleSheetsIcon,
  OpenAIIcon,
  GeminiIcon,
} from '@/components/common/BrandIcons';

const SOLVEAR_PRODUCTS = [
  {
    icon: WhatsAppIcon,
    iconBg: 'bg-emerald-100 text-emerald-700',
    badge: 'Official Meta Cloud API',
    title: 'WhatsApp Cloud API & In-Chat Commerce',
    desc: 'Official Meta embedded signup in 5 minutes. Showcase WhatsApp Product Catalogs, collect in-chat payments via WhatsApp Pay/UPI, and design interactive WhatsApp Form Flows for appointments and lead capture.',
    bullets: ['Embedded Meta Signup (5 Mins)', 'In-Chat Product Catalog & Cart Checkout', 'Interactive WhatsApp Form Flows', 'TRAI DLT Template Dynamic Variables {{1}}'],
  },
  {
    icon: InstagramIcon,
    iconBg: 'bg-pink-100 text-pink-700',
    badge: 'Social Commerce Funnel',
    title: 'Instagram DM & Comment Automation',
    desc: 'Automatically convert Instagram post comments, Reels engagement, and Story mentions into direct message conversations with personalized discounts, product cards, and instant checkout links.',
    bullets: ['Post & Reel Comment-to-DM Trigger', 'Story Mention Auto-Thank You & Coupon', 'Visual Carousel Product Showcase', 'AI Lead Qualification before human agent takeover'],
  },
  {
    icon: OpenAIIcon,
    iconBg: 'bg-purple-100 text-purple-700',
    badge: 'OpenAI GPT-4o + Gemini',
    title: 'AI Bot Reply & AI Token System',
    desc: 'Empower your chatbots with OpenAI GPT-4o and Google Gemini for human-like conversational flows, policy FAQs, and sentiment routing. Pay only for the AI tokens you consume with zero lock-in.',
    bullets: ['OpenAI GPT-4o & Google Gemini Models', 'Transparent Pay As You Go AI Tokens', 'Knowledgebase RAG for Instant Store FAQs', 'Sub-50ms Conversational Response Latency'],
  },
  {
    icon: Workflow,
    iconBg: 'bg-indigo-100 text-indigo-700',
    badge: 'Visual No-Code Builder',
    title: 'Visual Drag & Drop Flow Builder',
    desc: 'Build sophisticated multi-branch customer journey trees visually. Use smart If/Else conditional logic, capture custom user input fields, and trigger automated timed drip sequences effortlessly.',
    bullets: ['Visual Drag-and-Drop Node Canvas', 'Smart If/Else Conditional Logic Rules', 'User Input Questions & Variable Saving', 'Automated Drip Follow-Up Sequences'],
  },
  {
    icon: ShopifyIcon,
    iconBg: 'bg-amber-100 text-amber-700',
    badge: 'Shopify & WooCommerce',
    title: 'eCommerce COD & Cart Recovery',
    desc: 'Connect your store with 1-click webhook plugins. Slash RTO losses by up to 65% with 1-click COD address verification and recover 28% of abandoned carts with automated time-sensitive discount codes.',
    bullets: ['1-Click WhatsApp COD Confirmation', 'Abandoned Cart Recovery (EXTRA15 Codes)', 'Live Courier Dispatch Tracking Alerts', 'Official WooCommerce Webhook Plugin'],
  },
  {
    icon: GoogleSheetsIcon,
    iconBg: 'bg-blue-100 text-blue-700',
    badge: 'Sheets, Forms & Webhooks',
    title: 'Google Sheets & Webform Automations',
    desc: 'Trigger personalized WhatsApp messages directly from Google Sheets rows in real time. Connect Google Forms, WPForms, and Elementor to trigger instant confirmation messages and Zapier webhooks.',
    bullets: ['2-Way Real-Time Google Sheets Sync', 'Google Forms & WPForms Auto-Reply', 'Inbound & Outbound Webhook Triggers', '5,000+ Cloud Apps via Zapier Integration'],
  },
];

export function SolvearTurainProductGrid() {
  return (
    <section id="features" className="py-20 md:py-28 relative bg-slate-50/70 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-indigo-800 font-mono">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Complete Solvear Product Suite</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Explore Our WhatsApp Marketing, AI &amp; CPaaS Platform
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            From official Meta Cloud API broadcasting to Generative AI tokens, visual flow builders, and automated eCommerce recovery, Solvear provides the complete toolkit.
          </p>
        </div>

        {/* 6 Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SOLVEAR_PRODUCTS.map((prod, i) => {
            const Icon = prod.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-9 space-y-6 hover:shadow-xl hover:border-slate-300 transition flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-14 h-14 rounded-2xl p-3 flex items-center justify-center ${prod.iconBg} shadow-xs`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-mono font-extrabold px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                      {prod.badge}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 group-hover:text-blue-700 transition leading-snug">
                    {prod.title}
                  </h3>

                  <p className="text-base text-slate-600 leading-relaxed font-normal">{prod.desc}</p>

                  <div className="space-y-2.5 pt-3 border-t border-slate-100">
                    {prod.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-start space-x-2.5 text-sm text-slate-700 font-semibold">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="#simulator"
                    className="text-sm font-extrabold text-blue-700 group-hover:text-blue-800 flex items-center space-x-1.5"
                  >
                    <span>Test in Live Simulator</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                  <span className="text-xs font-mono text-slate-500 font-bold">99.98% SLA</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
