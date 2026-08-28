'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Inbox,
  ListOrdered,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
} from 'lucide-react';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CtaBand } from '@/components/site/CtaBand';
import { ChannelLogo } from '@/components/site/ChannelLogo';

const CHANNELS = [
  {
    name: 'WhatsApp Business API',
    slug: 'whatsapp',
    copy: 'Official Meta Cloud API. Run broadcasts, automated catalogs, user input flows and customer care with 80%+ open rates.',
  },
  {
    name: 'Facebook Messenger',
    slug: 'messenger',
    copy: 'Automate lead qualification, FAQs, order updates and Click-to-WhatsApp ads with instant bot responses 24/7.',
  },
  {
    name: 'Instagram DM',
    slug: 'instagram',
    copy: 'Turn post comments, story mentions and direct messages into qualified sales opportunities with AI-driven flows.',
  },
  {
    name: 'Telegram Bot',
    slug: 'telegram',
    copy: 'Broadcast alerts, share large media files and engage community channels with fast, flexible bot automation.',
  },
  {
    name: 'Website Live Chat',
    slug: 'webchat',
    copy: 'Capture leads on your website with an omnichannel chat widget that syncs seamlessly into your unified Shared Inbox.',
  },
];

const CAPABILITIES = [
  {
    icon: Zap,
    title: 'Broadcasting — 80%+ Open Rates',
    copy: 'Personalized bulk broadcasts for offers, product updates, newsletters, event invites and alerts.',
  },
  {
    icon: Bot,
    title: 'Drag & Drop Chatbot Builder',
    copy: 'Build multi-step flows with conditions, inputs and HTTP API calls — no code required.',
  },
  {
    icon: Inbox,
    title: 'Omni-Channel Shared Inbox',
    copy: 'WhatsApp, Messenger, Instagram, Telegram and WebChat in one dashboard — plus Android, iOS and desktop apps.',
  },
  {
    icon: Sparkles,
    title: 'AI Assistant (OpenAI & Gemini)',
    copy: 'Train AI on your FAQs, documents and website for human-like, intent-aware replies.',
  },
  {
    icon: ListOrdered,
    title: 'Sequence (Drip) Messaging',
    copy: 'Time-based message sequences for onboarding, promotions, reminders and re-engagement.',
  },
  {
    icon: ShoppingCart,
    title: 'Shopify & WooCommerce Automation',
    copy: 'Order notifications, COD confirmation and abandoned cart recovery over WhatsApp.',
  },
];

const STATS = [
  { value: '310K+', label: 'Users on the platform' },
  { value: '80%+', label: 'Broadcast open rates' },
  { value: '5', label: 'Channels in one inbox' },
  { value: '50+', label: 'Built-in integrations' },
];

const BADGES = [
  'OpenAI & Gemini Powered',
  'WhatsApp Business API',
  'White-Label Ready',
  'No-Code Builder',
  '310K+ Users',
];

