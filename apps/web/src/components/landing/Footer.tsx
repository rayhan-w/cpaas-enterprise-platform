'use client';

import React from 'react';
import Link from 'next/link';
import {
  Radio,
  ShieldCheck,
  Globe,
  ArrowUpRight,
  Heart,
  Zap,
  CheckCircle2,
  BookOpen,
  Video,
  FileText,
  MessageSquare,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
                <Radio className="w-4 h-4" />
              </div>
              <div className="text-base font-extrabold text-white">Solvear.in API</div>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              All-in-one WhatsApp Marketing, AI Chatbot &amp; CPaaS Automation Platform. Engineered with Modular Monolith, NestJS, FastAPI Dual AI Engine, PostgreSQL, HAProxy, and Amazon SQS.
            </p>

            {/* Live Status Pill */}
            <div className="inline-flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl font-mono text-[11px] text-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational (99.99% Uptime)</span>
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
                  Facebook Messenger Bot
                </Link>
              </li>
              <li>
                <Link href="#channels" className="hover:text-white transition">
                  Instagram DM Automation
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

          {/* Resources & Integrations Col */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">Resources</div>
            <ul className="space-y-2 text-slate-400">
              <li>
                <Link href="#features" className="hover:text-white transition">
                  AI Bot Reply &amp; AI Tokens
                </Link>
              </li>
              <li>
                <Link href="#ecommerce" className="hover:text-white transition">
                  WooCommerce &amp; Shopify Plugin
                </Link>
              </li>
              <li>
                <Link href="#integrations" className="hover:text-white transition">
                  Google Sheets &amp; Form Flows
                </Link>
              </li>
              <li>
                <Link href="#developer" className="hover:text-white transition">
                  API Documentation &amp; Webhooks
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-white transition">
                  Knowledgebase &amp; Video Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Partner & Reseller Col */}
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
                <Link href="/dashboard" className="hover:text-white transition">
                  Enterprise Developer Console
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Sign In to Workspace
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Solvear.in (solvear API). All rights reserved.
          </div>

          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TRAI DLT &amp; GDPR Compliant</span>
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
