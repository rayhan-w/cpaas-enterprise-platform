import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — Plans for Businesses, Agencies & Resellers | Solvear" },
      {
        name: "description",
        content:
          "Transparent Solvear pricing: Starter, Growth and Agency plans plus a white-label reseller tier. Monthly or yearly billing with two months free.",
      },
      { property: "og:title", content: "Solvear Pricing — Simple Plans, No Surprises" },
      {
        property: "og:description",
        content: "Compare Starter, Growth, Agency and White-label plans side by side.",
      },
    ],
  }),
  component: Pricing,
});

const PLANS = [
  {
    name: "Starter",
    monthly: 29,
    tagline: "For small teams testing WhatsApp automation.",
    features: ["1 WhatsApp number", "3 agent seats", "5,000 broadcast messages", "Chatbot builder", "Email support"],
    featured: false,
  },
  {
    name: "Growth",
    monthly: 89,
    tagline: "For scaling brands running daily campaigns.",
    features: [
      "3 WhatsApp numbers",
      "10 agent seats",
      "50,000 broadcast messages",
      "Cart recovery & COD verification",
      "AI tokens included",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Agency",
    monthly: 249,
    tagline: "For agencies managing many client accounts.",
    features: [
      "10 numbers, 25 sub-accounts",
      "Unlimited agent seats",
      "250,000 broadcast messages",
      "Full API & webhooks",
      "Dedicated success manager",
    ],
    featured: false,
  },
];

const MATRIX: Array<[string, boolean | string, boolean | string, boolean | string]> = [
  ["Shared team inbox", true, true, true],
  ["Drag & drop chatbot builder", true, true, true],
  ["Broadcast campaigns", "5k / mo", "50k / mo", "250k / mo"],
  ["Abandoned cart recovery", false, true, true],
  ["COD verification", false, true, true],
  ["AI tokens (OpenAI / Gemini)", "Add-on", "Included", "Included"],
  ["Sub-accounts", false, "3", "25"],
  ["REST API & webhooks", false, true, true],
  ["White-label branding", false, false, "Add-on"],
  ["Dedicated success manager", false, false, true],
];

const FAQS: Array<[string, string]> = [
  ["What is the Solvear API?", "The Solvear API is an all-in-one WhatsApp marketing and automation platform — bulk broadcasting, abandoned cart recovery, COD verification, appointment scheduling, sequence messaging, user input flows and a drag-and-drop chatbot builder, plus Messenger, Instagram, Telegram and WebChat managed from one unified Shared Inbox."],
  ["How do I get started with the Solvear API?", "Sign up for an account on our platform. Once registered, you'll receive an API key that grants you access to our endpoints, with comprehensive documentation covering authentication, endpoints, request/response formats and sample code."],
  ["What are the key features of the Solvear API?", "Broadcasting with 80%+ open rates, an omni-channel Shared Inbox, AI Assistant powered by OpenAI and Gemini, webhook workflow automation, HTTP API inside bot flows, WhatsApp Catalog and Form Flows, and Shopify/WooCommerce automation."],
  ["Is there a limit to the number of API calls I can make?", "Yes — to ensure fair usage and optimal performance, rate limits apply based on your subscription plan. If you need higher limits, contact our sales team for enterprise solutions."],
  ["How can I get support if I encounter issues?", "Our dedicated support team is available via the support portal — submit tickets, browse the knowledge base or contact us directly. We also offer onboarding sessions and personalized assistance."],
];

function Pricing() {
  const [yearly, setYearly] = useState(false);
  const price = (m: number) => (yearly ? Math.round(m * 10) : m);

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Plans that scale with your conversations"
        description="Start small, add channels and sub-accounts as you grow. Every plan includes the chatbot builder and shared inbox."
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-center gap-3">
            <Label htmlFor="billing" className="text-sm font-semibold">
              Monthly
            </Label>
            <Switch id="billing" checked={yearly} onCheckedChange={setYearly} />
            <Label htmlFor="billing" className="text-sm font-semibold">
              Yearly <span className="text-primary">(2 months free)</span>
            </Label>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <article
                key={p.name}
                className={`relative rounded-2xl border p-8 ${
                  p.featured
                    ? "border-primary bg-navy text-navy-foreground shadow-elevated"
                    : "border-border bg-card"
                }`}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-8 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                    Most popular
                  </span>
                )}
                <h2 className="font-display text-xl font-bold">{p.name}</h2>
                <p
                  className={`mt-1 text-sm ${
                    p.featured ? "text-navy-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {p.tagline}
                </p>
                <p className="mt-6 font-display text-4xl font-bold">
                  ${price(p.monthly)}
                  <span
                    className={`text-sm font-medium ${
                      p.featured ? "text-navy-foreground/60" : "text-muted-foreground"
                    }`}
                  >
                    /{yearly ? "year" : "month"}
                  </span>
                </p>
                <ul className="mt-6 space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={`mt-8 w-full ${p.featured ? "shadow-pink" : ""}`}
                  variant={p.featured ? "default" : "outline"}
                >
                  <Link to="/contact">Get Started</Link>
                </Button>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-primary/50 bg-accent/40 p-8 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-xl font-bold">White-label Reseller</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Custom domain, your branding, your pricing and a dedicated reseller dashboard.
                Volume-based pricing starting from 50 sub-accounts.
              </p>
            </div>
            <Button asChild className="mt-5 shadow-pink md:mt-0">
              <Link to="/white-label">Explore White-label</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-surface section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Compare" title="What's included in each plan" />
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <caption className="sr-only">Feature comparison across Solvear plans</caption>
              <thead>
                <tr className="border-b border-border text-left">
                  <th scope="col" className="py-4 font-display">
                    Feature
                  </th>
                  {PLANS.map((p) => (
                    <th key={p.name} scope="col" className="py-4 font-display">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MATRIX.map((row) => (
                  <tr key={row[0] as string} className="border-b border-border/60">
                    <th scope="row" className="py-4 text-left font-medium text-foreground/85">
                      {row[0]}
                    </th>
                    {row.slice(1).map((cell, i) => (
                      <td key={i} className="py-4 text-muted-foreground">
                        {cell === true ? (
                          <Check className="h-4 w-4 text-primary" aria-label="Included" />
                        ) : cell === false ? (
                          <Minus className="h-4 w-4 opacity-50" aria-label="Not included" />
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading eyebrow="FAQ" title="Pricing questions, answered" />
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map(([q, a]) => (
              <AccordionItem key={q} value={q}>
                <AccordionTrigger className="text-left font-display">{q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
