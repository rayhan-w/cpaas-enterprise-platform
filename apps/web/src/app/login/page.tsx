'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, Shield, CheckCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.role === 'SUPER_ADMIN') {
        router.push('/super-admin');
      } else if (res.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      setError(res.error || 'Invalid credentials or account suspended.');
    }
  };

  // Demo credential autofill helper
  const autofill = (role: 'super' | 'admin' | 'user') => {
    if (role === 'super') {
      setEmail('superadmin@trackops.dev');
      setPassword('SuperAdmin@TrackOps2026!');
    } else if (role === 'admin') {
      setEmail('admin@trackops.dev');
      setPassword('Admin@TrackOps2026!');
    } else {
      setEmail('user@trackops.dev');
      setPassword('User@TrackOps2026!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold text-2xl shadow-lg shadow-indigo-200 mb-4">
          T
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Sign in to TrackOps</h2>
        <p className="mt-2 text-sm text-slate-600">Enterprise Role-Based Link Management & Telemetry</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl border border-slate-200/80 sm:px-10">
          {/* Demo Credentials Switcher */}
          <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <p className="font-semibold text-slate-700 mb-2">⚡ Quick Autofill Test Credentials:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => autofill('super')}
                className="py-1.5 px-2 text-center rounded-lg bg-purple-50 text-purple-700 font-medium hover:bg-purple-100 transition border border-purple-200"
              >
                Super Admin
              </button>
              <button
                type="button"
                onClick={() => autofill('admin')}
                className="py-1.5 px-2 text-center rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition border border-blue-200"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => autofill('user')}
                className="py-1.5 px-2 text-center rounded-lg bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100 transition border border-emerald-200"
              >
                Regular User
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <Link href="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
