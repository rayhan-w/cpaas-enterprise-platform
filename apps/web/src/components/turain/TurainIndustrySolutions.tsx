'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  ShoppingBag,
  HeartPulse,
  Building2,
  Landmark,
  Truck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Building,
} from 'lucide-react';
import {
  WhatsAppIcon,
} from '@/components/common/BrandIcons';

interface IndustrySpec {
  id: string;
  name: string;
  badge: string;
  icon: any;
  headline: string;
  desc: string;
  useCases: string[];
  metric: string;
  metricLabel: string;
  exampleSnippet: string;
}

const INDUSTRIES_DATA: IndustrySpec[] = [
  {
    id: 'ecommerce',
    name: 'E-commerce & Retail',
    badge: 'D2C & Marketplaces',
    icon: ShoppingBag,
    headline: 'WhatsApp API for Abandoned Cart Recovery & COD Fraud Prevention',
    desc: 'Recover up to 28% of abandoned checkouts, slash Return-to-Origin (RTO) courier losses with 1-click COD confirmation, and send real-time order dispatch notifications.',
    useCases: [
      'Automated 15m/2h Abandoned Cart WhatsApp Nudge with discount code',
      'Instant Cash on Delivery (COD) 1-Click WhatsApp Verification',
      'Real-time courier live tracking and delivery alerts',
      'In-chat WhatsApp Product Catalogs with WhatsApp Pay / UPI',
    ],
    metric: '65% RTO Reduction',
    metricLabel: 'Average savings on courier shipping losses',
    exampleSnippet: '📦 Order #ORD-98214: Hi Sarah, please tap [Confirm Order] to verify your COD delivery for UrbanStyle.',
  },
  {
    id: 'banking',
    name: 'Banking & Financial',
    badge: 'Fintech & NBFCs',
    icon: Landmark,
    headline: 'Secure High-Throughput OTP Delivery & Fraud Alerts',
    desc: 'Ensure 99.98% delivery of critical 2FA authentication OTPs and instant transaction notifications with telecom-direct priority routing and full audit logging.',
    useCases: [
      'Ultra-fast 2FA login OTP delivery (< 3.2s latency SLA)',
      'Instant credit/debit transaction alerts via SMS & WhatsApp',
      'Loan application status and KYC document upload via WhatsApp Flows',
      'Automated EMI payment due date and account balance reminders',
    ],
    metric: '< 3.2s OTP SLA',
    metricLabel: 'Millisecond priority dispatch across India',
    exampleSnippet: '🔐 Your Secure Bank OTP is 489210. Valid for 5 mins. Do NOT share with anyone.',
  },
  {
    id: 'education',
    name: 'Education & EdTech',
    badge: 'Schools & Universities',
    icon: GraduationCap,
    headline: 'Bulk SMS & WhatsApp for Admissions, Attendance & Fee Alerts',
    desc: 'Streamline institutional communications with parents, students, and staff for admission alerts, daily attendance tracking, fee payment reminders, and exam schedules.',
    useCases: [
      'Automated student attendance SMS alerts to parents every morning',
      'Admission counselling and brochure sharing via WhatsApp',
      'Automated fee payment link dispatches with UPI payment gateway',
      'Urgent circulars, weather holidays, and exam timetable broadcasts',
    ],
    metric: '98% Parent Reach',
    metricLabel: 'Instant SMS & WhatsApp delivery to guardian mobiles',
    exampleSnippet: '🎓 Delhi Public School: Fee due notice for Term 2. Click here to pay securely via UPI: https://pay.dps.edu/fee_89',
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Clinics',
    badge: 'Hospitals & Diagnostics',
    icon: HeartPulse,
    headline: 'Automated Appointment Reminders & Diagnostic Reports',
    desc: 'Reduce patient no-shows, deliver PDF diagnostic test reports directly on WhatsApp, and schedule doctor appointments with interactive chat flows.',
    useCases: [
      'Automated appointment reminder 24 hours prior with reschedule buttons',
      'Instant PDF lab test reports delivery securely on WhatsApp',
      'Doctor appointment booking and OPD token management',
      'Post-consultation medication regimen and feedback reminders',
    ],
    metric: '45% Fewer No-Shows',
    metricLabel: 'Reduction in missed OPD clinic appointments',
    exampleSnippet: '🏥 Apollo Clinics: Your blood test report is ready. Click below to download your verified PDF report.',
  },
  {
    id: 'realestate',
    name: 'Real Estate & Builders',
    badge: 'Property Developers',
    icon: Building2,
    headline: 'WhatsApp Campaigns for Property Launches & Site Visits',
    desc: 'Promote residential and commercial projects with rich media WhatsApp campaigns, virtual video walkthroughs, and automated site visit booking workflows.',
    useCases: [
      'Interactive project brochure and floor plan PDFs via WhatsApp',
      'Automated site visit scheduling with Google Maps pin navigation',
      'Lead qualification bot before routing high-intent buyers to brokers',
      'Price rise alerts and festive booking discount broadcasts',
    ],
    metric: '3.8x Site Visits',
    metricLabel: 'Higher conversion from enquiries to site walkthroughs',
    exampleSnippet: '🏢 Prestige Heights: Explore our new luxury 3BHK towers with pool views. Tap to download floor plan PDF.',
  },
  {
    id: 'logistics',
    name: 'Transport & Logistics',
    badge: 'Supply Chain & Fleets',
    icon: Truck,
    headline: 'Real-Time Dispatch Tracking & Delivery OTP Verification',
    desc: 'Keep consignees and drivers synchronized with automated tracking alerts, shipment delay notifications, and proof-of-delivery OTPs.',
    useCases: [
      'Real-time shipment milestone SMS/WhatsApp dispatch updates',
      'Delivery agent contact number & live GPS tracking link',
      'Proof of Delivery (POD) secure OTP verification at doorstep',
      'Automated feedback collection upon successful parcel delivery',
    ],
    metric: '80% WISMO Drop',
    metricLabel: 'Reduction in "Where Is My Order" inbound calls',
    exampleSnippet: '🚚 Express Courier: Your package is out for delivery with agent Rohit (+919876543210). Share OTP 7421 upon delivery.',
  },
];

