'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { Headphones, ShieldCheck, Mail, Phone } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-navy-foreground font-sans border-t border-navy-soft">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Logo className="text-white" />
            <p className="max-w-sm text-sm text-navy-foreground/70 leading-relaxed font-normal">
              Solvear is an all-in-one multi-channel WhatsApp marketing, chatbot automation and CPaaS platform. Built for businesses, eCommerce stores and white-label agencies.
            </p>
            <div className="pt-2 text-xs text-navy-foreground/80 space-y-2 font-medium">
              <p className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-primary" />
                <span>24/7 Support Desk: support@solvear.in</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" aria-hidden />
                <a href="tel:+918016081188" className="hover:text-primary font-bold">
                  +91 80160 81188
                </a>
              </p>
            </div>
          </div>

          {/* Products Col */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Products
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-foreground/75 font-medium">
              <li>
                <Link href="/products" className="hover:text-primary transition">
                  WhatsApp Cloud API
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition">
                  Instagram DM Automation
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition">
                  AI Chatbot (OpenAI &amp; Gemini)
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition">
                  Omni-Channel Shared Inbox
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-primary transition">
                  Visual Flow Builder
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Solutions Col */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Solutions
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-foreground/75 font-medium">
              <li>
                <Link href="/features" className="hover:text-primary transition">
                  eCommerce Cart Recovery
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary transition">
                  1-Click COD Verification
                </Link>
              </li>
              <li>
                <Link href="/white-label" className="hover:text-primary transition">
                  White-label Reseller Hub
                </Link>
              </li>
              <li>
                <Link href="/integrations" className="hover:text-primary transition">
                  50+ Integrations &amp; Gateways
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-primary transition">
                  Pricing Plans &amp; AI Tokens
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal Col */}
          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-navy-foreground/75 font-medium">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  About Solvear
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition">
                  Client Console
                </Link>
              </li>
              <li>
                <span className="hover:text-primary transition cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="hover:text-primary transition cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-14 border-t border-navy-soft pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-foreground/60">
          <p>© {new Date().getFullYear()} Solvear.in. All rights reserved.</p>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Official Meta Cloud API &amp; TRAI DLT Compliant</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
