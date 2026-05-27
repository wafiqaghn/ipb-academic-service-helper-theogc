import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { FormGroup, Input, Textarea } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import ToastContainer from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

const INITIAL_CATS = [
  { icon:'📋', bg:'#EAF3FC', name:'Transkip & Legalisir', desc:'Permohonan transkip nilai dan legalisir dokumen akademik resmi.', cnt:38, tipe:'manual' },
  { icon:'📄', bg:'#EAF3DE', name:'Surat Keterangan', desc:'Surat aktif, rekomendasi, dan surat keterangan lainnya.', cnt:28, tipe:'manual' },
  { icon:'🎓', bg:'#FAEEDA', name:'KRS & Akademik', desc:'Pengisian, perubahan, dan validasi KRS mahasiswa.', cnt:18, tipe:'manual' },
  { icon:'💰', bg:'#EEE8FF', name:'Beasiswa', desc:'Dokumen pendukung beasiswa internal dan eksternal.', cnt:14, tipe:'manual' },
  { icon:'📁', bg:'#F1EFE8', name:'Lainnya', desc:'Permohonan yang tidak termasuk kategori lain.', cnt:6, tipe:'manual' },
  { icon:'⚡', bg:'#FFF9E6', name:'Surat Aktif Otomatis', desc:'Generate instan surat keterangan aktif kuliah.', cnt:512, tipe:'generate', template:'Menyatakan bahwa [Nama] dengan NIM [NIM] adalah mahasiswa aktif di [Fakultas], Departemen [Departemen] pada semester berjalan.', ttd:'Direktur Administrasi Pendidikan' },
  { icon:'📜', bg:'#F3E8FF', name:'Transkrip Instan', desc:'Generate otomatis transkip nilai kumulatif terverifikasi.', cnt:342, tipe:'generate', template:'Daftar nilai kumulatif resmi atas nama [Nama] ([NIM]) yang telah disinkronisasi langsung melalui SIAKAD IPB.', ttd:'Wakil Rektor Bidang Akademik' }
]

