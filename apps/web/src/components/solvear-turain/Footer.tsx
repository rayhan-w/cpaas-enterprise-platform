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

export function SolvearTurainFooter() {
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
                Solvear<span className="text-blue-400">.in</span> API &amp; AI
              </div>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed font-normal">
              Solvear is an all-in-one WhatsApp Marketing, AI Chatbot, and CPaaS Automation platform. Engineered with a high-throughput Modular Monolith, NestJS, FastAPI Dual AI Engine, PostgreSQL, HAProxy, and Amazon SQS.
            </p>

            {/* Direct Contact Links */}
            <div className="space-y-2 pt-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>+91 98765 43210 (24/7 Enterprise Desk)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>support@solvear.in | sales@solvear.in</span>
              </div>
            </div>

            {/* Live Uptime Pill */}
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3.5 py-1.5 rounded-xl font-mono text-[11px] text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.99% Uptime SLA)</span>
            </div>
          </div>

          {/* Channels Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Channels</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#channels" className="hover:text-white transition">
                  WhatsApp Cloud API
                </Link>
              </li>
              <li>
                <Link href="#channels" className="hover:text-white transition">
                  Instagram DM Automation
                </Link>
              </li>
              <li>
                <Link href="#channels" className="hover:text-white transition">
                  Facebook Messenger Bot
                </Link>
              </li>
              <li>
                <Link href="#channels" className="hover:text-white transition">
                  Telegram Bot Engine
                </Link>
              </li>
              <li>
                <Link href="#channels" className="hover:text-white transition">
                  Website Live Chat &amp; Translator
                </Link>
              </li>
            </ul>
          </div>

          {/* Features & AI Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Features &amp; AI</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#features" className="hover:text-white transition">
                  AI Bot Reply (OpenAI &amp; Gemini)
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition">
                  Pay As You Go AI Tokens
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-white transition">
                  Visual Drag &amp; Drop Builder
                </Link>
              </li>
              <li>
                <Link href="#ecommerce" className="hover:text-white transition">
                  Shopify &amp; WooCommerce COD
                </Link>
              </li>
              <li>
                <Link href="#ecommerce" className="hover:text-white transition">
                  Google Sheets 2-Way Sync
                </Link>
              </li>
              <li>
                <Link href="#ecommerce" className="hover:text-white transition">
                  WhatsApp Form Flows
                </Link>
              </li>
            </ul>
          </div>

          {/* Partners & Resources Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Partners &amp; Reseller</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#reseller" className="hover:text-white transition">
                  White-Label Reseller Solution
                </Link>
              </li>
              <li>
                <Link href="#reseller" className="hover:text-white transition">
                  Affiliate Partner Program
                </Link>
              </li>
              <li>
                <Link href="#reseller" className="hover:text-white transition">
                  Solvear AI Startup Program
                </Link>
              </li>
              <li>
                <Link href="#developer" className="hover:text-white transition">
                  Developer REST API Docs
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
            © 2026 Solvear.in (Solvear API Platform). All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1 text-slate-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Meta Cloud API &amp; TRAI DLT Compliant</span>
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
