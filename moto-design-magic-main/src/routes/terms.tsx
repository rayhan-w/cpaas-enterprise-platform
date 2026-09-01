import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Scale,
  ShieldCheck,
  Radio,
  Copyright,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Lock,
  Building,
  HelpCircle,
} from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Solvear — Master Service Agreement" },
      {
        name: "description",
        content:
          "Terms and Conditions of Solvear. Read our Master Service Agreement, communication consent, copyright stipulations, and data protection policies.",
      },
      { property: "og:title", content: "Terms and Conditions — Solvear" },
    ],
  }),
  component: TermsPage,
});

export function TermsPage() {
  return (
    <div className="font-sans bg-background min-h-screen">
      {/* 1. Top Page Hero */}
      <PageHero
        eyebrow="Legal & Compliance"
        title="Terms and Conditions"
        description="Master Service Agreement and communication terms governing the use of Solvear CPaaS, Bulk SMS, WhatsApp Business API, RCS, and Digital Marketing platforms."
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
          <span className="text-foreground font-bold">Terms and Conditions</span>
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
                    <Scale className="h-6 w-6" />
                  </span>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                      Terms of Service
                    </span>
                    <h2 className="font-display text-2xl font-extrabold text-foreground">
                      Terms and Conditions
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
                    Communication &amp; Messaging Consent
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

              {/* Service Terms & Fair Usage */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Platform Fair Usage &amp; DLT Compliance
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-foreground/85">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>DLT Entity &amp; Template Approval:</strong> All commercial and transactional SMS traffic terminated in India must comply with TRAI DLT guidelines and registered sender headers.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>Meta WhatsApp Business Policy:</strong> Outbound WhatsApp campaign templates must comply with official Meta WhatsApp Business Messaging terms and recipient opt-in rules.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      <strong>SLA &amp; Support Guarantee:</strong> We maintain enterprise-grade 99.99% high availability with automatic multi-carrier failover routing and 24/7 technical monitoring.
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
                  <span>Contact Our Legal Desk</span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  For compliance inquiries, master agreements, or DLT registration support, reach out to our legal department.
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
                      <p className="font-bold text-foreground">care@solvear.in</p>
                      <p className="text-[11px] text-muted-foreground">Official Compliance &amp; Support</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-foreground">Registered Corporate Office</p>
                      <p className="text-[11px] text-muted-foreground">
                        C/O Dilip Kumar Ghosh, Gholapara, PO Sukchar, Kolkata, North 24 Parganas, West Bengal 700115, India
                      </p>
                    </div>
                  </div>
                </div>

                <Button asChild className="w-full shadow-pink rounded-xl font-bold text-xs mt-2">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>

              {/* Navigation Links */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <h4 className="font-display text-sm font-bold text-foreground">
                  Legal Documents
                </h4>
                <div className="space-y-2 text-xs">
                  <Link
                    to="/terms"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-primary/10 text-primary font-bold"
                  >
                    <span>Terms and Conditions</span>
                    <span>→</span>
                  </Link>
                  <Link
                    to="/privacy"
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface text-foreground font-semibold transition"
                  >
                    <span>Privacy Policy</span>
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
