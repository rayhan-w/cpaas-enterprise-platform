'use client';

import React, { useState } from 'react';
import {
  Layers,
  CreditCard,
  ShoppingBag,
  Database,
  Workflow,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  ShopifyIcon,
  WooCommerceIcon,
  GoogleSheetsIcon,
  GoogleFormsIcon,
  StripeIcon,
  RazorpayIcon,
  ZapierIcon,
  OpenAIIcon,
  GeminiIcon,
} from '@/components/common/BrandIcons';

interface Integration {
  name: string;
  category: 'payment' | 'ecommerce' | 'crm' | 'infra';
  description: string;
  icon?: any;
}

const INTEGRATIONS_LIST: Integration[] = [
  // Payments (20+ Gateways)
  { name: 'Stripe', category: 'payment', description: 'Global credit card & subscription billing', icon: StripeIcon },
  { name: 'Razorpay', category: 'payment', description: 'Instant UPI, NetBanking & Cards in India', icon: RazorpayIcon },
  { name: 'WhatsApp Pay', category: 'payment', description: 'Native 1-tap checkout inside WhatsApp chat', icon: WhatsAppIcon },
  { name: 'PhonePe', category: 'payment', description: 'Direct Indian UPI QR & in-app intent' },
  { name: 'PayPal', category: 'payment', description: 'International cross-border payments' },
  { name: 'Instamojo', category: 'payment', description: 'Indian payment gateway for digital commerce' },
  { name: 'Paystack', category: 'payment', description: 'Leading African payment gateway' },
  { name: 'Flutterwave', category: 'payment', description: 'African & global multi-currency checkout' },
  { name: 'Mollie', category: 'payment', description: 'European iDEAL, SEPA & Klarna processing' },
  { name: 'Mercado Pago', category: 'payment', description: 'Latin America local payment methods' },
  { name: 'MyFatoorah', category: 'payment', description: 'Middle East KNET, Benefit & Mada payments' },
  { name: 'toyyibPay', category: 'payment', description: 'Malaysian FPX online banking payments' },
  { name: 'senangPay', category: 'payment', description: 'Southeast Asia payment processing' },
  { name: 'Tap Payments', category: 'payment', description: 'MENA regional digital payments' },
  { name: 'YooMoney', category: 'payment', description: 'Eastern European & CIS wallet payments' },
  { name: 'PayPro', category: 'payment', description: 'Enterprise merchant checkout processing' },
  { name: 'PayMaya', category: 'payment', description: 'Philippines digital mobile wallet' },

  // eCommerce
  { name: 'Shopify', category: 'ecommerce', description: 'Real-time order sync, COD check & abandoned cart', icon: ShopifyIcon },
  { name: 'WooCommerce', category: 'ecommerce', description: 'WordPress plugin for auto-webhooks & alerts', icon: WooCommerceIcon },
  { name: 'WhatsApp Catalog', category: 'ecommerce', description: 'Direct in-chat product catalogue & cart ordering', icon: WhatsAppIcon },
  { name: 'WhatsApp Flows', category: 'ecommerce', description: 'Interactive native forms for booking & leads', icon: WhatsAppIcon },

  // CRM & Webforms
  { name: 'Google Sheets', category: 'crm', description: 'Trigger WhatsApp messages directly from sheet rows', icon: GoogleSheetsIcon },
  { name: 'Google Forms', category: 'crm', description: 'Auto-reply and save leads from Google Forms', icon: GoogleFormsIcon },
  { name: 'WPForms & Elementor', category: 'crm', description: 'Capture website form submissions via webhooks' },
  { name: 'Google Contacts & Maps', category: 'crm', description: 'Sync customer phonebooks & location pins' },
  { name: 'Mailchimp', category: 'crm', description: 'Sync newsletter subscribers with WhatsApp lists' },
  { name: 'Brevo (Sendinblue)', category: 'crm', description: 'Omnichannel email + WhatsApp workflows' },
  { name: 'Mautic', category: 'crm', description: 'Open-source marketing automation sync' },

  // Cloud, SMS & AI
  { name: 'OpenAI GPT-4o', category: 'infra', description: 'Natural language bot intelligence & FAQ solver', icon: OpenAIIcon },
  { name: 'Google Gemini', category: 'infra', description: 'Multimodal AI analysis & customer reasoning', icon: GeminiIcon },
  { name: 'Zapier', category: 'infra', description: 'Connect with 5,000+ cloud apps via webhooks', icon: ZapierIcon },
  { name: 'Twilio SMS', category: 'infra', description: 'Fallback SMS gateway for non-WhatsApp users' },
  { name: 'Plivo & Clickatell', category: 'infra', description: 'Global enterprise SMS routing gateways' },
  { name: "Africa's Talking", category: 'infra', description: 'African SMS & telecommunications gateway' },
  { name: 'AWS SES & SQS', category: 'infra', description: 'Zero-loss email and queue telemetry dispatch' },
  { name: 'Postmark & Mandrill', category: 'infra', description: 'Transactional email alerts and verification' },
  { name: 'Wasabi Cloud Storage', category: 'infra', description: 'High-speed object storage for chat media' },
];

export function IntegrationsGrid() {
  const [filter, setFilter] = useState<'all' | 'payment' | 'ecommerce' | 'crm' | 'infra'>('all');
  const [search, setSearch] = useState('');

  const filtered = INTEGRATIONS_LIST.filter((item) => {
    const matchesFilter = filter === 'all' || item.category === filter;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="integrations" className="py-20 md:py-28 relative bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-purple-800 font-mono">
            <Workflow className="w-4 h-4 text-purple-600" />
            <span>Solvear Top Integrations (30+ Built-In)</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Connects with Every Tool in Your Stack
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Solvear offers numerous built-in integrations, from 20+ payment gateways to Shopify, WooCommerce, Google Sheets, and AI models.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl w-full sm:w-auto">
            {[
              { id: 'all', label: 'All Integrations (30+)' },
              { id: 'payment', label: 'Payment Gateways (20+)' },
              { id: 'ecommerce', label: 'eCommerce & Flows' },
              { id: 'crm', label: 'CRM, Sheets & Forms' },
              { id: 'infra', label: 'AI, SMS & Cloud' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition ${
                  filter === cat.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name (e.g. Stripe, Razorpay)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl pl-12 pr-4 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 shadow-xs"
            />
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-6 space-y-3 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md transition group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {Icon ? (
                        <Icon className="w-6 h-6 shrink-0" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                      )}
                      <span className="text-base font-extrabold text-slate-900 group-hover:text-blue-700 transition">
                        {item.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white text-slate-700 border border-slate-200 font-extrabold">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
