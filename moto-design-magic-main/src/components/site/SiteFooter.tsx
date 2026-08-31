import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Products", to: "/products" },
      { label: "Solutions", to: "/features" },
      { label: "Services & SaaS", to: "/white-label" },
      { label: "Integrations", to: "/integrations" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us & Journey", to: "/about#journey" },
      { label: "Leadership Team", to: "/about#leadership" },
      { label: "Newsroom", to: "/about#newsroom" },
      { label: "Careers", to: "/about#careers" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
  {
    title: "Legal & Trust",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms & Conditions", to: "/terms" },
      { label: "Refund Policy", to: "/refund" },
      { label: "DLT Compliance", to: "/products#bulk-sms" },
      { label: "Help Desk", to: "/contact" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <span className="font-display text-2xl font-bold">
            Solvear<span className="text-primary">.</span>
          </span>
          <p className="text-xs font-semibold text-primary mt-1">
            A unit of SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED
          </p>
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">
            Conversations that convert. Run WhatsApp, SMS, RCS, Voice, IVR and
            Social DMs from a single customer engagement platform built for growing businesses.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-navy-foreground/80">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" aria-hidden />
              <a href="tel:+918016081188" className="hover:text-primary font-bold">
                +91 80160 81188 (India)
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" aria-hidden />
              <a href="mailto:hello@solvear.io" className="hover:text-primary">
                hello@solvear.io
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary shrink-0" aria-hidden />
              <span>Maynaguri, Jalpaiguri, West Bengal, 735302 - India</span>
            </li>
          </ul>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-primary">
              {col.title}
            </h2>
            <ul className="mt-4 space-y-3 text-sm text-navy-foreground/75">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-navy-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-navy-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} SOLVEAR ADVERTISING (OPC) PRIVATE LIMITED. All rights reserved.</p>
          <p>ISO 9001:2018 Certified · MSME Registered · TRAI DLT Compliant</p>
        </div>
      </div>
    </footer>
  );
}
