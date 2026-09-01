import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

let cachedUser: User | null = null;
let hasChecked = false;

export function useSupabaseUser() {
  const [user, setUser] = useState<User | null>(cachedUser);
  const [loading, setLoading] = useState(!hasChecked);

  useEffect(() => {
    let active = true;

    // Single listener for auth changes with zero redundant getSession calls
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      cachedUser = session?.user ?? null;
      hasChecked = true;
      setUser(cachedUser);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription?.unsubscribe();
    };
  }, []);

  return { user, loading };
}
