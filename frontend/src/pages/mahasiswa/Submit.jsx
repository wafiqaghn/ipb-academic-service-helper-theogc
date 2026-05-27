import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StudentTopbar from '@/components/layout/StudentTopbar'
import Button from '@/components/ui/Button'
import { FormGroup, Input, Select, Textarea } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import ConfirmModal from '@/components/ui/ConfirmModal'
import ToastContainer from '@/components/ui/Toast'

const STEPS = [
  { n: 1, label: 'Cek FAQ',      status: 'done'   },
  { n: 2, label: 'Isi Formulir', status: 'active'  },
  { n: 3, label: 'Dokumen',      status: 'pending' },
  { n: 4, label: 'Konfirmasi',   status: 'pending' },
]

const HISTORY = [
  { id: '#TKT-2026-0128', title: 'Surat Keterangan Aktif', date: '5 Mar 2026' },
  { id: '#TKT-2026-0109', title: 'Legalisir KRS', date: '20 Feb 2026' },
]

export default function Submit() {
  const navigate = useNavigate()
  const { toasts, toast, removeToast } = useToast()
  const { confirmState, confirm, closeConfirm } = useConfirm()
  const [files, setFiles] = useState([
    { name: 'KTM_Quina_2026.pdf', size: '245 KB' },
    { name: 'Surat_Permohonan.pdf', size: '128 KB' },
  ])

  const handleSubmit = () => {
    confirm(
      'Kirim Permohonan?',
      'Pastikan semua data sudah benar. Permohonan tidak bisa diubah setelah dikirim.',
      () => {
        toast('🎉 Permohonan berhasil dikirim! ID: #TKT-2026-0149', 'success')
        setTimeout(() => navigate('/track'), 1200)
      }
    )
  }

  return (
    <div>
      <StudentTopbar />
      <div className="p-5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-3">
          <span className="cursor-pointer hover:text-ipb-500" onClick={() => navigate('/faq')}>FAQ</span>
          <span className="text-gray-200">›</span>
          <span className="text-ipb-600 font-semibold">Ajukan Layanan</span>
        </div>

        <h1 className="text-[18px] font-bold text-ipb-900 mb-1">Ajukan Layanan Akademik</h1>
        <p className="text-[11px] text-gray-400 mb-4">Lengkapi formulir. Pastikan sudah membaca FAQ.</p>

        {/* Step bar */}
        <div className="flex items-center mb-5">
          {STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : 'none' }}>
              <div className="flex items-center gap-1.5">
                <div className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0
                  ${s.status === 'done'   ? 'bg-ipb-400 text-white'
                  : s.status === 'active' ? 'bg-ipb-800 text-white shadow-[0_0_0_3px_#D6E9FA]'
                  :                        'bg-gray-200 text-gray-400'}`}>
                  {s.status === 'done' ? '✓' : s.n}
                </div>
                <span className={`text-[10px] font-medium
                  ${s.status === 'active' ? 'text-ipb-800 font-bold'
                  : s.status === 'done'   ? 'text-ipb-500'
                  :                        'text-gray-400'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1.5 ${s.status === 'done' ? 'bg-ipb-300' : 'bg-ipb-100'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_260px] gap-4">
          {/* Left: Form */}
          <div>
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3.5">
              <h2 className="text-[13px] font-bold text-ipb-900 mb-3.5">📝 Detail Permohonan</h2>
              <FormGroup label="Judul" required>
                <Input defaultValue="Permohonan Transkip Nilai Resmi untuk LPDP" />
              </FormGroup>
              <div className="grid grid-cols-2 gap-3">
                <FormGroup label="Kategori" required>
                  <Select>
                    <option>Transkip & Legalisir</option>
                    <option>Surat Keterangan Aktif</option>
                    <option>Beasiswa & KRS</option>
                    <option>Legalisir Ijazah</option>
                    <option>Lainnya</option>
                  </Select>
                </FormGroup>
                <FormGroup label="Prioritas">
                  <Select>
                    <option>Normal</option>
                    <option>Mendesak</option>
                  </Select>
                </FormGroup>
              </div>
              <FormGroup label="Deskripsi" required>
                <Textarea rows={5} defaultValue="Saya membutuhkan transkip nilai resmi yang sudah dilegalisir untuk keperluan beasiswa LPDP 2026. Diperlukan dalam format bahasa Indonesia dan Inggris. Mohon diproses sebelum 25 Maret 2026." />
              </FormGroup>
              <FormGroup label="Tenggat Waktu (opsional)">
                <Input type="date" defaultValue="2026-03-25" />
              </FormGroup>
            </div>

            {/* Upload */}
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3.5">
              <h2 className="text-[13px] font-bold text-ipb-900 mb-3">📎 Dokumen Pendukung</h2>
              <div
                onClick={() => toast('📂 Pilih file untuk diunggah', 'info')}
                className="border-2 border-dashed border-ipb-300 rounded-lg p-5 text-center bg-ipb-50 cursor-pointer hover:border-ipb-400 hover:bg-ipb-100 transition-all">
                <div className="text-2xl mb-1.5">📂</div>
                <div className="text-[12px] font-semibold text-ipb-600 mb-0.5">Klik atau seret file ke sini</div>
                <div className="text-[10px] text-gray-400">PDF, JPG, PNG — Maks. 5MB per file</div>
              </div>
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-white border border-ipb-200 rounded-md px-2.5 py-2 mt-2">
                  <div className="w-[26px] h-[26px] bg-ipb-50 rounded flex items-center justify-center text-xs shrink-0">📄</div>
                  <div className="flex-1">
                    <div className="text-[11px] font-medium">{f.name}</div>
                    <div className="text-[9px] text-gray-400">{f.size}</div>
                  </div>
                  <button
                    onClick={() => { setFiles(files.filter((_, j) => j !== i)); toast('🗑️ File dihapus', 'info') }}
                    className="text-gray-300 hover:text-danger-500 text-sm px-1 border-none bg-transparent cursor-pointer">
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => navigate('/faq')}>← Kembali</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => toast('💾 Draft disimpan', 'info')}>💾 Simpan Draft</Button>
                <Button onClick={handleSubmit}>Submit Permohonan →</Button>
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div>
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-2.5">ℹ️ Info Layanan</h3>
              <div className="text-[11px] text-gray-600 leading-relaxed">
                <strong className="text-ipb-800">Transkip & Legalisir</strong>
                <br /><br />
                ⏱ Estimasi: <strong>3–5 hari kerja</strong>
                <br /><br />
                📋 Dokumen:
                <ul className="ml-3.5 mt-1 mb-2.5 space-y-0.5">
                  <li>KTM aktif (wajib)</li>
                  <li>Surat permohonan (opsional)</li>
                </ul>
                <div className="bg-amber-100 text-amber-700 text-[10px] rounded-md px-2.5 py-2">
                  ⚠️ Pastikan semua info benar sebelum submit.
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-2.5">📊 Riwayat Saya</h3>
              {HISTORY.map((t, i) => (
                <div key={i}
                  onClick={() => navigate('/track')}
                  className="bg-white border border-ipb-100 rounded-lg p-2.5 mb-2 cursor-pointer hover:border-ipb-300 hover:shadow-sm transition-all">
                  <div className="text-[10px] font-mono font-bold text-ipb-500">{t.id}</div>
                  <div className="text-[11px] font-semibold text-ipb-900 my-0.5">{t.title}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] text-gray-400">{t.date}</span>
                    <span className="inline-flex items-center text-[10px] font-semibold px-1.5 py-px rounded-full bg-green-100 text-green-700">Resolved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmModal state={confirmState} onClose={closeConfirm} />
    </div>
  )
}
