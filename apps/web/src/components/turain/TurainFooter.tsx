'use client';

import React from 'react';
import Link from 'next/link';
import {
  Radio,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Globe,
  ArrowRight,
  Headphones,
  CheckCircle2,
} from 'lucide-react';
import {
  WhatsAppIcon,
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
} from '@/components/common/BrandIcons';

export function TurainFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 text-xs border-t border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-14">
          {/* Brand & Corporate Overview (Col 1-2) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Radio className="w-5 h-5" />
              </div>
              <div className="text-lg font-extrabold text-white">
                Turain<span className="text-blue-400">Group</span> CPaaS
              </div>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
              Turain Software is a leading CPaaS platform in India for customer engagement across Bulk SMS, WhatsApp Business API, RCS, Voice and IVR. Run compliant, automated communication from one unified dashboard.
            </p>

            {/* Direct Contact Links */}
            <div className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+91 98765 43210 / +91 91234 56789 (24/7 Desk)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>sales@turaingrp.com | support@turaingrp.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Kolkata HQ: Sector V, Salt Lake • Bengaluru Hub: Bellandur</span>
              </div>
            </div>

            {/* Live Uptime Pill */}
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl font-mono text-[11px] text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.99% Uptime SLA)</span>
            </div>
          </div>

          {/* Products Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Products</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#products" className="hover:text-white transition">
                  DLT-Compliant Bulk SMS
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-white transition">
                  WhatsApp Business API
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-white transition">
                  RCS Business Messaging
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-white transition">
                  Voice Call &amp; Cloud IVR
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-white transition">
                  OTP SMS Service (<span className="text-emerald-400">3.2s SLA</span>)
                </Link>
              </li>
              <li>
                <Link href="#products" className="hover:text-white transition">
                  DLT Registration Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Solutions</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#industries" className="hover:text-white transition">
                  Banking &amp; Financial OTP
                </Link>
              </li>
              <li>
                <Link href="#industries" className="hover:text-white transition">
                  E-Commerce COD &amp; Cart
                </Link>
              </li>
              <li>
                <Link href="#industries" className="hover:text-white transition">
                  Education &amp; Admissions
                </Link>
              </li>
              <li>
                <Link href="#industries" className="hover:text-white transition">
                  Healthcare Reminders
                </Link>
              </li>
              <li>
                <Link href="#industries" className="hover:text-white transition">
                  Real Estate Launches
                </Link>
              </li>
              <li>
                <Link href="#industries" className="hover:text-white transition">
                  Transport &amp; Logistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer & Tools Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Resources &amp; Tools</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#developer" className="hover:text-white transition">
                  Developer REST API Docs
                </Link>
              </li>
              <li>
                <Link href="#steps" className="hover:text-white transition">
                  5-Step Onboarding Guide
                </Link>
              </li>
              <li>
                <Link href="#reseller" className="hover:text-white transition">
                  White-Label Reseller Hub
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition">
                  TRAI DND Search &amp; Validator
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Enterprise Dashboard Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Turain Group (Turain Software Private Limited). All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1 text-slate-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>TRAI DLT &amp; ISO 27001 Certified</span>
            </span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
