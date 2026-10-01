'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { PageHero } from '@/components/site/PageHero';
import { SectionHeading } from '@/components/site/SectionHeading';
import { CtaBand } from '@/components/site/CtaBand';
import { Headphones, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    planInterest: 'Growth Business',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1">
        <PageHero
          eyebrow="Get In Touch"
          title="Contact Jawata Mart (যোগাযোগ করুন)"
          description="Have questions about an order, product availability, or nationwide delivery? Reach out to our dedicated support team."
        />

        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info & Support Channels */}
              <div className="space-y-8">
                <SectionHeading
                  align="left"
                  eyebrow="We're Here To Help"
                  title="Fast & Dependable Customer Care"
                  description="Our team is available 7 days a week to assist with order tracking, bKash/Nagad verification, product queries, and home deliveries."
                />

                <div className="space-y-5 pt-4">
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                    <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">Phone &amp; WhatsApp Hotline</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">01915210799 (Hotline &amp; WhatsApp)</p>
                      <p className="text-xs text-[#6CAE14] font-semibold mt-1">Available Daily: 9:00 AM – 11:00 PM</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                    <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">Customer Support Email</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">jawatamart3@gmail.com</p>
                      <p className="text-xs text-muted-foreground font-semibold mt-1">Average response time: &lt; 30 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                    <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">Office &amp; Dispatch Hub</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Jawata Mart (জাওয়াটা মার্ট)</p>
                      <p className="text-xs text-muted-foreground font-semibold mt-1">Sector 12, Uttara, Dhaka-1230, Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Consultation Lead Form */}
              <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-elevated">
                {submitted ? (
                  <div className="py-12 text-center space-y-4 animate-in fade-in">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      Message Received!
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Jawata Mart. Our customer care team will review your message and reach out shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-surface transition"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      Send Us a Message
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      Fill out the form below with your order or product inquiry.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          Business Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="rahul@company.com"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          WhatsApp / Phone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                          Primary Interest
                        </label>
                        <select
                          value={formData.planInterest}
                          onChange={(e) => setFormData({ ...formData, planInterest: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary font-medium"
                        >
                          <option value="Growth Business">Growth Business Plan</option>
                          <option value="White-Label Reseller">White-Label Reseller Program</option>
                          <option value="Custom Enterprise">Custom Enterprise &amp; DLT Setup</option>
                          <option value="Shopify / WooCommerce">eCommerce Automated Flows</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        How can we help? (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell us about your current monthly message volume, store platform, or agency goals..."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white font-bold text-base py-4 rounded-xl shadow-pink shadow-pink-hover transition"
                    >
                      <span>Submit Consultation Request</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        <CtaBand />
      </main>

      <SiteFooter />
    </div>
  );
}