export function TurainIndustrySolutions() {
  const [activeTab, setActiveTab] = useState<string>('ecommerce');
  const activeIndustry = INDUSTRIES_DATA.find((i) => i.id === activeTab) || INDUSTRIES_DATA[0];
  const ActiveIcon = activeIndustry.icon;

  return (
    <section id="industries" className="py-20 md:py-28 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-800 font-mono">
            <Building className="w-4 h-4 text-emerald-600" />
            <span>Vertical Specializations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Customer Engagement Solutions for Key Industries
          </h2>
          <p className="text-base text-slate-600">
            Tailored messaging workflows, regulatory compliance, and turnkey automations engineered for your specific industry domain.
          </p>
        </div>

        {/* Industry Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {INDUSTRIES_DATA.map((ind) => {
            const Icon = ind.icon;
            const isActive = activeTab === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setActiveTab(ind.id)}
                className={`px-5 py-3 rounded-2xl text-sm font-bold transition flex items-center space-x-2.5 border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{ind.name}</span>
              </button>
            );
          })}
        </div>

        {/* Active Industry Showcase Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <ActiveIcon className="w-7 h-7 text-blue-600" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-700 uppercase">
                      {activeIndustry.badge}
                    </span>
                    <h3 className="text-2xl font-extrabold text-slate-900">{activeIndustry.headline}</h3>
                  </div>
                </div>

                <p className="text-base text-slate-600 leading-relaxed">{activeIndustry.desc}</p>
              </div>

              {/* Use cases */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Turnkey Industry Workflows:
                </div>
                <div className="space-y-2.5">
                  {activeIndustry.useCases.map((uc, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{uc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Live Example Preview (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-7 space-y-6 flex flex-col justify-between h-full shadow-md">
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-500 uppercase">Proven Industry Impact</div>
                <div className="text-4xl font-extrabold text-slate-900 font-mono">{activeIndustry.metric}</div>
                <div className="text-xs text-slate-600 font-semibold">{activeIndustry.metricLabel}</div>
              </div>

              {/* Message preview snippet */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Live Dispatch Sample</span>
                </div>
                <p className="text-xs text-emerald-950 font-mono leading-relaxed bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                  {activeIndustry.exampleSnippet}
                </p>
              </div>

              <Link
                href="#consultation"
                className="w-full text-center py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <span>Request {activeIndustry.name} Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
