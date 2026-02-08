import { Stack, Redirect } from "expo-router";
import { useOnboardingStore } from "@/src/store/onboardingStore";

const PublicLayout = () => {
  const { hasCompletedOnboarding } = useOnboardingStore();


  // If we are in public layout, we are either:
  // 1. Not onboarded yet -> Go to (onboarding) -> welcome
  // 2. Onboarded but not authenticated -> Go to (auth)

  // We can use initialRouteName, but Redirect is safer for logic enforcement if needed.
  // However, initialRouteName is better for UX to avoid flash.

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={hasCompletedOnboarding ? "(auth)" : "(onboarding)"}
    >
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
    </Stack>
  );
};

export default PublicLayout;
