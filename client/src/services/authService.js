import api from './api';
import { useAuthStore } from '@/stores/authStore'; // Import Pinia store

// Hàm chuyển hướng người dùng đến backend để bắt đầu luồng Google OAuth
export const initiateGoogleLogin = () => {
  console.log(`[FRONTEND_AUTH] Redirecting to backend for Google login: ${import.meta.env.VITE_GOOGLE_AUTH_INIT_URL}`);
  window.location.href = import.meta.env.VITE_GOOGLE_AUTH_INIT_URL;
};

// Hàm xử lý callback sau khi backend redirect về frontend
export const handleAuthCallback = async (queryParams) => {
  console.log(`[FRONTEND_AUTH] Handling auth callback. Query params:`, Object.fromEntries(queryParams.entries()));
  const token = queryParams.get('token');
  const userId = queryParams.get('userId');
  const email = queryParams.get('email');
  const fullName = decodeURIComponent(queryParams.get('fullName') || '');
  const roles = queryParams.get('roles') ? queryParams.get('roles').split(',') : [];
  const error = queryParams.get('error');

  const authStore = useAuthStore(); // Lấy instance của store

  if (error) {
    console.error(`[FRONTEND_AUTH_ERROR] Error received from backend: ${error}`);
    // Clear auth info nếu có lỗi xảy ra trong quá trình callback
    authStore.clearAuthInfo();
    throw new Error(error);
  }

  if (token && userId) {
    console.log(`[FRONTEND_AUTH] Token and userId received. Storing in Pinia store.`);
    const authData = {
      token,
      user: { user_id: userId, email, full_name: fullName, roles }
    };
    authStore.setAuthInfo(authData); // Cập nhật Pinia store (và nó sẽ cập nhật localStorage)
    return authData;
  } else {
    console.error(`[FRONTEND_AUTH_ERROR] Authentication failed: No token or user ID received from callback.`);
    authStore.clearAuthInfo(); // Clear auth info nếu không nhận đủ dữ liệu
    throw new Error('Authentication failed: No token or user ID received.');
  }
};

// Lấy thông tin người dùng đã đăng nhập từ Local Storage (Chỉ dùng khi khởi tạo store)
// Hàm này không thay đổi, nó được useAuthStore gọi khi khởi tạo.
export const getStoredAuthInfo = () => {
  const token = localStorage.getItem('jwt_token');
  const user_id = localStorage.getItem('user_id');
  const email = localStorage.getItem('user_email');
  const full_name = localStorage.getItem('user_full_name');
  const roles = localStorage.getItem('user_roles');

  if (token && user_id) {
    return {
      token,
      user: {
        user_id,
        email,
        full_name,
        roles: roles ? JSON.parse(roles) : []
      }
    };
  }
  return null;
};

// Lấy thông tin chi tiết người dùng từ API Backend (sử dụng token)
export const fetchLoggedInUser = async () => {
  console.log("[FRONTEND_AUTH] Attempting to fetch logged-in user details from /auth/me API.");
  try {
    const response = await api.get('/auth/me');
    const user = response.data.user;
    console.log("[FRONTEND_AUTH] Successfully fetched user details:", user);

    const authStore = useAuthStore();
    // Cập nhật Pinia store với thông tin chi tiết đầy đủ hơn (nếu cần)
    // Giả định authStore.authInfo đã có token và các thông tin cơ bản
    authStore.setAuthInfo({
      token: authStore.authInfo.token,
      user: {
        ...authStore.authInfo.user, // Giữ lại thông tin cũ
        ...user // Ghi đè/bổ sung thông tin chi tiết từ API
      }
    });

    return user;
  } catch (error) {
    console.error('[FRONTEND_AUTH_ERROR] Failed to fetch logged in user from API:', error.response?.data?.message || error.message);
    throw error; // Ném lỗi để router hoặc component xử lý
  }
};

// Hàm đăng xuất
export const logout = () => {
  console.log("[FRONTEND_AUTH] User logout initiated. Clearing Pinia store.");
  const authStore = useAuthStore();
  authStore.clearAuthInfo(); // Gọi action clearAuthInfo của Pinia store (nó sẽ xóa cả localStorage)
};

// Hàm setAuthInfo mới để dùng cho đăng nhập truyền thống
export function setAuthInfo(authData) {
  console.log("[FRONTEND_AUTH] Setting auth info via Pinia store.");
  const authStore = useAuthStore();
  // Đảm bảo authData có cấu trúc { token, user: { ... } }
  authStore.setAuthInfo(authData);
}

// Cập nhật thông tin hồ sơ người dùng
export const updateProfile = async (profileData) => {
  try {
    const response = await api.patch('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    // Lấy message từ backend nếu có
    const errMsg = error.response?.data?.message || error.message || 'Cập nhật hồ sơ thất bại.';
    throw new Error(errMsg);
  }
};