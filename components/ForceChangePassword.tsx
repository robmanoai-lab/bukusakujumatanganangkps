import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Lock, Eye, EyeOff, Save, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

interface ForceChangePasswordProps {
    user: UserProfile;
    onUpdateUser: (updatedUser: UserProfile) => void;
}

const ForceChangePassword: React.FC<ForceChangePasswordProps> = ({ user, onUpdateUser }) => {
    const [passData, setPassData] = useState({
        new: '',
        confirm: ''
    });
    const [showPass, setShowPass] = useState({
        new: false,
        confirm: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (passData.new.length < 6) {
            setError('Password baru minimal 6 karakter.');
            return;
        }

        if (passData.new !== passData.confirm) {
            setError('Konfirmasi password tidak cocok.');
            return;
        }

        if (passData.new === user.password) {
            setError('Password baru tidak boleh sama dengan password lama.');
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const updatedUser: UserProfile = { 
                ...user, 
                password: passData.new,
                mustChangePassword: false 
            };
            onUpdateUser(updatedUser);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
             {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 opacity-20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 opacity-20 rounded-full -ml-20 -mb-20 blur-3xl"></div>

            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-8 relative z-10 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-full mx-auto flex items-center justify-center mb-4 ring-4 ring-orange-50/50">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">Ganti Password Wajib</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Demi keamanan akun, Anda diwajibkan mengganti password bawaan sebelum melanjutkan ke aplikasi.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-red-600 text-xs font-medium animate-in fade-in slide-in-from-top-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Password Baru</label>
                        <div className="relative">
                            <input 
                                type={showPass.new ? "text" : "password"}
                                value={passData.new}
                                onChange={(e) => setPassData({...passData, new: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all"
                                placeholder="Minimal 6 karakter"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPass({...showPass, new: !showPass.new})}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Konfirmasi Password Baru</label>
                        <div className="relative">
                            <input 
                                type={showPass.confirm ? "text" : "password"}
                                value={passData.confirm}
                                onChange={(e) => setPassData({...passData, confirm: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-500 outline-none transition-all"
                                placeholder="Ulangi password baru"
                                required
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPass({...showPass, confirm: !showPass.confirm})}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            >
                                {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-6"
                    >
                        {loading ? (
                             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <Save size={18} />
                                <span>Simpan & Lanjutkan</span>
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ForceChangePassword;