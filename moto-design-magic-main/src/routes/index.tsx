import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Inbox,
  ListOrdered,
  MessageCircle,
  Radio,
  PhoneCall,
  Send,
  ShoppingCart,
  Sparkles,
  Instagram,
  Facebook,
  Globe,
  ShieldCheck,
  Zap,
  Users,
  Building2,
  Headset,
  CheckCircle2,
  TrendingUp,
  Award,
  Phone,
  Check,
  Layers,
  ChevronRight,
  X,
  Loader2,
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
      { title: "Solvear — CPaaS Platform in India for Customer Engagement" },
      {
        name: "description",
        content:
          "Run DLT-compliant Bulk SMS, WhatsApp Business API, RCS, Voice and IVR from one platform with automation, APIs, reporting and support built for growing businesses.",
      },
      { property: "og:title", content: "Solvear — CPaaS Platform in India for Customer Engagement" },
      {
        property: "og:description",
        content:
          "One platform for WhatsApp Business API, bulk SMS, chatbots, shared inbox and AI automation.",
      },
    ],
  }),
  component: Home,
});

const CHALLENGES = [
  {
    id: "deliverability",
    title: "Poor SMS Delivery and Visibility",
    badge: "Deliverability",
    desc: "Improve delivery with DLT-ready routing, approved templates, sender setup and real-time DLR reporting. Track message performance clearly for OTPs, alerts, reminders and promotional traffic.",
    points: ["99.9% Delivery Guarantee", "Instant OTP Fallback Routing", "DLT & TRAI Compliant"],
  },
  {
    id: "direct-reach",
    title: "No Reliable Owned Channel for Customer Reach",
    badge: "Direct Reach",
    desc: "Use the WhatsApp Business API and RCS to reach customers on channels they already check daily. Automate follow-ups, support responses, and notifications without losing context.",
    points: ["80%+ Open Rates", "Verified Green Tick Profile", "Interactive Catalogs & Flows"],
  },
  {
    id: "integration-friction",
    title: "Slow Onboarding and Integration Delays",
    badge: "Integration Friction",
    desc: "Launch faster with REST APIs, webhooks, and 50+ pre-built connectors for Shopify, WooCommerce, CRMs, and payment gateways. Reduce developer overhead to zero.",
    points: ["Plug & Play Webhooks", "Swagger & Postman Ready", "Node, Python, PHP SDKs"],
  },
  {
    id: "vendor-sprawl",
    title: "Too Many Tools, Vendors and Dashboards",
    badge: "Vendor Sprawl",
    desc: "Manage WhatsApp, SMS, RCS, Voice, and Social DMs from one unified omnichannel dashboard. Reduce vendor sprawl, cut licensing fees, and hold one accountable team.",
    points: ["1 Shared Unified Inbox", "Custom White-Label Branding", "Single Unified Billing"],
  },
];

const CPaaS_SERVICES = [
  {
    icon: MessageSquare,
    title: "DLT-Compliant Bulk SMS Platform",
    subtitle: "Send OTPs, alerts, reminders and promotions with high delivery control",
    desc: "Run high-throughput SMS campaigns with DLT-ready workflows, sender ID approvals, long Unicode messages and live DLR logs.",
    link: "/products",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Business API Platform",
    subtitle: "Automate customer conversations, notifications and lead follow-ups",
    desc: "Broadcast templates, handle interactive chatbots, send order tracking updates, and manage live chats across your entire sales team.",
    link: "/channels/whatsapp",
  },
  {
    icon: PhoneCall,
    title: "Voice, IVR and Contact Center Solutions",
    subtitle: "Handle enquiries, support and notifications across voice channels",
    desc: "Launch multi-level IVR menus, outbound voice broadcasts, number masking, and missed-call lead capture without adding headcount.",
    link: "/products",
  },
  {
    icon: Radio,
    title: "RCS Business Messaging",
    subtitle: "Next-gen rich media messaging beyond traditional SMS",
    desc: "Deliver interactive carousels, action buttons, HD media cards, and verified sender branding directly inside the default Android SMS inbox.",
    link: "/products",
  },
  {
    icon: Building2,
    title: "Cloud BPO & Contact Center",
    subtitle: "Smart, flexible and cost-effective customer support infrastructure",
    desc: "Equip support teams with omnichannel routing, real-time agent analytics, call recording, and SLA management.",
    link: "/products",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing & Performance SaaS",
    subtitle: "SEO, PPC, Social Media & Custom Web Development",
    desc: "Scale your revenue pipeline with Google Ads, Meta Paid Search, SEO, and bespoke web and mobile applications.",
    link: "/white-label",
  },
];

