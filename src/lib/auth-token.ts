import { authClient } from "./auth-client";

const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

let authTokenRefreshPromise: Promise<string | null> | null = null;

export const syncToken = async (
  forceRefresh = false
): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  const existingToken = localStorage.getItem("fixlab_token");
  if (existingToken && !forceRefresh) {
    return existingToken;
  }

  if (forceRefresh) {
    localStorage.removeItem("fixlab_token");
  }

  if (authTokenRefreshPromise) {
    return authTokenRefreshPromise;
  }

  authTokenRefreshPromise = (async () => {
    try {
      const session = await authClient.getSession();
      const email = session?.data?.user?.email;
      if (!email) return null;

      const res = await fetch(`${SERVER_URL}/api/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) return null;

      const tokenData = await res.json();
      if (tokenData?.token) {
        localStorage.setItem("fixlab_token", tokenData.token);
        return tokenData.token;
      }

      return null;
    } catch (error) {
      console.error("Token sync failed", error);
      return null;
    } finally {
      authTokenRefreshPromise = null;
    }
  })();

  return authTokenRefreshPromise;
};

export const syncAuthToken = syncToken;