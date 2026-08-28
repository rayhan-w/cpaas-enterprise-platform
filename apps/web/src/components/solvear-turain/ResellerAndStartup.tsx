'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  DollarSign,
  Palette,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Award,
  Coins,
  CheckCircle2,
} from 'lucide-react';

export function SolvearTurainReseller() {
  return (
    <section id="reseller" className="py-20 md:py-28 relative bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-bold text-purple-800 font-mono">
            <Globe className="w-4 h-4 text-purple-600" />
            <span>White-Label &amp; Partner Programs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Build Your Own Brand with Solvear Reseller Solution
          </h2>
          <p className="text-base text-slate-600">
            Rebrand the entire platform as your own with custom domains, flexible pricing controls, and a dedicated multi-tenant reseller dashboard — without worrying about server maintenance.
          </p>
        </div>

        {/* 4 Feature Columns Grid (Turain Design System) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <div className="bg-white border border-slate-200 rounded-3xl p-7 space-y-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Custom Domain (CNAME)</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Map your own domain (e.g. <code>app.youragency.com</code>) with automated SSL certificates. Zero mention of Solvear anywhere.
              </p>
            </div>
            <div className="text-[11px] font-mono text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
              ✓ 100% Unbranded White-Label
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-7 space-y-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Custom Logo &amp; Themes</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Upload your company logo, favicon, color palette accents, and custom welcome emails for your agency clients.
              </p>
            </div>
            <div className="text-[11px] font-mono text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              ✓ Full CSS &amp; Brand Control
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-7 space-y-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Custom Pricing &amp; Billing</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Create your own subscription packages, connect your Stripe/Razorpay accounts, and collect 100% client payments directly.
              </p>
            </div>
            <div className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ✓ Keep 100% Retail Margins
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-7 space-y-3.5 shadow-sm hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Multi-Tenant Admin Console</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Manage all client sub-accounts, allocate message quotas, configure AI tokens, and audit usage from one centralized dashboard.
              </p>
            </div>
            <div className="text-[11px] font-mono text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              ✓ PostgreSQL Tenant Isolation
            </div>
          </div>
        </div>

        {/* 2 Partner Cards: Affiliate & AI Startup Program (Solvear Signature) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Affiliate Program */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-start space-x-5 shadow-sm hover:shadow-md transition">
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-slate-900">Affiliate Partner Program</h3>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Recurring Commissions
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Join the Solvear Affiliate Program and earn recurring monthly commissions. Maximize your passive income potential by recommending our trusted platform.
              </p>
            </div>
          </div>

          {/* AI Startup Program */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-start space-x-5 shadow-sm hover:shadow-md transition">
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-700 shrink-0">
              <Coins className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-slate-900">Solvear AI Startup Program</h3>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  Free AI Tokens
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Get started with Solvear special startup offer and claim your free AI tokens. Unlock chatbot automation, marketing tools, and AI-powered solutions to grow your business.
              </p>
            </div>
          </div>
        </div>

        {/* Agency CTA banner (Turain High-Impact Gradient) */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold">Ready to Launch Your Chatbot SaaS Agency?</h3>
            <p className="text-xs sm:text-sm text-blue-100">
              Get access to white-label reseller licenses, client management, and dedicated onboarding support.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold px-6 py-3.5 rounded-xl shadow-md transition shrink-0"
          >
            <span>Launch Reseller Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
