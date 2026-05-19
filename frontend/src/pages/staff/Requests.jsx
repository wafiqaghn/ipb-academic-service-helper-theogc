import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import ToastContainer from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

const ALL_TICKETS = [
  { 
    id: '#TKT-2026-0145', 
    title: 'Surat Ket. Masih Studi', 
    mhs: 'Quina Rizky',  
    cat: 'Surat Ket.', 
    tgl: '15 Mar', 
    dl: '20 Mar', 
    dlRed: true,  
    status: 'open',     
    h: null,
    formData: {
      tujuan: 'Panitia Beasiswa LPDP 2026',
      keperluan: 'Persyaratan pendaftaran Beasiswa LPDP Tahap 1',
      catatan: 'Mohon cantumkan total masa studi aktif sampai semester 5'
    },
    mhsFile: 'KTM_QuinaRizky.pdf'
  },
  { 
    id: '#TKT-2026-0144', 
    title: 'Transkip LPDP',          
    mhs: 'Andi Prabowo', 
    cat: 'Transkip',   
    tgl: '14 Mar', 
    dl: '22 Mar', 
    dlRed: false, 
    status: 'open',     
    h: null,
    formData: {
      tujuan: 'Lembaga Pengelola Dana Pendidikan',
      keperluan: 'Pengajuan pendanaan studi lanjut',
      ipk: '3.82'
    },
    mhsFile: 'Transkip_Sementara_Andi.pdf'
  },
  { 
    id: '#TKT-2026-0143', 
    title: 'Legalisir KRS Smt 5',    
    mhs: 'Dinda Ayu',    
    cat: 'KRS',        
    tgl: '14 Mar', 
    dl: '—',      
    dlRed: false, 
    status: 'open',     
    h: null,
    formData: {
      keperluan: 'Verifikasi dokumen magang mandiri'
    },
    mhsFile: 'KRS_Semester_5_Dinda.pdf'
  },
  { 
    id: '#TKT-2026-0142', 
    title: 'Transkip Nilai LPDP',    
    mhs: 'Quina Rizky',  
    cat: 'Transkip',   
    tgl: '12 Mar', 
    dl: '17 Mar', 
    dlRed: false, 
    status: 'progress', 
    h: 'Budi S.',
    formData: {
      tujuan: 'Beasiswa LPDP Luar Negeri',
      keperluan: 'Kelengkapan berkas administrasi wawancara',
      ipk: '3.90'
    },
    mhsFile: 'KTM_dan_KRS_Merged.pdf'
  },
  { 
    id: '#TKT-2026-0128', 
    title: 'Surat Ket. Aktif',       
    mhs: 'Quina Rizky',  
    cat: 'Surat Ket.', 
    tgl: '05 Mar', 
    dl: '—',      
    dlRed: false, 
    status: 'resolved', 
    h: 'Ghanianda',
    formData: {
      tujuan: 'BPJS Kesehatan Cabang Bogor',
      keperluan: 'Pengurusan tunjangan kesehatan anak PNS'
    },
    mhsFile: 'Kartu_Keluarga_Quina.pdf'
  },
]

