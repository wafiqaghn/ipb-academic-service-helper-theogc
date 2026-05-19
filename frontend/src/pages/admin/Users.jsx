import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import { FormGroup, Input, Select } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import ToastContainer from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

const USERS = [
  { init:'QR', color:'#3B6D11', name:'Quina Rizky D.Y.S.',     id:'G6401231013',   email:'quina.siregar@apps.ipb.ac.id', role:'student', login:'15 Mar', active:true,  tickets:4   },
  { init:'GW', color:'#2478C8', name:'Ghanianda Wafiqarifah',  id:'STAFF-2024-008',email:'ghanianda@ipb.ac.id',          role:'staff',   login:'15 Mar', active:true,  tickets:142 },
  { init:'WZ', color:'#BA7517', name:'Winanci Zahrawaini S.',   id:'ADMIN-001',     email:'winanci@ipb.ac.id',            role:'admin',   login:'15 Mar', active:true,  tickets:null},
  { init:'BS', color:'#378ADD', name:'Budi Santoso',            id:'STAFF-2023-003',email:'budi.santoso@ipb.ac.id',       role:'staff',   login:'14 Mar', active:true,  tickets:207 },
  { init:'MK', color:'#A32D2D', name:'Muhammad Khoirul',        id:'G6401201088',   email:'m.khoirul@apps.ipb.ac.id',    role:'student', login:'1 Jan 2025',active:false,tickets:0 },
]

export default function AdminUsers() {
  const [showForm, setShowForm] = useState(false)
  const { toasts, toast, removeToast } = useToast()
  const { confirmState, confirm, closeConfirm } = useConfirm()

  return (
    <div className="flex">
      <Sidebar type="admin" />
      <div className="flex-1 min-w-0 bg-[#EEF3F9]">
        <PanelHeader title="Kelola Pengguna" type="admin" />
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-[18px] font-bold text-ipb-900">Manajemen Pengguna</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">Kelola akun mahasiswa, staff, dan admin</p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" onClick={() => toast('📂 Pilih file CSV (maks. 500 baris)', 'info')}>📤 Import CSV</Button>
              <Button size="sm" onClick={() => setShowForm(!showForm)}>+ Tambah User</Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <StatCard val="1,247" label="Total Pengguna"   />
            <StatCard val="1,231" label="Mahasiswa Aktif"  color="text-green-700" />
            <StatCard val={5}     label="Staff"            color="text-ipb-500"   />
            <StatCard val={2}     label="Admin"            color="text-amber-700" />
          </div>

          {/* Filter */}
          <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mb-3.5">
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-ipb-50 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
                <input className="w-full h-8 border border-ipb-200 rounded-md pl-7 text-[11px] outline-none focus:border-ipb-400" placeholder="Cari nama, NIM, email..." />
              </div>
              {['Semua','Mahasiswa','Staff','Admin','Nonaktif'].map((f, i) => (
                <button key={f} onClick={() => toast(`Filter: ${f}`, 'info')}
                  className={`text-[10px] px-2.5 py-1 rounded-full border font-medium cursor-pointer transition-all
                    ${i === 0 ? 'bg-ipb-500 text-white border-ipb-500' : 'bg-white text-gray-600 border-ipb-200 hover:border-ipb-300'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mb-3.5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    {['Nama','NIM / ID','Email','Role','Login Terakhir','Status','Tiket','Aksi'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] text-gray-400 font-semibold bg-ipb-50 border-b-[1.5px] border-ipb-100 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {USERS.map((u, i) => (
                    <tr key={i} className="border-b border-ipb-50 hover:bg-ipb-25 transition-colors">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0" style={{ background: u.color }}>{u.init}</div>
                          <span className="text-[11px] font-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[10px] font-bold text-ipb-500">{u.id}</td>
                      <td className="px-3 py-2.5 text-[10px] text-gray-600">{u.email}</td>
                      <td className="px-3 py-2.5"><Badge v={u.role === 'admin' ? 'admin' : u.role === 'staff' ? 'staff' : 'student'}>{u.role === 'admin' ? 'Admin' : u.role === 'staff' ? 'Staff' : 'Mahasiswa'}</Badge></td>
                      <td className="px-3 py-2.5 text-[11px] text-gray-400">{u.login}</td>
                      <td className="px-3 py-2.5"><Badge v={u.active ? 'resolved' : 'danger'}>{u.active ? 'Aktif' : 'Nonaktif'}</Badge></td>
                      <td className="px-3 py-2.5 text-[11px] text-center">{u.tickets !== null ? u.tickets : '—'}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1.5">
                          {!u.active
                            ? <Button size="xs" onClick={() => toast('✅ Akun berhasil diaktifkan', 'success')}>Aktifkan</Button>
                            : <Button size="xs" variant="secondary" onClick={() => toast('✅ Data disimpan', 'success')}>Edit</Button>
                          }
                          {u.role !== 'admin' && u.active && (
                            <Button size="xs" variant="ghost" onClick={() => toast('📧 Email reset password dikirim', 'info')}>Reset PW</Button>
                          )}
                          {u.role !== 'admin' && u.active && (
                            <Button size="xs" variant="danger"
                              onClick={() => confirm(`Nonaktifkan ${u.name}?`, 'Pengguna tidak bisa login sampai diaktifkan kembali.',
                                () => toast('🔒 Akun berhasil dinonaktifkan', 'error'),
                                { danger: true, okLabel: 'Nonaktifkan' })}>
                              Nonaktif
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2.5 border-t border-ipb-50 flex justify-between items-center text-[10px] text-gray-400">
              <span>5 dari 1,247 pengguna</span>
              <div className="flex gap-1">
                {['← Prev','1','2','3','Next →'].map((b, i) => (
                  <Button key={i} size="xs" variant={i === 1 ? 'primary' : 'ghost'} onClick={() => toast(`Halaman ${b}`, 'info')}>{b}</Button>
                ))}
              </div>
            </div>
          </div>

          {/* Add user form */}
          {showForm && (
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
              <div className="flex justify-between items-center mb-3.5">
                <h2 className="text-[13px] font-bold text-ipb-900">➕ Tambah Pengguna Baru</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer text-lg leading-none">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormGroup label="Nama Lengkap" required><Input placeholder="Nama lengkap pengguna" /></FormGroup>
                <FormGroup label="NIM / ID" required><Input placeholder="NIM atau ID staff" /></FormGroup>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormGroup label="Email" required><Input placeholder="email@apps.ipb.ac.id" /></FormGroup>
                <FormGroup label="Role" required>
                  <Select><option>Mahasiswa</option><option>Staff</option><option>Admin</option></Select>
                </FormGroup>
              </div>
              <FormGroup label="Password Sementara" required hint="Pengguna diminta ubah password saat login pertama">
                <Input type="password" placeholder="Min. 8 karakter" />
              </FormGroup>
              <div className="flex gap-2">
                <Button onClick={() => { toast('✅ Pengguna baru berhasil ditambahkan. Email aktivasi dikirim.', 'success'); setShowForm(false) }}>Simpan Pengguna</Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmModal state={confirmState} onClose={closeConfirm} />
    </div>
  )
}
