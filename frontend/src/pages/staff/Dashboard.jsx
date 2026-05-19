import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DistBar from '@/components/shared/DistBar'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ui/Toast'

const TICKETS = [
  { id: '#0145', title: 'Surat Ket. Masih Studi', mhs: 'Quina R.', tgl: '15 Mar', status: 'open' },
  { id: '#0144', title: 'Transkip LPDP', mhs: 'Andi P.', tgl: '14 Mar', status: 'open' },
  { id: '#0142', title: 'Transkip Nilai LPDP', mhs: 'Quina R.', tgl: '12 Mar', status: 'progress' },
  { id: '#0140', title: 'Surat Aktif BRIN', mhs: 'Farid R.', tgl: '11 Mar', status: 'progress' },
]

const DISC_PENDING = [
  { id: '#DISC-045', title: 'Template surat rekomendasi LPDP', age: '3 jam' },
  { id: '#DISC-043', title: 'Perbaikan KRS setelah pengisian', age: '5 jam' },
]

export default function StaffDashboard() {
  const navigate = useNavigate()
  const { toasts, toast, removeToast } = useToast()

  return (
    <div className="flex">
      <Sidebar type="staff" />
      <div className="flex-1 min-w-0 bg-[#EEF3F9]">
        <PanelHeader title="Dashboard Staff" subtitle="Rabu, 15 Maret 2026 · 8 tiket menunggu" />
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-4 gap-3">
            <StatCard icon="🤖" val={18} label="Surat Auto Generate" trend="↑ 5 hari ini" trendUp={true} color="text-ipb-600" />
            <StatCard icon="✍️" val={14} label="Surat Proses Manual" trend="7 antrean" trendUp={false} color="text-amber-700" />
            <StatCard icon="✅" val={32} label="Total Surat Selesai" trend="↑ 12% bln ini" trendUp={true} color="text-green-700" />
            <StatCard icon="⏱️" val="1.8" label="Rata-rata Hari" trend="↓ 0.4 hari" trendUp={true} color="text-blue-700" />
          </div>

          <div className="grid grid-cols-[1fr_280px] gap-4">
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mx-0 my-0 self-start">
              <div className="px-4 py-3 border-b border-ipb-50 flex justify-between items-center">
                <span className="text-[13px] font-bold text-ipb-900">🔴 Tiket Perlu Tindakan</span>
                <Button size="sm" variant="ghost" onClick={() => navigate('/staff/requests')}>Lihat semua →</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[12px]">
                  <thead>
                    <tr>
                      {['ID', 'Judul', 'Mahasiswa', 'Tgl', 'Status', 'Aksi'].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] text-gray-400 font-semibold bg-ipb-50 border-b-[1.5px] border-ipb-100 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {TICKETS.map((t, i) => (
                      <tr key={i} className={t.status === 'progress' ? 'bg-ipb-25' : 'bg-white'}>
                        <td className="px-3 py-2.5 font-mono text-[10px] font-bold text-ipb-500">{t.id}</td>
                        <td className="px-3 py-2.5 text-gray-600">{t.title}</td>
                        <td className="px-3 py-2.5 text-gray-600">{t.mhs}</td>
                        <td className="px-3 py-2.5 text-gray-400 text-[11px]">{t.tgl}</td>
                        <td className="px-3 py-2.5"><Badge v={t.status === 'progress' ? 'progress' : 'open'}>{t.status === 'progress' ? 'In Progress' : 'Open'}</Badge></td>
                        <td className="px-3 py-2.5">
                          <Button size="xs" variant={t.status === 'open' ? 'primary' : 'secondary'}
                            onClick={() => t.status === 'open' ? toast('📋 Tiket berhasil diambil!', 'success') : navigate('/staff/requests')}>
                            {t.status === 'open' ? 'Ambil' : 'Update'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
                <h3 className="text-[13px] font-bold text-ipb-900 mb-2.5">📊 Perbandingan Jenis Surat</h3>
                <DistBar items={[
                  { label: 'Transkip', pct: 38, color: '#378ADD' },
                  { label: 'Surat Ket.', pct: 28, color: '#3B6D11' },
                  { label: 'KRS', pct: 18, color: '#854F0B' },
                  { label: 'Beasiswa', pct: 14, color: '#8B5CF6' },
                ]} />
              </div>

              <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[13px] font-bold text-ipb-900">💬 Diskusi Belum Dibalas</h3>
                  <span className="text-[11px] text-ipb-600 font-semibold cursor-pointer hover:underline" onClick={() => navigate('/staff/diskusi')}>
                    Lihat
                  </span>
                </div>
                <div className="space-y-2">
                  {DISC_PENDING.map((d, i) => (
                    <div key={i} onClick={() => navigate('/staff/diskusi')}
                      className="bg-ipb-50 rounded-md px-3 py-2.5 cursor-pointer hover:bg-ipb-100 transition-colors">
                      <div className="text-[10px] font-mono font-bold text-ipb-500">{d.id}</div>
                      <div className="text-[11px] font-semibold text-ipb-900 my-0.5">{d.title}</div>
                      <div className="text-[10px] text-gray-400">Masuk sejak {d.age} yang lalu</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}