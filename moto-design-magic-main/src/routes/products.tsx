import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageCircle,
  Radio,
  PhoneCall,
  Bot,
  Building2,
  Headset,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Send,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products & Messaging Solutions — Solvear CPaaS" },
      {
        name: "description",
        content:
          "Explore Bulk SMS, RCS, WhatsApp Business API, Voice Call, IVR, Cloud BPO and Contact Center solutions built for high-growth enterprises.",
      },
      { property: "og:title", content: "Solvear Products — CPaaS Messaging Suite" },
      {
        property: "og:description",
        content: "Explore every Solvear channel: Bulk SMS, RCS, WhatsApp API, Voice, IVR and Contact Center.",
      },
    ],
  }),
  component: Products,
});

const ALL_PRODUCTS = [
  {
    id: "bulk-sms",
    icon: MessageSquare,
    name: "Bulk SMS",
    tagline: "Reach Thousands in Seconds",
    copy: "High-throughput DLT-compliant transactional, promotional, and OTP SMS delivery across all major Indian telecom operators with 99.9% uptime.",
    points: [
      "Instant OTP delivery with intelligent fallback routing",
      "DLT registration & sender ID template approval support",
      "Unicode, regional languages & long SMS support",
      "Real-time DLR reports & delivery timestamp analytics",
    ],
  },
  {
    id: "rcs",
    icon: Radio,
    name: "RCS (Rich Communication Services)",
    tagline: "Next-Gen Messaging Beyond SMS",
    copy: "Deliver interactive carousels, action buttons, HD media cards, and verified checkmark branding directly inside default Android SMS inboxes without requiring WhatsApp.",
    points: [
      "Verified brand logo and verified sender name",
      "Rich media carousels with 1-tap call-to-action buttons",
      "Suggested reply chips and instant app deep-links",
      "Real-time read receipts and click engagement tracking",
    ],
  },
  {
    id: "whatsapp",
    icon: MessageCircle,
    name: "Business WhatsApp API",
    tagline: "Official Meta Business Partner API",
    copy: "Run high-converting broadcasts, drag-and-drop conversational chatbots, product catalogs, and 24/7 automated customer support over the world's most popular messaging app.",
    points: [
      "Green tick verified business badge approval",
      "Automated WhatsApp bot builder with conditional logic",
      "E-commerce catalog checkout & COD confirmation",
      "Unlimited team agents in a unified shared inbox",
    ],
  },
  {
    id: "voice-call",
    icon: PhoneCall,
    name: "Voice Call Solutions",
    tagline: "Connect Instantly with Just One Call",
    copy: "Launch automated outbound voice broadcasts, click-to-call buttons for websites, number masking for delivery riders, and high-volume audio campaigns.",
    points: [
      "Text-to-speech & pre-recorded studio audio broadcasts",
      "Click-to-call web widget for instant sales connection",
      "Number masking to protect customer & agent privacy",
      "Comprehensive call detail records (CDR) and audio logs",
    ],
  },
  {
    id: "ivr",
    icon: Bot,
    name: "Interactive Voice Response (IVR)",
    tagline: "Smart Automation for Smarter Conversations",
    copy: "Build intelligent multi-level IVR menus (e.g. Press 1 for Sales, Press 2 for Support), route calls based on agent availability, and capture after-hours voicemail leads.",
    points: [
      "Visual drag-and-drop IVR call flow designer",
      "Dynamic skill-based agent routing and queuing",
      "Missed call alert & automated SMS/WhatsApp trigger",
      "CRM webhook sync for incoming caller details",
    ],
  },
  {
    id: "cloud-bpo",
    icon: Building2,
    name: "Cloud BPO Solutions",
    tagline: "Smart, Flexible & Cost-Effective Cloud BPO",
    copy: "End-to-end cloud-hosted contact center and BPO infrastructure that scales seamlessly with zero on-premise hardware costs.",
    points: [
      "Work-from-anywhere browser-based agent softphones",
      "Real-time live call monitoring, whispering & barging",
      "Detailed agent productivity and resolution metrics",
      "Custom SLA management and ticket escalation rules",
    ],
  },
  {
    id: "contact-center",
    icon: Headset,
    name: "Contact Center Solutions",
    tagline: "Clear conversations. Faster resolutions.",
    copy: "Unify voice, WhatsApp, SMS, webchat, and email support in one single screen so your support agents never lose customer context.",
    points: [
      "Omnichannel customer conversation timeline",
      "AI-suggested replies and automated FAQ macros",
      "Integrated CSAT and customer feedback surveys",
      "Enterprise encryption and SOC2 / ISO compliance",
    ],
  },
];

function Products() {
  return (
    <>
      <PageHero
        eyebrow="Products Suite"
        title="Every messaging channel your customers actually use"
        description="Start with one channel or run them all. Same bots, same inbox, same reporting — built for modern Indian businesses."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl">
            <Link to="/contact">Talk to an Expert</Link>
          </Button>
          <a
            href="tel:+918016081188"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-muted font-bold text-xs transition"
          >
            <PhoneCall className="w-4 h-4 text-primary" />
            <span>Call +91 80160 81188</span>
          </a>
        </div>
      </PageHero>

      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-6 space-y-12">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {ALL_PRODUCTS.map((p) => (
              <article
                key={p.id}
                id={p.id}
                className="scroll-mt-28 rounded-3xl border border-border bg-card p-8 shadow-sm transition-all hover:border-primary/40 hover:shadow-elevated flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                      <p.icon className="h-6 w-6" aria-hidden />
                    </span>
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                        {p.tagline}
                      </span>
                      <h2 className="font-display text-2xl font-extrabold text-foreground">{p.name}</h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{p.copy}</p>

                  <div className="mt-6 pt-5 border-t border-border space-y-2.5">
                    {p.points.map((pt) => (
                      <div key={pt} className="flex items-start gap-2.5 text-xs font-semibold text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                  <Button asChild size="sm" className="shadow-pink text-xs font-bold rounded-xl">
                    <Link to="/contact">Get Started</Link>
                  </Button>
                  {p.id === "whatsapp" && (
                    <Link
                      to="/channels/$slug"
                      params={{ slug: "whatsapp" }}
                      className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Channel Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to upgrade your customer engagement stack?"
        description="Talk to our telecom and API specialists in West Bengal to configure your custom pricing."
      />
    </>
  );
}
