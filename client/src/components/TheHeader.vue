<script setup>
import { RouterLink, useRouter } from 'vue-router';
// import { getStoredAuthInfo, logout } from '@/services/authService'; // KHÔNG CẦN TRUY CẬP TRỰC TIẾP localStorage hay hàm logout từ đây nữa
import { logout } from '@/services/authService'; // Chỉ cần import logout để gọi thôi
import { useAuthStore } from '@/stores/authStore'; // Import Pinia store
import { ref, computed, onMounted, onUnmounted } from 'vue';

const router = useRouter();
const authStore = useAuthStore(); // Lấy instance của authStore

// Sử dụng computed properties từ Pinia store, chúng sẽ tự động reactive
const isLoggedIn = computed(() => authStore.isLoggedIn);
const userFullName = computed(() => authStore.userFullName);
const userRoles = computed(() => authStore.userRoles);

const handleLogout = () => {
  console.log("[TheHeader] User initiated logout.");
  logout(); // Gọi hàm logout từ authService (nó sẽ cập nhật Pinia store)
  router.push('/login');
};

// --- Scroll blur effect ---
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header
    :class="[
      'bg-white/80 shadow-md text-gray-800 p-2 sticky top-0 z-20 transition-all duration-300 ease-in-out backdrop-blur-md',
      'rounded-b-xl border-b border-blue-100',
      isScrolled ? 'backdrop-blur-lg bg-white/60 shadow-lg border-blue-200' : ''
    ]"
  >
    <div class="container mx-auto flex justify-between items-center h-14">
      <RouterLink to="/" class="text-2xl font-extrabold flex items-center space-x-2 text-blue-800 hover:text-blue-600 transition-colors duration-200">
        <img src="/logo.png" alt="LMS Logo" class="h-8 w-auto rounded-lg shadow-sm">
        <span class="hidden sm:inline">LMS Edu System</span>
      </RouterLink>

      <nav>
        <ul class="flex space-x-5 items-center">
          <li>
            <RouterLink to="/" class="header-nav-link text-base">Trang chủ</RouterLink>
          </li>

          <li v-if="isLoggedIn" class="relative group">
            <button class="flex items-center space-x-2 text-base font-medium text-gray-700 hover:text-blue-600 focus:outline-none py-2 px-3 rounded-lg transition-colors duration-200 group-hover:bg-gray-100">
              <svg class="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
              <span>{{ userFullName }}</span>
              <svg class="h-4 w-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
            <ul class="absolute hidden group-hover:block bg-white/95 text-gray-800 py-2 rounded-md shadow-xl right-0 top-[calc(100%-4px)] mt-0 z-30 min-w-[180px] origin-top-right animate-fade-in-down border border-gray-200 backdrop-blur-md">
              <li>
                <RouterLink to="/profile" class="block px-5 py-2 text-sm hover:bg-blue-50 transition-colors duration-200">Hồ sơ của tôi</RouterLink>
              </li>
              <li v-if="userRoles.includes('Admin')">
                <RouterLink to="/admin" class="block px-5 py-2 text-sm hover:bg-blue-50 transition-colors duration-200">Quản trị hệ thống</RouterLink>
              </li>
              <li v-if="userRoles.includes('Instructor')">
                <RouterLink to="/instructor" class="block px-5 py-2 text-sm hover:bg-blue-50 transition-colors duration-200">Quản lý giảng dạy</RouterLink>
              </li>
              <li v-if="userRoles.includes('Student')">
                <RouterLink to="/student" class="block px-5 py-2 text-sm hover:bg-blue-50 transition-colors duration-200">Xem thông tin sinh viên</RouterLink>
              </li>
              <li>
                <button @click="handleLogout" class="w-full text-left px-5 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors duration-200 border-t border-gray-200">Đăng xuất</button>
              </li>
            </ul>
          </li>
          <li v-else>
            <RouterLink to="/login" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 text-base">
              Đăng nhập
            </RouterLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.2s ease-out forwards;
}

.header-nav-link {
  @apply text-base font-medium text-gray-700 relative pb-1;
  transition: color 0.2s ease-in-out;
}

.header-nav-link::after {
  content: '';
  @apply absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 ease-in-out;
}

.header-nav-link:hover::after {
  @apply w-full;
}

.header-nav-link.router-link-active {
  @apply text-blue-600;
}

.header-nav-link.router-link-active::after {
  @apply w-full bg-blue-600;
}
</style>