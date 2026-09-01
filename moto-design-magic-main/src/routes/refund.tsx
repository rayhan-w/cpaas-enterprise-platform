import { createFileRoute, Link } from "@tanstack/react-router";
import { RefreshCw, CheckCircle2, Phone, Mail, MapPin, AlertCircle } from "lucide-react";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy — SOLVEAR ADVERTISING" },
      {
        name: "description",
        content:
          "Official Refund, Cancellation and Recharge Policy for Solvear CPaaS and Digital Marketing services.",
      },
      { property: "og:title", content: "Refund Policy — Solvear" },
      {
        property: "og:description",
        content: "Transparent cancellation and refund guidelines for Solvear services.",
      },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <>
      <PageHero
        eyebrow="Billing Policy"
        title="Cancellation & Refund Policy"
        description="Clear and transparent refund rules for Solvear CPaaS credits, subscription plans, and digital retainers."
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className="shadow-pink font-bold rounded-xl">
            <Link to="/contact">Billing Inquiries</Link>
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
        <div className="mx-auto max-w-4xl px-6 space-y-10 text-foreground/90">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
                <RefreshCw className="h-6 w-6" aria-hidden />
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
                  Policy Version: 2.1
                </span>
                <h2 className="font-display text-2xl font-extrabold text-foreground">
                  Refund & Credit Guidelines
                </h2>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              At <strong>SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED</strong>, we are committed to providing world-class telecom routes and customer service. Please read our cancellation and refund guidelines before recharging message credits or subscribing to monthly plans.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">1. Prepaid SMS & WhatsApp Credits</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Prepaid message recharge credits (Bulk SMS, WhatsApp API credits, Voice minutes) are non-refundable once activated and credited to your workspace account. Unutilized credits remain valid during your active validity term.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">2. Subscription Plan Cancellations</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You may cancel your recurring SaaS subscription plan at any time from your account console. Cancellation takes effect at the end of the current billing cycle, and no further automatic charges will occur.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-display text-xl font-bold text-foreground">3. Digital Marketing & Custom Software Retainers</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Custom software development, UI/UX design, and performance marketing retainer milestones are non-refundable once development or ad spend execution has commenced for the respective billing phase.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-8">
            <h3 className="font-display text-lg font-bold text-foreground">Refund Requests</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              If an erroneous duplicate transaction occurs, please email <strong>billing@solvear.io</strong> within 48 hours with your transaction reference. Valid duplicate payments will be refunded within 5–7 business days to the original payment method.
            </p>
          </div>
        </div>
      </section>

      <CtaBand
        title="Need assistance with an invoice or account statement?"
        description="Our finance team is available Monday to Saturday (9am - 8pm IST)."
      />
    </>
  );
}
