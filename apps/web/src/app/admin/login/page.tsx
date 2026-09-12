'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '@/context/toast-context';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { toast } = useToast();

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
        setErrorMsg(data.error || 'Invalid credentials');
        toast(data.error || 'Login failed', 'error');
        return;
      }

      // Store in localStorage for client auth state
      localStorage.setItem('nurtura_admin_token', data.token);
      localStorage.setItem('nurtura_admin_user', JSON.stringify(data.admin));

      toast('Welcome back, ' + (data.admin?.name || 'Admin') + '!', 'success');
      router.push('/admin');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
      toast('Network error during login', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-[#EDE5E1] shadow-elevation-2 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-black ring-2 ring-[#9ED114]/80 shadow-md mx-auto flex items-center justify-center shrink-0">
            <img src="/jawata-mart-logo.jpg" alt="Jawata Mart" className="w-full h-full object-cover" />
          </div>
          <h1 className="section-title text-2xl text-[#1A1512]">Jawata Mart Staff Portal</h1>
          <p className="text-xs text-[#6B5B58]">
            Secure administrative access for orders, manual bKash/Nagad verification and inventory.
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
                placeholder="admin@jawatamart.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8F7F5] border border-[#EDE5E1] rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-[#1A1512] focus:outline-none focus:border-[#6CAE14]"
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
            className="w-full bg-[#6CAE14] hover:bg-[#5B960E] disabled:opacity-50 text-white font-bold text-xs py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
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
