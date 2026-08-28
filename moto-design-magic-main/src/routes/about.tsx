import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Compass,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Building2,
  Newspaper,
  Briefcase,
  Users,
  CheckCircle2,
  Phone,
  ArrowRight,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";
import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Company & Leadership — SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED" },
      {
        name: "description",
        content:
          "Our story, journey, executive leadership, newsroom and career openings at Solvear CPaaS in West Bengal, India.",
      },
      { property: "og:title", content: "About Solvear — Company & Leadership" },
      {
        property: "og:description",
        content: "Building customer engagement infrastructure for high-growth enterprises.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: Rocket, title: "Ship fast, measure everything", copy: "We release features weekly and measure success by the ROI and delivery rates generated for our clients." },
  { icon: ShieldCheck, title: "DLT & Regulatory Compliance", copy: "TRAI, DLT, Meta Cloud API rules, and data privacy protocols are baked into the core architecture." },
  { icon: HeartHandshake, title: "Partner, not just vendor", copy: "Direct account managers, template registration assistance, and SLA-backed support on every plan." },
  { icon: Compass, title: "Local roots, global scale", copy: "Headquartered in West Bengal, serving businesses across India, South Asia and international markets." },
];

const LEADERSHIP = [
  { name: "Palash Rangder", role: "Managing Director & Founder", bio: "Leading the strategic vision and telecommunications infrastructure at Solvear Advertising." },
  { name: "Technical Solutions Team", role: "Solutions Architecture", bio: "Expert telecom engineers ensuring 99.99% message throughput, DLT routing, and API stability." },
  { name: "Enterprise Sales & Success", role: "Client Success Hub", bio: "Dedicated account managers providing 24/7 onboarding, bot design, and campaign optimization." },
  { name: "Regulatory Compliance Cell", role: "TRAI & Meta Compliance", bio: "Ensuring 100% adherence to telecom regulations, DLT template whitelisting, and opt-in standards." },
];

const NEWSROOM = [
  {
    date: "August 2026",
    title: "Solvear Expands DLT-Compliant Bulk SMS & WhatsApp Hub in West Bengal",
    summary: "SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED officially expands its next-generation multi-channel CPaaS platform with direct carrier routing.",
  },
  {
    date: "June 2026",
    title: "Launch of AI-Powered Multi-Level WhatsApp Bot Builder",
    summary: "Solvear introduces integrated OpenAI & Gemini token intelligence for zero-code drag-and-drop conversational commerce.",
  },
  {
    date: "April 2026",
    title: "Solvear Achieves ISO 9001:2018 & MSME Registration",
    summary: "Reaffirming our commitment to enterprise security, quality management, and transparent telecom reporting standards.",
  },
];

const CAREERS = [
  {
    title: "Enterprise Solutions Architect (CPaaS / Telephony)",
    location: "West Bengal / Remote",
    type: "Full-time",
    desc: "Work with enterprise clients to architect WhatsApp Business API, SMS gateway routing, and custom CRM webhooks.",
  },
  {
    title: "Frontend React / Full-Stack Engineer",
    location: "West Bengal / Remote",
    type: "Full-time",
    desc: "Build high-performance real-time UI consoles, shared inboxes, and flow builder tools.",
  },
  {
    title: "Account Executive (CPaaS & SaaS Sales)",
    location: "Kolkata / North Bengal / Remote",
    type: "Full-time",
    desc: "Drive regional enterprise sales across e-commerce, banking, logistics, and healthcare verticals.",
  },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Company Profile"
        title="Building customer communication infrastructure for modern India"
        description="Solvear is an enterprise CPaaS and customer engagement platform operated by SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED in West Bengal, India."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl">
            <Link to="/contact">Contact Our Team</Link>
          </Button>
          <a
            href="tel:+918016081188"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-muted font-bold text-xs transition"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span>Call +91 80160 81188 (West Bengal)</span>
          </a>
        </div>
      </PageHero>

      {/* 1. Journey / About Us Section */}
      <section id="journey" className="scroll-mt-28 section-y bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <img
            src={aboutImg}
            alt="Solvear corporate office and team"
            loading="lazy"
            width={1200}
            height={900}
            className="rounded-3xl shadow-elevated border border-border"
          />
          <div className="space-y-6">
            <SectionHeading
              align="left"
              eyebrow="Our Journey"
              title="From regional messaging to an enterprise omnichannel platform"
              description="Founded with a mission to simplify customer communication for Indian enterprises, Solvear empowers businesses to communicate across WhatsApp, SMS, RCS, Voice, and Social DMs effortlessly."
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Operating under <strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong> (Registered Office: Maynaguri, Jalpaiguri, West Bengal, 735302 - India), we combine carrier-grade infrastructure with modern software intelligence.
            </p>
            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <p className="font-display text-2xl font-bold text-primary">3,769+</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Projects Delivered</p>
              </div>
              <div className="p-4 rounded-2xl bg-surface border border-border">
                <p className="font-display text-2xl font-bold text-primary">99.99%</p>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">Carrier SLA Uptime</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-y bg-surface">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Core Values" title="How We Deliver Value" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <article key={v.title} className="rounded-2xl border border-border bg-card p-7">
                <v.icon className="h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-5 font-display text-base font-bold text-foreground">{v.title}</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{v.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Leadership Section */}
      <section id="leadership" className="scroll-mt-28 section-y bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Leadership"
            title="Executive Leadership & Operations"
            description="The dedicated teams guiding technology, operations, and client success at Solvear."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {LEADERSHIP.map((m) => (
              <article
                key={m.name}
                className="rounded-2xl border border-border bg-card p-7 text-center hover:border-primary/40 transition"
              >
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 font-display text-xl font-bold text-primary border border-primary/20">
                  {m.name.charAt(0)}
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-foreground">{m.name}</h3>
                <p className="text-xs font-bold text-primary mt-0.5">{m.role}</p>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Newsroom Section */}
      <section id="newsroom" className="scroll-mt-28 section-y bg-surface">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Press & Media"
            title="Solvear Newsroom"
            description="Latest product announcements, telecom milestones, and corporate updates."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {NEWSROOM.map((n) => (
              <article key={n.title} className="rounded-2xl border border-border bg-card p-7 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                    {n.date}
                  </span>
                  <h3 className="mt-2 font-display text-base font-bold text-foreground leading-snug">
                    {n.title}
                  </h3>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{n.summary}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-border">
                  <span className="text-xs font-bold text-primary inline-flex items-center gap-1">
                    <span>Press Release</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Careers Section */}
      <section id="careers" className="scroll-mt-28 section-y bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="Join Our Team"
            title="Careers at Solvear"
            description="Join a high-growth CPaaS & AI technology platform shaping enterprise communication."
          />
          <div className="mt-12 space-y-4 max-w-4xl mx-auto">
            {CAREERS.map((c) => (
              <div
                key={c.title}
                className="p-6 sm:p-7 rounded-2xl border border-border bg-card hover:border-primary/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-extrabold uppercase">
                      {c.type}
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold">{c.location}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-foreground mt-2">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xl">{c.desc}</p>
                </div>
                <Button asChild size="sm" className="shadow-pink text-xs font-bold shrink-0 rounded-xl">
                  <Link to="/contact">Apply Now</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Want to see how we'd run your messaging infrastructure?"
        description="Talk with our technical team in West Bengal to review your message volumes and routing setup."
      />
    </>
  );
}
