import React, { useEffect, useState } from 'react';
import { Users, Shield, User, Search, BarChart3, PieChart, LayoutDashboard, Trash2, Edit2, Plus, X, Save, Check, KeyRound } from 'lucide-react';
import { UserProfile } from '../types';

const AdminDashboard: React.FC = () => {
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    sintua: 0,
    jemaat: 0,
    admin: 0
  });

  // Modal State for Edit/Create User
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null); // null means create mode
  const [formData, setFormData] = useState<UserProfile>({
      name: '',
      sector: 'Sektor 1',
      role: 'jemaat',
      password: '',
      servedFamilies: [],
      mustChangePassword: false
  });

  // Modal State for Change Password
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
      name: '',
      newPassword: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
        const dbKey = 'gkps_users_db';
        const usersDb: UserProfile[] = JSON.parse(localStorage.getItem(dbKey) || '[]');
        setAllUsers(usersDb);

        setStats({
            total: usersDb.length,
            sintua: usersDb.filter(u => u.role === 'sintua').length,
            jemaat: usersDb.filter(u => u.role === 'jemaat').length,
            admin: usersDb.filter(u => u.role === 'admin').length,
        });
    } catch (e) {
        console.error("Failed to load users", e);
    }
  };

  // --- CRUD HANDLERS ---
  const handleOpenModal = (user?: UserProfile) => {
    if (user) {
        setEditingUser(user);
        setFormData({ ...user }); // Copy data
    } else {
        setEditingUser(null);
        setFormData({
            name: '',
            sector: 'Sektor 1',
            role: 'jemaat',
            password: '', // Should be empty for new
            servedFamilies: [],
            mustChangePassword: true // Default true for Admin-created users
        });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (nameToDelete: string) => {
    if (window.confirm(`Yakin ingin menghapus pengguna ${nameToDelete}?`)) {
        const dbKey = 'gkps_users_db';
        const updatedUsers = allUsers.filter(u => u.name !== nameToDelete);
        localStorage.setItem(dbKey, JSON.stringify(updatedUsers));
        setAllUsers(updatedUsers);
        loadUsers(); // Refresh stats
    }
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.password) {
        alert("Nama dan Password wajib diisi");
        return;
    }

    const dbKey = 'gkps_users_db';
    let updatedUsers = [...allUsers];

    if (editingUser) {
        const index = updatedUsers.findIndex(u => u.name === editingUser.name);
        if (index !== -1) {
            updatedUsers[index] = formData;
        }
    } else {
        if (updatedUsers.some(u => u.name.toLowerCase() === formData.name.toLowerCase())) {
            alert("Nama pengguna sudah ada!");
            return;
        }
        updatedUsers.push(formData);
    }

    localStorage.setItem(dbKey, JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
    loadUsers(); // Refresh stats
    handleCloseModal();
  };

  // --- PASSWORD HANDLERS ---
  const handleOpenPasswordModal = (user: UserProfile) => {
    setPasswordForm({ name: user.name, newPassword: '' });
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword) {
        alert("Password baru tidak boleh kosong");
        return;
    }

    const dbKey = 'gkps_users_db';
    const updatedUsers = allUsers.map(u => {
        if (u.name === passwordForm.name) {
            // When admin changes password manually, we might want to force user to change it again, or not. 
            // Let's set mustChangePassword to true to be safe, as admin set a temp password.
            return { ...u, password: passwordForm.newPassword, mustChangePassword: true };
        }
        return u;
    });

    localStorage.setItem(dbKey, JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
    setIsPasswordModalOpen(false);
    alert(`Password untuk ${passwordForm.name} berhasil diubah. User wajib menggantinya saat login.`);
  };

  const filteredUsers = allUsers.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-24 pt-20 px-4 max-w-4xl mx-auto animate-in fade-in duration-500 relative">
      
      {/* Header Admin */}
      <div className="bg-gray-900 text-white p-6 rounded-3xl shadow-xl shadow-gray-200">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/10 rounded-lg">
                <LayoutDashboard size={24} />
            </div>
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        </div>
        <p className="text-gray-400 text-sm">Panel Kontrol & Manajemen Pengguna</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Users size={16} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">Total User</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                    <Shield size={16} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">Sintua</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{stats.sintua}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <User size={16} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">Jemaat</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{stats.jemaat}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
             <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600">
                    <Shield size={16} />
                </div>
                <span className="text-xs font-bold text-gray-400 uppercase">Admin</span>
            </div>
            <p className="text-2xl font-black text-gray-800">{stats.admin}</p>
        </div>
      </div>

      {/* User Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Users size={20} className="text-gkps-primary" />
                Manajemen Pengguna
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Cari nama atau sektor..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gkps-primary/20"
                    />
                </div>
                <button 
                    onClick={() => handleOpenModal()}
                    className="bg-gkps-primary text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 active:scale-95 transition-all"
                >
                    <Plus size={18} />
                    <span>Tambah</span>
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
                    <tr>
                        <th className="px-6 py-3">Nama Lengkap</th>
                        <th className="px-6 py-3">Peran</th>
                        <th className="px-6 py-3">Sektor</th>
                        <th className="px-6 py-3 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-3 font-medium text-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p>{user.name}</p>
                                            <p className="text-[10px] text-gray-400 tracking-widest">••••••••</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                                        user.role === 'admin' ? 'bg-red-50 text-red-600' :
                                        user.role === 'sintua' ? 'bg-purple-50 text-purple-600' :
                                        'bg-blue-50 text-blue-600'
                                    }`}>
                                        {user.role}
                                    </span>
                                    {user.role === 'sintua' && (
                                        <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                                             <Users size={10} />
                                             <span>{(user.servedFamilies || []).length} Kel.</span>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-3 text-gray-600">{user.sector || '-'}</td>
                                <td className="px-6 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => handleOpenPasswordModal(user)}
                                            className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                            title="Ganti Password"
                                        >
                                            <KeyRound size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleOpenModal(user)}
                                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(user.name)}
                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Hapus"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                Tidak ada data pengguna ditemukan.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">
                        {editingUser ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
                    </h3>
                    <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSaveUser} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 outline-none"
                            placeholder="Nama User"
                            required
                        />
                    </div>
                    {/* Password hidden in Main Edit, separate modal used for security or keep here if new user */}
                    {!editingUser && (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Password</label>
                            <input 
                                type="text" 
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 outline-none"
                                placeholder="Password Login"
                                required
                            />
                             <p className="text-[10px] text-orange-500 mt-1">
                                User baru akan dipaksa ganti password saat login pertama.
                            </p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Role</label>
                            <select 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 outline-none"
                            >
                                <option value="jemaat">Jemaat</option>
                                <option value="sintua">Sintua</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Sektor</label>
                             <select 
                                value={formData.sector}
                                onChange={(e) => setFormData({...formData, sector: e.target.value})}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 outline-none"
                            >
                                <option value="Sektor 1">Sektor 1</option>
                                <option value="Sektor 2">Sektor 2</option>
                                <option value="Sektor 3">Sektor 3</option>
                                <option value="Sektor 4">Sektor 4</option>
                                <option value="Sektor 5">Sektor 5</option>
                                <option value="Sektor 6">Sektor 6</option>
                                <option value="Sektor 7">Sektor 7</option>
                                <option value="Sektor 8">Sektor 8</option>
                                <option value="Sektor 9">Sektor 9</option>
                                <option value="Sektor 10">Sektor 10</option>
                                <option value="Sektor 11">Sektor 11</option>
                                <option value="Sektor 12">Sektor 12</option>
                                <option value="Pusat">Pusat</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={handleCloseModal}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-2.5 rounded-xl bg-gkps-primary text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Simpan
                        </button>
                    </div>
                </form>
             </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        <KeyRound size={18} className="text-orange-500"/>
                        Ganti Password
                    </h3>
                    <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <form onSubmit={handleSavePassword} className="p-6 space-y-4">
                    <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg">
                        <p className="text-xs text-orange-800">
                            Mengubah password untuk pengguna: <strong>{passwordForm.name}</strong>
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-1">Password Baru</label>
                        <input 
                            type="text" 
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-gkps-primary/20 outline-none"
                            placeholder="Ketik password baru"
                            autoFocus
                            required
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsPasswordModalOpen(false)}
                            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600 shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
                        >
                            <Save size={18} /> Simpan
                        </button>
                    </div>
                </form>
             </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;