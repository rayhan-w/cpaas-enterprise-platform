import { createFileRoute } from "@tanstack/react-router";
import { Compass, HeartHandshake, Rocket, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import aboutImg from "@/assets/about.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Solvear — The Team Behind the Platform" },
      {
        name: "description",
        content:
          "Solvear builds customer engagement infrastructure for South Asia and beyond — 600+ clients, 2,948 projects and a 61-person team.",
      },
      { property: "og:title", content: "About Solvear — Conversations That Convert" },
      {
        property: "og:description",
        content: "Our story, mission and the team building Solvear's CPaaS platform.",
      },
    ],
  }),
  component: About,
});

const VALUES = [
  { icon: Rocket, title: "Ship fast, measure everything", copy: "We release weekly and judge features by the revenue they move for customers." },
  { icon: ShieldCheck, title: "Compliance is not optional", copy: "Consent, opt-outs and data handling are designed in, never bolted on." },
  { icon: HeartHandshake, title: "Partner, not vendor", copy: "Onboarding, flow design and campaign reviews come with every plan." },
  { icon: Compass, title: "Local depth, global reach", copy: "Regional payment rails and languages, backed by global carrier routes." },
];

const STATS = [
  { value: "2,948", label: "Projects completed" },
  { value: "600+", label: "Worldwide clients" },
  { value: "61", label: "Team members" },
  { value: "310K+", label: "Businesses reached" },
];

const TEAM = [
  { name: "Md. Rayhan Haidar", role: "Founder & CEO" },
  { name: "Sabrina Alam", role: "Chief Product Officer" },
  { name: "Imran Kabir", role: "VP Engineering" },
  { name: "Nadia Rahman", role: "Head of Customer Success" },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Company"
        title="The all-in-one WhatsApp marketing & automation platform"
        description="Solvear API is designed to help businesses grow faster and smarter — trusted by 310K+ users, businesses, agencies and resellers worldwide."
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
          <img
            src={aboutImg}
            alt="Solvear team members working together in the Dhaka office"
            loading="lazy"
            width={1200}
            height={900}
            className="rounded-2xl shadow-elevated"
          />
          <div>
            <SectionHeading
              align="left"
              eyebrow="What we do"
              title="One platform for every customer conversation"
              description="Solvear API offers bulk message broadcasting, abandoned cart recovery, COD verification, appointment scheduling, sequence messaging, user input flows and a drag-and-drop chatbot builder — across WhatsApp, Messenger, Instagram, Telegram and WebChat, all managed from a unified Shared Inbox."
            />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Powered by OpenAI and Gemini with flexible AI Tokens, Solvear delivers human-like
              conversations and intelligent automation at scale. And for agencies and
              entrepreneurs, our white-label reseller solution lets you rebrand the entire
              platform as your own — custom domains, flexible pricing controls, add-on selling
              and a dedicated reseller dashboard to launch your own chatbot SaaS business.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-navy text-navy-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-bold md:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-navy-foreground/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Values" title="How we work" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <article key={v.title} className="rounded-xl border border-border bg-card p-7">
                <v.icon className="h-7 w-7 text-primary" aria-hidden />
                <h3 className="mt-5 font-display text-base font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface section-y">
        <div className="mx-auto max-w-7xl px-6">
          <SectionHeading eyebrow="Leadership" title="The people behind Solvear" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m) => (
              <article
                key={m.name}
                className="rounded-xl border border-border bg-card p-7 text-center"
              >
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-navy font-display text-xl font-bold text-navy-foreground">
                  {m.name
                    .split(" ")
                    .slice(-2)
                    .map((w) => w.charAt(0))
                    .join("")}
                </span>
                <h3 className="mt-4 font-display text-base font-bold">{m.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{m.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Want to see how we'd run your channels?"
        description="Bring your use case and we'll map the flows, quotas and rollout plan on the call."
      />
    </>
  );
}
