import React, { useEffect, useState } from 'react';
import { Calendar, Users, FileText, ClipboardList, ArrowRight, Star, Heart, UserCheck, Plus } from 'lucide-react';
import { ViewState, UserProfile } from '../types';

interface DashboardProps {
    onChangeView: (view: ViewState) => void;
    user: UserProfile;
}

const Dashboard: React.FC<DashboardProps> = ({ onChangeView, user }) => {
  const [servingSintua, setServingSintua] = useState<UserProfile | null>(null);
  const [myCircle, setMyCircle] = useState<string[]>([]);

  // Logic untuk mencari Relasi (Sintua & Circle) berdasarkan nama User yang login
  useEffect(() => {
    if (user.role === 'jemaat') {
        try {
            const dbKey = 'gkps_users_db';
            const usersDb: UserProfile[] = JSON.parse(localStorage.getItem(dbKey) || '[]');
            
            // Cari Sintua yang memiliki nama user ini di daftar servedFamilies-nya
            // Menggunakan toLowerCase untuk pencarian yang tidak case-sensitive
            const foundSintua = usersDb.find(u => 
                u.role === 'sintua' && 
                u.servedFamilies?.some(family => family.trim().toLowerCase() === user.name.trim().toLowerCase())
            );

            if (foundSintua) {
                setServingSintua(foundSintua);
                // Circle adalah semua keluarga yang dilayani sintua tersebut, KECUALI diri sendiri
                const circle = foundSintua.servedFamilies?.filter(
                    f => f.trim().toLowerCase() !== user.name.trim().toLowerCase()
                ) || [];
                setMyCircle(circle);
            }
        } catch (error) {
            console.error("Error finding relations", error);
        }
    }
  }, [user]);

  return (
    <div className="space-y-6 pb-24 pt-20 px-4 max-w-md mx-auto animate-in fade-in duration-500">
      
      {/* Hero / Welcome Card */}
      <div className="bg-gradient-to-bl from-blue-600 via-gkps-primary to-indigo-900 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-blue-100 text-sm font-medium mb-1">
                        Selamat Datang, {user.role === 'sintua' ? 'Amang/Inang' : 'Saudara'}
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight truncate max-w-[200px]">
                        {user.role === 'sintua' && !user.name.toLowerCase().startsWith('st') ? `St. ${user.name}` : user.name}
                    </h2>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                    <Star className="text-yellow-400 fill-yellow-400" size={20} />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-black/20 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
                    <p className="text-xs text-blue-200 mb-1">Sektor Pelayanan</p>
                    <p className="font-bold">{user.sector}</p>
                </div>
                <div className="bg-black/20 backdrop-blur-sm px-4 py-3 rounded-2xl border border-white/10">
                    <p className="text-xs text-blue-200 mb-1">Status</p>
                    <p className="font-bold capitalize">{user.role}</p>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION KHUSUS SINTUA: DAFTAR KELUARGA BINAAN */}
      {user.role === 'sintua' && (
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                    <Users size={18} className="text-gkps-primary" />
                    Keluarga Binaan
                </h3>
                <button 
                    onClick={() => onChangeView('profile')}
                    className="text-gkps-primary text-xs font-bold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md hover:bg-blue-100 flex items-center gap-1"
                >
                   {(user.servedFamilies?.length || 0)} / 5
                   <span className="ml-1">Kelola</span>
                </button>
            </div>
            
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative overflow-hidden">
                 {user.servedFamilies && user.servedFamilies.length > 0 ? (
                    <div className="space-y-3">
                        {user.servedFamilies.map((family, idx) => (
                            <div key={idx} className="flex items-center gap-3 pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-gkps-primary flex items-center justify-center font-bold text-xs">
                                    {idx + 1}
                                </div>
                                <span className="text-sm font-medium text-gray-700">{family}</span>
                            </div>
                        ))}
                    </div>
                 ) : (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-400 mb-3">Belum ada keluarga yang ditambahkan.</p>
                        <button 
                            onClick={() => onChangeView('profile')}
                            className="bg-gkps-primary text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-100 inline-flex items-center gap-2"
                        >
                            <Plus size={16} /> Tambah Keluarga
                        </button>
                    </div>
                 )}
            </div>
        </div>
      )}

      {/* SECTION KHUSUS JEMAAT: MENAMPILKAN SINTUA & CIRCLE */}
      {user.role === 'jemaat' && servingSintua && (
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-100">
            <h3 className="font-bold text-gray-800 text-lg mb-3 px-1 flex items-center gap-2">
                <Heart size={18} className="text-red-500 fill-red-500" />
                Komunitas Jumatanganan
            </h3>
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>
                
                {/* Info Sintua */}
                <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-gkps-primary ring-4 ring-blue-50">
                        <UserCheck size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Sintua Pembina</p>
                        <p className="font-bold text-gray-800 text-lg">{servingSintua.name}</p>
                    </div>
                </div>

                {/* Info Circle */}
                {myCircle.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 font-bold mb-3 flex items-center gap-1">
                            <Users size={12} />
                            REKAN SATU CIRCLE ({myCircle.length})
                        </p>
                        <div className="space-y-2">
                            {myCircle.map((friend, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                    {friend}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Next Schedule */}
      <div className="relative">
        <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-bold text-gray-800 text-lg">Jadwal Terdekat</h3>
            <button className="text-gkps-primary text-xs font-bold uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">Lihat Semua</button>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 flex items-center gap-4 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gkps-accent"></div>
            <div className="bg-blue-50 min-w-[64px] h-[64px] rounded-xl flex flex-col items-center justify-center text-gkps-primary border border-blue-100">
                <span className="text-[10px] font-bold uppercase tracking-wide">Jumat</span>
                <span className="text-2xl font-black leading-none">27</span>
                <span className="text-[10px] font-medium">Juni</span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 truncate">Partonggoan {user.sector}</h4>
                <p className="text-sm text-gray-500 mt-1 truncate">Rumah Kel. Bp. Siboan Damei</p>
                <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                        <Calendar size={12} />
                        <span>19:30 WIB</span>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 p-2 rounded-full text-gray-300">
                <ArrowRight size={20} />
            </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
          <h3 className="font-bold text-gray-800 text-lg mb-3 px-1">Menu Cepat</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
                onClick={() => onChangeView('report')}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all group hover:border-blue-200 hover:shadow-md"
            >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3 group-hover:scale-110 transition-transform">
                    <FileText size={24} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-gray-800">Buat Laporan</span>
                    <span className="text-xs text-gray-400">Mingguan</span>
                </div>
            </button>
            <button 
                onClick={() => onChangeView('report')}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:scale-95 transition-all group hover:border-orange-200 hover:shadow-md"
            >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                    <ClipboardList size={24} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                    <span className="block font-bold text-gray-800">Riwayat</span>
                    <span className="text-xs text-gray-400">Arsip Laporan</span>
                </div>
            </button>
            <button 
                onClick={() => onChangeView('guide')}
                className="col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-2xl shadow-lg text-white active:scale-95 transition-all flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm">
                        <Users size={20} />
                    </div>
                    <div className="text-left">
                        <span className="block font-bold">Panduan Ibadah</span>
                        <span className="text-xs text-gray-300">Liturgi & Tata Cara</span>
                    </div>
                </div>
                <div className="bg-white/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
                    <ArrowRight size={18} />
                </div>
            </button>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;