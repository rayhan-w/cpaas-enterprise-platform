'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  Star,
  Quote,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const TESTIMONIALS = [
  {
    quote: 'The Solvear API has completely transformed the way we handle complex problem-solving tasks. Integration was smooth, and the documentation made it super easy to get started. Our workflows are now faster and more accurate!',
    author: 'Rafat Hossain',
    role: 'E-commerce Director',
    company: 'D2C Retail Scale-up',
    rating: 5,
  },
  {
    quote: 'I love how scalable the Solvear API is. Whether handling small or large datasets, it performs flawlessly. The support team is also incredibly responsive whenever I have questions.',
    author: 'Tanvi Patel',
    role: 'Head of Growth',
    company: 'NextGen Cosmetics',
    rating: 5,
  },
  {
    quote: 'Solvear API is a game-changer for developers. The powerful features and easy-to-use endpoints saved us weeks of development time. Highly recommend for anyone looking to enhance their applications.',
    author: 'Marcus Vance',
    role: 'Managing Director',
    company: 'Apex Media Agency',
    rating: 5,
  },
];

const FAQS = [
  {
    q: 'What is Solvear API and how does it work?',
    a: 'The Solvear API is a RESTful web service and CPaaS platform that allows developers and businesses to integrate advanced conversational AI, WhatsApp bulk broadcasting, commerce catalogs, and automation workflows directly into their applications. By leveraging this API, users can automate customer support, verify COD orders, and optimize multi-channel conversions.',
  },
  {
    q: 'How does the 4-Layer Security architecture protect our business data?',
    a: 'Your traffic passes through 4 distinct security tiers: (1) Cloudflare Edge with 192+ Tbps DDoS scrubbing and WAF; (2) HAProxy & Nginx API Gateway for SSL termination and rate limiting; (3) NestJS / FastAPI Application Shield with strict JWT/RBAC guards; and (4) PostgreSQL Data Security with AES-256 encryption at rest and strict tenant isolation.',
  },
  {
    q: 'How do Shopify & WooCommerce integrations work with Solvear?',
    a: 'Solvear connects directly via official Webhooks and our WooCommerce Abandoned Cart plugin. Whenever an order is created, abandoned, or fulfilled, our Amazon SQS worker immediately dispatches WhatsApp alerts, 1-click COD confirmation buttons, or personalized cart recovery discount links.',
  },
  {
    q: 'Can I white-label Solvear under my own brand and agency domain?',
    a: 'Yes! Our White-Label Reseller program lets you map your own CNAME domain (e.g. app.youragency.com), customize logos, color schemes, set custom subscription packages, and collect 100% of client payments directly into your Stripe or Razorpay account.',
  },
  {
    q: 'Does Solvear comply with TRAI DLT guidelines and DND regulations in India?',
    a: 'Yes, 100%. Our platform includes an integrated DLT Template Management system and automatic real-time DND scrubbing before dispatches occur. Non-promotional transactional alerts pass through verified 6-character sender IDs seamlessly.',
  },
  {
    q: 'How do AI Tokens and the Dual AI engine (FastAPI + NestJS) work?',
    a: 'NestJS manages CPaaS routing, WebSockets, and CRM synchronization, while FastAPI handles ultra-fast vector embeddings and LLM reasoning (OpenAI GPT-4o & Google Gemini). AI Tokens allow you to pay as you go for AI-generated answers with sub-50ms conversational response times.',
  },
];

export function TestimonialsFaq() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Testimonials Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1 rounded-full text-xs font-bold text-emerald-700 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>What Our Customers Say</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Trusted by 310,000+ Businesses Worldwide
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            See how high-volume eCommerce merchants and marketing agencies scale revenue with Solvear.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 rounded-3xl p-7 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(t.rating)].map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{t.author}</div>
                  <div className="text-[11px] text-slate-500">{t.role}, {t.company}</div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-10">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs sm:text-sm text-slate-600">Everything you need to know about our technology, pricing, and infrastructure.</p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition shadow-xs"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-slate-50 transition"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 shrink-0 ${
                        isOpen ? 'rotate-180 text-blue-600' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
