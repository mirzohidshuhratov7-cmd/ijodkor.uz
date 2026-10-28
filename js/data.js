/**
 * IJODKOR.UZ - Ma'lumotlar bazasi va Bulutli Sinxronlash tizimi
 * 
 * Yangilanishlar:
 * 1. Barcha maktablar umumiy o'rta ta'lim maktablari ("15-umumiy o'rta ta'lim maktabi").
 * 2. Yo'nalishlar umuman yo'q, faqat tumanlar bo'yicha.
 * 3. O'quvchilar o'z rasmini yuklaydi va istalgan payt profilini tahrirlay oladi (xatolarni tuzatish, video silkasini o'zgartirish, yangi rasm qo'yish).
 * 4. Maxfiylik: O'quvchilar raqami xodim va adminga, xodimlar raqami FAQAT adminga ko'rinadi.
 * 5. Chellenjlar (Muddatli Video Rolik Vazifalari):
 *    - Muddat (kunlar) belgilanadi, muddat o'tsa qabul qilinmaydi.
 *    - O'quvchilar video rolik yuklaydi va pastiga kimlar qatnashganini yozadi.
 *    - Admin ko'rib chiqib tanga taqdim etadi.
 * 6. Oylik qiziqib boruvchilar (tashriflar) statistikasi adminga ko'rsatiladi.
 * 7. Bulutli multi-device sinxronlash (Netlify, telefon va kompyuter).
 */

const STORAGE_KEY_CREATORS = 'ijodkor_creators_data';
const STORAGE_KEY_CONTESTS = 'ijodkor_contests_data';
const STORAGE_KEY_CHALLENGES = 'ijodkor_challenges_data';
const STORAGE_KEY_CHALLENGE_SUBMISSIONS = 'ijodkor_challenge_submissions';
const STORAGE_KEY_SESSION = 'ijodkor_current_session';
const STORAGE_KEY_ADMIN_PIN = 'ijodkor_admin_pin';
const STORAGE_KEY_ADMIN_NAME = 'ijodkor_admin_name';
const STORAGE_KEY_ADMIN_INBOX = 'ijodkor_admin_inbox';
const STORAGE_KEY_STAFF = 'ijodkor_staff_data';
const STORAGE_KEY_CLOUD_ID = 'ijodkor_cloud_id';
const STORAGE_KEY_VISITORS = 'ijodkor_visitors_stats';

// Bosh koordinatorning rasmiy telefon raqami
const COORDINATOR_PHONE = '+998 99 674 14 40';

// TUMANLAR VA SHAHARLAR RO'YXATI
const TUMANLAR = [
  { id: 'all', name: 'Barcha tumanlar', icon: '📍' },
  // Toshkent shahri tumanlari
  { id: 'chilonzor', name: 'Chilonzor tumani', icon: '🏢' },
  { id: 'yunusobod', name: 'Yunusobod tumani', icon: '🏢' },
  { id: 'mirzo-ulugbek', name: "Mirzo Ulug'bek tumani", icon: '🏢' },
  { id: 'shayxontohur', name: 'Shayxontohur tumani', icon: '🏢' },
  { id: 'yakkasaroy', name: 'Yakkasaroy tumani', icon: '🏢' },
  { id: 'yashnobod', name: 'Yashnobod tumani', icon: '🏢' },
  { id: 'olmazor', name: 'Olmazor tumani', icon: '🏢' },
  { id: 'uchtepa', name: 'Uchtepa tumani', icon: '🏢' },
  { id: 'sergeli', name: 'Sergeli tumani', icon: '🏢' },
  { id: 'yangihayot', name: 'Yangihayot tumani', icon: '🏢' },
  { id: 'mirobod', name: 'Mirobod tumani', icon: '🏢' },
  { id: 'bektemir', name: 'Bektemir tumani', icon: '🏢' },
  // Viloyatlar va yirik shaharlar
  { id: 'samarqand', name: 'Samarqand shahri', icon: '🏛️' },
  { id: 'urgut', name: 'Urgut tumani', icon: '⛰️' },
  { id: 'fargona', name: "Farg'ona shahri", icon: '🌿' },
  { id: 'qoqon', name: "Qo'qon shahri", icon: '🏰' },
  { id: 'margilon', name: "Marg'ilon shahri", icon: '🧵' },
  { id: 'buxoro', name: 'Buxoro shahri', icon: '🕌' },
  { id: 'gijduvon', name: "G'ijduvon tumani", icon: '🏺' },
  { id: 'andijon', name: 'Andijon shahri', icon: '🌸' },
  { id: 'asaka', name: 'Asaka tumani', icon: '🏭' },
  { id: 'namangan', name: 'Namangan shahri', icon: '🌹' },
  { id: 'chust', name: 'Chust tumani', icon: '🔪' },
  { id: 'urganch', name: 'Urganch shahri', icon: '🌊' },
  { id: 'xiva', name: 'Xiva shahri', icon: '🧱' },
  { id: 'qarshi', name: 'Qarshi shahri', icon: '☀️' },
  { id: 'shahrisabz', name: 'Shahrisabz shahri', icon: '🌲' },
  { id: 'termiz', name: 'Termiz shahri', icon: '🌴' },
  { id: 'denov', name: 'Denov tumani', icon: '🍇' },
  { id: 'nukus', name: 'Nukus shahri', icon: '🏜️' },
  { id: 'jizzax', name: 'Jizzax shahri', icon: '🌾' },
  { id: 'guliston', name: 'Guliston shahri', icon: '🌱' },
  { id: 'navoiy', name: 'Navoiy shahri', icon: '⚡' }
];

