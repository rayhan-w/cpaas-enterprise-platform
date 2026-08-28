import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Inbox,
  ListOrdered,
  MessageCircle,
  Send,
  ShoppingCart,
  Sparkles,
  Instagram,
  Facebook,
  Globe,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import { ChannelLogo } from "@/components/site/ChannelLogo";
import { CHANNELS } from "@/lib/channels";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import platformImg from "@/assets/platform.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Solvear — Turn WhatsApp Into Your #1 Sales Channel" },
      {
        name: "description",
        content:
          "Chat, sell and scale with AI across WhatsApp, Messenger, Instagram, Telegram and Webchat. Broadcasts, commerce, shared inbox and white-label reseller tools.",
      },
      { property: "og:title", content: "Solvear — Turn WhatsApp Into Your #1 Sales Channel" },
      {
        property: "og:description",
        content:
          "One platform for WhatsApp Business API, bulk SMS, chatbots, shared inbox and AI automation.",
      },
    ],
  }),
  component: Home,
});




const CAPABILITIES = [
  { icon: Zap, title: "Broadcasting — 80%+ Open Rates", copy: "Personalized bulk broadcasts for offers, product updates, newsletters, event invites and alerts." },
  { icon: Bot, title: "Drag & Drop Chatbot Builder", copy: "Build multi-step flows with conditions, inputs and HTTP API calls — no code required." },
  { icon: Inbox, title: "Omni-Channel Shared Inbox", copy: "WhatsApp, Messenger, Instagram, Telegram and WebChat in one dashboard — plus Android, iOS and desktop apps." },
  { icon: Sparkles, title: "AI Assistant (OpenAI & Gemini)", copy: "Train AI on your FAQs, documents and website for human-like, intent-aware replies." },
  { icon: ListOrdered, title: "Sequence (Drip) Messaging", copy: "Time-based message sequences for onboarding, promotions, reminders and re-engagement." },
  { icon: ShoppingCart, title: "Shopify & WooCommerce Automation", copy: "Order notifications, COD confirmation and abandoned cart recovery over WhatsApp." },
];

const STATS = [
  { value: "310K+", label: "Users on the platform" },
  { value: "80%+", label: "Broadcast open rates" },
  { value: "5", label: "Channels in one inbox" },
  { value: "50+", label: "Built-in integrations" },
];

const BADGES = ["OpenAI & Gemini Powered", "WhatsApp Business API", "White-Label Ready", "No-Code Builder", "310K+ Users"];

const TESTIMONIALS = [
  {
    quote:
      "The Solvear API has completely transformed the way we handle complex problem-solving tasks. Integration was smooth, and the documentation made it super easy to get started. Our workflows are now faster and more accurate!",
    name: "Verified Customer",
    role: "Solvear API user",
  },
  {
    quote:
      "I love how scalable the Solvear API is. Whether handling small or large datasets, it performs flawlessly. The support team is also incredibly responsive whenever I have questions.",
    name: "Verified Customer",
    role: "Solvear API user",
  },
  {
    quote:
      "Solvear API is a game-changer for developers. The powerful features and easy-to-use endpoints saved us weeks of development time. Highly recommend for anyone looking to enhance their applications.",
    name: "Verified Customer",
    role: "Solvear API user",
  },
];

function Home() {
  return (
    <>
      <section className="relative isolate min-h-[620px] overflow-hidden bg-navy-deep text-navy-foreground">
        <img
          src={heroImg}
          alt="Business professional messaging customers on a smartphone outside a modern office"
          width={1920}
          height={1088}
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
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.1] md:text-6xl">
            Turn WhatsApp Into Your #1 Sales Channel
          </h1>
          <p className="mt-6 max-w-2xl text-base text-navy-foreground/80 md:text-lg">
            Chat, sell and scale with AI across WhatsApp, Messenger, Instagram, Telegram and
            Webchat — broadcasts, commerce, shared inbox and AI tokens in one platform built for
            businesses, agencies and resellers.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg" className="shadow-pink">
              <Link to="/contact">Request a Demo</Link>
            </Button>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 text-sm font-semibold text-navy-foreground"
            >
              Explore Products
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary transition-transform group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4 text-primary-foreground" aria-hidden />
              </span>
            </Link>
          </div>

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-xs font-semibold uppercase tracking-[0.14em] text-navy-foreground/60">
            {BADGES.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

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
                to="/channels/$slug"
                params={{ slug: c.slug }}
                className="group rounded-xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elevated"
              >
                <ChannelLogo name={c.name} domain={c.domain} icon={c.icon} />
                <h3 className="mt-5 font-display text-lg font-bold">{c.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.copy}</p>
                <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                  Learn more <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
                </span>
              </Link>
            ))}

          </div>
        </div>
      </section>

      <section className="bg-surface section-y">
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
                "WhatsApp, Messenger, Instagram, Telegram and WebChat in one Shared Inbox",
                "Powered by OpenAI and Gemini with flexible AI Tokens",
                "White-label reseller solution with custom domains and pricing controls",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="mt-8">
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
          <img
            src={aboutImg}
            alt="Solvear team collaborating around laptops in an office"
            loading="lazy"
            width={1200}
            height={900}
            className="rounded-2xl shadow-elevated"
          />
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Platform"
            title="Automation that does the selling for you"
            description="From the first message to repeat orders, Solvear automates the busywork and keeps humans in the loop where it matters."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((c) => (
              <article key={c.title} className="rounded-xl border border-border bg-card p-7">
                <c.icon className="h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-5 font-display text-lg font-bold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.copy}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link to="/features">See all features</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-navy text-navy-foreground section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <img
            src={platformImg}
            alt="Solvear analytics dashboard on a laptop showing campaign performance"
            loading="lazy"
            width={1200}
            height={900}
            className="order-2 rounded-2xl shadow-elevated lg:order-1"
          />
          <div className="order-1 lg:order-2">
            <SectionHeading
              align="left"
              inverted
              eyebrow="White-label"
              title="Build your own brand with Solvear's white-label solution"
              description="Rebrand the entire platform as your own — custom domains, flexible pricing controls, add-on selling options and a dedicated reseller dashboard. Launch your own chatbot SaaS business without worrying about infrastructure or maintenance."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, label: "Dedicated reseller dashboard" },
                { icon: ShieldCheck, label: "Custom domain & SSL" },
                { icon: BarChart3, label: "Your pricing & margins" },
                { icon: Zap, label: "Sell add-ons and AI tokens" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-lg border border-navy-foreground/15 bg-navy-deep/40 p-4 text-sm"
                >
                  <f.icon className="h-5 w-5 text-primary" aria-hidden />
                  {f.label}
                </div>
              ))}
            </div>
            <Button asChild className="mt-8 shadow-pink">
              <Link to="/white-label">White-label Reseller</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Customers"
            title="Teams that ship faster on Solvear"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure key={t.name} className="rounded-xl border border-border bg-card p-7">
                <blockquote className="text-sm leading-relaxed text-foreground/85">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="font-display text-sm font-bold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
