<script setup>
// Trang Home tổng quan, không cần fetch thông tin cá nhân nữa
</script>

<template>
  <div class="w-full">
    <div class="bg-white rounded-lg shadow-xl p-8 sm:p-10 md:p-12 mb-8">
      <h1 class="text-4xl font-extrabold text-blue-700 mb-6 border-b-2 border-blue-100 pb-3">
        Chào mừng đến với Hệ thống LMS
      </h1>
      <p class="text-lg text-gray-700 mb-8 leading-relaxed">
        Đây là nền tảng quản lý học tập trực tuyến dành cho sinh viên, giảng viên và cán bộ quản lý của Trường Đại học Phenikaa.<br>
        Bạn có thể quản lý khóa học, theo dõi tiến độ học tập, nhận thông báo quan trọng và nhiều tính năng hữu ích khác.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div class="flex flex-col items-center text-center">
          <svg class="h-12 w-12 text-blue-500 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5a12.083 12.083 0 01-6.16-10.922L12 14z" />
          </svg>
          <h2 class="text-xl font-semibold mb-2">Quản lý khóa học</h2>
          <p class="text-gray-600">Đăng ký, xem tài liệu, nộp bài tập và theo dõi tiến độ học tập của bạn một cách dễ dàng.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <svg class="h-12 w-12 text-green-500 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m9-4V6a4 4 0 00-8 0v4m12 0H4" />
          </svg>
          <h2 class="text-xl font-semibold mb-2">Tương tác & thông báo</h2>
          <p class="text-gray-600">Nhận thông báo mới nhất, trao đổi với giảng viên và bạn học qua diễn đàn, tin nhắn.</p>
        </div>
        <div class="flex flex-col items-center text-center">
          <svg class="h-12 w-12 text-purple-500 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3v4a3 3 0 006 0v-4c0-1.657-1.343-3-3-3z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 20h14a2 2 0 002-2v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7a2 2 0 002 2z" />
          </svg>
          <h2 class="text-xl font-semibold mb-2">Bảo mật & hỗ trợ</h2>
          <p class="text-gray-600">Thông tin cá nhân của bạn được bảo vệ an toàn. Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc.</p>
        </div>
      </div>

      <div class="mt-10 text-center">
        <router-link to="/about" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow transition">
          Tìm hiểu thêm về hệ thống
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles for HomeView if any. Currently none needed for basic layout. */
</style>