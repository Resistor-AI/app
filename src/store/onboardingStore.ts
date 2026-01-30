import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { zustandStorage } from "./storage";

interface OnboardingState {
  name: string;
  description: string;
  hasCompletedOnboarding: boolean;
  
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

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