export default function StaffRequests() {
  const [tickets, setTickets] = useState(ALL_TICKETS)
  const [tab, setTab] = useState('open')
  const [sel, setSel] = useState(null)
  const [panel, setPanel] = useState(false)
  
  const [statusVal, setStatusVal] = useState('open')
  const [uploadedFile, setUploadedFile] = useState(null)

  const { toasts, toast, removeToast } = useToast()
  const { confirmState, confirm, closeConfirm } = useConfirm()

  const list = tickets.filter(t => {
    if (tab === 'open') return t.status === 'open' || t.status === 'progress'
    return t.status === 'resolved' || t.status === 'rejected'
  })

  const openDetail = (t) => {
    setSel(t)
    setStatusVal(t.status)
    setUploadedFile(null)
    setPanel(true)
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name)
      toast(`📁 File ${e.target.files[0].name} berhasil dipilih`, 'info')
    }
  }

  const handleUpdateStatus = () => {
    if (statusVal === 'resolved' && !uploadedFile) {
      toast('⚠️ Silakan unggah dokumen surat terlebih dahulu untuk menyelesaikan permintaan!', 'error')
      return
    }

    setTickets(prev => prev.map(t => {
      if (t.id === sel.id) {
        return { ...t, status: statusVal, h: statusVal !== 'open' ? 'Ghanianda' : null }
      }
      return t
    }))

    if (statusVal === 'resolved') {
      toast(`✅ Surat berhasil dikirim ke ${sel.mhs}! Tiket ditandai Selesai.`, 'success')
    } else {
      toast('✅ Status tiket berhasil diperbarui!', 'success')
    }
    
    setPanel(false)
  }

  return (
    <div className="flex min-h-screen bg-ipb-50">
      <Sidebar role="staff" />
      <div className="flex-1 min-w-0">
        <PanelHeader title="Daftar Permintaan Surat" role="staff" />
        
        <div className="p-6">
          <div className="flex border-b border-ipb-100 mb-5 gap-6">
            <button onClick={() => setTab('open')}
              className={`pb-2.5 text-[13px] font-bold transition-all ${tab === 'open' ? 'text-ipb-600 border-b-2 border-ipb-600' : 'text-gray-400'}`}>
              Perlu Diproses ({tickets.filter(t => t.status==='open' || t.status==='progress').length})
            </button>
            <button onClick={() => setTab('done')}
              className={`pb-2.5 text-[13px] font-bold transition-all ${tab === 'done' ? 'text-ipb-600 border-b-2 border-ipb-600' : 'text-gray-400'}`}>
              Riwayat Selesai ({tickets.filter(t => t.status==='resolved' || t.status==='rejected').length})
            </button>
          </div>

          <div className="bg-white rounded-xl border border-ipb-100 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-ipb-50/50 border-b border-ipb-100 text-[11px] font-bold text-ipb-800 uppercase tracking-wider">
                  <th className="py-3 px-4">ID Tiket</th>
                  <th className="py-3 px-4">Jenis Surat</th>
                  <th className="py-3 px-4">Pemohon</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Tgl Masuk</th>
                  <th className="py-3 px-4">Deadline</th>
                  <th className="py-3 px-4">Handler</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ipb-50 text-[12px] text-gray-700">
                {list.map(t => (
                  <tr key={t.id} onClick={() => openDetail(t)} className="hover:bg-ipb-50/30 cursor-pointer transition-all">
                    <td className="py-3.5 px-4 font-mono font-bold text-ipb-600">{t.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-ipb-900">{t.title}</td>
                    <td className="py-3.5 px-4">{t.mhs}</td>
                    <td className="py-3.5 px-4 text-gray-500">{t.cat}</td>
                    <td className="py-3.5 px-4 text-gray-500">{t.tgl}</td>
                    <td className={`py-3.5 px-4 font-medium ${t.dlRed && t.status !== 'resolved' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>{t.dl}</td>
                    <td className="py-3.5 px-4 text-gray-600 italic">{t.h || '—'}</td>
                    <td className="py-3.5 px-4"><Badge v={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={`fixed inset-y-0 right-0 w-[400px] bg-white border-l border-ipb-100 shadow-xl transform transition-transform duration-300 z-40 flex flex-col ${panel ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-ipb-100 flex justify-between items-center bg-ipb-50/50">
          <div>
            <span className="text-[10px] font-mono font-bold text-ipb-500">{sel?.id}</span>
            <h3 className="text-[14px] font-bold text-ipb-900">{sel?.title}</h3>
          </div>
          <button onClick={() => setPanel(false)} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4 mb-5">
            <div>
              <label className="block text-[10px] text-gray-400 font-medium uppercase tracking-wider">Nama Pemohon</label>
              <p className="text-[13px] font-bold text-gray-900">{sel?.mhs}</p>
              <p className="text-[10px] text-gray-500">NIM: G6401231013 • Departemen Ilmu Komputer</p>
            </div>

            <div className="bg-ipb-50/50 border border-ipb-100 rounded-lg p-3.5 space-y-3">
              <h4 className="text-[11px] font-bold text-ipb-800 uppercase tracking-wider border-b border-ipb-100 pb-1">📄 Data yang Diisi Mahasiswa</h4>
              
              {sel?.formData?.tujuan && (
                <div>
                  <span className="block text-[10px] text-gray-400 font-medium">Ditujukan Kepada:</span>
                  <span className="text-[11px] text-gray-800 font-semibold">{sel.formData.tujuan}</span>
                </div>
              )}
              
              {sel?.formData?.keperluan && (
                <div>
                  <span className="block text-[10px] text-gray-400 font-medium">Keperluan / Alasan:</span>
                  <span className="text-[11px] text-gray-800 font-semibold">{sel.formData.keperluan}</span>
                </div>
              )}

              {sel?.formData?.ipk && (
                <div>
                  <span className="block text-[10px] text-gray-400 font-medium">IPK Terakhir:</span>
                  <span className="text-[11px] text-gray-800 font-bold text-green-700">{sel.formData.ipk}</span>
                </div>
              )}

              {sel?.formData?.catatan && (
                <div>
                  <span className="block text-[10px] text-gray-400 font-medium">Catatan Tambahan:</span>
                  <span className="text-[11px] text-gray-600 italic block bg-white p-2 rounded border border-gray-100 mt-0.5">{sel.formData.catatan}</span>
                </div>
              )}
            </div>

            {sel?.mhsFile && (
              <div className="bg-blue-50/40 border border-blue-100 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xl shrink-0">📎</span>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-medium uppercase leading-none">Lampiran Mahasiswa</p>
                    <p className="text-[11px] font-semibold text-gray-700 truncate mt-0.5">{sel.mhsFile}</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast(`👁️ Membuka file preview: ${sel.mhsFile}`, 'info')}
                  className="text-[11px] font-bold text-blue-600 hover:underline shrink-0 ml-2">
                  Lihat File
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-ipb-100 pt-4">
            <h4 className="text-[12px] font-bold text-ipb-900 mb-3">⚙️ Aksi & Pembaruan Status</h4>
            
            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Ubah Status</label>
              <select value={statusVal} onChange={(e) => setStatusVal(e.target.value)}
                className="w-full border border-ipb-200 rounded-md px-2.5 py-1.5 text-[12px] outline-none focus:border-ipb-400 bg-white">
                <option value="open">Open (Belum Diproses)</option>
                <option value="progress">In Progress (Sedang Dibuat)</option>
                <option value="resolved">Resolved (Selesai & Kirim Surat)</option>
              </select>
            </div>

            {statusVal === 'resolved' && (
              <div className="mb-4 bg-green-50 border border-green-100 rounded-lg p-3.5">
                <label className="block text-[11px] font-bold text-green-800 mb-1.5">📤 Unggah Surat Hasil (.pdf)</label>
                <input type="file" id="upload-surat" accept=".pdf" className="hidden" onChange={handleFileChange} />
                <label htmlFor="upload-surat"
                  className="border-2 border-dashed border-green-300 rounded-lg p-3 block text-center bg-white cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all">
                  <div className="text-md mb-1">📄</div>
                  <div className="text-[11px] font-semibold text-green-700">
                    {uploadedFile ? 'Ganti file surat' : 'Pilih atau Drop File Surat'}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-0.5">
                    {uploadedFile ? uploadedFile : 'Format PDF — Maks. 10MB'}
                  </div>
                </label>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Catatan Internal / Pesan</label>
              <textarea className="w-full border border-ipb-200 rounded-md px-2.5 py-2 text-[11px] outline-none focus:border-ipb-400 resize-none" rows={4} placeholder="Catatan untuk tim atau mahasiswa..." />
            </div>

            <div className="mb-5">
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">Notifikasi ke Mahasiswa?</label>
              <div className="flex gap-4 mt-1 text-[11px]">
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="nf" defaultChecked /> Ya, kirim email & notif</label>
                <label className="flex items-center gap-1.5 cursor-pointer"><input type="radio" name="nf" /> Tidak</label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1" size="sm" onClick={handleUpdateStatus}>Simpan Update</Button>
              <Button size="sm" variant="danger"
                onClick={() => confirm('Reject Tiket?', 'Tiket akan ditolak dan mahasiswa dinotifikasi.', () => { toast('❌ Tiket ditolak', 'error'); setPanel(false) }, { danger: true, okLabel: 'Reject' })}>
                Reject
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ConfirmModal state={confirmState} onClose={closeConfirm} />
    </div>
  )
}