'use client';

import React from 'react';
import {
  Sparkles,
  Workflow,
  ShoppingBag,
  Calendar,
  Languages,
  MessageSquare,
  Clock,
  Share2,
  GitBranch,
  CheckCircle2,
  Zap,
  Cpu,
  Coins,
} from 'lucide-react';
import {
  OpenAIIcon,
  GeminiIcon,
  WhatsAppIcon,
} from '@/components/common/BrandIcons';

const FEATURES_LIST = [
  {
    icon: OpenAIIcon,
    title: 'AI Bot Reply (OpenAI GPT-4o)',
    desc: 'Integrate cutting-edge OpenAI GPT-4o language intelligence for human-like conversational flows, dynamic FAQs, and multi-turn lead qualification.',
    badge: 'OpenAI GPT-4o',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    icon: GeminiIcon,
    title: 'Google Gemini Multimodal AI',
    desc: 'Leverage Google Gemini for multimodal reasoning, product visual recommendations, intelligent context summarization, and customer sentiment routing.',
    badge: 'Google Gemini',
    color: 'bg-blue-50 text-blue-800 border-blue-200',
  },
  {
    icon: Coins,
    title: 'Flexible AI Token System',
    desc: 'Pay only for the AI tokens you consume. Scale from thousands of queries to millions with transparent cost control and zero vendor lock-in.',
    badge: 'Pay As You Go',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  {
    icon: Workflow,
    title: 'Visual Drag & Drop Flow Builder',
    desc: 'Build sophisticated multi-branch bot conversations visually. Bird’s eye view of entire conversational trees with zero coding required.',
    badge: 'No Code Builder',
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
  },
  {
    icon: WhatsAppIcon,
    title: 'WhatsApp Catalog & In-Chat Commerce',
    desc: 'Showcase unlimited products with image carousels, prices, and descriptions. Allow customers to browse, add to cart, and checkout in-chat.',
    badge: 'In-Chat Commerce',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  {
    icon: Calendar,
    title: 'WhatsApp Flows & Appointments',
    desc: 'Interactive native forms built directly inside WhatsApp chats. Collect customer leads, book calendar meetings, and gather structured data effortlessly.',
    badge: 'Native Forms',
    color: 'bg-purple-50 text-purple-800 border-purple-200',
  },
  {
    icon: Languages,
    title: 'Live Chat Auto-Translator (100+ Langs)',
    desc: 'Communicate with global customers seamlessly. Real-time automatic two-way translation for 100+ languages inside the unified shared inbox.',
    badge: '100+ Languages',
    color: 'bg-cyan-50 text-cyan-800 border-cyan-200',
  },
  {
    icon: Clock,
    title: 'Automated Drip Sequences',
    desc: 'Nurture leads with automated timed message sequences after a conversation ends (minutes, hours, or days) to drive repeat conversions.',
    badge: 'Auto Nurture',
    color: 'bg-rose-50 text-rose-800 border-rose-200',
  },
  {
    icon: GitBranch,
    title: 'Bot Conditional Reply & Logic Rules',
    desc: 'Set intelligent if/else conditions based on customer tags, purchase history, cart value, or specific keywords for tailored responses.',
    badge: 'Logic Engine',
    color: 'bg-teal-50 text-teal-800 border-teal-200',
  },
];

export function FeaturesAiTokens() {
  return (
    <section id="features" className="py-20 md:py-28 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-200 px-4 py-1.5 rounded-full text-xs font-bold text-purple-800 font-mono">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Complete Feature Suite &amp; AI Engine</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Everything You Need to Automate &amp; Scale
          </h2>
          <p className="text-base text-slate-600">
            From drag-and-drop conversational builders to generative AI tokens and in-chat shopping carts, Solvear provides the complete toolkit.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES_LIST.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-3xl p-7 shadow-sm hover:shadow-md hover:border-slate-300 transition group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 group-hover:bg-blue-50 group-hover:border-blue-200 transition shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span
                      className={`text-xs font-bold font-mono px-3 py-1 rounded-full border ${feat.color}`}
                    >
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{feat.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition">
                  <span>Explore Feature</span>
                  <span className="ml-1.5">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
