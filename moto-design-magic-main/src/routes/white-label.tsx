import { createFileRoute, Link } from "@tanstack/react-router";
import {
  TrendingUp,
  Code,
  Palette,
  FileText,
  Sparkles,
  Globe,
  Wallet,
  LayoutDashboard,
  PlugZap,
  Headset,
  CheckCircle2,
  Phone,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/white-label")({
  head: () => ({
    meta: [
      { title: "Digital Services & SaaS Solutions — SOLVEAR ADVERTISING" },
      {
        name: "description",
        content:
          "Digital Marketing (SEO, PPC, SMM, Video), SaaS Development, UI/UX Design, Content Marketing, Graphics Design and White-label Reseller Platform.",
      },
      { property: "og:title", content: "Solvear Services & SaaS Solutions" },
      {
        property: "og:description",
        content: "High-performance digital marketing, bespoke custom software development and white-label CPaaS reseller infrastructure.",
      },
    ],
  }),
  component: WhiteLabel,
});

const SERVICES = [
  {
    id: "digital-marketing",
    icon: TrendingUp,
    title: "Digital Marketing",
    subtitle: "Grow Your Brand Online",
    desc: "Data-backed performance marketing campaigns designed to generate high-intent customer inquiries and revenue.",
    deliverables: [
      "Search Engine Optimization (SEO) & Google Ranking",
      "Social Media Marketing (SMM) across Meta, LinkedIn & Instagram",
      "Google Paid Search (PPC) & High-ROI Display Campaigns",
      "YouTube Video Marketing & Influencer Campaign Outreach",
    ],
  },
  {
    id: "saas",
    icon: Code,
    title: "SaaS & Custom Software Development",
    subtitle: "Software as a Service",
    desc: "Bespoke web applications, high-throughput cloud portals, and mobile apps built with modern React, Next.js, Node and microservices.",
    deliverables: [
      "Custom Enterprise Web Development & Portals",
      "iOS and Android Native / Flutter Mobile App Development",
      "Progressive Web Apps (PWA) with Offline Sync",
      "Custom CRM, ERP, and API Integration Middleware",
    ],
  },
  {
    id: "ui-ux",
    icon: Palette,
    title: "UI/UX Design",
    subtitle: "Intuitive, Modern & High-Conversion Interfaces",
    desc: "Human-centric interface design that turns complex business workflows into seamless, delightful customer journeys.",
    deliverables: [
      "User research, persona mapping & UX wireframing",
      "Figma design systems & interactive prototypes",
      "Mobile app UX and responsive web application design",
      "Usability audits and conversion rate optimization (CRO)",
    ],
  },
  {
    id: "content-marketing",
    icon: FileText,
    title: "Content Marketing",
    subtitle: "Copywriting that Educates & Converts",
    desc: "Compelling storytelling, SEO blog posts, high-converting ad copy, and automated email/WhatsApp newsletter sequences.",
    deliverables: [
      "High-ranking SEO content strategy & technical blog writing",
      "Ad copywriting for Google Ads, Facebook & Instagram",
      "WhatsApp & email sequence broadcast copy",
      "Case studies, whitepapers & product documentation",
    ],
  },
  {
    id: "graphics-design",
    icon: Sparkles,
    title: "Graphics Design & Brand Identity",
    subtitle: "Distinctive Visual Assets",
    desc: "Establish an unforgettable brand presence with custom logos, social media creatives, banner ads, and print assets.",
    deliverables: [
      "Corporate brand identity, logo design & brand style guides",
      "High-engagement social media creatives & promotional banners",
      "Marketing pitch decks, brochures & trade-fair collateral",
      "Custom vector illustrations & motion graphics assets",
    ],
  },
];

const RESELLER_BENEFITS = [
  { icon: Globe, title: "Your Own Domain", copy: "Run the platform on app.yourbrand.com with managed SSL and branded emails." },
  { icon: Palette, title: "Full Rebranding", copy: "Your logo, colours, favicon and login screen. Solvear stays invisible." },
  { icon: Wallet, title: "Your Pricing & Margins", copy: "Create plans, set prices per client and collect payments through your own gateway." },
  { icon: LayoutDashboard, title: "Reseller Dashboard", copy: "Provision sub-accounts, monitor usage and manage renewals from one console." },
  { icon: PlugZap, title: "Sell Add-ons", copy: "Upsell AI tokens, extra numbers, agent seats and campaign credits." },
  { icon: Headset, title: "Backend Support", copy: "We maintain infrastructure, uptime and API updates while you own the customer." },
];

function WhiteLabel() {
  return (
    <>
      <PageHero
        eyebrow="Services & SaaS"
        title="Comprehensive digital marketing, bespoke software & reseller solutions"
        description="From performance marketing to custom software engineering and turnkey white-label CPaaS infrastructure."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl">
            <Link to="/contact">Discuss a Project</Link>
          </Button>
          <a
            href="tel:+918016081188"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition backdrop-blur-xs"
          >
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span className="text-white">Call +91 80160 81188 (India)</span>
          </a>
        </div>
      </PageHero>

      {/* 5 Core Digital Services */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <SectionHeading
            eyebrow="Core Services"
            title="Digital Services Delivered by SOLVEAR ADVERTISING"
            description="Our specialized creative, engineering, and marketing wings help businesses scale online."
          />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {SERVICES.map((s) => (
              <article
                key={s.id}
                id={s.id}
                className="scroll-mt-28 rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-elevated flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                      <s.icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                        {s.subtitle}
                      </span>
                      <h2 className="font-display text-2xl font-extrabold text-foreground">{s.title}</h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>

                  <div className="mt-6 pt-5 border-t border-border space-y-2.5">
                    {s.deliverables.map((d) => (
                      <div key={d} className="flex items-start gap-2.5 text-xs font-semibold text-foreground/85">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                  <Button asChild size="sm" className="shadow-pink text-xs font-bold rounded-xl">
                    <Link to="/contact">Inquire for {s.title}</Link>
                  </Button>
                  <Link
                    to="/contact"
                    className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Request Proposal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* White-label Reseller Hub */}
      <section className="bg-surface section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Reseller Hub"
            title="White-label CPaaS & Chatbot Reseller Solution"
            description="A complete SaaS platform under your own brand, with infrastructure and carrier routing managed for you."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {RESELLER_BENEFITS.map((b) => (
              <article key={b.title} className="rounded-2xl border border-border bg-card p-7">
                <b.icon className="h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-5 font-display text-lg font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{b.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to partner with SOLVEAR ADVERTISING?"
        description="Speak with our solutions director to discuss service retainers or custom platform licensing."
      />
    </>
  );
}
