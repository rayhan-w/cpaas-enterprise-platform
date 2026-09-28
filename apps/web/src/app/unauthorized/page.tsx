'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 text-center space-y-5">
        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto text-rose-600">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-slate-900">403 — Access Denied</h1>
          <p className="mt-2 text-xs text-slate-600 leading-relaxed">
            You do not have administrative or feature permissions to view this resource. Your role or access scope has not been authorized by the platform owner.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to User Dashboard
          </Link>
          <Link
            href="/dashboard/features"
            className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-200 transition"
          >
            Submit an Access Request
          </Link>
        </div>
      </div>
    </div>
  );
}
