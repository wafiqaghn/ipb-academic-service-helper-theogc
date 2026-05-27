import { useState } from 'react'
import StudentTopbar from '@/components/layout/StudentTopbar'
import Button from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ui/Toast'

const NOTIFS = [
  { id:1, av:'BS', color:'#2478C8', title:'Status tiket #TKT-2026-0142 diperbarui',   body:'Budi Santoso mulai memproses Transkip Nilai Resmi. Estimasi selesai 17 Mar.',        time:'15 Mar, 08:05' },
  { id:2, av:'GW', color:'#185FA5', title:'Diskusi #DISC-042 mendapat balasan Staff',  body:'Ghanianda Wafiqarifah membalas diskusi Anda tentang transkip bilingual.',           time:'14 Mar, 11:45' },
  { id:3, av:'✅', color:'#3B6D11', title:'Tiket #TKT-2026-0128 selesai diproses ✅', body:'Surat Keterangan Aktif Kuliah selesai. Ambil di loket TU Gedung Rektorat Lantai 1.', time:'7 Mar, 14:30'  },
  { id:4, av:'⏰', color:'#888780', title:'Pengingat dokumen #TKT-2026-0109',         body:'Legalisir KRS sudah selesai 10 hari lalu. Pastikan sudah diambil di loket TU.',     time:'3 Mar'         },
  { id:5, av:'📢', color:'#378ADD', title:'Maintenance Sistem',                        body:'Sistem akan dalam pemeliharaan Sabtu 22 Mar pukul 00:00–06:00 WIB.',                time:'10 Mar'         },
]

export default function Notifications() {
  const [read, setRead] = useState({})
  const { toasts, toast, removeToast } = useToast()

  const markAll = () => {
    const all = {}
    NOTIFS.forEach(n => all[n.id] = true)
    setRead(all)
    toast('✅ Semua notifikasi sudah dibaca', 'success')
  }

  const unread = NOTIFS.filter(n => !read[n.id]).length

  return (
    <div className="min-h-screen bg-ipb-50">
      <StudentTopbar />
      <div className="p-6 w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-[20px] font-bold text-ipb-900">Notifikasi</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              {unread > 0 ? `${unread} pemberitahuan baru belum dibaca` : 'Semua pemberitahuan sudah dibaca'}
            </p>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onClick={markAll} className="!text-ipb-600 font-semibold">
              Tandai semua sebagai dibaca
            </Button>
          )}
        </div>

        <div className="bg-white rounded-xl border border-ipb-100 shadow-sm overflow-hidden w-full">
          {NOTIFS.map((n, i) => (
            <div
              key={n.id}
              onClick={() => setRead(r => ({ ...r, [n.id]: true }))}
              className={`flex items-start gap-4 px-6 py-5 cursor-pointer transition-all border-l-4
                ${i < NOTIFS.length - 1 ? 'border-b border-ipb-50' : ''}
                ${!read[n.id] 
                  ? 'bg-blue-50/40 border-l-ipb-400 hover:bg-blue-50/60' 
                  : 'bg-white border-l-transparent hover:bg-gray-50'
                }`}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0 shadow-sm"
                style={{ background: n.color }}>
                {n.av}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start gap-2">
                  <p className={`text-[13px] text-gray-900 ${!read[n.id] ? 'font-bold' : 'font-medium'}`}>
                    {n.title}
                  </p>
                  <p className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{n.time}</p>
                </div>
                <p className="text-[12px] text-gray-500 mt-1 leading-relaxed max-w-4xl">{n.body}</p>
              </div>

              {!read[n.id] && (
                <div className="w-2 h-2 bg-ipb-400 rounded-full shrink-0 mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}