export const api = {
  post: async <T>(url: string, body?: unknown) => {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // <- MUY IMPORTANTE (cookie httpOnly)
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!r.ok) throw new Error((await r.json()).error || r.statusText);
    return (await r.json()) as T;
  },
  get: async <T>(url: string) => {
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok) throw new Error((await r.json()).error || r.statusText);
    return (await r.json()) as T;
  },
};
