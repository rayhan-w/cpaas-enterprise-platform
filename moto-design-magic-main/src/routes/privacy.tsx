import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Lock, Eye, FileText, Phone, Mail, MapPin, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { SectionHeading } from "@/components/site/SectionHeading";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED" },
      {
        name: "description",
        content:
          "Privacy Policy and Data Protection standards of SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED. Learn how we collect, protect, and process user data across our CPaaS platforms.",
      },
      { property: "og:title", content: "Privacy Policy — Solvear CPaaS" },
      {
        property: "og:description",
        content: "Transparent data protection and privacy policies for Solvear messaging services.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal & Compliance"
        title="Privacy Policy"
        description="At SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED, we prioritize the confidentiality and protection of your personal and enterprise data."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl">
            <Link to="/contact">Contact Privacy Officer</Link>
          </Button>
          <a
            href="tel:+918016081188"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-muted font-bold text-xs transition"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span>Call +91 80160 81188 (India)</span>
          </a>
        </div>
      </PageHero>

      <section className="section-y bg-background">
        <div className="mx-auto max-w-4xl px-6 space-y-12 text-foreground/90">
          {/* Introduction Card */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <ShieldCheck className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                  Last Updated: August 2026
                </span>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  Our Commitment to Your Privacy
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              This Privacy Policy explains how <strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong> ("Solvear", "we", "us", or "our") collects, uses, processes, and safeguards the information obtained from users and enterprises using our Communication Platform as a Service (CPaaS), including Bulk SMS, WhatsApp Business API, RCS, Voice, IVR, and Digital Marketing solutions.
            </p>
          </div>

          {/* Section 1: Information We Collect */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">1. Information We Collect</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect information that you directly provide to us, as well as data automatically generated when you use our communication infrastructure:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Personal Information
                </h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Name, business email address, phone number, company name, billing address, tax identification (GSTIN/PAN), and KYC documentation for telecom DLT registration.
                </p>
              </div>
              <div className="p-5 rounded-2xl bg-surface border border-border">
                <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Communication Data
                </h4>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Message transmission logs, delivery receipts (DLR), sender IDs, timestamps, routing parameters, and API request metadata processed through our gateways.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: How We Use Your Information */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">2. How We Use Your Information</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use the collected information for the following legitimate business purposes:
            </p>
            <ul className="space-y-2.5 text-xs text-foreground/80 font-medium">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>To deliver high-throughput transactional and promotional messages across telecom networks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>To verify identity, fulfill TRAI DLT compliance guidelines, and prevent fraudulent messaging.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>To provide 24/7 technical assistance, SLA monitoring, billing invoices, and account management.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>To continuously improve gateway latency, routing algorithms, and AI chatbot accuracy.</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Data Security and Storage */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">3. Data Security & Storage</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We employ enterprise-grade security controls including 256-bit AES encryption at rest, TLS 1.3 encryption in transit, strict role-based access control (RBAC), and automated DDoS mitigation. Communication data is housed in ISO 27001-certified Tier-III data centers in accordance with Indian regulatory laws.
            </p>
          </div>

          {/* Section 4: Telecom & Meta API Compliance */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">4. Telecom DLT & Meta API Compliance</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Solvear strictly abides by Telecom Commercial Communications Customer Preference Regulations (TCCCPR) mandated by TRAI and official Meta WhatsApp Business API Policies. We do not sell, rent, or trade your contact lists or message content to any third-party marketing entities.
            </p>
          </div>

          {/* Section 5: Cookies and Tracking */}
          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">5. Cookies & Analytics</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Our website uses essential session cookies to maintain secure authentication and analytical cookies to understand site performance and visitor interactions. You may adjust your browser cookie preferences at any time.
            </p>
          </div>

          {/* Section 6: Contact Details */}
          <div className="rounded-3xl border border-border bg-surface p-8">
            <h3 className="font-display text-lg font-bold text-foreground">Grievance & Contact Information</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              For any questions regarding this Privacy Policy or to exercise your data rights, please contact our designated compliance officer:
            </p>
            <div className="mt-6 space-y-3 text-xs font-semibold">
              <p className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span><strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong> — Maynaguri, Jalpaiguri, West Bengal, 735302 - India</span>
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:+918016081188" className="hover:text-primary transition">+91 80160 81188 (India)</a>
              </p>
              <p className="flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:privacy@solvear.io" className="hover:text-primary transition">privacy@solvear.io</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand
        title="Have questions about our data security or compliance?"
        description="Our legal and technical team in India is ready to assist you with compliance documentation."
      />
    </>
  );
}
