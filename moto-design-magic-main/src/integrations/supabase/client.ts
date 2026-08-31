import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://foehlehlhrqtisatidgw.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "sb_publishable_BsuYg8cflk4E_O4tpf6oEg_FGg0_rrn";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
