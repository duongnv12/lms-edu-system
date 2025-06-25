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

// Mobile menu state
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const handleLogout = () => {
  console.log("[TheHeader] User initiated logout.");
  logout(); // Gọi hàm logout từ authService (nó sẽ cập nhật Pinia store)
  closeMobileMenu();
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
      'bg-white/80 shadow-md text-gray-800 sticky top-0 z-20 transition-all duration-300 ease-in-out backdrop-blur-md',
      'rounded-b-xl border-b border-blue-100',
      isScrolled ? 'backdrop-blur-lg bg-white/60 shadow-lg border-blue-200' : ''
    ]"
  >
    <div class="container mx-auto">
      <!-- Main header content -->
      <div class="flex justify-between items-center h-16 px-2">
        <!-- Logo -->
        <RouterLink to="/" class="text-2xl font-extrabold flex items-center space-x-2 text-blue-800 hover:text-blue-600 transition-colors duration-200">
          <img src="/logo.png" alt="LMS Logo" class="h-8 w-auto rounded-lg shadow-sm">
          <span class="hidden sm:inline">LMS Edu System</span>
        </RouterLink>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:block">
          <ul class="flex space-x-3 items-center">
            <li>
              <RouterLink to="/" class="nav-box" active-class="nav-box-active">Trang chủ</RouterLink>
            </li>
            <li>
              <RouterLink to="/courses" class="nav-box" active-class="nav-box-active">Học phần</RouterLink>
            </li>
            <li>
              <RouterLink to="/departments" class="nav-box" active-class="nav-box-active">Khoa</RouterLink>
            </li>
            <li>
              <RouterLink to="/curriculums" class="nav-box" active-class="nav-box-active">Chương trình</RouterLink>
            </li>

            <li v-if="isLoggedIn" class="relative group">
              <button class="user-box flex items-center space-x-2 text-base font-medium focus:outline-none py-2 px-3 rounded-lg transition-colors duration-200 border border-orange-200 bg-orange-50 text-orange-800 shadow-sm">
                <svg class="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                <span class="font-semibold">{{ userFullName }}</span>
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
              <RouterLink to="/login" class="nav-box bg-blue-600 hover:bg-blue-700 text-white font-semibold">Đăng nhập</RouterLink>
            </li>
          </ul>
        </nav>

        <!-- Mobile menu button -->
        <div class="lg:hidden flex items-center space-x-2">
          <!-- User info for mobile -->
          <div v-if="isLoggedIn" class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700 hidden sm:inline">{{ userFullName }}</span>
            <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <svg class="h-4 w-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
            </div>
          </div>
          
          <!-- Hamburger button -->
          <button
            @click="toggleMobileMenu"
            class="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
            :class="{ 'bg-gray-100': isMobileMenuOpen }"
          >
            <span class="sr-only">Mở menu</span>
            <!-- Hamburger icon -->
            <svg
              class="h-6 w-6 transition-transform duration-200"
              :class="{ 'rotate-90': isMobileMenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                v-if="!isMobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <div
          v-show="isMobileMenuOpen"
          class="lg:hidden bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200"
        >
          <div class="px-2 pt-2 pb-3 space-y-1">
            <!-- Main Navigation -->
            <RouterLink
              to="/"
              @click="closeMobileMenu"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Trang chủ
            </RouterLink>

            <RouterLink
              to="/courses"
              @click="closeMobileMenu"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Học phần
            </RouterLink>

            <RouterLink
              to="/departments"
              @click="closeMobileMenu"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Khoa
            </RouterLink>

            <RouterLink
              to="/curriculums"
              @click="closeMobileMenu"
              class="mobile-nav-link"
              active-class="mobile-nav-link-active"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Chương trình
          </RouterLink>

          <!-- User Menu (Mobile) -->
          <div v-if="isLoggedIn" class="border-t border-gray-200 pt-3 mt-3">
            <div class="px-3 py-2">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <svg class="h-5 w-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <div>
                  <div class="text-base font-medium text-gray-900">{{ userFullName }}</div>
                  <div class="text-sm text-gray-500">{{ userRoles.join(', ') }}</div>
                </div>
              </div>
            </div>
            
            <RouterLink
              to="/profile"
              @click="closeMobileMenu"
              class="mobile-nav-link"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Hồ sơ của tôi
            </RouterLink>

            <RouterLink
              v-if="userRoles.includes('Admin')"
              to="/admin"
              @click="closeMobileMenu"
              class="mobile-nav-link"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Quản trị hệ thống
            </RouterLink>

            <RouterLink
              v-if="userRoles.includes('Instructor')"
              to="/instructor"
              @click="closeMobileMenu"
              class="mobile-nav-link"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Quản lý giảng dạy
            </RouterLink>

            <RouterLink
              v-if="userRoles.includes('Student')"
              to="/student"
              @click="closeMobileMenu"
              class="mobile-nav-link"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
              </svg>
              Thông tin sinh viên
            </RouterLink>

            <button
              @click="handleLogout"
              class="mobile-nav-link text-red-600 hover:bg-red-50 w-full text-left"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Đăng xuất
            </button>
          </div>

          <!-- Login button for mobile -->
          <div v-else class="border-t border-gray-200 pt-3 mt-3">
            <RouterLink
              to="/login"
              @click="closeMobileMenu"
              class="mobile-nav-link bg-blue-600 text-white hover:bg-blue-700"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Đăng nhập
            </RouterLink>
          </div>
        </div>
      </div>
    </transition>
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

.nav-box {
  @apply px-5 py-2 rounded-xl font-semibold text-base transition-all duration-200 bg-white border border-orange-200 shadow text-orange-800 hover:bg-orange-50 hover:text-orange-700 hover:shadow-md;
  position: relative;
}

.nav-box-active,
.nav-box.router-link-active {
  @apply bg-gradient-to-r from-orange-400 to-orange-600 text-white border-orange-600 shadow-lg font-bold;
}

.user-box {
  @apply px-5 py-2 rounded-xl font-semibold text-base border border-orange-300 bg-orange-100 text-orange-900 shadow cursor-pointer transition-all duration-200;
  box-shadow: 0 2px 8px 0 rgba(251, 146, 60, 0.10);
}

.user-box:hover,
.user-box:focus {
  @apply bg-orange-200 text-orange-900 shadow-lg border-orange-400;
}

/* Mobile navigation styles */
.mobile-nav-link {
  @apply flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200;
}

.mobile-nav-link-active,
.mobile-nav-link.router-link-active {
  @apply bg-orange-50 text-orange-700 border-l-4 border-orange-500 pl-2;
}

.mobile-nav-link svg {
  @apply flex-shrink-0;
}

/* Smooth transitions for mobile menu */
.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .nav-box {
    @apply px-3 py-1.5 text-sm;
  }
  
  .user-box {
    @apply px-3 py-1.5 text-sm;
  }
}

/* Improve mobile touch targets */
@media (max-width: 768px) {
  .mobile-nav-link {
    @apply py-3 text-lg;
    min-height: 48px; /* Ensure minimum touch target size */
  }
}
</style>