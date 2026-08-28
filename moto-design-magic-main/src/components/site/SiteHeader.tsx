import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Headphones, Menu, X, Phone, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

const NAV = [
  { label: "Products", to: "/products" },
  { label: "Features", to: "/features" },
  { label: "White-label", to: "/white-label" },
  { label: "Integrations", to: "/integrations" },
  { label: "Pricing", to: "/pricing" },
  { label: "Company", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { user } = useSupabaseUser();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    setOpen(false);
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50">
      <div className="hidden bg-navy-deep text-navy-foreground md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <p className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-primary" aria-hidden />
            <span className="font-semibold">Talk to Sales:</span>
            <a href="tel:+8801700000000" className="hover:text-primary">
              +880 1700 000000 (Dhaka)
            </a>
            <span aria-hidden className="opacity-40">
              |
            </span>
            <a href="tel:+919230000000" className="hover:text-primary">
              +91 92300 00000 (Kolkata)
            </a>
          </p>
          <nav aria-label="Utility" className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-primary">
              Help Desk
            </Link>
            <Link to="/integrations" className="hover:text-primary">
              Developer
            </Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
                <button type="button" onClick={handleSignOut} className="hover:text-primary">
                  Sign out
                </button>
              </>
            ) : (
              <Link to="/auth" className="hover:text-primary">
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      <div className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-semibold text-foreground/80 transition-colors hover:text-primary"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link to="/dashboard">
                  <LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline" className="hidden sm:inline-flex">
                <Link to="/auth">Login</Link>
              </Button>
            )}
            <Button asChild className="hidden shadow-pink sm:inline-flex">
              <Link to="/contact">Schedule a Consultation</Link>
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="grid h-10 w-10 place-items-center rounded-md border border-border lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col px-6 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="border-b border-border/60 py-3 text-sm font-semibold last:border-0"
                  activeProps={{ className: "text-primary" }}
                >
                  {item.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"
                  >
                    <LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="mt-3 inline-flex items-center gap-2 text-left text-sm font-semibold"
                  >
                    <LogOut className="h-4 w-4" aria-hidden /> Sign out
                  </button>
                </>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setOpen(false)}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold"
                >
                  Login
                </Link>
              )}
              <a
                href="tel:+8801700000000"
                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                <Phone className="h-4 w-4" aria-hidden /> +880 1700 000000
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
