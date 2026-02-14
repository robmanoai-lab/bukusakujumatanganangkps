import { GuideSection, ChatContact, Notification, ChatMessage } from './types';

export const SECTORS = [
  'Sektor 1', 'Sektor 2', 'Sektor 3', 'Sektor 4',
  'Sektor 5', 'Sektor 6', 'Sektor 7', 'Sektor 8',
  'Sektor 9', 'Sektor 10', 'Sektor 11', 'Sektor 12'
];

export const GUIDE_CONTENT: GuideSection[] = [
  {
    id: 'intro',
    title: 'A. PENDAHULUAN',
    content: `Ibadah Parjuma Tanganan adalah bentuk persekutuan kecil jemaat di rumah-rumah warga jemaat GKPS, yang dilaksanakan untuk mempererat kasih, memperdalam firman Tuhan, dan menghadirkan kehidupan ibadah dalam keluarga. Melalui ibadah ini, jemaat membangun kebersamaan rohani, saling menguatkan, dan menjadi perpanjangan tangan gereja dalam pelayanan kepada keluarga-keluarga secara nyata.\n\nSesuai dengan Tata Laksana GKPS, Sintua parjumatanganan adalah Sintua yang membimbing atau memimpin Komunitas Jumatanganan. Sintua tersebutlah yang bertanggung jawab atas pembinaan rohani, koordinasi kegiatan, dan pelayanan di kelompok jumatanganan jemaat tersebut dan menjadi perpanjangan tangan gereja dalam pelayanan kepada keluarga.`
  },
  {
    id: 'b_1_basis',
    title: 'B.I. DASAR PELAKSANAAN',
    content: [
      'Dalam Alkitab kita dapat menemukan dasar alkitabiah tentang pelayanan parjumatanganan yaitu dalam:',
      'a. Matius 18:20',
      'b. Kisah Para Rasul 2:46–47',
      'c. Ibrani 10:24–25',
      'Secara teologis, pelayanan parjumatanganan adalah persekutuan kecil warga jemaat yang mencerminkan tubuh Kristus di mana setiap anggota saling menopang dan bertumbuh dalam kasih.',
      'Demikian juga secara aturan gerejawi di GKPS, pelayanan parjumatanganan juga sudah diaturkan dalam Tata Laksana GKPS, dalam Pedoman Parjumatanganan di GKPS dan juga hendaknya dituliskan dalam Tata Kerja Majelis Jemaat di masing-masing jemaat. Hendaknya juga dalam melaksanakan pelayanan partonggoan parjumatanganan, dituliskan jadwal yang tetap di jemaat dalam pelaksananaan partonggoan parjumatanganan.'
    ]
  },
  {
    id: 'b_2_purpose',
    title: 'B.II. TUJUAN PARTONGGOAN',
    content: [
      '1. Menumbuhkan iman warga dari setiap keluarga jemaat.',
      '2. Mempererat kasih antar keluarga.',
      '3. Menghadirkan suasana ibadah dalam keluarga.',
      '4. Mendorong keluarga untuk aktif dalam pelayanan.',
      '5. Menjadi sarana pembinaan dan pelayanan.'
    ]
  },
  {
    id: 'b_3_reason',
    title: 'B.III. ALASAN DIPERLUKAN',
    content: [
      'Mengapa diperlukan Partonggoan Jumatanganan?',
      '1. Pelayanan Gereja hadir di tengah keluarga.',
      '2. Ibadah keluarga memperkuat iman dan kasih.',
      '3. Menjangkau jemaat yang jarang hadir mengikuti ibadah-ibadah yang dilaksanakan jemaat.',
      '4. Membangun komunitas keluarga jumatanganan yang saling menopang.'
    ]
  },
  {
    id: 'b_4_structure',
    title: 'B.IV. STRUKTUR PELAKSANA',
    content: [
      '1. Pimpinan Majelis Jemaat (PMJ): Menetapkan Jadwal Pelaksanaan Partonggoan Parjuma tanganan.',
      '2. Sintua: Membina, memimpin, menyiapkan Pelayanan, dan melaporkan pelaksanaan partonggoan parjumatanganan.',
      '3. Keluarga tempat pelaksanaan: Menyediakan tempat dan membantu persiapan.',
      '4. Pengurus atau koordinator pelayanan Sektor: Membagi keluarga di sektornya dengan berkoordinasi dengan Pimpinan Majelis Jemaat kepada kelompok parjumatanganan. Yang perlu dipertimbangkan adalah jarak tempuh, wilayah, dan pertimbangan Adat/budaya. Pengurus Sektor juga mengawasi jalannya parjuma tanganan.',
      '5. Pendeta: Membimbing dan memberi pembekalan Topik yang telah ditetapkan untuk Sintua yang akan melaksanakan Pengajaran.'
    ]
  },
  {
    id: 'b_5_guidelines',
    title: 'B.V. PETUNJUK PELAKSANAAN',
    content: [
      '1. Satu orang Sintua membina empat (4) keluarga.',
      '2. Partonggoan parjumatanganan dilaksanakan paling sedikit empat (4) kali setahun.',
      '3. Diumumkan/diwartakan dalam warta jemaat sebanyak dua (2) kali sebelum pelaksanaan.',
      '4. Dilaksanakan secara bergiliran di rumah warga jemaat yang menjadi jumatanganan dari Sintua.',
      '5. Partonggoan Parjumatanganan bukan forum untuk membahas masalah pribadi, tetapi fokus kepada ibadah dan doa.',
      '6. Setelah selesai, Sintua wajib membuat laporan kehadiran kepada Pengurus Sektor, dan Pengurus Sektor melaporkannya kepada Pimpinan Majelis Jemaat.',
      '7. Pelaksanaan pelayanan diumumkan dalam warta jemaat oleh Sintua dengan menuliskan jumlah kehadiran dan jumlah persembahan.',
      '8. Durasi ibadah 60–90 menit.'
    ]
  },
  {
    id: 'b_6_liturgy',
    title: 'B.VI. TATA IBADAH',
    content: [
      'Adapun usulan konsep untuk Tata Ibadah pelaksanaan partonggoan parjumatanganan adalah:',
      '1. Saat Teduh',
      '2. Votum – Introitus - Doa',
      '3. Nyanyian',
      '4. Khotbah (Pengajaran)',
      '5. Nyanyian',
      '6. Doa syafaat atau Doa Berantai (Pokok-Pokok Doa didaftarkan)',
      '7. Nyanyian (Persembahan)',
      '8. Doa Persembahan – Doa Bapa Kami – Berkat.'
    ]
  },
  {
    id: 'b_7_ethics',
    title: 'B.VII. ETIKA & KOMUNIKASI',
    content: [
      '1. Sikap Ibadah:',
      '   • Datang tepat waktu dan berpakaian sopan.',
      '   • Menjaga ketenangan dan hormat satu dengan yang lain.',
      '   • Menjaga suasana rohani, penuh kasih dan damai.',
      '   • Tidak menggunakan ibadah untuk keluhan pribadi.',
      '',
      '2. Etika Komunikasi:',
      '   • Berbicara dengan lembut dan penuh kasih (Kolose 4:6).',
      '   • Menjaga kerahasiaan pokok doa jemaat.',
      '   • Meneladani Kristus dalam tutur kata.',
      '   • Bijak menggunakan media sosial.',
      '   • Cepat mendengar, lambat berkata-kata, lambat marah (Yakobus 1:19).'
    ]
  },
  {
    id: 'b_8_evaluation',
    title: 'B.VIII. EVALUASI IBADAH',
    content: [
      '1. Evaluasi ibadah parjumatanganan dilaksanakan pada minggu berikutnya setelah pelaksanaan, setelah sermon jemaat atau waktu yang ditentukan PMJ.',
      '2. Tujuannya meningkatkan mutu pelayanan dan kebersamaan.',
      '3. Warga yang butuh Pelayanan pastoral tindak lanjut tidak dibicarakan dalam rapat evaluasi, tetapi dibicarakan dengan Porhanger/Wakil secara tertutup untuk ditindaklanjuti kepada Pendeta/Penginjil.'
    ]
  },
  {
    id: 'b_9_teaching',
    title: 'B.IX. PENGAJARAN SINTUA',
    content: [
      'A. Tujuan Pengajaran:',
      '   • Memperdalam ajaran iman Kristen.',
      '   • Membina kehidupan rohani keluarga.',
      '   • Menanamkan nilai kasih dan pelayanan.',
      '',
      'B. Bentuk Pengajaran:',
      '   • Kunjungan langsung dalam suka maupun duka dan Berdoa bersama.',
      '   • Diskusi Alkitab dan doa bersama.',
      '   • Bimbingan rohani bagi keluarga bergumul dan doa bersama.',
      '',
      'C. Materi:',
      '   • Pengajaran tematik dari Alkitab.',
      '   • Tema tahunan gereja & Sub Tema Tahunan.',
      '   • Ajaran GKPS lainnya.',
      '   • Renungan Harian (distribusi).',
      '   • Disesuaikan dengan Materi dari Kantor Sinode.',
      '',
      'D. Sikap Sintua:',
      '   • Rendah hati, Tidak menggurui.',
      '   • Mudah dimengerti.',
      '   • Menjaga rahasia.'
    ]
  },
  {
    id: 'b_10_results',
    title: 'B.X. HASIL YANG DIHARAPKAN',
    content: [
      'Keluarga bertumbuh dalam iman dan menjadi saksi Kristus (1 Timotius 4:12).'
    ]
  },
  {
    id: 'closing',
    title: 'C. PENUTUP',
    content: [
      'Demikianlah buku saku pelaksanaan pelayanan Partonggoan Parjumatanganan ini dibuat, untuk tercapainya pelaksanaan pelayanan parjumatanganan yang diawali dengan melaksanakan Partonggoan parjumatanganan.',
      '',
      'Pematangsiantar, Oktober 2025',
      'Pimpinan Sinode GKPS'
    ]
  }
];

