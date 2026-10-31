/**
 * Kelajak ijodkori - Ko'p tillilik moduli (i18n)
 * Tillari: O'zbekcha (uz), Русский (ru), English (en)
 */

const I18n = {
  currentLang: localStorage.getItem('ijodkor_lang') || 'uz',

  translations: {
    uz: {
      // Bosh sahifa va header
      app_title: "Kelajak",
      app_title_highlight: "ijodkori",
      app_subtitle: "Iqtidorli Yoshlar & Chellenjlar Portali",
      server_connected: "Server: Ulangan",
      server_sync: "Sinxronlash",
      btn_exit: "Chiqish",
      btn_edit: "Tahrirlash",
      btn_proposal: "Taklif Yuborish",
      role_admin: "Bosh Koordinator (Admin)",
      role_staff: "Xodim",
      role_student: "O'quvchi",

      // Gateway
      gateway_tagline: "Iqtidorli Maktab O'quvchilari Milliy Portali",
      gateway_desc: "Tuman va viloyat miqyosida maktab o'quvchilarining ijodiy chiqishlari, umumiy chellenjlar va madaniyat xodimlari bilan hamkorlik platformasi",
      gateway_btn_student: "O'quvchi bo'lib kirish",
      gateway_btn_student_sub: "Video roliklar topshirish, tangalar yig'ish va reytingda ko'tarilish",
      gateway_btn_staff: "Madaniyat Xodimi",
      gateway_btn_staff_sub: "O'quvchilar kontaktlarini ko'rish, tadbirlarga taklif etish va taklif kiritish",
      gateway_btn_admin: "Bosh Koordinator (Admin)",
      gateway_btn_admin_sub: "Tangalar taqdim etish, videolarni baholash va takliflarni tasdiqlash",
      gateway_footer: "© 2026 Kelajak ijodkori. Barcha huquqlar himoyalangan.",

      // Navigatsiya
      nav_creators: "O'quvchilar",
      nav_challenges: "Chellenjlar 🔥",
      nav_contests: "Tanlovlar",
      nav_leaderboard: "Reyting",
      nav_staff: "Xodimlar",
      nav_admin: "Admin Paneli",

      // 1-Bo'lim: O'quvchilar
      creators_title: "Ro'yxatdan O'tgan Maktab O'quvchilari",
      creators_subtitle: "Umumta'lim maktab o'quvchilari o'z rasmi bilan kiritilgan va tumanlar bo'yicha saralangan",
      search_placeholder: "Ism, maktab yoki tuman...",
      all_districts: "Barcha tumanlar",
      no_creators: "Hech qanday o'quvchi topilmadi",
      no_creators_sub: "Boshqa tuman tanlang yoki qidiruv so'zini o'zgartiring.",
      coins: "tanga",
      watch_video: "Videoni ko'rish",
      more_details: "Batafsil",

      // 2-Bo'lim: Chellenjlar
      challenges_title: "Umumiy Maktab Video Chellenjlari",
      challenges_subtitle: "Maktab o'quvchilari turli ijodiy yo'nalishlarda video tayyorlab, Bosh Koordinatordan tanga yutib olishadi",
      btn_submit_challenge: "Video Rolikni Topshirish",
      btn_add_challenge: "Yangi Chellenj Qo'shish",
      active_challenges: "Faol Chellenjlar",
      submissions_gallery: "Topshirilgan Video Roliklar Galereyasi",
      submissions_gallery_sub: "O'quvchilar tomonidan yuklangan va tasdiqlangan videolar",
      status_approved: "Tasdiqlangan",
      status_pending: "Kutilmoqda",

      // 3-Bo'lim: Tanlovlar
      contests_title: "Rasmiy Tanlovlar & Madaniy Tadbirlar",
      contests_subtitle: "Barcha umumta'lim maktab o'quvchilari ishtirok etishi mumkin bo'lgan dasturlar",
      btn_add_contest: "Yangi Tanlov E'loni Qo'shish",
      contest_active: "Faol Tanlov",
      contest_date: "Sanasi",
      contest_location: "Manzil",

      // 4-Bo'lim: Reyting
      leaderboard_title: "Iqtidorli O'quvchilar Milliy Reytingi",
      leaderboard_subtitle: "Chellenjlarda eng ko'p tanga to'plagan eng faol o'quvchilar",
      top_creators: "Top Ijodkorlar",

      // 5-Bo'lim: Xodimlar
      staff_title: "Madaniyat Xodimlari Xonasi",
      staff_subtitle: "Siz Navro'z, Mustaqillik, Yoshlar kuni yoki boshqa tadbirlar uchun o'quvchilarni tanlab, bevosita telefon orqali taklif qilishingiz mumkin.",
      staff_my_proposals_title: "Mening Bosh Koordinatorga Yuborgan Takliflarim",
      staff_my_proposals_subtitle: "Siz tomoningizdan kiritilgan madaniy tashabbuslar va ularning joriy holati",
      btn_send_new_proposal: "Yangi Taklif Yuborish",
      staff_contacts_title: "Madaniyat Xodimi uchun O'quvchilar Kontaktlari",
      staff_contacts_subtitle: "Barcha tumanlar bo'yicha",
      proposal_status_pending: "Taklif uchun rahmat, admin siz bilan bog'lanadi",
      proposal_status_approved: "Tabriklaymiz, taklifingiz ma'qullandi!",
      staff_invite_btn: "Taklif qilish",

      // 6-Bo'lim: Admin
      admin_title: "Admin Boshqaruvi: Tangalar, Chellenjlar & Server",
      admin_subtitle: "Chellenj roliklarini baholang, oylik tashriflar statistikasini ko'ring, xodimlarga qo'ng'iroq qiling va bulutli bazani boshqaring.",
      admin_proposals_title: "Madaniyat Xodimlaridan Kelgan Taklif va Tashabbuslar",
      admin_proposals_subtitle: "Madaniyat markazlari va soha yetakchilarining yangi tadbirlar, chellenjlar va iqtidorli o'quvchilarni tavsiya etish takliflari",
      admin_staff_title: "Ro'yxatdan O'tgan Madaniyat Xodimlari",
      admin_staff_subtitle: "Xodimlarning telefon raqamlari qonuniy talab bo'yicha FAQAT Adminga ko'rinadi",
      admin_creators_title: "Bazada Mavjud O'quvchilar Ro'yxati",
      admin_creators_subtitle: "O'quvchilar rasmi, maktabi, videolari va tangalar nazorati",
      btn_approve: "Ma'qullash",
      btn_convert_challenge: "Chellenj qilish",
      btn_convert_contest: "Tadbir qilish",
      btn_delete: "O'chirish",

      // Toasts & Dialogs
      toast_proposal_sent: "Taklif uchun rahmat, admin siz bilan bog'lanadi",
      toast_proposal_approved: "Tabriklaymiz, taklifingiz ma'qullandi!",
      toast_logged_out: "Profildan chiqildi. Bosh ekranga qaytdingiz.",
      toast_sync_done: "Barcha ma'lumotlar sinxronlandi!"
    },

    ru: {
      // Главная и хедер
      app_title: "Будущий",
      app_title_highlight: "творец",
      app_subtitle: "Портал талантливой молодежи и творческих челленджей",
      server_connected: "Сервер: Подключен",
      server_sync: "Синхронизация",
      btn_exit: "Выйти",
      btn_edit: "Изменить",
      btn_proposal: "Предложить",
      role_admin: "Главный координатор (Админ)",
      role_staff: "Сотрудник",
      role_student: "Учащийся",

      // Gateway
      gateway_tagline: "Национальный портал одаренных школьников",
      gateway_desc: "Платформа творческих выступлений школьников, масштабных челленджей и сотрудничества с работниками культуры",
      gateway_btn_student: "Войти как учащийся",
      gateway_btn_student_sub: "Сдавать видеоролики, собирать монеты и расти в рейтинге",
      gateway_btn_staff: "Сотрудник культуры",
      gateway_btn_staff_sub: "Просмотр контактов школьников, приглашение на мероприятия и подача предложений",
      gateway_btn_admin: "Главный координатор (Админ)",
      gateway_btn_admin_sub: "Начисление монет, оценка видео и утверждение предложений",
      gateway_footer: "© 2026 Будущий творец. Все права защищены.",

      // Навигация
      nav_creators: "Учащиеся",
      nav_challenges: "Челленджи 🔥",
      nav_contests: "Конкурсы",
      nav_leaderboard: "Рейтинг",
      nav_staff: "Сотрудники",
      nav_admin: "Панель админа",

      // 1-Раздел: Учащиеся
      creators_title: "Зарегистрированные школьники",
      creators_subtitle: "Учащиеся общеобразовательных школ с фото и сортировкой по районам",
      search_placeholder: "Имя, школа или район...",
      all_districts: "Все районы",
      no_creators: "Учащиеся не найдены",
      no_creators_sub: "Выберите другой район или измените поисковый запрос.",
      coins: "монет",
      watch_video: "Смотреть видео",
      more_details: "Подробнее",

      // 2-Раздел: Челленджи
      challenges_title: "Общешкольные видео-челленджи",
      challenges_subtitle: "Школьники готовят видеоролики по творческим направлениям и получают монеты от Главного координатора",
      btn_submit_challenge: "Сдать видеоролик",
      btn_add_challenge: "Добавить челлендж",
      active_challenges: "Активные челленджи",
      submissions_gallery: "Галерея сданных видеороликов",
      submissions_gallery_sub: "Видеоролики, загруженные школьниками и проверенные координатором",
      status_approved: "Одобрено",
      status_pending: "На проверке",

      // 3-Раздел: Конкурсы
      contests_title: "Официальные конкурсы и мероприятия",
      contests_subtitle: "Программы и фестивали, открытые для всех учащихся общеобразовательных школ",
      btn_add_contest: "Добавить конкурс",
      contest_active: "Активный конкурс",
      contest_date: "Дата",
      contest_location: "Место проведения",

      // 4-Раздел: Рейтинг
      leaderboard_title: "Национальный рейтинг одаренных школьников",
      leaderboard_subtitle: "Школьники, набравшие наибольшее количество монет в творческих челленджах",
      top_creators: "Топ исполнители",

      // 5-Раздел: Сотрудники
      staff_title: "Кабинет сотрудников культуры",
      staff_subtitle: "Вы можете отобрать школьников для праздничных концертов (Навруз, День независимости и др.) и пригласить по телефону.",
      staff_my_proposals_title: "Мои предложения Главному координатору",
      staff_my_proposals_subtitle: "Ваши инициативы по мероприятиям и челленджам и их текущий статус",
      btn_send_new_proposal: "Подать новое предложение",
      staff_contacts_title: "Контакты учащихся для сотрудников культуры",
      staff_contacts_subtitle: "По всем районам",
      proposal_status_pending: "Спасибо за предложение, администратор свяжется с вами",
      proposal_status_approved: "Поздравляем, ваше предложение одобрено!",
      staff_invite_btn: "Пригласить",

      // 6-Раздел: Админ
      admin_title: "Управление админа: Монеты, Челленджи и Сервер",
      admin_subtitle: "Оценивайте видеоролики, просматривайте статистику посещений, звоните сотрудникам и управляйте облачной базой.",
      admin_proposals_title: "Предложения и инициативы от сотрудников культуры",
      admin_proposals_subtitle: "Инициативы центров культуры по новым мероприятиям, челленджам и поощрению талантов",
      admin_staff_title: "Зарегистрированные сотрудники культуры",
      admin_staff_subtitle: "Номера телефонов сотрудников видны ТОЛЬКО Главному координатору",
      admin_creators_title: "Список учащихся в базе данных",
      admin_creators_subtitle: "Фотографии, школы, видео и баланс монет учащихся",
      btn_approve: "Одобрить",
      btn_convert_challenge: "Сделать челленджем",
      btn_convert_contest: "Сделать мероприятием",
      btn_delete: "Удалить",

      // Toasts & Dialogs
      toast_proposal_sent: "Спасибо за предложение, администратор свяжется с вами",
      toast_proposal_approved: "Поздравляем, ваше предложение одобрено!",
      toast_logged_out: "Вы вышли из профиля. Возврат на главный экран.",
      toast_sync_done: "Все данные успешно синхронизированы!"
    },

    en: {
      // Main & Header
      app_title: "Future",
      app_title_highlight: "Creator",
      app_subtitle: "Talented Youth & Challenges Portal",
      server_connected: "Server: Connected",
      server_sync: "Sync",
      btn_exit: "Logout",
      btn_edit: "Edit",
      btn_proposal: "Submit Proposal",
      role_admin: "Head Coordinator (Admin)",
      role_staff: "Staff",
      role_student: "Student",

      // Gateway
      gateway_tagline: "National Portal for Talented School Students",
      gateway_desc: "A creative platform connecting school students, creative challenges, and regional cultural leaders",
      gateway_btn_student: "Enter as Student",
      gateway_btn_student_sub: "Submit videos, collect coins, and climb the leaderboard",
      gateway_btn_staff: "Culture Staff",
      gateway_btn_staff_sub: "Access student contacts, invite to concerts, and submit initiatives",
      gateway_btn_admin: "Head Coordinator (Admin)",
      gateway_btn_admin_sub: "Award coins, evaluate challenge submissions, and approve initiatives",
      gateway_footer: "© 2026 Future Creator. All rights reserved.",

      // Navigation
      nav_creators: "Students",
      nav_challenges: "Challenges 🔥",
      nav_contests: "Contests",
      nav_leaderboard: "Leaderboard",
      nav_staff: "Culture Staff",
      nav_admin: "Admin Panel",

      // Section 1: Creators
      creators_title: "Registered School Students",
      creators_subtitle: "Students from public schools listed with photos and categorized by district",
      search_placeholder: "Name, school or district...",
      all_districts: "All districts",
      no_creators: "No students found",
      no_creators_sub: "Select another district or modify your search term.",
      coins: "coins",
      watch_video: "Watch Video",
      more_details: "Details",

      // Section 2: Challenges
      challenges_title: "School Creative Video Challenges",
      challenges_subtitle: "School students produce creative videos and earn coins awarded by the Head Coordinator",
      btn_submit_challenge: "Submit Video Clip",
      btn_add_challenge: "Add New Challenge",
      active_challenges: "Active Challenges",
      submissions_gallery: "Submitted Video Clips Gallery",
      submissions_gallery_sub: "Videos uploaded by students and verified by coordinator",
      status_approved: "Approved",
      status_pending: "Pending",

      // Section 3: Contests
      contests_title: "Official Contests & Cultural Events",
      contests_subtitle: "Programs open to all public school students nationwide",
      btn_add_contest: "Post New Contest",
      contest_active: "Active Contest",
      contest_date: "Date",
      contest_location: "Location",

      // Section 4: Leaderboard
      leaderboard_title: "National Talent Leaderboard",
      leaderboard_subtitle: "Top students who earned the most coins in creative challenges",
      top_creators: "Top Performers",

      // Section 5: Staff
      staff_title: "Culture Staff Cabinet",
      staff_subtitle: "Select talented students for holiday concerts (Navruz, Independence Day) and invite them directly by phone.",
      staff_my_proposals_title: "My Proposals to Head Coordinator",
      staff_my_proposals_subtitle: "Your cultural initiatives and their live review status",
      btn_send_new_proposal: "Submit New Proposal",
      staff_contacts_title: "Student Contacts for Culture Staff",
      staff_contacts_subtitle: "Across all districts",
      proposal_status_pending: "Thank you for the proposal, admin will contact you",
      proposal_status_approved: "Congratulations, your proposal has been approved!",
      staff_invite_btn: "Invite",

      // Section 6: Admin
      admin_title: "Admin Control: Coins, Challenges & Cloud Server",
      admin_subtitle: "Grade challenge submissions, review visitor analytics, call staff, and manage cloud database.",
      admin_proposals_title: "Proposals and Initiatives from Culture Staff",
      admin_proposals_subtitle: "Initiatives from regional cultural centers for new events, challenges, and nominations",
      admin_staff_title: "Registered Culture Staff",
      admin_staff_subtitle: "Staff phone numbers are strictly visible ONLY to Head Coordinator",
      admin_creators_title: "Students Database",
      admin_creators_subtitle: "Student photos, schools, videos, and coin balance management",
      btn_approve: "Approve",
      btn_convert_challenge: "Make Challenge",
      btn_convert_contest: "Make Event",
      btn_delete: "Delete",

      // Toasts & Dialogs
      toast_proposal_sent: "Thank you for the proposal, admin will contact you",
      toast_proposal_approved: "Congratulations, your proposal has been approved!",
      toast_logged_out: "Logged out. Returned to welcome screen.",
      toast_sync_done: "All data successfully synced!"
    }
  },

  init() {
    this.currentLang = localStorage.getItem('ijodkor_lang') || 'uz';
    this.applyTranslations();
    this.updateLanguageUI();
  },

  setLanguage(lang) {
    if (!this.translations[lang]) lang = 'uz';
    this.currentLang = lang;
    localStorage.setItem('ijodkor_lang', lang);
    this.applyTranslations();
    this.updateLanguageUI();
    if (window.App && typeof window.App.refreshAllUI === 'function') {
      window.App.refreshAllUI();
    }
  },

  t(key) {
    const dict = this.translations[this.currentLang] || this.translations.uz;
    return dict[key] || this.translations.uz[key] || key;
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = this.t(key);
      if (val) {
        el.textContent = val;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = this.t(key);
      if (val) {
        el.innerHTML = val;
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = this.t(key);
      if (val) {
        el.setAttribute('placeholder', val);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = this.t(key);
      if (val) {
        el.setAttribute('title', val);
      }
    });
  },

  updateLanguageUI() {
    const flags = { uz: '🇺🇿', ru: '🇷🇺', en: '🇬🇧' };
    const codes = { uz: 'UZ', ru: 'RU', en: 'EN' };

    document.querySelectorAll('.current-lang-flag').forEach(el => {
      el.textContent = flags[this.currentLang] || '🇺🇿';
    });
    document.querySelectorAll('.current-lang-code').forEach(el => {
      el.textContent = codes[this.currentLang] || 'UZ';
    });
  }
};

window.I18n = I18n;
