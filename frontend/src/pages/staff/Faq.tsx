import { StaffShell, StaffMobileBar } from "@/components/layout/StaffShell";

export function StaffFaqPage() {
  return (
    <div>
      <StaffMobileBar />
      <StaffShell title="Kelola Konten FAQ" subtitle="Tambah, edit, dan publikasikan FAQ">
        <div className="card-surface p-6 text-sm text-slate-700">
          Gunakan endpoint admin <span className="font-mono">/api/v1/faqs/admin</span> melalui tools API Anda. UI manajemen penuh dapat
          ditambahkan dengan tabel reusable pada iterasi berikutnya.
        </div>
      </StaffShell>
    </div>
  );
}
