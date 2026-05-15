import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastHost } from "@/components/ToastHost";
import { RequireAuth } from "@/app/RequireAuth";
import { useAuthStore, type Role } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { StudentDashboardPage } from "@/pages/mahasiswa/Dashboard";
import { StudentAjukanPage } from "@/pages/mahasiswa/Ajukan";
import { StudentLacakPage } from "@/pages/mahasiswa/Lacak";
import { StudentLacakDetailPage } from "@/pages/mahasiswa/LacakDetail";
import { StudentFaqPage } from "@/pages/mahasiswa/Faq";
import { StudentDiskusiPage } from "@/pages/mahasiswa/Diskusi";
import { StudentNotificationsPage } from "@/pages/mahasiswa/Notifications";
import { StudentProfilePage } from "@/pages/mahasiswa/Profile";
import { StaffDashboardPage } from "@/pages/staff/Dashboard";
import { StaffRequestsPage } from "@/pages/staff/Requests";
import { StaffFaqPage } from "@/pages/staff/Faq";
import { StaffDiskusiPage } from "@/pages/staff/Diskusi";
import { AdminDashboardPage } from "@/pages/admin/Dashboard";

function RoleHome() {
  const role = useAuthStore((s) => s.role) as Role | null;
  if (role === "mahasiswa") return <Navigate to="/m" replace />;
  if (role === "staff") return <Navigate to="/s" replace />;
  if (role === "admin") return <Navigate to="/a" replace />;
  return <Navigate to="/login" replace />;
}

export function App() {
  const theme = useThemeStore((s) => s.theme);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<RequireAuth><RoleHome /></RequireAuth>} />

        <Route
          path="/m"
          element={
            <RequireAuth roles={["mahasiswa"]}>
              <StudentDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/m/ajukan"
          element={
            <RequireAuth roles={["mahasiswa"]}>
              <StudentAjukanPage />
            </RequireAuth>
          }
        />
        <Route
          path="/m/lacak"
          element={
            <RequireAuth roles={["mahasiswa"]}>
              <StudentLacakPage />
            </RequireAuth>
          }
        />
        <Route
          path="/m/lacak/:id"
          element={
            <RequireAuth roles={["mahasiswa"]}>
              <StudentLacakDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/m/faq"
          element={
            <RequireAuth roles={["mahasiswa"]}>
              <StudentFaqPage />
            </RequireAuth>
          }
        />
        <Route
          path="/m/diskusi"
          element={
            <RequireAuth roles={["mahasiswa"]}>
              <StudentDiskusiPage />
            </RequireAuth>
          }
        />
        <Route
          path="/m/notifications"
          element={
            <RequireAuth roles={["mahasiswa"]}>
              <StudentNotificationsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/m/profile"
          element={
            <RequireAuth roles={["mahasiswa"]}>
              <StudentProfilePage />
            </RequireAuth>
          }
        />

        <Route
          path="/s"
          element={
            <RequireAuth roles={["staff", "admin"]}>
              <StaffDashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/s/requests"
          element={
            <RequireAuth roles={["staff", "admin"]}>
              <StaffRequestsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/s/faq"
          element={
            <RequireAuth roles={["staff", "admin"]}>
              <StaffFaqPage />
            </RequireAuth>
          }
        />
        <Route
          path="/s/diskusi"
          element={
            <RequireAuth roles={["staff", "admin"]}>
              <StaffDiskusiPage />
            </RequireAuth>
          }
        />

        <Route
          path="/a"
          element={
            <RequireAuth roles={["admin"]}>
              <AdminDashboardPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastHost />
    </BrowserRouter>
  );
}
