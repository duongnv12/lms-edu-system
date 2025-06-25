<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <img src="/logo.png" alt="LMS Logo" class="w-20 h-20 mx-auto mb-6 rounded-lg shadow-lg" />
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Chào mừng đến với
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              LMS Edu System
            </span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Nền tảng quản lý học tập và chương trình đào tạo hiện đại, 
            dành cho sinh viên, giảng viên và cán bộ quản lý giáo dục
          </p>
        </div>
      </div>
    </div>

    <!-- Quick Access Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Truy cập nhanh</h2>
        <p class="text-lg text-gray-600">Chọn module bạn muốn sử dụng</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Course Management -->
        <router-link to="/courses" class="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200">
          <div class="p-8">
            <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-200 transition-colors">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Quản lý Môn học</h3>
            <p class="text-gray-600 mb-4">Quản lý danh sách môn học, thông tin chi tiết và điều kiện tiên quyết</p>
            <div class="text-blue-600 font-medium group-hover:text-blue-700">
              Truy cập →
            </div>
          </div>
        </router-link>

        <!-- Department Management -->
        <router-link to="/departments" class="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200">
          <div class="p-8">
            <div class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-lg mb-4 group-hover:bg-green-200 transition-colors">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Quản lý Khoa</h3>
            <p class="text-gray-600 mb-4">Quản lý thông tin các khoa, ngành và bộ môn trong trường</p>
            <div class="text-green-600 font-medium group-hover:text-green-700">
              Truy cập →
            </div>
          </div>
        </router-link>

        <!-- Curriculum Management -->
        <router-link to="/curriculums" class="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-purple-200">
          <div class="p-8">
            <div class="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-lg mb-4 group-hover:bg-purple-200 transition-colors">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Chương trình Đào tạo</h3>
            <p class="text-gray-600 mb-4">Thiết lập và quản lý khung chương trình đào tạo cho các ngành</p>
            <div class="text-purple-600 font-medium group-hover:text-purple-700">
              Truy cập →
            </div>
          </div>
        </router-link>

        <!-- Admin Panel -->
        <router-link to="/admin" class="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-orange-200" v-if="userRoles.includes('Admin')">
          <div class="p-8">
            <div class="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-lg mb-4 group-hover:bg-orange-200 transition-colors">
              <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">Quản trị Hệ thống</h3>
            <p class="text-gray-600 mb-4">Dashboard tổng quan và quản lý toàn bộ hệ thống</p>
            <div class="text-orange-600 font-medium group-hover:text-orange-700">
              Truy cập →
            </div>
          </div>
        </router-link>

        <!-- Profile -->
        <router-link to="/profile" class="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-indigo-200">
          <div class="p-8">
            <div class="flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-lg mb-4 group-hover:bg-indigo-200 transition-colors">
              <svg class="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Hồ sơ cá nhân</h3>
            <p class="text-gray-600 mb-4">Xem và cập nhật thông tin cá nhân của bạn</p>
            <div class="text-indigo-600 font-medium group-hover:text-indigo-700">
              Truy cập →
            </div>
          </div>
        </router-link>

        <!-- About -->
        <router-link to="/about" class="group block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200">
          <div class="p-8">
            <div class="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg mb-4 group-hover:bg-gray-200 transition-colors">
              <svg class="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">Về hệ thống</h3>
            <p class="text-gray-600 mb-4">Tìm hiểu thêm về LMS Edu System và các tính năng</p>
            <div class="text-gray-600 font-medium group-hover:text-gray-700">
              Tìm hiểu →
            </div>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Features Section -->
    <div class="bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Tính năng chính</h2>
          <p class="text-lg text-gray-600">Những tính năng nổi bật của hệ thống</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Quản lý toàn diện</h3>
            <p class="text-gray-600">Quản lý môn học, khoa và chương trình đào tạo một cách hiệu quả và tập trung</p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Hiệu suất cao</h3>
            <p class="text-gray-600">Giao diện nhanh chóng, responsive và thân thiện với người dùng trên mọi thiết bị</p>
          </div>

          <div class="text-center">
            <div class="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">Bảo mật cao</h3>
            <p class="text-gray-600">Bảo vệ dữ liệu với hệ thống xác thực và phân quyền người dùng tiên tiến</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'

export default {
  name: 'Home',
  setup() {
    const authStore = useAuthStore()
    const userRoles = computed(() => authStore.userRoles)

    return {
      userRoles
    }
  }
}
</script>