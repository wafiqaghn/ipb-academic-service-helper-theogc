import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import PanelHeader from '@/components/layout/PanelHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import StatCard from '@/components/ui/StatCard'
import DistBar from '@/components/shared/DistBar'
import { FormGroup, Input } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import ToastContainer from '@/components/ui/Toast'

export default function StaffRequests() {
  const { toasts, toast, removeToast } = useToast()
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedReq, setSelectedReq] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  
  const [requests, setRequests] = useState([
    {
      id: 'REQ-0145',
      nama: 'Quina Rizky Dae Yuena Siregar',
      nim: 'G6401231013',
      prodi: 'Ilmu Komputer',
      jenis: 'Surat Keterangan Aktif',
      tanggal: '18 Mei 2026',
      status: 'open',
      tujuan: 'Pihak BPJS Kesehatan Bogor',
      keperluan: 'Perpanjangan kepesertaan BPJS anak PNS',
      ipk: '3.85',
    },
    {
      id: 'REQ-0142',
      nama: 'Muhammad Farhan',
      nim: 'G6401230045',
      prodi: 'Ilmu Komputer',
      jenis: 'Surat Keterangan Lulus (SKL)',
      tanggal: '17 Mei 2026',
      status: 'progress',
      tujuan: 'HRD PT Telkom Indonesia',
      keperluan: 'Melamar pekerjaan posisi Backend Engineer',
      ipk: '3.72',
    }
  ])

  const handleUpdateStatus = (id, nextStatus) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: nextStatus } : req))
    if (selectedReq && selectedReq.id === id) {
      setSelectedReq(prev => ({ ...prev, status: nextStatus }))
    }
    const msg = nextStatus === 'progress' ? 'Berkas diproses' : 'Berkas berhasil disetujui!'
    toast(`✅ ${msg} (${id})`, 'success')
  }

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      toast('Alasan penolakan tidak boleh kosong!', 'error')
      return
    }
    setRequests(prev => prev.map(req => req.id === selectedReq.id ? { ...req, status: 'rejected', alasan: rejectReason } : req))
    setSelectedReq(prev => ({ ...prev, status: 'rejected', alasan: rejectReason }))
    setShowRejectModal(false)
    setRejectReason('')
    toast(`⚠️ Berkas ${selectedReq.id} telah ditolak dengan alasan.`, 'info')
  }

  const filteredRequests = requests.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.status === filterStatus
    const matchesSearch = req.nama.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          req.nim.includes(searchQuery) || 
                          req.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="flex bg-[#EEF3F9] min-h-screen">
      <Sidebar type="staff" />
      
      <div className="flex-1 min-w-0">
        <PanelHeader 
          title="Dashboard Staff Operator" 
          subtitle={`Manajemen Antrean Berkas Masuk · ${requests.filter(r=>r.status==='open').length} perlu tindakan`}
        />

        <div className="p-5">
          <div className="grid grid-cols-3 gap-3 mb-5">
            <StatCard icon="📬" val={requests.filter(r=>r.status==='open').length} label="Tiket Open" color="text-red-600" />
            <StatCard icon="⚙️" val={requests.filter(r=>r.status==='progress').length} label="In Progress" color="text-ipb-600" />
            <StatCard icon="✅" val={requests.filter(r=>r.status==='resolved').length} label="Resolved Berkas" color="text-green-700" />
          </div>

          <div className="grid grid-cols-[1fr_360px] gap-5 items-start">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-center mb-4 gap-4">
                <h3 className="text-[13px] font-bold text-ipb-900">📑 Daftar Antrean Berkas Pengajuan Mahasiswa</h3>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                  {[['all', 'Semua'], ['open', 'Open'], ['progress', 'Proses']].map(([st, lbl]) => (
                    <button key={st} onClick={() => setFilterStatus(st)} className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${filterStatus === st ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-900'}`}>{lbl}</button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <Input placeholder="Cari berdasarkan NIM, nama, atau ID pengajuan..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="text-[11px]" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-3 py-2.5">ID Request</th>
                      <th className="px-3 py-2.5">Pemohon</th>
                      <th className="px-3 py-2.5">Jenis Surat</th>
                      <th className="px-3 py-2.5">Status</th>
                      <th className="px-3 py-2.5 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredRequests.map((req) => (
                      <tr key={req.id} className={`hover:bg-gray-50/70 transition-colors cursor-pointer ${selectedReq?.id === req.id ? 'bg-ipb-50/50' : ''}`} onClick={() => setSelectedReq(req)}>
                        <td className="px-3 py-3 font-mono font-bold text-gray-900">{req.id}</td>
                        <td className="px-3 py-3">
                          <span className="font-bold text-gray-800 block">{req.nama}</span>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{req.nim} • {req.prodi}</span>
                        </td>
                        <td className="px-3 py-3 text-gray-600 font-medium">{req.jenis}</td>
                        <td className="px-3 py-3">
                          <Badge v={req.status}>{req.status === 'open' ? 'Antrean Baru' : req.status === 'progress' ? 'Diproses' : 'Selesai'}</Badge>
                        </td>
                        <td className="px-3 py-3 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-1 justify-end">
                            {req.status === 'open' && (
                              <button onClick={() => handleUpdateStatus(req.id, 'progress')} className="px-2 py-1 rounded bg-ipb-50 text-ipb-700 hover:bg-ipb-100 text-[10px] font-bold cursor-pointer border border-ipb-100">Ambil</button>
                            )}
                            {req.status === 'progress' && (
                              <button onClick={() => handleUpdateStatus(req.id, 'resolved')} className="px-2 py-1 rounded bg-green-50 text-green-700 hover:bg-green-100 text-[10px] font-bold cursor-pointer border border-green-100">Setujui</button>
                            )}
                            {(req.status === 'open' || req.status === 'progress') && (
                              <button onClick={() => { setSelectedReq(req); setShowRejectModal(true); }} className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 text-[10px] font-bold cursor-pointer border border-red-100">Tolak</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <DistBar items={[
                  { label: 'Keterangan Aktif', pct: 60, color: '#378ADD' },
                  { label: 'SKL Magang', pct: 40, color: '#3B6D11' }
                ]} />
              </div>
            </div>

            <div>
              {selectedReq ? (
                <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                  <h3 className="text-[13px] font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">Inspektur Berkas</h3>
                  <div className="space-y-3.5 text-[11px] text-gray-600">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Identitas Mahasiswa</span>
                      <span className="text-gray-900 font-bold block mt-0.5">{selectedReq.nama}</span>
                      <span className="text-gray-500 block">{selectedReq.nim} • {selectedReq.prodi}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Maksud Alasan Pengajuan</span>
                      <p className="text-gray-800 mt-0.5 bg-gray-50 px-2 py-1.5 rounded border border-gray-100 leading-relaxed">{selectedReq.keperluan || '-'}</p>
                    </div>
                    <div className="pt-2 border-t border-gray-100 space-y-1.5">
                      {selectedReq.status === 'open' && <Button onClick={() => handleUpdateStatus(selectedReq.id, 'progress')} className="w-full text-center">Ambil Berkas</Button>}
                      {selectedReq.status === 'progress' && <Button onClick={() => handleUpdateStatus(selectedReq.id, 'resolved')} className="w-full text-center">Sahkan & Tanda Tangan</Button>}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400">
                  <p className="text-[11px]">Pilih salah satu baris pengajuan untuk memeriksa kelayakan berkas.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl">
            <h3 className="text-[13px] font-bold text-gray-900 mb-1">Alasan Penolakan Dokumen</h3>
            <textarea rows={3} value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Tulis alasan..." className="w-full text-[11px] p-2 border border-gray-200 rounded-lg mt-2 focus:outline-none" />
            <div className="flex justify-end gap-2 mt-4">
              <Button size="sm" variant="ghost" onClick={() => setShowRejectModal(false)}>Batal</Button>
              <button onClick={handleRejectSubmit} className="px-3 py-1.5 bg-red-600 text-white font-bold rounded-lg text-[11px] cursor-pointer">Kirim Penolakan</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  )
}