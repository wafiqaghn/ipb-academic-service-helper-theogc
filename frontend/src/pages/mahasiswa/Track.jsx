import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentTopbar from '@/components/layout/StudentTopbar'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import Timeline from '@/components/ui/Timeline'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ui/Toast'

const TICKETS = [
  {
    id: '#TKT-2026-0142', title: 'Permohonan Transkip Nilai Resmi untuk LPDP',
    date: '12 Mar 2026', cat: 'Transkip', staff: 'Budi Santoso',
    status: 'progress', pct: 60, color: '#378ADD',
  },
  {
    id: '#TKT-2026-0145', title: 'Surat Keterangan Masih Studi',
    date: '15 Mar 2026', cat: 'Surat Keterangan', staff: null,
    status: 'open', pct: 5, color: '#BA7517',
  },
  {
    id: '#TKT-2026-0128', title: 'Surat Keterangan Aktif Kuliah',
    date: '5 Mar 2026', cat: 'Surat Keterangan', staff: 'Ghanianda W.',
    status: 'resolved', pct: 100, color: '#3B6D11',
  },
  {
    id: '#TKT-2026-0109', title: 'Legalisir KRS Semester 5',
    date: '20 Feb 2026', cat: 'KRS', staff: 'Ghanianda W.',
    status: 'resolved', pct: 100, color: '#3B6D11',
  },
]

const TIMELINE = [
  { title: 'Submitted',           time: '12 Mar, 09:14', status: 'done' },
  { title: 'Verifikasi Dokumen',  time: '13 Mar, 11:30', status: 'done',    note: 'Dokumen lengkap. Dilanjutkan ke Staff.' },
  { title: 'In Progress',         time: '15 Mar, 08:05', status: 'current', note: 'Staff Budi Santoso sedang memproses.' },
  { title: 'Resolved',            time: 'Est. 17 Mar 2026', status: 'pending' },
]

const STATUS_LABEL = { progress: 'In Progress', open: 'Open', resolved: 'Resolved' }
const STATUS_BADGE  = { progress: 'progress',   open: 'open', resolved: 'resolved' }
const FILTERS = ['Semua', 'Open', 'In Progress', 'Resolved']

export default function Track() {
  const navigate = useNavigate()
  const [sel, setSel]     = useState(0)
  const [filter, setFilter] = useState('Semua')
  const [msg, setMsg]     = useState('')
  const { toasts, toast, removeToast } = useToast()

  const filtered = TICKETS.filter(t => {
    if (filter === 'Semua') return true
    if (filter === 'Open') return t.status === 'open'
    if (filter === 'In Progress') return t.status === 'progress'
    if (filter === 'Resolved') return t.status === 'resolved'
    return true
  })

  return (
    <div>
      <StudentTopbar />
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-[18px] font-bold text-ipb-900">Lacak Permohonan</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Pantau semua tiket layanan Anda</p>
          </div>
          <Button size="sm" onClick={() => navigate('/submit')}>+ Ajukan Baru</Button>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mb-4">
          <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-ipb-50 flex-wrap">
            <div className="relative flex-1 min-w-[180px]">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300 text-xs">🔍</span>
              <input
                className="w-full h-8 border border-ipb-200 rounded-md pl-7 pr-3 text-[11px] outline-none focus:border-ipb-400"
                placeholder="Cari ID tiket atau judul..."
              />
            </div>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-[10px] px-2.5 py-1 rounded-full border font-medium transition-all cursor-pointer
                  ${filter === f ? 'bg-ipb-500 text-white border-ipb-500' : 'bg-white text-gray-600 border-ipb-200 hover:border-ipb-300'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-4">
          {/* Ticket list */}
          <div>
            {filtered.map((t, i) => (
              <div key={i} onClick={() => setSel(TICKETS.indexOf(t))}
                className={`bg-white rounded-lg border shadow-sm p-3.5 mb-2.5 cursor-pointer transition-all hover:shadow-md
                  ${sel === TICKETS.indexOf(t) ? 'border-ipb-300 bg-ipb-25' : 'border-ipb-50'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="text-[10px] font-mono font-bold text-ipb-500">{t.id}</div>
                    <div className="text-[13px] font-bold text-ipb-900 my-0.5">{t.title}</div>
                    <div className="text-[10px] text-gray-400">
                      {t.date}{t.staff && ` · ${t.staff}`}
                    </div>
                  </div>
                  <Badge v={STATUS_BADGE[t.status]}>{STATUS_LABEL[t.status]}</Badge>
                </div>
                <ProgressBar pct={t.pct} color={t.color} />
                {t.status === 'open' && (
                  <p className="text-[10px] text-amber-700 mt-1.5">Menunggu assignment staff...</p>
                )}
                {t.status === 'progress' && (
                  <div className="flex gap-2 mt-2.5">
                    <Button size="sm" variant="secondary"
                      onClick={e => { e.stopPropagation(); setSel(TICKETS.indexOf(t)) }}>
                      Lihat Detail
                    </Button>
                    <Button size="sm" variant="ghost"
                      onClick={e => { e.stopPropagation(); toast('💬 Pesan terkirim!', 'success') }}>
                      Kirim Pesan
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
            <h3 className="text-[13px] font-bold text-ipb-900 mb-3">
              📍 Detail — {TICKETS[sel].id}
            </h3>

            {/* Status + progress */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] font-semibold">Status</span>
                <Badge v={STATUS_BADGE[TICKETS[sel].status]}>
                  {STATUS_LABEL[TICKETS[sel].status]}
                </Badge>
              </div>
              <ProgressBar pct={TICKETS[sel].pct} color={TICKETS[sel].color} showLabel />
              <p className="text-[10px] text-gray-400 mt-1">
                {TICKETS[sel].status === 'progress' ? 'Estimasi selesai: 17 Mar 2026'
                 : TICKETS[sel].status === 'resolved' ? 'Selesai diproses'
                 : 'Menunggu staff'}
              </p>
            </div>

            <div className="h-px bg-ipb-100 my-3" />

            {/* Timeline */}
            <Timeline items={TIMELINE} />

            <div className="h-px bg-ipb-100 my-3" />

            {/* Message to staff */}
            <p className="text-[11px] font-semibold text-gray-600 mb-2">💬 Pesan ke Staff</p>
            <textarea
              value={msg}
              onChange={e => setMsg(e.target.value)}
              className="w-full border border-ipb-200 rounded-md px-2.5 py-2 text-[11px] outline-none focus:border-ipb-400 resize-none"
              rows={3}
              placeholder="Tulis pesan untuk staff..."
            />
            <Button size="sm" className="w-full mt-2"
              onClick={() => { toast('💬 Pesan terkirim!', 'success'); setMsg('') }}>
              Kirim Pesan
            </Button>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
