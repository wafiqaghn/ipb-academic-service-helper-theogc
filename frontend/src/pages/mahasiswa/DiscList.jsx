import { useNavigate } from 'react-router-dom'
import StudentTopbar from '@/components/layout/StudentTopbar'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import StatCard from '@/components/ui/StatCard'
import { useState } from 'react'

const DISCS = [
  { id:'#DISC-042', cat:'Transkip',  tag:'🔥 Aktif',         title:'Transkip bilingual — bisa satu tiket?',              body:'Perlu dua versi untuk LPDP. Bisa satu tiket atau terpisah?', author:'Quina R.',  date:'14 Mar', replies:3, views:42,  status:'open',     bc:'#378ADD', answered:true  },
  { id:'#DISC-043', cat:'Surat Ket.',tag:null,                title:'Surat aktif untuk BPJS — dokumen apa saja?',          body:'Apakah cukup KTM atau ada dokumen tambahan?',               author:'Andi P.',   date:'10 Mar', replies:5, views:89,  status:'resolved', bc:'#3B6D11', answered:true  },
  { id:'#DISC-045', cat:'Beasiswa',  tag:'⏳ Belum dijawab',  title:'Template surat rekomendasi LPDP dari IPB?',           body:'Butuh surat dengan kop surat resmi IPB dari dosen.',        author:'Dinda A.',  date:'15 Mar', replies:0, views:12,  status:'open',     bc:'#854F0B', answered:false },
  { id:'#DISC-041', cat:'KRS',       tag:null,                title:'Perbaikan KRS smt 6 setelah masa pengisian berakhir?', body:'Ada MK yang belum masuk karena konflik jadwal.',            author:'Farid R.',  date:'8 Mar',  replies:4, views:67,  status:'resolved', bc:'#3B6D11', answered:true  },
]

const STAFF = [
  { init:'GW', name:'Ghanianda W.', cnt:'24', online:true,  color:'#2478C8' },
  { init:'BS', name:'Budi Santoso', cnt:'19', online:true,  color:'#185FA5' },
  { init:'NA', name:'Nadia Amelia', cnt:'11', online:false, color:'#3B6D11' },
]

const FILTERS = ['Semua','Open','Resolved','Belum Dijawab']

