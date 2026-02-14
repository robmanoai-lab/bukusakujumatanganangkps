import React, { useState, useEffect } from 'react';
import { User, Shield, Users, Plus, Trash2, Save, AlertCircle, CheckCircle2, KeyRound, ChevronRight, ChevronDown, Download, Upload, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { UserProfile, AppBackupData } from '../types';

interface ProfileProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  // Family Management
  const [newFamily, setNewFamily] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [allRegisteredUsers, setAllRegisteredUsers] = useState<UserProfile[]>([]);

  // Password Management
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passData, setPassData] = useState({
      current: '',
      new: '',
      confirm: ''
  });
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [showPass, setShowPass] = useState({
      current: false,
      new: false,
      confirm: false
  });

  // Data Sync Management
  const [showSync, setShowSync] = useState(false);
  const [importDataString, setImportDataString] = useState('');
  const [syncStatus, setSyncStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);

  // Load all users to check registration status
  useEffect(() => {
    try {
        const dbKey = 'gkps_users_db';
        const usersDb = JSON.parse(localStorage.getItem(dbKey) || '[]');
        setAllRegisteredUsers(usersDb);
    } catch (e) {
        console.error("Failed to load users for status check");
    }
  }, []);

  // --- Family Functions ---
  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!newFamily.trim()) return;

    const currentFamilies = user.servedFamilies || [];
    
    if (currentFamilies.length >= 5) {
      setError('Maksimal 5 keluarga binaan.');
      return;
    }

    if (currentFamilies.includes(newFamily.trim())) {
      setError('Nama keluarga sudah ada dalam daftar.');
      return;
    }

    const updatedFamilies = [...currentFamilies, newFamily.trim()];
    const updatedUser = { ...user, servedFamilies: updatedFamilies };
    
    onUpdateUser(updatedUser);
    setNewFamily('');
    setSuccessMsg('Keluarga berhasil ditambahkan.');
    
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleRemoveFamily = (familyToRemove: string) => {
    const currentFamilies = user.servedFamilies || [];
    const updatedFamilies = currentFamilies.filter(f => f !== familyToRemove);
    const updatedUser = { ...user, servedFamilies: updatedFamilies };
    onUpdateUser(updatedUser);
  };

  const isFamilyRegistered = (familyName: string) => {
    return allRegisteredUsers.some(u => u.name.trim().toLowerCase() === familyName.trim().toLowerCase());
  };

  // --- Password Functions ---
  const handleChangePassword = (e: React.FormEvent) => {
      e.preventDefault();
      setPassError('');
      setPassSuccess('');

      if (passData.current !== user.password) {
          setPassError('Password lama salah.');
          return;
      }
      
      if (passData.new.length < 6) {
          setPassError('Password baru minimal 6 karakter.');
          return;
      }

      if (passData.new !== passData.confirm) {
          setPassError('Konfirmasi password tidak cocok.');
          return;
      }

      const updatedUser = { ...user, password: passData.new };
      onUpdateUser(updatedUser);
      setPassSuccess('Password berhasil diubah!');
      setPassData({ current: '', new: '', confirm: '' });
      setTimeout(() => setPassSuccess(''), 3000);
  };

  // --- Sync (Export/Import) Functions ---
  const handleExportData = () => {
    try {
        const backupData: AppBackupData = {
            users: JSON.parse(localStorage.getItem('gkps_users_db') || '[]'),
            reports: JSON.parse(localStorage.getItem('gkps_reports_db') || '[]'),
            chats: JSON.parse(localStorage.getItem('gkps_chats_db') || '{}'),
            timestamp: Date.now()
        };
        
        const dataString = JSON.stringify(backupData);
        navigator.clipboard.writeText(dataString).then(() => {
            setSyncStatus({ type: 'success', msg: 'Data berhasil disalin ke Clipboard! Kirim kode ini ke HP Anda.' });
        }).catch(() => {
             setSyncStatus({ type: 'success', msg: 'Gagal auto-copy. Silakan salin teks manual jika muncul.' });
        });
    } catch (e) {
        setSyncStatus({ type: 'error', msg: 'Gagal mengambil data.' });
    }
  };

  const handleImportData = () => {
    if (!importDataString.trim()) {
        setSyncStatus({ type: 'error', msg: 'Tempel kode data terlebih dahulu.' });
        return;
    }

    try {
        const data: AppBackupData = JSON.parse(importDataString);
        
        // Basic validation
        if (!Array.isArray(data.users)) throw new Error("Format data salah");

        if (window.confirm('PERINGATAN: Import akan menimpa data yang ada di perangkat ini. Lanjutkan?')) {
            localStorage.setItem('gkps_users_db', JSON.stringify(data.users));
            localStorage.setItem('gkps_reports_db', JSON.stringify(data.reports));
            localStorage.setItem('gkps_chats_db', JSON.stringify(data.chats));
            
            // Perbarui user session jika user yang login ikut terupdate
            const updatedCurrentUser = data.users.find(u => u.name === user.name);
            if (updatedCurrentUser) {
                localStorage.setItem('gkps_user', JSON.stringify(updatedCurrentUser));
            }

            setSyncStatus({ type: 'success', msg: 'Data berhasil di-import! Halaman akan dimuat ulang...' });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    } catch (e) {
        setSyncStatus({ type: 'error', msg: 'Format data tidak valid.' });
    }
  };

  return (
    <div className="pb-24 pt-20 px-4 max-w-md mx-auto animate-in fade-in duration-300">
      
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-gkps-primary ring-4 ring-blue-50">
          <User size={32} strokeWidth={2} />
        </div>
        <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
        <p className="text-sm text-gray-500">{user.sector}</p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-gkps-primary/10 text-gkps-primary rounded-full text-xs font-bold uppercase">
          <Shield size={12} />
          {user.role}
        </div>
      </div>

      {/* Bagian Khusus Sintua: Kelola Keluarga */}
      {user.role === 'sintua' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Users size={18} className="text-gkps-primary" />
              Keluarga Binaan
            </h3>
            <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-md text-gray-500">
              {(user.servedFamilies || []).length} / 5
            </span>
          </div>

          <div className="p-5">
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              Tambahkan daftar keluarga yang menjadi tanggung jawab pelayanan Jumatanganan Anda.
            </p>

            {/* Input Tambah */}
            <form onSubmit={handleAddFamily} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFamily}
                  onChange={(e) => setNewFamily(e.target.value)}
                  placeholder="Contoh: Kel. Bp. Damanik"
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 focus:border-gkps-primary outline-none"
                />
                <button
                  type="submit"
                  disabled={!newFamily.trim() || (user.servedFamilies || []).length >= 5}
                  className="bg-gkps-primary disabled:bg-gray-300 text-white p-2.5 rounded-xl transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-2 ml-1 flex items-center gap-1"><AlertCircle size={12}/> {error}</p>}
              {successMsg && <p className="text-green-500 text-xs mt-2 ml-1">{successMsg}</p>}
            </form>

            {/* Daftar Keluarga */}
            <div className="space-y-2">
              {user.servedFamilies && user.servedFamilies.length > 0 ? (
                user.servedFamilies.map((family, index) => {
                  const registered = isFamilyRegistered(family);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl shadow-sm group">
                        <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${registered ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-gkps-primary'}`}>
                            {registered ? <CheckCircle2 size={16} /> : index + 1}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">{family}</span>
                            {registered && <span className="text-[10px] text-green-600 font-bold">Terdaftar • Aktif</span>}
                        </div>
                        </div>
                        <button 
                        onClick={() => handleRemoveFamily(family)}
                        className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                        >
                        <Trash2 size={16} />
                        </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl bg-gray-50/50">
                  <p className="text-sm text-gray-400">Belum ada keluarga terdaftar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bagian Sinkronisasi Data Manual */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div 
            onClick={() => setShowSync(!showSync)}
            className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <RefreshCw size={18} className="text-blue-500" />
              Sinkronisasi Data
            </h3>
             {showSync ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
          </div>

          {showSync && (
              <div className="p-5 animate-in slide-in-from-top-2">
                  <p className="text-xs text-gray-500 mb-4 leading-relaxed bg-blue-50 p-3 rounded-lg border border-blue-100">
                      Gunakan fitur ini untuk memindahkan data dari Laptop ke HP (atau sebaliknya).
                      <br/><strong>Caranya:</strong> Klik "Salin Data" di Laptop, kirim kodenya ke HP (via WA), lalu "Tempel Data" di HP.
                  </p>
                  
                  {syncStatus && (
                      <div className={`mb-4 p-3 rounded-xl flex items-start gap-2 text-xs font-medium ${syncStatus.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                          {syncStatus.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                          <span>{syncStatus.msg}</span>
                      </div>
                  )}

                  <div className="space-y-4">
                      {/* Export */}
                      <div className="border border-gray-200 rounded-xl p-4">
                          <h4 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                              <Upload size={16} /> Sumber Data (Laptop)
                          </h4>
                          <button 
                            onClick={handleExportData}
                            className="w-full flex items-center justify-center gap-2 bg-gray-800 text-white py-2.5 rounded-lg text-sm font-medium active:scale-95 transition-all"
                          >
                              <Copy size={16} /> Salin Semua Data
                          </button>
                      </div>

                      {/* Import */}
                      <div className="border border-gray-200 rounded-xl p-4">
                          <h4 className="font-bold text-gray-700 text-sm mb-2 flex items-center gap-2">
                              <Download size={16} /> Tujuan Data (HP)
                          </h4>
                          <textarea
                            value={importDataString}
                            onChange={(e) => setImportDataString(e.target.value)}
                            placeholder="Tempel kode data di sini..."
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs h-20 mb-2 focus:ring-2 focus:ring-blue-100 outline-none"
                          />
                          <button 
                            onClick={handleImportData}
                            className="w-full flex items-center justify-center gap-2 bg-gkps-primary text-white py-2.5 rounded-lg text-sm font-medium active:scale-95 transition-all"
                          >
                              <Download size={16} /> Import & Update
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div>

      {/* Bagian Keamanan (Ganti Password) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div 
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <KeyRound size={18} className="text-orange-500" />
              Keamanan Akun
            </h3>
             {showPasswordForm ? <ChevronDown size={20} className="text-gray-400" /> : <ChevronRight size={20} className="text-gray-400" />}
          </div>

          {showPasswordForm && (
              <form onSubmit={handleChangePassword} className="p-5 space-y-4 animate-in slide-in-from-top-2">
                  {passError && <p className="text-red-500 text-xs flex items-center gap-1 bg-red-50 p-2 rounded-lg"><AlertCircle size={12}/> {passError}</p>}
                  {passSuccess && <p className="text-green-600 text-xs flex items-center gap-1 bg-green-50 p-2 rounded-lg"><CheckCircle2 size={12}/> {passSuccess}</p>}
                  
                  <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Password Saat Ini</label>
                      <div className="relative">
                          <input 
                              type={showPass.current ? "text" : "password"}
                              value={passData.current}
                              onChange={e => setPassData({...passData, current: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 outline-none"
                              required
                          />
                           <button type="button" onClick={() => setShowPass({...showPass, current: !showPass.current})} className="absolute right-3 top-2.5 text-gray-400">
                               {showPass.current ? <EyeOff size={16}/> : <Eye size={16}/>}
                           </button>
                      </div>
                  </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Password Baru</label>
                      <div className="relative">
                          <input 
                              type={showPass.new ? "text" : "password"}
                              value={passData.new}
                              onChange={e => setPassData({...passData, new: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 outline-none"
                              placeholder="Minimal 6 karakter"
                              required
                          />
                          <button type="button" onClick={() => setShowPass({...showPass, new: !showPass.new})} className="absolute right-3 top-2.5 text-gray-400">
                               {showPass.new ? <EyeOff size={16}/> : <Eye size={16}/>}
                           </button>
                      </div>
                  </div>
                   <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Konfirmasi Password Baru</label>
                      <div className="relative">
                          <input 
                              type={showPass.confirm ? "text" : "password"}
                              value={passData.confirm}
                              onChange={e => setPassData({...passData, confirm: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 outline-none"
                              required
                          />
                          <button type="button" onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})} className="absolute right-3 top-2.5 text-gray-400">
                               {showPass.confirm ? <EyeOff size={16}/> : <Eye size={16}/>}
                           </button>
                      </div>
                  </div>

                  <button 
                      type="submit" 
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                  >
                      <Save size={18} /> Simpan Password Baru
                  </button>
              </form>
          )}
      </div>

      {/* Info Tambahan */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">Versi Aplikasi 1.0.4 (Offline Sync)</p>
      </div>
    </div>
  );
};

export default Profile;