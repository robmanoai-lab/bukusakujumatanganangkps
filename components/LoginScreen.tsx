
import React, { useState, useEffect } from 'react';
import { LogIn, UserPlus, User, MapPin, Lock, AlertCircle, ShieldAlert, Mail, ArrowLeft, CheckCircle, Send, Users, Eye, EyeOff, KeyRound, Download, Database, CheckCircle2 } from 'lucide-react';
import { UserProfile, AppBackupData } from '../types';
import { SECTORS } from '../constants';

interface LoginScreenProps {
  onLogin: (user: UserProfile) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  // View State: 'main' | 'forgot-password' | 'import-data'
  const [viewMode, setViewMode] = useState<'main' | 'forgot-password' | 'import-data'>('main');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Form States
  const [name, setName] = useState('');
  const [sector, setSector] = useState(SECTORS[0]);
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'jemaat' | 'sintua' | 'admin'>('jemaat');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);

  // New State for Family Linking
  const [availableFamilies, setAvailableFamilies] = useState<string[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<string>('');

  // Forgot Password States
  const [resetName, setResetName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tempResetPass, setTempResetPass] = useState('');

  // Import Data States
  const [importString, setImportString] = useState('');

  // Seed Default Admin & Clear error when switching modes
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setPassword('');
    setResetSuccess(false);
    setTempResetPass('');
    setImportString('');
    
    // SEEDING: Cek apakah database kosong/tidak ada admin, jika ya buat admin default
    const dbKey = 'gkps_users_db';
    const existingUsersStr = localStorage.getItem(dbKey);
    let existingUsers: UserProfile[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
    
    const hasAdmin = existingUsers.some(u => u.role === 'admin');
    
    if (!hasAdmin) {
        const defaultAdmin: UserProfile = {
            name: 'admin',
            password: 'admin123',
            role: 'admin',
            sector: 'Pusat',
            mustChangePassword: false
        };
        existingUsers.push(defaultAdmin);
        localStorage.setItem(dbKey, JSON.stringify(existingUsers));
        console.log("Default Admin Created: admin / admin123");
    }

  }, [isRegister, viewMode]);

  // Logic to populate "Available Families" dropdown based on selected Sector
  useEffect(() => {
    if (isRegister && role === 'jemaat') {
        try {
            const dbKey = 'gkps_users_db';
            const usersDb: UserProfile[] = JSON.parse(localStorage.getItem(dbKey) || '[]');
            
            // 1. Cari semua Sintua di sektor yang dipilih
            const sintuasInSector = usersDb.filter(u => u.role === 'sintua' && u.sector === sector);
            
            // 2. Kumpulkan semua nama keluarga yang dilayani
            const allListedFamilies = sintuasInSector.flatMap(s => s.servedFamilies || []);
            
            // 3. Filter keluarga yang SUDAH punya akun (agar tidak double claim)
            //    Kita cek apakah nama keluarga tersebut sudah ada di daftar user
            const unregisteredFamilies = allListedFamilies.filter(family => 
                !usersDb.some(u => u.name.trim().toLowerCase() === family.trim().toLowerCase())
            );

            // Hilangkan duplikat jika ada
            const uniqueFamilies = [...new Set(unregisteredFamilies)].sort();

            setAvailableFamilies(uniqueFamilies);
            setSelectedFamily(''); // Reset selection when sector changes
            
            // Jika user memilih manual sebelumnya, biarkan name tetap ada, jika tidak reset
            if (selectedFamily !== 'manual') {
                 // Optional: don't clear name immediately to allow switching sectors without losing typed name if manual
            }
        } catch (e) {
            console.error("Error loading families", e);
        }
    } else {
        setAvailableFamilies([]);
    }
  }, [isRegister, role, sector, viewMode]); // Added viewMode to refresh list after import

  // Handle selection from dropdown
  const handleFamilySelection = (val: string) => {
      setSelectedFamily(val);
      if (val !== 'manual' && val !== '') {
          setName(val); // Auto-fill name
      } else {
          setName(''); // Clear name for manual entry
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !password.trim()) {
        setError('Nama dan Password wajib diisi.');
        return;
    }

    setLoading(true);
    
    // Simulasi delay network
    setTimeout(() => {
      const dbKey = 'gkps_users_db';
      const existingUsersStr = localStorage.getItem(dbKey);
      const existingUsers: UserProfile[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];

      if (isRegister) {
        // --- LOGIC PENDAFTARAN ---
        
        // 1. Cek duplikasi user
        const userExists = existingUsers.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
        
        if (userExists) {
            setLoading(false);
            setError('Nama pengguna sudah terdaftar. Silakan login.');
            return;
        }

        // 2. Buat user baru
        const selectedRole = role === 'admin' ? 'jemaat' : role; 

        const newUser: UserProfile = {
            name: name.trim(),
            sector: sector,
            role: selectedRole,
            password: password, 
            servedFamilies: selectedRole === 'sintua' ? [] : undefined,
            mustChangePassword: false 
        };

        // 3. Simpan ke "Database"
        existingUsers.push(newUser);
        localStorage.setItem(dbKey, JSON.stringify(existingUsers));
        
        // 4. Login otomatis
        onLogin(newUser);

      } else {
        // --- LOGIC LOGIN ---

        // 1. Cari user berdasarkan nama
        const foundUser = existingUsers.find(u => u.name.toLowerCase() === name.trim().toLowerCase());

        if (!foundUser) {
            setLoading(false);
            setError('Akun belum terdaftar. Silakan daftar terlebih dahulu.');
            return;
        }

        // 2. Validasi Password
        if (foundUser.password !== password) {
            setLoading(false);
            setError('Password salah.');
            return;
        }

        // 3. Validasi Sektor (Admin bypass sektor check)
        if (foundUser.role !== 'admin' && foundUser.sector !== sector) {
            setLoading(false);
            setError(`Data tidak cocok. ${foundUser.name} terdaftar di ${foundUser.sector}, bukan ${sector}.`);
            return;
        }

        // 4. Sukses
        onLogin(foundUser);
      }
      
      setLoading(false);
    }, 1000);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTempResetPass('');
    
    if (!resetName.trim() || !resetEmail.trim()) {
        setError('Mohon lengkapi data.');
        return;
    }

    setLoading(true);

    setTimeout(() => {
        const dbKey = 'gkps_users_db';
        const existingUsersStr = localStorage.getItem(dbKey);
        const existingUsers: UserProfile[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
        
        const userIndex = existingUsers.findIndex(u => u.name.toLowerCase() === resetName.trim().toLowerCase());

        if (userIndex !== -1) {
            const tempPass = `gkps${Math.floor(1000 + Math.random() * 9000)}`;
            existingUsers[userIndex] = {
                ...existingUsers[userIndex],
                password: tempPass,
                mustChangePassword: true 
            };
            localStorage.setItem(dbKey, JSON.stringify(existingUsers));
            setTempResetPass(tempPass);
            setResetSuccess(true);
        } else {
            setError('Nama pengguna tidak ditemukan dalam database.');
        }
        setLoading(false);
    }, 1500);
  };

  const handleImportData = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if(!importString.trim()) {
        setError("Tempel kode data terlebih dahulu.");
        return;
    }

    try {
        const data: AppBackupData = JSON.parse(importString);
        
        // Basic validation
        if (!Array.isArray(data.users)) throw new Error("Format data salah");

        localStorage.setItem('gkps_users_db', JSON.stringify(data.users));
        localStorage.setItem('gkps_reports_db', JSON.stringify(data.reports));
        localStorage.setItem('gkps_chats_db', JSON.stringify(data.chats));

        setSuccessMsg("Data berhasil dipulihkan! Anda sekarang bisa login atau mendaftar dengan data terbaru.");
        
        // Delay redirect back to main
        setTimeout(() => {
             setViewMode('main');
        }, 2000);

    } catch (e) {
        setError("Kode data tidak valid. Pastikan Anda menyalin seluruh teks dari perangkat Laptop.");
    }
  };

  return (
    <div className="min-h-screen bg-gkps-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-20 -mt-20 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gkps-accent opacity-10 rounded-full -mr-20 -mb-20 blur-3xl"></div>

      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in duration-300">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gkps-primary text-white rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-200 mb-4">
            GKPS
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {viewMode === 'forgot-password' ? 'Reset Password' : (viewMode === 'import-data' ? 'Pulihkan Data' : (isRegister ? 'Daftar Akun' : 'Selamat Datang'))}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {viewMode === 'forgot-password' 
                ? 'Pulihkan akses akun Anda' 
                : (viewMode === 'import-data' ? 'Sinkronisasi data dari Laptop' 
                : (isRegister ? 'Buat akun untuk akses aplikasi' : 'Masuk dengan akun terdaftar'))
            }
          </p>
        </div>

        {/* --- MAIN LOGIN / REGISTER VIEW --- */}
        {viewMode === 'main' && (
            <>
                {/* Toggle Tabs */}
                <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
                    <button 
                        onClick={() => setIsRegister(false)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${!isRegister ? 'bg-white text-gkps-primary shadow-sm' : 'text-gray-500'}`}
                    >
                        Masuk
                    </button>
                    <button 
                        onClick={() => setIsRegister(true)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${isRegister ? 'bg-white text-gkps-primary shadow-sm' : 'text-gray-500'}`}
                    >
                        Daftar Baru
                    </button>
                </div>

                {successMsg && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-start gap-2 text-green-600 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                        <span>{successMsg}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                
                {isRegister && (
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1">PERAN</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                type="button"
                                onClick={() => setRole('jemaat')}
                                className={`py-2 px-3 text-sm font-bold rounded-lg border transition-all ${role === 'jemaat' ? 'bg-blue-50 border-gkps-primary text-gkps-primary' : 'border-gray-200 text-gray-500'}`}
                            >
                                Jemaat
                            </button>
                            <button 
                                type="button"
                                onClick={() => setRole('sintua')}
                                className={`py-2 px-3 text-sm font-bold rounded-lg border transition-all ${role === 'sintua' ? 'bg-blue-50 border-gkps-primary text-gkps-primary' : 'border-gray-200 text-gray-500'}`}
                            >
                                Sintua
                            </button>
                        </div>
                    </div>
                )}

                {/* Sektor Dropdown */}
                {(!isRegister || role !== 'admin') && (
                    <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1 flex items-center gap-1">
                        <MapPin size={12}/> SEKTOR
                    </label>
                    <select 
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gkps-primary/20 focus:border-gkps-primary outline-none transition-all"
                    >
                        {SECTORS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                        {!isRegister && <option value="Pusat">Pusat (Admin)</option>}
                    </select>
                    </div>
                )}

                {/* Family Selection Logic (Registration Only) */}
                {isRegister && role === 'jemaat' && (
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <label className="block text-xs font-bold text-blue-800 mb-2 flex items-center gap-1">
                            <Users size={12}/> TAUTKAN DENGAN SINTUA
                        </label>
                        <select
                            value={selectedFamily}
                            onChange={(e) => handleFamilySelection(e.target.value)}
                            className="w-full bg-white border border-blue-200 text-blue-900 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                        >
                            <option value="">-- Cari Nama Keluarga Anda --</option>
                            {availableFamilies.length > 0 ? (
                                availableFamilies.map((fam, idx) => (
                                    <option key={idx} value={fam}>{fam}</option>
                                ))
                            ) : (
                                <option value="" disabled>Tidak ada data (Coba 'Pulihkan Data' jika baru ditambahkan)</option>
                            )}
                            <option value="manual">+ Ketik Nama Baru (Manual)</option>
                        </select>
                        <p className="text-[10px] text-blue-600 mt-1.5 leading-tight">
                            Pilih nama keluarga yang sudah didaftarkan Sintua agar otomatis terhubung. 
                        </p>
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1 flex items-center gap-1">
                        <User size={12}/> NAMA LENGKAP
                    </label>
                    <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedFamily && selectedFamily !== 'manual' ? "Terisi Otomatis" : "Contoh: Jhon Saragih"}
                    readOnly={isRegister && selectedFamily !== '' && selectedFamily !== 'manual'}
                    className={`w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gkps-primary/20 focus:border-gkps-primary outline-none transition-all ${
                        isRegister && selectedFamily !== '' && selectedFamily !== 'manual' 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : 'bg-gray-50'
                    }`}
                    required
                    />
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1 flex items-center gap-1">
                        <Lock size={12}/> PASSWORD
                    </label>
                    <div className="relative">
                        <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={!isRegister ? "Masukan Password" : "Buat password"}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-gkps-primary/20 focus:border-gkps-primary outline-none transition-all"
                        required
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-between items-center mt-2">
                    {/* BUTTON IMPORT DATA */}
                    <button 
                        type="button"
                        onClick={() => setViewMode('import-data')}
                        className="text-[11px] font-bold text-gray-400 hover:text-gkps-primary flex items-center gap-1 transition-colors"
                    >
                        <Database size={12} /> Pulihkan Data (Sync)
                    </button>

                    {/* FORGOT PASSWORD LINK */}
                    {!isRegister && (
                        <button 
                            type="button"
                            onClick={() => setViewMode('forgot-password')}
                            className="text-xs font-medium text-gkps-primary hover:text-blue-700 hover:underline transition-all"
                        >
                            Lupa Password?
                        </button>
                    )}
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gkps-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                >
                    {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                    <>
                        <span>{isRegister ? 'Daftar Sekarang' : 'Masuk Aplikasi'}</span>
                        {isRegister ? <UserPlus size={18} /> : <LogIn size={18} />}
                    </>
                    )}
                </button>
                </form>
            </>
        )}

        {/* --- IMPORT DATA VIEW --- */}
        {viewMode === 'import-data' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-xs font-medium">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}
                
                {successMsg && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-xl flex items-start gap-2 text-green-600 text-xs font-medium">
                        <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                        <span>{successMsg}</span>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs text-blue-800 leading-relaxed">
                            Jika Anda baru saja ditambahkan oleh Sintua di Laptop, <strong>Salin</strong> data dari Laptop (Menu Akun) dan <strong>Tempel</strong> di sini agar nama Anda muncul saat mendaftar.
                        </p>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1 flex items-center gap-1">
                            KODE DATA DARI LAPTOP
                        </label>
                        <textarea 
                            value={importString}
                            onChange={(e) => setImportString(e.target.value)}
                            placeholder='Tempel kode panjang di sini...'
                            className="w-full h-32 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-2 focus:ring-gkps-primary/20 focus:border-gkps-primary outline-none transition-all resize-none"
                        />
                    </div>

                    <button 
                        type="button" 
                        onClick={handleImportData}
                        className="w-full bg-gkps-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        <Download size={18} />
                        <span>Import / Pulihkan Data</span>
                    </button>

                    <button 
                        type="button"
                        onClick={() => {
                            setViewMode('main');
                            setError('');
                            setSuccessMsg('');
                        }}
                        className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium py-2 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Kembali
                    </button>
                </div>
            </div>
        )}

        {/* --- FORGOT PASSWORD VIEW --- */}
        {viewMode === 'forgot-password' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                {!resetSuccess ? (
                    <>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-xs font-medium">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1 flex items-center gap-1">
                                    <User size={12}/> NAMA LENGKAP
                                </label>
                                <input 
                                    type="text" 
                                    value={resetName}
                                    onChange={(e) => setResetName(e.target.value)}
                                    placeholder="Masukkan nama terdaftar"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gkps-primary/20 focus:border-gkps-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2 ml-1 flex items-center gap-1">
                                    <Mail size={12}/> EMAIL
                                </label>
                                <input 
                                    type="email" 
                                    value={resetEmail}
                                    onChange={(e) => setResetEmail(e.target.value)}
                                    placeholder="email@contoh.com"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gkps-primary/20 focus:border-gkps-primary outline-none transition-all"
                                    required
                                />
                                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-[10px] text-blue-700 leading-relaxed mt-2 flex gap-2">
                                    <ShieldAlert size={16} className="shrink-0" />
                                    <span>
                                        Karena aplikasi ini belum memiliki server email, password sementara akan <b>ditampilkan di layar</b> setelah verifikasi berhasil.
                                    </span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full bg-gkps-primary hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Reset Password</span>
                                        <KeyRound size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-6 animate-in zoom-in-95 duration-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Simulasi Email Sukses</h3>
                        
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left mb-6">
                            <p className="text-xs text-gray-500 mb-1">Dari: admin@gkps.or.id</p>
                            <p className="text-xs text-gray-500 mb-3">Subjek: Reset Password</p>
                            <hr className="border-gray-200 mb-3"/>
                            <p className="text-sm text-gray-800 mb-2">Password sementara Anda adalah:</p>
                            <div className="bg-white border border-gray-300 rounded-lg p-3 text-center">
                                <span className="text-xl font-mono font-bold tracking-widest text-gkps-primary select-all">
                                    {tempResetPass}
                                </span>
                            </div>
                            <p className="text-[10px] text-orange-600 mt-2">
                                *Silakan copy password ini untuk login. Anda akan diminta mengganti password baru setelah masuk.
                            </p>
                        </div>

                        <button 
                            onClick={() => {
                                // Auto fill password field for UX
                                setPassword(tempResetPass);
                                setName(resetName);
                                
                                setViewMode('main');
                                setResetName('');
                                setResetEmail('');
                                setResetSuccess(false);
                                setTempResetPass('');
                                setError('');
                            }}
                            className="w-full flex items-center justify-center gap-2 bg-gkps-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                        >
                            <LogIn size={18} />
                            Login Sekarang
                        </button>
                    </div>
                )}

                {!resetSuccess && (
                    <button 
                        onClick={() => {
                            setViewMode('main');
                            setResetName('');
                            setResetEmail('');
                            setResetSuccess(false);
                            setError('');
                        }}
                        className="w-full mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium py-2 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Login
                    </button>
                )}
            </div>
        )}

        <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">© 2026 GKPS Parjumatanganan</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
