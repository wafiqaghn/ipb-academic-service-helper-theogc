import { StaffShell, StaffMobileBar } from "@/components/layout/StaffShell";

export function StaffDiskusiPage() {
  return (
    <div>
      <StaffMobileBar />
      <StaffShell title="Kelola Diskusi" subtitle="Moderasi forum layanan akademik">
        <div className="card-surface p-6 text-sm text-slate-700">
          Integrasi daftar diskusi staff mengikuti endpoint <span className="font-mono">/api/v1/discussions</span> dengan filter status.
        </div>
      </StaffShell>
    </div>
  );
}