// Dastlabki namunaviy umumiy o'rta ta'lim maktab o'quvchilari
const INITIAL_CREATORS = [
  {
    id: 'cre-1',
    fullName: 'Madinabonu Ergasheva',
    age: 16,
    district: 'samarqand',
    districtLabel: 'Samarqand shahri',
    school: "15-umumiy o'rta ta'lim maktabi",
    bio: "Ko'rik-tanlovlar g'olibi. Davlat tadbirlarida yakkaxon chiqishlar qilgan iqtidorli maktab o'quvchisi.",
    phone: '+998 90 123 45 67',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    videoEmbedUrl: 'https://www.youtube.com/embed/ysz5S6PUM-U',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    coins: 185,
    eventsCount: 5,
    eventsHistory: [
      { id: 'ev-1', eventName: "Navro'z umumxalq sayli 2026", coinsAwarded: 50, date: '2026-03-21', note: 'Bosh maydondagi yakkaxon chiqish uchun' },
      { id: 'ev-2', eventName: 'Xalqaro Yoshlar forumi', coinsAwarded: 40, date: '2026-04-12', note: 'Ochilish marosimidagi faol ishtirok' },
      { id: 'ev-3', eventName: 'Xotira va qadrlash konserti', coinsAwarded: 35, date: '2026-05-09', note: "Vatanparvarlik chiqishi" },
      { id: 'ev-4', eventName: 'Yoshlar kuni gala-konserti', coinsAwarded: 30, date: '2026-06-30', note: 'Katta sahna chiqishi' },
      { id: 'ev-5', eventName: "Sharq taronalari yo'ldoshi", coinsAwarded: 30, date: '2026-08-25', note: "Shahar bosqichidagi muvaffaqiyat" }
    ],
    createdAt: '2026-01-15'
  },
  {
    id: 'cre-2',
    fullName: 'Jasurbek Rahimov',
    age: 17,
    district: 'chilonzor',
    districtLabel: 'Chilonzor tumani',
    school: "28-umumiy o'rta ta'lim maktabi",
    bio: "Maktab yosh iqtidorlari ko'rik-tanlovi g'olibi. Jonli ijro mahorati yuqori, shahar tadbirlari faol ishtirokchisi.",
    phone: '+998 93 456 78 90',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoEmbedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    coins: 160,
    eventsCount: 4,
    eventsHistory: [
      { id: 'ev-6', eventName: "Navro'z tantanalari", coinsAwarded: 50, date: '2026-03-21', note: "Maktab jamoasi bilan chiqish" },
      { id: 'ev-7', eventName: 'Madaniyat va sanʼat haftaligi', coinsAwarded: 40, date: '2026-05-18', note: 'Mahorat darsi va konsert' },
      { id: 'ev-8', eventName: 'Mustaqillik shukuhi', coinsAwarded: 40, date: '2026-09-01', note: 'Katta sahna chiqishi' },
      { id: 'ev-9', eventName: 'Ustozlar kuni bayrami', coinsAwarded: 30, date: '2026-10-01', note: 'Konsert dasturi' }
    ],
    createdAt: '2026-01-20'
  },
  {
    id: 'cre-3',
    fullName: 'Dilshodbek Qobilov',
    age: 16,
    district: 'fargona',
    districtLabel: "Farg'ona shahri",
    school: "14-umumiy o'rta ta'lim maktabi",
    bio: "Sahna mahorati, notiqlik va ijodiy ifodada tengdoshlari orasida peshqadam o'quvchi.",
    phone: '+998 94 987 65 43',
    videoType: 'telegram',
    videoUrl: 'https://t.me/madaniyat_yoshlari/104',
    videoEmbedUrl: '',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    coins: 135,
    eventsCount: 3,
    eventsHistory: [
      { id: 'ev-10', eventName: 'Yoshlar festivali', coinsAwarded: 50, date: '2026-03-27', note: 'Eng yaxshi chiqish uchun' },
      { id: 'ev-11', eventName: "Navoiyxonlik kechasi", coinsAwarded: 45, date: '2026-02-09', note: 'Maktab adabiy chiqishi' },
      { id: 'ev-12', eventName: 'Yoshlar oyligi konserti', coinsAwarded: 40, date: '2026-06-25', note: 'Sahna ko\'rinishi' }
    ],
    createdAt: '2026-02-01'
  },
  {
    id: 'cre-4',
    fullName: 'Rayhonaxon Karimova',
    age: 15,
    district: 'buxoro',
    districtLabel: 'Buxoro shahri',
    school: "22-umumiy o'rta ta'lim maktabi",
    bio: "O'zining ijodkorligi, she'riyatga mehri va faolligi bilan tanilgan namunali o'quvchi.",
    phone: '+998 91 333 44 55',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    videoEmbedUrl: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    coins: 120,
    eventsCount: 3,
    eventsHistory: [
      { id: 'ev-13', eventName: 'Kitobxonlik forumi', coinsAwarded: 40, date: '2026-04-23', note: 'Taqdimot chiqishi' },
      { id: 'ev-14', eventName: "Bahor nafasi tadbiri", coinsAwarded: 45, date: '2026-03-01', note: 'Badiiy kecha' },
      { id: 'ev-15', eventName: 'Til - millat g\'ururi kechasi', coinsAwarded: 35, date: '2026-10-21', note: 'Ifodali badiiy chiqish' }
    ],
    createdAt: '2026-02-15'
  },
  {
    id: 'cre-5',
    fullName: 'Sardorbek Olimov',
    age: 17,
    district: 'andijon',
    districtLabel: 'Andijon shahri',
    school: "35-umumiy o'rta ta'lim maktabi",
    bio: "Tadbirlarni boshqarish, boshlovchilik va jamoat ishlari bo'yicha maktab yetakchisi.",
    phone: '+998 99 876 54 32',
    videoType: 'telegram',
    videoUrl: 'https://t.me/madaniyat_yoshlari/215',
    videoEmbedUrl: '',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    coins: 105,
    eventsCount: 3,
    eventsHistory: [
      { id: 'ev-16', eventName: 'Yoshlar haftaligi festivali', coinsAwarded: 40, date: '2026-05-15', note: 'Bosh sahna boshlovchisi' },
      { id: 'ev-17', eventName: 'Maktablar ligasi finali', coinsAwarded: 35, date: '2026-06-10', note: 'Jonli dastur boshlovchisi' },
      { id: 'ev-18', eventName: 'Barkamol avlod shousi', coinsAwarded: 30, date: '2026-09-18', note: 'Konsert boshlovchisi' }
    ],
    createdAt: '2026-02-28'
  },
  {
    id: 'cre-6',
    fullName: 'Sevinch Rustamova',
    age: 15,
    district: 'urganch',
    districtLabel: 'Urganch shahri',
    school: "9-umumiy o'rta ta'lim maktabi",
    bio: "O'zbek xalq qo'shiqlari va milliy an'analarni ifodalovchi yosh iqtidor sohibasi.",
    phone: '+998 90 888 77 66',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    videoEmbedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    coins: 170,
    eventsCount: 4,
    eventsHistory: [
      { id: 'ev-19', eventName: "Lazgi ko'rik-tanlovi", coinsAwarded: 50, date: '2026-04-28', note: 'Yakkaxon chiqish va yuksak e\'tirof' },
      { id: 'ev-20', eventName: "Navro'z tarannumi", coinsAwarded: 45, date: '2026-03-21', note: 'Konsert dasturi' },
      { id: 'ev-21', eventName: 'Mustaqillik maydoni konserti', coinsAwarded: 45, date: '2026-09-01', note: 'Maktab jamoasi bilan' },
      { id: 'ev-22', eventName: 'Hunarmandlar yarmarkasi tantanasi', coinsAwarded: 30, date: '2026-10-10', note: 'Mehmonlar oldida chiqish' }
    ],
    createdAt: '2026-01-18'
  },
  {
    id: 'cre-7',
    fullName: 'Shahzoda Alimova',
    age: 16,
    district: 'qarshi',
    districtLabel: 'Qarshi shahri',
    school: "12-umumiy o'rta ta'lim maktabi",
    bio: "Maktab bayramlari va viloyat yoshlar tadbirlari faol ishtirokchisi.",
    phone: '+998 97 555 44 11',
    videoType: 'telegram',
    videoUrl: 'https://t.me/madaniyat_yoshlari/302',
    videoEmbedUrl: '',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
    coins: 145,
    eventsCount: 4,
    eventsHistory: [
      { id: 'ev-23', eventName: 'Voha tarannumi festivali', coinsAwarded: 40, date: '2026-05-02', note: 'Milliy chiqish' },
      { id: 'ev-24', eventName: 'Navro\'z sayli', coinsAwarded: 35, date: '2026-03-21', note: 'Maktab sardori' },
      { id: 'ev-25', eventName: 'Amir Temur xotira kechasi', coinsAwarded: 35, date: '2026-04-09', note: 'Tarixiy sahna chiqishi' },
      { id: 'ev-26', eventName: 'Oltin nihol musobaqasi', coinsAwarded: 35, date: '2026-09-22', note: 'G\'oliblik chiqishi' }
    ],
    createdAt: '2026-02-10'
  },
  {
    id: 'cre-8',
    fullName: 'Bekzodbek Yusupov',
    age: 17,
    district: 'namangan',
    districtLabel: 'Namangan shahri',
    school: "5-umumiy o'rta ta'lim maktabi",
    bio: "Sahna san'ati, kulgu va pantomima janrida qobiliyatli maktab o'quvchisi.",
    phone: '+998 93 222 33 44',
    videoType: 'youtube',
    videoUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    videoEmbedUrl: 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    coins: 90,
    eventsCount: 2,
    eventsHistory: [
      { id: 'ev-27', eventName: 'Quvnoqlar va zukkolar bellashuvi', coinsAwarded: 45, date: '2026-04-01', note: 'Sahna intermediyasi' },
      { id: 'ev-28', eventName: 'Bolalar kuni konserti', coinsAwarded: 45, date: '2026-06-01', note: 'Maktab chiqishi' }
    ],
    createdAt: '2026-03-05'
  }
];

