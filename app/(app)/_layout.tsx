import { Stack } from "expo-router";
import { useAuthStore } from "@/src/store/authStore";
import { useOnboardingStore } from "@/src/store/onboardingStore";

const AppLayout = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { hasCompletedOnboarding } = useOnboardingStore();

  if (isLoading) return null;

  const isReady = isAuthenticated && hasCompletedOnboarding;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="(protected)"
        redirect={!isReady}
      />
      <Stack.Screen
        name="(public)"
        redirect={isReady}
      />
    </Stack>
  );
};

export default AppLayout;
