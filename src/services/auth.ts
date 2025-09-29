import { api } from "@/lib/api";
export type User = { id: number; username: string; role: string; active?: boolean };

export const Auth = {
  login: (username: string, password: string, role?: string) =>
    api.post<{ user: User }>("/api/auth/login", { username, password, role }),
  me: () => api.get<{ user: User }>("/api/auth/me"),
  logout: () => api.post<{ ok: boolean }>("/api/auth/logout"),
};
