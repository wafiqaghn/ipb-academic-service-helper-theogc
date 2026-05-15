import { useEffect, useState } from "react";
import { StaffShell, StaffMobileBar } from "@/components/layout/StaffShell";
import { apiFetch } from "@/lib/api";

type Summary = {
  total_users: number;
  total_tickets: number;
  tickets_by_status: Record<string, number>;
  tickets_by_category: Record<string, number>;
};

export function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  useEffect(() => {
    void (async () => {
      const s = await apiFetch<Summary>("/api/v1/admin/analytics/summary");
      setSummary(s);
    })();
  }, []);

  const chartData = summary
    ? Object.entries(summary.tickets_by_category).map(([name, value]) => ({ name, value }))
    : [];
  const max = Math.max(1, ...chartData.map((d) => d.value));

  return (
    <div>
      <StaffMobileBar />
      <StaffShell title="Admin Analytics" subtitle="Monitoring layanan dan beban tiket">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="stat-card">
            <div className="text-3xl font-bold text-ipb-navy">{summary?.total_users ?? 0}</div>
            <div className="text-sm text-slate-600">Total pengguna</div>
          </div>
          <div className="stat-card">
            <div className="text-3xl font-bold text-ipb-navy">{summary?.total_tickets ?? 0}</div>
            <div className="text-sm text-slate-600">Total tiket</div>
          </div>
          <div className="stat-card">
            <div className="text-sm font-semibold text-ipb-navy">Status</div>
            <div className="mt-2 space-y-1 text-xs text-slate-700">
              {summary
                ? Object.entries(summary.tickets_by_status).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="capitalize">{k}</span>
                      <span className="font-semibold">{v}</span>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
        <div className="mt-6 card-surface p-6">
          <div className="text-lg font-bold text-ipb-navy">Tiket per kategori</div>
          <div className="mt-4 space-y-3">
            {chartData.map((d) => (
              <div key={d.name} className="flex items-center gap-3">
                <div className="w-44 truncate text-xs font-medium text-slate-700">{d.name}</div>
                <div className="h-2 flex-1 rounded-full bg-slate-100">
                  <div className="h-2 rounded-full bg-ipb-blue" style={{ width: `${(d.value / max) * 100}%` }} />
                </div>
                <div className="w-8 text-right text-xs font-semibold">{d.value}</div>
              </div>
            ))}
          </div>
        </div>
      </StaffShell>
    </div>
  );
}
