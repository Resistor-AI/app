import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RootNav from "./RootNav";
import { AuthProvider } from "@/src/lib/auth-context";

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

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootNav />
      </AuthProvider>
    </QueryClientProvider>
  );
}
