import { Stack } from "expo-router";

const AppLayout = () => {
  const user = false;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!!user}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>

      <Stack.Protected guard={!user}>
        <Stack.Screen name="(public)" />
      </Stack.Protected>
    </Stack>
  );
};

export default AppLayout;
