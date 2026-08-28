'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PageHero } from '@/components/site/PageHero';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CtaBand } from '@/components/site/CtaBand';
import { ChannelLogo } from '@/components/site/ChannelLogo';
import { Check, ArrowRight, Bot, Zap, ShieldCheck } from 'lucide-react';

const CHANNELS_DATA: Record<
  string,
  {
    name: string;
    heroDesc: string;
    features: { title: string; desc: string }[];
    benefits: string[];
  }
> = {
  whatsapp: {
    name: 'WhatsApp Business Cloud API',
    heroDesc:
      'Official Meta Cloud API. Run rich interactive broadcasts, product catalogs, 1-click COD confirmation and automated customer care with 80%+ open rates.',
    features: [
      {
        title: 'Meta Verified Cloud API',
        desc: 'Direct Meta infrastructure with green tick badge support and zero third-party phone disconnection risk.',
      },
      {
        title: 'Interactive Catalog & Cart',
        desc: 'Send multi-product catalogs, collect cart orders directly in WhatsApp, and generate instant payment links.',
      },
      {
        title: 'TRAI DLT Template Engine',
        desc: 'Full compliance with Indian telecom DLT requirements and dynamic {{1}} variable scrubbing.',
      },
    ],
    benefits: [
      '80%+ average message open rate within 5 minutes',
      'Automated abandoned cart recovery for Shopify & WooCommerce',
      'Unified multi-agent customer support inbox',
    ],
  },
  instagram: {
    name: 'Instagram DM Automation',
    heroDesc:
      'Convert story mentions, post comments and DMs into high-intent qualified leads and eCommerce checkouts with AI bots.',
    features: [
      {
        title: 'Comment-to-DM Trigger',
        desc: 'Automatically reply to post comments and send an instant private DM with your product link or discount code.',
      },
      {
        title: 'Story Mention Auto-Reply',
        desc: 'Send instant thank-you messages and exclusive promo vouchers whenever a customer tags your brand.',
      },
      {
        title: 'Lead Qualification Bot',
        desc: 'Qualify customer budget, requirements, and phone number before handing off to human sales reps.',
      },
    ],
    benefits: [
      '3x faster lead response times on social campaigns',
      'Boost Instagram post engagement by 200%',
      'Direct sync with your CRM and Google Sheets',
    ],
  },
  messenger: {
    name: 'Facebook Messenger Bot',
    heroDesc:
      'Automate Click-to-WhatsApp and Facebook ad conversations with intelligent bot workflows and instant FAQs.',
    features: [
      {
        title: 'Click-to-Messenger Ad Sync',
        desc: 'Instant welcome sequence for every user who clicks your Facebook or Instagram ad campaigns.',
      },
      {
        title: 'Persistent Menu & Quick Replies',
        desc: 'Guide customers through guided menus, order tracking, and product catalogs with zero typing required.',
      },
      {
        title: '24/7 AI FAQ Assistant',
        desc: 'Answer return policies, shipping times, and pricing questions instantly using OpenAI & Gemini.',
      },
    ],
    benefits: [
      'Reduce customer support ticket load by up to 65%',
      'Lower Facebook Ad cost-per-lead (CPL)',
      'Seamless human agent handoff in shared inbox',
    ],
  },
  telegram: {
    name: 'Telegram Bot & Channel Broadcasts',
    heroDesc:
      'Broadcast news, deliver digital products, and manage high-volume customer communities with fast Telegram bots.',
    features: [
      {
        title: 'High-Volume Channel Broadcasts',
        desc: 'Broadcast text, HD video, PDFs, and rich media to unlimited subscribers without carrier limits.',
      },
      {
        title: 'Interactive Inline Keyboards',
        desc: 'Create fast interactive menus with dynamic button callbacks and checkout actions.',
      },
      {
        title: 'Custom Bot Commands',
        desc: 'Custom /start, /help, and /track commands mapped directly into your Solvear webhook flows.',
      },
    ],
    benefits: [
      'Zero message dispatch fees for Telegram channels',
      'Support large files up to 2GB',
      'Instant real-time webhook callbacks',
    ],
  },
  webchat: {
    name: 'Website Live Chat & Lead Capture Widget',
    heroDesc:
      'Turn website visitors into conversations with a lightweight, customizable chat widget that routes directly to your team.',
    features: [
      {
        title: 'Omnichannel Chat Widget',
        desc: 'Visitors can chat directly on your website or transition seamlessly to WhatsApp with 1 click.',
      },
      {
        title: 'Proactive Lead Trigger',
        desc: 'Pop up timed contextual offers when visitors spend more than 30 seconds on pricing or product pages.',
      },
      {
        title: 'Full Brand Customization',
        desc: 'Customize colors, logos, avatar, welcome greetings, and operating hours to match your brand.',
      },
    ],
    benefits: [
      'Increase website lead conversion rate by up to 45%',
      'Unified with WhatsApp & Instagram inbox',
      'Zero impact on website page load speed (<12KB)',
    ],
  },
};

export default function ChannelPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'whatsapp';
  const data = CHANNELS_DATA[slug] || CHANNELS_DATA['whatsapp'];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Channel Spotlight"
          title={data.name}
          description={data.heroDesc}
        />

        {/* Features Grid */}
        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6">
            <SectionHeading
              eyebrow="Capabilities"
              title={`Why businesses choose Solvear for ${data.name.split(' ')[0]}`}
              description="Enterprise-grade reliability, real-time message dispatch, and deep automation triggers."
            />

            <div className="mt-14 grid gap-8 md:grid-cols-3">
              {data.features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-border bg-card p-8 space-y-4 shadow-sm hover:shadow-elevated transition">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-normal">{f.desc}</p>
                </div>
              ))}
            </div>

            {/* Benefits box */}
            <div className="mt-16 rounded-3xl bg-navy-deep text-navy-foreground p-8 md:p-12 border border-navy-soft">
              <div className="grid gap-8 lg:grid-cols-2 items-center">
                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    Proven Results
                  </p>
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-white">
                    Deliver the right message at the right moment
                  </h3>
                  <p className="text-sm text-navy-foreground/75 leading-relaxed">
                    Solvear handles billions of API requests per month with sub-42ms latency, automated retry queues, and 99.99% uptime SLA.
                  </p>
                </div>
                <ul className="space-y-3.5">
                  {data.benefits.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-sm font-semibold text-white">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  );
}
