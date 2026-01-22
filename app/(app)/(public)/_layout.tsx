import { Stack } from "expo-router";

const PublicLayout = () => {
  // const onBoardCompleted = useAppStore((state) => state.onboardingCompleted);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="(onboarding)"
    >
      <Stack.Screen name="(onboarding)" />
    </Stack>
  );
};

export default PublicLayout;
