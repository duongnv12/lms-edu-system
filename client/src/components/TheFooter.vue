<template>
  <footer class="bg-gray-900 text-gray-300 py-8 px-6 text-sm shadow-inner mt-auto">
    <div class="container mx-auto flex flex-col md:flex-row justify-between md:items-start space-y-8 md:space-y-0 md:space-x-8">

      <div class="flex flex-col items-center md:items-start text-center md:text-left md:w-1/3">
        <RouterLink to="/" class="flex items-center space-x-2 mb-3">
          <img src="/logo.png" alt="LMS Logo" class="h-8 w-auto">
          <span class="text-xl font-bold text-white">LMS Edu System</span>
        </RouterLink>
        <p class="text-gray-400">&copy; {{ new Date().getFullYear() }} LMS Edu System.</p>
        <p class="text-gray-500 text-xs mt-1">Phiên bản 1.0.0</p>
      </div>

      <div class="text-center md:text-left md:w-1/3">
        <h3 class="text-white font-semibold mb-3 text-base">Liên kết nhanh</h3>
        <ul class="space-y-2">
          <li><RouterLink to="/about" class="text-gray-400 hover:text-blue-400 transition-colors duration-200">Về chúng tôi</RouterLink></li>
          <li><RouterLink to="/contact" class="text-gray-400 hover:text-blue-400 transition-colors duration-200">Liên hệ</RouterLink></li>
          <li><RouterLink to="/privacy" class="text-gray-400 hover:text-blue-400 transition-colors duration-200">Chính sách bảo mật</RouterLink></li>
        </ul>
      </div>

      <div class="text-center md:text-left md:w-1/3">
        <h3 class="text-white font-semibold mb-3 text-base">Thông tin liên hệ</h3>
        <ul class="space-y-2">
          <li class="flex items-center justify-center md:justify-start space-x-2">
            <svg class="h-4 w-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M14.243 5.243a6 6 0 00-8.486 0L3 7.514V17h9.486L14.243 15.243a6 6 0 000-8.486zM9 11a1 1 0 11-2 0 1 1 0 012 0zm2 0a1 1 0 11-2 0 1 1 0 012 0z" clip-rule="evenodd"></path></svg>
            <span class="text-gray-400 break-words">support@phenikaa-uni.edu.vn</span>
          </li>
          <li class="flex items-center justify-center md:justify-start space-x-2">
            <svg class="h-4 w-4 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
            <span class="text-gray-400">+84 24 3974 6767</span> </li>
          <li class="flex items-start justify-center md:justify-start space-x-2">
            <svg class="h-4 w-4 text-gray-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
            <span class="text-gray-400">Đường Tố Hữu, P. Yên Nghĩa, Q. Hà Đông, TP. Hà Nội, Việt Nam</span>
          </li>
        </ul>
      </div>

    </div>
    <div class="mt-8 pt-4 border-t border-gray-700 text-center text-gray-500 text-xs">
      <p>Được thiết kế cho sinh viên và giảng viên Trường Đại học Phenikaa.</p>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router';
// Không cần logic phức tạp cho footer
</script>

<style scoped>
/* Không cần style scoped nếu chỉ dùng Tailwind */
</style>