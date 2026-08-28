import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
    lines: ["+91 80160 81188 (Direct / WhatsApp)", "Monday – Saturday: 9am – 8pm IST"],
  },
  { icon: Mail, title: "Email Us", lines: ["hello@solvear.io", "support@solvear.io"] },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    lines: ["Chat with the platform itself", "Average reply under 3 minutes"],
  },
  {
    icon: MapPin,
    title: "Head Office",
    lines: ["Level 7, Banani Trade Centre", "Dhaka 1213, Bangladesh"],
  },
];

function Contact() {
  const [submitting, setSubmitting] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    setTimeout(() => {
      setSubmitting(false);
      form.reset();
      toast.success("Thanks! Our team will reach out within one business day.");
    }, 600);
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's map your first automated conversation"
        description="Tell us about your channels and volumes. We'll come back with a demo tailored to your use case — not a generic slide deck."
      />

      <section className="section-y">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1.2fr_1fr]">
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-8 shadow-elevated"
          >
            <h2 className="font-display text-xl font-bold">Request a demo</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              All fields marked with * are required.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name *</Label>
                <Input id="name" name="name" required autoComplete="name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Work email *</Label>
                <Input id="email" name="email" type="email" required autoComplete="email" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone / WhatsApp *</Label>
                <Input id="phone" name="phone" required autoComplete="tel" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" autoComplete="organization" />
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <Label htmlFor="message">What do you want to automate? *</Label>
              <Textarea id="message" name="message" rows={5} required />
            </div>

            <Button type="submit" size="lg" className="mt-7 shadow-pink" disabled={submitting}>
              {submitting ? "Sending…" : "Send Request"}
            </Button>
          </form>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            {CARDS.map((c) => (
              <article key={c.title} className="rounded-xl border border-border bg-surface p-6">
                <c.icon className="h-6 w-6 text-primary" aria-hidden />
                <h2 className="mt-4 font-display text-base font-bold">{c.title}</h2>
                {c.lines.map((l) => (
                  <p key={l} className="mt-1 text-sm text-muted-foreground">
                    {l}
                  </p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