const INDUSTRIES = [
  { name: "Banking & FinTech", desc: "Secure 2FA OTPs, account balance alerts & loan updates" },
  { name: "E-commerce & Retail", desc: "COD confirmation, abandoned cart recovery & dispatch alerts" },
  { name: "Healthcare", desc: "Doctor appointments, diagnostic reports & prescription reminders" },
  { name: "Education & EdTech", desc: "Admission announcements, fee notices & exam alerts" },
  { name: "Logistics & Transport", desc: "Real-time shipment tracking, rider notifications & OTP delivery" },
  { name: "Travel & Tourism", desc: "Booking confirmations, boarding passes & itinerary updates" },
  { name: "Real Estate", desc: "Instant buyer lead qualification & scheduled site visits" },
  { name: "Government & Public", desc: "Public announcements, citizen utility alerts & scheme updates" },
];

function MessageSquare(props: any) {
  return <MessageCircle {...props} />;
}

function Home() {
  const [activeChallenge, setActiveChallenge] = useState(CHALLENGES[0].id);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [consultForm, setConsultForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    company: "",
    service: "Business WhatsApp API",
  });

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConsultSubmitted(true);
      setTimeout(() => {
        setIsConsultOpen(false);
        setConsultSubmitted(false);
        setConsultForm({ name: "", email: "", phone: "", city: "", company: "", service: "Business WhatsApp API" });
      }, 2000);
    }, 800);
  };

  const selectedChallengeData = CHALLENGES.find((c) => c.id === activeChallenge) || CHALLENGES[0];

  return (
    <>
      {/* 1. Top Limited-Time Promo Strip */}
      <div className="bg-primary/95 text-white py-2 px-4 text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-yellow-300" />
        <span>Save <strong className="text-yellow-300 underline font-black">50% for 12 months</strong> — limited-time enterprise offer. Talk to sales today.</span>
      </div>

      {/* 2. Hero Section with Video/Image Banner */}
      <section className="relative isolate min-h-[620px] overflow-hidden bg-navy-deep text-navy-foreground">
        <img
          src={heroImg}
          alt="CPaaS Platform in India for Customer Engagement"
          width={1920}
          height={1088}
          className="absolute inset-0 -z-20 h-full w-full object-cover object-right opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-deep via-navy-deep/90 to-navy-deep/40"
        />

        <div className="mx-auto flex max-w-7xl flex-col justify-center px-4 sm:px-6 py-16 sm:py-24 md:py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[11px] sm:text-xs font-extrabold uppercase tracking-widest w-fit mb-4 sm:mb-6">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Official Meta Partner &amp; DLT Compliant</span>
          </div>

          <h1 className="max-w-3xl font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] text-white">
            CPaaS Platform in India for Customer Engagement
          </h1>

          <p className="mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base md:text-lg text-navy-foreground/80 leading-relaxed">
            Run DLT-compliant Bulk SMS, WhatsApp Business API, RCS, Voice and IVR from one platform with automation, APIs, reporting and support built for growing businesses.
          </p>

          <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Button
              size="lg"
              onClick={() => setIsConsultOpen(true)}
              className="shadow-pink text-xs sm:text-sm font-bold px-7 py-5 sm:py-6 rounded-xl w-full sm:w-auto"
            >
              Request a Demo
            </Button>
            <a
              href="tel:+918016081188"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 sm:py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm transition w-full sm:w-auto text-center"
            >
              <Phone className="w-4 h-4 text-primary" />
              <span>Talk to Expert (+91 80160 81188)</span>
              <ArrowRight className="w-4 h-4 text-primary" />
            </a>
          </div>

          {/* Accreditations & Verified Badges */}
          <div className="mt-10 sm:mt-14 pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:gap-6 lg:gap-8 text-[11px] sm:text-xs font-semibold text-navy-foreground/75">
            <div className="flex items-center gap-1.5">
              <span className="text-yellow-400 font-extrabold text-sm">★★★★★</span>
              <span><strong>4.8/5</strong> Google Reviews</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>TRAI DLT Compliant</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary shrink-0" />
              <span>ISO 9001:2018 Certified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-sky-400 shrink-0" />
              <span>MSME Registered</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Live Stats & Platform Counter */}
      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 lg:grid-cols-4">
          {[
            { value: "3,769+", label: "Projects Completed" },
            { value: "768+", label: "Worldwide Clients" },
            { value: "80%+", label: "WhatsApp Open Rates" },
            { value: "99.99%", label: "Platform Delivery Uptime" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Common Challenges We Help Solve (Interactive Tabbed Section) */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Challenges Solved"
            title="Common Customer Communication Challenges We Help Solve"
            description="Whether it's poor SMS delivery, lack of direct engagement, or scattered tools — Solvear solves the bottlenecks."
          />

          <div className="mt-12 grid gap-8 lg:grid-cols-12 items-center">
            {/* Left Tabs List */}
            <div className="lg:col-span-5 space-y-3">
              {CHALLENGES.map((c) => {
                const isActive = activeChallenge === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveChallenge(c.id)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                      isActive
                        ? "border-primary bg-primary/10 shadow-pink"
                        : "border-border bg-card hover:border-primary/40 hover:bg-surface"
                    }`}
                  >
                    <div>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isActive ? "bg-primary text-white" : "bg-surface text-muted-foreground"
                      }`}>
                        {c.badge}
                      </span>
                      <h4 className={`mt-2 font-display text-sm font-bold ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}>
                        {c.title}
                      </h4>
                    </div>
                    <ChevronRight className={`w-5 h-5 shrink-0 transition-transform ${
                      isActive ? "translate-x-1 text-primary" : "text-muted-foreground"
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Right Active Details Card */}
            <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl border border-border bg-card shadow-elevated space-y-6">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-extrabold uppercase tracking-wider">
                  {selectedChallengeData.badge}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">Verified Solution</span>
              </div>

              <h3 className="font-display text-2xl font-extrabold text-foreground">
                {selectedChallengeData.title}
              </h3>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {selectedChallengeData.desc}
              </p>

              <div className="pt-2 space-y-3">
                {selectedChallengeData.points.map((pt) => (
                  <div key={pt} className="flex items-center gap-3 text-sm font-semibold text-foreground/90">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-4">
                <Button
                  onClick={() => setIsConsultOpen(true)}
                  className="shadow-pink text-xs font-bold px-6 py-3 rounded-xl"
                >
                  Solve This For Your Business
                </Button>
                <Link to="/products" className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1">
                  <span>Explore Architecture</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Explore CPaaS Products & Messaging Solutions */}
      <section className="section-y bg-surface">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Solutions & Services"
            title="Explore Our CPaaS Platform, Messaging APIs & SaaS Solutions"
            description="From high-speed DLT Bulk SMS to Meta WhatsApp API broadcasts and multi-channel bots — everything under one roof."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CPaaS_SERVICES.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-border bg-card p-8 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated flex flex-col justify-between"
              >
                <div>
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-white transition-colors">
                    <s.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-primary">{s.subtitle}</p>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Link
                    to={s.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:underline"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Industry Verticals */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Industries"
            title="Engineered for Every High-Volume Industry"
            description="Pre-configured conversation templates and delivery rules customized for your sector."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((ind) => (
              <div key={ind.name} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition">
                <h4 className="font-display text-base font-bold text-foreground">{ind.name}</h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Channels Grid */}
      <section className="section-y bg-surface">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Omni-Channel"
            title="Every Conversation Channel in One Shared Inbox"
            description="Manage WhatsApp, Instagram DM, Facebook Messenger, Telegram and Webchat seamlessly."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CHANNELS.map((c) => (
              <Link
                key={c.name}
                to="/channels/$slug"
                params={{ slug: c.slug }}
                className="group rounded-2xl border border-border bg-card p-7 transition-all hover:-translate-y-1 hover:shadow-elevated"
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

      {/* 8. White-Label Agency Reseller Banner */}
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
              title="Build Your Own SaaS Brand with Solvear's Reseller Hub"
              description="Rebrand the entire platform as your own — custom domains, flexible pricing controls, add-on selling options and a dedicated reseller dashboard. Launch your own CPaaS business without worrying about servers or telecom infrastructure."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: Users, label: "Dedicated Reseller Dashboard" },
                { icon: ShieldCheck, label: "Custom Domain & SSL" },
                { icon: BarChart3, label: "Your Own Pricing & Margins" },
                { icon: Zap, label: "Sell Add-ons & AI Tokens" },
              ].map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-xl border border-navy-foreground/15 bg-navy-deep/40 p-4 text-sm"
                >
                  <f.icon className="h-5 w-5 text-primary" aria-hidden />
                  <span className="font-semibold">{f.label}</span>
                </div>
              ))}
            </div>
            <Button asChild className="mt-8 shadow-pink">
              <Link to="/white-label">Explore White-label Reseller</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 10. Slide-Out "Schedule a Consultation" Modal */}
      {isConsultOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 relative">
            <button
              type="button"
              onClick={() => setIsConsultOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Expert Consultation
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Schedule a Consultation
              </h3>
              <p className="text-xs text-muted-foreground">
                Talk to our CPaaS solutions architect in India.
              </p>
            </div>

            {consultSubmitted ? (
              <div className="my-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Request Received!</h4>
                <p className="text-xs">Our messaging specialist will call you on <strong>{consultForm.phone}</strong> shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="mt-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={consultForm.name}
                    onChange={(e) => setConsultForm({ ...consultForm, name: e.target.value })}
                    placeholder="Rayhan Haidar"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Business Email *</label>
                    <input
                      type="email"
                      required
                      value={consultForm.email}
                      onChange={(e) => setConsultForm({ ...consultForm, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={consultForm.phone}
                      onChange={(e) => setConsultForm({ ...consultForm, phone: e.target.value })}
                      placeholder="+91 80160 81188"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">City *</label>
                    <input
                      type="text"
                      required
                      value={consultForm.city}
                      onChange={(e) => setConsultForm({ ...consultForm, city: e.target.value })}
                      placeholder="Kolkata / Dhaka"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={consultForm.company}
                      onChange={(e) => setConsultForm({ ...consultForm, company: e.target.value })}
                      placeholder="Solvear Technologies"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Primary Service Needed *</label>
                  <select
                    value={consultForm.service}
                    onChange={(e) => setConsultForm({ ...consultForm, service: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Business WhatsApp API</option>
                    <option>DLT Bulk SMS (OTP &amp; Transactional)</option>
                    <option>RCS Business Messaging</option>
                    <option>Voice Call &amp; IVR System</option>
                    <option>Cloud BPO &amp; Contact Center</option>
                    <option>White-label Reseller Hub</option>
                    <option>Digital Marketing &amp; SaaS</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-surface border border-border text-[11px] text-muted-foreground flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>I authorize Solvear to send updates and verification via SMS, WhatsApp, and Voice.</span>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full shadow-pink py-3 rounded-xl text-xs font-bold"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Submit Consultation Request"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      <CtaBand />
    </>
  );
}
