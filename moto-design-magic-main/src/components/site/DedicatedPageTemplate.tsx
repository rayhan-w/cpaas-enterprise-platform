import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Zap,
  Sparkles,
  HelpCircle,
  Layers,
  ChevronRight,
  Headphones,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CtaBand } from "@/components/site/CtaBand";
import type { PageDetail } from "@/data/allPagesData";
import { ALL_PAGES } from "@/data/allPagesData";

export function DedicatedPageTemplate({ page }: { page: PageDetail }) {
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const Icon = page.icon;

  // Get related pages from same category
  const related = Object.values(ALL_PAGES)
    .filter((p) => p.category === page.category && p.slug !== page.slug)
    .slice(0, 3);

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConsultSubmitted(true);
      toast.success("Consultation request received! Our expert will call you shortly.");
      setTimeout(() => {
        setIsConsultOpen(false);
        setConsultSubmitted(false);
        setForm({ name: "", email: "", phone: "", company: "", message: "" });
      }, 2000);
    }, 600);
  };

  const getParentPath = (category: string) => {
    switch (category) {
      case "Products":
        return "/products";
      case "Solutions":
        return "/features";
      case "Company":
        return "/about";
      case "Services":
        return "/white-label";
      default:
        return "/";
    }
  };

  const getPageLink = (p: PageDetail) => {
    switch (p.category) {
      case "Products":
        return `/products/${p.slug}`;
      case "Solutions":
        return `/solutions/${p.slug}`;
      case "Company":
        return `/company/${p.slug}`;
      case "Services":
        return `/services/${p.slug}`;
      default:
        return `/${p.slug}`;
    }
  };

  return (
    <div className="font-sans">
      {/* 1. Dedicated Hero Section */}
      <section className="relative isolate overflow-hidden bg-navy-deep text-navy-foreground py-16 sm:py-24 border-b border-navy-soft">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-navy-foreground/60 mb-6">
            <Link to="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <Link to={getParentPath(page.category) as any} className="hover:text-primary transition">{page.category}</Link>
            <span>/</span>
            <span className="text-primary font-bold">{page.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-extrabold uppercase tracking-wider">
                <Icon className="w-3.5 h-3.5" />
                <span>{page.badge}</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white">
                {page.headline}
              </h1>

              <p className="text-base sm:text-lg text-primary font-semibold">
                {page.tagline}
              </p>

              <p className="text-sm sm:text-base text-navy-foreground/80 leading-relaxed max-w-2xl">
                {page.intro}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3.5">
                <Button
                  size="lg"
                  onClick={() => setIsConsultOpen(true)}
                  className="shadow-pink text-xs sm:text-sm font-bold px-7 py-5 sm:py-6 rounded-xl"
                >
                  Request a Demo
                </Button>
                <a
                  href="tel:+918016081188"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-3.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs sm:text-sm transition"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Talk to Expert (+91 80160 81188)</span>
                </a>
              </div>
            </div>

            {/* Visual Icon Badge Box */}
            <div className="hidden lg:flex flex-col items-center justify-center p-10 rounded-3xl bg-white/5 border border-white/10 shadow-2xl text-center space-y-4 max-w-sm shrink-0">
              <span className="grid h-24 w-24 place-items-center rounded-3xl bg-primary/20 border border-primary/40 text-primary shadow-xl">
                <Icon className="h-12 w-12" />
              </span>
              <h3 className="font-display text-xl font-bold text-white">{page.name}</h3>
              <p className="text-xs text-navy-foreground/70">{page.badge}</p>
              <div className="pt-2 border-t border-white/10 w-full flex items-center justify-center gap-2 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Enterprise SLA Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="border-b border-border bg-surface py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {page.stats.map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-card border border-border text-center sm:text-left">
                <p className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  {s.value}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Features / Capabilities */}
      <section className="section-y bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
              Core Capabilities
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
              Engineered for High Performance &amp; Scale
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything your enterprise needs to deploy {page.name} without friction.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-3xl border border-border bg-card shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                    <CheckCircle2 className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base font-bold text-foreground">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Use Cases & Workflows */}
      {page.useCases.length > 0 && (
        <section className="section-y bg-surface border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Real-World Applications
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                How Industry Leaders Use {page.name}
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {page.useCases.map((uc) => (
                <div key={uc.title} className="p-8 rounded-3xl border border-border bg-card shadow-xs space-y-5">
                  <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <span>{uc.title}</span>
                  </h3>
                  <ul className="space-y-3">
                    {uc.points.map((pt) => (
                      <li key={pt} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500 font-bold" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. FAQs Section */}
      {page.faqs.length > 0 && (
        <section className="section-y bg-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Frequently Asked Questions
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
                Got Questions About {page.name}?
              </h2>
            </div>

            <div className="space-y-4">
              {page.faqs.map((faq) => (
                <div key={faq.q} className="p-6 rounded-2xl border border-border bg-card space-y-2">
                  <h3 className="font-display text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Explore Related Pages */}
      {related.length > 0 && (
        <section className="section-y bg-surface border-t border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                  Explore More
                </span>
                <h3 className="font-display text-xl font-bold text-foreground">
                  Related {page.category}
                </h3>
              </div>
              <Link to={getParentPath(page.category) as any} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                <span>View All {page.category}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((rel) => {
                const RelIcon = rel.icon;
                return (
                  <Link
                    key={rel.slug}
                    to={getPageLink(rel) as any}
                    className="group p-6 rounded-3xl border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition">
                        <RelIcon className="h-5 w-5" />
                      </span>
                      <h4 className="font-display text-base font-bold text-foreground group-hover:text-primary transition">
                        {rel.name}
                      </h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{rel.intro}</p>
                    </div>
                    <span className="pt-4 text-xs font-bold text-primary group-hover:underline inline-flex items-center gap-1">
                      <span>Explore {rel.name}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. Interactive Consultation Modal */}
      {isConsultOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 relative">
            <button
              type="button"
              onClick={() => setIsConsultOpen(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1 rounded-lg bg-surface hover:bg-muted transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-primary">
                Expert Consultation
              </span>
              <h3 className="font-display text-2xl font-bold text-foreground">
                Request a Demo for {page.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                Speak directly with our enterprise solutions team in India.
              </p>
            </div>

            {consultSubmitted ? (
              <div className="my-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-base">Request Received!</h4>
                <p className="text-xs">Our specialist will call you on <strong>{form.phone}</strong> shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="mt-6 space-y-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 80160 81188"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Company Name</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="e.g. Acme Corp"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">Project Notes / Questions</label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder={`Tell us about your ${page.name} requirements...`}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full shadow-pink py-3 rounded-xl text-xs font-bold mt-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : `Schedule ${page.name} Demo`}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}

      <CtaBand
        title={`Ready to deploy ${page.name}?`}
        description="Connect with our telecom & messaging architects in India to tailor your custom solution."
      />
    </div>
  );
}
