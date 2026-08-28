'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  ShieldCheck,
  Cpu,
  Rocket,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Workflow,
} from 'lucide-react';

const STEPS = [
  {
    stepNum: '01',
    icon: Compass,
    title: 'We Understand Your Use Case',
    desc: 'We begin by analyzing your communication goals, audience touchpoints, and volume requirements to design the optimal omnichannel customer journey.',
    bullets: ['Goal & Volume Analysis', 'Channel Mix Strategy', 'ROI & Cost Estimation'],
    color: 'text-blue-700 bg-blue-50 border-blue-200',
  },
  {
    stepNum: '02',
    icon: ShieldCheck,
    title: 'We Plan Channels & Compliance',
    desc: 'We handle TRAI DLT registration, 6-character sender ID approvals, Meta WhatsApp Business verification, and template approvals without regulatory friction.',
    bullets: ['TRAI DLT Entity & Header Registration', 'Meta Green-Tick Onboarding', 'DLT Content Template Approval'],
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  },
  {
    stepNum: '03',
    icon: Cpu,
    title: 'We Configure Platform & APIs',
    desc: 'Our engineers configure your multi-tenant dashboard, provision REST APIs, set up webhooks, and connect Shopify, WooCommerce, or your proprietary CRM.',
    bullets: ['REST API & Webhook Provisioning', 'Shopify / WooCommerce 1-Click Sync', 'Amazon SQS Queue Orchestration'],
    color: 'text-indigo-700 bg-indigo-50 border-indigo-200',
  },
  {
    stepNum: '04',
    icon: Rocket,
    title: 'We Launch Journeys & Reporting',
    desc: 'We assist your team during go-live with transactional alerts, broadcast campaigns, and automated bot flows with millisecond delivery tracking.',
    bullets: ['Go-Live Campaign Supervision', 'Live Delivery Telemetry Receipts', 'Automated Bot Drip Sequences'],
    color: 'text-purple-700 bg-purple-50 border-purple-200',
  },
  {
    stepNum: '05',
    icon: TrendingUp,
    title: 'We Optimize & Scale',
    desc: 'Continuous carrier latency monitoring, multi-telco failover routing, A/B message testing, and AI token optimizations ensure you scale seamlessly.',
    bullets: ['Carrier Latency & Failover Tuning', 'A/B Conversion Rate Optimization', '24/7 Dedicated Priority Support'],
    color: 'text-amber-700 bg-amber-50 border-amber-200',
  },
];

export function TurainFiveSteps() {
  return (
    <section id="steps" className="py-20 md:py-28 relative bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold text-blue-800 font-mono">
            <Workflow className="w-4 h-4 text-blue-600" />
            <span>Turnkey Onboarding Framework</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Launch Your Customer Engagement Platform in 5 Steps
          </h2>
          <p className="text-base text-slate-600">
            From discovery to go-live, we help you configure channels, approvals, integrations, automation, and reporting without operational bottlenecks.
          </p>
        </div>

        {/* 5 Steps Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5 mb-14">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-lg hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold font-mono text-blue-600">
                      {step.stepNum}
                    </span>
                    <div className={`p-2.5 rounded-xl border ${step.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{step.desc}</p>
                </div>

                <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-700 font-medium">
                  {step.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Fast-Track Banner */}
        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-extrabold text-slate-900">
              Need Express Onboarding for an Urgent Campaign?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              Our enterprise onboarding team can fast-track your TRAI DLT verification and Meta approvals within 24–48 hours.
            </p>
          </div>

          <Link
            href="#consultation"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3.5 rounded-xl shadow-md transition shrink-0"
          >
            <span>Fast-Track My Onboarding</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
