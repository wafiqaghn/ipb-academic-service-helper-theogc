import { Bell, LogOut, Moon, Search, Sun } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/lib/cn";

const studentLinks = [
  { to: "/m/faq", label: "FAQ" },
  { to: "/m/ajukan", label: "Ajukan Layanan" },
  { to: "/m/lacak", label: "Lacak Status" },
  { to: "/m/diskusi", label: "Diskusi" },
];

export function StudentNavbar({ active }: { active?: string }) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  return (
    <header className="navbar">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/m" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xs font-bold">IPB</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">IPB Academic Help Center</div>
            <div className="text-xs text-white/70">Mahasiswa</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {studentLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10",
                  (isActive || active === l.label) && "bg-white/15 text-white",
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" className="btn-ghost text-white hover:bg-white/10" aria-label="Cari">
            <Search className="h-5 w-5" />
          </button>
          <Link to="/m/notifications" className="btn-ghost text-white hover:bg-white/10" aria-label="Notifikasi">
            <Bell className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="btn-ghost text-white hover:bg-white/10"
            onClick={toggleTheme}
            aria-label="Toggle tema"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Link to="/m/profile" className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm sm:flex">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-xs font-bold">QR</div>
            <div className="leading-tight">
              <div className="font-semibold">Quina Rizky</div>
              <div className="text-xs text-white/70">Mahasiswa</div>
            </div>
          </Link>
          <button
            type="button"
            className="btn-danger px-3 py-2 text-xs sm:text-sm"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            <span className="hidden sm:inline">Keluar</span>
            <LogOut className="h-4 w-4 sm:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}
