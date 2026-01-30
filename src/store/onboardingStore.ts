import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./storage";
import { OnboardingState } from "@/src/types/store";

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      name: "",
      description: "",
      hasCompletedOnboarding: false,

      setName: (name) => set({ name }),
      setDescription: (description) => set({ description }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () => set({ name: "", description: "", hasCompletedOnboarding: false }),
    }),
    {
      name: "onboarding-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