// Admin tomonidan e'lon qilinadigan tanlovlar
const INITIAL_CONTESTS = [
  {
    id: 'cnt-1',
    title: "Navro'z umumxalq sayli - Maktab o'quvchilari ko'rik-tanlovi",
    awardCoins: 50,
    eventDate: '2026-03-21',
    location: "Markaziy madaniyat maydoni",
    description: "Barcha umumta'lim maktab o'quvchilari uchun saralash bosqichi. Qatnashgan har bir iqtidor egasiga 50 tanga taqdim etiladi.",
    status: 'active',
    createdAt: '2026-02-01'
  },
  {
    id: 'cnt-2',
    title: "Yosh iqtidorlar shahar festivali",
    awardCoins: 40,
    eventDate: '2026-04-15',
    location: "Yoshlar markazi bosh zali",
    description: "Tuman va shahar maktablarining faol va iqtidorli o'quvchilari o'rtasidagi ijodiy bellashuv.",
    status: 'active',
    createdAt: '2026-02-10'
  }
];

// Dastlabki Ijodiy Chellenjlar (Muddatli video rolik vazifalari)
// 7 va 12 kundan keyingi sanalar avtomatik hisoblanadi
const getFutureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const INITIAL_CHALLENGES = [
  {
    id: 'chl-1',
    title: "Vatanparvarlik va Ona Yurtim Mavzusida Video Rolik Chellenji",
    description: "Maktabingiz jamoasi yoki do'stlaringiz bilan birgalikda Vatan madhi, ifodali she'r yoki sahna ko'rinishi aks etgan 1-3 daqiqalik video rolik tayyorlang va havolasini yuboring. Pastiga rolikda qatnashgan barcha o'quvchilarni yozing!",
    awardCoins: 60,
    deadline: getFutureDate(7), // 7 kun qoldi
    totalDays: 7,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0]
  },
  {
    id: 'chl-2',
    title: "Maktabimiz Yosh Iqtidorlari va Quvnoq Sahnalar Chellenji",
    description: "Maktabingiz hayoti, iqtidorli o'quvchilar chiqishlari yoki qiziqarli ijodiy intermediyalarni videoga olib jo'nating. Admin videoni ko'rib chiqib, barcha qatnashuvchilarga tangalar taqdim etadi!",
    awardCoins: 45,
    deadline: getFutureDate(12), // 12 kun qoldi
    totalDays: 12,
    status: 'active',
    createdAt: new Date().toISOString().split('T')[0]
  }
];

