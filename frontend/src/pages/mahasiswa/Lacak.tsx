import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { StatusBadge } from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";

type Ticket = {
  public_id: string;
  title: string;
  status: string;
  category_name: string;
  created_at: string;
};

export function StudentLacakPage() {
  const [items, setItems] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [q, setQ] = useState("");
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (filter !== "all") params.set("status", filter);
    params.set("page_size", "20");
    return `/api/v1/tickets/me?${params.toString()}`;
  }, [filter, q]);

  useEffect(() => {
    void (async () => {
      const res = await apiFetch<{ items: Ticket[] }>(query);
      setItems(res.items);
    })();
  }, [query]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <StudentNavbar active="Lacak Status" />
      <div className="page-shell space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="text-3xl font-bold text-ipb-navy">Lacak Status Permohonan</div>
            <div className="text-sm text-slate-600">Pantau perkembangan semua permohonan layanan Anda.</div>
          </div>
          <Link to="/m/ajukan" className="btn-primary inline-flex items-center justify-center gap-2 self-start">
            + Ajukan baru
          </Link>
        </div>
        <div className="card-surface flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            className="input-field sm:max-w-xl"
            placeholder="Cari ID Tiket atau judul"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "Semua" },
              { id: "open", label: "Open" },
              { id: "in_progress", label: "In Progress" },
              { id: "resolved", label: "Resolved" },
            ].map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setFilter(b.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold ${
                  filter === b.id ? "bg-ipb-blue text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {items.map((t) => (
            <Link key={t.public_id} to={`/m/lacak/${encodeURIComponent(t.public_id)}`} className="block">
              <div className="ticket-card hover:border-ipb-blue/30">
                <div>
                  <div className="text-xs font-semibold text-sky-700">#{t.public_id}</div>
                  <div className="text-lg font-semibold text-ipb-navy">{t.title}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(t.created_at).toLocaleDateString("id-ID")} • {t.category_name}
                  </div>
                </div>
                <StatusBadge status={t.status as never} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
