import { authClient } from "./auth-client";

export const syncToken = async () => {
  try {
    const session = await authClient.getSession();
    if (session?.data?.user?.email) {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.data.user.email }),
      });

      if (res.ok) {
        const tokenData = await res.json();
        if (tokenData.token) {
          localStorage.setItem("fixlab_token", tokenData.token);
          return true;
        }
      }
    }
    return false;
  } catch (error) {
    console.error("Token sync failed", error);
    return false;
  }
};