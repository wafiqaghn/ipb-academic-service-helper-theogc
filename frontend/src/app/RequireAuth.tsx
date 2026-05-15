import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, type Role } from "@/store/authStore";

export function RequireAuth({ children, roles }: { children: ReactNode; roles?: Role[] }) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (roles && role && !roles.includes(role)) return <Navigate to="/" replace />;
  return children;
}
