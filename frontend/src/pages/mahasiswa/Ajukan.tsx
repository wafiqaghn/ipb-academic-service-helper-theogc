import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { apiFetch } from "@/lib/api";
import { useToastStore } from "@/store/toastStore";

type Category = { id: number; name: string };

const schema = z.object({
  category_id: z.coerce.number().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  attachment_urls: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;

export function StudentAjukanPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const push = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category_id: 1, title: "", description: "", priority: "normal", attachment_urls: [] },
  });

  useEffect(() => {
    void (async () => {
      const rows = await apiFetch<Category[]>("/api/v1/categories");
      setCategories(rows);
    })();
  }, []);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await apiFetch("/api/v1/tickets", { method: "POST", body: JSON.stringify(values) });
      push({ title: "Pengajuan berhasil", description: "Tiket telah dibuat.", tone: "success" });
      navigate("/m/lacak");
    } catch {
      push({ title: "Gagal mengajukan", description: "Periksa kembali isian Anda.", tone: "error" });
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <StudentNavbar active="Ajukan Layanan" />
      <div className="page-shell space-y-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="text-3xl font-bold text-ipb-navy">Ajukan Layanan Akademik</div>
            <div className="text-sm text-slate-600">Lengkapi formulir berikut untuk mengajukan permintaan layanan.</div>
          </div>
        </div>
        <form className="card-surface space-y-5 p-6" onSubmit={onSubmit}>
          <div className="text-lg font-bold text-ipb-navy">Detail Permohonan</div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-ipb-navy">Kategori</label>
              <select className="input-field mt-1" {...form.register("category_id")}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-ipb-navy">Prioritas</label>
              <select className="input-field mt-1" {...form.register("priority")}>
                <option value="low">Rendah</option>
                <option value="normal">Normal</option>
                <option value="high">Tinggi</option>
                <option value="urgent">Mendesak</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-ipb-navy">Judul</label>
            <input className="input-field mt-1" {...form.register("title")} />
          </div>
          <div>
            <label className="text-sm font-semibold text-ipb-navy">Deskripsi</label>
            <textarea className="input-field mt-1 min-h-32" {...form.register("description")} />
          </div>
          <div className="flex justify-end">
            <button className="btn-primary" type="submit">
              Ajukan Layanan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
