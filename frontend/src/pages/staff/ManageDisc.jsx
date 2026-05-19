import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import ToastContainer from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

const PENDING = [
  { id:'#DISC-045', cat:'Beasiswa', title:'Template surat rekomendasi LPDP dari IPB?',        author:'Dinda Ayu',  age:'3 jam' },
  { id:'#DISC-043', cat:'KRS',      title:'Perbaikan KRS smt 6 setelah masa pengisian berakhir?', author:'Farid R.',  age:'5 jam' },
]

export default function ManageDisc() {
  const navigate = useNavigate()
  const { toasts, toast, removeToast } = useToast()
  const { confirmState, confirm, closeConfirm } = useConfirm()
  const [reply, setReply] = useState(
    'Halo Dinda, untuk template surat rekomendasi LPDP:\n\n1. Template tersedia di akademik.ipb.ac.id\n2. Dosen mengunduh dan mengisi sesuai data mahasiswa\n3. Gunakan kop surat resmi Departemen/Fakultas\n\nHubungi TU jika butuh bantuan lebih lanjut.'
  )

  return (
    <div className="flex">
      <Sidebar type="staff" />
      <div className="flex-1 min-w-0 bg-[#EEF3F9]">
        <PanelHeader title="Kelola Diskusi" />
        <div className="p-5">
          <h1 className="text-[18px] font-bold text-ipb-900 mb-1">Manajemen Diskusi Mahasiswa</h1>
          <p className="text-[11px] text-gray-400 mb-4">Balas, moderasi, dan kelola semua thread diskusi</p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <StatCard val={48} label="Total Diskusi" />
            <StatCard val={5}  label="Belum Dijawab" color="text-amber-700" trend="Perlu respons!" trendUp={false} />
            <StatCard val={31} label="Open"           color="text-ipb-500"   />
            <StatCard val={17} label="Resolved"       color="text-green-700" />
          </div>

          <div className="bg-amber-100 border border-amber-200 rounded-md px-3 py-2.5 text-[11px] text-amber-700 flex gap-2 mb-4">
            ⚠️ <strong>5 diskusi belum dijawab</strong> — Segera respons untuk menjaga kepuasan mahasiswa.
          </div>

          <div className="grid grid-cols-[1fr_320px] gap-4">
            <div>
              {/* Filter bar */}
              <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mb-3.5">
                <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-ipb-50 flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
                    <input className="w-full h-8 border border-ipb-200 rounded-md pl-7 text-[11px] outline-none focus:border-ipb-400" placeholder="Cari judul, mahasiswa..." />
                  </div>
                  {['Semua','Belum Dijawab','Open','Resolved'].map((f, i) => (
                    <button key={f}
                      className={`text-[10px] px-2.5 py-1 rounded-full border font-medium cursor-pointer transition-all
                        ${i === 0 ? 'bg-ipb-500 text-white border-ipb-500'
                        : i === 1 ? 'bg-white text-amber-700 border-amber-300 hover:border-amber-400'
                        :           'bg-white text-gray-600 border-ipb-200 hover:border-ipb-300'}`}
                      onClick={() => toast(`Filter: ${f}`, 'info')}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pending */}
              <p className="text-[9px] font-bold text-amber-700 mb-2 uppercase tracking-wider">⏳ Belum Dijawab</p>
              {PENDING.map((d, i) => (
                <div key={i} className="bg-white rounded-lg border border-ipb-50 shadow-sm p-3.5 mb-2.5 cursor-pointer"
                  style={{ borderLeft:`3px solid #854F0B` }}>
                  <div className="flex justify-between gap-2.5 mb-2">
                    <div className="flex-1">
                      <div className="flex gap-1.5 mb-1.5">
                        <span className="text-[9px] px-1.5 py-px rounded bg-ipb-50 text-ipb-600 font-medium">{d.cat}</span>
                        <span className="text-[8px] font-bold px-1.5 py-px rounded-full bg-amber-100 text-amber-700">⏳ {d.age} lalu</span>
                      </div>
                      <p className="text-[13px] font-bold text-ipb-900">{d.title}</p>
                    </div>
                    <Badge v="open">Open</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">{d.author}</span>
                    <Button size="xs" onClick={() => navigate('/diskusi/detail')}>Balas Sekarang</Button>
                  </div>
                </div>
              ))}

              {/* Answered */}
              <p className="text-[9px] font-bold text-gray-400 mt-4 mb-2 uppercase tracking-wider">✅ Sudah Dijawab</p>
              <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-3.5 cursor-pointer"
                style={{ borderLeft:'3px solid #378ADD' }}
                onClick={() => navigate('/diskusi/detail')}>
                <div className="flex justify-between gap-2.5 mb-2">
                  <div>
                    <div className="flex gap-1.5 mb-1.5">
                      <span className="text-[9px] px-1.5 py-px rounded bg-ipb-50 text-ipb-600 font-medium">Transkip</span>
                      <span className="text-[8px] font-bold px-1.5 py-px rounded-full bg-yellow-50 text-yellow-700">🔥 Aktif</span>
                    </div>
                    <p className="text-[13px] font-bold text-ipb-900">Transkip bilingual — bisa satu tiket?</p>
                  </div>
                  <Badge v="open">Open</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-gray-400">Quina R. · 14 Mar · 3 balasan</span>
                  <div className="flex gap-1.5">
                    <Button size="xs" variant="secondary" onClick={e => { e.stopPropagation(); navigate('/diskusi/detail') }}>Lihat</Button>
                    <Button size="xs" variant="ghost"
                      onClick={e => {
                        e.stopPropagation()
                        confirm('Tandai Resolved?', 'Diskusi akan ditutup.', () => toast('✅ Diskusi di-resolve', 'success'))
                      }}>
                      Resolve
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick reply panel */}
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 self-start">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-3">⚡ Balas Cepat</h3>
              <div className="bg-ipb-50 rounded-lg px-3 py-2.5 mb-3">
                <div className="text-[10px] font-bold text-ipb-500 mb-1">#DISC-045 · Beasiswa</div>
                <p className="text-[12px] font-semibold text-ipb-900">Template surat rekomendasi LPDP dari IPB?</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Dinda Ayu · 15 Mar, 13:20</p>
              </div>
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Balasan Anda</label>
                <textarea
                  value={reply}
                  onChange={e => setReply(e.target.value)}
                  className="w-full border border-ipb-200 rounded-md px-2.5 py-2 text-[11px] outline-none focus:border-ipb-400 resize-none"
                  rows={8}
                />
              </div>
              <div className="mb-3">
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">Tandai sebagai</label>
                <select className="w-full h-9 border border-ipb-200 rounded-md px-3 text-[12px] outline-none">
                  <option>Jawaban Resmi ✓</option>
                  <option>Informasi Tambahan</option>
                  <option>Rujuk ke Tiket</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" size="sm" onClick={() => toast('✅ Balasan berhasil dikirim!', 'success')}>
                  Kirim Balasan
                </Button>
                <Button size="sm" variant="ghost" onClick={() => navigate('/diskusi/detail')}>
                  Lihat Thread
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmModal state={confirmState} onClose={closeConfirm} />
    </div>
  )
}
