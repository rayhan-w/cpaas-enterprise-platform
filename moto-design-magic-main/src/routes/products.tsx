import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MessageCircle,
  Facebook,
  Instagram,
  Send,
  Globe,
  Phone,
  MessageSquare,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — WhatsApp API, SMS, Voice & Social | Solvear" },
      {
        name: "description",
        content:
          "WhatsApp Business API, Bulk SMS, RCS, Voice & IVR, Messenger, Instagram, Telegram and Webchat — every Solvear channel product in one place.",
      },
      { property: "og:title", content: "Solvear Products — Messaging Channels for Business" },
      {
        property: "og:description",
        content: "Explore every Solvear channel: WhatsApp API, SMS, Voice, Instagram and more.",
      },
    ],
  }),
  component: Products,
});

const PRODUCTS = [
  {
    icon: MessageCircle,
    name: "WhatsApp Business API",
    copy: "Official Meta-approved API with verified business profile, template management and unlimited agents.",
    points: ["Green tick verification", "Template & broadcast manager", "Catalog and payments", "99.9% delivery uptime"],
  },
  {
    icon: MessageSquare,
    name: "Bulk SMS",
    copy: "High-throughput transactional and promotional SMS with sender ID management and compliance built in.",
    points: ["OTP routes with fallback", "DLT / regulator compliant", "Unicode & long SMS", "Real-time DLR reports"],
  },
  {
    icon: Phone,
    name: "Voice & IVR",
    copy: "Outbound voice campaigns, click-to-call and multi-level IVR menus connected to your CRM.",
    points: ["Multi-level IVR builder", "Call recording & logs", "Missed-call services", "Number masking"],
  },
  {
    icon: Facebook,
    name: "Messenger",
    copy: "Automate Facebook page inboxes, comment replies and lead-ad follow-ups without extra tooling.",
    points: ["Comment-to-DM automation", "Persistent menus", "Lead ad sync", "Handover to agents"],
  },
  {
    icon: Instagram,
    name: "Instagram DM",
    copy: "Convert story replies, mentions and product questions into tracked conversations.",
    points: ["Story reply triggers", "Quick replies & icebreakers", "Product tagging", "Unified inbox"],
  },
  {
    icon: Send,
    name: "Telegram",
    copy: "Run bots, channels and community selling flows alongside your other channels.",
    points: ["Bot flow builder", "Channel broadcasts", "Group moderation", "Inline keyboards"],
  },
  {
    icon: Globe,
    name: "Webchat Widget",
    copy: "Drop a single script on your site and reuse the same bots, routing and inbox.",
    points: ["Custom branding", "Offline capture", "Multilingual", "Visitor context"],
  },
];

function Products() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Every messaging channel your customers actually use"
        description="Start with one channel or run them all. Same bots, same inbox, same reporting — no duplicated work."
      >
        <Button asChild size="lg" className="shadow-pink">
          <Link to="/contact">Talk to an Expert</Link>
        </Button>
      </PageHero>

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 md:grid-cols-2">
          {PRODUCTS.map((p) => (
            <article
              key={p.name}
              className="rounded-xl border border-border bg-card p-8 transition-shadow hover:shadow-elevated"
            >
              <span className="grid h-12 w-12 place-items-center rounded-lg bg-accent text-primary">
                <p.icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold">{p.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.copy}</p>
              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {pt}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <CtaBand
        title="Not sure which channel to start with?"
        description="Tell us about your customers and we'll map the fastest route to measurable results."
      />
    </>
  );
}
