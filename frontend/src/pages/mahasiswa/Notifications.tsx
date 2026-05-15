import { useEffect, useState } from "react";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { apiFetch } from "@/lib/api";

type Notification = { id: number; title: string; body?: string | null; read: boolean; created_at: string };

export function StudentNotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => {
    void (async () => {
      const rows = await apiFetch<Notification[]>("/api/v1/notifications");
      setItems(rows);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <StudentNavbar />
      <div className="page-shell space-y-4">
        <div>
          <div className="text-3xl font-bold text-ipb-navy">Notifikasi</div>
          <div className="text-sm text-slate-600">Pembaruan status dan informasi layanan.</div>
        </div>
        <div className="card-surface divide-y divide-slate-100">
          {items.map((n) => (
            <div key={n.id} className="p-4">
              <div className="text-sm font-semibold text-ipb-navy">{n.title}</div>
              {n.body ? <div className="mt-1 text-sm text-slate-600">{n.body}</div> : null}
              <div className="mt-2 text-xs text-slate-500">{new Date(n.created_at).toLocaleDateString("id-ID")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
