import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Products", to: "/products" },
      { label: "Features", to: "/features" },
      { label: "Integrations", to: "/integrations" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "White-label Reseller", to: "/white-label" },
      { label: "E-commerce", to: "/features" },
      { label: "Agencies", to: "/white-label" },
      { label: "Support Teams", to: "/products" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Help Desk", to: "/contact" },
      { label: "Request a Demo", to: "/contact" },
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
          <p className="mt-4 max-w-sm text-sm text-navy-foreground/70">
            Conversations that convert. Run WhatsApp, SMS, Instagram, Messenger, Telegram and
            Webchat from a single automation platform built for growing businesses.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-navy-foreground/80">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-primary" aria-hidden />
              <a href="tel:+8801700000000" className="hover:text-primary">
                +880 1700 000000
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-primary" aria-hidden />
              <a href="mailto:hello@solvear.io" className="hover:text-primary">
                hello@solvear.io
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
              <span>Level 7, Banani Trade Centre, Dhaka 1213</span>
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
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-navy-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Solvear Technologies. All rights reserved.</p>
          <p>ISO 27001 aligned · DLT & Meta Business compliant</p>
        </div>
      </div>
    </footer>
  );
}
