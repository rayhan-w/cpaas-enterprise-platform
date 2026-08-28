'use client';

import React from 'react';
import Link from 'next/link';
import {
  Users,
  ShieldCheck,
  BarChart3,
  Zap,
  Globe,
  DollarSign,
  Palette,
  Server,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { SolvearTurainNavbar } from '@/components/solvear-turain/Navbar';
import { SolvearTurainFooter } from '@/components/solvear-turain/Footer';

const RESELLER_BENEFITS = [
  {
    icon: Globe,
    title: 'Custom CNAME Domain & Auto SSL',
    copy: 'Host on your own custom domain (e.g. app.youragency.com) with automatic wildcard SSL certificates generated on the fly.',
  },
  {
    icon: Palette,
    title: '100% Rebrandable UI & Themes',
    copy: 'Upload your company logo, set your primary brand colors, and replace all Solvear references for a seamless client experience.',
  },
  {
    icon: DollarSign,
    title: 'Custom Pricing Plans & Margins',
    copy: 'Create bespoke subscription packages, set your own per-message rates, and keep 100% of the profits from your clients.',
  },
  {
    icon: Zap,
    title: 'Sell Add-ons & AI Tokens',
    copy: 'Monetize extra AI tokens, WhatsApp message credits, team member seats, and premium integrations directly to your customers.',
  },
  {
    icon: Users,
    title: 'Multi-Tenant Admin Dashboard',
    copy: 'Manage all your client sub-accounts, monitor message delivery telemetry, allocate quotas, and suspend or activate tenants in 1 click.',
  },
  {
    icon: Server,
    title: 'Zero Infrastructure Maintenance',
    copy: 'We handle server clustering, HAProxy load balancing, Meta Cloud API upgrades, and TRAI DLT compliance updates 24/7.',
  },
];

export default function WhiteLabelPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <SolvearTurainNavbar />

      <main className="flex-1 pt-36 pb-24">
        {/* Page Hero */}
        <section className="bg-mesh-pattern border-b border-slate-200 py-16 md:py-24 text-center px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-purple-800 font-mono">
              <span>White-Label Partner Program</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
              Build Your Own Chatbot SaaS Brand
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Rebrand the entire Solvear platform as your own — custom domains, flexible pricing controls, add-on selling options, and a dedicated multi-tenant reseller console.
            </p>
            <div className="pt-4 flex justify-center">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-base px-8 py-4 rounded-2xl shadow-lg shadow-purple-600/25 transition"
              >
                <span>Launch Your Reseller Agency</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6 Benefits Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {RESELLER_BENEFITS.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-3xl p-8 space-y-4 hover:shadow-xl hover:border-slate-300 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 leading-snug">{b.title}</h2>
                    <p className="text-base text-slate-600 leading-relaxed font-normal">{b.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Reseller Showcase */}
        <section className="bg-slate-900 text-white py-20 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-purple-900/60 border border-purple-700 px-4 py-1.5 rounded-full text-xs font-bold text-purple-300 font-mono">
                <span>100% Margin Retention</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                Keep 100% of What You Charge Your Clients
              </h2>
              <p className="text-base text-slate-300 leading-relaxed font-normal">
                Unlike other platforms that take a cut of your revenue, Solvear operates on a predictable wholesale model. You set the retail pricing, charge your clients directly through Stripe or Razorpay, and keep all the profits.
              </p>
              <div className="space-y-3 text-sm text-slate-200 font-semibold">
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Unlimited client sub-accounts under your master console</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Automated PDF invoice branding with your agency details</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Dedicated priority Slack &amp; WhatsApp support channel</span>
                </div>
              </div>
            </div>
            <img
              src="/assets/platform.jpg"
              alt="Solvear reseller console"
              className="rounded-3xl border border-slate-800 shadow-2xl w-full object-cover"
            />
          </div>
        </section>
      </main>

      <SolvearTurainFooter />
    </div>
  );
}
