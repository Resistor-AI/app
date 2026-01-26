import RootNav from "./RootNav";
import { AuthProvider } from "@/src/lib/auth-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNav />
    </AuthProvider>
  );
}
