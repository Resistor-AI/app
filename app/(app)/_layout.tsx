import { Stack } from "expo-router";
import { useAuthStore } from "@/src/store/authStore";
import { useOnboardingStore } from "@/src/store/onboardingStore";

const AppLayout = () => {
  const { isAuthenticated } = useAuthStore();
  const { hasCompletedOnboarding } = useOnboardingStore();

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
