'use client';

import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Logo } from '@/components/site/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md space-y-6">
        <div className="flex justify-center">
          <Logo inverted />
        </div>
        <div className="space-y-2 pt-4">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-rose-500">
            404 — Page Not Found
          </p>
          <h1 className="text-4xl font-extrabold text-white">
            Looking for something?
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            The page you requested could not be found or has been moved to a new route.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-rose-600 text-white font-bold text-sm hover:bg-rose-700 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 text-white font-bold text-sm hover:bg-slate-800 transition"
          >
            <span>Explore Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
