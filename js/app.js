/**
 * IJODKOR.UZ - Asosiy Dastur Logikasi (App Controller)
 */

const App = {
  // Dastur holati (State)
  state: {
    currentTab: 'creators',
    selectedDistrict: 'all',
    searchQuery: '',
    selectedCreatorForVideo: null,
    staffTempAuth: null,
    studentTempAuth: null,
    studentTempPhotoBase64: null,
    editTempPhotoBase64: null
  },

  // Dasturni ishga tushirish
  init() {
    this.setupCloudSyncListener();
    this.setupPhotoUploadListener();
    this.setupEditPhotoUploadListener();
    this.renderRoleUI();
    this.renderDistrictFilters();
    this.renderCreators();
    this.renderChallenges();
    this.renderContests();
    this.renderLeaderboard();
    this.renderStaffSection();
    this.renderAdminSection();
    this.renderStats();

    // Escape bosilganda modallarni yopish
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModals();
      }
    });

    console.log("IJODKOR.UZ tizimi to'liq yuklandi!");
  },

  // ================= 1. BULUTLI SERVER VA STATISTIKA =================

  setupCloudSyncListener() {
    CloudSync.onStatusChange((info) => {
      const textEl = document.getElementById('cloud-sync-text');
      const badgeEl = document.getElementById('cloud-sync-status-badge');
      const syncIcon = document.getElementById('sync-icon');
      const adminSyncStatus = document.getElementById('admin-cloud-sync-info');

      if (info.status === 'syncing') {
        if (textEl) textEl.textContent = 'Sinxronlanmoqda...';
        if (badgeEl) badgeEl.className = "px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5";
        if (syncIcon) syncIcon.classList.add('spin-anim');
      } else if (info.status === 'connected') {
        if (textEl) textEl.textContent = 'Server: Ulangan';
        if (badgeEl) badgeEl.className = "px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5";
        if (syncIcon) syncIcon.classList.remove('spin-anim');
      } else if (info.status === 'offline') {
        if (textEl) textEl.textContent = 'Oflayn (Mahalliy)';
        if (badgeEl) badgeEl.className = "px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5";
        if (syncIcon) syncIcon.classList.remove('spin-anim');
      }

      if (adminSyncStatus) {
        adminSyncStatus.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full ${info.status === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'}"></span>
            <span class="font-bold text-slate-900">${info.text || 'Ulangan'}</span>
          </div>
          <span class="text-[11px] text-slate-400 block mt-0.5">Server ID: <code>${CloudSync.currentBlobId || 'Faol'}</code></span>
        `;
      }
    });
  },

  async handleManualSync() {
    const syncIcon = document.getElementById('sync-icon');
    if (syncIcon) syncIcon.classList.add('spin-anim');
    this.showToast("Bulutli serverdan ma'lumotlar yangilanmoqda...", "info");

    await CloudSync.pull();

    setTimeout(() => {
      if (syncIcon) syncIcon.classList.remove('spin-anim');
      this.refreshAllUI();
      this.showToast("Barcha ma'lumotlar va chellenjlar sinxronlandi!", "success");
    }, 600);
  },

  copyShareLink() {
    const shareUrl = CloudSync.getShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.showToast("Havola nusxalandi! Buni boshqa telefonga tashlang.", "success");
      });
    } else {
      prompt("Ushbu havolani nusxalab oling:", shareUrl);
    }
  },

  refreshAllUI() {
    this.renderRoleUI();
    this.renderCreators();
    this.renderChallenges();
    this.renderContests();
    this.renderLeaderboard();
    this.renderStaffSection();
    this.renderAdminSection();
    this.renderStats();
  },

  // ================= 2. FOTO YUKLASH (REGISTRATSIYA & TAHRIRLASH) =================

  setupPhotoUploadListener() {
    const input = document.getElementById('std-photo-input');
    if (!input) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      this.compressImageFile(file, (compressedBase64) => {
        this.state.studentTempPhotoBase64 = compressedBase64;
        const previewImg = document.getElementById('photo-preview-img');
        const placeholder = document.getElementById('photo-preview-placeholder');
        if (previewImg) {
          previewImg.src = compressedBase64;
          previewImg.classList.remove('hidden');
        }
        if (placeholder) {
          placeholder.classList.add('hidden');
        }
      });
    });
  },

  setupEditPhotoUploadListener() {
    const input = document.getElementById('edit-photo-input');
    if (!input) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;

      this.compressImageFile(file, (compressedBase64) => {
        this.state.editTempPhotoBase64 = compressedBase64;
        const previewImg = document.getElementById('edit-photo-preview');
        if (previewImg) {
          previewImg.src = compressedBase64;
        }
      });
    });
  },

  compressImageFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.75);
        callback(compressed);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  },

  // ================= 3. FOYDALANUVCHI SESSIYASI VA TAHRIRLASH =================

  renderRoleUI() {
    const user = Auth.getCurrentUser();
    const gatewayView = document.getElementById('view-gateway');
    const appView = document.getElementById('view-app');
    const profileBadge = document.getElementById('user-profile-badge');
    const editProfileBtn = document.getElementById('btn-edit-my-profile');
    const adminInboxBtn = document.getElementById('btn-admin-inbox');
    const adminNavBtn = document.getElementById('nav-btn-admin');

    if (Auth.isGuest()) {
      if (gatewayView) {
        gatewayView.classList.remove('hidden');
        gatewayView.classList.add('flex');
      }
      if (appView) {
        appView.classList.add('hidden');
        appView.classList.remove('flex');
      }
      return;
    }

    if (gatewayView) {
      gatewayView.classList.add('hidden');
      gatewayView.classList.remove('flex');
    }
    if (appView) {
      appView.classList.remove('hidden');
      appView.classList.add('flex');
    }

    if (Auth.isAdmin()) {
      profileBadge.innerHTML = `<i class="fa-solid fa-crown text-amber-500 text-sm"></i> <span>Bosh Koordinator (Admin)</span>`;
      profileBadge.className = "flex items-center gap-2 px-3 py-2 rounded-2xl border border-amber-300 bg-amber-50 text-xs font-black text-amber-950";
      
      if (adminNavBtn) adminNavBtn.classList.remove('hidden');
      if (editProfileBtn) editProfileBtn.classList.add('hidden');
      if (adminInboxBtn) {
        adminInboxBtn.classList.remove('hidden');
        adminInboxBtn.classList.add('flex');
        const count = DataStore.getAdminInbox().length;
        document.getElementById('admin-inbox-badge').textContent = count;
      }
    } else if (Auth.isStaff()) {
      profileBadge.innerHTML = `<i class="fa-solid fa-id-badge text-blue-500 text-sm"></i> <span>Xodim: ${user.fullName.split(' ')[0]}</span>`;
      profileBadge.className = "flex items-center gap-2 px-3 py-2 rounded-2xl border border-blue-300 bg-blue-50 text-xs font-bold text-blue-950";
      
      if (adminNavBtn) adminNavBtn.classList.add('hidden');
      if (editProfileBtn) editProfileBtn.classList.add('hidden');
      if (adminInboxBtn) adminInboxBtn.classList.add('hidden');
    } else if (Auth.isStudent()) {
      const creator = DataStore.getCreatorById(user.creatorId) || user;
      profileBadge.innerHTML = `<i class="fa-solid fa-user-graduate text-emerald-600 text-sm"></i> <span>${creator.fullName.split(' ')[0]} (🪙 ${creator.coins || 10})</span>`;
      profileBadge.className = "flex items-center gap-2 px-3 py-2 rounded-2xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-950";
      
      if (adminNavBtn) adminNavBtn.classList.add('hidden');
      if (editProfileBtn) {
        editProfileBtn.classList.remove('hidden');
        editProfileBtn.classList.add('inline-flex');
      }
      if (adminInboxBtn) adminInboxBtn.classList.add('hidden');
    }
  },

  handleLogout() {
    Auth.logout();
    this.closeAllModals();
    this.renderRoleUI();
    this.showToast("Profildan chiqildi. Asosiy 3 tugmali bosh ekranga qaytdingiz.", "info");
  },

  // O'QUVCHI PROFILINI TAHRIRLASHNI OCHISH (XATOLARNI TUZATISH, VIDEO SILKASINI O'ZGARTIRISH)
  openEditProfileModal(targetCreatorId = null) {
    const user = Auth.getCurrentUser();
    const creatorId = targetCreatorId || (user.role === 'student' ? user.creatorId : null);
    if (!creatorId) return;

    const creator = DataStore.getCreatorById(creatorId);
    if (!creator) return;

    this.state.editTempPhotoBase64 = null;

    document.getElementById('edit-fullname').value = creator.fullName;
    document.getElementById('edit-age').value = creator.age;
    document.getElementById('edit-district').value = creator.districtLabel;
    document.getElementById('edit-school').value = creator.school;
    document.getElementById('edit-video').value = creator.videoUrl;
    document.getElementById('edit-bio').value = creator.bio;

    const preview = document.getElementById('edit-photo-preview');
    if (preview) {
      preview.src = creator.avatarUrl;
    }

    this.state.targetEditCreatorId = creator.id;
    this.openModal('modal-edit-profile');
  },

  handleEditProfileSubmit(e) {
    e.preventDefault();
    const creatorId = this.state.targetEditCreatorId;
    if (!creatorId) return;

    const districtVal = document.getElementById('edit-district').value;
    const districtObj = TUMANLAR.find(t => t.name.toLowerCase() === districtVal.toLowerCase() || t.id === districtVal.toLowerCase());
    const finalDistrictId = districtObj ? districtObj.id : districtVal.toLowerCase().replace(/\s+/g, '-');
    const finalDistrictLabel = districtObj ? districtObj.name : districtVal;

    const updatedData = {
      fullName: document.getElementById('edit-fullname').value,
      age: document.getElementById('edit-age').value,
      district: finalDistrictId,
      districtLabel: finalDistrictLabel,
      school: document.getElementById('edit-school').value,
      videoUrl: document.getElementById('edit-video').value,
      bio: document.getElementById('edit-bio').value
    };

    if (this.state.editTempPhotoBase64) {
      updatedData.avatarUrl = this.state.editTempPhotoBase64;
    }

    const updated = DataStore.updateCreator(creatorId, updatedData);
    if (updated) {
      Auth.updateStudentSession(updated);
      this.closeModal('modal-edit-profile');
      this.refreshAllUI();
      this.showToast("Profilingizdagi xatolar va video silkasi muvaffaqiyatli yangilandi!", "success");
    }
  },

  // ================= 4. TAB NAVIGATSIYASI =================

  switchTab(tabName) {
    this.state.currentTab = tabName;

    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.remove('active', 'bg-emerald-700', 'text-white');
      btn.classList.add('text-slate-600');
    });

    const activeBtn = document.getElementById(`nav-btn-${tabName}`);
    if (activeBtn) {
      activeBtn.classList.add('active', 'bg-emerald-700', 'text-white');
      activeBtn.classList.remove('text-slate-600');
    }

    document.querySelectorAll('.tab-section').forEach(sec => {
      sec.classList.add('hidden');
      sec.classList.remove('block');
    });

    const activeSection = document.getElementById(`section-${tabName}`);
    if (activeSection) {
      activeSection.classList.remove('hidden');
      activeSection.classList.add('block');
    }

    if (tabName === 'challenges') {
      this.renderChallenges();
    } else if (tabName === 'contests') {
      this.renderContests();
    } else if (tabName === 'leaderboard') {
      this.renderLeaderboard();
    } else if (tabName === 'staff') {
      this.renderStaffSection();
    } else if (tabName === 'admin') {
      this.renderAdminSection();
    } else if (tabName === 'creators') {
      this.renderCreators();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  // ================= 5. ADMIN KIRISH VA SOZLAMALAR =================

  openAdminLoginModal() {
    document.getElementById('admin-pin-input').value = '';
    this.openModal('modal-admin-login');
    setTimeout(() => {
      document.getElementById('admin-pin-input').focus();
    }, 100);
  },

  handleAdminLoginSubmit(e) {
    e.preventDefault();
    const pin = document.getElementById('admin-pin-input').value;
    const res = Auth.loginAdmin(pin);

    if (res.success) {
      this.closeModal('modal-admin-login');
      this.refreshAllUI();
      this.switchTab('admin');
      this.showToast("Xush kelibsiz, Bosh Madaniyat Koordinatori!", "success");
    } else {
      this.showToast(res.message, "error");
    }
  },

  openChangePinModal() {
    if (!Auth.isAdmin()) return;
    document.getElementById('current-pin-input').value = '';
    document.getElementById('new-pin-input').value = '';
    document.getElementById('confirm-pin-input').value = '';
    this.openModal('modal-admin-change-pin');
  },

  handleChangePinSubmit(e) {
    e.preventDefault();
    const curr = document.getElementById('current-pin-input').value;
    const next = document.getElementById('new-pin-input').value;
    const confirmNext = document.getElementById('confirm-pin-input').value;

    if (next !== confirmNext) {
      this.showToast("Yangi kodlar bir-biriga mos kelmadi!", "error");
      return;
    }

    const res = Auth.changeAdminPin(curr, next);
    if (res.success) {
      this.closeModal('modal-admin-change-pin');
      this.showToast("Admin maxfiy kodi yangilandi!", "success");
    } else {
      this.showToast(res.message, "error");
    }
  },

  openAdminInboxModal() {
    const container = document.getElementById('admin-inbox-items-container');
    const items = DataStore.getAdminInbox();

    if (items.length === 0) {
      container.innerHTML = `
        <div class="p-8 text-center text-slate-400">
          <i class="fa-solid fa-inbox text-3xl mb-2 text-slate-300"></i>
          <p class="text-xs">Hozircha yangi so'rovlar yoki tasdiq kodlari yo'q.</p>
        </div>
      `;
    } else {
      container.innerHTML = items.map(item => `
        <div class="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start justify-between gap-3 text-xs">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold ${item.type === 'staff' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}">
                ${item.type === 'staff' ? 'Madaniyat Xodimi' : 'Maktab O\'quvchisi'}
              </span>
              <span class="text-slate-400 text-[10px]">${item.timestamp}</span>
            </div>
            <h4 class="font-bold text-slate-900 mt-1">${item.name}</h4>
            <p class="text-slate-600">${item.position ? item.position + ' • ' : ''}${item.phone}</p>
          </div>
          <div class="text-right shrink-0">
            <span class="text-[10px] text-slate-500 block">Tasdiqlash Kodi:</span>
            <span class="text-xl font-black text-amber-700 bg-amber-200/70 px-3 py-1 rounded-xl inline-block mt-0.5 tracking-widest">${item.code}</span>
            <button onclick="App.deleteInboxItem('${item.id}')" class="block text-[11px] text-red-500 hover:text-red-700 mt-1.5 ml-auto">
              <i class="fa-solid fa-trash mr-1"></i> O'chirish
            </button>
          </div>
        </div>
      `).join('');
    }

    this.openModal('modal-admin-inbox');
  },

  deleteInboxItem(id) {
    DataStore.deleteAdminInboxItem(id);
    this.openAdminInboxModal();
    this.renderRoleUI();
  },

  // ================= 6. MADANIYAT XODIMI KIRISHI =================

  openStaffAuthModal() {
    this.resetStaffAuthStep();
    this.openModal('modal-staff-auth');
  },

  resetStaffAuthStep() {
    document.getElementById('staff-auth-step1').classList.remove('hidden');
    document.getElementById('staff-auth-step2').classList.add('hidden');
    const input = document.getElementById('staff-verify-code-input');
    if (input) input.value = '';
    this.state.staffTempAuth = null;
  },

  handleStaffRequestCode(e) {
    e.preventDefault();
    const staffData = {
      fullName: document.getElementById('staff-fullname').value,
      organization: document.getElementById('staff-org').value,
      position: document.getElementById('staff-position').value,
      phone: document.getElementById('staff-phone').value
    };

    const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
    this.state.staffTempAuth = {
      code: generatedCode,
      data: staffData
    };

    DataStore.sendToAdminInbox({
      type: 'staff',
      name: staffData.fullName,
      phone: staffData.phone,
      position: staffData.position,
      organization: staffData.organization,
      code: generatedCode
    });

    document.getElementById('staff-auth-step1').classList.add('hidden');
    document.getElementById('staff-auth-step2').classList.remove('hidden');

    this.showToast("Tasdiqlash kodi Bosh Koordinatorning shaxsiy profiliga yuborildi!", "info");
  },

  handleStaffVerifyCode() {
    const entered = (document.getElementById('staff-verify-code-input').value || '').trim();
    if (!this.state.staffTempAuth) return;

    if (entered === this.state.staffTempAuth.code) {
      const res = Auth.loginStaff(this.state.staffTempAuth.data);
      this.closeModal('modal-staff-auth');
      this.refreshAllUI();
      this.switchTab('staff');
      this.showToast(`Xush kelibsiz, Madaniyat xodimi: ${res.user.fullName}!`, "success");
    } else {
      this.showToast("Kiritilgan ID-kod noto'g'ri!", "error");
    }
  },

  // ================= 7. O'QUVCHI REGISTRATSIYASI =================

  openStudentAuthModal() {
    this.resetStudentAuthStep();
    this.openModal('modal-student-auth');
  },

  resetStudentAuthStep() {
    document.getElementById('student-auth-step1').classList.remove('hidden');
    document.getElementById('student-auth-step2').classList.add('hidden');
    const input = document.getElementById('student-verify-code-input');
    if (input) input.value = '';
    this.state.studentTempAuth = null;
    this.state.studentTempPhotoBase64 = null;

    const previewImg = document.getElementById('photo-preview-img');
    const placeholder = document.getElementById('photo-preview-placeholder');
    if (previewImg) {
      previewImg.src = '';
      previewImg.classList.add('hidden');
    }
    if (placeholder) {
      placeholder.classList.remove('hidden');
    }
    const photoInput = document.getElementById('std-photo-input');
    if (photoInput) photoInput.value = '';
  },

  handleStudentRequestSms(e) {
    e.preventDefault();
    const phoneInput = document.getElementById('std-phone').value;

    if (DataStore.isPhoneRegistered(phoneInput)) {
      this.showToast("Ushbu telefon raqam bilan avval profil ochilgan! Bitta raqamga faqat bitta profil yaratish mumkin.", "error");
      return;
    }

    if (!this.state.studentTempPhotoBase64) {
      this.showToast("Iltimos, o'zingizning rasmingizni yuklang (Galereya yoki kameradan)!", "error");
      return;
    }

    const districtVal = document.getElementById('std-district').value;
    const districtObj = TUMANLAR.find(t => t.name.toLowerCase() === districtVal.toLowerCase() || t.id === districtVal.toLowerCase());
    const finalDistrictId = districtObj ? districtObj.id : districtVal.toLowerCase().replace(/\s+/g, '-');
    const finalDistrictLabel = districtObj ? districtObj.name : districtVal;

    const studentData = {
      fullName: document.getElementById('std-fullname').value,
      age: document.getElementById('std-age').value,
      district: finalDistrictId,
      districtLabel: finalDistrictLabel,
      school: document.getElementById('std-school').value,
      videoUrl: document.getElementById('std-video').value,
      bio: document.getElementById('std-bio').value,
      phone: phoneInput,
      avatarUrl: this.state.studentTempPhotoBase64,
      initialCoins: 10
    };

    const generatedSms = String(Math.floor(1000 + Math.random() * 9000));
    this.state.studentTempAuth = {
      code: generatedSms,
      data: studentData
    };

    DataStore.sendToAdminInbox({
      type: 'student',
      name: studentData.fullName,
      phone: studentData.phone,
      position: `${studentData.school} (${studentData.districtLabel})`,
      code: generatedSms
    });

    document.getElementById('student-auth-step1').classList.add('hidden');
    document.getElementById('student-auth-step2').classList.remove('hidden');

    const hint = document.getElementById('student-sms-hint-text');
    if (hint) {
      hint.textContent = `${studentData.phone} raqamiga tasdiqlash kodi yuborildi (Sinov kodi: ${generatedSms})`;
    }

    this.showToast(`Tasdiqlash kodi Adminga va raqamingizga yuborildi: [${generatedSms}]`, "info");
  },

  handleStudentVerifyCode() {
    const entered = (document.getElementById('student-verify-code-input').value || '').trim();
    if (!this.state.studentTempAuth) return;

    if (entered === this.state.studentTempAuth.code) {
      const newCreator = DataStore.addCreator(this.state.studentTempAuth.data);
      Auth.loginStudent(newCreator);

      this.closeModal('modal-student-auth');
      this.refreshAllUI();
      this.switchTab('creators');

      this.showToast(`Tabriklaymiz, ${newCreator.fullName}! Profilingiz yaratildi va +10 tanga berildi!`, "success");
    } else {
      this.showToast("Kiritilgan tasdiq kodi noto'g'ri!", "error");
    }
  },

  // ================= 8. CHELLENJLAR (VIDEO VAZIFALAR & DEDLAYN) =================

  renderChallenges() {
    const grid = document.getElementById('challenges-grid');
    const adminAction = document.getElementById('challenge-admin-action-block');
    const submissionsGrid = document.getElementById('challenge-submissions-grid');
    if (!grid) return;

    const challenges = DataStore.getChallenges();
    const isAdmin = Auth.isAdmin();

    if (adminAction) {
      if (isAdmin) {
        adminAction.innerHTML = `
          <button onclick="App.openAddChallengeModal()" class="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2">
            <i class="fa-solid fa-plus-circle text-base"></i> Yangi Chellenj E'lon Qilish
          </button>
        `;
      } else {
        adminAction.innerHTML = '';
      }
    }

    grid.innerHTML = challenges.map(chl => {
      const isExpired = DataStore.isChallengeExpired(chl.deadline);
      const daysLeft = DataStore.getDaysLeft(chl.deadline);

      let statusBadge = '';
      let submitButton = '';

      if (isExpired) {
        statusBadge = `
          <span class="px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
            <i class="fa-solid fa-circle-xmark"></i> Qabul Muddati Tugagan
          </span>
        `;
        submitButton = `
          <button disabled class="w-full py-3 bg-slate-200 text-slate-400 font-bold rounded-2xl text-xs cursor-not-allowed">
            ⛔ Qabul muddati o'tib ketgan
          </button>
        `;
      } else {
        statusBadge = `
          <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
            <i class="fa-solid fa-clock"></i> ${daysLeft} kun qoldi (${chl.deadline} gacha)
          </span>
        `;
        submitButton = `
          <button onclick="App.openSubmitChallengeModal('${chl.id}')" class="w-full py-3 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2">
            <i class="fa-solid fa-cloud-arrow-up text-sm"></i> Video Rolikni Topshirish
          </button>
        `;
      }

      return `
        <div class="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition">
          <div>
            <div class="flex items-center justify-between gap-2 flex-wrap">
              ${statusBadge}
              <span class="font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-xs flex items-center gap-1">
                🪙 +${chl.awardCoins} tanga
              </span>
            </div>

            <h3 class="text-lg font-black text-slate-900 mt-3 leading-snug">
              ${chl.title}
            </h3>

            <p class="text-xs text-slate-600 mt-3 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              ${chl.description}
            </p>
          </div>

          <div class="mt-5 pt-4 border-t border-slate-100 space-y-3">
            ${submitButton}
            ${isAdmin ? `
              <div class="text-right">
                <button onclick="App.handleDeleteChallenge('${chl.id}')" class="text-xs text-red-500 hover:text-red-700 font-bold">
                  <i class="fa-solid fa-trash mr-1"></i> Chellenjni o'chirish
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Topshirilgan video roliklar galereyasi
    if (submissionsGrid) {
      const submissions = DataStore.getChallengeSubmissions();
      if (submissions.length === 0) {
        submissionsGrid.innerHTML = `
          <div class="col-span-full py-8 text-center text-slate-400 text-xs">
            Hozircha chellenj bo'yicha video roliklar topshirilmagan.
          </div>
        `;
      } else {
        submissionsGrid.innerHTML = submissions.map(sub => `
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-xs space-y-3">
            <div>
              <div class="flex items-center justify-between gap-2">
                <span class="font-bold text-slate-900 truncate">${sub.creatorName}</span>
                ${sub.status === 'approved' ? `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                    🪙 +${sub.coinsAwarded} berildi
                  </span>
                ` : `
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    ⏳ Ko'rib chiqilmoqda
                  </span>
                `}
              </div>
              <span class="text-[11px] text-slate-500 block truncate">${sub.creatorSchool}</span>
              <p class="text-[11px] font-semibold text-rose-700 mt-1 truncate">🎯 ${sub.challengeTitle}</p>

              <!-- KIMLAR QATNASHGANI -->
              <div class="mt-2.5 p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-700">
                <span class="font-bold text-slate-900 block mb-0.5"><i class="fa-solid fa-users mr-1 text-red-500"></i> Rolikda qatnashganlar:</span>
                ${sub.participants}
              </div>
            </div>

            <div class="pt-2 border-t border-slate-200 flex items-center justify-between">
              <a href="${sub.videoUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5">
                <i class="fa-solid fa-play text-red-400 text-[10px]"></i> Videoni Ko'rish
              </a>
              <span class="text-[10px] text-slate-400">${sub.submittedAt}</span>
            </div>
          </div>
        `).join('');
      }
    }
  },

  openSubmitChallengeModal(challengeId) {
    const chl = DataStore.getChallenges().find(c => c.id === challengeId);
    if (!chl) return;

    if (DataStore.isChallengeExpired(chl.deadline)) {
      this.showToast("Ushbu chellenjning qabul qilish muddati tugagan!", "error");
      return;
    }

    document.getElementById('submit-challenge-id').value = chl.id;
    document.getElementById('submit-challenge-title-text').textContent = chl.title;

    const user = Auth.getCurrentUser();
    if (user.role === 'student') {
      const creator = DataStore.getCreatorById(user.creatorId) || user;
      document.getElementById('sub-creator-name').value = creator.fullName;
      document.getElementById('sub-creator-school').value = creator.school;
    } else {
      document.getElementById('sub-creator-name').value = '';
      document.getElementById('sub-creator-school').value = '';
    }

    document.getElementById('sub-video-url').value = '';
    document.getElementById('sub-participants').value = '';
    document.getElementById('sub-note').value = '';

    this.openModal('modal-submit-challenge');
  },

  handleSubmitChallenge(e) {
    e.preventDefault();
    const challengeId = document.getElementById('submit-challenge-id').value;
    const chl = DataStore.getChallenges().find(c => c.id === challengeId);
    if (!chl) return;

    const user = Auth.getCurrentUser();
    const subData = {
      challengeId: chl.id,
      challengeTitle: chl.title,
      creatorId: user.role === 'student' ? user.creatorId : '',
      creatorName: document.getElementById('sub-creator-name').value,
      creatorSchool: document.getElementById('sub-creator-school').value,
      creatorDistrict: user.districtLabel || '',
      creatorPhone: user.phone || '',
      videoUrl: document.getElementById('sub-video-url').value,
      participants: document.getElementById('sub-participants').value,
      note: document.getElementById('sub-note').value
    };

    DataStore.submitChallengeVideo(subData);
    this.closeModal('modal-submit-challenge');
    this.renderChallenges();
    this.showToast("Video rolik topshirildi! Admin ko'rib chiqib tangalarni taqdim etadi.", "success");
  },

  openAddChallengeModal() {
    if (!Auth.isAdmin()) return;
    document.getElementById('chl-title').value = '';
    document.getElementById('chl-coins').value = '50';
    document.getElementById('chl-desc').value = '';

    // 7 kundan keyingi sanani default qo'yish
    const d = new Date();
    d.setDate(d.getDate() + 7);
    document.getElementById('chl-deadline').value = d.toISOString().split('T')[0];

    this.openModal('modal-add-challenge');
  },

  handleAddChallengeSubmit(e) {
    e.preventDefault();
    const chlData = {
      title: document.getElementById('chl-title').value,
      coins: document.getElementById('chl-coins').value,
      deadline: document.getElementById('chl-deadline').value,
      description: document.getElementById('chl-desc').value
    };

    DataStore.addChallenge(chlData);
    this.closeModal('modal-add-challenge');
    this.renderChallenges();
    this.showToast("Yangi chellenj e'lon qilindi!", "success");
  },

  handleDeleteChallenge(id) {
    if (!Auth.isAdmin()) return;
    if (confirm("Ushbu chellenjni o'chirmoqchimisiz?")) {
      DataStore.deleteChallenge(id);
      this.renderChallenges();
      this.showToast("Chellenj o'chirildi.", "info");
    }
  },

  // ================= 9. CHELLENJ VIDEOLARINI ADMIN BAHOLASHI =================

  openReviewSubmissionModal(submissionId) {
    if (!Auth.isAdmin()) return;
    const sub = DataStore.getChallengeSubmissions().find(s => s.id === submissionId);
    if (!sub) return;

    document.getElementById('review-submission-id').value = sub.id;
    document.getElementById('review-coins-amount').value = sub.coinsAwarded || 50;

    const content = document.getElementById('review-submission-content');
    content.innerHTML = `
      <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
        <div>
          <span class="text-slate-500 block">Topshirgan o'quvchi:</span>
          <span class="font-bold text-slate-900 text-sm">${sub.creatorName}</span> (${sub.creatorSchool})
        </div>
        <div>
          <span class="text-slate-500 block">Chellenj:</span>
          <span class="font-bold text-rose-700">${sub.challengeTitle}</span>
        </div>
        <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl">
          <span class="font-black text-amber-900 block mb-1">Rolikda qatnashgan barcha ishtirokchilar:</span>
          <p class="text-slate-800">${sub.participants}</p>
        </div>
        <div class="pt-2">
          <a href="${sub.videoUrl}" target="_blank" rel="noopener noreferrer" class="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold inline-flex items-center gap-2">
            <i class="fa-solid fa-play text-red-400"></i> Videoni Asl Manbada Ochib Ko'rish
          </a>
        </div>
      </div>
    `;

    this.openModal('modal-review-submission');
  },

  handleApproveSubmissionSubmit(e) {
    e.preventDefault();
    const subId = document.getElementById('review-submission-id').value;
    const coins = document.getElementById('review-coins-amount').value;
    const note = document.getElementById('review-admin-note').value;

    const res = DataStore.approveChallengeSubmission(subId, coins, note);
    if (res.success) {
      this.closeModal('modal-review-submission');
      this.refreshAllUI();
      this.showToast(`🪙 ${coins} tanga muvaffaqiyatli taqdim etildi va chellenj tasdiqlandi!`, "success");
    }
  },

  // ================= 10. TANLOVLAR =================

  renderContests() {
    const grid = document.getElementById('contests-grid');
    const adminAction = document.getElementById('contest-admin-action-block');
    if (!grid) return;

    const contests = DataStore.getContests();
    const isAdmin = Auth.isAdmin();

    if (adminAction) {
      if (isAdmin) {
        adminAction.innerHTML = `
          <button onclick="App.openAddContestModal()" class="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition flex items-center gap-2">
            <i class="fa-solid fa-plus-circle text-base"></i> Yangi Tanlov E'loni Qo'shish
          </button>
        `;
      } else {
        adminAction.innerHTML = '';
      }
    }

    grid.innerHTML = contests.map(c => `
      <div class="bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition">
        <div>
          <div class="flex items-center justify-between gap-2">
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <i class="fa-solid fa-school mr-1"></i> Barcha Umumta'lim Maktablar Uchun
            </span>
            <span class="font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-xs flex items-center gap-1">
              🪙 +${c.awardCoins} tanga
            </span>
          </div>

          <h3 class="text-lg font-black text-slate-900 mt-3 leading-snug">
            ${c.title}
          </h3>

          <div class="mt-3 space-y-1.5 text-xs text-slate-500">
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-calendar-days text-emerald-600"></i>
              <span>Sanasi: <strong>${c.eventDate}</strong></span>
            </div>
            <div class="flex items-center gap-2">
              <i class="fa-solid fa-location-dot text-red-500"></i>
              <span>Manzil: <strong>${c.location}</strong></span>
            </div>
          </div>

          <p class="text-xs text-slate-600 mt-3 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
            ${c.description}
          </p>
        </div>

        <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-[10px] text-slate-400">Bosh Koordinator tomonidan tasdiqlangan</span>
          ${isAdmin ? `
            <button onclick="App.handleDeleteContest('${c.id}')" class="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1">
              <i class="fa-solid fa-trash"></i> O'chirish
            </button>
          ` : `
            <span class="text-xs text-emerald-700 font-bold">Faol Tanlov</span>
          `}
        </div>
      </div>
    `).join('');
  },

  openAddContestModal() {
    if (!Auth.isAdmin()) return;
    document.getElementById('contest-title').value = '';
    document.getElementById('contest-coins').value = '50';
    document.getElementById('contest-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('contest-location').value = '';
    document.getElementById('contest-desc').value = '';
    this.openModal('modal-add-contest');
  },

  handleAddContestSubmit(e) {
    e.preventDefault();
    const contestData = {
      title: document.getElementById('contest-title').value,
      awardCoins: document.getElementById('contest-coins').value,
      eventDate: document.getElementById('contest-date').value,
      location: document.getElementById('contest-location').value,
      description: document.getElementById('contest-desc').value
    };

    DataStore.addContest(contestData);
    this.closeModal('modal-add-contest');
    this.renderContests();
    this.showToast("Yangi tanlov e'loni joylashtirildi!", "success");
  },

  handleDeleteContest(id) {
    if (!Auth.isAdmin()) return;
    if (confirm("Ushbu tanlov e'lonini ro'yxatdan o'chirmoqchimisiz?")) {
      DataStore.deleteContest(id);
      this.renderContests();
      this.showToast("Tanlov o'chirildi.", "info");
    }
  },

  // ================= 11. TUMANLAR VA O'QUVCHILAR =================

  renderDistrictFilters() {
    const container = document.getElementById('district-filter-buttons');
    const selectFilter = document.getElementById('district-select-filter');
    const datalist = document.getElementById('tumanlar-datalist');
    
    if (datalist) {
      datalist.innerHTML = TUMANLAR.filter(t => t.id !== 'all').map(t => `
        <option value="${t.name}">
      `).join('');
    }

    if (selectFilter) {
      selectFilter.innerHTML = TUMANLAR.map(t => `
        <option value="${t.id}" ${this.state.selectedDistrict === t.id ? 'selected' : ''}>
          ${t.icon} ${t.name}
        </option>
      `).join('');
    }

    if (!container) return;

    const popularDistricts = TUMANLAR.slice(0, 14);

    container.innerHTML = popularDistricts.map(t => {
      const isActive = this.state.selectedDistrict === t.id;
      const activeClass = isActive 
        ? 'bg-emerald-700 text-white shadow-sm' 
        : 'bg-slate-100 hover:bg-slate-200 text-slate-700';

      return `
        <button onclick="App.setDistrict('${t.id}')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${activeClass}">
          <span>${t.icon}</span>
          <span>${t.name}</span>
        </button>
      `;
    }).join('');
  },

  setDistrict(districtId) {
    this.state.selectedDistrict = districtId;
    const selectFilter = document.getElementById('district-select-filter');
    if (selectFilter) selectFilter.value = districtId;
    this.renderDistrictFilters();
    this.renderCreators();
  },

  handleSelectDistrictChange(e) {
    this.setDistrict(e.target.value);
  },

  handleFilterChange() {
    const input = document.getElementById('search-input');
    this.state.searchQuery = input ? input.value.trim().toLowerCase() : '';
    this.renderCreators();
  },

  renderCreators() {
    const container = document.getElementById('creators-grid');
    const noMsg = document.getElementById('no-creators-msg');
    if (!container) return;

    let creators = DataStore.getCreators();

    if (this.state.selectedDistrict !== 'all') {
      creators = creators.filter(c => c.district === this.state.selectedDistrict);
    }

    if (this.state.searchQuery) {
      const q = this.state.searchQuery;
      creators = creators.filter(c => 
        c.fullName.toLowerCase().includes(q) ||
        c.school.toLowerCase().includes(q) ||
        (c.districtLabel && c.districtLabel.toLowerCase().includes(q)) ||
        c.bio.toLowerCase().includes(q)
      );
    }

    if (creators.length === 0) {
      container.innerHTML = '';
      if (noMsg) noMsg.classList.remove('hidden');
      return;
    }

    if (noMsg) noMsg.classList.add('hidden');
    const isStaffOrAdmin = Auth.isStaff();
    const isAdmin = Auth.isAdmin();
    const currentUser = Auth.getCurrentUser();

    container.innerHTML = creators.map(creator => {
      let phoneBlock = '';
      if (isStaffOrAdmin) {
        phoneBlock = `
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-[10px] text-slate-400 block font-medium">Telefon (Xodim va Admin):</span>
              <a href="tel:${creator.phone}" class="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">
                <i class="fa-solid fa-phone text-[10px]"></i> ${creator.phone}
              </a>
            </div>
            <button onclick="App.openInviteModal('${creator.id}')" class="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition">
              Taklif etish
            </button>
          </div>
        `;
      } else {
        phoneBlock = `
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span class="text-slate-400 text-[11px] flex items-center gap-1">
              <i class="fa-solid fa-lock text-slate-400"></i> Telefon yopiq
            </span>
            <span class="text-slate-400 text-[10px]">Faqat xodim va admin uchun</span>
          </div>
        `;
      }

      const isMyProfile = (currentUser.role === 'student' && currentUser.creatorId === creator.id) || isAdmin;
      let editBtn = '';
      if (isMyProfile) {
        editBtn = `
          <button onclick="App.openEditProfileModal('${creator.id}')" class="p-1 text-slate-400 hover:text-emerald-700 text-xs" title="Profilni tahrirlash">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
        `;
      }

      let adminActions = '';
      if (isAdmin) {
        adminActions = `
          <div class="mt-2 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between">
            <button onclick="App.openAwardModal('${creator.id}')" class="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1">
              <i class="fa-solid fa-coins"></i> +Tanga
            </button>
            <button onclick="App.handleDeleteCreator('${creator.id}')" class="text-xs text-red-400 hover:text-red-600" title="O'chirish">
              <i class="fa-solid fa-trash"></i> O'chirish
            </button>
          </div>
        `;
      }

      return `
        <div class="creator-card bg-white rounded-3xl border border-slate-200 p-5 flex flex-col justify-between shadow-sm relative group">
          <div>
            <div class="flex items-start gap-3.5">
              <div class="relative shrink-0">
                <img src="${creator.avatarUrl}" alt="${creator.fullName}" class="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'">
                <span class="absolute -bottom-1 -right-1 text-xs bg-white rounded-full p-0.5 shadow-sm">📍</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold badge-district truncate">
                    <i class="fa-solid fa-location-dot mr-1"></i>${creator.districtLabel || 'Tuman'}
                  </span>
                  ${editBtn}
                </div>
                <h3 class="text-base font-bold text-slate-900 mt-1 truncate hover:text-emerald-700 cursor-pointer" onclick="App.openCreatorDetail('${creator.id}')">
                  ${creator.fullName}
                </h3>
                <p class="text-xs text-slate-500 truncate mt-0.5 font-medium">
                  <i class="fa-solid fa-school text-[10px] mr-1 text-slate-400"></i>${creator.school}
                </p>
              </div>
            </div>

            <div class="mt-4 flex items-center justify-between bg-amber-50 border border-amber-200/80 rounded-2xl px-3.5 py-2">
              <div class="flex items-center gap-2">
                <span class="text-xl coin-icon-pulse">🪙</span>
                <div>
                  <span class="text-xs text-amber-950 font-black tracking-tight">${creator.coins} TANGA</span>
                  <span class="text-[10px] text-amber-800 block">${creator.eventsCount} ta tadbir / chellenj</span>
                </div>
              </div>
              <span class="text-[10px] font-black text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                Faol
              </span>
            </div>

            <p class="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
              ${creator.bio}
            </p>
          </div>

          <div class="mt-4">
            <div class="grid grid-cols-2 gap-2">
              <button onclick="App.openVideoModal('${creator.id}')" class="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-sm">
                <i class="fa-solid fa-play text-red-400 text-[10px]"></i> Jonli Ijro
              </button>
              <button onclick="App.openCreatorDetail('${creator.id}')" class="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition">
                <i class="fa-solid fa-circle-info text-slate-500 text-[10px]"></i> Tarjimai hol
              </button>
            </div>

            ${phoneBlock}
            ${adminActions}
          </div>
        </div>
      `;
    }).join('');
  },

  // ================= 12. REYTING JADVALI =================

  renderLeaderboard() {
    const podiumContainer = document.getElementById('podium-container');
    const tableBody = document.getElementById('leaderboard-table-body');
    if (!podiumContainer || !tableBody) return;

    const leaderboard = DataStore.getLeaderboard();

    if (leaderboard.length >= 3) {
      const first = leaderboard[0];
      const second = leaderboard[1];
      const third = leaderboard[2];

      podiumContainer.innerHTML = `
        <div class="podium-card podium-2 p-5 rounded-3xl text-center flex flex-col justify-between order-2 md:order-1 h-[270px]">
          <div>
            <div class="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-black mx-auto mb-2 text-sm border-2 border-white shadow-sm">
              2
            </div>
            <img src="${second.avatarUrl}" class="w-16 h-16 rounded-full mx-auto object-cover border-2 border-slate-300 shadow-sm mb-2" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'">
            <h4 class="font-bold text-slate-900 text-sm truncate">${second.fullName}</h4>
            <span class="text-[11px] text-slate-500 block truncate">${second.school} • ${second.districtLabel}</span>
          </div>
          <div class="mt-2 bg-slate-100 py-2 rounded-2xl">
            <span class="text-sm font-black text-slate-800">🪙 ${second.coins} Tanga</span>
            <span class="text-[10px] text-slate-500 block">${second.eventsCount} ta tadbir</span>
          </div>
        </div>

        <div class="podium-card podium-1 p-6 rounded-3xl text-center flex flex-col justify-between order-1 md:order-2 h-[310px] shadow-lg shadow-amber-500/10">
          <div>
            <div class="w-12 h-12 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black mx-auto mb-2 text-lg border-2 border-white shadow-md">
              <i class="fa-solid fa-crown text-amber-900"></i>
            </div>
            <img src="${first.avatarUrl}" class="w-20 h-20 rounded-full mx-auto object-cover border-4 border-amber-400 shadow-md mb-2" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'">
            <h4 class="font-black text-slate-900 text-base truncate">${first.fullName}</h4>
            <span class="text-xs text-amber-800 font-medium block truncate">${first.school} • ${first.districtLabel}</span>
          </div>
          <div class="mt-2 bg-amber-100/80 py-2.5 rounded-2xl border border-amber-300">
            <span class="text-base font-black text-amber-950">🪙 ${first.coins} TANGA</span>
            <span class="text-[11px] text-amber-900 block font-semibold">1-o'rin • Mavsum Peshqadami</span>
          </div>
        </div>

        <div class="podium-card podium-3 p-5 rounded-3xl text-center flex flex-col justify-between order-3 md:order-3 h-[250px]">
          <div>
            <div class="w-9 h-9 rounded-full bg-amber-700 text-white flex items-center justify-center font-black mx-auto mb-2 text-xs border-2 border-white shadow-sm">
              3
            </div>
            <img src="${third.avatarUrl}" class="w-14 h-14 rounded-full mx-auto object-cover border-2 border-amber-600 shadow-sm mb-2" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'">
            <h4 class="font-bold text-slate-900 text-sm truncate">${third.fullName}</h4>
            <span class="text-[11px] text-slate-500 block truncate">${third.school} • ${third.districtLabel}</span>
          </div>
          <div class="mt-2 bg-orange-50 py-2 rounded-2xl">
            <span class="text-sm font-black text-orange-950">🪙 ${third.coins} Tanga</span>
            <span class="text-[10px] text-orange-800/80 block">${third.eventsCount} ta tadbir</span>
          </div>
        </div>
      `;
    }

    tableBody.innerHTML = leaderboard.map((creator, index) => {
      const rank = index + 1;
      let rankBadge = `<span class="font-bold text-slate-500">#${rank}</span>`;
      if (rank === 1) rankBadge = `<span class="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black inline-flex items-center justify-center text-xs shadow-sm">🥇 1</span>`;
      else if (rank === 2) rankBadge = `<span class="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-bold inline-flex items-center justify-center text-xs">🥈 2</span>`;
      else if (rank === 3) rankBadge = `<span class="w-6 h-6 rounded-full bg-amber-700 text-white font-bold inline-flex items-center justify-center text-xs">🥉 3</span>`;

      return `
        <tr class="hover:bg-slate-50 transition">
          <td class="px-6 py-4 whitespace-nowrap">${rankBadge}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
              <img src="${creator.avatarUrl}" class="w-9 h-9 rounded-full object-cover border border-slate-200" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'">
              <div>
                <a href="javascript:void(0)" onclick="App.openCreatorDetail('${creator.id}')" class="font-bold text-slate-900 hover:text-emerald-700 block text-sm">
                  ${creator.fullName}
                </a>
                <span class="text-[11px] text-slate-400">${creator.age} yosh</span>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2.5 py-1 rounded-full text-xs font-semibold badge-district">
              <i class="fa-solid fa-location-dot mr-1"></i>${creator.districtLabel}
            </span>
          </td>
          <td class="px-6 py-4 text-xs font-medium text-slate-700">${creator.school}</td>
          <td class="px-6 py-4 text-center font-semibold text-xs text-slate-700">${creator.eventsCount} ta</td>
          <td class="px-6 py-4 text-right whitespace-nowrap">
            <span class="font-black text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-sm">
              🪙 ${creator.coins}
            </span>
          </td>
          <td class="px-6 py-4 text-center whitespace-nowrap">
            <div class="flex items-center justify-center gap-2">
              <button onclick="App.openVideoModal('${creator.id}')" class="p-1.5 text-slate-500 hover:text-red-600 rounded-lg hover:bg-slate-100 transition" title="Jonli ijroni ko'rish">
                <i class="fa-solid fa-play"></i>
              </button>
              <button onclick="App.openCreatorDetail('${creator.id}')" class="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition" title="Avtobiografiya">
                <i class="fa-solid fa-user"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  },

  // ================= 13. MADANIYAT XODIMLARI XIZMATI =================

  renderStaffSection() {
    const authStatus = document.getElementById('staff-auth-status');
    const tableContainer = document.getElementById('staff-contacts-table-container');
    if (!authStatus || !tableContainer) return;

    const user = Auth.getCurrentUser();
    const isStaffOrAdmin = Auth.isStaff();

    if (!isStaffOrAdmin) {
      authStatus.innerHTML = `
        <span class="text-xs text-blue-200 block mb-1">Xodim tasdig'i talab qilinadi</span>
        <button onclick="App.openStaffAuthModal()" class="px-4 py-2 bg-white text-blue-950 rounded-xl font-black text-xs shadow hover:bg-blue-50 transition">
          <i class="fa-solid fa-right-to-bracket mr-1"></i> Xodim sifatida kirish
        </button>
      `;

      tableContainer.innerHTML = `
        <div class="p-8 text-center bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
          <i class="fa-solid fa-user-lock text-3xl text-slate-400"></i>
          <h4 class="font-bold text-slate-800 text-sm">O'quvchilarning telefon raqamlari himoyalangan</h4>
          <p class="text-xs text-slate-500 max-w-md mx-auto">
            Madaniyat xodimlari Bosh koordinator tasdiq kodi orqali kirganlaridan so'ng maktab o'quvchilarining telefon raqamlari ochiladi.
          </p>
        </div>
      `;
      return;
    }

    authStatus.innerHTML = `
      <span class="text-xs text-emerald-300 font-bold block mb-1">
        <i class="fa-solid fa-circle-check"></i> Xodim tasdiqlangan
      </span>
      <span class="text-xs text-white font-black block">${user.fullName}</span>
      <span class="text-[11px] text-blue-200 block">${user.position}</span>
    `;

    const creators = DataStore.getCreators();
    tableContainer.innerHTML = `
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-700">
          <thead class="bg-slate-50 text-xs uppercase text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th class="px-4 py-3">O'quvchi</th>
              <th class="px-4 py-3">Tumani</th>
              <th class="px-4 py-3">Maktabi</th>
              <th class="px-4 py-3">Telefon Raqami</th>
              <th class="px-4 py-3 text-center">Jonli Chiqish</th>
              <th class="px-4 py-3 text-right">Aloqa</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            ${creators.map(c => `
              <tr class="hover:bg-blue-50/40 transition">
                <td class="px-4 py-3 font-bold text-slate-900">${c.fullName}</td>
                <td class="px-4 py-3 text-xs font-semibold text-emerald-700">${c.districtLabel}</td>
                <td class="px-4 py-3 text-xs text-slate-600">${c.school}</td>
                <td class="px-4 py-3">
                  <a href="tel:${c.phone}" class="font-black text-blue-700 hover:underline text-xs flex items-center gap-1.5">
                    <i class="fa-solid fa-phone text-blue-500 text-[10px]"></i> ${c.phone}
                  </a>
                </td>
                <td class="px-4 py-3 text-center">
                  <button onclick="App.openVideoModal('${c.id}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold">
                    <i class="fa-solid fa-play text-red-500 text-[10px] mr-1"></i> Videoni ko'rish
                  </button>
                </td>
                <td class="px-4 py-3 text-right">
                  <button onclick="App.openInviteModal('${c.id}')" class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto">
                    <i class="fa-solid fa-phone"></i> Taklif qilish
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ================= 14. ADMIN BOSHQARUVI, STATISTIKA & CHELLENJ BAHOLASH =================

  renderAdminSection() {
    const tableBody = document.getElementById('admin-creators-table-body');
    const staffTableBody = document.getElementById('admin-staff-table-body');
    const submissionsTableBody = document.getElementById('admin-submissions-table-body');
    const visitorStatCards = document.getElementById('visitor-stat-cards');
    if (!Auth.isAdmin()) return;

    // 1. Oylik Qiziqib Boruvchilar Statistikasi
    if (visitorStatCards) {
      const vStats = DataStore.getVisitorStats();
      const currentMonthKey = new Date().toISOString().slice(0, 7);
      const currentMonthVisits = (vStats.monthly && vStats.monthly[currentMonthKey]) || 340;
      const totalVisits = vStats.total || 2450;
      const creatorsCount = DataStore.getCreators().length;

      visitorStatCards.innerHTML = `
        <div class="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-indigo-700">Joriy Oydagi Qiziqish</span>
            <span class="w-8 h-8 rounded-xl bg-indigo-200 text-indigo-800 flex items-center justify-center text-sm font-black">
              <i class="fa-solid fa-eye"></i>
            </span>
          </div>
          <span class="text-2xl font-black text-indigo-950 mt-2 block">${currentMonthVisits.toLocaleString()} ta</span>
          <span class="text-[11px] text-indigo-800/80 mt-0.5 block">Bu oyda saytga kirganlar soni</span>
        </div>

        <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-700">Jami Qiziqib Boruvchilar</span>
            <span class="w-8 h-8 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center text-sm font-black">
              <i class="fa-solid fa-chart-simple"></i>
            </span>
          </div>
          <span class="text-2xl font-black text-amber-950 mt-2 block">${totalVisits.toLocaleString()} ta</span>
          <span class="text-[11px] text-amber-800/80 mt-0.5 block">Umumiy ko'rishlar va tashriflar</span>
        </div>

        <div class="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-700">Ro'yxatdagi O'quvchilar</span>
            <span class="w-8 h-8 rounded-xl bg-emerald-200 text-emerald-800 flex items-center justify-center text-sm font-black">
              <i class="fa-solid fa-user-graduate"></i>
            </span>
          </div>
          <span class="text-2xl font-black text-emerald-950 mt-2 block">${creatorsCount} ta</span>
          <span class="text-[11px] text-emerald-800/80 mt-0.5 block">Faol maktab iqtidorlari</span>
        </div>
      `;
    }

    // 2. Chellenjlarga Kelgan Video Roliklar (Baholash va Tanga berish)
    if (submissionsTableBody) {
      const submissions = DataStore.getChallengeSubmissions();
      if (submissions.length === 0) {
        submissionsTableBody.innerHTML = `
          <tr>
            <td colspan="6" class="px-5 py-6 text-center text-slate-400 text-xs">
              Hozircha o'quvchilar tomonidan topshirilgan video roliklar yo'q.
            </td>
          </tr>
        `;
      } else {
        submissionsTableBody.innerHTML = submissions.map(sub => `
          <tr class="hover:bg-slate-50 transition">
            <td class="px-5 py-3 font-bold text-slate-900">
              <div>
                <span>${sub.creatorName}</span>
                <span class="block text-[11px] text-slate-400 font-normal">${sub.creatorSchool}</span>
              </div>
            </td>
            <td class="px-5 py-3 text-xs font-medium text-rose-700">${sub.challengeTitle}</td>
            <td class="px-5 py-3 text-xs text-slate-700 max-w-xs">
              <span class="line-clamp-2" title="${sub.participants}">
                ${sub.participants}
              </span>
            </td>
            <td class="px-5 py-3 text-center">
              <a href="${sub.videoUrl}" target="_blank" rel="noopener noreferrer" class="p-1.5 text-red-600 hover:text-red-700 rounded-lg hover:bg-slate-100 transition inline-block" title="Videoni ko'rish">
                <i class="fa-solid fa-play"></i>
              </a>
            </td>
            <td class="px-5 py-3 text-center">
              ${sub.status === 'approved' ? `
                <span class="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-800">
                  🪙 +${sub.coinsAwarded} berildi
                </span>
              ` : `
                <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-800">
                  Kutilmoqda
                </span>
              `}
            </td>
            <td class="px-5 py-3 text-right">
              ${sub.status === 'approved' ? `
                <button onclick="App.openReviewSubmissionModal('${sub.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition">
                  Tahrirlash
                </button>
              ` : `
                <button onclick="App.openReviewSubmissionModal('${sub.id}')" class="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs shadow transition">
                  Baholash & Tanga Berish
                </button>
              `}
            </td>
          </tr>
        `).join('');
      }
    }

    // 3. Madaniyat xodimlari (Raqamlar FAQAT Adminga ko'rinadi)
    if (staffTableBody) {
      const staffList = DataStore.getStaffList();
      if (staffList.length === 0) {
        staffTableBody.innerHTML = `
          <tr>
            <td colspan="5" class="px-5 py-6 text-center text-slate-400 text-xs">
              Hozircha ro'yxatdan o'tgan madaniyat xodimlari yo'q.
            </td>
          </tr>
        `;
      } else {
        staffTableBody.innerHTML = staffList.map(s => `
          <tr class="hover:bg-slate-50 transition">
            <td class="px-5 py-3 font-bold text-slate-900">${s.fullName}</td>
            <td class="px-5 py-3 text-xs text-slate-600">${s.position}</td>
            <td class="px-5 py-3 text-xs text-slate-600">${s.organization}</td>
            <td class="px-5 py-3">
              <a href="tel:${s.phone}" class="font-black text-blue-700 hover:underline text-xs flex items-center gap-1">
                <i class="fa-solid fa-phone text-blue-500 text-[10px]"></i> ${s.phone}
              </a>
            </td>
            <td class="px-5 py-3 text-right">
              <a href="tel:${s.phone}" class="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition inline-flex items-center gap-1">
                <i class="fa-solid fa-phone"></i> Qo'ng'iroq
              </a>
            </td>
          </tr>
        `).join('');
      }
    }

    // 4. O'quvchilar boshqaruvi
    if (tableBody) {
      const creators = DataStore.getCreators();
      tableBody.innerHTML = creators.map(c => `
        <tr class="hover:bg-slate-50 transition">
          <td class="px-5 py-3 font-bold text-slate-900">
            <div class="flex items-center gap-2">
              <img src="${c.avatarUrl}" class="w-8 h-8 rounded-full object-cover" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'">
              <div>
                <span>${c.fullName}</span>
                <span class="block text-[11px] text-slate-400 font-normal">${c.districtLabel}</span>
              </div>
            </div>
          </td>
          <td class="px-5 py-3 text-xs font-medium text-emerald-800">${c.school}</td>
          <td class="px-5 py-3 text-xs font-semibold text-slate-700">${c.phone}</td>
          <td class="px-5 py-3 text-center">
            <span class="font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg text-xs">🪙 ${c.coins}</span>
          </td>
          <td class="px-5 py-3 text-right">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="App.openEditProfileModal('${c.id}')" class="p-1.5 text-slate-500 hover:text-emerald-700 rounded-lg hover:bg-slate-100 transition" title="Tahrirlash">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button onclick="App.openAwardModal('${c.id}')" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition" title="Tanga berish">
                + Tanga
              </button>
              <button onclick="App.handleDeleteCreator('${c.id}')" class="p-1.5 text-red-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition" title="O'chirish">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
  },

  renderStats() {
    const creators = DataStore.getCreators();
    const contests = DataStore.getContests();
    const totalCreatorsEl = document.getElementById('stat-total-creators');
    const totalContestsEl = document.getElementById('stat-total-contests');
    const totalCoinsEl = document.getElementById('stat-total-coins');

    if (totalCreatorsEl) totalCreatorsEl.textContent = creators.length;
    if (totalContestsEl) totalContestsEl.textContent = contests.length;

    let totalCoins = 0;
    creators.forEach(c => {
      totalCoins += (c.coins || 0);
    });

    if (totalCoinsEl) totalCoinsEl.textContent = totalCoins.toLocaleString();
  },

  // ================= 15. TANGA TAQDIM ETISH =================

  openAwardModal(preselectedCreatorId = null) {
    if (!Auth.isAdmin()) {
      this.showToast("Tanga taqdim etish faqat Admin uchun!", "error");
      return;
    }

    const select = document.getElementById('award-creator-select');
    const creators = DataStore.getCreators();
    
    select.innerHTML = creators.map(c => `
      <option value="${c.id}" ${c.id === preselectedCreatorId ? 'selected' : ''}>
        ${c.fullName} (${c.school} - ${c.districtLabel})
      </option>
    `).join('');

    document.getElementById('award-event-name').value = '';
    document.getElementById('award-coins-amount').value = '35';
    document.getElementById('award-note').value = '';

    this.openModal('modal-award-coins');
  },

  setAwardCoins(amount) {
    document.getElementById('award-coins-amount').value = amount;
  },

  handleAwardSubmit(e) {
    e.preventDefault();
    const creatorId = document.getElementById('award-creator-select').value;
    const eventName = document.getElementById('award-event-name').value;
    const coinsAmount = document.getElementById('award-coins-amount').value;
    const note = document.getElementById('award-note').value;

    const res = DataStore.awardCoins(creatorId, eventName, coinsAmount, note);
    if (res.success) {
      this.closeModal('modal-award-coins');
      this.refreshAllUI();
      this.showToast(`🪙 ${coinsAmount} tanga "${res.creator.fullName}" ga taqdim etildi!`, 'success');
    } else {
      this.showToast(res.message, 'error');
    }
  },

  handleDeleteCreator(creatorId) {
    if (!Auth.isAdmin()) return;
    const creator = DataStore.getCreatorById(creatorId);
    if (!creator) return;

    if (confirm(`Haqiqatan ham "${creator.fullName}" o'quvchisini ro'yxatdan o'chirmoqchimisiz?`)) {
      DataStore.deleteCreator(creatorId);
      this.showToast("O'quvchi bazadan o'chirildi.", 'info');
      this.refreshAllUI();
    }
  },

  handleClearDemoCreators() {
    if (!Auth.isAdmin()) return;
    const demoIds = ['cre-1', 'cre-2', 'cre-3', 'cre-4', 'cre-5', 'cre-6', 'cre-7', 'cre-8', 'cre-9', 'cre-10'];
    const currentCreators = DataStore.getCreators();
    const demoPresent = currentCreators.filter(c => demoIds.includes(c.id));

    if (demoPresent.length === 0) {
      this.showToast("Bazada hech qanday namuna o'quvchi qolmagan (allaqachon tozalangan).", 'info');
      return;
    }

    if (confirm(`Boshlang'ich namuna sifatida kiritilgan barcha (${demoPresent.length} ta) test o'quvchilarni butunlay tozalab tashlamoqchimisiz?\n\n(Haqiqiy ro'yxatdan o'tgan o'quvchilaringiz o'chmaydi)`)) {
      DataStore.clearDemoCreators();
      this.showToast("Barcha namuna o'quvchilar muvaffaqiyatli tozalandi!", 'success');
      this.refreshAllUI();
    }
  },

  // ================= 16. VIDEO VA DETALLAR =================

  openVideoModal(creatorId) {
    const creator = DataStore.getCreatorById(creatorId);
    if (!creator) return;

    this.state.selectedCreatorForVideo = creator;

    document.getElementById('video-modal-title').textContent = `${creator.fullName} - Jonli Ijro`;
    document.getElementById('video-modal-performer').textContent = `${creator.school} (${creator.districtLabel})`;
    
    const extLink = document.getElementById('video-external-link');
    extLink.href = creator.videoUrl || '#';

    const playerContainer = document.getElementById('video-player-container');
    
    if (creator.videoEmbedUrl) {
      playerContainer.innerHTML = `
        <div class="video-responsive-container">
          <iframe src="${creator.videoEmbedUrl}" title="${creator.fullName} chiqishi" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
    } else {
      playerContainer.innerHTML = `
        <div class="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-4">
          <div class="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mx-auto text-3xl">
            <i class="fa-brands fa-telegram"></i>
          </div>
          <div>
            <h4 class="text-lg font-bold text-white">Telegramdagi Jonli Ijro</h4>
            <p class="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Ushbu o'quvchining chiqish videosi Telegram havola orqali ko'riladi.
            </p>
          </div>
          <div class="pt-2">
            <a href="${creator.videoUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Telegramda Videoni Ochish
            </a>
          </div>
        </div>
      `;
    }

    this.openModal('modal-video');
  },

  closeVideoModal() {
    const playerContainer = document.getElementById('video-player-container');
    if (playerContainer) {
      playerContainer.innerHTML = '';
    }
    this.closeModal('modal-video');
  },

  openCreatorDetail(creatorId) {
    const creator = DataStore.getCreatorById(creatorId);
    if (!creator) return;

    const content = document.getElementById('creator-detail-content');
    const isStaffOrAdmin = Auth.isStaff();
    const currentUser = Auth.getCurrentUser();
    const isMyProfile = (currentUser.role === 'student' && currentUser.creatorId === creator.id) || Auth.isAdmin();

    const eventsHistory = creator.eventsHistory && creator.eventsHistory.length > 0
      ? creator.eventsHistory.map(ev => `
          <div class="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/60 flex items-center justify-between gap-3 text-xs">
            <div>
              <span class="font-bold text-slate-900 block">${ev.eventName}</span>
              <span class="text-slate-500 text-[11px]">${ev.date || ''} • ${ev.note || 'Faol chiqish'}</span>
            </div>
            <span class="font-black text-amber-700 bg-amber-200/70 px-2.5 py-1 rounded-lg shrink-0">
              +${ev.coinsAwarded} 🪙
            </span>
          </div>
        `).join('')
      : '<p class="text-xs text-slate-400">Hozircha bayramlar tarixi qayd etilmagan.</p>';

    content.innerHTML = `
      <div class="flex items-start gap-4 pb-5 border-b border-slate-100">
        <img src="${creator.avatarUrl}" class="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-sm" onerror="this.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80'">
        <div class="flex-1">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold badge-district">
                <i class="fa-solid fa-location-dot mr-1"></i>${creator.districtLabel}
              </span>
              <span class="text-xs text-slate-400">${creator.age} yosh</span>
            </div>
            ${isMyProfile ? `
              <button onclick="App.openEditProfileModal('${creator.id}')" class="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1">
                <i class="fa-solid fa-pen-to-square"></i> Tahrirlash
              </button>
            ` : ''}
          </div>
          <h3 class="text-xl font-black text-slate-900 mt-1">${creator.fullName}</h3>
          <p class="text-xs text-slate-500 mt-0.5"><i class="fa-solid fa-school mr-1 text-slate-400"></i>${creator.school}</p>
        </div>
      </div>

      <div class="py-4 space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
            <span class="text-2xl font-black text-amber-800 flex items-center justify-center gap-1">
              🪙 ${creator.coins}
            </span>
            <span class="text-xs text-amber-900 font-bold block mt-0.5">Mavsumiy Jamg'arma</span>
          </div>
          <div class="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
            <span class="text-2xl font-black text-emerald-800">${creator.eventsCount} ta</span>
            <span class="text-xs text-emerald-900 font-bold block mt-0.5">Madaniy Chiqishlar</span>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <i class="fa-solid fa-file-lines text-emerald-600"></i> Avtobiografiya va Yutuqlari
          </h4>
          <p class="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
            ${creator.bio}
          </p>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <i class="fa-solid fa-phone text-blue-600"></i> Aloqa Ma'lumotlari
          </h4>
          ${isStaffOrAdmin ? `
            <div class="p-3 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between text-xs">
              <div>
                <span class="text-slate-500 block text-[11px]">Telefon raqami (Xodim va Admin):</span>
                <span class="font-bold text-blue-900 text-sm">${creator.phone}</span>
              </div>
              <a href="tel:${creator.phone}" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition">
                Qo'ng'iroq qilish
              </a>
            </div>
          ` : `
            <div class="p-3 rounded-2xl bg-slate-100 text-slate-500 text-xs flex items-center justify-between">
              <span>🔒 Telefon raqami faqat Madaniyat xodimlari va Admin uchun ochiq.</span>
            </div>
          `}
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <i class="fa-solid fa-clock-rotate-left text-amber-600"></i> Bayramlar & Chellenjlar Tarixi
          </h4>
          <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
            ${eventsHistory}
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
        <button onclick="App.openVideoModal('${creator.id}')" class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5">
          <i class="fa-solid fa-play text-red-400"></i> Jonli Ijroni Ko'rish
        </button>
        <button onclick="App.closeModal('modal-creator-detail')" class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition">
          Yopish
        </button>
      </div>
    `;

    this.openModal('modal-creator-detail');
  },

  openInviteModal(creatorId) {
    const creator = DataStore.getCreatorById(creatorId);
    if (!creator) return;

    document.getElementById('invite-creator-name').textContent = creator.fullName;
    document.getElementById('invite-creator-school').textContent = `${creator.school} • ${creator.districtLabel}`;
    
    const phoneLink = document.getElementById('invite-phone-link');
    phoneLink.href = `tel:${creator.phone}`;
    phoneLink.textContent = creator.phone;

    const callBtn = document.getElementById('invite-call-btn');
    callBtn.href = `tel:${creator.phone}`;

    this.openModal('modal-invite');
  },

  // ================= 17. ZAXIRA VA EKSPORT =================

  exportLeaderboard() {
    const creators = DataStore.getLeaderboard();
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "O'rin,F.I.O.,Tumani,Maktabi,Qatnashgan tadbirlar,Jami tangalar\n";

    creators.forEach((c, index) => {
      csvContent += `${index + 1},"${c.fullName}","${c.districtLabel}","${c.school}",${c.eventsCount},${c.coins}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IJODKOR_UZ_Reyting_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    this.showToast("Mavsumiy reyting yuklab olindi!", "success");
  },

  handleDownloadBackup() {
    const jsonStr = DataStore.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IJODKOR_UZ_Zaxira_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.showToast("To'liq ma'lumotlar bazasi zaxirasi yuklab olindi!", "success");
  },

  handleImportBackupFile(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const ok = DataStore.importFullBackup(event.target.result);
      if (ok) {
        this.refreshAllUI();
        this.showToast("Zaxira muvaffaqiyatli tiklandi!", "success");
      } else {
        this.showToast("Zaxira fayli formati noto'g'ri!", "error");
      }
    };
    reader.readAsText(file);
  },

  openModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(id) {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  },

  closeAllModals() {
    this.closeVideoModal();
    [
      'modal-admin-login',
      'modal-admin-change-pin',
      'modal-staff-auth',
      'modal-student-auth',
      'modal-edit-profile',
      'modal-submit-challenge',
      'modal-add-challenge',
      'modal-review-submission',
      'modal-add-contest',
      'modal-award-coins',
      'modal-creator-detail',
      'modal-invite',
      'modal-admin-inbox'
    ].forEach(id => {
      this.closeModal(id);
    });
  },

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    let bg = 'bg-slate-900 text-white';
    let icon = '<i class="fa-solid fa-circle-info text-blue-400"></i>';

    if (type === 'success') {
      bg = 'bg-emerald-800 text-white';
      icon = '<i class="fa-solid fa-circle-check text-emerald-300"></i>';
    } else if (type === 'error') {
      bg = 'bg-red-800 text-white';
      icon = '<i class="fa-solid fa-circle-exclamation text-red-300"></i>';
    }

    toast.className = `toast px-4 py-3 rounded-2xl ${bg} flex items-center gap-3 text-xs font-semibold shadow-2xl`;
    toast.innerHTML = `${icon}<span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
