import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { apiFetch } from "@/lib/api";

type Faq = { id: number; question: string; answer: string; category_name: string };

export function StudentFaqPage() {
  const [items, setItems] = useState<Faq[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (q) params.set("search", q);
    void (async () => {
      const rows = await apiFetch<Faq[]>(`/api/v1/faqs/public?${params.toString()}`);
      setItems(rows);
    })();
  }, [q]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <StudentNavbar active="FAQ" />
      <div className="bg-gradient-to-b from-ipb-navy to-ipb-blue px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-3xl font-bold">Frequently Asked Questions</div>
          <div className="mt-2 max-w-2xl text-sm text-white/80">Temukan jawaban sebelum mengajukan permintaan layanan akademik.</div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              className="input-field sm:flex-1"
              placeholder="Cari pertanyaan, topik, atau kata kunci..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <button type="button" className="btn-primary bg-sky-100 text-ipb-navy hover:bg-white">
              Cari
            </button>
          </div>
        </div>
      </div>
      <div className="page-shell -mt-8 space-y-4">
        <div className="card-surface divide-y divide-slate-100">
          {items.map((f) => {
            const isOpen = open === f.id;
            return (
              <div key={f.id} className="p-4">
                <button type="button" className="flex w-full items-start justify-between gap-3 text-left" onClick={() => setOpen(isOpen ? null : f.id)}>
                  <div className="text-sm font-semibold text-ipb-navy">{f.question}</div>
                  <span className="badge-pill bg-emerald-50 text-emerald-800">{f.category_name}</span>
                </button>
                <AnimatePresence>
                  {isOpen ? (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="pt-3 text-sm text-slate-700 whitespace-pre-line">{f.answer}</div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
