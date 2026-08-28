'use client';

import React from 'react';
import {
  TrendingDown,
  Clock,
  Layers,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

const CHALLENGES = [
  {
    category: 'Deliverability',
    problem: 'Poor SMS Delivery and Visibility',
    problemDesc: 'Low delivery rates, carrier filtering, and lack of real-time visibility into whether critical OTPs and transactional notifications actually reached users.',
    solutionTitle: 'DLT-Ready Intelligent Routing',
    solutionDesc: 'Improve delivery with automated DLT template matching, multi-telco SMPP failover, and millisecond-level delivery receipts for OTPs and critical alerts.',
    color: 'text-amber-700 bg-amber-50 border-amber-200',
    stat: '99.98% OTP SLA',
  },
  {
    category: 'Direct Reach',
    problem: 'No Reliable Owned Channel for Reach',
    problemDesc: 'Email open rates have plummeted below 15%, while SMS lacks rich media, catalogs, and two-way conversational support capabilities.',
    solutionTitle: 'WhatsApp Business API & RCS Messaging',
    solutionDesc: 'Engage customers on channels they use all day with 84%+ read rates. Send interactive product catalogs, 1-click COD confirmation, and automated AI replies.',
    color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    stat: '84%+ Open Rate',
  },
  {
    category: 'Integration Friction',
    problem: 'Slow Onboarding and Integration Delays',
    problemDesc: 'Legacy CPaaS providers take weeks to approve sender IDs, lack modern documentation, and provide clunky SOAP/legacy XML interfaces.',
    solutionTitle: 'Instant REST APIs, SDKs & Webhooks',
    solutionDesc: 'Launch in minutes with modern JSON REST APIs, native SDKs (Node.js, Python, PHP), Zapier webhooks, and pre-built Shopify & WooCommerce plugins.',
    color: 'text-blue-700 bg-blue-50 border-blue-200',
    stat: '< 15min Setup',
  },
  {
    category: 'Vendor Sprawl',
    problem: 'Too Many Tools, Vendors and Dashboards',
    problemDesc: 'Managing SMS with one vendor, WhatsApp with another, and IVR with a third leads to fragmented customer data, inflated costs, and zero cross-channel context.',
    solutionTitle: 'Unified Omnichannel CPaaS Dashboard',
    solutionDesc: 'Consolidate Bulk SMS, WhatsApp, RCS, Voice IVR, and AI tokens into one central portal with unified billing, shared inboxes, and centralized contact management.',
    color: 'text-purple-700 bg-purple-50 border-purple-200',
    stat: '1 Unified Platform',
  },
];

export function TurainChallenges() {
  return (
    <section className="py-20 md:py-28 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold text-blue-800 font-mono">
            <HelpCircle className="w-4 h-4 text-blue-600" />
            <span>Problem to Performance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Common Customer Communication Challenges We Help Solve
          </h2>
          <p className="text-base text-slate-600">
            Turain solves telecom complexities, regulatory friction, and fragmented vendors so your business can deliver messages reliably and scale customer conversations.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {CHALLENGES.map((item, i) => (
            <div
              key={i}
              className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6 hover:shadow-lg hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${item.color}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-full shadow-xs">
                    {item.stat}
                  </span>
                </div>

                {/* Problem */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider">The Bottleneck:</div>
                  <h3 className="text-xl font-extrabold text-slate-900">{item.problem}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{item.problemDesc}</p>
                </div>

                {/* Solution */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
                  <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Turain Solution: {item.solutionTitle}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{item.solutionDesc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
