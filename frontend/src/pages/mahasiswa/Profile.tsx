import { useEffect, useState } from "react";
import { StudentNavbar } from "@/components/layout/StudentNavbar";
import { apiFetch } from "@/lib/api";

type Me = { name: string; email: string; role: string; nim?: string | null; faculty?: string | null };

export function StudentProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  useEffect(() => {
    void (async () => {
      const row = await apiFetch<Me>("/api/v1/auth/me");
      setMe(row);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
      <StudentNavbar />
      <div className="page-shell space-y-4">
        <div className="text-3xl font-bold text-ipb-navy">Informasi Profil Anda</div>
        <div className="card-surface p-8">
          <div className="text-lg font-bold text-ipb-navy">Contact Information</div>
          <div className="mt-6 space-y-4 text-sm">
            <div>
              <div className="font-semibold text-ipb-navy">Email Address</div>
              <div className="text-slate-700">{me?.email}</div>
            </div>
            <div>
              <div className="font-semibold text-ipb-navy">Full Name</div>
              <div className="text-slate-700">{me?.name}</div>
            </div>
            <div>
              <div className="font-semibold text-ipb-navy">Jenis Pengguna</div>
              <div className="text-slate-700 capitalize">{me?.role}</div>
            </div>
            <div>
              <div className="font-semibold text-ipb-navy">NIM/NIP</div>
              <div className="text-slate-700">{me?.nim ?? "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
