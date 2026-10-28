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
// Baza toza va yangi: dastlabki namuna o'quvchilar yo'q
const INITIAL_CREATORS = [];

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
// Namunaviy video roliklar tozalandi
const INITIAL_SUBMISSIONS = [];

// ==========================================================================
// GOOGLE FIREBASE REALTIME MASTER CLOUD DATABASE
// ==========================================================================

const FIREBASE_DB_URL = 'https://ijodkor-d22cd-default-rtdb.asia-southeast1.firebasedatabase.app';

const CloudSync = {
  dbUrl: FIREBASE_DB_URL,
  db: null,
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

  init() {
    this.notify({ status: 'syncing', text: 'Google Firebase ulanmoqda...', mode: 'Firebase' });

    if (typeof firebase !== 'undefined' && firebase.database) {
      try {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp({
            databaseURL: this.dbUrl
          });
        }
        this.db = firebase.database();
        this.notify({ status: 'connected', text: 'Server: Google Firebase (Ulangan)', mode: 'Firebase Cloud' });

        // 1. O'quvchilarni real vaqtda eshitish
        this.db.ref('creators').on('value', snapshot => {
          const val = snapshot.val();
          if (val) {
            const list = Object.values(val).filter(c => c && !c._deleted);
            localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(list));
            if (window.App && typeof window.App.renderCreators === 'function') {
              window.App.renderCreators();
              window.App.renderLeaderboard();
              window.App.renderAdminSection();
            }
          }
        });

        // 2. Video rolik (chellenj)larni real vaqtda eshitish
        this.db.ref('submissions').on('value', snapshot => {
          const val = snapshot.val();
          if (val) {
            const list = Object.values(val).filter(s => s && !s._deleted);
            localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(list));
            if (window.App && typeof window.App.renderChallenges === 'function') {
              window.App.renderChallenges();
              window.App.renderAdminSection();
            }
          }
        });

        // 3. Madaniyat xodimlarini real vaqtda eshitish
        this.db.ref('staff').on('value', snapshot => {
          const val = snapshot.val();
          if (val) {
            const list = Object.values(val).filter(s => s && !s._deleted);
            localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(list));
            if (window.App && typeof window.App.renderStaffSection === 'function') {
              window.App.renderStaffSection();
              window.App.renderAdminSection();
            }
          }
        });

        // 4. Tanlovlarni eshitish
        this.db.ref('contests').on('value', snapshot => {
          const val = snapshot.val();
          if (val) {
            localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(Object.values(val)));
            if (window.App && typeof window.App.renderContests === 'function') {
              window.App.renderContests();
            }
          }
        });

        // 5. Chellenjlarni eshitish
        this.db.ref('challenges').on('value', snapshot => {
          const val = snapshot.val();
          if (val) {
            localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(Object.values(val)));
            if (window.App && typeof window.App.renderChallenges === 'function') {
              window.App.renderChallenges();
            }
          }
        });

        // 6. Qiziqishlar va ko'rishlar soni
        this.db.ref('visitors').on('value', snapshot => {
          const val = snapshot.val();
          if (val && typeof val.total === 'number') {
            localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(val));
            if (window.App && typeof window.App.renderStats === 'function') {
              window.App.renderStats();
            }
          }
        });

        // 7. Admin Inbox (SMS tasdiqlash kodlari)
        this.db.ref('adminInbox').on('value', snapshot => {
          const val = snapshot.val();
          if (val) {
            localStorage.setItem(STORAGE_KEY_ADMIN_INBOX, JSON.stringify(Object.values(val)));
            if (window.App && typeof window.App.updateInboxBadge === 'function') {
              window.App.updateInboxBadge();
            }
          }
        });

        // Dastlabki sinxronlash
        setTimeout(() => {
          this.pullAndSync();
        }, 1000);

      } catch (err) {
        console.warn('Firebase SDK xatosi, REST rejimga o\'tildi:', err);
        this.initRestFallback();
      }
    } else {
      this.initRestFallback();
    }
  },

  initRestFallback() {
    this.notify({ status: 'connected', text: 'Server: Google Firebase (REST)', mode: 'REST' });
    this.pullFromRest();
    setInterval(() => {
      this.pullFromRest();
    }, 8000);
  },

  async pullFromRest() {
    try {
      const res = await fetch(`${this.dbUrl}/.json`);
      if (res.ok) {
        const root = await res.json();
        if (root) {
          if (root.creators) localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(Object.values(root.creators).filter(c => c && !c._deleted)));
          if (root.submissions) localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(Object.values(root.submissions).filter(s => s && !s._deleted)));
          if (root.staff) localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(Object.values(root.staff).filter(s => s && !s._deleted)));
          if (root.contests) localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(Object.values(root.contests)));
          if (root.challenges) localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(Object.values(root.challenges)));
          if (root.visitors) localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(root.visitors));
          if (root.adminInbox) localStorage.setItem(STORAGE_KEY_ADMIN_INBOX, JSON.stringify(Object.values(root.adminInbox)));
          if (window.App && typeof window.App.refreshAllUI === 'function') {
            window.App.refreshAllUI();
          }
        }
      }
    } catch (e) {
      console.warn('REST pull xatosi:', e);
    }
  },

  async pullAndSync() {
    if (this.db) {
      try {
        const snap = await this.db.ref('/').once('value');
        const root = snap.val();
        if (root) {
          if (root.creators) localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(Object.values(root.creators).filter(c => c && !c._deleted)));
          if (root.submissions) localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(Object.values(root.submissions).filter(s => s && !s._deleted)));
          if (root.staff) localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(Object.values(root.staff).filter(s => s && !s._deleted)));
          if (root.contests) localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(Object.values(root.contests)));
          if (root.challenges) localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(Object.values(root.challenges)));
          if (root.visitors) localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(root.visitors));
          if (root.adminInbox) localStorage.setItem(STORAGE_KEY_ADMIN_INBOX, JSON.stringify(Object.values(root.adminInbox)));
          if (window.App && typeof window.App.refreshAllUI === 'function') {
            window.App.refreshAllUI();
          }
        } else {
          // Baza bo'sh bo'lsa boshlang'ich tanlov va chellenjlarni saqlash
          this.pushAllToCloud();
        }
      } catch (e) {
        console.warn(e);
      }
    }
  },

  push() {
    this.pushAllToCloud();
  },

  pushAllToCloud() {
    try {
      const creators = DataStore.getCreators();
      const submissions = DataStore.getChallengeSubmissions();
      const staff = DataStore.getStaffList();
      const contests = DataStore.getContests();
      const challenges = DataStore.getChallenges();
      const visitors = DataStore.getVisitorStats();
      const adminInbox = JSON.parse(localStorage.getItem(STORAGE_KEY_ADMIN_INBOX) || '[]');

      const creatorsObj = {};
      creators.forEach(c => { if (c && c.id) creatorsObj[c.id] = c; });

      const submissionsObj = {};
      submissions.forEach(s => { if (s && s.id) submissionsObj[s.id] = s; });

      const staffObj = {};
      staff.forEach(st => { if (st && st.id) staffObj[st.id] = st; });

      const contestsObj = {};
      contests.forEach(cn => { if (cn && cn.id) contestsObj[cn.id] = cn; });

      const challengesObj = {};
      challenges.forEach(ch => { if (ch && ch.id) challengesObj[ch.id] = ch; });

      const inboxObj = {};
      adminInbox.forEach(m => { if (m && m.id) inboxObj[m.id] = m; });

      if (this.db) {
        if (Object.keys(creatorsObj).length > 0) this.db.ref('creators').update(creatorsObj);
        if (Object.keys(submissionsObj).length > 0) this.db.ref('submissions').update(submissionsObj);
        if (Object.keys(staffObj).length > 0) this.db.ref('staff').update(staffObj);
        if (Object.keys(contestsObj).length > 0) this.db.ref('contests').update(contestsObj);
        if (Object.keys(challengesObj).length > 0) this.db.ref('challenges').update(challengesObj);
        if (visitors && visitors.total) this.db.ref('visitors').set(visitors);
        if (Object.keys(inboxObj).length > 0) this.db.ref('adminInbox').update(inboxObj);
      } else {
        fetch(`${this.dbUrl}/.json`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            creators: creatorsObj,
            submissions: submissionsObj,
            staff: staffObj,
            contests: contestsObj,
            challenges: challengesObj,
            visitors: visitors,
            adminInbox: inboxObj
          })
        }).catch(console.warn);
      }
    } catch (e) {
      console.warn('Firebase push xatosi:', e);
    }
  },

  broadcastCreator(creator) {
    if (!creator || !creator.id) return;
    try {
      creator.updatedAt = new Date().toISOString();
      if (this.db) {
        this.db.ref('creators/' + creator.id).set(creator);
      } else {
        fetch(`${this.dbUrl}/creators/${creator.id}.json`, { method: 'PUT', body: JSON.stringify(creator) }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastDeleteCreator(creatorId) {
    if (!creatorId) return;
    try {
      if (this.db) {
        this.db.ref('creators/' + creatorId).remove();
      } else {
        fetch(`${this.dbUrl}/creators/${creatorId}.json`, { method: 'DELETE' }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastSubmission(sub) {
    if (!sub || !sub.id) return;
    try {
      sub.updatedAt = new Date().toISOString();
      if (this.db) {
        this.db.ref('submissions/' + sub.id).set(sub);
      } else {
        fetch(`${this.dbUrl}/submissions/${sub.id}.json`, { method: 'PUT', body: JSON.stringify(sub) }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastDeleteSubmission(subId) {
    if (!subId) return;
    try {
      if (this.db) {
        this.db.ref('submissions/' + subId).remove();
      } else {
        fetch(`${this.dbUrl}/submissions/${subId}.json`, { method: 'DELETE' }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastStaff(staff) {
    if (!staff || !staff.id) return;
    try {
      staff.updatedAt = new Date().toISOString();
      if (this.db) {
        this.db.ref('staff/' + staff.id).set(staff);
      } else {
        fetch(`${this.dbUrl}/staff/${staff.id}.json`, { method: 'PUT', body: JSON.stringify(staff) }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastDeleteStaff(staffId) {
    if (!staffId) return;
    try {
      if (this.db) {
        this.db.ref('staff/' + staffId).remove();
      } else {
        fetch(`${this.dbUrl}/staff/${staffId}.json`, { method: 'DELETE' }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastContest(contest) {
    if (!contest || !contest.id) return;
    try {
      if (this.db) {
        this.db.ref('contests/' + contest.id).set(contest);
      } else {
        fetch(`${this.dbUrl}/contests/${contest.id}.json`, { method: 'PUT', body: JSON.stringify(contest) }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastDeleteContest(contestId) {
    if (!contestId) return;
    try {
      if (this.db) {
        this.db.ref('contests/' + contestId).remove();
      } else {
        fetch(`${this.dbUrl}/contests/${contestId}.json`, { method: 'DELETE' }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastChallenge(challenge) {
    if (!challenge || !challenge.id) return;
    try {
      if (this.db) {
        this.db.ref('challenges/' + challenge.id).set(challenge);
      } else {
        fetch(`${this.dbUrl}/challenges/${challenge.id}.json`, { method: 'PUT', body: JSON.stringify(challenge) }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastDeleteChallenge(challengeId) {
    if (!challengeId) return;
    try {
      if (this.db) {
        this.db.ref('challenges/' + challengeId).remove();
      } else {
        fetch(`${this.dbUrl}/challenges/${challengeId}.json`, { method: 'DELETE' }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastInbox(smsItem) {
    if (!smsItem || !smsItem.id) return;
    try {
      if (this.db) {
        this.db.ref('adminInbox/' + smsItem.id).set(smsItem);
      } else {
        fetch(`${this.dbUrl}/adminInbox/${smsItem.id}.json`, { method: 'PUT', body: JSON.stringify(smsItem) }).catch(console.warn);
      }
    } catch (e) {}
  },

  broadcastVisitorVisit() {
    const currentMonthKey = new Date().toISOString().slice(0, 7);
    try {
      if (this.db) {
        this.db.ref('visitors').transaction(current => {
          current = current || { total: 0, monthly: {} };
          if (!current.monthly) current.monthly = {};
          current.monthly[currentMonthKey] = (current.monthly[currentMonthKey] || 0) + 1;
          current.total = (current.total || 0) + 1;
          current.lastVisit = new Date().toISOString();
          return current;
        });
      } else {
        fetch(`${this.dbUrl}/visitors.json`).then(r => r.json()).then(data => {
          data = data || { total: 0, monthly: {} };
          if (!data.monthly) data.monthly = {};
          data.monthly[currentMonthKey] = (data.monthly[currentMonthKey] || 0) + 1;
          data.total = (data.total || 0) + 1;
          fetch(`${this.dbUrl}/visitors.json`, { method: 'PUT', body: JSON.stringify(data) });
        }).catch(console.warn);
      }
    } catch (e) {}
  },

  async pull() {
    this.notify({ status: 'syncing', text: 'Firebase bazasidan yangilanmoqda...' });
    await this.pullAndSync();
    setTimeout(() => {
      this.notify({ status: 'connected', text: 'Server: Google Firebase (Faol)', mode: 'Firebase Cloud' });
      if (window.App && typeof window.App.refreshAllUI === 'function') {
        window.App.refreshAllUI();
      }
    }, 500);
  },

  getShareUrl() {
    return window.location.origin + window.location.pathname;
  }
};

// Data Layer funksiyalari
const DataStore = {
  init() {
    // 0. To'liq tozalash migratsiyasi: eski namuna ma'lumotlar va hisoblagichlarni batamom tozalash
    try {
      if (localStorage.getItem('ijodkor_clean_v3_fresh') !== 'done') {
        localStorage.removeItem(STORAGE_KEY_VISITORS);
        localStorage.removeItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS);
        let rawCreators = localStorage.getItem(STORAGE_KEY_CREATORS);
        if (rawCreators) {
          let creators = JSON.parse(rawCreators);
          if (Array.isArray(creators)) {
            const demoIds = ['cre-1', 'cre-2', 'cre-3', 'cre-4', 'cre-5', 'cre-6', 'cre-7', 'cre-8', 'cre-9', 'cre-10'];
            creators = creators.filter(c => c && !demoIds.includes(c.id));
            localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(creators));
          }
        }
        localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify([]));
        localStorage.setItem('ijodkor_clean_v3_fresh', 'done');
      }
    } catch (e) {
      console.warn('Migratsiya xatosi:', e);
    }

    // 1. Dastlabki namuna o'quvchilarni (cre-1...cre-10) avtomatik tozalash
    try {
      let rawCreators = localStorage.getItem(STORAGE_KEY_CREATORS);
      if (rawCreators) {
        let creators = JSON.parse(rawCreators);
        if (Array.isArray(creators)) {
          const demoIds = ['cre-1', 'cre-2', 'cre-3', 'cre-4', 'cre-5', 'cre-6', 'cre-7', 'cre-8', 'cre-9', 'cre-10'];
          const filtered = creators.filter(c => c && !demoIds.includes(c.id));
          if (filtered.length !== creators.length) {
            localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(filtered));
          }
        }
      } else {
        localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify([]));
      }
    } catch (e) {
      localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify([]));
    }

    // 2. Namuna chellenj videosini (sub-1) avtomatik tozalash
    try {
      let rawSubs = localStorage.getItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS);
      if (rawSubs) {
        let subs = JSON.parse(rawSubs);
        if (Array.isArray(subs)) {
          const filteredSubs = subs.filter(s => s && s.id !== 'sub-1' && s.creatorName !== 'Jasurbek Rahimov');
          if (filteredSubs.length !== subs.length) {
            localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(filteredSubs));
          }
        }
      } else {
        localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify([]));
      }
    } catch (e) {
      localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEY_CONTESTS)) {
      localStorage.setItem(STORAGE_KEY_CONTESTS, JSON.stringify(INITIAL_CONTESTS));
    }
    if (!localStorage.getItem(STORAGE_KEY_CHALLENGES)) {
      localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(INITIAL_CHALLENGES));
    }
    if (!localStorage.getItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS)) {
      localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify([]));
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

  // 1. OYLIK TASHRIF VA QIZIQIB BORUVCHILAR STATISTIKASI (HAQIQIY HISOB)
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
      stats.monthly[currentMonthKey] = 0;
    }

    stats.monthly[currentMonthKey] += 1;
    stats.total = (stats.total || 0) + 1;
    stats.lastVisit = new Date().toISOString();

    localStorage.setItem(STORAGE_KEY_VISITORS, JSON.stringify(stats));
    try {
      if (typeof CloudSync !== 'undefined' && CloudSync.broadcastVisitorVisit) {
        CloudSync.broadcastVisitorVisit();
      }
    } catch (e) {}
    return stats;
  },

  getVisitorStats() {
    try {
      const stats = JSON.parse(localStorage.getItem(STORAGE_KEY_VISITORS));
      if (stats && typeof stats.total === 'number') {
        return stats;
      }
      return { total: 0, monthly: {} };
    } catch (e) {
      return { total: 0, monthly: {} };
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

    // ================= MASTER SERVER INTEGRATSIYASI =================
  mergeRemoteCreator(remoteCreator) {
    if (!remoteCreator || !remoteCreator.id) return;
    const demoIds = ['cre-1', 'cre-2', 'cre-3', 'cre-4', 'cre-5', 'cre-6', 'cre-7', 'cre-8', 'cre-9', 'cre-10'];
    if (demoIds.includes(remoteCreator.id)) return;
    if (remoteCreator._deleted) {
      let creators = this.getCreators().filter(c => c.id !== remoteCreator.id);
      localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(creators));
      if (window.App && typeof window.App.refreshAllUI === 'function') {
        window.App.refreshAllUI();
      }
      return;
    }

    const creator = deserializeFromGun(remoteCreator);
    let creators = this.getCreators();
    const idx = creators.findIndex(c => c.id === creator.id);

    let changed = false;
    if (idx >= 0) {
      const local = creators[idx];
      const localTime = new Date(local.updatedAt || local.createdAt || 0).getTime();
      const remoteTime = new Date(creator.updatedAt || creator.createdAt || 0).getTime();
      if (remoteTime > localTime || (creator.coins || 0) > (local.coins || 0) || (creator.eventsCount || 0) > (local.eventsCount || 0)) {
        creators[idx] = { ...local, ...creator };
        changed = true;
      }
    } else {
      creators.unshift(creator);
      changed = true;
    }

    if (changed) {
      localStorage.setItem(STORAGE_KEY_CREATORS, JSON.stringify(creators));
      if (window.App && typeof window.App.refreshAllUI === 'function') {
        window.App.refreshAllUI();
      }
    }
  },

  mergeRemoteSubmission(remoteSub) {
    if (!remoteSub || !remoteSub.id || remoteSub._deleted) return;
    if (remoteSub.id === 'sub-1' || remoteSub.creatorName === 'Jasurbek Rahimov') return;
    let subs = this.getChallengeSubmissions();
    const idx = subs.findIndex(s => s.id === remoteSub.id);
    let changed = false;
    if (idx >= 0) {
      if (remoteSub.status === 'approved' && subs[idx].status !== 'approved') {
        subs[idx] = { ...subs[idx], ...remoteSub };
        changed = true;
      }
    } else {
      subs.unshift(remoteSub);
      changed = true;
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY_CHALLENGE_SUBMISSIONS, JSON.stringify(subs));
      if (window.App && typeof window.App.renderChallenges === 'function') {
        window.App.renderChallenges();
        window.App.renderAdminSection();
      }
    }
  },

  mergeRemoteStaff(remoteStaff) {
    if (!remoteStaff || !remoteStaff.id || remoteStaff._deleted) return;
    let staff = this.getStaffList();
    const idx = staff.findIndex(s => s.id === remoteStaff.id || (s.phone && s.phone === remoteStaff.phone));
    if (idx < 0) {
      staff.unshift(remoteStaff);
      localStorage.setItem(STORAGE_KEY_STAFF, JSON.stringify(staff));
      if (window.App && typeof window.App.renderStaffSection === 'function') {
        window.App.renderStaffSection();
        window.App.renderAdminSection();
      }
    }
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
    if (typeof CloudSync !== 'undefined' && CloudSync.broadcastInbox) {
      CloudSync.broadcastInbox(newItem);
    }
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
