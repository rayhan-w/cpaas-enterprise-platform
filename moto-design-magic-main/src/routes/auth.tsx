import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ShieldCheck, Zap } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate({ to: "/dashboard", replace: true });
      } else {
        setChecking(false);
      }
    });
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
        emailRedirectTo: window.location.origin,
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
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  if (checking) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  return (
    <div className="bg-navy-deep text-navy-foreground">
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

        <div className="rounded-2xl border border-border/20 bg-background p-6 text-foreground shadow-pink sm:p-8">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Login</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <h2 className="text-xl font-bold">Sign in to Solvear</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use your work email to access your dashboard.
              </p>
              <form onSubmit={handleSignIn} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Work email</Label>
                  <Input id="signin-email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder="you@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input id="signin-password" name="password" type="password" autoComplete="current-password" required maxLength={72} placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full shadow-pink" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Mail className="h-4 w-4" aria-hidden />}
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <h2 className="text-xl font-bold">Create your Solvear account</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Start with a free workspace — no credit card required.
              </p>
              <form onSubmit={handleSignUp} className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full name</Label>
                  <Input id="signup-name" name="fullName" required maxLength={100} placeholder="Rayhan Haidar" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="signup-company">Company</Label>
                    <Input id="signup-company" name="company" maxLength={100} placeholder="Solvear Ltd." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone</Label>
                    <Input id="signup-phone" name="phone" maxLength={30} placeholder="+880 1700 000000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Work email</Label>
                  <Input id="signup-email" name="email" type="email" autoComplete="email" required maxLength={255} placeholder="you@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input id="signup-password" name="password" type="password" autoComplete="new-password" required minLength={6} maxLength={72} placeholder="At least 6 characters" />
                </div>
                <Button type="submit" className="w-full shadow-pink" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Create account
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            <img src="https://img.logo.dev/google.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ&size=64&format=png" alt="" className="h-4 w-4" />
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing you agree to Solvear's terms.{" "}
            <Link to="/contact" className="font-semibold text-primary">
              Need help?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
