import React, { useState, useEffect } from 'react';
import { Send, Calendar, User, Users, FileText, Search, Clock, ChevronRight, ArrowLeft, MapPin, X, AlertTriangle } from 'lucide-react';
import { ReportData, UserProfile } from '../types';

interface ExtendedReportData extends ReportData {
    id: string;
    status: string;
}

interface ReportFormProps {
    user: UserProfile;
}

const ReportForm: React.FC<ReportFormProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<ExtendedReportData | null>(null);
  
  const [historyData, setHistoryData] = useState<ExtendedReportData[]>([]);

  // Load history from DB on mount or tab change
  useEffect(() => {
    try {
        const dbKey = 'gkps_reports_db';
        const reportsDb: ExtendedReportData[] = JSON.parse(localStorage.getItem(dbKey) || '[]');
        
        // Filter reports relevant to the current user (Sintua sees own, Admin sees all, Jemaat sees none usually but allowed here if role changes)
        // Assuming strictly Sintua for now based on context
        if (user.role === 'admin') {
            setHistoryData(reportsDb);
        } else {
            const myReports = reportsDb.filter(r => r.sintuaName === user.name);
            setHistoryData(myReports);
        }
    } catch (e) {
        console.error("Failed to load reports", e);
    }
  }, [user.name, user.role, activeTab]);

  // Form State
  const [formData, setFormData] = useState<ReportData>({
    sintuaName: user.name,
    hostFamily: '',
    date: new Date().toISOString().split('T')[0],
    attendance: { fathers: 0, mothers: 0, youth: 0, kids: 0 },
    prayerPoints: '',
    offering: '',
    topic: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new report object
    const newReport: ExtendedReportData = {
        ...formData,
        id: Date.now().toString(),
        status: 'Terkirim'
    };

    // Save to DB
    try {
        const dbKey = 'gkps_reports_db';
        const reportsDb: ExtendedReportData[] = JSON.parse(localStorage.getItem(dbKey) || '[]');
        reportsDb.push(newReport);
        localStorage.setItem(dbKey, JSON.stringify(reportsDb));
    } catch(e) {
        console.error("Failed to save report", e);
    }

    setSubmitted(true);
    setTimeout(() => {
        setSubmitted(false);
        setFormData({
            sintuaName: user.name,
            hostFamily: '',
            date: new Date().toISOString().split('T')[0],
            attendance: { fathers: 0, mothers: 0, youth: 0, kids: 0 },
            prayerPoints: '',
            offering: '',
            topic: '',
            notes: ''
        });
        setActiveTab('history'); // Redirect to history after submit
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const filteredHistory = historyData.filter(item => {
    const query = searchQuery.toLowerCase();
    const formattedDate = formatDate(item.date).toLowerCase(); 
    
    return (
        item.hostFamily.toLowerCase().includes(query) ||
        item.sintuaName.toLowerCase().includes(query) ||
        item.date.includes(query) ||
        formattedDate.includes(query)
    );
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort newest first

  // --- Sub-component: Detail View ---
  if (selectedReport) {
      const totalAttendance = (Object.values(selectedReport.attendance) as number[]).reduce((a, b) => a + b, 0);
      return (
        <div className="pb-24 pt-20 px-4 max-w-md mx-auto min-h-screen bg-gray-50">
            <div className="mb-4 flex items-center gap-2">
                <button onClick={() => setSelectedReport(null)} className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} className="text-gray-700"/>
                </button>
                <h2 className="text-xl font-bold text-gray-900">Detail Laporan</h2>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-gkps-primary p-4 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="opacity-80 text-xs mb-1">Tuan Rumah</p>
                            <h3 className="font-bold text-lg leading-tight">{selectedReport.hostFamily}</h3>
                        </div>
                        <div className="bg-white/20 px-2 py-1 rounded text-xs font-medium">
                            {formatDate(selectedReport.date)}
                        </div>
                    </div>
                </div>
                
                <div className="p-5 space-y-6">
                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                            <User size={14}/> Petugas Sintua
                        </h4>
                        <p className="text-gray-900 font-medium">{selectedReport.sintuaName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Total Kehadiran</p>
                            <p className="text-2xl font-bold text-gray-800">{totalAttendance} <span className="text-sm font-normal text-gray-500">Jiwa</span></p>
                        </div>
                        <div>
                             <p className="text-xs text-gray-500 mb-1">Total Galangan</p>
                             <p className="text-xl font-bold text-green-600">Rp {parseInt(selectedReport.offering).toLocaleString('id-ID')}</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Rincian Kehadiran</h4>
                        <div className="grid grid-cols-4 gap-2 text-center">
                            {[
                                {l:'Bapa', v: selectedReport.attendance.fathers},
                                {l:'Inang', v: selectedReport.attendance.mothers},
                                {l:'Naposo', v: selectedReport.attendance.youth},
                                {l:'S.Minggu', v: selectedReport.attendance.kids},
                            ].map((s, i) => (
                                <div key={i} className="bg-white border border-gray-100 p-2 rounded-lg shadow-sm">
                                    <span className="block text-lg font-bold text-gray-800">{s.v}</span>
                                    <span className="text-[10px] text-gray-400 uppercase font-medium">{s.l}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tema Renungan</h4>
                        <p className="text-gray-800 font-medium">{selectedReport.topic || '-'}</p>
                    </div>

                    <div>
                         <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Pokok Doa</h4>
                         <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-gray-700 italic">
                            "{selectedReport.prayerPoints || '-'}"
                         </div>
                    </div>

                    {selectedReport.notes && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Catatan Tambahan</h4>
                            <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg text-sm text-gray-600">
                                {selectedReport.notes}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      );
  }

  // --- Sub-component: Success View ---
  if (submitted) {
    return (
        <div className="pb-24 pt-20 px-4 max-w-md mx-auto h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 animate-bounce">
                <Send size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Laporan Terkirim!</h2>
            <p className="text-gray-500">Terima kasih Amang/Inang Sintua.</p>
        </div>
    )
  }

  return (
    <div className="pb-24 pt-20 px-4 max-w-md mx-auto">
      {/* Tabs */}
      <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
        <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'create' ? 'bg-white text-gkps-primary shadow-sm' : 'text-gray-500'}`}
            onClick={() => setActiveTab('create')}
        >
            Buat Laporan
        </button>
        <button 
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'history' ? 'bg-white text-gkps-primary shadow-sm' : 'text-gray-500'}`}
            onClick={() => setActiveTab('history')}
        >
            Riwayat Laporan
        </button>
      </div>

      {activeTab === 'create' ? (
        /* --- CREATE FORM VIEW --- */
        <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            
            {/* Warning if no families configured */}
            {user.role === 'sintua' && (!user.servedFamilies || user.servedFamilies.length === 0) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 items-start">
                    <AlertTriangle className="text-yellow-600 shrink-0" size={20} />
                    <div className="text-sm">
                        <p className="font-bold text-yellow-800">Daftar Keluarga Kosong</p>
                        <p className="text-yellow-700 mt-1">
                            Anda belum menambahkan daftar keluarga binaan. Silakan pergi ke menu <span className="font-bold">Akun</span> untuk menambahkan daftar keluarga agar muncul di pilihan di bawah.
                        </p>
                    </div>
                </div>
            )}

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <User size={18} className="text-gkps-primary"/> Data Umum
                </h3>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Nama Sintua</label>
                    <input 
                        type="text" 
                        value={formData.sintuaName}
                        readOnly
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-sm text-gray-700"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Keluarga Tuan Rumah</label>
                    <select 
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        value={formData.hostFamily}
                        onChange={e => setFormData({...formData, hostFamily: e.target.value})}
                        required
                    >
                        <option value="">Pilih Keluarga...</option>
                        {user.servedFamilies && user.servedFamilies.length > 0 ? (
                            user.servedFamilies.map((family, idx) => (
                                <option key={idx} value={family}>{family}</option>
                            ))
                        ) : (
                            <option value="" disabled>Belum ada data keluarga binaan</option>
                        )}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tanggal Pelaksanaan</label>
                    <input 
                        type="date"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                        value={formData.date}
                        onChange={e => setFormData({...formData, date: e.target.value})}
                        required
                    />
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <Users size={18} className="text-gkps-primary"/> Kehadiran (Jiwa)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { l: 'Bapa', k: 'fathers' }, 
                        { l: 'Inang', k: 'mothers' }, 
                        { l: 'Namaposo', k: 'youth' }, 
                        { l: 'Sek. Minggu', k: 'kids' }
                    ].map((item) => (
                        <div key={item.k}>
                            <label className="block text-xs text-gray-500 mb-1">{item.l}</label>
                            <input 
                                type="number" 
                                min="0"
                                className="w-full border border-gray-200 rounded-lg p-2 text-sm text-center"
                                placeholder="0"
                                onChange={e => setFormData({
                                    ...formData, 
                                    attendance: {...formData.attendance, [item.k]: parseInt(e.target.value) || 0}
                                })}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <FileText size={18} className="text-gkps-primary"/> Data Rohani
                </h3>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Tema Renungan</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm"
                        placeholder="Contoh: Pasu pasu na gokan dear"
                        value={formData.topic}
                        onChange={e => setFormData({...formData, topic: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Pokok Doa</label>
                    <textarea 
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-sm h-20"
                        placeholder="Tuliskan pokok doa..."
                        value={formData.prayerPoints}
                        onChange={e => setFormData({...formData, prayerPoints: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Galangan (Rp)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-gray-500 text-sm">Rp</span>
                        <input 
                            type="number" 
                            className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm"
                            placeholder="0"
                            value={formData.offering}
                            onChange={e => setFormData({...formData, offering: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <button 
                type="submit"
                className="w-full bg-gkps-primary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
                Kirim Laporan
            </button>
        </form>
      ) : (
        /* --- HISTORY LIST VIEW --- */
        <div className="animate-in fade-in slide-in-from-right-2">
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama keluarga, atau tanggal..." 
                    className="w-full bg-white border border-gray-200 text-gray-700 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-gkps-primary/10 transition-all shadow-sm"
                />
                {searchQuery && (
                    <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {filteredHistory.length > 0 ? (
                    filteredHistory.map((report) => (
                        <div 
                            key={report.id}
                            onClick={() => setSelectedReport(report)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-gkps-accent/30 active:scale-[0.99] transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                                    <Clock size={12} />
                                    <span>{formatDate(report.date)}</span>
                                </div>
                                <span className="bg-green-50 text-green-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                                    {report.status}
                                </span>
                            </div>
                            
                            <h4 className="font-bold text-gray-800 mb-1 group-hover:text-gkps-primary transition-colors">
                                {report.hostFamily}
                            </h4>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                                <div className="flex items-center gap-1">
                                    <User size={14} />
                                    <span className="truncate max-w-[100px]">{report.sintuaName.split(' ')[1] || report.sintuaName}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users size={14} />
                                    <span>{(Object.values(report.attendance) as number[]).reduce((a,b)=>a+b,0)} Jiwa</span>
                                </div>
                                <div className="ml-auto">
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gkps-primary" />
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-400">
                        <FileText size={48} className="mx-auto mb-2 opacity-20" />
                        <p>Tidak ada riwayat laporan</p>
                        <p className="text-xs mt-1">Laporan yang Anda kirim akan muncul di sini.</p>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;