import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

export function StudentDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [unread, setUnread] = useState(0);
  useEffect(() => {
    void (async () => {
      try {
        const res = await apiFetch<{ items: Ticket[] }>("/api/v1/tickets/me?page_size=5");
        setTickets(res.items);
        const n = await apiFetch<{ count: number }>("/api/v1/notifications/unread-count");
        setUnread(n.count);
      } catch {
        setTickets([]);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <StudentNavbar />
      <div className="page-shell space-y-8">
        <div>
          <div className="text-3xl font-bold text-ipb-navy">Selamat datang, Quina</div>
          <div className="mt-1 text-sm text-slate-600">Ringkasan tiket Anda dan akses cepat layanan akademik.</div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Pending / Open", value: tickets.filter((t) => t.status === "open" || t.status === "pending").length },
            { label: "Diproses", value: tickets.filter((t) => t.status === "in_progress").length },
            { label: "Selesai", value: tickets.filter((t) => t.status === "resolved").length },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="text-3xl font-bold text-ipb-navy">{s.value}</div>
              <div className="text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="card-surface p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-ipb-navy">Riwayat tiket terbaru</div>
              <Link to="/m/lacak" className="text-sm font-semibold text-ipb-blue hover:underline">
                Lihat semua
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {tickets.length === 0 ? <div className="text-sm text-slate-600">Belum ada data tiket.</div> : null}
              {tickets.map((t) => (
                <motion.div key={t.public_id} layout className="ticket-card">
                  <div>
                    <div className="text-xs font-semibold text-sky-700">#{t.public_id}</div>
                    <div className="text-base font-semibold text-ipb-navy">{t.title}</div>
                    <div className="text-xs text-slate-500">
                      {new Date(t.created_at).toLocaleDateString("id-ID")} • {t.category_name}
                    </div>
                  </div>
                  <StatusBadge status={t.status as never} />
                </motion.div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <div className="card-surface p-5">
              <div className="text-sm font-semibold text-ipb-navy">Notifikasi</div>
              <div className="mt-2 text-2xl font-bold">{unread}</div>
              <div className="text-xs text-slate-600">Belum dibaca</div>
              <Link to="/m/notifications" className="mt-3 inline-block text-sm font-semibold text-ipb-blue hover:underline">
                Buka pusat notifikasi
              </Link>
            </div>
            <div className="card-surface p-5">
              <div className="text-sm font-semibold text-ipb-navy">Akses cepat</div>
              <div className="mt-3 grid gap-2 text-sm">
                <Link className="rounded-lg bg-slate-50 px-3 py-2 font-medium text-ipb-navy hover:bg-slate-100" to="/m/ajukan">
                  Ajukan layanan
                </Link>
                <Link className="rounded-lg bg-slate-50 px-3 py-2 font-medium text-ipb-navy hover:bg-slate-100" to="/m/faq">
                  Cari FAQ
                </Link>
                <Link className="rounded-lg bg-slate-50 px-3 py-2 font-medium text-ipb-navy hover:bg-slate-100" to="/m/diskusi">
                  Diskusi akademik
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