export default function DiscList() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Semua')

  const filtered = DISCS.filter(d => {
    if (filter === 'Semua')          return true
    if (filter === 'Open')           return d.status === 'open'
    if (filter === 'Resolved')       return d.status === 'resolved'
    if (filter === 'Belum Dijawab')  return !d.answered
    return true
  })

  return (
    <div>
      <StudentTopbar />

      {/* Hero */}
      <div className="px-7 py-7 text-white" style={{ background:'linear-gradient(135deg,#042C53,#185FA5)' }}>
        <p className="text-[10px] text-ipb-200 tracking-widest uppercase mb-1">💬 Forum Diskusi</p>
        <h1 className="text-[20px] font-extrabold mb-1">Diskusi Layanan Akademik</h1>
        <p className="text-[12px] text-ipb-200 mb-3.5">Tanya, diskusikan, dan dapatkan jawaban dari Staff IPB</p>
        <div className="flex gap-2 max-w-[480px]">
          <input className="flex-1 h-9 rounded-lg border-none px-3 text-[12px] bg-white/15 text-white placeholder:text-white/50 outline-none"
            placeholder="Cari topik diskusi..." />
          <Button className="!h-9 !bg-ipb-300 !text-white !rounded-lg !whitespace-nowrap"
            onClick={() => navigate('/diskusi/baru')}>
            + Diskusi Baru
          </Button>
        </div>
      </div>

      <div className="p-5">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <StatCard icon="💬" val={48}    label="Total Diskusi" />
          <StatCard icon="🔓" val={31}    label="Open"           color="text-green-700" />
          <StatCard icon="✅" val={17}    label="Resolved"       color="text-ipb-600"   />
        </div>

        <div className="grid grid-cols-[1fr_260px] gap-4">
          {/* Main */}
          <div>
            {/* Filter bar */}
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm mb-3.5">
              <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-ipb-50 flex-wrap">
                <div className="relative flex-1 min-w-[180px]">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300">🔍</span>
                  <input className="w-full h-8 border border-ipb-200 rounded-md pl-7 text-[11px] outline-none focus:border-ipb-400"
                    placeholder="Cari topik..." />
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

            {/* Pinned */}
            <p className="text-[9px] font-bold text-amber-700 mb-2 uppercase tracking-wider">📌 Disematkan</p>
            <div onClick={() => navigate('/diskusi/detail')}
              className="rounded-xl p-3.5 mb-3.5 cursor-pointer border border-[#f0c97a] hover:shadow-md transition-all"
              style={{ background:'linear-gradient(to right,#FAEEDA,#fff)' }}>
              <div className="flex justify-between gap-2.5 mb-2">
                <div>
                  <div className="flex gap-1.5 mb-1.5">
                    <span className="text-[8px] font-bold px-1.5 py-px rounded-full border border-[#f0c97a] bg-amber-100 text-amber-700">📌 PINNED</span>
                    <span className="text-[9px] px-1.5 py-px rounded bg-ipb-50 text-ipb-600 font-medium">Umum</span>
                  </div>
                  <p className="text-[13px] font-bold text-ipb-900 mb-1">📢 Panduan Lengkap Pengajuan Layanan Akademik IPB 2026</p>
                  <p className="text-[11px] text-gray-600">Baca ini sebelum membuat tiket. Berisi SOP terbaru.</p>
                </div>
                <Badge v="resolved">Resolved</Badge>
              </div>
              <div className="flex gap-3 text-[10px] text-gray-400">
                <span>Admin IPB</span><span>28 Feb</span><span>👁 1,204</span>
              </div>
            </div>

            <p className="text-[9px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Diskusi Terbaru</p>
            {filtered.map((d, i) => (
              <div key={i} onClick={() => navigate('/diskusi/detail')}
                className="bg-white rounded-lg border border-ipb-50 shadow-sm p-3.5 mb-2.5 cursor-pointer hover:shadow-md transition-all"
                style={{ borderLeft:`3px solid ${d.bc}` }}>
                <div className="flex items-start justify-between gap-2.5 mb-2">
                  <div className="flex-1">
                    <div className="flex gap-1.5 mb-1.5">
                      <span className="text-[9px] px-1.5 py-px rounded bg-ipb-50 text-ipb-600 font-medium">{d.cat}</span>
                      {d.tag && (
                        <span className={`text-[8px] font-bold px-1.5 py-px rounded-full ${d.answered ? 'bg-yellow-50 text-yellow-700' : 'bg-amber-100 text-amber-700'}`}>
                          {d.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] font-bold text-ipb-900 mb-0.5 leading-snug">{d.title}</p>
                    <p className="text-[11px] text-gray-600">{d.body}</p>
                  </div>
                  <Badge v={d.status === 'resolved' ? 'resolved' : 'open'}>
                    {d.status === 'resolved' ? 'Resolved' : 'Open'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-3 text-[10px] text-gray-400">
                    <span>{d.author}</span><span>{d.date}</span>
                    <span>💬 <strong className={d.replies > 0 ? 'text-ipb-500' : ''}>{d.replies}</strong></span>
                    <span>👁 {d.views}</span>
                  </div>
                  {d.answered && <span className="text-[9px] text-ipb-500 font-semibold">✓ Dijawab Staff</span>}
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center gap-1 mt-3.5">
              {['← Prev','1','2','3','Next →'].map((b, i) => (
                <Button key={i} variant={i === 1 ? 'primary' : 'ghost'} size="sm">{b}</Button>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="bg-white rounded-lg border border-ipb-50 shadow-sm p-5 mb-3">
              <h3 className="text-[13px] font-bold text-ipb-900 mb-2.5">🗂 Kategori</h3>
              {[['📋 Transkip',18],['📄 Surat Ket.',12],['💰 Beasiswa',9],['🎓 KRS',6]].map(([l,n],i) => (
                <button key={i} className="flex justify-between items-center px-2 py-1.5 bg-ipb-50 rounded-md text-[11px] cursor-pointer w-full border-none mb-1.5 hover:bg-ipb-100 transition-colors text-left">
                  <span>{l}</span>
                  <Badge v="progress">{n}</Badge>
                </button>
              ))}
            </div>

            <div className="bg-ipb-50 border border-ipb-200 rounded-lg p-5">
              <h3 className="text-[13px] font-bold text-ipb-600 mb-2">💡 Tips Diskusi</h3>
              {['Cek FAQ dulu sebelum diskusi','Cantumkan kategori yang relevan','Sertakan detail lengkap','Tandai Resolved jika terjawab'].map((t,i) => (
                <div key={i} className="text-[10px] text-ipb-700 mb-1.5">✅ {t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