// Chellenjlarga topshirilgan dastlabki namunaviy video roliklar
const INITIAL_SUBMISSIONS = [
  {
    id: 'sub-1',
    challengeId: 'chl-1',
    challengeTitle: "Vatanparvarlik va Ona Yurtim Mavzusida Video Rolik Chellenji",
    creatorId: 'cre-2',
    creatorName: 'Jasurbek Rahimov',
    creatorSchool: "28-umumiy o'rta ta'lim maktabi",
    creatorDistrict: 'Chilonzor tumani',
    creatorPhone: '+998 93 456 78 90',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoType: 'youtube',
    participants: "Jasurbek Rahimov (boshlovchi), Shahzod Aliyev (video montaj), Malika Karimova (she'r o'qigan)",
    note: "Maktabimiz bog'ida 28-maktab o'quvchilari bilan tayyorlangan maxsus kompozitsiya.",
    submittedAt: '2026-10-27',
    status: 'approved', // 'pending' yoki 'approved'
    coinsAwarded: 60,
    adminNote: "A'lo darajada sahnalashtirilgan video rolik! Barcha ishtirokchilar nomidan tangalar hisoblandi."
  }
];

// Bulutli Sinxronlash (Cloud Sync)
const CloudSync = {
  endpoint: 'https://jsonblob.com/api/jsonBlob',
  storageKeyId: STORAGE_KEY_CLOUD_ID,
  currentBlobId: null,
  isSyncing: false,
  isOnline: true,
  lastSyncTime: null,
  statusListeners: [],

  onStatusChange(fn) {
    this.statusListeners.push(fn);
  },

  notify(statusObj) {
    this.statusListeners.forEach(fn => {
      try { fn(statusObj); } catch (e) { console.error(e); }
    });
  },

  async init() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlSyncId = urlParams.get('sync');
      if (urlSyncId && urlSyncId.trim().length > 5) {
        this.currentBlobId = urlSyncId.trim();
        localStorage.setItem(this.storageKeyId, this.currentBlobId);
      } else {
        this.currentBlobId = localStorage.getItem(this.storageKeyId) || null;
      }
    } catch (e) {
      this.currentBlobId = localStorage.getItem(this.storageKeyId) || null;
    }

    if (this.currentBlobId) {
      await this.pull();
    } else {
      await this.createBlob();
    }

    setInterval(() => {
      this.pull(true);
    }, 12000);
  },

  async createBlob() {
    if (this.isSyncing) return;
    try {
      this.isSyncing = true;
      this.notify({ status: 'syncing', text: 'Serverga ulanmoqda...' });

      const payload = {
        creators: DataStore.getCreators(),
        contests: DataStore.getContests(),
        challenges: DataStore.getChallenges(),
        submissions: DataStore.getChallengeSubmissions(),
        inbox: DataStore.getAdminInbox(),
        staff: DataStore.getStaffList(),
        visitors: DataStore.getVisitorStats(),
        updatedAt: new Date().toISOString()
      };

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        let blobId = '';
        const loc = res.headers.get('Location');
        if (loc) {
          const parts = loc.split('/');
          blobId = parts[parts.length - 1];
        } else {
          const bodyData = await res.json();
          blobId = bodyData.id || '';
        }

        if (blobId) {
          this.currentBlobId = blobId;
          localStorage.setItem(this.storageKeyId, blobId);
          this.lastSyncTime = new Date();
          this.notify({ status: 'connected', text: 'Serverga ulangan', blobId: blobId });
        }
      }
    } catch (e) {
      this.notify({ status: 'offline', text: 'Oflayn (Mahalliy)' });
    } finally {
      this.isSyncing = false;
    }
  },

  async pull(isBackground = false) {
    if (!this.currentBlobId || this.isSyncing) return;
    try {
      this.isSyncing = true;
      if (!isBackground) {
        this.notify({ status: 'syncing', text: 'Serverdan yuklanmoqda...' });
      }

      const res = await fetch(`${this.endpoint}/${this.currentBlobId}`, {
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.creators)) {
          localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(data.creators));
          if (Array.isArray(data.contests)) localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(data.contests));
          if (Array.isArray(data.challenges)) localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(data.challenges));
          if (Array.isArray(data.submissions)) localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(data.submissions));
          if (Array.isArray(data.inbox)) localStorage.setItem(STORAGE_KEY_ADMIN_INBOX, JSON.stringify(data.inbox));
          if (Array.isArray(data.staff)) localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(data.staff));
          if (data.visitors) localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(data.visitors));

          this.lastSyncTime = new Date();
          this.notify({ status: 'connected', text: 'Serverga ulangan', blobId: this.currentBlobId, updated: true });
          
          if (window.App && typeof window.App.refreshAllUI === 'function') {
            window.App.refreshAllUI();
          }
        }
      }
    } catch (e) {
      if (!isBackground) {
        this.notify({ status: 'offline', text: 'Oflayn rejim' });
      }
    } finally {
      this.isSyncing = false;
    }
  },

  async push() {
    if (!this.currentBlobId) {
      await this.createBlob();
      return;
    }
    try {
      this.isSyncing = true;
      this.notify({ status: 'syncing', text: 'Serverga saqlanmoqda...' });

      const payload = {
        creators: DataStore.getCreators(),
        contests: DataStore.getContests(),
        challenges: DataStore.getChallenges(),
        submissions: DataStore.getChallengeSubmissions(),
        inbox: DataStore.getAdminInbox(),
        staff: DataStore.getStaffList(),
        visitors: DataStore.getVisitorStats(),
        updatedAt: new Date().toISOString()
      };

      const res = await fetch(`${this.endpoint}/${this.currentBlobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        this.lastSyncTime = new Date();
        this.notify({ status: 'connected', text: 'Serverga saqlandi', blobId: this.currentBlobId });
      }
    } catch (e) {
      this.notify({ status: 'offline', text: 'Mahalliy saqlandi (Oflayn)' });
    } finally {
      this.isSyncing = false;
    }
  },

  getShareUrl() {
    const base = window.location.origin + window.location.pathname;
    return this.currentBlobId ? `${base}?sync=${this.currentBlobId}` : base;
  }
};

// Data Layer funksiyalari
const DataStore = {
  init() {
    if (localStorage.getItem('ijodkor_demo_cleared') === 'true') {
      if (localStorage.getItem(STORAGE_KEY_CREATORS) === null) {
        localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify([]));
      }
    } else if (!localStorage.getItem(STORAGE_KEY_CREATORS)) {
      localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(INITIAL_CREATORS));
    }
    if (!localStorage.getItem(STORAGE_KEY_CONTESTS)) {
      localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(INITIAL_CONTESTS));
    }
    if (!localStorage.getItem(STORAGE_KEY_CHALLENGES)) {
      localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
    }
    if (!localStorage.getItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEY_ADMIN_PIN)) {
      localStorage.setItem(STORAGE_KEY_ADMIN_PIN, '7777');
    }
    if (!localStorage.getItem(STORAGE_KEY_ADMIN_NAME)) {
      localStorage.setItem(STORAGE_KEY_ADMIN_NAME, 'Madaniyat Bosh Koordinatori');
    }
    if (!localStorage.getItem(STORAGE_KEY_STAFF)) {
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify([]));
    }
    this.recordVisit();
  },

  // 1. OYLIK TASHRIF VA QIZIQIB BORUVCHILAR STATISTIKASI
  recordVisit() {
    const currentMonthKey = new Date().toISOString().slice(0, 7); // e.g. "2026-10"
    let stats = {};
    try {
      stats = JSON.parse(localStorage.getItem(STORAGE_KEY_VISITORS)) || {};
    } catch (e) {
      stats = {};
    }

    if (!stats.monthly) stats.monthly = {};
    if (!stats.monthly[currentMonthKey]) {
      stats.monthly[currentMonthKey] = 340; // Boshlang'ich qiziqish bazasi
    }

    stats.monthly[currentMonthKey] += 1;
    stats.total = (stats.total || 2450) + 1;
    stats.lastVisit = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(stats));
    return stats;
  },

  getVisitorStats() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY_VISITORS)) || {
        total: 2450,
        monthly: { "2026-10": 340 }
      };
    } catch (e) {
      return { total: 2450, monthly: {} };
    }
  },

  // 2. ADMIN PIN VA SOZLAMALARI
  getAdminPin() {
    this.init();
    return localStorage.getItem(STORAGE_KEY_ADMIN_PIN) || '7777';
  },

  setAdminPin(newPin) {
    if (!newPin || newPin.trim().length < 4) return false;
    localStorage.setItem(STORAGE_KEY_ADMIN_PIN, newPin.trim());
    return true;
  },

  verifyAdminPin(enteredPin) {
    if (!enteredPin) return false;
    return this.getAdminPin() === enteredPin.trim();
  },

  getAdminName() {
    this.init();
    return localStorage.getItem(STORAGE_KEY_ADMIN_NAME) || 'Madaniyat Bosh Koordinatori';
  },

  setAdminName(newName) {
    if (!newName || !newName.trim()) return false;
    localStorage.setItem(STORAGE_KEY_ADMIN_NAME, newName.trim());
    return true;
  },

  // 3. O'QUVCHILAR BAZASI
  getCreators() {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY_CREATORS));
      return Array.isArray(data) ? data : INITIAL_CREATORS;
    } catch (e) {
      return INITIAL_CREATORS;
    }
  },

  saveCreators(creators) {
    localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(creators));
    CloudSync.push();
  },

  getCreatorById(id) {
    const creators = this.getCreators();
    return creators.find(c => c.id === id);
  },

  getDistrictLabel(districtId) {
    if (!districtId) return "Noma'lum tuman";
    const found = TUMANLAR.find(t => t.id === districtId);
    return found ? found.name : districtId;
  },

  // Yangi o'quvchi qo'shish
  addCreator(creatorData) {
    const creators = this.getCreators();
    
    let rawVideoUrl = (creatorData.videoUrl || '').trim();
    if (rawVideoUrl && !rawVideoUrl.startsWith('http://') && !rawVideoUrl.startsWith('https://')) {
      if (rawVideoUrl.startsWith('t.me/') || rawVideoUrl.startsWith('telegram.me/')) {
        rawVideoUrl = 'https://' + rawVideoUrl;
      } else if (rawVideoUrl.includes('youtube.com') || rawVideoUrl.includes('youtu.be')) {
        rawVideoUrl = 'https://' + rawVideoUrl;
      } else if (rawVideoUrl.startsWith('@')) {
        rawVideoUrl = 'https://t.me/' + rawVideoUrl.substring(1);
      }
    }

    let videoType = creatorData.videoType || 'youtube';
    if (rawVideoUrl.includes('t.me') || rawVideoUrl.includes('telegram')) {
      videoType = 'telegram';
    }

    const distId = (creatorData.district || 'chilonzor').toLowerCase();
    const distLabel = creatorData.districtLabel || this.getDistrictLabel(distId);

    const userPhoto = (creatorData.avatarUrl && creatorData.avatarUrl.trim().length > 20)
      ? creatorData.avatarUrl.trim()
      : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80';

    const newCreator = {
      id: 'cre-' + Date.now(),
      fullName: (creatorData.fullName || '').trim() || "Yangi O'quvchi",
      age: parseInt(creatorData.age) || 16,
      district: distId,
      districtLabel: distLabel,
      school: (creatorData.school || '').trim() || "Umumiy o'rta ta'lim maktabi",
      bio: (creatorData.bio || '').trim() || "Maktabning iqtidorli o'quvchisi.",
      phone: (creatorData.phone || '').trim() || "+998 90 000 00 00",
      videoType: videoType,
      videoUrl: rawVideoUrl,
      videoEmbedUrl: this.convertVideoEmbed(rawVideoUrl),
      avatarUrl: userPhoto,
      coins: parseInt(creatorData.initialCoins) || 10,
      eventsCount: 1,
      eventsHistory: [
        {
          id: 'ev-' + Date.now(),
          eventName: "Ijodkor.uz saralash bonusi",
          coinsAwarded: parseInt(creatorData.initialCoins) || 10,
          date: new Date().toISOString().split('T')[0],
          note: "Tizimda o'zini ro'yxatdan o'tkazgani va ijodiy portfoliosi uchun"
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };

    creators.unshift(newCreator);
    this.saveCreators(creators);
    return newCreator;
  },

  // O'QUVCHI O'Z PROFILIDAGI XATOLARNI VA VIDEO SILKASINI TAHRIRLASHI
  updateCreator(id, updatedData) {
    const creators = this.getCreators();
    const index = creators.findIndex(c => c.id === id);
    if (index === -1) return null;

    let target = creators[index];

    if (updatedData.fullName) target.fullName = updatedData.fullName.trim();
    if (updatedData.age) target.age = parseInt(updatedData.age);
    if (updatedData.district) {
      target.district = updatedData.district.toLowerCase();
      target.districtLabel = updatedData.districtLabel || this.getDistrictLabel(target.district);
    }
    if (updatedData.school) target.school = updatedData.school.trim();
    if (updatedData.bio !== undefined) target.bio = updatedData.bio.trim();
    if (updatedData.avatarUrl && updatedData.avatarUrl.length > 20) {
      target.avatarUrl = updatedData.avatarUrl.trim();
    }

    // Jonli ijro video silkasini o'zgartirish
    if (updatedData.videoUrl !== undefined) {
      let rawV = updatedData.videoUrl.trim();
      if (rawV && !rawV.startsWith('http://') && !rawV.startsWith('https://')) {
        if (rawV.startsWith('t.me/') || rawV.startsWith('telegram.me/')) {
          rawV = 'https://' + rawV;
        } else if (rawV.includes('youtube.com') || rawV.includes('youtu.be')) {
          rawV = 'https://' + rawV;
        } else if (rawV.startsWith('@')) {
          rawV = 'https://t.me/' + rawV.substring(1);
        }
      }

      target.videoUrl = rawV;
      target.videoEmbedUrl = this.convertVideoEmbed(rawV);
      if (rawV.includes('t.me') || rawV.includes('telegram')) {
        target.videoType = 'telegram';
      } else {
        target.videoType = 'youtube';
      }
    }

    creators[index] = target;
    this.saveCreators(creators);
    return target;
  },

  deleteCreator(id) {
    let creators = this.getCreators();
    creators = creators.filter(c => c.id !== id);
    this.saveCreators(creators);
    return true;
  },

  clearDemoCreators() {
    const demoIds = ['cre-1', 'cre-2', 'cre-3', 'cre-4', 'cre-5', 'cre-6', 'cre-7', 'cre-8', 'cre-9', 'cre-10'];
    let creators = this.getCreators();
    creators = creators.filter(c => !demoIds.includes(c.id));
    localStorage.setItem('ijodkor_demo_cleared', 'true');
    this.saveCreators(creators);
    return true;
  },

  // Tanga taqdim etish (Admin)
  awardCoins(creatorId, eventName, coinsAmount, note) {
    const creators = this.getCreators();
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return { success: false, message: "O'quvchi topilmadi!" };

    const coinsNum = parseInt(coinsAmount);
    if (isNaN(coinsNum) || coinsNum <= 0) {
      return { success: false, message: "Tanga miqdori musbat son bo'lishi kerak!" };
    }

    creator.coins = (creator.coins || 0) + coinsNum;
    creator.eventsCount = (creator.eventsCount || 0) + 1;
    
    if (!creator.eventsHistory) creator.eventsHistory = [];
    creator.eventsHistory.unshift({
      id: 'ev-' + Date.now(),
      eventName: eventName.trim() || "Madaniy tadbir",
      coinsAwarded: coinsNum,
      date: new Date().toISOString().split('T')[0],
      note: (note || '').trim() || "Faol ijodiy chiqish uchun"
    });

    this.saveCreators(creators);
    return { success: true, creator };
  },

  // 4. MUDDATLI IJODIY CHELLENJLAR (VIDEO VAZIFALAR)
  getChallenges() {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY_CHALLENGES));
      return Array.isArray(data) ? data : INITIAL_CHALLENGES;
    } catch (e) {
      return INITIAL_CHALLENGES;
    }
  },

  addChallenge(challengeData) {
    const challenges = this.getChallenges();
    const newChallenge = {
      id: 'chl-' + Date.now(),
      title: challengeData.title.trim(),
      description: challengeData.description.trim(),
      awardCoins: parseInt(challengeData.awardCoins) || 50,
      deadline: challengeData.deadline, // e.g. "2026-11-04"
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    challenges.unshift(newChallenge);
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));
    CloudSync.push();
    return newChallenge;
  },

  deleteChallenge(id) {
    let challenges = this.getChallenges();
    challenges = challenges.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(challenges));
    CloudSync.push();
    return true;
  },

  // Chellenj muddati tugaganligini tekshirish
  isChallengeExpired(deadlineStr) {
    if (!deadlineStr) return false;
    const deadline = new Date(deadlineStr);
    deadline.setHours(23, 59, 59, 999);
    return new Date() > deadline;
  },

  getDaysLeft(deadlineStr) {
    if (!deadlineStr) return 0;
    const deadline = new Date(deadlineStr);
    deadline.setHours(23, 59, 59, 999);
    const now = new Date();
    const diffTime = deadline - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // 5. CHELLENJGA VIDEO ROLIK TOPSHIRISH VA BAHOLASH
  getChallengeSubmissions() {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS));
      return Array.isArray(data) ? data : INITIAL_SUBMISSIONS;
    } catch (e) {
      return INITIAL_SUBMISSIONS;
    }
  },

  submitChallengeVideo(subData) {
    const submissions = this.getChallengeSubmissions();

    let rawV = (subData.videoUrl || '').trim();
    if (rawV && !rawV.startsWith('http://') && !rawV.startsWith('https://')) {
      if (rawV.startsWith('t.me/') || rawV.startsWith('telegram.me/')) {
        rawV = 'https://' + rawV;
      } else if (rawV.includes('youtube.com') || rawV.includes('youtu.be')) {
        rawV = 'https://' + rawV;
      }
    }

    const newSub = {
      id: 'sub-' + Date.now(),
      challengeId: subData.challengeId,
      challengeTitle: subData.challengeTitle,
      creatorId: subData.creatorId || '',
      creatorName: subData.creatorName.trim(),
      creatorSchool: subData.creatorSchool.trim(),
      creatorDistrict: subData.creatorDistrict || '',
      creatorPhone: subData.creatorPhone || '',
      videoUrl: rawV,
      videoType: (rawV.includes('t.me') || rawV.includes('telegram')) ? 'telegram' : 'youtube',
      participants: (subData.participants || '').trim(), // Rolikda kimlar qatnashgani!
      note: (subData.note || '').trim(),
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending', // 'pending' yoki 'approved'
      coinsAwarded: 0,
      adminNote: ''
    };

    submissions.unshift(newSub);
    localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(submissions));
    CloudSync.push();
    return newSub;
  },

  // Admin chellenj videosini ko'rib chiqib tanga taqdim etishi
  approveChallengeSubmission(submissionId, coinsAmount, adminNote) {
    const submissions = this.getChallengeSubmissions();
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) return { success: false, message: "Topshiriq topilmadi!" };

    const coinsNum = parseInt(coinsAmount) || 50;
    sub.status = 'approved';
    sub.coinsAwarded = coinsNum;
    sub.adminNote = (adminNote || '').trim() || "Chellenj video vazifasi a'lo darajada bajarildi!";

    localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(submissions));

    // Agar o'quvchi bazada bo'lsa tangasini oshirish
    if (sub.creatorId) {
      this.awardCoins(sub.creatorId, `Chellenj: ${sub.challengeTitle}`, coinsNum, `Qatnashuvchilar: ${sub.participants}`);
    }

    CloudSync.push();
    return { success: true, submission: sub };
  },

  // 6. TANLOVLAR
  getContests() {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY_CONTESTS));
      return Array.isArray(data) ? data : INITIAL_CONTESTS;
    } catch (e) {
      return INITIAL_CONTESTS;
    }
  },

  addContest(contestData) {
    const contests = this.getContests();
    const newContest = {
      id: 'cnt-' + Date.now(),
      title: contestData.title.trim(),
      awardCoins: parseInt(contestData.awardCoins) || 50,
      eventDate: contestData.eventDate || new Date().toISOString().split('T')[0],
      location: (contestData.location || '').trim() || "Madaniyat saroyi",
      description: (contestData.description || '').trim() || "Madaniy tadbirda faol ishtirok eting.",
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };
    contests.unshift(newContest);
    localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(contests));
    CloudSync.push();
    return newContest;
  },

  deleteContest(id) {
    let contests = this.getContests();
    contests = contests.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(contests));
    CloudSync.push();
    return true;
  },

  // 7. REYTING
  getLeaderboard() {
    const creators = this.getCreators();
    return [...creators].sort((a, b) => (b.coins || 0) - (a.coins || 0));
  },

  convertVideoEmbed(url) {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    return '';
  },

  isPhoneRegistered(phone) {
    if (!phone) return false;
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 9) return false;

    const creators = this.getCreators();
    return creators.some(c => {
      const cPhone = (c.phone || '').replace(/\D/g, '');
      return cPhone.endsWith(cleanPhone.slice(-9)) || cleanPhone.endsWith(cPhone.slice(-9));
    });
  },

  // 8. MADANIYAT XODIMLARI (RAQAMLAR FAQAT ADMINGA KO'RINADI)
  getStaffList() {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY_STAFF));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  },

  addStaffMember(staffData) {
    const staffList = this.getStaffList();
    const existingIndex = staffList.findIndex(s => s.phone === staffData.phone);
    const newStaff = {
      id: 'stf-' + Date.now(),
      fullName: staffData.fullName.trim(),
      position: staffData.position.trim(),
      organization: staffData.organization.trim(),
      phone: staffData.phone.trim(),
      registeredAt: new Date().toISOString().split('T')[0]
    };

    if (existingIndex >= 0) {
      staffList[existingIndex] = newStaff;
    } else {
      staffList.unshift(newStaff);
    }

    localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staffList));
    CloudSync.push();
    return newStaff;
  },

  // 9. ADMIN INBOX
  sendToAdminInbox(item) {
    this.init();
    let inbox = [];
    try {
      inbox = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN_INBOX)) || [];
    } catch (e) {
      inbox = [];
    }

    const newItem = {
      id: 'inbox-' + Date.now(),
      type: item.type || 'staff',
      name: item.name,
      phone: item.phone,
      position: item.position || '',
      organization: item.organization || '',
      code: item.code,
      timestamp: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      isRead: false
    };

    inbox.unshift(newItem);
    localStorage.setItem(STORAGE_KEY_ADMIN_INBOX, JSON.stringify(inbox));
    CloudSync.push();
    return newItem;
  },

  getAdminInbox() {
    this.init();
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN_INBOX));
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  },

  deleteAdminInboxItem(id) {
    let inbox = this.getAdminInbox();
    inbox = inbox.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY_ADMIN_INBOX, JSON.stringify(inbox));
    CloudSync.push();
    return true;
  },

  // 10. ZAXIRA EKSPORT / IMPORT
  exportFullBackup() {
    return JSON.stringify({
      version: '3.0',
      exportedAt: new Date().toISOString(),
      creators: this.getCreators(),
      contests: this.getContests(),
      challenges: this.getChallenges(),
      submissions: this.getChallengeSubmissions(),
      inbox: this.getAdminInbox(),
      staff: this.getStaffList(),
      visitors: this.getVisitorStats()
    }, null, 2);
  },

  importFullBackup(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data && Array.isArray(data.creators)) {
        localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(data.creators));
        if (Array.isArray(data.contests)) localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(data.contests));
        if (Array.isArray(data.challenges)) localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(data.challenges));
        if (Array.isArray(data.submissions)) localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(data.submissions));
        if (Array.isArray(data.inbox)) localStorage.setItem(STORAGE_KEY_ADMIN_INBOX, JSON.stringify(data.inbox));
        if (Array.isArray(data.staff)) localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(data.staff));
        if (data.visitors) localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(data.visitors));
        CloudSync.push();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Zaxira tiklash xatosi:", e);
      return false;
    }
  }
};

DataStore.init();

if (typeof window !== 'undefined') {
  CloudSync.init();
}
