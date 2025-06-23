<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">Về Hệ thống quản lý học tập (LMS)</h1>

    <div class="bg-white shadow-lg rounded-lg p-8 mb-8">
      <h2 class="text-2xl font-semibold text-blue-700 mb-4">Giới thiệu chung</h2>
      <p class="text-lg text-gray-700 mb-6 leading-relaxed">
        Phần mềm Quản lý Chương trình Đào tạo và Theo dõi Tiến độ Sinh viên của Trường Đại học Phenikaa là một giải pháp toàn diện, được phát triển nhằm tối ưu hóa quy trình quản lý học thuật và nâng cao trải nghiệm giáo dục. Hệ thống này giúp tự động hóa các tác vụ quản lý thủ công, giảm thiểu sai sót, và cung cấp một cái nhìn tổng quan minh bạch, hiệu quả về toàn bộ quá trình học tập của sinh viên.
      </p>
      <p class="text-lg text-gray-700 mb-8 leading-relaxed">
        Với sứ mệnh tạo ra một môi trường học tập và làm việc hiệu quả, chúng tôi cam kết cung cấp một nền tảng kỹ thuật số mạnh mẽ, linh hoạt và dễ sử dụng, nơi kiến thức được chia sẻ dễ dàng, sự hợp tác được khuyến khích và mỗi cá nhân có thể phát triển toàn diện.
      </p>

      <h2 class="text-2xl font-semibold text-blue-700 mb-4 mt-8">Các Module và Tính năng Chính</h2>

      <div class="space-y-8">
        <div class="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg shadow-sm">
          <h3 class="text-xl font-semibold text-blue-800 mb-3 flex items-center">
            <svg class="h-6 w-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
            1. Quản lý Chương trình Đào tạo
          </h3>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Quản lý Khóa học/Môn học:</strong> Thêm, sửa, xóa thông tin chi tiết về từng môn học, phân loại và quản lý đề cương.</li>
            <li><strong>Quản lý Chương trình Đào tạo:</strong> Xây dựng cấu trúc chương trình, gán môn học, thiết lập điều kiện hoàn thành và quản lý các phiên bản chương trình.</li>
            <li><strong>Quản lý Giảng viên:</strong> Lưu trữ thông tin và phân công giảng dạy cho từng môn học.</li>
          </ul>
        </div>

        <div class="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg shadow-sm">
          <h3 class="text-xl font-semibold text-green-800 mb-3 flex items-center">
            <svg class="h-6 w-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            2. Theo dõi Tiến độ Sinh viên
          </h3>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Hồ sơ Sinh viên:</strong> Lưu trữ thông tin cá nhân và lịch sử học tập.</li>
            <li><strong>Theo dõi Tiến độ:</strong> Trực quan hóa lộ trình học tập, tính toán tín chỉ tích lũy, kiểm tra điều kiện hoàn thành và dự đoán tiến độ.</li>
            <li><strong>Báo cáo Điểm số:</strong> Tổng hợp và hiển thị bảng điểm chi tiết.</li>
            <li><strong>Chức năng phân quyền:</strong> Cung cấp các chức năng cụ thể cho Sinh viên, Giảng viên và Cán bộ Quản lý.</li>
          </ul>
        </div>

        <div class="bg-purple-50 border-l-4 border-purple-400 p-6 rounded-lg shadow-sm">
          <h3 class="text-xl font-semibold text-purple-800 mb-3 flex items-center">
            <svg class="h-6 w-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Các Module Phụ trợ và Tính năng Mở rộng
          </h3>
          <ul class="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Quản lý Người dùng và Phân quyền:</strong> Đảm bảo quyền truy cập an toàn và phù hợp.</li>
            <li><strong>Báo cáo và Thống kê:</strong> Cung cấp cái nhìn sâu sắc về dữ liệu đào tạo và tiến độ.</li>
            <li><strong>Hệ thống Thông báo:</strong> Gửi thông báo tự động và kịp thời.</li>
            <li><strong>Khả năng Tích hợp:</strong> Dễ dàng kết nối với các hệ thống hiện có.</li>
            <li><strong>Giao diện Thân thiện:</strong> Thiết kế UI/UX hiện đại và dễ sử dụng.</li>
          </ul>
        </div>
      </div>

      <p class="text-lg text-gray-700 mt-10 italic text-center">
        "Nơi công nghệ gặp gỡ giáo dục, kiến tạo tương lai học đường tại Phenikaa University."
      </p>
    </div>
  </div>
</template>

<script setup>
// Không cần logic đặc biệt cho trang giới thiệu
</script>

<style scoped>
/* Có thể thêm các style tùy chỉnh nếu cần */
</style>