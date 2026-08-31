import { useState, useRef } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  Menu,
  X,
  Phone,
  LayoutDashboard,
  Headphones,
  ChevronDown,
  MessageSquare,
  Radio,
  MessageCircle,
  PhoneCall,
  Bot,
  Building2,
  Headset,
  TrendingUp,
  Code,
  Palette,
  FileText,
  Sparkles,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { supabase } from "@/integrations/supabase/client";

type SubItem = {
  title: string;
  desc?: string;
  to: string;
  icon?: any;
};

type NavGroup = {
  label: string;
  to?: string;
  items?: SubItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Products",
    items: [
      { title: "Bulk SMS", desc: "Reach Thousands in Seconds", to: "/products#bulk-sms", icon: MessageSquare },
      { title: "RCS", desc: "Next-Gen Messaging Beyond SMS", to: "/products#rcs", icon: Radio },
      { title: "Business WhatsApp API", desc: "Official Meta Business Partner API", to: "/channels/whatsapp", icon: MessageCircle },
      { title: "Voice Call", desc: "Connect Instantly with Just One Call", to: "/products#voice-call", icon: PhoneCall },
      { title: "IVR", desc: "Smart Automation For Smarter Conversations", to: "/products#ivr", icon: Bot },
      { title: "Cloud BPO Solutions", desc: "Smart, Flexible & Cost-Effective Cloud BPO", to: "/products#cloud-bpo", icon: Building2 },
      { title: "Contact Center", desc: "Clear conversations. Faster resolutions.", to: "/products#contact-center", icon: Headset },
    ],
  },
  {
    label: "Solutions",
    items: [
      { title: "Bank and Financial Services", to: "/features#banking" },
      { title: "E-commerce", to: "/features#ecommerce" },
      { title: "Transport and logistics", to: "/features#transport" },
      { title: "Healthcare", to: "/features#healthcare" },
      { title: "Education", to: "/features#education" },
      { title: "Travel and Tourism", to: "/features#travel" },
      { title: "Real Estate", to: "/features#real-estate" },
      { title: "Government", to: "/features#government" },
    ],
  },
  {
    label: "Company",
    items: [
      { title: "About (With Our Journey)", to: "/about#journey" },
      { title: "Leadership", to: "/about#leadership" },
      { title: "Newsroom", to: "/about#newsroom" },
      { title: "Careers", to: "/about#careers" },
    ],
  },
  {
    label: "Services",
    items: [
      { title: "Digital Marketing", desc: "Grow Your Brand Online", to: "/white-label#digital-marketing", icon: TrendingUp },
      { title: "SaaS", desc: "Software as a Service", to: "/white-label#saas", icon: Code },
      { title: "UI/UX Design", to: "/white-label#ui-ux", icon: Palette },
      { title: "Content Marketing", to: "/white-label#content-marketing", icon: FileText },
      { title: "Graphics Design", to: "/white-label#graphics-design", icon: Sparkles },
    ],
  },
  { label: "Integrations", to: "/integrations" },
  { label: "Pricing", to: "/pricing" },
  { label: "Contact", to: "/contact" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({});
  const { user } = useSupabaseUser();
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
      setMobileOpen(false);
      toast.success("Signed out successfully");
      window.location.href = "/auth";
    }
  }

  const toggleMobileGroup = (label: string) => {
    setMobileExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const userDisplayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Account";

  return (
    <header className="sticky top-0 z-50 font-sans">
      {/* Top Bar */}
      <div className="hidden bg-navy-deep text-navy-foreground md:block border-b border-navy-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <p className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-primary" aria-hidden />
            <span className="font-semibold">Talk to Sales:</span>
            <a href="tel:+918016081188" className="hover:text-primary font-bold transition">
              +91 80160 81188 (India)
            </a>
          </p>
          <nav aria-label="Utility" className="flex items-center gap-4 font-semibold">
            <Link to="/contact" className="hover:text-primary transition">
              Help Desk
            </Link>
            <Link to="/integrations" className="hover:text-primary transition">
              Developer
            </Link>
            {user ? (
              <div className="flex items-center gap-3 pl-2 border-l border-navy-foreground/20">
                <Link to="/dashboard" className="hover:text-primary text-primary font-bold transition flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{userDisplayName}</span>
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="hover:text-destructive text-navy-foreground/75 transition flex items-center gap-1 text-[11px]"
                >
                  <LogOut className="h-3 w-3" />
                  <span>Sign out</span>
                </button>
              </div>
            ) : (
              <Link to="/auth" className="hover:text-primary transition">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="border-b border-border bg-background/98 backdrop-blur shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3.5">
          <Logo />

          {/* Desktop Navigation with Dropdowns */}
          <nav aria-label="Main" className="hidden items-center gap-1.5 lg:flex">
            {NAV_GROUPS.map((group) => {
              const hasDropdown = !!group.items && group.items.length > 0;
              const isOpen = activeDropdown === group.label;

              if (!hasDropdown) {
                return (
                  <Link
                    key={group.label}
                    to={group.to!}
                    className="px-3.5 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:text-primary rounded-lg hover:bg-surface"
                    activeProps={{ className: "text-primary font-bold" }}
                  >
                    {group.label}
                  </Link>
                );
              }

              return (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(group.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdown(isOpen ? null : group.label)}
                    aria-expanded={isOpen}
                    className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold transition-colors rounded-lg ${
                      isOpen
                        ? "text-primary bg-surface shadow-sm"
                        : "text-foreground/80 hover:text-primary hover:bg-surface"
                    }`}
                  >
                    <span>{group.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </button>

                  {/* Dropdown Menu Box */}
                  {isOpen && (
                    <div className="absolute left-0 top-full pt-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="w-72 sm:w-80 rounded-2xl border border-border bg-card/98 p-2.5 shadow-2xl backdrop-blur-md">
                        <div className="space-y-1">
                          {group.items!.map((item) => (
                            <a
                              key={item.title}
                              href={item.to}
                              onClick={() => {
                                setActiveDropdown(null);
                                setMobileOpen(false);
                              }}
                              className="group flex flex-col rounded-xl px-3.5 py-2.5 text-left transition-all hover:bg-surface cursor-pointer"
                            >
                              <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                                {item.title}
                              </span>
                              {item.desc && (
                                <span className="text-[11px] text-muted-foreground group-hover:text-foreground/75 font-normal transition-colors mt-0.5">
                                  {item.desc}
                                </span>
                              )}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="outline" className="rounded-xl font-bold text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10">
                  <Link to="/dashboard">
                    <LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive gap-1 p-2"
                  title="Sign out of workspace"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button asChild variant="outline" className="hidden sm:inline-flex rounded-xl font-bold text-xs">
                <Link to="/auth">Login</Link>
              </Button>
            )}
            <Button asChild className="hidden shadow-pink sm:inline-flex rounded-xl font-bold text-xs">
              <Link to="/contact">Schedule a Consultation</Link>
            </Button>

            {/* Quick Call on Mobile */}
            <a
              href="tel:+918016081188"
              className="inline-flex lg:hidden items-center justify-center p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition"
              title="Call Sales (+91 80160 81188)"
            >
              <Phone className="h-4 w-4" />
            </a>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="grid h-10 w-10 place-items-center rounded-xl border border-border lg:hidden bg-surface"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="border-t border-border bg-background lg:hidden animate-in fade-in max-h-[85vh] overflow-y-auto shadow-2xl">
            <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-5 py-4 space-y-1">
              {/* If Logged In, Show User Card in Drawer */}
              {user && (
                <div className="mb-3 p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-white font-bold text-xs">
                      {userDisplayName.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-xs font-bold text-foreground truncate max-w-[150px]">{userDisplayName}</p>
                      <p className="text-[10px] text-muted-foreground truncate max-w-[150px]">{user.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="h-8 rounded-lg text-xs font-bold text-destructive border-destructive/30 hover:bg-destructive hover:text-white gap-1 px-2.5"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Logout</span>
                  </Button>
                </div>
              )}

              {NAV_GROUPS.map((group) => {
                const hasDropdown = !!group.items && group.items.length > 0;
                const isExpanded = !!mobileExpanded[group.label];

                if (!hasDropdown) {
                  return (
                    <Link
                      key={group.label}
                      to={group.to!}
                      onClick={() => setMobileOpen(false)}
                      className="py-3 px-3 text-sm font-semibold text-foreground/90 border-b border-border/40 rounded-lg hover:bg-surface"
                    >
                      {group.label}
                    </Link>
                  );
                }

                return (
                  <div key={group.label} className="border-b border-border/40 py-1">
                    <button
                      type="button"
                      onClick={() => toggleMobileGroup(group.label)}
                      className="flex w-full items-center justify-between py-2.5 px-3 text-sm font-bold text-foreground rounded-lg hover:bg-surface"
                    >
                      <span>{group.label}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180 text-primary" : "text-muted-foreground"}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="pl-4 pr-2 pb-2 space-y-1 border-l-2 border-primary/40 my-1 ml-3">
                        {group.items!.map((item) => (
                          <a
                            key={item.title}
                            href={item.to}
                            onClick={() => setMobileOpen(false)}
                            className="block py-2 px-2 text-xs text-muted-foreground hover:text-primary rounded-md hover:bg-surface transition cursor-pointer"
                          >
                            <span className="font-bold text-foreground block">{item.title}</span>
                            {item.desc && <span className="block text-[10px] text-muted-foreground mt-0.5">{item.desc}</span>}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <div className="pt-4 space-y-2.5">
                <Button asChild className="w-full shadow-pink rounded-xl text-xs font-bold py-5">
                  <Link to="/contact" onClick={() => setMobileOpen(false)}>
                    Schedule a Consultation
                  </Link>
                </Button>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {user ? (
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary hover:text-white text-center"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center py-2.5 px-3 text-xs font-bold text-foreground bg-surface border border-border rounded-xl hover:bg-muted text-center"
                    >
                      Login / Register
                    </Link>
                  )}
                  <a
                    href="tel:+918016081188"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold text-primary bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition text-center"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call Sales
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
