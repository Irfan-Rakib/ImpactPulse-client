const API_URL = process.env.BACKEND_URL || "http://localhost:5000";

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false,
): Promise<T> {
  try {
    const headers = new Headers(options.headers);

    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
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

    let data: any;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      throw new Error(
        data?.message ||
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
