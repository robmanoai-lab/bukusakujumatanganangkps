import React, { useState } from 'react';
import { Bell, Search, Menu, LogOut, Check, X, CheckCheck } from 'lucide-react';
import { Notification } from '../types';

interface HeaderProps {
  title: string;
  notifications: Notification[];
  onLogout: () => void;
  onMarkAllRead?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, notifications, onLogout, onMarkAllRead }) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-40 px-4 py-3 shadow-sm border-b border-gray-100 transition-all">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gkps-primary to-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-blue-200 shadow-lg">
                  GKPS
              </div>
            <h1 className="text-lg font-bold text-gray-800 tracking-tight">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2 relative">
            {/* Notifikasi */}
            <button 
              className={`p-2.5 rounded-full relative transition-all duration-200 active:scale-90 ${showNotifs ? 'bg-blue-50 text-gkps-primary' : 'text-gray-500 hover:bg-gray-50'}`}
              onClick={() => setShowNotifs(true)}
            >
              <Bell size={22} strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              )}
            </button>
            
            {/* Logout */}
            <button 
              onClick={onLogout}
              className="text-red-500 p-2.5 hover:bg-red-50 rounded-full transition-colors active:scale-90"
              title="Keluar Aplikasi"
            >
              <LogOut size={22} strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Modern Notification Overlay (Mobile Bottom Sheet / Desktop Dropdown) */}
      {showNotifs && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end sm:justify-start sm:items-end sm:px-4 sm:pt-16">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShowNotifs(false)}
          />
          
          {/* Content */}
          <div className="relative w-full sm:w-96 bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-top-2 duration-300 flex flex-col max-h-[85vh]">
             
             {/* Header Notif */}
             <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-gray-800">Notifikasi</h3>
                    {unreadCount > 0 && (
                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} Baru</span>
                    )}
                </div>
                <button 
                    onClick={() => setShowNotifs(false)}
                    className="p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                >
                    <X size={20} />
                </button>
             </div>

             {/* List */}
             <div className="overflow-y-auto p-2 bg-gray-50/50 flex-1">
                {notifications.length > 0 ? (
                    <div className="space-y-2">
                    {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 rounded-xl border transition-all ${notif.read ? 'bg-white border-gray-100 opacity-80' : 'bg-white border-blue-100 shadow-sm'}`}>
                            <div className="flex gap-3">
                                <div className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${notif.read ? 'bg-gray-300' : (notif.type === 'info' ? 'bg-blue-500' : 'bg-green-500')}`} />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <p className={`text-sm text-gray-800 ${notif.read ? 'font-medium' : 'font-bold'}`}>{notif.title}</p>
                                        <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed">{notif.message}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-400 flex flex-col items-center">
                        <Bell size={48} className="mb-3 opacity-20" />
                        <span className="text-sm font-medium">Belum ada notifikasi</span>
                    </div>
                )}
             </div>

             {/* Footer Action - Fixed Bottom */}
             {unreadCount > 0 && onMarkAllRead && (
                 <div className="p-4 border-t border-gray-100 bg-white">
                    <button 
                        onClick={() => {
                            onMarkAllRead();
                            // Optional: Don't close immediately so user sees the change
                            // setShowNotifs(false); 
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-blue-50 text-gkps-primary font-bold py-3 rounded-xl hover:bg-blue-100 active:scale-[0.98] transition-all"
                    >
                        <CheckCheck size={18} />
                        Tandai Semua Dibaca
                    </button>
                 </div>
             )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;