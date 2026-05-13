import { apiFetch, setTokens, clearTokens } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: string[];
  joinedAt?: string;
  avatarUrl?: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

function storeUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
}

export async function register(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  setTokens(data.accessToken, data.refreshToken);
  storeUser(data.user);
  return data;
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setTokens(data.accessToken, data.refreshToken);
  storeUser(data.user);
  return data;
}

export async function logout(): Promise<void> {
  try {
    await apiFetch("/auth/logout", { method: "POST" }, true);
  } finally {
    clearTokens();
  }
}

export async function getMe(): Promise<User> {
  return apiFetch<User>("/auth/me", {}, true);
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  return raw ? (JSON.parse(raw) as User) : null;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const updated = await apiFetch<User>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  }, true);
  storeUser(updated);
  return updated;
}
