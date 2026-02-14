
export type ViewState = 'dashboard' | 'guide' | 'chat' | 'report' | 'profile';

export interface UserProfile {
  name: string;
  sector: string;
  role: 'jemaat' | 'sintua' | 'admin';
  password?: string;
  servedFamilies?: string[]; // Daftar keluarga yang dilayani Sintua
  mustChangePassword?: boolean; // Flag untuk memaksa ganti password
}

export interface GuideSection {
  id: string;
  title: string;
  content: string | string[];
  subSections?: GuideSection[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
}

export interface ChatContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isGroup: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'alert' | 'success';
}

export interface ReportData {
  id?: string;
  sintuaName: string;
  hostFamily: string;
  date: string;
  attendance: {
    fathers: number;
    mothers: number;
    youth: number;
    kids: number;
  };
  prayerPoints: string;
  offering: string;
  topic: string;
  notes: string;
  status?: string;
}

// Interface untuk Backup Data Lengkap
export interface AppBackupData {
  users: UserProfile[];
  reports: ReportData[];
  chats: Record<string, ChatMessage[]>; // Key: contactId, Value: Messages
  timestamp: number;
}
