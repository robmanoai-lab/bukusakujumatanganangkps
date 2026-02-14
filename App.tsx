import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import Navigation from './components/Navigation';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import GuideBook from './components/GuideBook';
import ChatInterface from './components/ChatInterface';
import ReportForm from './components/ReportForm';
import LoginScreen from './components/LoginScreen'; 
import Profile from './components/Profile';
import ForceChangePassword from './components/ForceChangePassword'; // Import Component Baru
import { ViewState, Notification, UserProfile } from './types';
import { MOCK_NOTIFICATIONS } from './constants';

const App: React.FC = () => {
  // State untuk status Login & User Data
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('gkps_user');
    if (savedUser) {
        try {
            setCurrentUser(JSON.parse(savedUser));
        } catch (e) {
            console.error('Failed to parse user data');
            localStorage.removeItem('gkps_user');
        }
    }
  }, []);

  // Prevent accidental tab closure
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleLogin = (user: UserProfile) => {
    // Save to local storage for persistence
    localStorage.setItem('gkps_user', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    // Update local state
    setCurrentUser(updatedUser);
    localStorage.setItem('gkps_user', JSON.stringify(updatedUser));
    
    // Also update in the 'database'
    const dbKey = 'gkps_users_db';
    const existingUsersStr = localStorage.getItem(dbKey);
    if (existingUsersStr) {
      const existingUsers: UserProfile[] = JSON.parse(existingUsersStr);
      const userIndex = existingUsers.findIndex(u => u.name === updatedUser.name); // Using name as key for now
      if (userIndex !== -1) {
        existingUsers[userIndex] = updatedUser;
        localStorage.setItem(dbKey, JSON.stringify(existingUsers));
      }
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    // Clear storage
    localStorage.removeItem('gkps_user');
    setCurrentUser(null);
    setCurrentView('dashboard'); // Reset view
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({...n, read: true})));
  };

  const renderView = () => {
    if (!currentUser) return null;
    
    // LOGIC CHECK: FORCE PASSWORD CHANGE
    // Jika flag mustChangePassword true, render layar paksa ganti password
    if (currentUser.mustChangePassword) {
        return <ForceChangePassword user={currentUser} onUpdateUser={handleUpdateUser} />;
    }

    switch (currentView) {
      case 'dashboard':
        // Jika Admin, tampilkan AdminDashboard
        if (currentUser.role === 'admin') {
            return <AdminDashboard />;
        }
        return <Dashboard onChangeView={setCurrentView} user={currentUser} />;
      case 'guide':
        return <GuideBook />;
      case 'chat':
        return <ChatInterface />;
      case 'report':
        return <ReportForm user={currentUser} />;
      case 'profile':
        return <Profile user={currentUser} onUpdateUser={handleUpdateUser} />;
      default:
        if (currentUser.role === 'admin') {
            return <AdminDashboard />;
        }
        return <Dashboard onChangeView={setCurrentView} user={currentUser} />;
    }
  };

  const getTitle = () => {
    if (currentUser?.mustChangePassword) return 'Keamanan Akun'; // Title khusus saat dipaksa ganti password

    switch(currentView) {
        case 'dashboard': return currentUser?.role === 'admin' ? 'Panel Admin' : 'Beranda';
        case 'guide': return 'Buku Saku';
        case 'chat': return 'Pesan';
        case 'report': return 'Laporan';
        case 'profile': return 'Akun';
        default: return 'GKPS';
    }
  };

  // Jika belum login, tampilkan LoginScreen
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Jika sudah login, tampilkan Aplikasi Utama
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative">
       {/* Logout Confirmation Modal */}
       {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                    <LogOut size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-center text-gray-900 mb-2">Keluar Aplikasi?</h3>
                <p className="text-gray-500 text-center text-sm mb-6">
                    Apakah Anda yakin ingin keluar? Data di perangkat ini akan dihapus.
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => setShowLogoutConfirm(false)}
                        className="py-2.5 px-4 rounded-xl text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="py-2.5 px-4 rounded-xl text-white font-medium bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition-all"
                    >
                        Ya, Keluar
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Header logic: Always render Header (Notifications). */}
      {/* Hide Header actions (Logout/Notif) if forcing password change */}
      <Header 
        title={getTitle()} 
        notifications={currentUser.mustChangePassword ? [] : notifications} 
        onLogout={() => setShowLogoutConfirm(true)}
        onMarkAllRead={markAllNotifsRead}
      />
      
      {/* Main Content */}
      {currentView === 'chat' && !currentUser.mustChangePassword ? (
         <ChatInterface />
      ) : (
         <main className="animate-in fade-in duration-300">
           {renderView()}
         </main>
      )}

      {/* Navigation - Hide if Force Password Change */}
      {!currentUser.mustChangePassword && (
        <Navigation 
            currentView={currentView} 
            onChangeView={setCurrentView} 
        />
      )}
    </div>
  );
};

export default App;