/**
 * IJODKOR.UZ - Foydalanuvchi va Rollarni boshqarish (Auth tizimi)
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
    DataStore.addStaffMember(staffData);

    const sessionData = {
      id: 'staff-' + Date.now(),
      role: 'staff',
      fullName: staffData.fullName.trim(),
      position: staffData.position.trim() || 'Madaniyat Xodimi / Tadbir Tashkilotchisi',
      organization: staffData.organization.trim() || 'Madaniyat Boshqarmasi',
      phone: staffData.phone.trim()
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  },

  // 3. O'QUVCHI SIFATIDA KIRISH
  loginStudent(studentData) {
    const sessionData = {
      id: studentData.id,
      creatorId: studentData.id,
      role: 'student',
      fullName: studentData.fullName.trim(),
      district: studentData.district,
      districtLabel: studentData.districtLabel,
      school: studentData.school,
      phone: studentData.phone,
      avatarUrl: studentData.avatarUrl
    };
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    return { success: true, user: sessionData };
  },

  // O'quvchi profilini yangilaganda sessiyani yangilash
  updateStudentSession(updatedCreator) {
    const currentUser = this.getCurrentUser();
    if (currentUser.role === 'student' && currentUser.creatorId === updatedCreator.id) {
      currentUser.fullName = updatedCreator.fullName;
      currentUser.district = updatedCreator.district;
      currentUser.districtLabel = updatedCreator.districtLabel;
      currentUser.school = updatedCreator.school;
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
