export type NotificationRow = {
  id: number;
  title: string;
  message: string;
  kind: "INFO" | "SUCCESS" | "WARN" | "ERROR";
  created_at: string; // "yyyy-mm-dd HH:mm:ss"
  read_at: string | null;
};

export const Notifs = {
  list: async (onlyUnread = true, top = 20): Promise<NotificationRow[]> => {
    const r = await fetch(`/api/me/notifications?unread=${onlyUnread ? 1 : 0}&top=${top}`, {
      credentials: "include",
    });
    if (!r.ok) throw new Error((await r.json()).error || r.statusText);
    return await r.json();
  },
  markRead: async (id: number) => {
    const r = await fetch(`/api/me/notifications/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id }),
    });
    if (!r.ok) throw new Error((await r.json()).error || r.statusText);
    return await r.json(); // { unread: number }
  },
  markAll: async () => {
    const r = await fetch(`/api/me/notifications/mark-read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ all: true }),
    });
    if (!r.ok) throw new Error((await r.json()).error || r.statusText);
    return await r.json();
  },
};
