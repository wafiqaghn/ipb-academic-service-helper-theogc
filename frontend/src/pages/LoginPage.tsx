import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { ApiError, apiFetch } from "@/lib/api";
import { decodeJwt } from "@/lib/jwt";
import { useAuthStore, type Role } from "@/store/authStore";
import { useToastStore } from "@/store/toastStore";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const [role, setRole] = useState<Role>("mahasiswa");
  const [loading, setLoading] = useState(false);
  const setSession = useAuthStore((s) => s.setSession);
  const pushToast = useToastStore((s) => s.push);
  const navigate = useNavigate();
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "" } });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    try {
      const res = await apiFetch<{ access_token: string }>("/api/v1/auth/login", {
        method: "POST",
        auth: false,
        body: JSON.stringify({ email: values.email, password: values.password, role }),
      });
      const payload = decodeJwt<{ role: Role; sub: string }>(res.access_token);
      setSession(res.access_token, payload.role, values.email);
      pushToast({ title: "Login berhasil", description: "Selamat datang kembali.", tone: "success" });
      if (payload.role === "mahasiswa") navigate("/m");
      else if (payload.role === "staff") navigate("/s");
      else navigate("/a");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Terjadi kesalahan";
      pushToast({ title: "Login gagal", description: msg, tone: "error" });
    } finally {
      setLoading(false);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-ipb-navy to-ipb-blue px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="auth-form mt-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-ipb-navy text-sm font-bold text-white">IPB</div>
          <div className="text-xl font-bold text-ipb-navy">IPB Academic Help Center</div>
          <div className="text-sm text-slate-600">Masuk sesuai peran Anda</div>
        </div>
        <div className="mt-6 rounded-xl bg-slate-100 p-1">
          <div className="grid grid-cols-3 gap-1">
            {(["mahasiswa", "staff", "admin"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg px-2 py-2 text-xs font-semibold capitalize sm:text-sm ${
                  role === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <AnimatePresence mode="wait">
            <motion.div key={role} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
              <label className="text-sm font-semibold text-ipb-navy">IPB Username / E-mail</label>
              <input className="input-field mt-1" type="email" autoComplete="username" {...form.register("email")} />
              {form.formState.errors.email ? (
                <div className="mt-1 text-xs text-red-600">{form.formState.errors.email.message}</div>
              ) : null}
            </motion.div>
          </AnimatePresence>
          <div>
            <label className="text-sm font-semibold text-ipb-navy">Kata Sandi</label>
            <input className="input-field mt-1" type="password" autoComplete="current-password" {...form.register("password")} />
            {form.formState.errors.password ? (
              <div className="mt-1 text-xs text-red-600">{form.formState.errors.password.message}</div>
            ) : null}
            <div className="mt-2 text-right text-xs font-semibold text-ipb-blue">
              <button type="button" className="hover:underline">
                Lupa kata sandi?
              </button>
            </div>
          </div>
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk ke Sistem"}
          </button>
          <div className="text-center text-xs text-slate-500">
            Demo: <span className="font-semibold">quina@apps.ipb.ac.id</span> / <span className="font-semibold">Password123!</span>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
