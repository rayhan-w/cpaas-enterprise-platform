import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building,
  ShoppingCart,
  Truck,
  HeartPulse,
  GraduationCap,
  Plane,
  Home as HomeIcon,
  Landmark,
  CheckCircle2,
  Bot,
  Inbox,
  Megaphone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Solutions & Industry Use Cases — Solvear CPaaS" },
      {
        name: "description",
        content:
          "CPaaS solutions for Banking, E-commerce, Logistics, Healthcare, Education, Travel, Real Estate and Government in India.",
      },
      { property: "og:title", content: "Solvear Industry Solutions" },
      {
        property: "og:description",
        content: "Engineered communication workflows customized for every high-volume industry.",
      },
    ],
  }),
  component: Features,
});

const SOLUTIONS = [
  {
    id: "banking",
    icon: Building,
    name: "Bank and Financial Services",
    tagline: "Secure 2FA, Fraud Alerts & Loan Automation",
    copy: "Deliver critical transactional OTPs with zero latency, send monthly e-statements over WhatsApp, and qualify loan applicants through conversational chatbot journeys.",
    useCases: [
      "Instant 2FA login OTPs with DLT compliance & fallback",
      "Account balance updates & mini-statements via WhatsApp",
      "Automated EMI payment reminders & digital link collection",
      "Credit card activation & KYC document verification flows",
    ],
  },
  {
    id: "ecommerce",
    icon: ShoppingCart,
    name: "E-commerce & Retail",
    tagline: "COD Verification & Abandoned Cart Recovery",
    copy: "Reduce RTO return rates with 1-click WhatsApp COD confirmation buttons and recover up to 28% of abandoned checkout carts automatically.",
    useCases: [
      "1-Click WhatsApp Cash-on-Delivery (COD) confirmation",
      "Automated abandoned checkout cart recovery sequences",
      "Real-time dispatch, live courier tracking & OTP delivery",
      "In-chat product catalog browsing and instant re-orders",
    ],
  },
  {
    id: "transport",
    icon: Truck,
    name: "Transport and logistics",
    tagline: "Driver Dispatch & Real-Time Delivery Tracking",
    copy: "Keep riders, drivers, and consumers in continuous synchronization with automated SMS notifications, WhatsApp live location maps, and masked voice calls.",
    useCases: [
      "Automated pickup & delivery milestone SMS alerts",
      "Rider live location sharing directly inside WhatsApp",
      "Number masking to protect customer & driver phone numbers",
      "Proof of delivery (POD) capture with photo & signature sync",
    ],
  },
  {
    id: "healthcare",
    icon: HeartPulse,
    name: "Healthcare & Diagnostics",
    tagline: "Doctor Appointments & Diagnostic Reports",
    copy: "Eliminate patient no-shows with automated WhatsApp appointment confirmations and instant PDF diagnostic lab report delivery.",
    useCases: [
      "Automated doctor consultation appointment scheduling",
      "Instant PDF pathology & diagnostic report delivery via WhatsApp",
      "Medicine refill & vaccination schedule reminders",
      "Emergency broadcast alerts & OPD queue status updates",
    ],
  },
  {
    id: "education",
    icon: GraduationCap,
    name: "Education & EdTech",
    tagline: "Admission Alerts, Fee Notices & Attendance",
    copy: "Streamline student enrollment workflows, send fee payment reminders, and keep parents updated on daily attendance and exam schedules.",
    useCases: [
      "Student lead generation & automated admission counseling bots",
      "Fee payment deadlines with direct UPI payment links",
      "Daily student attendance & report card dispatch to parents",
      "Urgent holiday, weather, and campus closure announcements",
    ],
  },
  {
    id: "travel",
    icon: Plane,
    name: "Travel and Tourism",
    tagline: "Flight Updates, Boarding Passes & Itineraries",
    copy: "Deliver mobile boarding passes, hotel booking confirmations, and real-time gate change alerts straight to travelers' preferred messaging apps.",
    useCases: [
      "Interactive itinerary PDFs and hotel check-in confirmations",
      "Real-time flight delay, gate changes, and baggage carousel alerts",
      "Post-stay review collection and automated loyalty points updates",
      "24/7 multilingual concierge bot for tour booking inquiries",
    ],
  },
  {
    id: "real-estate",
    icon: HomeIcon,
    name: "Real Estate & Builders",
    tagline: "Lead Qualification & Site Visit Bookings",
    copy: "Instantly capture, qualify, and route property inquiries to sales brokers, share project floor plans on WhatsApp, and automate site visit reminders.",
    useCases: [
      "Instant Facebook / Google lead ad sync to WhatsApp chat",
      "Automated project brochure, pricing sheet & floorplan dispatch",
      "Calendar booking for physical site visits & virtual 3D tours",
      "Broker commission updates and milestone payment alerts",
    ],
  },
  {
    id: "government",
    icon: Landmark,
    name: "Government & Public Services",
    tagline: "Mass Emergency Alerts & Citizen Services",
    copy: "Equip government agencies with high-throughput emergency alert broadcasts, citizen grievance ticketing, and utility bill notifications.",
    useCases: [
      "Mass emergency and disaster preparedness SMS broadcasts",
      "Electricity, water, and property tax bill payment alerts",
      "Citizen grievance filing & live resolution status tracking",
      "Public welfare scheme information & application chatbots",
    ],
  },
];

function TransportIcon(props: any) {
  return <Truck {...props} />;
}

function Features() {
  return (
    <>
      <PageHero
        eyebrow="Solutions & Verticals"
        title="Industry-specific customer engagement solutions"
        description="Pre-configured conversation templates, DLT compliance workflows, and API connectors tailored for every sector."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl">
            <Link to="/contact">Request Industry Demo</Link>
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

      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-6 space-y-10">
          <div className="grid gap-8 md:grid-cols-2">
            {SOLUTIONS.map((s) => (
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
                        {s.tagline}
                      </span>
                      <h2 className="font-display text-2xl font-extrabold text-foreground">{s.name}</h2>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{s.copy}</p>

                  <div className="mt-6 pt-5 border-t border-border space-y-2.5">
                    {s.useCases.map((uc) => (
                      <div key={uc} className="flex items-start gap-2.5 text-xs font-semibold text-foreground/85">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" aria-hidden />
                        <span>{uc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                  <Button asChild size="sm" className="shadow-pink text-xs font-bold rounded-xl">
                    <Link to="/contact">Deploy For {s.name}</Link>
                  </Button>
                  <Link
                    to="/contact"
                    className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Talk to Specialist</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Ready to automate communication in your industry?"
        description="Schedule a consultation with our solutions architects to map your end-to-end messaging flows."
      />
    </>
  );
}
