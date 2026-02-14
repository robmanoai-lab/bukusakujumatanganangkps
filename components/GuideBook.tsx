import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Bookmark, Book } from 'lucide-react';
import { GUIDE_CONTENT } from '../constants';

const GuideBook: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>('liturgy');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ''});

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  const toggleBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newBookmarks = new Set(bookmarkedIds);
    let message = '';
    
    if (newBookmarks.has(id)) {
      newBookmarks.delete(id);
      message = 'Dihapus dari favorit';
    } else {
      newBookmarks.add(id);
      message = 'Bagian ditambahkan ke favorit';
    }
    
    setBookmarkedIds(newBookmarks);
    setToast({ show: true, message });
    
    // Hide toast after 2 seconds
    setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
    }, 2000);
  };

  return (
    <div className="pb-24 pt-20 px-4 max-w-md mx-auto relative">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm text-white px-4 py-2.5 rounded-full text-xs font-medium shadow-xl z-50 animate-in fade-in zoom-in duration-200 flex items-center gap-2">
            <span>{toast.message}</span>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Buku Saku</h2>
        <p className="text-gray-500 text-sm">Partonggoan Parjumatanganan GKPS</p>
      </div>

      <div className="space-y-4">
        {GUIDE_CONTENT.map((section) => {
          const isOpen = openSection === section.id;
          const isBookmarked = bookmarkedIds.has(section.id);

          return (
            <div 
              key={section.id} 
              className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'shadow-md border-blue-100' : 'shadow-sm border-gray-100'
              }`}
            >
              <div className="w-full flex items-center justify-between p-4">
                {/* Title Area - Clickable to toggle section */}
                <button
                    onClick={() => toggleSection(section.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                >
                  <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-gkps-primary text-white' : 'bg-blue-50 text-gkps-primary'}`}>
                    {/* Use Book icon instead of Bookmark for decorative icon to avoid confusion */}
                    {section.id === 'liturgy' ? <BookOpen size={20} /> : <Book size={20} />}
                  </div>
                  <span className={`font-semibold ${isOpen ? 'text-gkps-primary' : 'text-gray-700'}`}>
                    {section.title}
                  </span>
                </button>

                {/* Actions Area */}
                <div className="flex items-center gap-1">
                    <button 
                        onClick={(e) => toggleBookmark(e, section.id)}
                        className={`p-2 rounded-full transition-all active:scale-90 ${
                            isBookmarked 
                            ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' 
                            : 'text-gray-300 hover:text-gray-500 hover:bg-gray-50'
                        }`}
                        title={isBookmarked ? "Hapus favorit" : "Tambah favorit"}
                    >
                        <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} strokeWidth={isBookmarked ? 2 : 2} />
                    </button>
                    <button 
                        onClick={() => toggleSection(section.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
                    >
                         {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                </div>
              </div>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-2 mt-2">
                      {section.content.map((line, idx) => (
                        <li key={idx} className="flex gap-2">
                           {/* Simple bullet logic based on content */}
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-justify">{section.content}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GuideBook;