export const MOCK_CONTACTS: ChatContact[] = [
  {
    id: '1',
    name: 'Sektor 3 - Parjumatanganan',
    avatar: 'https://picsum.photos/id/1/200/200',
    lastMessage: 'St. Sibujur: Hita on ma namangidangi minggu on.',
    lastMessageTime: '10:30',
    unreadCount: 3,
    isGroup: true
  },
  {
    id: '2',
    name: 'St. Sibujur Uhur Saragih',
    avatar: 'https://picsum.photos/id/55/200/200',
    lastMessage: 'Horas, naha kabar keluarga?',
    lastMessageTime: 'Kemarin',
    unreadCount: 0,
    isGroup: false
  },
  {
    id: '3',
    name: 'Kel. Bp. Siboan Damei',
    avatar: 'https://picsum.photos/id/64/200/200',
    lastMessage: 'Siap sintua, kami siapkan tempat.',
    lastMessageTime: 'Kemarin',
    unreadCount: 0,
    isGroup: false
  }
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'other',
    text: 'Horas, bapak/ibu sekalian. Minggu depan partonggoan di rumah Kel. Bp. Siboan Damei ya.',
    timestamp: '10:00',
    isMe: false,
    status: 'read'
  },
  {
    id: 'm2',
    senderId: 'me',
    text: 'Horas Santabi Sintua, jam berapa kita mulai?',
    timestamp: '10:15',
    isMe: true,
    status: 'read'
  },
  {
    id: 'm3',
    senderId: 'other',
    text: 'Kita mulai pukul 19.30 WIB. Diusahakan tepat waktu ya.',
    timestamp: '10:30',
    isMe: false,
    status: 'read'
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Jadwal Partonggoan',
    message: 'Partonggoan Jumat ini di Rumah Bp. Siboan Damei, Pukul 19:30 WIB.',
    time: '2 jam yang lalu',
    read: false,
    type: 'info'
  },
  {
    id: 'n2',
    title: 'Laporan Terkirim',
    message: 'Laporan parjumatanganan bulan Juni berhasil dikirim ke Majelis.',
    time: '1 hari yang lalu',
    read: true,
    type: 'success'
  }
];