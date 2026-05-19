import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import StatCard from '@/components/ui/StatCard'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ui/Toast'

const STAFF_PERF = [
  { medal:'🥇', init:'BS', color:'#378ADD', name:'Budi Santoso',       cnt:52, res:'51 (98%)', avg:'1.9 hr', status:'resolved' },
  { medal:'🥈', init:'GW', color:'#2478C8', name:'Ghanianda W.',       cnt:47, res:'46 (98%)', avg:'2.1 hr', status:'resolved' },
  { medal:'🥉', init:'NA', color:'#3B6D11', name:'Nadia Amelia',       cnt:38, res:'35 (92%)', avg:'2.8 hr', status:'progress' },
]

export default function AdminStatistics() {
  const { toasts, toast, removeToast } = useToast()

  return (
    <div className="flex">
      <Sidebar type="admin" />
      <div className="flex-1 min-w-0 bg-[#EEF3F9]">
        <PanelHeader title="Statistik & Laporan" type="admin" />
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-[18px] font-bold text-ipb-900">Analisis Performa Layanan</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">IPB Academic Service Helper — Maret 2026</p>
            </div>
            <div className="flex gap-2 items-center">
              <select className="h-9 border border-ipb-200 rounded-md px-3 text-[11px] outline-none w-[150px] bg-white">
                <option>Maret 2026</option>
                <option>Februari 2026</option>
                <option>Januari 2026</option>
              </select>
              <Button size="sm" onClick={() => toast('📥 Laporan PDF sedang diunduh...', 'info')}>📥 Export PDF</Button>
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <StatCard val={284}   label="Total Tiket"      trend="↑ 12% vs Feb"  trendUp={true} />
            <StatCard val={272}   label="Tiket Resolved"   trend="95.8% rate"    trendUp={true} color="text-green-700" />
            <StatCard val="2.4"   label="Rata-rata Hari"   trend="↓ 0.3 hari"   trendUp={true} color="text-amber-700" />
          </div>

          {/* Charts row */}
          <div className="mb-4">
            {/* Grouped bar chart */}
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-3">📈 Tiket Masuk vs Resolved per Minggu</h3>
              <div className="flex items-end gap-3 h-[120px] pt-2">
                {[{m:18,r:16,l:'Mg 1'},{m:24,r:22,l:'Mg 2'},{m:31,r:28,l:'Mg 3'},{m:0,r:0,l:'Mg 4'}].map((b, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-semibold text-ipb-600">{b.m || '—'}</span>
                    <div className="flex gap-1 items-end w-full" style={{ height:'90%' }}>
                      <div className="flex-1 rounded-t-sm min-h-[2px] self-end" style={{ background:'#5BA3E8', height:`${(b.m/31)*100}%` }} />
                      <div className="flex-1 rounded-t-sm min-h-[2px] self-end" style={{ background:'#3B6D11', height:`${(b.r/31)*100}%` }} />
                    </div>
                    <span className="text-[8px] text-gray-400">{b.l}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-600"><div className="w-2 h-2 rounded-sm bg-[#5BA3E8]" /> Masuk</div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-600"><div className="w-2 h-2 rounded-sm bg-[#3B6D11]" /> Resolved</div>
              </div>
            </div>
          </div>

          {/* Staff performance table */}
          <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
            <h3 className="text-[13px] font-bold text-ipb-900 mb-3">🏆 Performa Staff — Maret 2026</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    {['#','Nama Staff','Tiket Ditangani','Resolved','Rata-rata Hari','Status'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] text-gray-400 font-semibold bg-ipb-50 border-b-[1.5px] border-ipb-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STAFF_PERF.map((s, i) => (
                    <tr key={i} className="border-b border-ipb-50 hover:bg-ipb-25 transition-colors">
                      <td className="px-3 py-2.5 font-bold text-amber-700">{s.medal}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0" style={{ background: s.color }}>{s.init}</div>
                          <span>{s.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-semibold">{s.cnt}</td>
                      <td className="px-3 py-2.5 text-green-700 font-bold">{s.res}</td>
                      <td className="px-3 py-2.5">{s.avg}</td>
                      <td className="px-3 py-2.5"><Badge v={s.status}>{s.status === 'resolved' ? 'Online' : 'Sibuk'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}