export default function AdminCategories() {
  const [showForm, setShowForm] = useState(false)
  const { toasts, toast, removeToast } = useToast()
  const { confirmState, confirm, closeConfirm } = useConfirm()

  const [categories, setCategories] = useState(INITIAL_CATS)
  const [catName, setCatName] = useState('')
  const [catIcon, setCatIcon] = useState('📄')
  const [catDesc, setCatDesc] = useState('')
  const [catType, setCatType] = useState('manual')
  
  const [catTemplate, setCatTemplate] = useState('Menyatakan bahwa [Nama] dengan NIM [NIM] terdaftar aktif di IPB University.')
  const [catTtd, setCatTtd] = useState('Direktur Administrasi Pendidikan')

  const handleSaveCategory = () => {
    if (!catName.trim()) {
      toast('Nama kategori wajib diisi!', 'error')
      return
    }
    if (catType === 'generate' && !catTemplate.trim()) {
      toast('Template teks surat wajib diisi untuk tipe otomatis!', 'error')
      return
    }
    
    const newCat = {
      icon: catIcon || '📄',
      bg: catType === 'generate' ? '#FFF9E6' : '#F1EFE8',
      name: catName,
      desc: catDesc,
      cnt: 0,
      tipe: catType,
      ...(catType === 'generate' && { template: catTemplate, ttd: catTtd })
    }
    
    setCategories(prev => [...prev, newCat])
    setShowForm(false)
    setCatName('')
    setCatDesc('')
    setCatTemplate('Menyatakan bahwa [Nama] dengan NIM [NIM] terdaftar aktif di IPB University.')
    setCatTtd('Direktur Administrasi Pendidikan')
    toast('✅ Kategori baru berhasil ditambahkan!', 'success')
  }

  return (
    <div className="flex">
      <Sidebar type="admin" />
      <div className="flex-1 min-w-0 bg-[#EEF3F9]">
        <PanelHeader title="Kelola Kategori" type="admin" />
        <div className="p-5">
          <div className="flex justify-between items-center mb-3.5">
            <div>
              <h1 className="text-[18px] font-bold text-ipb-900">Kategori Layanan</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">Atur kategori manual dan struktur generate otomatis untuk mahasiswa</p>
            </div>
            <Button size="sm" onClick={() => setShowForm(!showForm)}>+ Tambah Opsi Layanan</Button>
          </div>

          <div className="bg-amber-100 border border-amber-200 rounded-md px-3 py-2.5 text-[11px] text-amber-700 flex gap-2 mb-5">
            ⚠️ Menghapus kategori dengan tiket aktif akan memindahkan tiket ke Lainnya secara otomatis.
          </div>

          {showForm && (
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-5">
              <div className="flex justify-between items-center mb-3.5">
                <h2 className="text-[13px] font-bold text-ipb-900">➕ Tambah / Edit Struktur Layanan</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 border-none bg-transparent cursor-pointer text-lg leading-none">✕</button>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <FormGroup label="Nama Kategori / Surat" required>
                  <Input placeholder="Contoh: Wisuda & Kelulusan" value={catName} onChange={e => setCatName(e.target.value)} />
                </FormGroup>
                <FormGroup label="Ikon Emoji">
                  <Input placeholder="🎓" className="text-center text-xl" value={catIcon} onChange={e => setCatIcon(e.target.value)} />
                </FormGroup>
                <FormGroup label="Tipe Alur Administrasi">
                  <select 
                    value={catType} 
                    onChange={e => setCatType(e.target.value)}
                    className="w-full h-9 px-3 text-[12px] bg-white border border-gray-200 rounded-lg focus:outline-none"
                  >
                    <option value="manual">Kelola Kategori Manual (Review Staff)</option>
                    <option value="generate">Kelola Surat Generate (Otomatis Instan)</option>
                  </select>
                </FormGroup>
              </div>
              
              <div className="mb-3">
                <FormGroup label="Deskripsi Layanan">
                  <Textarea rows={2} placeholder="Jelaskan jenis layanan dalam kategori ini..." value={catDesc} onChange={e => setCatDesc(e.target.value)} />
                </FormGroup>
              </div>

              {catType === 'generate' && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mb-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold text-amber-900">📄 Konfigurasi Template Surat Otomatis</span>
                    <span className="text-[10px] text-amber-700 bg-amber-150 px-2 py-0.5 rounded font-mono">Placeholder aktif: [Nama] [NIM] [Fakultas] [Departemen]</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <FormGroup label="Isi Teks Template Surat" required>
                      <Textarea 
                        rows={3} 
                        placeholder="Masukkan draf kalimat utama surat di sini..." 
                        value={catTemplate} 
                        onChange={e => setCatTemplate(e.target.value)} 
                      />
                    </FormGroup>
                    <FormGroup label="Pejabat Penandatangan (Pihak Berwenang IPB)">
                      <Input 
                        placeholder="Contoh: Direktur Administrasi Pendidikan dan Kelayakan Akademik" 
                        value={catTtd} 
                        onChange={e => setCatTtd(e.target.value)} 
                      />
                    </FormGroup>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleSaveCategory}>
                  Simpan Kategori
                </Button>
                <Button variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-5 items-start">
            <div className="space-y-3">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-[13px] font-bold text-ipb-900 flex items-center gap-1.5">📂 Kelola Kategori Manual</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Daftar layanan berkas yang memerlukan verifikasi dan persetujuan staff.</p>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {categories.filter(c => c.tipe === 'manual').map((c, i) => (
                  <div key={i} className="bg-white rounded-lg border border-ipb-50 shadow-sm p-4">
                    <div className="flex items-start gap-2.5 mb-2.5">
                      <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: c.bg }}>
                        {c.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-ipb-900">{c.name}</p>
                        <Badge v="resolved">Aktif</Badge>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-2.5">{c.desc}</p>
                    <div className="flex justify-between items-center pt-2.5 border-t border-ipb-50">
                      <span className="text-[10px] text-gray-400">{c.cnt} tiket bulan ini</span>
                      <div className="flex gap-1.5">
                        <Button size="xs" variant="secondary" onClick={() => { setShowForm(true); setCatType('manual'); setCatName(c.name); setCatDesc(c.desc); setCatIcon(c.icon); toast('📝 Edit mode aktif', 'info') }}>
                          Edit
                        </Button>
                        <Button size="xs" variant="ghost"
                          onClick={() => confirm(
                            'Hapus Kategori?',
                            `Tiket di "${c.name}" akan dipindahkan ke "Lainnya".`,
                            () => toast('🗑️ Kategori berhasil dihapus', 'error'),
                            { danger: true, okLabel: 'Hapus' }
                          )}>
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="border-b border-gray-200 pb-2">
                <h3 className="text-[13px] font-bold text-amber-900 flex items-center gap-1.5">⚡ Kelola Surat Generate</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Daftar lembar cetak otomatis instan berdasarkan sinkronisasi database.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {categories.filter(c => c.tipe === 'generate').map((c, i) => (
                  <div key={i} className="bg-white rounded-lg border border-amber-100 shadow-sm p-4 hover:border-amber-200 transition-all">
                    <div className="flex items-start gap-2.5 mb-2.5">
                      <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center text-lg shrink-0" style={{ background: c.bg }}>
                        {c.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-[12px] font-bold text-gray-900">{c.name}</p>
                        <Badge v="progress">Otomatis</Badge>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed mb-1.5">{c.desc}</p>
                    
                    <div className="bg-gray-50 rounded p-2 mb-2.5 border border-gray-100">
                      <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Template Konten:</div>
                      <p className="text-[9.5px] text-gray-600 line-clamp-2 font-mono mt-0.5">{c.template}</p>
                      <div className="text-[9px] text-amber-800 font-semibold mt-1">Penandatangan: {c.ttd || 'Direktorat IPB'}</div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-ipb-50">
                      <span className="text-[10px] text-amber-700 font-medium">📥 Ter-generate {c.cnt} kali</span>
                      <div className="flex gap-1.5">
                        <Button size="xs" variant="secondary" onClick={() => { setShowForm(true); setCatType('generate'); setCatName(c.name); setCatDesc(c.desc); setCatIcon(c.icon); setCatTemplate(c.template || ''); setCatTtd(c.ttd || ''); toast('📝 Edit mode template aktif', 'info') }}>
                          Edit
                        </Button>
                        <Button size="xs" variant="ghost"
                          onClick={() => confirm(
                            'Hapus Format Otomasi?',
                            `Mencabut hak generate otomatis untuk "${c.name}".`,
                            () => toast('🗑️ Fitur generate otomatis dinonaktifkan', 'error'),
                            { danger: true, okLabel: 'Hapus' }
                          )}>
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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