'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Radio, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { fetchApi } from '@/lib/api-client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@cpaas.io');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const res = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (res?.accessToken) {
        localStorage.setItem('cpaas_auth_token', res.accessToken);
        localStorage.setItem('cpaas_refresh_token', res.refreshToken);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="w-full max-w-sm bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
        {/* Brand */}
        <div className="space-y-1 text-center">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white mx-auto shadow-sm">
            <Radio className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-zinc-100 tracking-tight pt-2">CloudSMS Console</h1>
          <p className="text-xs text-zinc-400">Enterprise Bulk SMS & Telephony Portal</p>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-950/60 border border-rose-800 text-rose-300 text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-zinc-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 text-center text-xs text-zinc-400">
          Demo Admin: <span className="font-mono text-zinc-200">admin@cpaas.io</span> / <span className="font-mono text-zinc-200">Admin@123456</span>
        </div>
      </div>
    </div>
  );
}
