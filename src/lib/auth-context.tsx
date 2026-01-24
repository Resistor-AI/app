import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";
import { useRouter, useSegments } from "expo-router";

interface AuthContextType {
  signIn: () => void;
  signOut: () => void;
  user: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const signIn = () => {
    setUser(true);
  };

  const signOut = () => {
    setUser(false);
  };

  return (
    <AuthContext.Provider value={{ signIn, signOut, user }}>
      {children}
    </AuthContext.Provider>
  );
}
