import { create } from "zustand";
import { supabase } from "@/src/lib/supabase/client";
import { AuthState } from "@/src/types/store";

export const useAuthStore = create<AuthState>()((set) => ({
  isAuthenticated: false,
  user: null,
  session: null,
  isLoading: true,

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session?.user,
      isLoading: false,
    }),

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, isAuthenticated: false });
  },
}));
