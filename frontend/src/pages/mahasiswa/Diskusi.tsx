import { useEffect, useState } from "react";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { StatusBadge } from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";

type Discussion = {
  public_id: string;
  title: string;
  body: string;
  category_name: string;
  status: string;
  author_name: string;
  reply_count: number;
  created_at: string;
};

export function StudentDiskusiPage() {
  const [items, setItems] = useState<Discussion[]>([]);
  useEffect(() => {
    void (async () => {
      const rows = await apiFetch<Discussion[]>("/api/v1/discussions?page_size=20");
      setItems(rows);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentNavbar active="Diskusi" />
      <div className="bg-gradient-to-r from-ipb-navy to-ipb-blue px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-3xl font-bold">Diskusi Layanan Akademik</div>
            <div className="mt-1 text-sm text-white/80">Ajukan pertanyaan umum dan berbagi pengalaman dengan civitas.</div>
          </div>
          <button type="button" className="btn-primary bg-sky-100 text-ipb-navy hover:bg-white">
            + Diskusi baru
          </button>
        </div>
      </div>
      <div className="page-shell space-y-3">
        {items.map((d) => (
          <div key={d.public_id} className="ticket-card">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-pill bg-sky-50 text-sky-800">{d.category_name}</span>
                <StatusBadge status={d.status as never} />
              </div>
              <div className="mt-2 text-lg font-semibold text-ipb-navy">{d.title}</div>
              <div className="mt-1 line-clamp-2 text-sm text-slate-600">{d.body}</div>
              <div className="mt-2 text-xs text-slate-500">
                {d.author_name} • {new Date(d.created_at).toLocaleDateString("id-ID")} • {d.reply_count} balasan
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
