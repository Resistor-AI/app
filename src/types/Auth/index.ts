export type AuthProvider = "google" | "apple";

export interface AuthError {
  message: string;
  provider: AuthProvider;
}
