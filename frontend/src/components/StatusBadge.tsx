import { cn } from "@/lib/cn";

const toneMap = {
  pending: "bg-amber-50 text-amber-800",
  open: "bg-orange-50 text-orange-800",
  in_progress: "bg-sky-50 text-sky-800",
  resolved: "bg-emerald-50 text-emerald-800",
} as const;

export type TicketStatusKey = keyof typeof toneMap;

export function StatusBadge({ status, label }: { status: TicketStatusKey | string; label?: string }) {
  const tone = toneMap[status as TicketStatusKey] ?? "bg-slate-100 text-slate-700";
  return <span className={cn("badge-pill", tone)}>{label ?? status}</span>;
}
