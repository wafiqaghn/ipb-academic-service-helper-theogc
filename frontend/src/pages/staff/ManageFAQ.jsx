import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { FormGroup, Input, Select, Textarea } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ui/Toast'

const FAQS = [
  { no:'001', q:'Bagaimana cara mengajukan transkip nilai resmi?', cat:'Transkip',   views:847, date:'10 Mar', status:'resolved' },
  { no:'002', q:'Apakah transkip tersedia dalam bahasa Inggris?',   cat:'Transkip',   views:612, date:'8 Mar',  status:'resolved' },
  { no:'003', q:'Syarat pengajuan surat keterangan aktif?',          cat:'Surat Ket.', views:534, date:'7 Mar',  status:'resolved' },
  { no:'004', q:'Berapa lama waktu proses verifikasi akademik?',     cat:'Umum',       views:401, date:'5 Mar',  status:'review'   },
  { no:'005', q:'Waktu pemrosesan KRS semester baru?',               cat:'KRS',        views:289, date:'3 Mar',  status:'draft'    },
]

const STATUS_LABEL = { resolved:'Published', review:'Review', draft:'Draft' }
const STATUS_BADGE  = { resolved:'resolved',  review:'review', draft:'draft' }
const FILTERS = ['Semua (31)','Published (22)','Draft (6)','Review (3)']

export default function ManageFAQ() {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter]     = useState('Semua (31)')
  const { toasts, toast, removeToast } = useToast()

  return (
    <div className="flex">
      <Sidebar type="staff" />
      <div className="flex-1 min-w-0 bg-[#EEF3F9]">
        <PanelHeader title="Kelola Konten FAQ" />
        <div className="p-5">
          <div className="flex justify-between items-center mb-3.5">
            <h1 className="text-[18px] font-bold text-ipb-900">Manajemen FAQ</h1>
            <Button size="sm" onClick={() => setShowForm(!showForm)}>+ Tambah FAQ</Button>
          </div>

          <div className="bg-ipb-50 border border-ipb-200 rounded-md px-3 py-2.5 text-[11px] text-ipb-700 flex gap-2 mb-3.5">
            ℹ️ FAQ <strong>Published</strong> langsung tampil ke mahasiswa. <strong>Draft</strong> hanya terlihat Staff & Admin.
          </div>

          {/* Filter bar */}
          <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mb-3.5">
            <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-ipb-50 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
                <input className="w-full h-8 border border-ipb-200 rounded-md pl-7 text-[11px] outline-none focus:border-ipb-400" placeholder="Cari pertanyaan FAQ..." />
              </div>
              {FILTERS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border font-medium cursor-pointer transition-all
                    ${filter === f ? 'bg-ipb-500 text-white border-ipb-500' : 'bg-white text-gray-600 border-ipb-200 hover:border-ipb-300'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ table */}
          <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mb-3.5">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-[12px]">
                <thead>
                  <tr>
                    {['#','Pertanyaan','Kategori','Dilihat','Diubah','Status','Aksi'].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] text-gray-400 font-semibold bg-ipb-50 border-b-[1.5px] border-ipb-100">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FAQS.map((f, i) => (
                    <tr key={i} className="border-b border-ipb-50 hover:bg-ipb-25 transition-colors">
                      <td className="px-3 py-2.5 text-[10px] text-gray-300">{f.no}</td>
                      <td className="px-3 py-2.5 max-w-[240px] text-[11px] text-gray-600">{f.q}</td>
                      <td className="px-3 py-2.5"><span className="text-[9px] px-1.5 py-px rounded bg-ipb-50 text-ipb-600 font-medium">{f.cat}</span></td>
                      <td className="px-3 py-2.5 text-[11px]">{f.views}</td>
                      <td className="px-3 py-2.5 text-[11px] text-gray-400">{f.date}</td>
                      <td className="px-3 py-2.5"><Badge v={STATUS_BADGE[f.status]}>{STATUS_LABEL[f.status]}</Badge></td>
                      <td className="px-3 py-2.5">
                        <div className="flex gap-1.5">
                          {f.status !== 'resolved' && (
                            <Button size="xs" onClick={() => toast('✅ FAQ dipublikasikan!', 'success')}>Publish</Button>
                          )}
                          <Button size="xs" variant="secondary" onClick={() => setShowForm(true)}>Edit</Button>
                          <Button size="xs" variant="ghost" onClick={() => toast('👁 Preview FAQ...', 'info')}>Preview</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add/Edit form */}
          {showForm && (
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
              <div className="flex justify-between items-center mb-3.5">
                <h2 className="text-[13px] font-bold text-ipb-900">✏️ Tambah / Edit FAQ</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer text-lg leading-none">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <FormGroup label="Pertanyaan" required>
                  <Input placeholder="Tulis pertanyaan FAQ..." />
                </FormGroup>
                <FormGroup label="Kategori" required>
                  <Select>
                    <option>Transkip</option>
                    <option>Surat Ket.</option>
                    <option>KRS</option>
                    <option>Beasiswa</option>
                    <option>Umum</option>
                  </Select>
                </FormGroup>
              </div>
              <FormGroup label="Jawaban" required>
                <Textarea rows={6} placeholder="Tulis jawaban secara lengkap dan jelas..." />
              </FormGroup>
              <FormGroup label="Tag Tambahan">
                <Input placeholder="Contoh: LPDP, beasiswa, legalisir (pisahkan koma)" />
              </FormGroup>
              <div className="flex gap-2">
                <Button onClick={() => { toast('✅ FAQ berhasil dipublikasikan!', 'success'); setShowForm(false) }}>Simpan & Publish</Button>
                <Button variant="secondary" onClick={() => { toast('💾 Draft disimpan', 'info'); setShowForm(false) }}>Simpan Draft</Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}
