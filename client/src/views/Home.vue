<script setup>
// Trang Home tổng quan, không cần fetch thông tin cá nhân nữa
</script>

<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-xl p-8 sm:p-10 md:p-12 mb-8">
      <div class="flex flex-col items-center mb-10">
        <img src="https://cdn-icons-png.flaticon.com/512/3135/3135768.png" alt="LMS Logo" class="w-20 h-20 mb-4 drop-shadow-lg" />
        <h1 class="text-5xl font-black text-blue-700 mb-4 tracking-tight text-center">
          Chào mừng đến với Hệ thống LMS
        </h1>
        <p class="text-xl text-gray-700 mb-2 text-center max-w-2xl leading-relaxed">
          Nền tảng quản lý học tập trực tuyến dành cho sinh viên, giảng viên và cán bộ quản lý của Trường Đại học Phenikaa.
        </p>
        <p class="text-base text-gray-500 text-center max-w-2xl">
          Quản lý khóa học, theo dõi tiến độ, nhận thông báo quan trọng và nhiều tính năng hữu ích khác.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
        <div class="flex flex-col items-center text-center bg-blue-50 rounded-xl p-6 shadow hover:scale-105 transition-transform duration-200">
          <div class="bg-blue-100 rounded-full p-4 mb-4">
            <!-- Book Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m0 0c-2.21 0-4-1.79-4-4V6c0-2.21 1.79-4 4-4s4 1.79 4 4v8c0 2.21-1.79 4-4 4z"/>
            </svg>
          </div>
          <h2 class="text-lg font-bold mb-2 text-blue-700">Quản lý khóa học</h2>
          <p class="text-gray-600">Đăng ký, xem tài liệu, nộp bài tập và theo dõi tiến độ học tập của bạn một cách dễ dàng.</p>
        </div>
        <div class="flex flex-col items-center text-center bg-green-50 rounded-xl p-6 shadow hover:scale-105 transition-transform duration-200">
          <div class="bg-green-100 rounded-full p-4 mb-4">
            <!-- Bell Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
          </div>
          <h2 class="text-lg font-bold mb-2 text-green-700">Tương tác & thông báo</h2>
          <p class="text-gray-600">Nhận thông báo mới nhất, trao đổi với giảng viên và bạn học qua diễn đàn, tin nhắn.</p>
        </div>
        <div class="flex flex-col items-center text-center bg-purple-50 rounded-xl p-6 shadow hover:scale-105 transition-transform duration-200">
          <div class="bg-purple-100 rounded-full p-4 mb-4">
            <!-- Shield Check Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-purple-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4l7 4v4c0 5.25-3.5 9.74-7 12-3.5-2.26-7-6.75-7-12V8l7-4z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <h2 class="text-lg font-bold mb-2 text-purple-700">Bảo mật & hỗ trợ</h2>
          <p class="text-gray-600">Thông tin cá nhân của bạn được bảo vệ an toàn. Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc.</p>
        </div>
      </div>

      <div class="mt-12 text-center">
        <router-link to="/about" class="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-10 rounded-full shadow-lg text-lg transition">
          Tìm hiểu thêm về hệ thống
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* No extra styles needed, all handled by Tailwind */
</style>