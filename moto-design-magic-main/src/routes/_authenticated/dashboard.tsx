import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { LogOut, Loader2, MessageSquare, Send, Users, Zap } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Solvear Workspace" },
      { name: "description", content: "Your Solvear workspace overview and account profile settings." },
      { property: "og:title", content: "Dashboard — Solvear Workspace" },
      { property: "og:description", content: "Your Solvear workspace overview and account profile settings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  { label: "Messages sent", value: "0", icon: Send },
  { label: "Active contacts", value: "0", icon: Users },
  { label: "Open conversations", value: "0", icon: MessageSquare },
  { label: "Automations", value: "0", icon: Zap },
];

function DashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState({ full_name: "", company: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    toast.success("Profile updated");
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Workspace</p>
            <h1 className="mt-2 text-3xl font-extrabold">
              Welcome{profile.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(({ label, value, icon: Icon }) => (
            <Card key={label}>
              <CardContent className="flex items-center gap-4 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 max-w-2xl">
          <CardHeader>
            <CardTitle>Account profile</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
            ) : (
              <form onSubmit={saveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name</Label>
                  <Input
                    id="full_name"
                    value={profile.full_name}
                    maxLength={100}
                    onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={profile.company}
                      maxLength={100}
                      onChange={(e) => setProfile((p) => ({ ...p, company: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      maxLength={30}
                      onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    />
                  </div>
                </div>
                <Button type="submit" className="shadow-pink" disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Save changes
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
