import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Palette, Wallet, LayoutDashboard, PlugZap, Headset } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/white-label")({
  head: () => ({
    meta: [
      { title: "White-label Reseller Platform | Solvear" },
      {
        name: "description",
        content:
          "Launch your own branded chatbot SaaS with Solvear's white-label reseller solution — custom domain, your pricing, add-on selling and a dedicated reseller dashboard.",
      },
      { property: "og:title", content: "Solvear White-label — Build Your Own Chatbot SaaS" },
      {
        property: "og:description",
        content:
          "Rebrand the entire platform, set your own pricing and resell without managing infrastructure.",
      },
    ],
  }),
  component: WhiteLabel,
});

const BENEFITS = [
  { icon: Globe, title: "Your Own Domain", copy: "Run the platform on app.yourbrand.com with managed SSL and branded emails." },
  { icon: Palette, title: "Full Rebranding", copy: "Your logo, colours, favicon and login screen. Solvear stays invisible." },
  { icon: Wallet, title: "Your Pricing & Margins", copy: "Create plans, set prices per client and collect payments through your own gateway." },
  { icon: LayoutDashboard, title: "Reseller Dashboard", copy: "Provision sub-accounts, monitor usage and manage renewals from one console." },
  { icon: PlugZap, title: "Sell Add-ons", copy: "Upsell AI tokens, extra numbers, agent seats and campaign credits." },
  { icon: Headset, title: "Backend Support", copy: "We maintain infrastructure, uptime and API updates while you own the customer." },
];

const STEPS = [
  { n: "01", title: "Pick your tier", copy: "Choose sub-account volume and the add-ons you want to resell." },
  { n: "02", title: "Brand the platform", copy: "Upload your identity, connect your domain and configure billing." },
  { n: "03", title: "Set your pricing", copy: "Build plans with your own margins and trial rules." },
  { n: "04", title: "Start onboarding", copy: "Create client workspaces in minutes and let automation do the rest." },
];

function WhiteLabel() {
  return (
    <>
      <PageHero
        eyebrow="White-label"
        title="Build your own brand on a platform that's ready to resell"
        description="Fully customisable, scalable and production-ready. Launch a chatbot SaaS business without worrying about infrastructure or maintenance."
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg" className="shadow-pink">
            <Link to="/contact">Become a Reseller</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground">
            <Link to="/pricing">See Reseller Pricing</Link>
          </Button>
        </div>
      </PageHero>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            eyebrow="What you get"
            title="Everything rebranded, nothing rebuilt"
            description="A complete SaaS product under your name, with the operational load handled for you."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <article key={b.title} className="rounded-xl border border-border bg-card p-7">
                <b.icon className="h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-5 font-display text-lg font-bold">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy text-navy-foreground section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading
            inverted
            eyebrow="How it works"
            title="Live in weeks, not quarters"
          />
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <li
                key={s.n}
                className="rounded-xl border border-navy-foreground/15 bg-navy-deep/40 p-7"
              >
                <span className="font-display text-3xl font-bold text-primary">{s.n}</span>
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-2 text-sm text-navy-foreground/70">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand
        title="Own the brand. We'll run the platform."
        description="Talk to our partnerships team about white-label volumes, margins and onboarding support."
      />
    </>
  );
}
