import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./storage";
import { AuthState } from "@/src/types/store";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: (userData) => set({ isAuthenticated: true, user: userData || { id: "mock-user-id" } }),
      logout: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
