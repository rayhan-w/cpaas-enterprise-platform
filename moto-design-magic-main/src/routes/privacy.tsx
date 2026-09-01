import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  BellRing,
  Copyright,
  Radio,
  MessageCircle,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED" },
      {
        name: "description",
        content:
          "Privacy Policy of SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED. Learn how we collect, protect, and process user data across our CPaaS, SMS, WhatsApp, and RCS messaging platforms.",
      },
      { property: "og:title", content: "Privacy Policy — Solvear" },
      {
        property: "og:description",
        content:
          "Transparent data protection, copyright, and communication policies for Solvear messaging platforms.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

export function PrivacyPolicyPage() {
  return (
    <div className="font-sans">
      {/* 1. Top Page Hero */}
      <PageHero
        eyebrow="Legal & Governance"
        title="Privacy Policy"
        description="SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED perceives the significance of ensuring privacy and safeguarding personal data across all communication channels."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl">
            <Link to="/contact">Contact Compliance Desk</Link>
          </Button>
          <a
            href="tel:+918016081188"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition backdrop-blur-xs"
          >
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span className="text-white">Call Sales: +91 80160 81188</span>
          </a>
        </div>
      </PageHero>

      {/* 2. Main Privacy Policy Body (Exact Turain Structure & Clauses) */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-10 text-foreground/90">
          {/* Main Statement Box */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                  Official Policy Document
                </span>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  Privacy Policy &amp; Data Security
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2">
              <p>
                <strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong> perceives the significance of ensuring privacy. Our security strategy portrays what individual data we might gather and how we might utilize and ensure any close to home data that is made accessible to us.
              </p>
              <p>
                This site is owned by <strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong>. We are focused on keeping up with the classification, respectability and security of individual data and we will take all fitting specialized and authoritative safety efforts to guarantee that where any close to home data is given to us it will be ensured against loss, destruction and harm, and against unapproved or unintentional access, processing, deletion, move, use, alteration, revelation or other abuse.
              </p>
            </div>
          </div>

          {/* Consent & Electronic Communications */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Radio className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Express Consent &amp; Communication Channels
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              By providing your contact details, you expressly consent to receiving communications from us, including but not limited to transactional notifications, reminders, updates, promotional messages, and advertisements via RCS (Rich Communication Services), SMS, WhatsApp, Voice, and other electronic communication methods. These communications may be sent to the mobile number or email address you have provided.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You can opt out of receiving promotional messages at any time by following the unsubscribe instructions provided in the communication or by contacting us directly. However, you may continue to receive transactional or service-related messages that are essential for providing our services.
            </p>
          </div>

          {/* Copyright Section (Exact Turain Clause) */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Copyright className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Copyright &amp; Intellectual Property
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              All data showed and communicated on <strong>solvear.in</strong> (and solvear.io) is secured by copyright along with other licensed innovation laws. In any prospect you are not permitted to repost, rewrite or use the display of this website. If we come across any such misuse, we will take legal steps thereby.
            </p>
          </div>

          {/* Information We Collect & Usage */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Lock className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Data Collection &amp; Purpose Specification
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Account &amp; KYC Information</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Full name, corporate email address, contact numbers, organization credentials, GSTIN/PAN, and required documentation for TRAI DLT scrubbing and carrier white-listing.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Messaging &amp; Gateway Logs</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Delivery status receipts (DLR), sender headers, timestamps, operator latency metrics, and API interaction data strictly used for quality optimization and billing transparency.
                </p>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                How We Safeguard Your Information:
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>256-bit SSL/TLS end-to-end encryption across all API endpoints and web consoles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Zero sale, rental, or unauthorized sharing of customer data or contact books with third parties.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Automated audit logging and strict role-based access control (RBAC) across all servers.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Grievance & Contact Information */}
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-5">
            <h3 className="font-display text-lg font-bold text-foreground">
              Grievance &amp; Compliance Officer
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact our compliance desk:
            </p>

            <div className="space-y-2.5 text-xs font-semibold text-foreground">
              <p className="flex items-center gap-2">
                <Building className="w-4 h-4 text-primary shrink-0" />
                <span>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>Maynaguri, Jalpaiguri, West Bengal, 735302 - India</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+918016081188" className="hover:text-primary transition">+91 80160 81188</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:privacy@solvear.io" className="hover:text-primary transition">privacy@solvear.io</a>
                <span>•</span>
                <a href="mailto:hello@solvear.io" className="hover:text-primary transition">hello@solvear.io</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom CTA */}
      <CtaBand
        title="Have questions about our data security or compliance?"
        description="Our legal and technical team in India is ready to assist you with compliance documentation."
      />
    </div>
  );
}
