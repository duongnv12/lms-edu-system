<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Quản trị hệ thống</h1>
          <p class="text-gray-600">Chào mừng bạn đến với trang quản trị LMS Edu System</p>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Tổng số môn học</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalCourses }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Tổng số khoa</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalDepartments }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Chương trình đào tạo</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.totalCurriculums }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">Người dùng hoạt động</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stats.activeUsers }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Modules -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Modules Quản lý</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Course Management -->
          <router-link to="/courses" class="group block p-6 bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-lg">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-blue-600 group-hover:text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-blue-900">Quản lý Môn học</h3>
                <p class="mt-2 text-sm text-gray-600">Quản lý danh sách môn học, thông tin môn học và điều kiện tiên quyết</p>
              </div>
            </div>
          </router-link>

          <!-- Department Management -->
          <router-link to="/departments" class="group block p-6 bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 rounded-lg border border-green-200 transition-all duration-200 hover:shadow-lg">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-green-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-green-900">Quản lý Khoa</h3>
                <p class="mt-2 text-sm text-gray-600">Quản lý thông tin các khoa, ngành và bộ môn trong trường</p>
              </div>
            </div>
          </router-link>

          <!-- Curriculum Management -->
          <router-link to="/curriculums" class="group block p-6 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg border border-purple-200 transition-all duration-200 hover:shadow-lg">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-purple-600 group-hover:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 group-hover:text-purple-900">Quản lý Chương trình Đào tạo</h3>
                <p class="mt-2 text-sm text-gray-600">Thiết lập và quản lý khung chương trình đào tạo cho các ngành</p>
              </div>
            </div>
          </router-link>

          <!-- User Management -->
          <div class="group block p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 opacity-60">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Quản lý Người dùng</h3>
                <p class="mt-2 text-sm text-gray-600">Quản lý tài khoản sinh viên, giảng viên và quản trị viên</p>
                <span class="inline-block mt-2 px-2 py-1 text-xs bg-yellow-200 text-yellow-800 rounded">Sắp ra mắt</span>
              </div>
            </div>
          </div>

          <!-- Student Progress -->
          <div class="group block p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200 opacity-60">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Theo dõi Tiến độ</h3>
                <p class="mt-2 text-sm text-gray-600">Theo dõi tiến độ học tập và hoàn thành chương trình của sinh viên</p>
                <span class="inline-block mt-2 px-2 py-1 text-xs bg-indigo-200 text-indigo-800 rounded">Sắp ra mắt</span>
              </div>
            </div>
          </div>

          <!-- Reports -->
          <div class="group block p-6 bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg border border-pink-200 opacity-60">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="h-8 w-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">Báo cáo & Thống kê</h3>
                <p class="mt-2 text-sm text-gray-600">Tạo báo cáo và xem thống kê tổng quan hệ thống</p>
                <span class="inline-block mt-2 px-2 py-1 text-xs bg-pink-200 text-pink-800 rounded">Sắp ra mắt</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">Hoạt động Gần đây</h2>
        <div v-if="loading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
        <div v-else-if="recentActivities.length === 0" class="text-center py-8">
          <p class="text-gray-500">Chưa có hoạt động nào được ghi nhận</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="activity in recentActivities" :key="activity.id" class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
            <div class="flex-shrink-0">
              <div :class="getActivityIcon(activity.type)" class="h-6 w-6">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getActivityIconPath(activity.type)"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900">{{ activity.title }}</p>
              <p class="text-sm text-gray-500">{{ activity.description }}</p>
              <p class="text-xs text-gray-400 mt-1">{{ formatDate(activity.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import api from '../services/api'

export default {
  name: 'Admin',
  setup() {
    const loading = ref(false)
    const stats = ref({
      totalCourses: 0,
      totalDepartments: 0,
      totalCurriculums: 0,
      activeUsers: 0
    })
    const recentActivities = ref([])

    const fetchStats = async () => {
      try {
        // Fetch basic stats
        const [coursesRes, departmentsRes, curriculumsRes] = await Promise.all([
          api.get('/courses', { params: { limit: 1 } }),
          api.get('/departments', { params: { limit: 1 } }),
          api.get('/curriculums', { params: { limit: 1 } })
        ])

        stats.value = {
          totalCourses: coursesRes.data.pagination?.total || 0,
          totalDepartments: departmentsRes.data.pagination?.total || 0,
          totalCurriculums: curriculumsRes.data.pagination?.total || 0,
          activeUsers: 0 // Will be implemented later
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    const getActivityIcon = (type) => {
      const icons = {
        course: 'text-blue-500',
        department: 'text-green-500',
        curriculum: 'text-purple-500',
        user: 'text-yellow-500'
      }
      return icons[type] || 'text-gray-500'
    }

    const getActivityIconPath = (type) => {
      const paths = {
        course: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
        department: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
        curriculum: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        user: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
      }
      return paths[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      fetchStats()
    })

    return {
      loading,
      stats,
      recentActivities,
      getActivityIcon,
      getActivityIconPath,
      formatDate
    }
  }
}
</script>