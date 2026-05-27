import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentTopbar from '@/components/layout/StudentTopbar'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import ToastContainer from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

const RELATED = [
  'Biaya legalisir transkip untuk alumni IPB?',
  'Transkip untuk yudisium — berapa lama prosesnya?',
  'Format penulisan nama di transkip bahasa Inggris',
]

export default function DiscDetail() {
  const navigate = useNavigate()
  const { toasts, toast, removeToast } = useToast()
  const { confirmState, confirm, closeConfirm } = useConfirm()
  const [reply, setReply] = useState('')
  const [resolved, setResolved] = useState(false)

  const handleResolve = () => {
    confirm(
      'Tandai Resolved?',
      'Diskusi ini akan ditandai selesai dan ditutup.',
      () => { setResolved(true); toast('✅ Diskusi berhasil ditandai Resolved', 'success') }
    )
  }

  const handleSendReply = () => {
    if (!reply.trim()) { toast('⚠️ Tulis balasan dulu', 'warn'); return }
    toast('💬 Balasan berhasil terkirim!', 'success')
    setReply('')
  }

  return (
    <div>
      <StudentTopbar />
      <div className="p-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-3">
          <span className="cursor-pointer hover:text-ipb-500" onClick={() => navigate('/diskusi')}>Diskusi</span>
          <span className="text-gray-200">›</span>
          <span className="text-ipb-600 font-semibold">Detail Thread</span>
        </div>

        <div className="grid grid-cols-[1fr_260px] gap-4">
          {/* Main thread */}
          <div>
            {/* Thread header */}
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3.5">
              <div className="flex justify-between gap-2.5 mb-2.5">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] px-1.5 py-px rounded bg-ipb-50 text-ipb-600 font-medium">Transkip</span>
                    <span className="text-[8px] font-bold px-1.5 py-px rounded-full bg-yellow-50 text-yellow-700">🔥 Aktif</span>
                    <span className="text-[9px] text-gray-300">#DISC-042</span>
                  </div>
                  <h1 className="text-[17px] font-extrabold text-ipb-900 leading-snug mb-2">
                    Transkip nilai bahasa Inggris — apakah bisa diajukan bersamaan dengan transkip Indonesia?
                  </h1>
                  <div className="flex items-center gap-3 text-[10px] text-gray-400">
                    <span>Quina Rizky</span>
                    <span>14 Mar 2026, 10:22</span>
                    <span>👁 42</span>
                    <span>💬 3</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 items-end shrink-0">
                  <Badge v={resolved ? 'resolved' : 'open'}>{resolved ? 'Resolved' : 'Open'}</Badge>
                  <Button size="xs" variant="ghost" onClick={() => toast('⚐ Laporan terkirim', 'warn')}>⚐ Laporkan</Button>
                </div>
              </div>

              {/* Body */}
              <div className="bg-ipb-50 border border-ipb-100 rounded-lg p-3 text-[12px] text-gray-600 leading-relaxed">
                <p className="mb-2">Saya perlu mengajukan dua versi transkip sekaligus (Indonesia & Inggris) untuk LPDP 2026.</p>
                <p className="mb-1.5">Pertanyaan:</p>
                <ol className="ml-4 mb-2 space-y-1">
                  <li>Apakah bisa dalam satu tiket yang sama?</li>
                  <li>Jika harus terpisah, apakah bisa diproses bersamaan?</li>
                  <li>Adakah biaya tambahan untuk versi bilingual?</li>
                </ol>
                <p>Terima kasih 🙏</p>
              </div>

              <div className="flex gap-1.5 mt-3">
                <Button size="xs" variant="ghost" onClick={() => toast('👍 Helpful!', 'success')}>👍 Helpful (5)</Button>
                <Button size="xs" variant="ghost" onClick={() => toast('🔗 Link disalin', 'info')}>🔗 Bagikan</Button>
                <Button size="xs" variant="secondary" className="ml-auto"
                  onClick={() => navigate('/diskusi/baru')}>+ Diskusi Serupa</Button>
              </div>
            </div>

            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">💬 3 Balasan</p>

            {/* Reply 1 — Staff official */}
            <div className="flex gap-2.5 mb-3.5">
              <div className="shrink-0 text-center">
                <div className="w-[34px] h-[34px] rounded-full bg-ipb-500 flex items-center justify-center text-[12px] font-bold text-white">GW</div>
                <div className="text-[7px] text-ipb-500 font-bold mt-0.5">Staff</div>
              </div>
              <div className="flex-1 bg-white border-[1.5px] border-ipb-200 rounded-[0_8px_8px_8px] p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-ipb-900">Ghanianda Wafiqarifah</span>
                    <Badge v="staff">Staff Akademik</Badge>
                    <span className="inline-flex items-center text-[8px] font-semibold px-1.5 py-px rounded-full bg-green-100 text-green-700">✓ Jawaban Resmi</span>
                  </div>
                  <span className="text-[9px] text-gray-300">14 Mar, 11:45</span>
                </div>
                <div className="text-[12px] text-gray-600 leading-relaxed">
                  <p className="mb-2">Halo Quina, terima kasih atas pertanyaannya! 😊</p>
                  <p className="font-semibold text-ipb-800 mb-1">1. Satu tiket vs dua tiket?</p>
                  <p className="mb-2">Ya, bisa dalam <strong>satu tiket!</strong> Pilih "Transkip & Legalisir", lalu jelaskan butuh <strong>dua versi (Indonesia & Inggris)</strong>.</p>
                  <p className="font-semibold text-ipb-800 mb-1">2. Waktu proses?</p>
                  <p className="mb-2">Diproses bersamaan. Estimasi tetap <strong>3–5 hari kerja</strong>.</p>
                  <p className="font-semibold text-ipb-800 mb-1">3. Biaya?</p>
                  <p className="mb-2">Mahasiswa aktif: transkip bilingual <strong>gratis</strong>.</p>
                  <div className="bg-green-100 rounded-md px-2.5 py-2 text-[11px] text-green-700">
                    💡 Cantumkan KTM aktif dan deadline LPDP di formulir agar kami prioritaskan!
                  </div>
                </div>
                <div className="mt-2">
                  <Button size="xs" variant="ghost" className="!text-green-700"
                    onClick={() => toast('👍 Helpful!', 'success')}>👍 Helpful (12)</Button>
                </div>
              </div>
            </div>

            {/* Reply 2 — Student (OP) */}
            <div className="flex gap-2.5 mb-3.5">
              <div className="shrink-0">
                <div className="w-[34px] h-[34px] rounded-full bg-green-700 flex items-center justify-center text-[12px] font-bold text-white">QR</div>
              </div>
              <div className="flex-1 bg-ipb-50 border-[1.5px] border-ipb-200 rounded-[0_8px_8px_8px] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-ipb-900">Quina Rizky Siregar</span>
                    <Badge v="student">Mahasiswa</Badge>
                    <span className="text-[9px] text-gray-300 italic">OP</span>
                  </div>
                  <span className="text-[9px] text-gray-300">14 Mar, 13:10</span>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Terima kasih Kak Ghanianda, sangat membantu! 🙏
                  <br /><br />
                  Boleh tanya satu lagi — untuk sertifikat akreditasi prodi, apakah perlu dilampirkan juga atau sudah otomatis disertakan?
                </p>
              </div>
            </div>

            {/* Reply 3 — Staff followup */}
            <div className="flex gap-2.5 mb-5">
              <div className="shrink-0 text-center">
                <div className="w-[34px] h-[34px] rounded-full bg-ipb-500 flex items-center justify-center text-[12px] font-bold text-white">GW</div>
                <div className="text-[7px] text-ipb-500 font-bold mt-0.5">Staff</div>
              </div>
              <div className="flex-1 bg-white border-[1.5px] border-ipb-200 rounded-[0_8px_8px_8px] p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-ipb-900">Ghanianda Wafiqarifah</span>
                    <Badge v="staff">Staff Akademik</Badge>
                  </div>
                  <span className="text-[9px] text-gray-300">14 Mar, 14:55</span>
                </div>
                <p className="text-[12px] text-gray-600 leading-relaxed">
                  Sertifikat akreditasi <strong>tidak otomatis</strong> disertakan. Sebutkan saja di deskripsi tiket, kami akan menyertakannya bersama paket transkip 👍
                </p>
                <div className="mt-2">
                  <Button size="xs" variant="ghost" className="!text-green-700"
                    onClick={() => toast('👍 Helpful!', 'success')}>👍 Helpful (4)</Button>
                </div>
              </div>
            </div>

            {/* Reply box */}
            <div className="bg-white rounded-lg border-[1.5px] border-ipb-200 p-5">
              <div className="flex gap-2.5 items-start">
                <div className="w-[34px] h-[34px] rounded-full bg-green-700 flex items-center justify-center text-[12px] font-bold text-white shrink-0">QR</div>
                <div className="flex-1">
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    className="w-full border border-ipb-200 rounded-md px-2.5 py-2 text-[12px] outline-none focus:border-ipb-400 resize-none"
                    rows={4}
                    placeholder="Tulis balasan atau pertanyaan lanjutan..."
                  />
                  <div className="flex justify-between items-center mt-2">
                    <Button size="sm" variant="secondary" onClick={() => toast('📎 Pilih file lampiran', 'info')}>
                      📎 Lampiran
                    </Button>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={handleResolve}>Tandai Resolved ✅</Button>
                      <Button size="sm" onClick={handleSendReply}>Kirim Balasan →</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-2.5">📋 Info Diskusi</h3>
              {[
                ['Status',     <Badge v={resolved ? 'resolved' : 'open'}>{resolved ? 'Resolved' : 'Open'}</Badge>],
                ['Kategori',   <span className="text-[9px] px-1.5 py-px rounded bg-ipb-50 text-ipb-600 font-medium">Transkip</span>],
                ['Dibuka',     '14 Mar 2026'],
                ['Balasan',    '3'],
                ['Dilihat',    '42 orang'],
                ['Terakhir',   '14 Mar, 14:55'],
              ].map(([k, v], i) => (
                <div key={i} className={`flex justify-between items-center py-1 text-[11px] ${i < 5 ? 'border-b border-ipb-50' : ''}`}>
                  <span className="text-gray-400">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ))}
              <Button size="sm" variant="secondary" className="w-full mt-2.5" onClick={handleResolve}>
                ✅ Tandai Resolved
              </Button>
            </div>

            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-2.5">🔗 Diskusi Terkait</h3>
              {RELATED.map((t, i) => (
                <div key={i} onClick={() => toast('📄 Membuka thread...', 'info')}
                  className="px-2.5 py-2 bg-ipb-50 rounded-md cursor-pointer hover:bg-ipb-100 transition-colors mb-2">
                  <p className="text-[10px] font-semibold text-ipb-700 leading-snug mb-0.5">{t}</p>
                  <p className="text-[9px] text-gray-400">Transkip · {i * 2 + 2} balasan</p>
                </div>
              ))}
            </div>

            <div className="bg-ipb-50 border border-ipb-200 rounded-lg p-5">
              <h3 className="text-[13px] font-bold text-ipb-600 mb-2">💡 Sudah Terjawab?</h3>
              <p className="text-[11px] text-ipb-700 leading-relaxed mb-3">
                Tandai <strong>Resolved</strong> untuk membantu mahasiswa lain menemukan jawaban!
              </p>
              <button
                onClick={handleResolve}
                className="w-full py-2 rounded-md text-[11px] font-semibold text-white cursor-pointer border-none transition-all hover:opacity-90"
                style={{ background: '#3B6D11' }}>
                ✅ Tandai Selesai
              </button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmModal state={confirmState} onClose={closeConfirm} />
    </div>
  )
}
