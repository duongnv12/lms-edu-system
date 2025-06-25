<template>
  <BaseModal :show="show" @close="$emit('close')" :maxWidth="'max-w-4xl'">
    <div class="p-6">
      <!-- Header -->
      <div class="mb-6">
        <h3 class="text-lg font-medium text-gray-900">Thêm môn học vào chương trình</h3>
        <p class="text-sm text-gray-500 mt-1">Chọn môn học và thiết lập thông tin cho chương trình đào tạo</p>
      </div>

      <!-- Course Search -->
      <div class="mb-4">
        <div class="flex space-x-4">
          <div class="flex-1">
            <input
              v-model="searchTerm"
              @input="debouncedSearch"
              type="text"
              placeholder="Tìm kiếm môn học..."
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="w-48">
            <select
              v-model="selectedDepartment"
              @change="searchCourses"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả khoa</option>
              <option v-for="dept in departments" :key="dept.department_id" :value="dept.department_id">
                {{ dept.dept_name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>

      <!-- Course List -->
      <div v-else-if="courses.length > 0" class="mb-6">
        <div class="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 sticky top-0">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Môn học</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Khoa</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tín chỉ</th>
                <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Chọn</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="course in courses" :key="course.course_id" 
                :class="{ 'bg-blue-50': selectedCourse?.course_id === course.course_id }"
                @click="selectCourse(course)"
                class="hover:bg-gray-50 cursor-pointer">
                <td class="px-4 py-2">
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ course.course_name }}</div>
                    <div class="text-sm text-gray-500">{{ course.course_code }}</div>
                  </div>
                </td>
                <td class="px-4 py-2 text-sm text-gray-500">{{ course.department?.dept_name }}</td>
                <td class="px-4 py-2 text-sm text-gray-900">{{ course.credits }}</td>
                <td class="px-4 py-2 text-center">
                  <input
                    type="radio"
                    :checked="selectedCourse?.course_id === course.course_id"
                    @change="selectCourse(course)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- No courses found -->
      <div v-else class="text-center py-8 text-gray-500">
        Không tìm thấy môn học nào
      </div>

      <!-- Course Details Form -->
      <div v-if="selectedCourse" class="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 class="text-md font-medium text-gray-900 mb-4">Chi tiết môn học trong chương trình</h4>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Năm học đề xuất <span class="text-red-500">*</span>
            </label>
            <select
              v-model="courseDetails.year_suggested"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Năm 1</option>
              <option value="2">Năm 2</option>
              <option value="3">Năm 3</option>
              <option value="4">Năm 4</option>
              <option value="5">Năm 5</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Học kỳ đề xuất <span class="text-red-500">*</span>
            </label>
            <select
              v-model="courseDetails.semester_suggested"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Học kỳ 1</option>
              <option value="2">Học kỳ 2</option>
              <option value="3">Học kỳ hè</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nhóm môn học</label>
            <select
              v-model="courseDetails.course_group"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn nhóm</option>
              <option value="Cơ sở ngành">Cơ sở ngành</option>
              <option value="Chuyên ngành">Chuyên ngành</option>
              <option value="Tự chọn">Tự chọn</option>
              <option value="Đại cương">Đại cương</option>
              <option value="Thực tập">Thực tập</option>
              <option value="Tốt nghiệp">Tốt nghiệp</option>
            </select>
          </div>
          <div class="flex items-center">
            <label class="flex items-center">
              <input
                v-model="courseDetails.is_mandatory"
                type="checkbox"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="ml-2 text-sm text-gray-700">Môn học bắt buộc</span>
            </label>
          </div>
        </div>
        
        <!-- Course Description -->
        <div class="mt-4 p-3 bg-white rounded border">
          <h5 class="text-sm font-medium text-gray-900 mb-2">Thông tin môn học</h5>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-700">Mã môn:</span> {{ selectedCourse.course_code }}
            </div>
            <div>
              <span class="font-medium text-gray-700">Tên môn:</span> {{ selectedCourse.course_name }}
            </div>
            <div>
              <span class="font-medium text-gray-700">Số tín chỉ:</span> {{ selectedCourse.credits }}
            </div>
          </div>
          <div v-if="selectedCourse.description" class="mt-2">
            <span class="font-medium text-gray-700">Mô tả:</span>
            <p class="text-gray-600 mt-1">{{ selectedCourse.description }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Hủy
        </button>
        <button
          type="button"
          @click="addCourse"
          :disabled="!selectedCourse || !courseDetails.year_suggested || !courseDetails.semester_suggested"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Thêm môn học
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import { debounce } from 'lodash-es'
import api from '../services/api'
import BaseModal from './BaseModal.vue'

export default {
  name: 'CourseSelectionModal',
  components: {
    BaseModal
  },
  props: {
    show: Boolean,
    selectedCourses: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'select'],
  setup(props, { emit }) {
    const loading = ref(false)
    const courses = ref([])
    const departments = ref([])
    const selectedCourse = ref(null)
    const searchTerm = ref('')
    const selectedDepartment = ref('')

    const courseDetails = reactive({
      year_suggested: 1,
      semester_suggested: 1,
      course_group: '',
      is_mandatory: true
    })

    const searchCourses = async () => {
      try {
        loading.value = true
        const params = {
          limit: 100, // Get more courses for selection
          ...(searchTerm.value && { search: searchTerm.value }),
          ...(selectedDepartment.value && { department_id: selectedDepartment.value })
        }

        const response = await api.get('/courses', { params })
        
        // Filter out already selected courses
        const selectedCourseIds = props.selectedCourses.map(c => c.course_id)
        courses.value = response.data.data.filter(course => 
          !selectedCourseIds.includes(course.course_id)
        )
      } catch (error) {
        console.error('Error searching courses:', error)
        courses.value = []
      } finally {
        loading.value = false
      }
    }

    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments')
        departments.value = response.data.data
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }

    const debouncedSearch = debounce(searchCourses, 300)

    const selectCourse = (course) => {
      selectedCourse.value = course
      // Reset course details when selecting new course
      Object.assign(courseDetails, {
        year_suggested: 1,
        semester_suggested: 1,
        course_group: course.course_type || '',
        is_mandatory: true
      })
    }

    const addCourse = () => {
      if (!selectedCourse.value) return

      const courseData = {
        course_id: selectedCourse.value.course_id,
        course: selectedCourse.value,
        year_suggested: parseInt(courseDetails.year_suggested),
        semester_suggested: parseInt(courseDetails.semester_suggested),
        course_group: courseDetails.course_group,
        is_mandatory: courseDetails.is_mandatory
      }

      emit('select', courseData)
    }

    onMounted(() => {
      fetchDepartments()
      searchCourses()
    })

    return {
      loading,
      courses,
      departments,
      selectedCourse,
      searchTerm,
      selectedDepartment,
      courseDetails,
      searchCourses,
      debouncedSearch,
      selectCourse,
      addCourse
    }
  }
}
</script>
