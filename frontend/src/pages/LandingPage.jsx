import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpenCheck, LifeBuoy, ShieldCheck } from "lucide-react";
import logoIpb from '@/assets/logo-ipb.png';

const categories = [
  "Surat akademik",
  "Cuti kuliah",
  "KRS & IRS",
  "Transkrip",
  "Beasiswa",
  "Wisuda",
  "Perwalian",
  "Sistem akademik",
  "Pembayaran UKT",
  "Layanan lainnya",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021A34] via-[#0C447C] to-sky-200">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center p-1 backdrop-blur-sm">
            <img
              src={logoIpb}
              alt="Logo IPB"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="text-sm font-semibold sm:text-base">
            IPB Academic Help Center
          </div>
        </div>

        <Link
          to="/login"
          className="px-4 py-2 text-sm font-semibold rounded-lg bg-white text-[#021A34] hover:bg-slate-100 transition-colors"
        >
          Masuk
        </Link>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6 text-white sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="max-w-3xl">
            <div className="text-3xl font-bold leading-tight sm:text-5xl">
              Pusat bantuan akademik modern untuk civitas IPB.
            </div>

            <p className="mt-4 text-base text-white/80 sm:text-lg">
              Ajukan layanan, lacak status, diskusi dengan staff, dan temukan
              jawaban FAQ — dalam satu pengalaman dashboard premium.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Mulai sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/login"
                className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Lihat FAQ publik
              </Link>
            </div>
          </div>
        </motion.div>

        <section className="mt-14 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Mahasiswa",
              desc: "Ajukan tiket, unggah lampiran, dan pantau progres layanan.",
              icon: BookOpenCheck,
            },
            {
              title: "Staff",
              desc: "Kelola antrian, balas percakapan, dan perbarui status dengan cepat.",
              icon: LifeBuoy,
            },
            {
              title: "Admin",
              desc: "Pantau layanan, pengguna, FAQ, dan kinerja operasional.",
              icon: ShieldCheck,
            },
          ].map((c) => (
            <motion.div
              key={c.title}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-lg backdrop-blur"
            >
              <c.icon className="h-6 w-6" />

              <div className="mt-3 text-lg font-semibold">{c.title}</div>

              <div className="mt-2 text-sm text-white/75">{c.desc}</div>
            </motion.div>
          ))}
        </section>

        <section className="mt-14 rounded-3xl bg-white p-6 text-slate-900 shadow-lg sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="text-xl font-bold">
                Kategori layanan akademik
              </div>

              <div className="text-sm text-slate-600">
                Pilih jalur yang paling sesuai saat mengajukan tiket.
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((name) => (
              <div
                key={name}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
              >
                <div className="text-sm font-semibold text-[#021A34]">
                  {name}
                </div>

                <div className="text-xs text-slate-600 mt-1">
                  Siap mendukung proses administrasi Anda.
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/15 bg-white/10 p-6 text-white backdrop-blur sm:p-8">
          <div className="text-xl font-bold">FAQ singkat</div>

          <div className="mt-4 space-y-3 text-sm text-white/85">
            <div>Bagaimana cara mengajukan transkrip resmi?</div>
            <div>
              Apakah saya bisa mengecek status tanpa mengunjungi kampus?
            </div>
            <div>Bagaimana jika dokumen saya ditolak oleh sistem?</div>
          </div>

          <div className="mt-6 text-sm text-white/80">
            Jawaban lengkap tersedia setelah masuk sebagai mahasiswa.
          </div>
        </section>
      </main>
    </div>
  );
}
