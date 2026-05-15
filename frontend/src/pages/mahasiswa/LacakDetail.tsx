import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { StatusBadge } from "@/components/StatusBadge";
import { apiFetch } from "@/lib/api";

type Ticket = {
  public_id: string;
  title: string;
  description: string;
  status: string;
  category_name: string;
  created_at: string;
  due_at?: string | null;
};

type Msg = { id: number; sender_name: string; message: string; created_at: string };

export function StudentLacakDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!id) return;
    void (async () => {
      const t = await apiFetch<Ticket>(`/api/v1/tickets/me/item/${encodeURIComponent(id)}`);
      setTicket(t);
      const m = await apiFetch<Msg[]>(`/api/v1/tickets/me/item/${encodeURIComponent(id)}/messages`);
      setMessages(m);
    })();
  }, [id]);

  const send = async () => {
    if (!id || !text.trim()) return;
    await apiFetch(`/api/v1/tickets/me/item/${encodeURIComponent(id)}/messages`, {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });
    setText("");
    const m = await apiFetch<Msg[]>(`/api/v1/tickets/me/item/${encodeURIComponent(id)}/messages`);
    setMessages(m);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <StudentNavbar active="Lacak Status" />
      <div className="page-shell space-y-6">
        <div>
          <div className="text-3xl font-bold text-ipb-navy">Detail — {ticket?.public_id}</div>
          <div className="text-sm text-slate-600">
            Estimasi selesai: {ticket?.due_at ? new Date(ticket.due_at).toLocaleDateString("id-ID") : "Menyesuaikan"}
          </div>
        </div>
        <div className="card-surface p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
            <div>
              <div className="text-lg font-semibold text-ipb-navy">{ticket?.title}</div>
              <div className="mt-2 text-sm text-slate-700">{ticket?.description}</div>
            </div>
            {ticket ? <StatusBadge status={ticket.status as never} /> : null}
          </div>
          <div className="mt-8 border-l border-slate-200 pl-6">
            {[
              { label: "Submitted", done: true, note: "Permohonan diterima" },
              { label: "Verifikasi Dokumen", done: true, note: "Dokumen lengkap, dilanjutkan ke staff terkait" },
              { label: "In Progress", done: ticket?.status === "in_progress" || ticket?.status === "resolved", note: "" },
              { label: "Resolved", done: ticket?.status === "resolved", note: "" },
            ].map((step, idx) => (
              <div key={step.label} className="relative pb-8 last:pb-0">
                <div className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-white bg-ipb-blue" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className={`text-sm font-semibold ${step.done ? "text-ipb-navy" : "text-slate-400"}`}>{step.label}</div>
                    {step.note ? <div className="mt-2 rounded-lg bg-sky-50 px-3 py-2 text-xs text-sky-800">{step.note}</div> : null}
                  </div>
                  <div className="text-xs text-slate-500">{idx + 12} Mar</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="card-surface p-6">
          <div className="text-lg font-bold text-ipb-navy">Percakapan dengan staff</div>
          <div className="mt-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm">
                <div className="text-xs font-semibold text-slate-700">{m.sender_name}</div>
                <div className="mt-1 text-slate-800">{m.message}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input className="input-field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Tulis pesan" />
            <button type="button" className="btn-primary" onClick={() => void send()}>
              Kirim
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <Link to="/m/lacak" className="btn-primary">
            ← Kembali
          </Link>
        </div>
      </div>
    </div>
  );
}
