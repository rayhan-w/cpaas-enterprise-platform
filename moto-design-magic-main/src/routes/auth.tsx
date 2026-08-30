import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ShieldCheck, Zap } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Sign Up — Solvear Platform Access" },
      {
        name: "description",
        content:
          "Sign in to your Solvear account to manage WhatsApp Business API campaigns, shared inbox, chatbots and multi-channel automation.",
      },
      { property: "og:title", content: "Login or Sign Up — Solvear Platform Access" },
      {
        property: "og:description",
        content: "Access your Solvear CPaaS dashboard for WhatsApp, Messenger, Instagram and Telegram automation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

const signInSchema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(2, { message: "Enter your full name" }).max(100),
  company: z.string().trim().max(100).optional(),
  phone: z.string().trim().max(30).optional(),
});

function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // 1. Check existing session
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
      } else {
        setChecking(false);
      }
    });

    // 2. Listen to auth state changes (handles Google OAuth redirect callbacks)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
        toast.success("Authentication successful");
        navigate({ to: "/dashboard", replace: true });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  async function handleSignIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signInSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back to Solvear");
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const parsed = signUpSchema.safeParse({
      email: form.get("email"),
      password: form.get("password"),
      fullName: form.get("fullName"),
      company: form.get("company") || undefined,
      phone: form.get("phone") || undefined,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: parsed.data.fullName,
          company: parsed.data.company ?? "",
          phone: parsed.data.phone ?? "",
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created — welcome to Solvear");
    navigate({ to: "/dashboard", replace: true });
  }

  async function handleGoogle() {
    try {
      setLoading(true);
      const redirectUrl = `${window.location.origin}/dashboard`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) {
        setLoading(false);
        toast.error(error.message || "Google sign-in failed. Please try again.");
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.message || "Google sign-in failed");
    }
  }

  if (checking) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  return (
    <div className="bg-navy-deep text-navy-foreground font-sans">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="hidden flex-col justify-center lg:flex">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Platform Access
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight">
            One login for every conversation channel
          </h1>
          <p className="mt-4 max-w-md text-navy-foreground/70">
            Manage WhatsApp Business API broadcasts, shared inbox, chatbots and automation from a
            single Solvear workspace.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {[
              { icon: Zap, text: "80%+ broadcast open rates across channels" },
              { icon: ShieldCheck, text: "Official Meta Business Partner infrastructure" },
              { icon: Lock, text: "Enterprise-grade security and role-based access" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-border/20 bg-background p-6 text-foreground shadow-2xl sm:p-8">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-surface">
              <TabsTrigger value="signin" className="rounded-lg font-bold text-xs">Login</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg font-bold text-xs">Create account</TabsTrigger>
            </TabsList>

            {/* Sign In Tab */}
            <TabsContent value="signin" className="mt-6">
              <h2 className="text-xl font-bold font-display">Sign in to Solvear</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Enter your credentials to access your workspace.
              </p>
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signin-email" className="text-xs font-bold">Email Address *</Label>
                  <Input
                    id="signin-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    placeholder="Enter your email"
                    className="rounded-xl border-border bg-surface text-xs py-2.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signin-password" className="text-xs font-bold">Password *</Label>
                  <Input
                    id="signin-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    maxLength={72}
                    placeholder="Enter your password"
                    className="rounded-xl border-border bg-surface text-xs py-2.5"
                  />
                </div>
                <Button type="submit" className="w-full shadow-pink rounded-xl font-bold text-xs py-5 mt-2" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden /> : <Mail className="h-4 w-4 mr-2" aria-hidden />}
                  Login to Console
                </Button>
              </form>
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="mt-6">
              <h2 className="text-xl font-bold font-display">Create your Solvear account</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Start with a free workspace — no credit card required.
              </p>
              <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name" className="text-xs font-bold">Full Name *</Label>
                  <Input
                    id="signup-name"
                    name="fullName"
                    required
                    maxLength={100}
                    placeholder="Enter your full name"
                    className="rounded-xl border-border bg-surface text-xs py-2.5"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-company" className="text-xs font-bold">Company Name</Label>
                    <Input
                      id="signup-company"
                      name="company"
                      maxLength={100}
                      placeholder="Enter company name"
                      className="rounded-xl border-border bg-surface text-xs py-2.5"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-phone" className="text-xs font-bold">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      name="phone"
                      maxLength={30}
                      placeholder="Enter phone number"
                      className="rounded-xl border-border bg-surface text-xs py-2.5"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email" className="text-xs font-bold">Work Email *</Label>
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={255}
                    placeholder="Enter your email"
                    className="rounded-xl border-border bg-surface text-xs py-2.5"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password" className="text-xs font-bold">Password (min 6 characters) *</Label>
                  <Input
                    id="signup-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={6}
                    maxLength={72}
                    placeholder="Enter your password"
                    className="rounded-xl border-border bg-surface text-xs py-2.5"
                  />
                </div>
                <Button type="submit" className="w-full shadow-pink rounded-xl font-bold text-xs py-5 mt-2" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden /> : null}
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full rounded-xl py-5 font-bold text-xs flex items-center justify-center gap-2.5 border-border hover:bg-surface"
            onClick={handleGoogle}
            disabled={loading}
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
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to Solvear's terms.{" "}
            <Link to="/contact" className="font-semibold text-primary hover:underline">
              Need help?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
