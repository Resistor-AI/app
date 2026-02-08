import { useEffect } from "react";
import { supabase } from "@/src/lib/supabase/client";
import { useAuthStore } from "@/src/store/authStore";

export function useAuthListener() {
  const setSession = useAuthStore((s) => s.setSession);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, [setSession]);
}
