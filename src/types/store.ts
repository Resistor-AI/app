export interface AuthState {
  isAuthenticated: boolean;
  user: {
    email?: string;
    id?: string;
  } | null;
  
  login: (userData?: { email?: string; id?: string }) => void;
  logout: () => void;
}

export interface OnboardingState {
  name: string;
  description: string;
  hasCompletedOnboarding: boolean;
  
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}
