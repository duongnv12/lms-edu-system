<script setup>
import { ref, onMounted, computed } from 'vue';
import { fetchLoggedInUser, updateProfile } from '@/services/authService'; // Đã thêm updateProfile
import { useAuthStore } from '@/stores/authStore'; // Thêm import
// Import các service API khác nếu có để cập nhật thông tin/mật khẩu

const currentUser = ref(null);
const isLoading = ref(true);
const error = ref(null);
const successMessage = ref(null);

// Dữ liệu cho form chỉnh sửa (tạm thời)
const editableUser = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  // ... các trường khác có thể chỉnh sửa
});

// Dữ liệu cho form đổi mật khẩu
const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: '',
});
const passwordError = ref(null);
const passwordSuccess = ref(null);

const authStore = useAuthStore(); // Khởi tạo store

onMounted(async () => {
  try {
    const user = await fetchLoggedInUser();
    currentUser.value = user;
    // Gán dữ liệu vào editableUser để hiển thị trên form
    if (user) {
      editableUser.value.fullName = user.fullName;
      editableUser.value.email = user.email; // Email thường không cho phép chỉnh sửa
      editableUser.value.phone = user.phone || '';
      editableUser.value.address = user.address || '';
    }
  } catch (err) {
    console.error("Failed to fetch user data for profile:", err);
    error.value = "Không thể tải thông tin hồ sơ.";
  } finally {
    isLoading.value = false;
  }
});

const userRolesDisplay = computed(() => {
  if (!currentUser.value || !currentUser.value.roles) return 'Không có vai trò';
  const roleMap = {
    'Admin': 'Quản trị viên',
    'Instructor': 'Giảng viên',
    'Student': 'Sinh viên',
  };
  return currentUser.value.roles.map(role => roleMap[role] || role).join(', ');
});

const handleUpdateProfile = async () => {
  successMessage.value = null;
  error.value = null;
  try {
    const result = await updateProfile(editableUser.value);
    currentUser.value = { ...currentUser.value, ...result.user };
    // Đảm bảo đồng bộ key full_name cho Pinia store
    const userForStore = {
      ...currentUser.value,
      ...result.user,
      full_name: result.user.fullName || result.user.full_name || editableUser.value.fullName
    };
    authStore.setAuthInfo({
      token: localStorage.getItem('jwt_token'),
      user: userForStore
    });
    successMessage.value = 'Hồ sơ đã được cập nhật thành công!';
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra khi cập nhật hồ sơ.';
  }
};

const handleChangePassword = async () => {
  passwordError.value = null;
  passwordSuccess.value = null;

  if (passwordForm.value.newPassword !== passwordForm.value.confirmNewPassword) {
    passwordError.value = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
    return;
  }
  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự.';
    return;
  }

  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` // Sửa ở đây
      },
      body: JSON.stringify({
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      }),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.message || 'Đổi mật khẩu thất bại.');
    }
    passwordSuccess.value = 'Mật khẩu đã được thay đổi thành công!';
    passwordForm.value = { currentPassword: '', newPassword: '', confirmNewPassword: '' };
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (err) {
    passwordError.value = err.message || 'Có lỗi xảy ra khi đổi mật khẩu.';
  }
};
</script>

<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-xl p-8 sm:p-10 md:p-12 mb-8">
      <h1 class="text-3xl font-extrabold text-blue-700 mb-6 border-b-2 border-blue-100 pb-3">Hồ sơ của tôi</h1>

      <div v-if="isLoading" class="flex justify-center items-center h-48">
        <svg class="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Lỗi!</strong>
        <span class="block sm:inline"> {{ error }}</span>
      </div>

      <div v-else>
        <p v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6 transition-opacity duration-300 animate-fade-in">
          {{ successMessage }}
        </p>

        <div class="mb-8 p-6 bg-blue-50 rounded-lg shadow-sm border-l-4 border-blue-400">
          <h3 class="text-xl font-semibold text-blue-800 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
            Thông tin cá nhân
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div><p><span class="font-medium text-gray-800">Họ và tên:</span> {{ currentUser.fullName }}</p></div>
            <div><p><span class="font-medium text-gray-800">Email:</span> {{ currentUser.email }}</p></div>
            <div><p><span class="font-medium text-gray-800">Vai trò:</span> <span class="font-semibold text-purple-600">{{ userRolesDisplay }}</span></p></div>
            <div v-if="currentUser.studentId"><p><span class="font-medium text-gray-800">Mã số sinh viên:</span> {{ currentUser.studentId }}</p></div>
            <div v-if="currentUser.instructorId"><p><span class="font-medium text-gray-800">Mã số giảng viên:</span> {{ currentUser.instructorId }}</p></div>
            <div v-if="currentUser.major"><p><span class="font-medium text-gray-800">Chuyên ngành:</span> {{ currentUser.major }}</p></div>
            <div><p><span class="font-medium text-gray-800">Điện thoại:</span> {{ currentUser.phone || 'Chưa cập nhật' }}</p></div>
            <div><p><span class="font-medium text-gray-800">Địa chỉ:</span> {{ currentUser.address || 'Chưa cập nhật' }}</p></div>
            </div>
        </div>

        <div class="mb-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-blue-400">
          <h3 class="text-xl font-semibold text-blue-800 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zm-4.646 2.072L9.586 7.5l-2.828 2.828-1.414-1.414 2.828-2.828zM17 11.586l-4 4V14a2 2 0 00-2-2H4V8l-.586-.586L2 7.414V14a2 2 0 002 2h8a2 2 0 002-2v-1.414l.586-.586z"></path></svg>
            Cập nhật thông tin
          </h3>
          <form @submit.prevent="handleUpdateProfile" class="space-y-4">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700">Họ và tên</label>
              <input type="text" id="fullName" v-model="editableUser.fullName"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Số điện thoại</label>
              <input type="tel" id="phone" v-model="editableUser.phone"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700">Địa chỉ</label>
              <textarea id="address" v-model="editableUser.address" rows="3"
                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>
            <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Lưu thay đổi
            </button>
          </form>
        </div>

        <div v-if="!currentUser.isGoogleUser" class="mb-8 p-6 bg-white rounded-lg shadow-sm border-l-4 border-yellow-400">
          <h3 class="text-xl font-semibold text-yellow-800 mb-4 flex items-center">
            <svg class="h-6 w-6 mr-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 8V6a2 2 0 00-2-2H4a2 2 0 00-2 2v2H1a1 1 0 000 2h1v2a2 2 0 002 2h12a2 2 0 002-2v-2h1a1 1 0 000-2h-1zM4 6h12v2H4V6zm14 6v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2h12a1 1 0 001-1v-1a1 1 0 00-1-1H4v-1h14zm-4-4a2 2 0 11-4 0 2 2 0 014 0z" clip-rule="evenodd"></path></svg>
            Đổi mật khẩu
          </h3>
          <p v-if="passwordError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4 animate-fade-in">
            {{ passwordError }}
          </p>
          <p v-if="passwordSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-4 animate-fade-in">
            {{ passwordSuccess }}
          </p>
          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div>
              <label for="currentPassword" class="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
              <input type="password" id="currentPassword" v-model="passwordForm.currentPassword"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label for="newPassword" class="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
              <input type="password" id="newPassword" v-model="passwordForm.newPassword"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label for="confirmNewPassword" class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
              <input type="password" id="confirmNewPassword" v-model="passwordForm.confirmNewPassword"
                     class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            </div>
            <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
              Đổi mật khẩu
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* Animations are in main.css */
</style>