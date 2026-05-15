import { useEffect, useState } from "react";
import { StaffShell, StaffMobileBar } from "@/components/layout/StaffShell";
import { apiFetch } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";

type Ticket = {
  public_id: string;
  title: string;
  student_name: string;
  category_name: string;
  status: string;
  created_at: string;
};

export function StaffDashboardPage() {
  const [metrics, setMetrics] = useState<{ open: number; in_progress: number; resolved_month: number } | null>(null);
  const [rows, setRows] = useState<Ticket[]>([]);
  useEffect(() => {
    void (async () => {
      const m = await apiFetch<{ open: number; in_progress: number; resolved_month: number }>("/api/v1/staff/dashboard/metrics");
      setMetrics(m);
      const t = await apiFetch<{ items: Ticket[] }>("/api/v1/staff/tickets?page_size=7");
      setRows(t.items);
    })();
  }, []);

  return (
    <div>
      <StaffMobileBar />
      <StaffShell title="Dashboard Staff" subtitle={new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <div className="text-3xl font-bold text-ipb-navy">{metrics?.open ?? 0}</div>
            <div className="text-sm text-slate-600">Tiket Open</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-ipb-navy">{metrics?.in_progress ?? 0}</div>
            <div className="text-sm text-slate-600">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-ipb-navy">{metrics?.resolved_month ?? 0}</div>
            <div className="text-sm text-slate-600">Resolved Bulan Ini</div>
          </div>
        </div>
        <div className="mt-6 card-surface overflow-x-auto">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div className="text-lg font-bold text-ipb-navy">Tiket Perlu Tindakan</div>
          </div>
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Mahasiswa</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Masuk</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.public_id}>
                  <td className="px-4 py-3 font-mono text-xs">{r.public_id}</td>
                  <td className="px-4 py-3 font-semibold text-ipb-navy">{r.title}</td>
                  <td className="px-4 py-3">{r.student_name}</td>
                  <td className="px-4 py-3">{r.category_name}</td>
                  <td className="px-4 py-3">{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status as never} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StaffShell>
    </div>
  );
}
