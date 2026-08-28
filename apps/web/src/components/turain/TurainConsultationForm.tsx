'use client';

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Send,
  CheckCircle2,
  ShieldCheck,
  Headphones,
  Clock,
  Sparkles,
} from 'lucide-react';
import {
  WhatsAppIcon,
} from '@/components/common/BrandIcons';

export function TurainConsultationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    channel: 'whatsapp_api',
    volume: '25k_100k',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <section id="consultation" className="py-20 md:py-28 relative bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Contact Info & Value Props (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-xs font-bold text-blue-800 font-mono">
                <Headphones className="w-4 h-4 text-blue-600" />
                <span>Connect With Enterprise Experts</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Let’s Reach Out: Demo, Pricing &amp; Consultation
              </h2>
              <p className="text-base text-slate-600 leading-relaxed font-normal">
                Contact our communications architects to find the right tailored CPaaS solution, calculate your ROI, and configure DLT &amp; WhatsApp workflows.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-4 text-sm">
              <a
                href="tel:+919876543210"
                className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition group shadow-xs"
              >
                <div className="p-3 bg-blue-100 text-blue-700 rounded-xl group-hover:scale-105 transition">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Call Enterprise Sales</div>
                  <div className="text-base font-extrabold text-slate-900">+91 98765 43210</div>
                </div>
              </a>

              <a
                href="mailto:sales@turaingrp.com"
                className="flex items-center space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition group shadow-xs"
              >
                <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl group-hover:scale-105 transition">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase">Email Us Directly</div>
                  <div className="text-base font-extrabold text-slate-900">sales@turaingrp.com</div>
                </div>
              </a>
            </div>

            {/* Office Locations */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>India Head Office &amp; Development Hubs:</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 font-medium">
                <div>
                  <strong className="text-slate-900">Kolkata Office:</strong>
                  <p className="text-slate-500">Sector V, Salt Lake City, Kolkata - 700091</p>
                </div>
                <div>
                  <strong className="text-slate-900">Bengaluru Tech Hub:</strong>
                  <p className="text-slate-500">Outer Ring Road, Bellandur, Bengaluru - 560103</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Consultation Request Received!</h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{formData.name}</strong>. Our CPaaS Solutions Architect will contact you at <strong>{formData.phone || formData.email}</strong> within 30 minutes with customized pricing &amp; demo credentials.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-blue-700 hover:underline pt-3"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-slate-900">Schedule Your Free Consultation</h3>
                  <p className="text-xs text-slate-500">Fill in the details below for instant pricing and custom demo access.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp (+91) *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. UrbanStyle Retail"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Product of Interest</label>
                    <select
                      value={formData.channel}
                      onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs font-medium"
                    >
                      <option value="whatsapp_api">WhatsApp Business API</option>
                      <option value="bulk_sms">Bulk SMS &amp; DLT Registration</option>
                      <option value="rcs">RCS Business Messaging</option>
                      <option value="voice_ivr">Voice Call &amp; Cloud IVR</option>
                      <option value="all_suite">All-in-One Omnichannel Suite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Monthly Volume</label>
                    <select
                      value={formData.volume}
                      onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs font-medium"
                    >
                      <option value="under_25k">&lt; 25,000 Messages</option>
                      <option value="25k_100k">25,000 – 100,000 Messages</option>
                      <option value="100k_500k">100,000 – 500,000 Messages</option>
                      <option value="500k_2m">500,000 – 2,000,000 Messages</option>
                      <option value="above_2m">2,000,000+ (High Volume Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Message / Requirements</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your use case (e.g. Shopify COD verification, DLT template approval, OTP delivery)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-blue-600 shadow-xs font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600 hover:from-blue-800 hover:to-indigo-700 text-white text-sm font-extrabold shadow-lg shadow-blue-600/25 transition duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Request Consultation & Custom Quote'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
