'use client';

import React from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PageHero } from '@/components/site/PageHero';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CtaBand } from '@/components/site/CtaBand';
import { ShieldCheck, Users, Globe, Zap, Target, HeartHandshake } from 'lucide-react';

const VALUES = [
  {
    icon: Target,
    title: 'Customer-First Engineering',
    desc: 'We build features that directly drive revenue, reduce support friction, and improve conversation conversion for our merchants.',
  },
  {
    icon: Zap,
    title: 'Sub-42ms Execution Speed',
    desc: 'Our modular monolith and queuing infrastructure ensure your WhatsApp alerts and bot replies reach users instantly.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security & Compliance',
    desc: 'Strict adherence to Meta Cloud API policies, TRAI DLT guidelines, data encryption at rest, and GDPR privacy safeguards.',
  },
  {
    icon: HeartHandshake,
    title: 'Agency Empowerment',
    desc: 'We treat our white-label agency partners as long-term allies, offering 100% margin freedom, custom branding, and 24/7 dedicated support.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Our Story &amp; Mission"
          title="Empowering 310,000+ Businesses with Intelligent Conversations"
          description="Solvear was built with a single goal: help businesses and agencies turn conversational messaging channels into high-converting revenue drivers."
        />

        {/* Story Section */}
        <section className="section-y">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
            <img
              src="/assets/about.jpg"
              alt="Solvear engineering and product team"
              className="rounded-3xl shadow-elevated border border-border w-full object-cover"
            />
            <div className="space-y-6">
              <SectionHeading
                align="left"
                eyebrow="Who We Are"
                title="The CPaaS platform built for modern commerce &amp; agencies"
                description="Traditional customer communication is broken: emails get lost in spam folders with sub-15% open rates, and SMS lacks interactivity. Solvear bridges this gap by turning WhatsApp, Instagram, Telegram, and Messenger into conversational commerce channels with 80%+ open rates."
              />
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Whether you are an eCommerce store wanting to recover abandoned carts and confirm COD orders, or an agency launching a branded chatbot SaaS for clients, Solvear provides the infrastructure, AI engines, and unified inbox you need to succeed.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center px-7 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-pink hover:bg-primary-hover transition"
                >
                  Join Our Journey
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center px-7 py-3.5 rounded-xl border border-border bg-white font-bold text-sm text-foreground hover:bg-slate-50 transition"
                >
                  Explore Products
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="bg-surface section-y border-y border-border">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Our Core Values"
              title="What drives our product and engineering"
              description="Reliability, transparency, and relentless focus on customer growth."
            />
            <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div key={v.title} className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary">
                    <v.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">{v.desc}</p>
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
