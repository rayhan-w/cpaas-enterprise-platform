import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { z } from "zod";
import {
  LogOut,
  Loader2,
  MessageSquare,
  Send,
  Users,
  Zap,
  CheckCircle2,
  Copy,
  TrendingUp,
  ShieldCheck,
  Phone,
  Radio,
  MessageCircle,
  Headphones,
  Settings,
  Activity,
  Layers,
  Key,
  ExternalLink,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Enterprise Dashboard — Solvear Workspace" },
      { name: "description", content: "Your Solvear workspace overview, channel statistics, and account profile settings." },
      { property: "og:title", content: "Enterprise Dashboard — Solvear Workspace" },
    ],
  }),
  component: DashboardPage,
});

const profileSchema = z.object({
  full_name: z.string().trim().min(2, { message: "Enter your full name" }).max(100),
  company: z.string().trim().max(100),
  phone: z.string().trim().max(30),
});

const STATS = [
  {
    label: "Messages Sent (This Month)",
    value: "142,850",
    growth: "+18.4%",
    icon: Send,
    color: "from-blue-500/20 to-blue-600/5 text-blue-500",
  },
  {
    label: "Active Contacts",
    value: "28,490",
    growth: "+12.1%",
    icon: Users,
    color: "from-emerald-500/20 to-emerald-600/5 text-emerald-500",
  },
  {
    label: "Delivery SLA",
    value: "99.98%",
    growth: "Optimal",
    icon: ShieldCheck,
    color: "from-purple-500/20 to-purple-600/5 text-purple-500",
  },
  {
    label: "Active AI Bot Flows",
    value: "16 Active",
    growth: "Live",
    icon: Zap,
    color: "from-amber-500/20 to-amber-600/5 text-amber-500",
  },
];

