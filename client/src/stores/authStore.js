import { defineStore } from 'pinia';
import { getStoredAuthInfo } from '@/services/authService'; // Sử dụng hàm từ authService

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Khởi tạo state từ localStorage khi store được tạo
    // Điều này đảm bảo trạng thái duy trì khi người dùng refresh trang
    authInfo: getStoredAuthInfo(),
  }),
  getters: {
    isLoggedIn: (state) => !!state.authInfo && !!state.authInfo.token,
    userFullName: (state) => state.authInfo?.user?.full_name || 'Khách',
    userRoles: (state) => state.authInfo?.user?.roles || [],
    isAdmin: (state) => state.authInfo?.user?.roles?.includes('Admin'),
    isInstructor: (state) => state.authInfo?.user?.roles?.includes('Instructor'),
    isStudent: (state) => state.authInfo?.user?.roles?.includes('Student'),
    // ... thêm các getters khác nếu cần
  },
  actions: {
    // Action để cập nhật thông tin xác thực vào store
    setAuthInfo(payload) {
      this.authInfo = payload;
      // Cập nhật localStorage tại đây để đảm bảo đồng bộ
      if (payload && payload.token && payload.user) {
        localStorage.setItem('jwt_token', payload.token);
        localStorage.setItem('user_id', payload.user.user_id);
        localStorage.setItem('user_email', payload.user.email);
        localStorage.setItem('user_full_name', payload.user.full_name);
        localStorage.setItem('user_roles', JSON.stringify(payload.user.roles));
      } else {
        // Xóa tất cả nếu payload không hợp lệ (ví dụ, logout)
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_full_name');
        localStorage.removeItem('user_roles');
        localStorage.removeItem('user_full_info'); // Xóa cả thông tin chi tiết
      }
    },
    // Action để xóa thông tin xác thực khỏi store (logout)
    clearAuthInfo() {
      this.authInfo = null;
      // Xóa localStorage tại đây để đảm bảo đồng bộ
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_full_name');
      localStorage.removeItem('user_roles');
      localStorage.removeItem('user_full_info'); // Xóa cả thông tin chi tiết
    }
  }
});