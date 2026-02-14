import React, { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, ArrowLeft, MoreVertical, Paperclip, Smile, Search, AlertTriangle, Check, CheckCheck, Mic, Camera, X } from 'lucide-react';
import { MOCK_CONTACTS, MOCK_MESSAGES } from '../constants';
import { ChatContact, ChatMessage } from '../types';

// Mock Service (Simulasi Backend)
const MockMessageService = {
  subscribeToStatusUpdates: (messageId: string, callback: (status: 'delivered' | 'read') => void) => {
    const deliveredDelay = 800 + Math.random() * 1000;
    const readDelay = deliveredDelay + 1500 + Math.random() * 2000;
    const t1 = setTimeout(() => callback('delivered'), deliveredDelay);
    const t2 = setTimeout(() => callback('read'), readDelay);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }
};

const ChatInterface: React.FC = () => {
  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const statusSubscriptions = useRef<Record<string, () => void>>({});

  useEffect(() => {
    return () => { 
      Object.keys(statusSubscriptions.current).forEach(key => {
        statusSubscriptions.current[key]();
      });
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeChat]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) return;

    const msgId = Date.now().toString();
    const optimisticMsg: ChatMessage = {
      id: msgId,
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent'
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setNewMessage('');

    const unsubscribe = MockMessageService.subscribeToStatusUpdates(msgId, (newStatus) => {
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: newStatus } : m));
    });
    statusSubscriptions.current[msgId] = unsubscribe;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBack = () => {
    newMessage.trim() ? setShowExitConfirm(true) : setActiveChat(null);
  };

  // Logic Filtering Kontak berdasarkan Search Query
  const filteredContacts = MOCK_CONTACTS.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- LIST VIEW (WhatsApp Style Home) ---
  if (!activeChat) {
    return (
      <div className="pb-24 pt-20 px-0 max-w-md mx-auto h-full flex flex-col bg-white">
        <div className="px-4 pb-2 sticky top-20 bg-white z-10">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-2xl font-bold text-gkps-primary">Chat</h2>
             <div className="flex gap-4 text-gkps-primary">
                <Camera size={22} />
                <MoreVertical size={22} />
             </div>
           </div>
           
           {/* Search Input Area */}
           <div className="relative mb-2 group">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400 group-focus-within:text-gkps-primary transition-colors" />
             </div>
             <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari kontak atau pesan..." 
                className="w-full bg-gray-100 text-gray-800 rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none focus:bg-gray-50 focus:ring-1 focus:ring-gkps-primary/30 transition-all placeholder-gray-500"
             />
             {searchQuery && (
                <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                    <div className="bg-gray-200 rounded-full p-0.5">
                        <X size={12} />
                    </div>
                </button>
             )}
           </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
                <div 
                key={contact.id}
                onClick={() => setActiveChat(contact)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer active:bg-gray-100 transition-colors"
                >
                <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0 border-b border-gray-100 pb-3">
                    <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="font-semibold text-gray-900 truncate text-base">
                        {/* Highlight matching text logic could go here, keeping simple for now */}
                        {contact.name}
                    </h3>
                    <span className={`text-[11px] ${contact.unreadCount > 0 ? 'text-green-500 font-medium' : 'text-gray-400'}`}>
                        {contact.lastMessageTime}
                    </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500 truncate pr-2 flex items-center gap-1">
                            {/* Simulasi double tick di list view jika last message dari 'me' */}
                            {!contact.unreadCount && <CheckCheck size={14} className="text-blue-500" />}
                            {contact.lastMessage}
                        </p>
                        {contact.unreadCount > 0 && (
                            <div className="bg-green-500 text-white text-[10px] min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center font-bold">
                                {contact.unreadCount}
                            </div>
                        )}
                    </div>
                </div>
                </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <Search size={48} className="mb-2 opacity-20" />
                <p className="text-sm">Kontak tidak ditemukan</p>
            </div>
          )}
        </div>
        
        {/* FAB */}
        <button className="fixed bottom-24 right-6 w-14 h-14 bg-gkps-accent rounded-2xl shadow-xl shadow-green-200 text-white flex items-center justify-center active:scale-95 transition-transform z-40">
            <MoreVertical className="rotate-90" strokeWidth={2.5} />
        </button>
      </div>
    );
  }

  // --- DETAIL VIEW (WhatsApp Style Room) ---
  return (
    <div className="fixed inset-0 bg-[#efe7dd] z-[100] flex flex-col">
      {/* Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-72 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Batalkan Pesan?</h3>
                <p className="text-gray-500 text-sm mb-6">Pesan yang belum terkirim akan hilang.</p>
                <div className="flex justify-end gap-4 font-medium text-sm">
                    <button onClick={() => setShowExitConfirm(false)} className="text-gray-500 hover:bg-gray-100 px-3 py-2 rounded-lg">Batal</button>
                    <button onClick={() => { setShowExitConfirm(false); setActiveChat(null); setNewMessage(''); }} className="text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg">Keluar</button>
                </div>
            </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-[#0056b3] text-white px-2 py-2 flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center gap-1">
          <button onClick={handleBack} className="p-1.5 rounded-full hover:bg-white/10">
            <ArrowLeft size={22} />
          </button>
          <img src={activeChat.avatar} alt={activeChat.name} className="w-9 h-9 rounded-full ml-1" />
          <div className="ml-2 flex flex-col justify-center cursor-pointer">
            <h3 className="font-semibold text-base line-clamp-1 w-40 text-left leading-tight">{activeChat.name}</h3>
            <p className="text-[11px] opacity-80 text-left">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-5 pr-3">
            <Video size={22} strokeWidth={2} />
            <Phone size={20} strokeWidth={2} />
            <MoreVertical size={20} strokeWidth={2} />
        </div>
      </div>

      {/* Chat Area - WhatsApp Pattern Background */}
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 opacity-100 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} mb-1`}>
            <div 
              className={`max-w-[85%] px-3 py-1.5 rounded-lg shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative text-[14.2px] leading-snug ${
                msg.isMe 
                  ? 'bg-[#dcf8c6] rounded-tr-none' 
                  : 'bg-white rounded-tl-none'
              }`}
            >
              <p className="text-[#111b21] break-words pr-2">{msg.text}</p>
              <div className="flex justify-end items-center gap-0.5 mt-[-4px] pt-1 float-right pl-2">
                <span className="text-[10px] text-gray-500 pt-1">{msg.timestamp}</span>
                {msg.isMe && (
                   <span className="ml-0.5 pt-1">
                     {msg.status === 'sent' && <Check size={14} className="text-gray-500" strokeWidth={1.5} />}
                     {msg.status === 'delivered' && <CheckCheck size={14} className="text-gray-500" strokeWidth={1.5} />}
                     {msg.status === 'read' && <CheckCheck size={14} className="text-[#53bdeb]" strokeWidth={1.5} />}
                   </span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#f0f2f5] px-2 py-2 flex items-end gap-2 pb-safe">
        <div className="flex-1 bg-white rounded-2xl flex items-end px-3 py-2 gap-2 shadow-sm min-h-[44px]">
            <Smile size={24} className="text-gray-400 cursor-pointer mb-1" />
            <textarea 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                placeholder="Ketik pesan" 
                rows={1}
                className="flex-1 outline-none text-[15px] text-gray-700 placeholder-gray-400 bg-transparent resize-none py-1.5 max-h-32"
            />
            <Paperclip size={22} className="text-gray-400 cursor-pointer mb-1" transform="rotate(45)" />
            {!newMessage && <Camera size={22} className="text-gray-400 cursor-pointer mb-1" />}
        </div>
        <button 
            onClick={() => newMessage.trim() ? handleSendMessage() : null}
            className={`w-11 h-11 rounded-full flex items-center justify-center text-white shadow-sm transition-all transform mb-0.5 ${
                newMessage.trim() 
                ? 'bg-[#00a884] active:scale-95' 
                : 'bg-[#00a884]'
            }`}
        >
          {newMessage.trim() ? <Send size={20} className="ml-0.5" /> : <Mic size={20} />}
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;