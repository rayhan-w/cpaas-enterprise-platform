import { createFileRoute, Link } from "@tanstack/react-router";
import { FileCheck, Shield, Scale, AlertCircle, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions — SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED" },
      {
        name: "description",
        content:
          "Terms of Service and Master Service Agreement for Solvear CPaaS, Bulk SMS, WhatsApp Business API, and Digital Marketing platforms.",
      },
      { property: "og:title", content: "Terms & Conditions — Solvear CPaaS" },
      {
        property: "og:description",
        content: "Master Service Agreement and acceptable usage policies for Solvear messaging services.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal & Governance"
        title="Terms & Conditions"
        description="Master Service Agreement governing the use of Solvear CPaaS, APIs, and digital marketing services."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl">
            <Link to="/contact">Contact Support</Link>
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
        <div className="mx-auto max-w-4xl px-6 space-y-12 text-foreground/90">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <Scale className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                  Effective Date: August 2026
                </span>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  Master Service Agreement
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              These Terms and Conditions constitute a legally binding agreement between you or your organization ("Client", "User") and <strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong> ("Solvear", "Company"). By accessing our portal, APIs, or subscribing to our services, you agree to be bound by these terms.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">1. Account Registration & DLT Verification</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To send SMS messages or activate WhatsApp Business APIs, clients must complete mandatory Know Your Customer (KYC) identity checks and register Principal Entity IDs on Telecom TRAI DLT portals. Clients agree to provide accurate and authentic business documents.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">2. Acceptable Use Policy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Clients shall not use Solvear's infrastructure for transmitting unsolicited spam, phishing attacks, malware, deceptive financial schemes, hate speech, or content in violation of Indian cyber and telecom laws. Violations will result in immediate suspension without refund.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">3. Service Level Agreement (SLA) & Uptime</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Solvear targets 99.99% gateway availability for mission-critical OTP and transactional traffic. We provide multiple telecom carrier redundancy paths to ensure continuous message delivery.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">4. Billing, Credits & Payment Terms</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prepaid message credits and subscription plans must be funded in advance. Invoices include applicable GST (18%). Credit balances expire as per individual plan validity schedules.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">5. Limitation of Liability</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Solvear shall not be liable for delivery delays caused by telecom network congestion, end-user device unreachability, National Do Not Disturb (DND) filtering, or Meta WhatsApp server outages.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-8">
            <h3 className="font-display text-lg font-bold text-foreground">Legal Jurisdiction</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              These terms shall be governed by and construed in accordance with the laws of the Republic of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Jalpaiguri / Kolkata, West Bengal, India.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Need a custom Enterprise Master Service Agreement?"
        description="Contact our enterprise solutions team to discuss volume SLAs and dedicated infrastructure."
      />
    </>
  );
}
