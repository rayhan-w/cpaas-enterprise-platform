import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Radio,
  Copyright,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  Building,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Solvear — Data Security & Protection" },
      {
        name: "description",
        content:
          "Privacy Policy of Solvear. Read how we protect personal information, secure data transmission, and handle electronic messaging communications.",
      },
      { property: "og:title", content: "Privacy Policy — Solvear" },
    ],
  }),
  component: PrivacyPage,
});

export function PrivacyPage() {
  return (
    <div className="font-sans bg-background min-h-screen">
      {/* 1. Top Page Hero */}
      <PageHero
        eyebrow="Legal & Privacy"
        title="Privacy Policy"
        description="Solvear perceives the significance of ensuring privacy. Learn how we collect, handle, and safeguard personal information across our CPaaS communication services."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl text-xs">
            <Link to="/contact">Schedule a Consultation</Link>
          </Button>
          <a
            href="tel:+918016081188"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition backdrop-blur-xs"
          >
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span>Call Sales: +91 80160 81188</span>
          </a>
        </div>
      </PageHero>

      {/* 2. Breadcrumb bar */}
      <div className="border-b border-border bg-surface/60 py-3">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary transition font-medium">
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground font-bold">Privacy Policy</span>
        </div>
      </div>

      {/* 3. Main Content Area */}
      <section className="section-y">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: Legal Clauses */}
            <div className="lg:col-span-8 space-y-8">
              {/* Introduction Box */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-5">
                <div className="flex items-center gap-3 border-b border-border/80 pb-4">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <ShieldCheck className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      Data Protection
                    </span>
                    <h2 className="font-display text-2xl font-extrabold text-foreground">
                      Privacy Policy
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-xs sm:text-sm text-foreground/85 leading-relaxed">
                  <p>
                    <strong>Solvear (SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED)</strong> perceives the significance of ensuring privacy. Our security strategy portrays what individual data we might gather and how we might utilize and ensure any close to home data that is made accessible to us.
                  </p>
                  <p>
                    This site is owned by <strong>Solvear (SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED)</strong>. We are focused on keeping up with the classification, respectability and security of individual data and we will take all fitting specialized and authoritative safety efforts to guarantee that where any close to home data is given to us it will be ensured against loss, destruction and harm, and against unapproved or unintentional access, processing, deletion, move, use, alteration, revelation or other abuse.
                  </p>
                </div>
              </div>

              {/* Express Consent for Communications Clause */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Radio className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Communication &amp; Contact Consent
                  </h3>
                </div>
                <div className="space-y-3 text-xs sm:text-sm text-foreground/85 leading-relaxed">
                  <p>
                    By providing your contact details, you expressly consent to receiving communications from us, including but not limited to transactional notifications, reminders, updates, promotional messages, and advertisements via RCS (Rich Communication Services), SMS, and other electronic communication methods. These communications may be sent to the mobile number or email address you have provided.
                  </p>
                  <p>
                    You can opt out of receiving promotional messages at any time by following the unsubscribe instructions provided in the communication or by contacting us directly. However, you may continue to receive transactional or service-related messages that are essential for providing our services.
                  </p>
                </div>
              </div>

              {/* Copyright Clause */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Copyright className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Copyright &amp; Intellectual Property
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                  All data showed and communicated on solvear.in is secured by copyright along with other licensed innovation laws. In any prospect your are not permitted to repost, rewrite or use the display of this website. If we come across any such misuse can go for legal steps thereby.
                </p>
              </div>

              {/* Data Security & Infrastructure Standards */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Lock className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Enterprise Data Security Standards
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/85">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>End-to-End Encryption:</strong> All API payloads, webhook deliveries, and database records are encrypted in transit (TLS 1.3) and at rest (AES-256).
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Strict Access Controls:</strong> Role-based access control (RBAC), multi-factor authentication, and audited log systems protect client message records.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Data Retention &amp; Deletion:</strong> Message logs and campaign analytics are retained in accordance with statutory requirements and can be purged upon account closure.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column: Office Locations & Fast Contact */}
            <div className="lg:col-span-4 space-y-6">
              {/* Quick Contact Box */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-4">
                <h4 className="font-display text-base font-bold text-foreground flex items-center gap-2">
                  <Building className="w-4 h-4 text-primary" />
                  <span>Privacy &amp; Data Officer</span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  For privacy requests, GDPR/DPDP inquiries, or data removal, contact our data protection desk.
                </p>

                <div className="pt-2 border-t border-border space-y-3 text-xs">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-foreground">+91 80160 81188</p>
                      <p className="text-[11px] text-muted-foreground">Mon - Sat, 9:30 AM - 7:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <p className="font-bold text-foreground">privacy@solvear.in</p>
                      <p className="text-[11px] text-muted-foreground">Data Protection &amp; Privacy Officer</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">Corporate Office</p>
                      <p className="text-[11px] text-muted-foreground">
                        C/O Dilip Kumar Ghosh, Gholapara, PO Sukchar, Kolkata, North 24 Parganas, West Bengal 700115, India
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full shadow-pink rounded-xl font-bold text-xs mt-2">
                  <Link to="/contact">Contact Privacy Desk</Link>
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <h4 className="font-display text-sm font-bold text-foreground">
                  Legal Documents
                </h4>
                <div className="space-y-2 text-xs">
                  <Link
                    to="/privacy"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 text-primary font-bold"
                  >
                    <span>Privacy Policy</span>
                    <span>→</span>
                  </Link>
                  <Link
                    to="/terms"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface text-foreground font-semibold transition"
                  >
                    <span>Terms and Conditions</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
