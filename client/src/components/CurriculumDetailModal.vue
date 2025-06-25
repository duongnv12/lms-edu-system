<template>
  <BaseModal :show="show" @close="$emit('close')" :maxWidth="'max-w-7xl'">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="material-icons text-3xl">school</span>
        <div>
          <h2 class="text-xl font-bold">Chi tiết chương trình đào tạo</h2>
          <p class="text-green-100 text-sm opacity-90">Xem thông tin chi tiết và cấu trúc chương trình</p>
        </div>
      </div>
    </template>

    <div class="p-6">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="flex flex-col items-center gap-4">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
          <p class="text-gray-600">Đang tải thông tin chương trình...</p>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="curriculumData" class="space-y-6">
        <!-- Header Info Card -->
        <div class="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
          <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
              <h2 class="text-2xl font-bold text-gray-900 mb-2">{{ curriculumData.curriculum_name }}</h2>
              <div class="flex flex-wrap items-center gap-3">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                  <span class="material-icons text-sm mr-1">tag</span>
                  {{ curriculumData.curriculum_code }}
                </span>
                <span :class="curriculumData.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium">
                  <span class="material-icons text-sm mr-1">{{ curriculumData.is_active ? 'check_circle' : 'cancel' }}</span>
                  {{ curriculumData.is_active ? 'Đang áp dụng' : 'Ngừng áp dụng' }}
                </span>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <span class="material-icons text-sm mr-1">bookmark</span>
                  {{ curriculumData.version }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="curriculumData.description" class="bg-white/70 rounded-lg p-4 border border-green-100">
            <h3 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span class="material-icons text-sm mr-1">description</span>
              Mô tả chương trình
            </h3>
            <p class="text-gray-700 leading-relaxed">{{ curriculumData.description }}</p>
          </div>
        </div>

        <!-- Basic Information & Statistics -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- Basic Information -->
          <div class="xl:col-span-2">
            <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div class="px-6 py-4 border-b border-gray-100">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <span class="material-icons text-green-600 mr-2">info</span>
                  Thông tin cơ bản
                </h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div class="flex items-start gap-3">
                    <span class="material-icons text-purple-500 mt-1">category</span>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Ngành</label>
                      <p class="text-gray-900 font-medium">{{ curriculumData.major?.major_name || 'Chưa xác định' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="material-icons text-blue-500 mt-1">calendar_today</span>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Năm học áp dụng</label>
                      <p class="text-gray-900 font-medium">{{ curriculumData.academic_year }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="material-icons text-orange-500 mt-1">school</span>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Tổng số tín chỉ</label>
                      <p class="text-gray-900 font-medium">{{ curriculumData.total_credits }} tín chỉ</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="material-icons text-red-500 mt-1">grade</span>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">GPA tối thiểu</label>
                      <p class="text-gray-900 font-medium">{{ curriculumData.min_gpa || 'Không yêu cầu' }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="material-icons text-teal-500 mt-1">event</span>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Ngày hiệu lực</label>
                      <p class="text-gray-900 font-medium">{{ formatDate(curriculumData.effective_date) }}</p>
                    </div>
                  </div>
                  <div class="flex items-start gap-3">
                    <span class="material-icons text-indigo-500 mt-1">people</span>
                    <div>
                      <label class="block text-sm font-medium text-gray-500 mb-1">Sinh viên đang theo học</label>
                      <p class="text-gray-900 font-medium">{{ curriculumData._count?.students || 0 }} sinh viên</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div>
            <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 shadow-sm">
              <div class="px-6 py-4 border-b border-green-100">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <span class="material-icons text-green-600 mr-2">analytics</span>
                  Thống kê
                </h3>
              </div>
              <div class="p-6 space-y-4">
                <div class="bg-white rounded-lg p-4 border border-green-100">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600 flex items-center">
                      <span class="material-icons text-sm text-blue-500 mr-2">menu_book</span>
                      Tổng môn học
                    </span>
                    <span class="text-lg font-bold text-gray-900">{{ curriculumData.curriculumCourses?.length || 0 }}</span>
                  </div>
                </div>
                <div class="bg-white rounded-lg p-4 border border-green-100">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600 flex items-center">
                      <span class="material-icons text-sm text-red-500 mr-2">priority_high</span>
                      Môn bắt buộc
                    </span>
                    <span class="text-lg font-bold text-red-600">{{ mandatoryCourses.length }}</span>
                  </div>
                </div>
                <div class="bg-white rounded-lg p-4 border border-green-100">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600 flex items-center">
                      <span class="material-icons text-sm text-blue-500 mr-2">library_books</span>
                      Môn tự chọn
                    </span>
                    <span class="text-lg font-bold text-blue-600">{{ electiveCourses.length }}</span>
                  </div>
                </div>
                <div class="bg-white rounded-lg p-4 border border-green-100">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600 flex items-center">
                      <span class="material-icons text-sm text-orange-500 mr-2">stars</span>
                      TC bắt buộc
                    </span>
                    <span class="text-lg font-bold text-orange-600">{{ mandatoryCredits }}</span>
                  </div>
                </div>
                <div class="bg-white rounded-lg p-4 border border-green-100">
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600 flex items-center">
                      <span class="material-icons text-sm text-purple-500 mr-2">auto_awesome</span>
                      TC tự chọn
                    </span>
                    <span class="text-lg font-bold text-purple-600">{{ electiveCredits }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Structure -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-100">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                <span class="material-icons text-green-600 mr-2">account_tree</span>
                Cấu trúc chương trình
              </h3>
              <div class="flex gap-2">
                <button
                  @click="viewMode = 'year'"
                  :class="viewMode === 'year' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span class="material-icons text-sm">view_timeline</span>
                  Theo năm
                </button>
                <button
                  @click="viewMode = 'group'"
                  :class="viewMode === 'group' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  <span class="material-icons text-sm">view_module</span>
                  Theo nhóm
                </button>
              </div>
            </div>
          </div>

          <div class="p-6">
            <!-- View by Year -->
            <div v-if="viewMode === 'year'" class="space-y-6">
              <div v-for="year in years" :key="year" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 overflow-hidden">
                <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3">
                  <h4 class="text-lg font-semibold flex items-center">
                    <span class="material-icons mr-2">school</span>
                    Năm {{ year }}
                  </h4>
                </div>
                <div class="p-6">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div v-for="semester in [1, 2]" :key="semester" class="space-y-3">
                      <h5 class="text-base font-semibold text-gray-800 flex items-center pb-2 border-b border-blue-200">
                        <span class="material-icons text-sm mr-2 text-blue-600">calendar_month</span>
                        Học kỳ {{ semester }}
                      </h5>
                      <div class="space-y-2">
                        <div v-for="course in getCoursesByYearSemester(year, semester)" 
                          :key="course.course_id"
                          class="bg-white rounded-lg p-4 border border-blue-100 hover:shadow-md transition-shadow">
                          <div class="flex justify-between items-start">
                            <div class="flex-1">
                              <div class="text-sm font-semibold text-gray-900 mb-1">{{ course.course.course_name }}</div>
                              <div class="text-xs text-gray-500 flex items-center">
                                <span class="material-icons text-xs mr-1">tag</span>
                                {{ course.course.course_code }}
                              </div>
                            </div>
                            <div class="flex flex-col items-end gap-1 ml-3">
                              <span class="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {{ course.course.credits }} TC
                              </span>
                              <span :class="course.is_mandatory ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'"
                                class="px-2 py-0.5 rounded text-xs font-medium">
                                {{ course.is_mandatory ? 'BẮT BUỘC' : 'TỰ CHỌN' }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div v-if="getCoursesByYearSemester(year, semester).length === 0" 
                          class="text-center py-6 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                          <span class="material-icons text-gray-400 mb-2">inbox</span>
                          <p class="text-sm">Không có môn học</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- View by Group -->
            <div v-else class="space-y-4">
              <div v-for="group in courseGroups" :key="group.name" class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 overflow-hidden">
                <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
                  <div class="flex justify-between items-center">
                    <h4 class="text-lg font-semibold flex items-center">
                      <span class="material-icons mr-2">folder</span>
                      {{ group.name }}
                    </h4>
                    <span class="text-purple-100 text-sm bg-white/20 px-3 py-1 rounded-full">
                      {{ group.courses.length }} môn • {{ group.credits }} tín chỉ
                    </span>
                  </div>
                </div>
                <div class="p-6">
                  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div v-for="course in group.courses" :key="course.course_id"
                      class="bg-white rounded-lg p-4 border border-purple-100 hover:shadow-md transition-shadow">
                      <div class="flex justify-between items-start">
                        <div class="flex-1">
                          <div class="text-sm font-semibold text-gray-900 mb-1">{{ course.course.course_name }}</div>
                          <div class="text-xs text-gray-500 flex items-center mb-2">
                            <span class="material-icons text-xs mr-1">tag</span>
                            {{ course.course.course_code }}
                          </div>
                          <div class="text-xs text-purple-600 flex items-center">
                            <span class="material-icons text-xs mr-1">schedule</span>
                            Năm {{ course.year_suggested }}, HK {{ course.semester_suggested }}
                          </div>
                        </div>
                        <div class="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded ml-3">
                          {{ course.course.credits }} TC
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Requirements -->
        <div v-if="curriculumData.requirements?.length > 0" class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center">
              <span class="material-icons text-amber-600 mr-2">rule</span>
              Yêu cầu tốt nghiệp
            </h3>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="requirement in curriculumData.requirements" :key="requirement.requirement_id"
                class="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border border-amber-200">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="text-sm font-semibold text-gray-900 mb-1 flex items-center">
                      <span class="material-icons text-xs text-amber-600 mr-1">check_circle</span>
                      {{ requirement.requirement_name }}
                    </div>
                    <div v-if="requirement.description" class="text-xs text-gray-600">{{ requirement.description }}</div>
                  </div>
                  <div class="text-sm font-bold text-amber-700 bg-white px-2 py-1 rounded ml-3">{{ requirement.value }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-4">
          <button
            @click="$emit('close')"
            class="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <span class="material-icons text-sm">close</span>
            Đóng
          </button>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'
import api from '../services/api'
import BaseModal from './BaseModal.vue'

export default {
  name: 'CurriculumDetailModal',
  components: {
    BaseModal
  },
  props: {
    show: Boolean,
    curriculum: Object
  },
  emits: ['close'],
  setup(props) {
    const loading = ref(false)
    const curriculumData = ref(null)
    const viewMode = ref('year')

    // Fetch detailed curriculum data
    const fetchCurriculumData = async () => {
      if (!props.curriculum) return
      
      try {
        loading.value = true
        const response = await api.get(`/curriculums/${props.curriculum.curriculum_id}`)
        curriculumData.value = response.data.data
      } catch (error) {
        console.error('Error fetching curriculum data:', error)
      } finally {
        loading.value = false
      }
    }

    // Watch for curriculum changes
    watch(() => props.curriculum, () => {
      if (props.show && props.curriculum) {
        fetchCurriculumData()
      }
    })

    // Watch for show prop changes
    watch(() => props.show, (newShow) => {
      if (newShow && props.curriculum) {
        fetchCurriculumData()
      }
    })

    // Computed properties for statistics
    const mandatoryCourses = computed(() => {
      return curriculumData.value?.curriculumCourses?.filter(c => c.is_mandatory) || []
    })

    const electiveCourses = computed(() => {
      return curriculumData.value?.curriculumCourses?.filter(c => !c.is_mandatory) || []
    })

    const mandatoryCredits = computed(() => {
      return mandatoryCourses.value.reduce((sum, c) => sum + (c.course?.credits || 0), 0)
    })

    const electiveCredits = computed(() => {
      return electiveCourses.value.reduce((sum, c) => sum + (c.course?.credits || 0), 0)
    })

    // Get unique years
    const years = computed(() => {
      const courseYears = curriculumData.value?.curriculumCourses?.map(c => c.year_suggested) || []
      return [...new Set(courseYears)].sort()
    })

    // Get courses by year and semester
    const getCoursesByYearSemester = (year, semester) => {
      return curriculumData.value?.curriculumCourses?.filter(c => 
        c.year_suggested === year && c.semester_suggested === semester
      ) || []
    }

    // Group courses by course_group
    const courseGroups = computed(() => {
      const courses = curriculumData.value?.curriculumCourses || []
      const groups = {}

      courses.forEach(course => {
        const groupName = course.course_group || 'Khác'
        if (!groups[groupName]) {
          groups[groupName] = {
            name: groupName,
            courses: [],
            credits: 0
          }
        }
        groups[groupName].courses.push(course)
        groups[groupName].credits += course.course?.credits || 0
      })

      return Object.values(groups)
    })

    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('vi-VN')
    }

    onMounted(() => {
      if (props.show && props.curriculum) {
        fetchCurriculumData()
      }
    })

    return {
      loading,
      curriculumData,
      viewMode,
      mandatoryCourses,
      electiveCourses,
      mandatoryCredits,
      electiveCredits,
      years,
      courseGroups,
      getCoursesByYearSemester,
      formatDate
    }
  }
}
</script>

<style scoped>
.material-icons { 
  font-family: 'Material Icons'; 
  font-style: normal; 
  font-weight: normal; 
  font-size: 20px; 
  line-height: 1; 
  letter-spacing: normal; 
  text-transform: none; 
  display: inline-block; 
  direction: ltr; 
  font-feature-settings: 'liga'; 
  -webkit-font-feature-settings: 'liga'; 
  -webkit-font-smoothing: antialiased; 
}
</style>
