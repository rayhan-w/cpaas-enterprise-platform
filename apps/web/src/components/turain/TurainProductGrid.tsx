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
} from 'lucide-react';
import {
  WhatsAppIcon,
} from '@/components/common/BrandIcons';

const PRODUCTS = [
  {
    icon: Smartphone,
    iconBg: 'bg-blue-100 text-blue-700',
    badge: 'DLT Approved • Tier-1 Telco',
    title: 'DLT-Compliant Bulk SMS Platform',
    desc: 'Run high-speed promotional and transactional SMS campaigns with automated DLT template matching, real-time DND scrubbing, and instant delivery receipts across Indian telco circles.',
    bullets: ['Transactional & OTP Routes (< 3s SLA)', 'Automated TRAI DLT Template Registration', 'Dynamic Variables {{1}}, {{2}}', 'High-throughput SMPP Gateway'],
  },
  {
    icon: WhatsAppIcon,
    iconBg: 'bg-emerald-100 text-emerald-700',
    badge: 'Official Meta Cloud API',
    title: 'WhatsApp Business API Platform',
    desc: 'Engage customers on WhatsApp with verified green-tick sender IDs, product catalogs, in-chat payments, automated abandoned cart recovery, and interactive WhatsApp Form Flows.',
    bullets: ['Embedded Meta Signup in 5 Minutes', 'In-Chat Product Catalog & Checkout', '1-Click COD Confirmation Buttons', 'Automated Cart Recovery Sequences'],
  },
  {
    icon: MessageSquare,
    iconBg: 'bg-indigo-100 text-indigo-700',
    badge: 'Next-Gen Rich Messaging',
    title: 'RCS Business Messaging',
    desc: 'Upgrade standard SMS to rich, branded, interactive mobile messages with verified business checkmarks, rich media carousels, suggested quick replies, and in-app action buttons.',
    bullets: ['Verified Brand Header & Logo', 'Interactive Multi-Card Carousels', 'Suggested Actions (Call, Map, URL)', 'No App Download Required for Users'],
  },
  {
    icon: PhoneCall,
    iconBg: 'bg-purple-100 text-purple-700',
    badge: 'Smart Cloud Telephony',
    title: 'Voice, IVR & Contact Center Solutions',
    desc: 'Automate customer support with intelligent multi-level Cloud IVR trees, automated voice broadcast alerts, virtual numbers, call recording, and smart agent routing.',
    bullets: ['Multi-Level Interactive Voice Response', 'Automated Outbound Voice Broadcasting', 'Smart Agent Skill-Based Routing', 'Call Recording & Analytics Dashboard'],
  },
  {
    icon: Workflow,
    iconBg: 'bg-amber-100 text-amber-700',
    badge: 'Visual No-Code Builder',
    title: 'SaaS Dashboards & Flow Automation',
    desc: 'Design advanced customer journey chatbots and multi-branch automation trees visually. Connect Google Sheets, webhooks, and team shared inboxes with zero coding.',
    bullets: ['Visual Drag & Drop Flow Canvas', '2-Way Google Sheets Automation', 'Shared Multi-Agent Team Inbox', 'Live Chat Real-Time Translator (100+ Langs)'],
  },
  {
    icon: Code2,
    iconBg: 'bg-cyan-100 text-cyan-700',
    badge: 'FastAPI + NestJS SDKs',
    title: 'High-Throughput Developer APIs',
    desc: 'Seamlessly integrate messaging into your web apps, CRMs, and backend services with robust REST APIs, SDKs (Node.js, Python, PHP), and Amazon SQS queue reliability.',
    bullets: ['cURL, TypeScript, Python & PHP SDKs', 'Zero-Loss Amazon SQS Orchestration', 'Sub-42ms Gateway Pipeline Latency', 'Instant Inbound & Outbound Webhooks'],
  },
];

export function TurainProductGrid() {
  return (
    <section id="products" className="py-20 md:py-28 relative bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-200 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-800 font-mono">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Full-Spectrum CPaaS Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore Our CPaaS Platform, Messaging APIs &amp; SaaS Solutions
          </h2>
          <p className="text-base text-slate-600">
            From bulk SMS and WhatsApp Business API to next-generation RCS and cloud telephony, Turain delivers enterprise-grade infrastructure built for Indian businesses.
          </p>
        </div>

        {/* 6 Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {PRODUCTS.map((prod, i) => {
            const Icon = prod.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 hover:shadow-xl hover:border-slate-300 transition flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-13 h-13 rounded-2xl p-3 flex items-center justify-center ${prod.iconBg} shadow-xs`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {prod.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition">
                    {prod.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{prod.desc}</p>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {prod.bullets.map((b, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href="#consultation"
                    className="text-xs font-bold text-blue-700 group-hover:text-blue-800 flex items-center space-x-1"
                  >
                    <span>Request Product Demo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                  <span className="text-[10px] font-mono text-slate-400">99.98% SLA</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
