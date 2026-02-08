export function parseAuthTokens(url: string): { accessToken: string; refreshToken: string } | null {
  const hashIndex = url.indexOf("#");
  if (hashIndex === -1) return null;

  const params = new URLSearchParams(url.substring(hashIndex + 1));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");

  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}
