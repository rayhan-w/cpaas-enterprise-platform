'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  FileText,
  Workflow,
  Zap,
  Globe,
  CheckCircle2,
  ArrowRight,
  Database,
  Calendar,
  Share2,
} from 'lucide-react';
import {
  GoogleSheetsIcon,
  GoogleFormsIcon,
  ZapierIcon,
  WhatsAppIcon,
} from '@/components/common/BrandIcons';

export function FormsGoogleSheetsWebhooks() {
  return (
    <section className="py-20 md:py-28 relative bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 font-mono">
            <GoogleSheetsIcon className="w-4 h-4" />
            <span>Google Sheets &amp; Webhook Automations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Automate WhatsApp with Google Sheets, Webforms &amp; Webhooks
          </h2>
          <p className="text-base text-slate-600">
            Trigger personalized messages automatically when new rows appear in Google Sheets or when users submit Google Forms, WPForms, or Elementor forms.
          </p>
        </div>

        {/* 4 Feature Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Google Sheets */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-4 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2.5 shadow-xs">
                <GoogleSheetsIcon className="w-full h-full" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Google Sheets Automation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automate sending WhatsApp messages directly from Google Sheets rows. Save incoming leads, customer responses, and order data back to sheets in real time.
              </p>
              <div className="space-y-2 pt-2 text-sm text-slate-700 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>2-Way Live Sheet Sync</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bulk Sheet Dispatch</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-mono text-emerald-800 font-bold bg-emerald-100/80 px-3 py-1.5 rounded-xl border border-emerald-200">
              ✓ Automated Sheet Row Triggers
            </div>
          </div>

          {/* Feature 2: Google Forms & WPForms */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-4 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2.5 shadow-xs">
                <GoogleFormsIcon className="w-full h-full" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Google Forms &amp; WP Forms</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect Google Forms, WPForms, and Elementor forms to collect user data and trigger instant WhatsApp confirmation messages and onboarding sequences.
              </p>
              <div className="space-y-2 pt-2 text-sm text-slate-700 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Instant Form Auto-Reply</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>WP Elementor Integration</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-mono text-blue-800 font-bold bg-blue-100/80 px-3 py-1.5 rounded-xl border border-blue-200">
              ✓ 1-Click Form Webhooks
            </div>
          </div>

          {/* Feature 3: Outbound Webhook Workflow */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-4 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center p-2.5 shadow-xs">
                <ZapierIcon className="w-full h-full" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Zapier &amp; Webhook Flows</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Trigger a webhook or external API call during chatbot conversations to send user responses to external CRMs, ERPs, databases, or webhook endpoints.
              </p>
              <div className="space-y-2 pt-2 text-sm text-slate-700 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>JSON Payload Forwarding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>5,000+ Apps with Zapier</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-mono text-indigo-800 font-bold bg-indigo-100/80 px-3 py-1.5 rounded-xl border border-indigo-200">
              ✓ Low-Latency Webhook Queue
            </div>
          </div>

          {/* Feature 4: Auto Responder (SMS & Email) */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-7 space-y-4 flex flex-col justify-between hover:shadow-lg hover:border-slate-300 transition">
            <div className="space-y-3.5">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 border border-purple-200 flex items-center justify-center text-purple-700 shadow-xs">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Multi-Channel Fallback</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Collect emails and phone numbers inside the bot. Automatically trigger fallback SMS or email campaigns via Twilio, Postmark, AWS SES, or SMTP.
              </p>
              <div className="space-y-2 pt-2 text-sm text-slate-700 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>SMS &amp; Email Fallback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Google Calendar Sync</span>
                </div>
              </div>
            </div>
            <div className="text-xs font-mono text-purple-800 font-bold bg-purple-100/80 px-3 py-1.5 rounded-xl border border-purple-200">
              ✓ Omni-Channel Fallback
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
