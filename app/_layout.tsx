import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useEffect } from "react";
import * as SystemUI from "expo-system-ui";
import RootNav from "./RootNav";
import { COLORS } from "@/src/constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5_000,
      gcTime: 2 * 60 * 1000,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
    },
  },
});

const ResistorTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background,
    card: COLORS.surface,
    text: COLORS.textPrimary,
    border: COLORS.surfaceHighlight,
    notification: COLORS.electricBlue,
  },
};

export default function RootLayout() {
  useEffect(() => {
    // Set the root view background color to prevent white flash on load
    SystemUI.setBackgroundColorAsync(COLORS.background);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
        <ThemeProvider value={ResistorTheme}>
          <RootNav />
        </ThemeProvider>
    </QueryClientProvider>
  );
}
