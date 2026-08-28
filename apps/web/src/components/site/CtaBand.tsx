import React from 'react';
import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';

export function CtaBand() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep text-navy-foreground py-20 md:py-24 px-6 border-t border-navy-soft">
      <div className="mx-auto max-w-5xl text-center space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Ready to scale?
        </p>
        <h2 className="font-display text-3xl font-bold tracking-tight md:text-5xl text-white">
          Turn your messaging channels into revenue engines today
        </h2>
        <p className="mx-auto max-w-2xl text-base text-navy-foreground/80 md:text-lg leading-relaxed">
          Join 310K+ businesses and agencies using Solvear to automate broadcasts, sales conversations, and customer support.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center space-x-2 bg-primary hover:bg-primary-hover text-white text-base font-bold px-8 py-4 rounded-xl shadow-pink shadow-pink-hover transition"
          >
            <span>Request a Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center space-x-2 border border-navy-foreground/20 hover:bg-navy-soft text-white text-base font-bold px-7 py-4 rounded-xl transition"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span>Call +91 98765 43210</span>
          </a>
        </div>
      </div>
    </section>
  );
}
