/**
 * Kelajak ijodkori - Foydalanuvchi va Rollarni boshqarish (Auth tizimi)
 * Rollar:
 * 1. 'guest' - Ommaviy ko'rish rejimi
 * 2. 'admin' - Bosh koordinator
 * 3. 'staff' - Madaniyat xodimi
 * 4. 'student' - Umumta'lim maktab o'quvchisi
 */

const Auth = {
  // Joriy sessiyani olish
  getCurrentUser() {
    try {
      const session = localStorage.getItem(STORAGE_KEY_SESSION);
      if (session) {
        return JSON.parse(session);
      }
    } catch (e) {
      console.error("Sessiyani o'qishda xatolik:", e);
    }
    return {
      id: 'guest',
      role: 'guest',
      fullName: 'Mehmon',
      position: 'Umumiy foydalanuvchi',
      organization: 'Ommaviy ko\'rish'
    };
  },

  // 1. ADMIN SIFATIDA KIRISH
  loginAdmin(enteredPin) {
    if (!enteredPin || enteredPin.trim() === '') {
      return { success: false, message: "Iltimos, admin maxfiy kodini kiriting!" };
    }

    if (DataStore.verifyAdminPin(enteredPin)) {
      const adminName = DataStore.getAdminName();
      const sessionData = {
        id: 'usr-admin',
        role: 'admin',
        fullName: adminName,
        position: 'Bosh Madaniyat Koordinatori',
        organization: 'O\'zbekiston Madaniyat Vazirligi'
      };
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
      return { success: true, user: sessionData };
    }

    return { success: false, message: "Xato kod! Admin maxfiy kodi noto'g'ri." };
  },

  changeAdminPin(currentPin, newPin) {
    if (!DataStore.verifyAdminPin(currentPin)) {
      return { success: false, message: "Hozirgi admin kodingiz noto'g'ri kiritildi!" };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, message: "Yangi maxfiy kod kamida 4 ta belgidan iborat bo'lishi kerak!" };
    }

    DataStore.setAdminPin(newPin.trim());
    return { success: true, message: "Admin maxfiy kodi muvaffaqiyatli yangilandi!" };
  },

  // 2. MADANIYAT XODIMI SIFATIDA KIRISH
  loginStaff(staffData) {
    const saved = staffData.id ? staffData : DataStore.addStaffMember(staffData);

    const sessionData = {
      id: saved.id || ('staff-' + Date.now()),
      staffId: saved.id,
      role: 'staff',
      fullName: saved.fullName.trim(),
      position: (saved.position || '').trim() || 'Madaniyat Xodimi / Tadbir Tashkilotchisi',
      organization: (saved.organization || '').trim() || 'Madaniyat Boshqarmasi',
      phone: (saved.phone || '').trim()
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    return { success: true, user: sessionData, staff: saved };
  },

  // Madaniyat xodimi ismi yoki telefoni hamda profil kodi (parol) orqali kirish
  loginStaffByCredentials(identifier, pin) {
    if (!identifier || !identifier.trim()) {
      return { success: false, message: "Iltimos, ismingiz yoki telefon raqamingizni kiriting!" };
    }
    if (!pin || !pin.trim()) {
      return { success: false, message: "Iltimos, profil maxfiy kodingizni (parol) kiriting!" };
    }

    const staff = DataStore.findStaffByCredentials(identifier, pin);
    if (!staff) {
      return {
        success: false,
        message: "Ism yoki profil kodi noto'g'ri kiritildi! Kodni unutgan bo'lsangiz, 'Profil kodi esimdan chiqdi' tugmasidan foydalaning."
      };
    }

    const res = this.loginStaff(staff);
    return { success: true, user: res.user, staff: staff };
  },

  updateStaffSession(updatedStaff) {
    const currentUser = this.getCurrentUser();
    if (currentUser.role === 'staff' && (currentUser.staffId === updatedStaff.id || currentUser.id === updatedStaff.id)) {
      currentUser.fullName = updatedStaff.fullName;
      currentUser.position = updatedStaff.position;
      currentUser.organization = updatedStaff.organization;
      currentUser.phone = updatedStaff.phone;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentUser));
    }
  },

  // 3. O'QUVCHI SIFATIDA KIRISH
  loginStudent(studentData) {
    const sessionData = {
      id: studentData.id,
      creatorId: studentData.id,
      role: 'student',
      fullName: studentData.fullName.trim(),
      nickname: studentData.nickname || '',
      district: studentData.district,
      districtLabel: studentData.districtLabel,
      school: studentData.school,
      phone: studentData.phone,
      avatarUrl: studentData.avatarUrl
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    return sessionData;
  },

  // O'quvchi ismi, niki yoki telefoni hamda profil kodi (paroli) orqali kirish
  loginStudentByCredentials(identifier, pin) {
    if (!identifier || !identifier.trim()) {
      return { success: false, message: "Iltimos, ismingiz, nikingiz yoki telefon raqamingizni kiriting!" };
    }
    if (!pin || !pin.trim()) {
      return { success: false, message: "Iltimos, profil maxfiy kodingizni (parol) kiriting!" };
    }

    const creator = DataStore.findCreatorByCredentials(identifier, pin);
    if (!creator) {
      return {
        success: false,
        message: "Ism/nik yoki profil kodi noto'g'ri kiritildi! Kodni unutgan bo'lsangiz, 'Profil kodi esimdan chiqdi' tugmasidan foydalaning."
      };
    }

    const sessionData = this.loginStudent(creator);
    return { success: true, user: sessionData, creator: creator };
  },

  // O'quvchi profilini yangilaganda sessiyani yangilash
  updateStudentSession(updatedCreator) {
    const currentUser = this.getCurrentUser();
    if (currentUser.role === 'student' && currentUser.creatorId === updatedCreator.id) {
      currentUser.fullName = updatedCreator.fullName;
      currentUser.nickname = updatedCreator.nickname || '';
      currentUser.district = updatedCreator.district;
      currentUser.districtLabel = updatedCreator.districtLabel;
      currentUser.school = updatedCreator.school;
      currentUser.phone = updatedCreator.phone;
      currentUser.avatarUrl = updatedCreator.avatarUrl;
      localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(currentUser));
    }
  },

  // Tizimdan chiqish (Logout)
  logout() {
    localStorage.removeItem(STORAGE_KEY_SESSION);
    return true;
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  isStaff() {
    const user = this.getCurrentUser();
    return user && (user.role === 'staff' || user.role === 'admin');
  },

  isStudent() {
    const user = this.getCurrentUser();
    return user && user.role === 'student';
  },

  isGuest() {
    const user = this.getCurrentUser();
    return !user || user.role === 'guest';
  }
};

if (typeof window !== 'undefined') {
  window.Auth = Auth;
}
