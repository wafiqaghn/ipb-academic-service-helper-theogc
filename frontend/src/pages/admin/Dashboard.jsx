import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import StatCard from '@/components/ui/StatCard'
import BarChart from '@/components/shared/BarChart'
import DistBar from '@/components/shared/DistBar'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import ToastContainer from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function AdminDashboard() {
  const { toasts, removeToast } = useToast()
  const { confirmState, closeConfirm } = useConfirm()

  return (
    <div className="flex">
      <Sidebar type="admin" />
      <div className="flex-1 min-w-0 bg-[#EEF3F9]">
        <PanelHeader title="Dashboard Admin 🛡️" subtitle="Rabu, 15 Maret 2026 · Monitoring sistem" type="admin" />
        <div className="p-5">
          
          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 mb-5">
            <StatCard icon="🎫" val={284}    label="Total Tiket"    trend="↑ 12%"    trendUp={true}  />
            <StatCard icon="✅" val="96%"    label="Resolved Rate"  trend="↑ 2%"      trendUp={true}  color="text-green-700" />
            <StatCard icon="👥" val="1,247"  label="Pengguna"       trend="↑ 34 baru" trendUp={true}  color="text-ipb-600"   />
            <StatCard icon="🛠️" val={5}     label="Staff Aktif"                                       color="text-amber-700" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-3">📈 Trend Tiket — Maret 2026</h3>
              <BarChart bars={[
                { value:18, label:'Mg 1', color:'#B5D4F4' },
                { value:24, label:'Mg 2', color:'#5BA3E8' },
                { value:31, label:'Mg 3', color:'#378ADD' },
                { value:0,  label:'Mg 4', color:'#D3D1C7' },
              ]} />
            </div>
            
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-3">📊 Distribusi Kategori</h3>
              <DistBar items={[
                { label:'📋 Transkip',    pct:38, color:'#378ADD' },
                { label:'📄 Surat Ket.', pct:27, color:'#3B6D11' },
                { label:'🎓 KRS',        pct:18, color:'#854F0B' },
                { label:'💰 Beasiswa',   pct:14, color:'#8B5CF6' },
                { label:'📁 Lainnya',    pct:3,  color:'#B4B2A9' },
              ]} />
            </div>
          </div>

        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmModal state={confirmState} onClose={closeConfirm} />
    </div>
  )
}