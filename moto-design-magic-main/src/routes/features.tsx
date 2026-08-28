import { createFileRoute } from "@tanstack/react-router";
import {
  Bot,
  Inbox,
  Megaphone,
  ShoppingCart,
  PackageCheck,
  CalendarClock,
  ListOrdered,
  Sparkles,
  BarChart3,
  Users,
  Workflow,
  ShieldCheck,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import platformImg from "@/assets/platform.jpg";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Chatbots, Broadcasts & Shared Inbox | Solvear" },
      {
        name: "description",
        content:
          "Drag-and-drop chatbot builder, broadcasts, shared inbox, cart recovery, COD verification, appointment scheduling and AI tokens powered by OpenAI and Gemini.",
      },
      { property: "og:title", content: "Solvear Features — Automation Built for Conversions" },
      {
        property: "og:description",
        content: "Everything Solvear automates, from first message to repeat order.",
      },
    ],
  }),
  component: Features,
});

const FEATURES = [
  { icon: Megaphone, title: "Broadcasting — 80%+ Open Rates", copy: "Deliver personalized broadcasts across WhatsApp, Messenger, Instagram and Telegram — promotional offers, product updates, newsletters, event invites and alerts that always get noticed." },
  { icon: Bot, title: "Drag & Drop Chatbot Builder", copy: "Build powerful automation flows visually with conditions, user inputs and API calls — no coding required." },
  { icon: Inbox, title: "Omni-Channel Shared Inbox", copy: "WhatsApp, Messenger, Instagram DM, Telegram and WebChat in one unified dashboard, with agent assignment, smart routing and AI-assisted replies." },
  { icon: Sparkles, title: "AI-Powered Assistant", copy: "Train your AI with FAQs, document uploads and website content. Real-time intent detection delivers accurate, human-like, context-aware responses." },
  { icon: ListOrdered, title: "Sequence (Drip) Messaging", copy: "Schedule customized, time-based messages that guide customers through onboarding, promotions, reminders and re-engagement — automatically." },
  { icon: Workflow, title: "User Input Flow", copy: "Collect preferences, interests and feedback directly inside chat. Capture data effortlessly, segment audiences and deliver the right offers to the right people." },
  { icon: ShoppingCart, title: "Webhook Workflow Automation", copy: "Connect Typeform, Google Forms, Elementor, WooCommerce and Shopify. Trigger real-time order confirmations, cart reminders, delivery notifications and payment receipts." },
  { icon: PackageCheck, title: "Shopify & WooCommerce Integration", copy: "Instant order notifications, Cash on Delivery confirmation and abandoned cart recovery delivered directly via WhatsApp." },
  { icon: CalendarClock, title: "WhatsApp Form Flows", copy: "Interactive forms built right into WhatsApp — schedule appointments, collect feedback, capture leads and gather customer information effortlessly." },
  { icon: BarChart3, title: "WhatsApp Catalog Integration", copy: "Showcase products and let customers browse and buy directly within WhatsApp — a smooth shopping experience that boosts conversions." },
  { icon: Users, title: "Live Chat Mobile App", copy: "Android, iOS and desktop apps with instant notifications — even offline or in the background. Manage chats on the go and collaborate with your team." },
  { icon: ShieldCheck, title: "HTTP API Inside Bot Flow", copy: "Connect external systems, fetch real-time data like order status or inventory, and trigger dynamic personalized responses — no-code setup." },
];

function Features() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Chat, sell & scale with AI — all in one platform"
        description="Broadcasts, commerce, Shared Inbox and AI Tokens — everything Solvear API automates, from the first message to repeat orders."
      />

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <article key={f.title} className="rounded-xl border border-border bg-card p-7">
                <f.icon className="h-7 w-7 text-primary" aria-hidden />
                <h2 className="mt-5 font-display text-lg font-bold">{f.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{f.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <img
            src={platformImg}
            alt="Campaign analytics dashboard showing message delivery and conversion metrics"
            loading="lazy"
            width={1200}
            height={900}
            className="rounded-2xl shadow-elevated"
          />
          <div>
            <SectionHeading
              align="left"
              eyebrow="Built for scale"
              title="Webhooks, HTTP API & AI control"
              description="Automate workflows with webhooks and plug third-party systems straight into your bot flows — then manage AI configurations, response logic, business hours and automation from one intuitive dashboard."
            />
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              {[
                ["Effortless API connectivity", "Integrate third-party apps, databases and business tools directly into Solvear API."],
                ["Dynamic personalized responses", "Fetch order status, account details or live inventory and reply in real time."],
                ["Automate with API actions", "Create tickets, update CRM records and process transactions from within chat."],
                ["No-code API setup", "Configure endpoints in the drag-and-drop bot builder — just plug in and go."],
              ].map(([term, def]) => (
                <div key={term}>
                  <dt className="font-display text-sm font-bold text-foreground">{term}</dt>
                  <dd className="mt-1 text-sm text-muted-foreground">{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
