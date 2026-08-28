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
          title="Schedule a Personalized Consultation &amp; Demo"
          description="Speak with our CPaaS architects and discover how Solvear can accelerate your sales, automations, and white-label agency revenue."
        />

        <section className="section-y">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Contact Info & Support Channels */}
              <div className="space-y-8">
                <SectionHeading
                  align="left"
                  eyebrow="We're Here To Help"
                  title="Let's build your next conversation channel"
                  description="Whether you have questions about Meta Cloud API verification, DLT compliance, custom integrations, or our White-label reseller program, our team is ready."
                />

                <div className="space-y-5 pt-4">
                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                    <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">Phone &amp; WhatsApp Sales</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">+91 98765 43210 (India) / +880 1700 000000 (BD)</p>
                      <p className="text-xs text-primary font-semibold mt-1">Available Mon–Sat: 9:00 AM – 8:00 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                    <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">24/7 Support Desk</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">support@solvear.in / sales@solvear.in</p>
                      <p className="text-xs text-muted-foreground font-semibold mt-1">Average response time: &lt; 15 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                    <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center text-primary shrink-0">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">Headquarters &amp; Tech Hub</h4>
                      <p className="text-sm text-muted-foreground mt-0.5">Solvear CPaaS Enterprise Technologies Inc.</p>
                      <p className="text-xs text-muted-foreground font-semibold mt-1">Dhaka • Kolkata • Singapore</p>
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
                      Demo Request Received!
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                      Thank you for contacting Solvear. One of our CPaaS solution consultants will reach out to you via WhatsApp and Email within 1 business hour.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-4 px-6 py-2.5 rounded-xl border border-border text-xs font-bold hover:bg-surface transition"
                    >
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="font-display text-2xl font-bold text-foreground">
                      Book a Free 1-on-1 Consultation
                    </h3>
                    <p className="text-xs text-muted-foreground font-medium">
                      Fill out the form below and we will prepare a tailored walkthrough for your business.
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
