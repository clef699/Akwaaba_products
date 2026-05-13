const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://akwaabaproducts.com/api";

export interface ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, string[]>;
  reason?: string;
}

function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
}

function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refreshToken");
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    clearTokens();
    window.location.href = "/login";
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data = await res.json();
    setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && authenticated) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      redirectToLogin();
      throw Object.assign(new Error("Session expired. Please log in again."), { status: 401 }) as ApiError;
    }
    headers["Authorization"] = `Bearer ${newToken}`;
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    if (res.status === 401) {
      redirectToLogin();
      throw Object.assign(new Error("Session expired. Please log in again."), { status: 401 }) as ApiError;
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw Object.assign(new Error(body.message || "Request failed"), {
      status: res.status,
      code: body.code,
      details: body.details,
      reason: body.reason,
    }) as ApiError;
  }

  return res.json() as Promise<T>;
}
