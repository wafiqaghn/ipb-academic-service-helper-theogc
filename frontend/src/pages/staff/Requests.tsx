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

export function StaffRequestsPage() {
  const [rows, setRows] = useState<Ticket[]>([]);
  useEffect(() => {
    void (async () => {
      const t = await apiFetch<{ items: Ticket[] }>("/api/v1/staff/tickets?page_size=50");
      setRows(t.items);
    })();
  }, []);

  const take = async (publicId: string) => {
    await apiFetch(`/api/v1/staff/tickets/${encodeURIComponent(publicId)}/take`, { method: "POST" });
    const t = await apiFetch<{ items: Ticket[] }>("/api/v1/staff/tickets?page_size=50");
    setRows(t.items);
  };

  return (
    <div>
      <StaffMobileBar />
      <StaffShell title="Manajemen Requests" subtitle="Kelola seluruh tiket layanan akademik">
        <div className="card-surface overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Mahasiswa</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.public_id}>
                  <td className="px-4 py-3 font-mono text-xs">{r.public_id}</td>
                  <td className="px-4 py-3 font-semibold">{r.title}</td>
                  <td className="px-4 py-3">{r.student_name}</td>
                  <td className="px-4 py-3">{r.category_name}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status as never} />
                  </td>
                  <td className="px-4 py-3">
                    {r.status === "open" ? (
                      <button type="button" className="btn-primary px-3 py-1 text-xs" onClick={() => void take(r.public_id)}>
                        Ambil
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500">—</span>
                    )}
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
