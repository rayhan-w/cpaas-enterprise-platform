'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Headphones, Menu, X, Phone, LayoutDashboard } from 'lucide-react';
import { Logo } from './Logo';

const NAV = [
  { label: 'Products', href: '/products' },
  { label: 'Features', href: '/features' },
  { label: 'White-label', href: '/white-label' },
  { label: 'Integrations', href: '/integrations' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Company', href: '/about' },
  { label: 'Contact', href: '/contact' },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 font-sans">
      {/* Top Utility Strip */}
      <div className="hidden bg-navy-deep text-navy-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <p className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-primary" aria-hidden />
            <span className="font-semibold">Talk to Sales:</span>
            <a href="tel:+8801700000000" className="hover:text-primary transition">
              +880 1700 000000 (Dhaka)
            </a>
            <span aria-hidden className="opacity-40">
              |
            </span>
            <a href="tel:+919230000000" className="hover:text-primary transition">
              +91 92300 00000 (Kolkata)
            </a>
          </p>
          <nav aria-label="Utility" className="flex items-center gap-4 font-semibold">
            <Link href="/contact" className="hover:text-primary transition">
              Help Desk
            </Link>
            <Link href="/integrations" className="hover:text-primary transition">
              Developer
            </Link>
            <Link href="/dashboard" className="hover:text-primary transition">
              Dashboard
            </Link>
            <Link href="/auth" className="hover:text-primary transition">
              Login
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-semibold transition-colors ${
                    isActive ? 'text-primary' : 'text-foreground/80 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/auth"
              className="hidden sm:inline-flex text-sm font-semibold px-4 py-2 rounded-xl border border-border text-foreground hover:bg-surface transition"
            >
              Login
            </Link>
            <Link
              href="/contact"
              className="hidden sm:inline-flex text-sm font-semibold px-5 py-2.5 rounded-xl bg-primary text-primary-foreground shadow-pink hover:bg-primary-hover transition"
            >
              Schedule a Consultation
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div className="border-t border-border bg-background lg:hidden animate-in fade-in">
            <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-6 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-semibold last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/auth"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"
              >
                Login
              </Link>
              <a
                href="tel:+8801700000000"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden /> +880 1700 000000
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
