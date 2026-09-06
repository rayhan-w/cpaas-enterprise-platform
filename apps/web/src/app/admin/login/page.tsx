'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@nurtura.com.bd');
  const [password, setPassword] = useState('admin123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Store in localStorage for client auth state
      localStorage.setItem('nurtura_admin_token', data.token);
      localStorage.setItem('nurtura_admin_user', JSON.stringify(data.admin));

      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE5E1] shadow-elevation-2 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-[#C4737E] text-white flex items-center justify-center font-serif text-2xl font-bold mx-auto shadow-md">
            N
          </div>
          <h1 className="section-title text-2xl text-[#1A1512]">Nurtura Staff Portal</h1>
          <p className="text-xs text-[#6B5B58]">
            Secure administrative access for orders, manual bKash/Nagad verification and inventory.
          </p>
        </div>

        {/* Demo Credentials Alert */}
        <div className="p-3 bg-[#FCF5F6] border border-[#C4737E]/20 rounded-xl text-xs text-[#1A1512] space-y-1">
          <p className="font-bold text-[#C4737E]">Pre-configured Admin Account:</p>
          <p className="text-[#6B5B58]">
            Email: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#EDE5E1]">admin@nurtura.com.bd</code>
          </p>
          <p className="text-[#6B5B58]">
            Password: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#EDE5E1]">admin123456</code>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#C4737E]"
              />
              <Mail className="w-4 h-4 text-[#9B8A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1A1512] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#C4737E]"
              />
              <Lock className="w-4 h-4 text-[#9B8A86] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-[#D94040] bg-[#FBDADA] p-2.5 rounded-xl border border-[#D94040]/30 font-medium">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C4737E] hover:bg-[#A85862] disabled:opacity-50 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
