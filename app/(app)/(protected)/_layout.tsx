import { Stack } from "expo-router";

export default function ProtectedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="brain" />
      <Stack.Screen name="shield" />
      <Stack.Screen name="squad" />
      <Stack.Screen name="focus" />
      <Stack.Screen name="focus-setup" />
      <Stack.Screen name="session-complete" />
      <Stack.Screen name="break" />
    </Stack>
  );
}
