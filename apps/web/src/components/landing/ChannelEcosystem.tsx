'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Globe,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Bot,
  Users,
  Shield,
  Layers,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';

const CHANNELS_DATA = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Cloud API',
    tagline: 'Official Meta WhatsApp Business Gateway',
    icon: WhatsAppIcon,
    badge: '84%+ Open Rate',
    description: 'Direct Meta Cloud API connection for verified high-throughput broadcasting, interactive catalog commerce, WhatsApp Flow forms, and automated order confirmations.',
    capabilities: [
      'Official Meta Embedded Signup (5-minute setup)',
      'Rich WhatsApp Product Catalogs with in-chat ordering',
      'Native WhatsApp Form Flows for appointments & surveys',
      'TRAI DLT Template Registration & dynamic {{variables}}',
      'Cash on Delivery (COD) verification & Cart Recovery',
    ],
    stats: { primary: '84.2%', label: 'Average Read Rate' },
  },
  {
    id: 'instagram',
    name: 'Instagram DM Automation',
    tagline: 'Turn Comments & Stories into Instant Sales Funnels',
    icon: InstagramIcon,
    badge: 'Instant DM Funnel',
    description: 'Automatically convert Instagram post comments, Reels engagement, and Story mentions into direct message conversations that close sales while you sleep.',
    capabilities: [
      'Keyword comment auto-response with instant DM dispatch',
      'Story Mention Auto-Thank You & Coupon incentive',
      'Visual Carousel Product Showcase inside DM',
      'Direct checkout links with affiliate and coupon tracking',
      'AI Lead Qualification before human agent takeover',
    ],
    stats: { primary: '4.8x', label: 'More Leads Generated' },
  },
  {
    id: 'telegram',
    name: 'Telegram Bot Engine',
    tagline: 'Zero-Cost Unlimited Broadcasting & Community Automation',
    icon: TelegramIcon,
    badge: 'Unlimited Broadcasts',
    description: 'Leverage Telegram’s restriction-free messaging infrastructure for large communities, crypto alerts, trading signals, and automated customer drip campaigns.',
    capabilities: [
      '100% Free broadcast messages with no conversation fees',
      'Auto-joining & VIP subscriber group management',
      'Automated drip sequences and schedule timers',
      'Rich inline keyboard buttons and custom commands',
      'Webhook listener for CRM and database sync',
    ],
    stats: { primary: '100%', label: 'Free Message Delivery' },
  },
  {
    id: 'facebook',
    name: 'Facebook Messenger',
    tagline: 'Page Comment Auto-Reply & Messenger AI Bot',
    icon: FacebookIcon,
    badge: '24/7 Lead Machine',
    description: 'Engage Facebook page visitors instantly. Trigger automated conversational bots, answer customer queries, and route qualified leads directly to your sales team.',
    capabilities: [
      'Post comment auto-reply + private inbox message',
      'Click-to-Messenger Ad optimization (CTM Ads)',
      'Persistent menu with quick-action shortcuts',
      'Live chat agent assignment and ticket tagging',
      'Automated FAQ resolution via OpenAI & Gemini',
    ],
    stats: { primary: '< 2s', label: 'Average Response Time' },
  },
  {
    id: 'webchat',
    name: 'Website Live Chat & Shared Inbox',
    tagline: 'Unified Multi-Agent Inbox with Live Auto-Translator',
    icon: Globe,
    badge: 'Unified Inbox',
    description: 'Embed a lightweight, beautiful live chat widget on your web apps and manage incoming tickets from all 5 channels in one centralized team dashboard.',
    capabilities: [
      'Single shared team inbox for WhatsApp, IG, FB, Telegram & Web',
      'Real-time live chat translation across 100+ languages',
      'Agent permission levels, team assignment, and audit logs',
      'Canned responses and macro shortcut automations',
      'WebSockets live synchronization with zero page reload',
    ],
    stats: { primary: '1 Inbox', label: 'All 5 Channels Unified' },
  },
];

export function ChannelEcosystem() {
  const [activeChannelId, setActiveChannelId] = useState<string>('whatsapp');
  const activeChannel = CHANNELS_DATA.find((c) => c.id === activeChannelId) || CHANNELS_DATA[0];
  const ActiveIcon = activeChannel.icon;

  return (
    <section id="channels" className="py-20 md:py-28 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 font-mono">
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>Omnichannel Messaging Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Connect Every Customer Touchpoint in One Place
          </h2>
          <p className="text-base text-slate-600">
            Reach your customers on their favorite messaging channels with automated AI dialogues, transactional alerts, and in-chat shopping.
          </p>
        </div>

        {/* Channel Navigation Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {CHANNELS_DATA.map((ch) => {
            const isActive = activeChannelId === ch.id;
            const Icon = ch.icon;
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannelId(ch.id)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all flex items-center space-x-3 border ${
                  isActive
                    ? 'bg-white border-blue-600 text-blue-950 shadow-md scale-105 ring-2 ring-blue-600/20'
                    : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{ch.name}</span>
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ch.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Channel Feature Showcase Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Details (Left 7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                    <ActiveIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-blue-700">
                      {activeChannel.tagline}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{activeChannel.name}</h3>
                  </div>
                </div>

                <p className="text-base text-slate-600 leading-relaxed">{activeChannel.description}</p>
              </div>

              {/* Capabilities checklist */}
              <div className="space-y-3 pt-2">
                <div className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Key Built-in Capabilities:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeChannel.capabilities.map((cap, i) => (
                    <div key={i} className="flex items-start space-x-2.5 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Metric Callout (Right 5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-6 text-center flex flex-col justify-between h-full">
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channel Benchmark</div>
                <div className="text-5xl font-extrabold text-slate-900 font-mono">
                  {activeChannel.stats.primary}
                </div>
                <div className="text-sm text-slate-600 font-semibold">{activeChannel.stats.label}</div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 text-left space-y-2.5 shadow-xs">
                <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <span>Carrier &amp; Meta Compliance</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Automatic opt-out management, DLT scrub checks, and Meta 24-hour customer service window protection built directly into the NestJS orchestration engine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
