'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SiteHeader } from '@/components/site/SiteHeader';
import { SiteFooter } from '@/components/site/SiteFooter';
import { Lock, Mail, ShieldCheck, Zap, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    company: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (tab === 'signin') {
        // Authenticate with NestJS backend or demo login
        const res = await fetch('http://localhost:4000/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password }),
        }).catch(() => null);

        // Success redirect
        setSuccessMsg('Welcome back to Solvear!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      } else {
        const res = await fetch('http://localhost:4000/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.fullName,
          }),
        }).catch(() => null);

        setSuccessMsg('Account created — welcome to Solvear!');
        setTimeout(() => {
          router.push('/dashboard');
        }, 600);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep text-navy-foreground flex flex-col font-sans">
      <SiteHeader />

      <main className="flex-1 flex items-center justify-center">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24 items-center w-full">
          {/* Left Hero Column */}
          <div className="hidden flex-col justify-center lg:flex space-y-6">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
              Platform Access
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-white md:text-5xl">
              One login for every conversation channel
            </h1>
            <p className="max-w-md text-base text-navy-foreground/75 leading-relaxed font-normal">
              Manage WhatsApp Business API broadcasts, shared inbox, chatbots and automation from a single Solvear workspace.
            </p>
            <ul className="space-y-4 pt-2 text-sm text-navy-foreground/90 font-semibold">
              {[
                { icon: Zap, text: '80%+ broadcast open rates across channels' },
                { icon: ShieldCheck, text: 'Official Meta Business Partner infrastructure' },
                { icon: Lock, text: 'Enterprise-grade security and role-based access' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3.5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/20 text-primary shrink-0 border border-primary/30">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Login/Register Card */}
          <div className="rounded-3xl border border-white/10 bg-background p-7 text-foreground shadow-pink sm:p-10 max-w-lg mx-auto w-full">
            {/* Tab switchers */}
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-surface border border-border">
              <button
                type="button"
                onClick={() => {
                  setTab('signin');
                  setError('');
                }}
                className={`py-2.5 text-sm font-bold rounded-xl transition ${
                  tab === 'signin'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab('signup');
                  setError('');
                }}
                className={`py-2.5 text-sm font-bold rounded-xl transition ${
                  tab === 'signup'
                    ? 'bg-white text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Create account
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="mt-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700">
                {successMsg}
              </div>
            )}

            {tab === 'signin' ? (
              <div className="mt-6 space-y-4">
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-foreground">Sign in to Solvear</h2>
                  <p className="text-xs text-muted-foreground">
                    Use your work email to access your dashboard.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Work email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm py-3.5 rounded-xl shadow-pink shadow-pink-hover transition"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                    <span>Login</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-foreground">
                    Create your Solvear account
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Start with a free workspace — no credit card required.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Full name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Rayhan Haidar"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Solvear Ltd."
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+880 1700 000000"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Work email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-sm py-3.5 rounded-xl shadow-pink shadow-pink-hover transition"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Create account</span>
                  </button>
                </form>
              </div>
            )}

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              <span className="h-px flex-1 bg-border" />
              or
              <span className="h-px flex-1 bg-border" />
            </div>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setTimeout(() => router.push('/dashboard'), 500);
              }}
              className="w-full inline-flex items-center justify-center gap-3 py-3 rounded-xl border border-border bg-white text-xs font-bold text-foreground hover:bg-slate-50 transition"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="mt-6 text-center text-xs text-muted-foreground font-medium">
              By continuing you agree to Solvear's terms.{' '}
              <Link href="/contact" className="font-bold text-primary hover:underline">
                Need help?
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
