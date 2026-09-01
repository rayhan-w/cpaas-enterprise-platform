import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileCheck,
  Shield,
  Scale,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Radio,
  Copyright,
  Building,
  Lock,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED" },
      {
        name: "description",
        content:
          "Terms and Conditions of SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED. Master Service Agreement and acceptable usage policies for Solvear CPaaS, Bulk SMS, WhatsApp Business API, RCS, and Digital Marketing platforms.",
      },
      { property: "og:title", content: "Terms & Conditions — Solvear" },
      {
        property: "og:description",
        content:
          "Official terms of service, communication consent, copyright, and governance policies for Solvear messaging platforms.",
      },
    ],
  }),
  component: TermsPage,
});

export function TermsPage() {
  return (
    <div className="font-sans">
      {/* 1. Top Page Hero */}
      <PageHero
        eyebrow="Legal & Compliance"
        title="Terms and Conditions"
        description="Master Service Agreement and communication terms governing the use of Solvear CPaaS, Bulk SMS, WhatsApp API, RCS, and Digital Marketing solutions."
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
            <span className="text-white">Call Sales: +91 80160 81188</span>
          </a>
        </div>
      </PageHero>

      {/* 2. Main Terms and Conditions Body (Exact Turain Structure & Clauses) */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-10 text-foreground/90">
          {/* Main Statement Box */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                <Scale className="h-6 w-6" />
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                  Master Agreement
                </span>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  Terms of Service &amp; User Agreement
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2">
              <p>
                <strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong> perceives the significance of ensuring privacy and fair service terms. Our security and usage strategy portrays what individual data we might gather and how we might utilize and ensure any close to home data that is made accessible to us.
              </p>
              <p>
                This site is owned by <strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong>. We are focused on keeping up with the classification, respectability and security of individual data and we will take all fitting specialized and authoritative safety efforts to guarantee that where any close to home data is given to us it will be ensured against loss, destruction and harm, and against unapproved or unintentional access, processing, deletion, move, use, alteration, revelation or other abuse.
              </p>
            </div>
          </div>

          {/* Consent for Electronic Communications */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Radio className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Express Consent for Communications
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              By providing your contact details, you expressly consent to receiving communications from us, including but not limited to transactional notifications, reminders, updates, promotional messages, and advertisements via RCS (Rich Communication Services), SMS, WhatsApp, Voice, and other electronic communication methods. These communications may be sent to the mobile number or email address you have provided.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              You can opt out of receiving promotional messages at any time by following the unsubscribe instructions provided in the communication or by contacting us directly. However, you may continue to receive transactional or service-related messages that are essential for providing our services.
            </p>
          </div>

          {/* Copyright Clause (Exact Turain Clause) */}
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

          {/* Service Policies & Governance */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                <Shield className="h-5 w-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Account Policies, Compliance &amp; SLA
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Account &amp; KYC Verification</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  All accounts utilizing Bulk SMS or WhatsApp Business API must fulfill mandatory identity checks and register Principal Entity IDs on Telecom DLT portals in compliance with Indian regulatory directives.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Acceptable Use &amp; Anti-Spam</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Solvear enforces a strict zero-tolerance anti-spam policy. Unsolicited spam, phishing, misleading financial schemes, or defamatory messages will lead to immediate account termination without refund.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>99.99% Enterprise Uptime SLA</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We guarantee high availability across OTP and transactional gateways with real-time multi-carrier failover routing and sub-second latency for verified messaging templates.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-surface border border-border space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Billing &amp; Tax Invoices</span>
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Prepaid messaging balances and enterprise subscriptions are invoiced with applicable 18% GST. Account validity and top-ups are strictly maintained per selected contract terms.
                </p>
              </div>
            </div>
          </div>

          {/* Governing Law & Contact */}
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-5">
            <h3 className="font-display text-lg font-bold text-foreground">
              Jurisdiction &amp; Official Contact Information
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes arising hereunder shall be subject to the exclusive jurisdiction of the competent courts in West Bengal, India.
            </p>

            <div className="space-y-2.5 text-xs font-semibold text-foreground pt-2">
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
                <a href="mailto:hello@solvear.io" className="hover:text-primary transition">hello@solvear.io</a>
                <span>•</span>
                <a href="mailto:support@solvear.io" className="hover:text-primary transition">support@solvear.io</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Bottom CTA */}
      <CtaBand
        title="Ready to get started with Solvear?"
        description="Connect with our sales team for enterprise volume pricing, onboarding assistance, and technical demos."
      />
    </div>
  );
}
