import { useNavigate } from 'react-router-dom'
import StudentTopbar from '@/components/layout/StudentTopbar'
import Button from '@/components/ui/Button'
import { FormGroup, Input, Select, Textarea } from '@/components/ui/Input'
import { useToast } from '@/hooks/useToast'
import { useConfirm } from '@/hooks/useConfirm'
import ToastContainer from '@/components/ui/Toast'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function DiscNew() {
  const navigate = useNavigate()
  const { toasts, toast, removeToast } = useToast()
  const { confirmState, confirm, closeConfirm } = useConfirm()

  const handleSubmit = () => {
    confirm(
      'Kirim Diskusi?',
      'Diskusi akan langsung terlihat oleh Staff IPB.',
      () => {
        toast('💬 Diskusi berhasil dibuka!', 'success')
        setTimeout(() => navigate('/diskusi/detail'), 1200)
      }
    )
  }

  return (
    <div>
      <StudentTopbar />
      <div className="p-5">
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-3">
          <span className="cursor-pointer hover:text-ipb-500" onClick={() => navigate('/diskusi')}>Diskusi</span>
          <span className="text-gray-200">›</span>
          <span className="text-ipb-600 font-semibold">Buka Diskusi Baru</span>
        </div>

        <h1 className="text-[18px] font-bold text-ipb-900 mb-1">Buka Diskusi Baru</h1>
        <p className="text-[11px] text-gray-400 mb-4">Ajukan pertanyaan ke Staff IPB.</p>

        <div className="bg-amber-100 border border-amber-200 rounded-md px-3 py-2.5 text-[11px] text-amber-700 flex gap-2 mb-5">
          ⚠️
          <div>
            <strong>Sudah cek FAQ?</strong> Banyak pertanyaan sudah terjawab di sana.{' '}
            <span className="text-ipb-500 font-semibold cursor-pointer hover:underline"
              onClick={() => navigate('/faq')}>
              Cek FAQ →
            </span>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_280px] gap-4">
          <div>
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3.5">
              <h2 className="text-[13px] font-bold text-ipb-900 mb-3.5">📝 Detail Diskusi</h2>

              <FormGroup label="Judul Pertanyaan / Topik" required
                hint="Tulis judul yang spesifik agar mudah ditemukan">
                <Input defaultValue="Transkip bilingual — apakah bisa diajukan dalam satu tiket?" />
              </FormGroup>

              <div className="grid grid-cols-2 gap-3">
                <FormGroup label="Kategori" required>
                  <Select>
                    <option value="">-- Pilih --</option>
                    <option>Transkip & Legalisir</option>
                    <option>Surat Keterangan</option>
                    <option>Beasiswa & KRS</option>
                    <option>Lainnya</option>
                  </Select>
                </FormGroup>
                <FormGroup label="Tipe Diskusi">
                  <Select>
                    <option>Pertanyaan</option>
                    <option>Keluhan</option>
                    <option>Saran</option>
                  </Select>
                </FormGroup>
              </div>

              <FormGroup label="Deskripsi Lengkap" required
                hint="Jelaskan sedetail mungkin. Sertakan konteks dan deadline.">
                <Textarea rows={7}
                  defaultValue={"Saya perlu mengajukan dua versi transkip (Indonesia & Inggris) untuk LPDP 2026.\n\nPertanyaan:\n1. Apakah bisa dalam satu tiket?\n2. Jika terpisah, bisa diproses bersamaan?\n3. Ada biaya tambahan untuk bilingual?\n\nTerima kasih 🙏"} />
              </FormGroup>

              <FormGroup label="Lampiran (opsional)">
                <div
                  onClick={() => toast('📂 Pilih file lampiran', 'info')}
                  className="border-2 border-dashed border-ipb-300 rounded-lg p-3.5 text-center bg-ipb-50 cursor-pointer hover:border-ipb-400 hover:bg-ipb-100 transition-all">
                  <div className="text-lg mb-1">📎</div>
                  <div className="text-[11px] font-semibold text-ipb-600">Lampirkan file pendukung</div>
                  <div className="text-[10px] text-gray-400">PDF, JPG — Maks. 5MB</div>
                </div>
              </FormGroup>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="ghost" onClick={() => navigate('/diskusi')}>← Batal</Button>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => toast('💾 Draft disimpan', 'info')}>
                  Simpan Draft
                </Button>
                <Button onClick={handleSubmit}>Kirim Diskusi 💬</Button>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-2.5">✅ Panduan Diskusi Baik</h3>
              {[
                ['1.', 'Judul harus spesifik dan deskriptif'],
                ['2.', 'Pilih kategori yang tepat'],
                ['3.', 'Cantumkan konteks: untuk apa, deadline kapan'],
                ['4.', 'Jangan lampirkan data sensitif (nomor rekening, dll)'],
                ['5.', 'Tandai Resolved jika pertanyaan sudah terjawab'],
              ].map(([n, t], i) => (
                <div key={i} className="flex gap-2 text-[11px] text-gray-600 mb-2">
                  <span className="text-green-700 font-bold shrink-0">{n}</span>
                  <span>{t}</span>
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