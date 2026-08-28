'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/site/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-navy-deep text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md space-y-6">
        <Logo className="text-white justify-center" />
        <div className="space-y-2 pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
            404 — Page Not Found
          </p>
          <h1 className="font-display text-4xl font-extrabold text-white">
            Looking for something?
          </h1>
          <p className="text-sm text-navy-foreground/75 leading-relaxed">
            The page you requested could not be found or has been moved to a new route.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-bold text-sm shadow-pink hover:bg-primary-hover transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-navy-soft text-white font-bold text-sm hover:bg-navy-soft transition"
          >
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
