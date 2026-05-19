import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentTopbar from '@/components/layout/StudentTopbar'
import Button from '@/components/ui/Button'

const CATS = [
  { icon: '📋', bg: '#EAF3FC', name: 'Transkip & Nilai',    n: 12 },
  { icon: '🎓', bg: '#EAF3DE', name: 'Surat Keterangan',    n: 8  },
  { icon: '📄', bg: '#FAEEDA', name: 'Beasiswa & KRS',      n: 10 },
  { icon: '🔖', bg: '#EEE8FF', name: 'Legalisir',           n: 6  },
  { icon: '❓', bg: '#FCEBEB', name: 'Lainnya',             n: 5  },
]

const FAQS = [
  {
    q: 'Bagaimana cara mengajukan transkip nilai resmi?',
    cat: 'Transkip',
    a: '1. Login ke sistem\n2. Pilih Ajukan Layanan → Transkip & Legalisir\n3. Isi formulir dan unggah KTM aktif\n4. Submit — estimasi 3–5 hari kerja\n\nNotifikasi email dikirim saat status berubah.',
  },
  {
    q: 'Apakah transkip tersedia dalam bahasa Inggris?',
    cat: 'Transkip',
    a: 'Ya! Centang opsi "Versi Bilingual (Indonesia & Inggris)" saat mengisi formulir. Tidak ada biaya tambahan untuk mahasiswa aktif.',
  },
  {
    q: 'Berapa biaya transkip dengan legalisir?',
    cat: 'Transkip',
    a: 'Gratis untuk mahasiswa aktif IPB. Alumni dikenakan biaya administrasi sesuai tarif yang berlaku. Hubungi TU untuk detail.',
  },
  {
    q: 'Apa saja dokumen yang dibutuhkan untuk surat keterangan aktif?',
    cat: 'Surat Ket.',
    a: 'Cukup KTM aktif. Untuk keperluan tertentu (BPJS, beasiswa, dll), tambahkan surat permohonan yang menjelaskan tujuan penggunaan.',
  },
  {
    q: 'Berapa lama proses pembuatan surat keterangan?',
    cat: 'Surat Ket.',
    a: 'Surat keterangan aktif: 1–2 hari kerja.\nLegalisir ijazah: 3–5 hari kerja.\nSurat rekomendasi: tergantung persetujuan dosen.',
  },
]

export default function FAQ() {
  const [open, setOpen] = useState(0)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const filtered = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) ||
    f.a.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <StudentTopbar />

      {/* Hero */}
      <div className="text-white px-7 py-8"
        style={{ background: 'linear-gradient(135deg,#042C53,#185FA5,#378ADD)' }}>
        <p className="text-[10px] text-ipb-200 tracking-widest uppercase mb-1.5">
          📚 IPB University · Layanan Akademik
        </p>
        <h1 className="text-[22px] font-extrabold mb-1">Frequently Asked Questions</h1>
        <p className="text-[12px] text-ipb-200 mb-4">
          Temukan jawaban sebelum mengajukan permintaan layanan
        </p>
        <div className="flex gap-2 max-w-[460px]">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 h-9 rounded-lg border-none px-3 text-[12px] bg-white/15 text-white placeholder:text-white/50 outline-none"
            placeholder="Cari FAQ: transkip, surat aktif, beasiswa..."
          />
          <Button className="!h-9 !bg-ipb-300 !text-white !rounded-lg">Cari</Button>
        </div>
      </div>

      <div className="p-5">
        {/* Category grid */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2.5 mb-5">
          {CATS.map((c, i) => (
            <button key={i}
              className="bg-white border border-ipb-100 rounded-lg p-3 text-left cursor-pointer hover:shadow-md transition-all"
              onClick={() => setSearch(c.name.split(' ')[0])}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base mb-1.5"
                style={{ background: c.bg }}>
                {c.icon}
              </div>
              <div className="text-[11px] font-semibold text-ipb-900 mb-px">{c.name}</div>
              <div className="text-[9px] text-gray-400">{c.n} artikel</div>
            </button>
          ))}
        </div>

        {/* FAQ accordion */}
        <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mb-3.5">
          <div className="px-4 py-3 border-b border-ipb-50 flex justify-between items-center">
            <span className="text-[13px] font-bold text-ipb-900">
              {search ? `Hasil pencarian: "${search}"` : 'Semua FAQ'}
            </span>
            <span className="text-[10px] text-gray-400">{filtered.length} artikel</span>
          </div>
          <div className="p-1.5">
            {filtered.length === 0 && (
              <div className="text-center py-8 text-[12px] text-gray-400">
                Tidak ada FAQ yang cocok dengan pencarian.<br/>
                <span className="text-ipb-500 cursor-pointer font-medium"
                  onClick={() => navigate('/diskusi/baru')}>
                  Buka diskusi baru →
                </span>
              </div>
            )}
            {filtered.map((f, i) => (
              <div key={i} className="bg-white border border-ipb-100 rounded-lg overflow-hidden mb-1.5">
                <button
                  onClick={() => setOpen(open === i ? -1 : i)}
                  className="flex items-center w-full px-3.5 py-3 gap-2.5 text-left border-none bg-transparent cursor-pointer hover:bg-ipb-25 transition-colors">
                  <div className="w-[22px] h-[22px] rounded bg-ipb-50 flex items-center justify-center text-[10px] text-ipb-500 font-bold shrink-0">
                    Q
                  </div>
                  <span className="text-[12px] font-medium text-ipb-900 flex-1">{f.q}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-px rounded-full bg-green-100 text-green-700">
                      {f.cat}
                    </span>
                    <span className="text-[12px]" style={{ color: open === i ? '#378ADD' : '#B4B2A9' }}>
                      {open === i ? '▲' : '▼'}
                    </span>
                  </div>
                </button>
                {open === i && (
                  <div className="px-3.5 pb-3 text-[11px] text-gray-600 leading-relaxed border-t border-ipb-50">
                    <div className="pt-2.5 whitespace-pre-line">{f.a}</div>
                    <div className="mt-2.5 pt-2.5 border-t border-ipb-50 text-[10px] text-ipb-500 cursor-pointer font-semibold"
                      onClick={() => navigate('/diskusi/baru')}>
                      💬 Jawaban belum membantu? Buka diskusi baru →
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-ipb-50 border border-ipb-200 rounded-md px-3 py-2.5 text-[11px] text-ipb-700 flex gap-2">
          ℹ️
          <div>
            Tidak menemukan jawaban?{' '}
            <strong className="cursor-pointer hover:underline" onClick={() => navigate('/diskusi/baru')}>
              Buka diskusi baru →
            </strong>{' '}
            atau{' '}
            <strong className="cursor-pointer hover:underline" onClick={() => navigate('/submit')}>
              Ajukan tiket layanan →
            </strong>
          </div>
        </div>
      </div>
    </div>
  )
}
