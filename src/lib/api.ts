const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

export const syncToken = async (forceRefresh = false): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  const existingToken = localStorage.getItem("fixlab_token");
  if (existingToken && !forceRefresh) return existingToken;

  try {
    const sessionRes = await fetch("/api/auth/get-session", {
      credentials: "include",
      cache: "no-store",
    });

    if (!sessionRes.ok) return null;

    const sessionData = await sessionRes.json();
    const email = sessionData?.user?.email;
    if (!email) return null;

    const jwtRes = await fetch(`${SERVER_URL}/api/auth/jwt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!jwtRes.ok) return null;

    const jwtData = await jwtRes.json();
    if (jwtData?.token) {
      localStorage.setItem("fixlab_token", jwtData.token);
      return jwtData.token;
    }
  } catch {
    // ignore token sync failure
  }

  return null;
};

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  let token =
    typeof window !== "undefined" ? localStorage.getItem("fixlab_token") : null;

  if (!token && endpoint !== "/api/auth/jwt") {
    token = await syncToken(false);
  }

  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const rawText = await res.text();
  let data: any = null;

  if (rawText) {
    try {
      data = JSON.parse(rawText);
    } catch {
      if (!res.ok) {
        throw new Error(
          `Request failed (${res.status}): Non-JSON response from ${endpoint}`
        );
      }
      throw new Error(`Invalid JSON response from ${endpoint}`);
    }
  }

  if (!res.ok) {
    throw new Error(
      data?.message || `Request failed with status ${res.status}`
    );
  }

  return data;
};