const CHANNELS = [
  {
    name: "Business WhatsApp API",
    status: "Connected & Verified",
    icon: MessageCircle,
    color: "text-emerald-500",
    details: "Green Tick Verified · Unlimited Agents · 99.9% Uptime",
    tier: "Tier 3 (100k msgs/day)",
  },
  {
    name: "DLT Bulk SMS Gateway",
    status: "Active (TRAI Compliant)",
    icon: MessageSquare,
    color: "text-blue-500",
    details: "Principal Entity ID Registered · 10 Sender IDs Whitelisted",
    tier: "High-Priority OTP Route",
  },
  {
    name: "RCS Business Messaging",
    status: "Verified Sender",
    icon: Radio,
    color: "text-indigo-500",
    details: "Rich Carousels · 1-Tap CTA Buttons · Suggested Replies",
    tier: "Carrier Integrated",
  },
  {
    name: "Cloud IVR & Voice Call",
    status: "Operational",
    icon: Phone,
    color: "text-amber-500",
    details: "Multi-level IVR · Number Masking · Call Recording",
    tier: "20 Channels Concurrent",
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({ full_name: "", company: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user || !active) return;
      setEmail(user.email ?? "");
      const { data } = await supabase
        .from("profiles")
        .select("full_name, company, phone")
        .eq("id", user.id)
        .maybeSingle();
      if (!active) return;
      setProfile({
        full_name: data?.full_name || (user.user_metadata?.full_name ?? user.user_metadata?.name ?? ""),
        company: data?.company || (user.user_metadata?.company ?? ""),
        phone: data?.phone || (user.user_metadata?.phone ?? ""),
      });
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  async function saveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const parsed = profileSchema.safeParse(profile);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, ...parsed.data });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Workspace profile updated successfully!");
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
      toast.success("Signed out successfully");
      window.location.href = "/auth";
    }
  }

  function handleCopyKey() {
    navigator.clipboard.writeText("solv_live_8f93a7d92c10b45e99a81c3d");
    setCopiedKey(true);
    toast.success("API key copied to clipboard!");
    setTimeout(() => setCopiedKey(false), 2000);
  }

  const displayName = profile.full_name || email.split("@")[0] || "User";
  const userInitial = displayName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-white font-display text-lg font-bold shadow-md shadow-primary/20">
              {userInitial}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-lg sm:text-xl font-extrabold text-foreground">
                  {displayName}'s Workspace
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live
                </span>
              </div>
              <p className="text-xs text-muted-foreground font-medium">{email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            <Button asChild size="sm" variant="outline" className="rounded-xl text-xs font-bold gap-1.5 border-border hover:bg-surface">
              <Link to="/contact">
                <Headphones className="w-3.5 h-3.5 text-primary" />
                <span className="hidden sm:inline">Support</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              disabled={signingOut}
              className="rounded-xl text-xs font-bold gap-1.5 border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-all duration-200"
            >
              {signingOut ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <LogOut className="h-3.5 w-3.5" />
              )}
              <span>Sign out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 space-y-8">
        {/* Responsive Quick Stats Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ label, value, growth, icon: Icon, color }) => (
            <Card key={label} className="rounded-3xl border-border bg-card shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${color}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-lg">
                    {growth}
                  </span>
                </div>
                <div className="mt-4">
                  <p className="font-display text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {value}
                  </p>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Responsive Tabs Navigation */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md bg-surface p-1 rounded-2xl border border-border">
            <TabsTrigger value="overview" className="rounded-xl text-xs font-bold gap-1.5">
              <Activity className="w-3.5 h-3.5" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="channels" className="rounded-xl text-xs font-bold gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Channels</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="rounded-xl text-xs font-bold gap-1.5">
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: OVERVIEW */}
          <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-200">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Channel Status List */}
              <Card className="lg:col-span-2 rounded-3xl border-border bg-card shadow-sm">
                <CardHeader>
                  <CardTitle className="font-display text-lg font-bold flex items-center justify-between">
                    <span>Connected CPaaS Channels</span>
                    <span className="text-xs font-normal text-muted-foreground">4 of 4 Operational</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Real-time carrier latency and DLT throughput status.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5">
                  {CHANNELS.map((ch) => (
                    <div
                      key={ch.name}
                      className="p-4 rounded-2xl border border-border bg-surface/60 hover:bg-surface transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-card border border-border shadow-xs">
                          <ch.icon className={`h-5 w-5 ${ch.color}`} />
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-display text-sm font-bold text-foreground">{ch.name}</h4>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {ch.status}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{ch.details}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                        {ch.tier}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* API Key Box */}
              <div className="space-y-6">
                <Card className="rounded-3xl border-border bg-card shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-base font-bold flex items-center gap-2">
                      <Key className="w-4 h-4 text-primary" /> API Secret Key
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Authenticate automated WhatsApp, SMS and Voice requests.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between gap-2 font-mono text-xs text-muted-foreground">
                      <span className="truncate">solv_live_8f93a7d92c10b45e99a81c3d</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCopyKey}
                        className="h-7 w-7 p-0 shrink-0 text-primary hover:bg-primary/10"
                      >
                        {copiedKey ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Keep your key confidential. Use in <code className="text-primary font-bold">Bearer &lt;token&gt;</code> authorization headers.
                    </p>
                    <Button asChild size="sm" className="w-full shadow-pink font-bold text-xs rounded-xl mt-2">
                      <Link to="/integrations">Explore API Docs</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-border bg-gradient-to-br from-primary/10 via-accent/5 to-transparent p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-white shadow-md">
                      <Zap className="h-5 w-5" />
                    </span>
                    <div>
                      <h4 className="font-display text-sm font-bold text-foreground">Need More Throughput?</h4>
                      <p className="text-xs text-muted-foreground">Upgrade DLT TPS & WhatsApp Limits</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                    Scale up to 5,000 SMS/sec and Tier-4 WhatsApp capacity with dedicated enterprise routes.
                  </p>
                  <Button asChild size="sm" variant="outline" className="w-full mt-4 rounded-xl text-xs font-bold border-primary/30 text-primary hover:bg-primary hover:text-white">
                    <a href="tel:+918016081188">Talk to Sales (+91 80160 81188)</a>
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: CHANNELS */}
          <TabsContent value="channels" className="space-y-6 animate-in fade-in duration-200">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500">
                    <MessageCircle className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">WhatsApp Business API</h3>
                    <p className="text-xs text-muted-foreground">Official Meta Cloud API Connection</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5 text-xs text-foreground/85 border-t border-border pt-4">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Display Name:</span>
                    <span className="font-bold">{profile.company || "SOLVEAR ADVERTISING"}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Quality Rating:</span>
                    <span className="font-bold text-emerald-500">HIGH (Green)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Catalog & Payments:</span>
                    <span className="font-bold text-emerald-500">Active (Razorpay/UPI Sync)</span>
                  </div>
                </div>
                <Button asChild size="sm" className="w-full shadow-pink font-bold text-xs rounded-xl mt-5">
                  <Link to="/channels/$slug" params={{ slug: "whatsapp" }}>Manage WhatsApp Flows</Link>
                </Button>
              </Card>

              <Card className="rounded-3xl border-border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500/15 text-blue-500">
                    <MessageSquare className="h-6 w-6" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-foreground">Bulk SMS & DLT Routes</h3>
                    <p className="text-xs text-muted-foreground">TRAI TCCCPR Regulations</p>
                  </div>
                </div>
                <div className="mt-5 space-y-2.5 text-xs text-foreground/85 border-t border-border pt-4">
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">DLT Entity Status:</span>
                    <span className="font-bold text-emerald-500">Verified (Entity ID Approved)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/50">
                    <span className="text-muted-foreground">Registered Sender IDs:</span>
                    <span className="font-bold">SOLVR, SLVEAR, SOLVAD</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">OTP Delivery Speed:</span>
                    <span className="font-bold text-emerald-500">&lt; 1.8 seconds</span>
                  </div>
                </div>
                <Button asChild size="sm" variant="outline" className="w-full font-bold text-xs rounded-xl mt-5 border-border hover:bg-surface">
                  <Link to="/products">Configure DLT Templates</Link>
                </Button>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: PROFILE SETTINGS */}
          <TabsContent value="profile" className="animate-in fade-in duration-200">
            <Card className="max-w-2xl rounded-3xl border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="font-display text-lg font-bold">Account Profile & Billing Details</CardTitle>
                <CardDescription className="text-xs">
                  Update your contact details and enterprise billing preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="py-8 grid place-items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
                  </div>
                ) : (
                  <form onSubmit={saveProfile} className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="full_name" className="text-xs font-bold">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        maxLength={100}
                        onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                        className="rounded-xl border-border bg-surface text-xs py-2.5"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="company" className="text-xs font-bold">Company Name</Label>
                        <Input
                          id="company"
                          value={profile.company}
                          maxLength={100}
                          onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                          className="rounded-xl border-border bg-surface text-xs py-2.5"
                          placeholder="e.g. Acme Corp"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-xs font-bold">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          maxLength={30}
                          onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                          className="rounded-xl border-border bg-surface text-xs py-2.5"
                          placeholder="e.g. +91 80160 81188"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-muted-foreground">Account Email</Label>
                      <Input
                        disabled
                        value={email}
                        className="rounded-xl border-border bg-surface/50 text-xs py-2.5 opacity-70"
                      />
                    </div>
                    <Button type="submit" className="shadow-pink rounded-xl font-bold text-xs py-5 mt-2" disabled={saving}>
                      {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden /> : null}
                      Save Changes
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
