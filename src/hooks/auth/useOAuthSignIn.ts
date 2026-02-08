import { useState, useCallback } from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { supabase } from "@/src/lib/supabase/client";
import { parseAuthTokens } from "@/src/lib/supabase/parseAuthUrl";
import { AuthProvider } from "@/src/types/Auth";

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({ scheme: "resistorai" });

export function useOAuthSignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);

  const signIn = useCallback(async (provider: AuthProvider) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: redirectUri, skipBrowserRedirect: true },
      });

      if (oauthError || !data.url) {
        setError({ message: oauthError?.message ?? "Failed to start sign in" });
        return;
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      if (result.type !== "success") {
        setIsLoading(false);
        return;
      }

      const tokens = parseAuthTokens(result.url);
      if (!tokens) {
        setError({ message: "Failed to parse authentication response" });
        return;
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
      });

      if (sessionError) {
        setError({ message: sessionError.message });
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Sign in failed";
      setError({ message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { signIn, isLoading, error };
}