const TESTIMONIALS = [
  {
    quote:
      'The Solvear API has completely transformed the way we handle complex problem-solving tasks. Integration was smooth, and the documentation made it super easy to get started. Our workflows are now faster and more accurate!',
    name: 'Verified Customer',
    role: 'Solvear API user',
  },
  {
    quote:
      'I love how scalable the Solvear API is. Whether handling small or large datasets, it performs flawlessly. The support team is also incredibly responsive whenever I have questions.',
    name: 'Verified Customer',
    role: 'Solvear API user',
  },
  {
    quote:
      'Solvear API is a game-changer for developers. The powerful features and easy-to-use endpoints saved us weeks of development time. Highly recommend for anyone looking to enhance their applications.',
    name: 'Verified Customer',
    role: 'Solvear API user',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        {/* 1. Hero Section (Solvear Dark Navy & Hot Pink with hero.jpg) */}
        <section className="relative isolate min-h-[620px] overflow-hidden bg-navy-deep text-navy-foreground">
          <img
            src="/assets/hero.jpg"
            alt="Business professional messaging customers on a smartphone"
            className="absolute inset-0 -z-20 h-full w-full object-cover object-right"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/20"
          />

          <div className="mx-auto flex max-w-7xl flex-col justify-center px-6 py-24 md:py-32">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Multi-channel CPaaS platform
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold leading-[1.1] md:text-6xl text-white">
              Turn WhatsApp Into Your #1 Sales Channel
            </h1>
            <p className="mt-6 max-w-2xl text-base text-navy-foreground/80 md:text-lg leading-relaxed">
              Chat, sell and scale with AI across WhatsApp, Messenger, Instagram, Telegram and Webchat — broadcasts, commerce, shared inbox and AI tokens in one platform built for businesses, agencies and resellers.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white text-base font-bold px-8 py-4 rounded-xl shadow-pink shadow-pink-hover transition"
              >
                <span>Request a Demo</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/products"
                className="group inline-flex items-center gap-3 text-sm font-semibold text-white hover:text-primary transition"
              >
                <span>Explore Products</span>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white transition-transform group-hover:translate-x-1 shadow-pink">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </div>

            <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy-foreground/60">
              {BADGES.map((b) => (
                <li key={b}>• {b}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* 2. Stats Bar */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground font-semibold">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Channels Section */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Channels"
              title="Every conversation channel, one platform"
              description="Reach customers where they already are and manage all of it from a single dashboard."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {CHANNELS.map((c) => (
                <Link
                  key={c.name}
                  href={`/channels/${c.slug}`}
                  className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elevated flex flex-col justify-between"
                >
                  <div>
                    <ChannelLogo name={c.name} />
                    <h3 className="mt-5 font-display text-lg font-bold text-foreground group-hover:text-primary transition">{c.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.copy}</p>
                  </div>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 4. About Solvear Section */}
        <section className="bg-surface section-y border-y border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
            <div>
              <SectionHeading
                align="left"
                eyebrow="About Solvear"
                title="An all-in-one WhatsApp marketing & automation platform"
                description="Solvear API helps businesses grow faster and smarter with bulk message broadcasting, abandoned cart recovery, COD verification, appointment scheduling, sequence messaging, user input flows and a drag-and-drop chatbot builder — all managed from a unified Shared Inbox."
              />
              <ul className="mt-7 space-y-4">
                {[
                  'WhatsApp, Messenger, Instagram, Telegram and WebChat in one Shared Inbox',
                  'Powered by OpenAI and Gemini with flexible AI Tokens',
                  'White-label reseller solution with custom domains and pricing controls',
                ].map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-foreground/80 font-medium">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link
                  href="/about"
                  className="inline-flex items-center px-6 py-3 rounded-xl border border-border bg-white text-sm font-bold text-foreground hover:bg-slate-50 transition"
                >
                  Learn More
                </Link>
              </div>
            </div>

            <img
              src="/assets/about.jpg"
              alt="Solvear team collaborating in an office"
              className="rounded-2xl shadow-elevated border border-border w-full object-cover"
            />
          </div>
        </section>

        {/* 5. Platform Automation Capabilities */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Platform"
              title="Automation that does the selling for you"
              description="From the first message to repeat orders, Solvear automates the busywork and keeps humans in the loop where it matters."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((c) => (
                <article key={c.title} className="rounded-2xl border border-border bg-card p-7 space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary">
                    <c.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-normal">{c.copy}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/features"
                className="inline-flex items-center px-7 py-3.5 rounded-xl border border-border bg-white text-sm font-bold text-foreground hover:bg-slate-50 transition"
              >
                See all features
              </Link>
            </div>
          </div>
        </section>

        {/* 6. White-label Reseller Section */}
        <section className="bg-navy text-navy-foreground section-y">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
            <img
              src="/assets/platform.jpg"
              alt="Solvear analytics dashboard on a laptop"
              className="order-2 rounded-2xl shadow-elevated border border-navy-soft lg:order-1 w-full object-cover"
            />
            <div className="order-1 lg:order-2 space-y-6">
              <SectionHeading
                align="left"
                inverted
                eyebrow="White-label"
                title="Build your own brand with Solvear's white-label solution"
                description="Rebrand the entire platform as your own — custom domains, flexible pricing controls, add-on selling options and a dedicated reseller dashboard. Launch your own chatbot SaaS business without worrying about infrastructure or maintenance."
              />
              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                {[
                  { icon: Users, label: 'Dedicated reseller dashboard' },
                  { icon: ShieldCheck, label: 'Custom domain & SSL' },
                  { icon: BarChart3, label: 'Your pricing & margins' },
                  { icon: Zap, label: 'Sell add-ons and AI tokens' },
                ].map((f) => (
                  <div
                    key={f.label}
                    className="flex items-center gap-3 rounded-lg border border-navy-foreground/15 bg-navy-deep/40 p-4 text-sm font-bold text-white"
                  >
                    <f.icon className="h-5 w-5 text-primary" />
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/white-label"
                  className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white text-sm font-bold px-7 py-3.5 rounded-xl shadow-pink transition"
                >
                  <span>White-label Reseller</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Verified Customer Testimonials */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Customers"
              title="Teams that ship faster on Solvear"
            />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <figure key={i} className="rounded-2xl border border-border bg-card p-7 flex flex-col justify-between shadow-sm">
                  <blockquote className="text-sm leading-relaxed text-foreground/85 font-normal">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-4">
                    <p className="font-display text-sm font-bold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-semibold">{t.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* 8. CTA Band */}
        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  );
}
