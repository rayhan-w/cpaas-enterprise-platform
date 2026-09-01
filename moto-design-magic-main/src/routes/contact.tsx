import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  Clock,
  Globe,
  Building,
  Check,
  ArrowRight,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Solvear | Sales, Support & Free Consultation (India)" },
      {
        name: "description",
        content:
          "Contact Solvear for sales, customer support, or a free consultation. Reach our team by phone (+91 80160 81188), email (hello@solvear.io), or WhatsApp.",
      },
      { property: "og:title", content: "Contact Solvear — Sales & Support" },
      {
        property: "og:description",
        content:
          "Get in touch with Solvear for enterprise CPaaS, WhatsApp Business API, SMS Gateway, and Digital Marketing solutions.",
      },
    ],
  }),
  component: ContactPage,
});

// Social media list with placeholder '#' links for user to update later
const SOCIAL_LINKS = [
  { name: "Facebook", icon: "ri-facebook-fill", url: "#" },
  { name: "Instagram", icon: "ri-instagram-line", url: "#" },
  { name: "LinkedIn", icon: "ri-linkedin-fill", url: "#" },
  { name: "Twitter / X", icon: "ri-twitter-x-line", url: "#" },
  { name: "YouTube", icon: "ri-youtube-fill", url: "#" },
  { name: "Pinterest", icon: "ri-pinterest-fill", url: "#" },
];

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    phone: "",
    subject: "",
    message: "",
    authorized: true,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your Name");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your Business Email");
      return;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your Phone / WhatsApp Number");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your Message");
      return;
    }
    if (!formData.authorized) {
      toast.error("Please agree to receive communications from Solvear");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Thank you! Your inquiry has been submitted. Our team will contact you shortly.");
    }, 600);
  }

  function handleReset() {
    setSubmitted(false);
    setFormData({
      name: "",
      email: "",
      website: "",
      phone: "",
      subject: "",
      message: "",
      authorized: true,
    });
  }

  return (
    <div className="font-sans">
      {/* 1. Top Page Hero */}
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        description="Reach us today to discuss the success laps of your digital and communication journey."
      >
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="tel:+918016081188"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm transition backdrop-blur-xs"
          >
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span className="text-white">Call Sales: +91 80160 81188</span>
          </a>
          <a
            href="https://wa.me/918016081188?text=Hello%20Solvear%20team,%20I%20would%20like%20to%20get%20in%20touch"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition shadow-sm"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </PageHero>

      {/* 2. Main Contact & Form Section (Exact Turain Match) */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Left Column (5 Cols): Office Locations & Direct Contacts */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Corporate Presence
                </span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                  Our Registered Office
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Have questions about CPaaS gateways, WhatsApp API, or digital marketing? Visit or call our central team.
                </p>
              </div>

              {/* Office 1: Registered & Corporate Headquarters */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shrink-0">
                    <Building className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      West Bengal Office (HQ)
                    </h3>
                    <p className="text-[11px] font-bold text-primary">
                      SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-foreground/85 pt-2 border-t border-border">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>
                      Maynaguri, Jalpaiguri, West Bengal, 735302 - India
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex flex-wrap gap-2 font-bold">
                      <a href="tel:+918016081188" className="hover:text-primary transition">
                        +91 80160 81188
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary shrink-0" />
                    <div className="flex flex-wrap gap-2 font-semibold">
                      <a href="mailto:hello@solvear.io" className="hover:text-primary transition">
                        hello@solvear.io
                      </a>
                      <span>•</span>
                      <a href="mailto:support@solvear.io" className="hover:text-primary transition">
                        support@solvear.io
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <span>Monday – Saturday: 9:00 AM – 8:00 PM IST</span>
                  </div>
                </div>
              </div>

              {/* Quick Communication Box */}
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-7 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shrink-0">
                    <Headphones className="h-5 w-5" />
                  </span>
                  <div>
                    <h4 className="font-display text-base font-bold text-foreground">
                      24/7 Enterprise Support
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Sub-3 minute response time for SLA clients.
                    </p>
                  </div>
                </div>
                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href="https://wa.me/918016081188"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Desk</span>
                  </a>
                  <a
                    href="tel:+918016081188"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-card border border-border hover:bg-surface text-foreground text-xs font-bold transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-primary" />
                    <span>Direct Call</span>
                  </a>
                </div>
              </div>

              {/* Social Media Channels Box (Placeholders for user to add later) */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-sm font-bold text-foreground">
                    Connect on Social Media
                  </h4>
                  <span className="text-[10px] text-muted-foreground font-semibold">Official Handles</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {SOCIAL_LINKS.map((s) => (
                    <a
                      key={s.name}
                      href={s.url}
                      onClick={(e) => {
                        if (s.url === "#") {
                          e.preventDefault();
                          toast.info(`${s.name} official profile will be linked soon.`);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:border-primary/40 hover:text-primary text-xs font-medium text-muted-foreground transition"
                      title={s.name}
                    >
                      <Share2 className="w-3 h-3 text-primary" />
                      <span>{s.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): "Get Free Consultation" Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-elevated">
                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95">
                    <div className="grid h-16 w-16 place-items-center rounded-3xl bg-emerald-100 text-emerald-600 mx-auto shadow-inner">
                      <CheckCircle2 className="h-9 w-9" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-foreground">
                      Consultation Request Received!
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Thank you, <strong>{formData.name}</strong>. Our solutions architect will call you on{" "}
                      <strong>{formData.phone}</strong> or email <strong>{formData.email}</strong> within one business day.
                    </p>
                    <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                      <Button
                        type="button"
                        onClick={handleReset}
                        variant="outline"
                        className="rounded-xl font-bold text-xs"
                      >
                        Submit Another Request
                      </Button>
                      <Button
                        asChild
                        className="rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm font-bold text-xs gap-1.5"
                      >
                        <a
                          href={`https://wa.me/918016081188?text=Hi%20Solvear,%20I%20just%20submitted%20a%20consultation%20request%20for%20${encodeURIComponent(formData.name)}`}
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
                  <form onSubmit={onSubmit} className="space-y-5">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                        Free Consultation
                      </span>
                      <h2 className="mt-1 font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                        Get Free Consultation
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                        Reach Us Today To Discuss The Success Laps Of Your Digital Journey
                      </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 pt-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          Name *
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
                          Email *
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
                        <Label htmlFor="website" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          Website URL
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                          placeholder="https://"
                          className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          Phone Number *
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
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Subject
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="h-11 rounded-xl bg-surface border-border text-xs focus:ring-primary"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Message *
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

                    {/* Checkbox Authorization */}
                    <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="authorize-check"
                        checked={formData.authorized}
                        onChange={(e) => setFormData({ ...formData, authorized: e.target.checked })}
                        className="mt-1 h-4 w-4 rounded text-primary focus:ring-primary cursor-pointer shrink-0"
                      />
                      <label htmlFor="authorize-check" className="text-[11px] text-muted-foreground cursor-pointer select-none leading-relaxed">
                        "I Authorize SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED to send notifications via SMS / RCS / Call / Email / WhatsApp"
                      </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto shadow-pink rounded-xl font-bold text-xs py-6 px-10 cursor-pointer"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Submitting...</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            <span>Submit Consultation</span>
                          </span>
                        )}
                      </Button>

                      <a
                        href="https://wa.me/918016081188?text=Hi%20Solvear,%20I%20would%20like%20to%20get%20a%20free%20consultation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-surface hover:bg-muted font-bold text-xs text-foreground transition text-center"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Google Maps / Office Location Embed */}
      <section className="bg-surface border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl border border-border overflow-hidden shadow-xs bg-card">
            <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Our Corporate Location
                </h3>
                <p className="text-xs text-muted-foreground">
                  Maynaguri, Jalpaiguri, West Bengal, 735302 - India
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Maynaguri,+Jalpaiguri,+West+Bengal+735302"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
              >
                <span>Open in Google Maps</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
            <iframe
              title="Solvear Corporate Location Map"
              src="https://maps.google.com/maps?q=Maynaguri,%20Jalpaiguri,%20West%20Bengal%20735302&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full grayscale-25"
            />
          </div>
        </div>
      </section>

      {/* 4. Bottom CTA Band */}
      <CtaBand
        title="Ready to transform customer conversations?"
        description="Talk to our CPaaS engineers and digital growth experts today. We're ready to deploy your stack."
      />
    </div>
  );
}
