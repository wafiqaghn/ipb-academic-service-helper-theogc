import { useNavigate } from 'react-router-dom'
import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import { FormGroup, Input } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ui/Toast'

const ACCESS = [
  ['Lihat & proses tiket', true],
  ['Kelola FAQ',           true],
  ['Balas diskusi',        true],
  ['Kelola kategori',      false],
  ['Kelola pengguna',      false],
  ['Statistik penuh',      false, 'Terbatas'],
]

export default function StaffProfile() {
  const navigate = useNavigate()
  const { toasts, toast, removeToast } = useToast()

  return (
    <div className="flex">
      <Sidebar type="staff" />
      <div className="flex-1 min-w-0 bg-[#EEF3F9]">
        <PanelHeader title="Profil Staff" />
        <div className="p-5">
          <div className="grid grid-cols-[1fr_280px] gap-4">
            <div>
              {/* Profile card */}
              <div className="bg-white rounded-lg border border-ipb-50 shadow-sm overflow-hidden mb-3.5">
                <div className="h-[90px]" style={{ background:'linear-gradient(135deg,#042C53,#378ADD)' }} />
                <div className="px-5 pb-5">
                  <div className="-mt-7 mb-2.5">
                    <div className="w-14 h-14 rounded-full border-[3px] border-white bg-ipb-500 flex items-center justify-center text-[19px] font-bold text-white">
                      GW
                    </div>
                  </div>
                  <h2 className="text-[16px] font-bold text-ipb-900">Ghanianda Wafiqarifah</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge v="staff">Staff Akademik</Badge>
                    <span className="text-[10px] text-gray-400">Aktif sejak Jan 2024</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {[['NIP / ID','STAFF-2024-008'],['Unit Kerja','Direktorat Akademik'],['Departemen','Pelayanan Mahasiswa'],['Email','ghanianda@ipb.ac.id']].map(([k,v],i) => (
                      <div key={i}>
                        <div className="text-[10px] text-gray-400 font-medium mb-0.5">{k}</div>
                        <div className="text-[12px] text-gray-900 font-medium">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Edit form */}
              <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
                <h3 className="text-[13px] font-bold text-ipb-900 mb-3.5">⚙️ Edit Profil</h3>
                <div className="grid grid-cols-2 gap-3">
                  <FormGroup label="Nama Lengkap">
                    <Input defaultValue="Ghanianda Wafiqarifah" />
                  </FormGroup>
                  <FormGroup label="Email">
                    <Input defaultValue="ghanianda@ipb.ac.id" />
                  </FormGroup>
                </div>
                <FormGroup label="Telepon">
                  <Input placeholder="+62..." />
                </FormGroup>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toast('✅ Profil berhasil disimpan', 'success')}>Simpan</Button>
                  <Button size="sm" variant="ghost" onClick={() => toast('📧 Cek email untuk reset password', 'info')}>Ubah Password</Button>
                </div>
              </div>
            </div>

            <div>
              {/* Stats */}
              <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                <StatCard val={142}   label="Total Ditangani" />
                <StatCard val={8}     label="Tiket Aktif"     color="text-amber-700" />
              </div>

              {/* Access rights */}
              <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
                <h3 className="text-[13px] font-bold text-ipb-900 mb-2.5">🔑 Hak Akses Staff</h3>
                {ACCESS.map(([l, ok, partial], i) => (
                  <div key={i} className={`flex justify-between items-center py-1.5 text-[11px] ${i < ACCESS.length - 1 ? 'border-b border-ipb-50' : ''}`}>
                    <span>{l}</span>
                    <span className={`font-bold ${partial ? 'text-amber-700' : ok ? 'text-green-700' : 'text-danger-700'}`}>
                      {partial ? '~ Terbatas' : ok ? '✓' : '✗'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
