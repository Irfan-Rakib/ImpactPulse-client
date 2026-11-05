const API_URL = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

interface TokenCache {
  token: string;
  expiresAt: number;
}

let tokenCache: TokenCache | null = null;

export function clearAuthToken() {
  tokenCache = null;
}

async function getAuthToken() {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    const response = await fetch("/api/auth/token", {
      credentials: "include",
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    if (!response.ok) return null;

    const data = (await response.json().catch(() => null)) as {
      token?: string;
    } | null;

    if (!data?.token) return null;

    tokenCache = {
      token: data.token,
      // Better Auth JWT tokens live for 15 minutes by default.
      expiresAt: Date.now() + 10 * 60 * 1000,
    };

    return data.token;
  } catch {
    return null;
  }
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> {
  try {
    const headers = new Headers(options.headers);

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    if (requiresAuth) {
      const token = await getAuthToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }

    const response = await fetch(
      `${API_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
      {
        ...options,
        headers,
        credentials: "include",
        cache: "no-store",
      },
    );

    let data: unknown = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      if (response.status === 401 && requiresAuth) {
        clearAuthToken();
      }

      const payload = data as { message?: string } | null;

      throw new Error(
        payload?.message ||
          (response.status === 401
            ? "Please log in to continue."
            : "Something went wrong. Please try again."),
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error("Unable to connect to ImpactPulse server.");
  }
}
