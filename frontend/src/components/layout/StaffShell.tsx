import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Ticket, FileQuestion, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/cn";

const items = [
  { to: "/s", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/s/requests", label: "Requests", icon: Ticket },
  { to: "/s/faq", label: "Kelola FAQ", icon: FileQuestion },
  { to: "/s/diskusi", label: "Kelola Diskusi", icon: MessageSquare },
];

export function StaffShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="sidebar hidden lg:flex">
        <div className="flex items-center gap-3 px-5 py-6">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xs font-bold">IPB</div>
          <div>
            <div className="text-base font-bold">IPB Help</div>
            <div className="text-xs text-white/70">Staff Panel</div>
          </div>
        </div>
        <div className="px-5 pb-2 text-xs font-semibold uppercase tracking-wide text-white/50">Menu utama</div>
        <nav className="flex flex-1 flex-col gap-1 px-3 pb-6">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10",
                  isActive && "bg-white/15 text-white",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto px-4 pb-6">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>
      <div className="flex-1">
        <div className="bg-gradient-to-r from-ipb-navy to-ipb-blue px-6 py-8 text-white">
          <div className="mx-auto max-w-6xl">
            <div className="text-2xl font-bold">{title}</div>
            {subtitle ? <div className="mt-1 text-sm text-white/80">{subtitle}</div> : null}
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}

export function StaffMobileBar() {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 bg-ipb-navy px-4 py-3 text-white lg:hidden">
      <Link to="/s" className="text-sm font-semibold">
        IPB Help
      </Link>
      <Link to="/s/requests" className="text-xs text-white/80">
        Menu
      </Link>
    </div>
  );
}
