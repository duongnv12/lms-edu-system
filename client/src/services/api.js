// client/src/services/api.js
import axios from 'axios';
import { logout } from './authService'; // Import logout để xử lý lỗi 401/403

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để đính kèm JWT vào mỗi request nếu có
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi 401/403 (Unauthorized/Forbidden)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error('Authentication error (401/403):', error.response.data.message);
      logout(); // Xóa token và đăng xuất
      // Chuyển hướng đến trang đăng nhập (sử dụng router nếu có thể, hoặc window.location)
      window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
    }
    return Promise.reject(error);
  }
);

export default apiClient;