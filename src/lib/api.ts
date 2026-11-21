const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:5000";

let refreshPromise: Promise<string | null> | null = null;

export const syncToken = async (
  forceRefresh = false
): Promise<string | null> => {
  if (typeof window === "undefined") return null;

  const existingToken = localStorage.getItem("fixlab_token");
  if (existingToken && !forceRefresh) return existingToken;

  if (forceRefresh) {
    localStorage.removeItem("fixlab_token");
  }

  // Prevent duplicate parallel refresh requests
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
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
    } finally {
      refreshPromise = null;
    }

    return null;
  })();

  return refreshPromise;
};

const parseResponse = async (res: Response, endpoint: string) => {
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

  return data;
};

const executeRequest = async (
  endpoint: string,
  options: RequestInit,
  token: string | null
) => {
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(`${SERVER_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

export const fetchApi = async (
  endpoint: string,
  options: RequestInit = {},
  hasRetried = false
): Promise<any> => {
  let token =
    typeof window !== "undefined" ? localStorage.getItem("fixlab_token") : null;

  if (!token && endpoint !== "/api/auth/jwt") {
    token = await syncToken(false);
  }

  let res: Response;
  try {
    res = await executeRequest(endpoint, options, token);
  } catch {
    throw new Error("Unable to reach server. Please check your connection.");
  }

  const data = await parseResponse(res, endpoint);

  const isInvalidTokenError =
    res.status === 401 ||
    String(data?.message || "")
      .toLowerCase()
      .includes("invalid token");

  if (
    !res.ok &&
    isInvalidTokenError &&
    !hasRetried &&
    endpoint !== "/api/auth/jwt"
  ) {
    const freshToken = await syncToken(true);
    if (freshToken) {
      return fetchApi(endpoint, options, true);
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem("fixlab_token");
    }
  }

  if (!res.ok) {
    throw new Error(
      data?.message || `Request failed with status ${res.status}`
    );
  }

  return data;
};