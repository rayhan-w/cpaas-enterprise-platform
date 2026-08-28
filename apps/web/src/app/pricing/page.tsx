'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PageHero } from '@/components/site/PageHero';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CtaBand } from '@/components/site/CtaBand';
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';

const PLANS = [
  {
    name: 'Free Trial',
    badge: 'Starter',
    price: '$0',
    cadence: 'for 900 days',
    copy: 'Get started and test the complete suite with generous usage limits.',
    highlight: false,
    cta: 'Start Free Trial',
    features: [
      '500 Monthly active contacts',
      'WhatsApp Official Cloud API',
      'Visual Flow Builder',
      'Omni-Channel Shared Inbox',
      'Community & Help Desk Support',
      'No credit card required',
    ],
  },
  {
    name: 'Growth',
    badge: 'Most Popular',
    price: '$49',
    cadence: 'per month',
    copy: 'For growing businesses and eCommerce brands scaling customer conversations.',
    highlight: true,
    cta: 'Get Started',
    features: [
      '10,000 Monthly active contacts',
      'All 5 Channels (WhatsApp, IG, Messenger, Telegram, Web)',
      'Shopify & WooCommerce Automations',
      'Abandoned Cart & 1-Click COD check',
      'Unlimited Team Agent Seats',
      'Priority 24/7 WhatsApp & Email Support',
    ],
  },
  {
    name: 'White-Label Reseller',
    badge: 'Agency Partner',
    price: '$199',
    cadence: 'per month',
    copy: 'Launch your own branded CPaaS & WhatsApp chatbot SaaS agency with 100% margins.',
    highlight: false,
    cta: 'Become a Reseller',
    features: [
      'Unlimited Client Tenants & Sub-accounts',
      'Custom CNAME Domain & Custom Branding',
      'Custom Pricing Plans & Markup Control',
      'Dedicated Reseller Super-Admin Dashboard',
      'Automated Invoicing & Client Wallet',
      'Dedicated Account Manager & SLA Guarantee',
    ],
  },
];

const AI_PACKS = [
  { tokens: '500,000 Tokens', price: '$10', popular: false },
  { tokens: '2,000,000 Tokens', price: '$35', popular: true },
  { tokens: '10,000,000 Tokens', price: '$150', popular: false },
];

export default function PricingPage() {
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Transparent Pricing"
          title="Simple, scalable plans for businesses and agencies"
          description="Pick the plan that fits your business stage. Upgrade, downgrade, or cancel anytime with zero lock-in."
        />

        {/* Pricing Cards */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-3">
              {PLANS.map((p) => (
                <div
                  key={p.name}
                  className={`rounded-3xl border p-8 flex flex-col justify-between transition-all ${
                    p.highlight
                      ? 'border-primary bg-card shadow-pink ring-2 ring-primary'
                      : 'border-border bg-card shadow-sm hover:shadow-elevated'
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-bold text-foreground">{p.name}</h3>
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                          p.highlight ? 'bg-primary text-white' : 'bg-surface text-muted-foreground'
                        }`}
                      >
                        {p.badge}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed font-normal">{p.copy}</p>

                    <div className="border-y border-border py-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-5xl font-extrabold text-foreground">
                          {p.price}
                        </span>
                        <span className="text-sm font-semibold text-muted-foreground">/{p.cadence}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-sm text-foreground/85 font-medium">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/contact"
                      className={`w-full inline-flex items-center justify-center py-4 rounded-xl font-bold text-base transition ${
                        p.highlight
                          ? 'bg-primary hover:bg-primary-hover text-white shadow-pink'
                          : 'bg-foreground text-background hover:bg-foreground/90'
                      }`}
                    >
                      {p.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Tokens Pay-As-You-Go Section */}
        <section className="bg-surface section-y border-y border-border">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="AI Add-Ons"
              title="Flexible AI Tokens for GPT-4o &amp; Gemini"
              description="Power your intelligent chatbot with pay-as-you-go tokens. Unused tokens roll over forever with zero expiration."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
              {AI_PACKS.map((pack) => (
                <div
                  key={pack.tokens}
                  className={`rounded-2xl border bg-card p-6 text-center space-y-4 ${
                    pack.popular ? 'border-primary shadow-pink' : 'border-border'
                  }`}
                >
                  <div className="w-12 h-12 mx-auto rounded-xl bg-accent flex items-center justify-center text-primary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-lg font-bold text-foreground">{pack.tokens}</h4>
                  <p className="text-3xl font-extrabold text-foreground">{pack.price}</p>
                  <p className="text-xs text-muted-foreground font-semibold">One-time top-up • No expiry</p>
                  <Link
                    href="/contact"
                    className="w-full inline-block py-2.5 rounded-lg border border-border bg-white text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Buy Token Pack
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  );
}
