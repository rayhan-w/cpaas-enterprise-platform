import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  CheckCircle2,
  Loader2,
  Send,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Solvear — Request a Demo or Talk to Sales" },
      {
        name: "description",
        content:
          "Book a Solvear demo, talk to our sales team in Dhaka or Kolkata, or reach support over WhatsApp and email.",
      },
      { property: "og:title", content: "Contact Solvear" },
      {
        property: "og:description",
        content: "Request a demo or speak with a Solvear messaging expert today.",
      },
    ],
  }),
  component: Contact,
});

const CARDS = [
  {
    icon: Phone,
    title: "Talk to Sales",
    lines: ["+91 80160 81188 (India)", "Monday – Saturday: 9am – 8pm IST"],
    action: "tel:+918016081188",
    actionLabel: "Call Sales Desk",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["hello@solvear.io", "support@solvear.io"],
    action: "mailto:hello@solvear.io",
    actionLabel: "Send Email",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Direct",
    lines: ["Chat directly with solutions team (+91 80160 81188)", "Average reply under 3 minutes"],
    action: "https://wa.me/918016081188?text=Hello%20Solvear%20team,%20I%20would%20like%20to%20request%20a%20demo",
    actionLabel: "Open WhatsApp Chat",
  },
  {
    icon: MapPin,
    title: "Registered Office",
    lines: ["SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED", "Maynaguri, Jalpaiguri, West Bengal, 735302 - India"],
  },
];

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your Full Name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your Work Email");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your Phone or WhatsApp number");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please describe what you want to automate");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Thanks! Your demo request has been received. Our team will contact you shortly.");
    }, 600);
  }

  function handleReset() {
    setSubmitted(false);
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
  }

  return (
    <>
      <PageHero
        eyebrow="Contact & Solutions"
        title="Let's map your first automated conversation"
        description="Tell us about your messaging channels and volumes. We'll come back with a live demo tailored to your use case."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:+918016081188"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition backdrop-blur-xs"
          >
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span className="text-white">Call Sales: +91 80160 81188 (India)</span>
          </a>
          <a
            href="https://wa.me/918016081188?text=Hello%20Solvear%20team,%20I%20need%20a%20demo"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </PageHero>

      <section className="section-y bg-background font-sans">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Main Demo Form */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-elevated">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95">
                <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-100 text-emerald-600 mx-auto shadow-inner">
                  <CheckCircle2 className="h-9 w-9" />
                </div>
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Demo Request Received!
                </h2>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Our enterprise messaging architect will reach out to you on{" "}
                  <strong>{formData.phone}</strong> or <strong>{formData.email}</strong> within one business day.
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <Button
                    type="button"
                    onClick={handleReset}
                    variant="outline"
                    className="rounded-xl font-bold text-xs"
                  >
                    Submit Another Inquiry
                  </Button>
                  <Button
                    asChild
                    className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-bold text-xs gap-1.5"
                  >
                    <a
                      href={`https://wa.me/918016081188?text=Hi%20Solvear,%20I%20just%20submitted%20a%20demo%20request%20for%20${encodeURIComponent(formData.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Instant Connect on WhatsApp</span>
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Request a demo</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    All fields marked with * are required.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Full name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      autoComplete="name"
                      className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Work email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      autoComplete="email"
                      className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Phone / WhatsApp *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      autoComplete="tel"
                      className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      autoComplete="organization"
                      className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    What do you want to automate? *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="rounded-xl bg-surface border-border text-xs focus:ring-primary"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-surface border border-border text-[11px] text-muted-foreground flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span>
                    By submitting, you agree to receive follow-up communication from Solvear. We respect your privacy and never spam.
                  </span>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto shadow-pink rounded-xl font-bold text-xs py-6 px-8 cursor-pointer"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Sending Request...</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        <span>Send Request</span>
                      </span>
                    )}
                  </Button>

                  <a
                    href="https://wa.me/918016081188?text=Hi%20Solvear,%20I%20would%20like%20to%20discuss%20a%20demo%20with%20an%20architect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface hover:bg-muted font-bold text-xs text-foreground transition text-center"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Contact Details Cards */}
          <div className="space-y-4">
            {CARDS.map((c) => (
              <article
                key={c.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-xs flex items-start gap-4"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0 border border-primary/20">
                  <c.icon className="h-6 w-6" aria-hidden />
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-bold text-foreground">{c.title}</h3>
                  <div className="mt-1 space-y-0.5">
                    {c.lines.map((l) => (
                      <p key={l} className="text-xs text-muted-foreground">
                        {l}
                      </p>
                    ))}
                  </div>
                  {c.action && (
                    <a
                      href={c.action}
                      target={c.action.startsWith("http") ? "_blank" : undefined}
                      rel={c.action.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>{c.actionLabel}</span>
                      <span>→</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
