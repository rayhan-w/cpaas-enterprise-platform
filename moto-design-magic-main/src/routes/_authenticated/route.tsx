import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    try {
      if (typeof window !== "undefined") {
        const localUser = localStorage.getItem("solvear_active_user");
        if (localUser) {
          try {
            return { user: JSON.parse(localUser) };
          } catch (_) {}
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session?.user) {
        return { user: sessionData.session.user };
      }

      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        return { user: data.user };
      }

      throw redirect({ to: "/auth" });
    } catch (e) {
      if ((e as any)?.isRedirect) throw e;
      if (typeof window !== "undefined") {
        const localUser = localStorage.getItem("solvear_active_user");
        if (localUser) {
          try {
            return { user: JSON.parse(localUser) };
          } catch (_) {}
        }
      }
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
