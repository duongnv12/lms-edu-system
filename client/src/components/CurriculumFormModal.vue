<template>
  <BaseModal :show="show" @close="$emit('close')" :maxWidth="'max-w-7xl'">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="material-icons text-3xl">{{ isEdit ? 'edit' : 'add_circle' }}</span>
        <div>
          <h2 class="text-xl font-bold">
            {{ isEdit ? 'Chỉnh sửa chương trình đào tạo' : 'Thêm chương trình đào tạo mới' }}
          </h2>
          <p class="text-green-100 text-sm opacity-90">
            {{ isEdit ? 'Cập nhật thông tin chương trình đào tạo' : 'Nhập thông tin để tạo chương trình đào tạo mới' }}
          </p>
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

      <!-- Form -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Basic Information -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
            <h4 class="text-lg font-semibold text-gray-900 flex items-center">
              <span class="material-icons text-green-600 mr-2">info</span>
              Thông tin cơ bản
            </h4>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="material-icons text-sm text-gray-500 mr-1">tag</span>
                  Mã chương trình <span class="text-red-500 ml-1">*</span>
                </label>
                <input
                  v-model="form.curriculum_code"
                  type="text"
                  required
                  placeholder="CNTT2024"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="material-icons text-sm text-gray-500 mr-1">school</span>
                  Tên chương trình <span class="text-red-500 ml-1">*</span>
                </label>
                <input
                  v-model="form.curriculum_name"
                  type="text"
                  required
                  placeholder="Cử nhân Công nghệ Thông tin"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="material-icons text-sm text-gray-500 mr-1">category</span>
                  Ngành <span class="text-red-500 ml-1">*</span>
                </label>
                <select
                  v-model="form.major_id"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                >
                  <option value="">Chọn ngành</option>
                  <option v-for="major in majors" :key="major.major_id" :value="major.major_id">
                    {{ major.major_name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="material-icons text-sm text-gray-500 mr-1">bookmark</span>
                  Phiên bản <span class="text-red-500 ml-1">*</span>
                </label>
                <input
                  v-model="form.version"
                  type="text"
                  required
                  placeholder="K2024"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="material-icons text-sm text-gray-500 mr-1">calendar_today</span>
                  Năm học áp dụng <span class="text-red-500 ml-1">*</span>
                </label>
                <input
                  v-model="form.academic_year"
                  type="number"
                  required
                  min="2020"
                  max="2030"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="material-icons text-sm text-gray-500 mr-1">event</span>
                  Ngày hiệu lực <span class="text-red-500 ml-1">*</span>
                </label>
                <input
                  v-model="form.effective_date"
                  type="date"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="material-icons text-sm text-gray-500 mr-1">stars</span>
                  Tổng số tín chỉ <span class="text-red-500 ml-1">*</span>
                </label>
                <input
                  v-model="form.total_credits"
                  type="number"
                  required
                  min="120"
                  max="200"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div>
                <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <span class="material-icons text-sm text-gray-500 mr-1">grade</span>
                  GPA tối thiểu tốt nghiệp
                </label>
                <input
                  v-model="form.min_gpa"
                  type="number"
                  step="0.01"
                  min="2.0"
                  max="4.0"
                  placeholder="2.5"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
            </div>
            <div class="mt-6">
              <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span class="material-icons text-sm text-gray-500 mr-1">description</span>
                Mô tả
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                placeholder="Mô tả về chương trình đào tạo..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Course Management -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div class="flex justify-between items-center">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <span class="material-icons text-blue-600 mr-2">menu_book</span>
                Các môn học trong chương trình
              </h4>
              <button
                type="button"
                @click="showCourseModal = true"
                class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span class="material-icons text-sm">add</span>
                Thêm môn học
              </button>
            </div>
          </div>

          <div class="p-6">
            <!-- Course Table -->
            <div v-if="form.courses.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 bg-white rounded-lg">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Môn học</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tín chỉ</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Năm</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Học kỳ</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nhóm</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Bắt buộc</th>
                    <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(course, index) in form.courses" :key="index">
                    <td class="px-4 py-2">
                      <div>
                        <div class="text-sm font-medium text-gray-900">{{ course.course?.course_name }}</div>
                        <div class="text-sm text-gray-500">{{ course.course?.course_code }}</div>
                      </div>
                    </td>
                    <td class="px-4 py-2 text-sm">{{ course.course?.credits }}</td>
                    <td class="px-4 py-2 text-sm">{{ course.year_suggested }}</td>
                    <td class="px-4 py-2 text-sm">{{ course.semester_suggested }}</td>
                    <td class="px-4 py-2 text-sm">{{ course.course_group }}</td>
                    <td class="px-4 py-2">
                      <span :class="course.is_mandatory ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium">
                        {{ course.is_mandatory ? 'Bắt buộc' : 'Tự chọn' }}
                      </span>
                    </td>
                    <td class="px-4 py-2 text-right">
                      <button
                        type="button"
                        @click="removeCourse(index)"
                        class="text-red-600 hover:text-red-900 p-1"
                      >
                        <span class="material-icons text-sm">delete</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <span class="material-icons text-gray-400 text-3xl mb-2">inbox</span>
              <p class="text-gray-500">Chưa có môn học nào được thêm vào chương trình</p>
            </div>
          </div>
        </div>

        <!-- Requirements -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div class="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div class="flex justify-between items-center">
              <h4 class="text-lg font-semibold text-gray-900 flex items-center">
                <span class="material-icons text-purple-600 mr-2">rule</span>
                Yêu cầu tốt nghiệp
              </h4>
              <button
                type="button"
                @click="addRequirement"
                class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span class="material-icons text-sm">add</span>
                Thêm yêu cầu
              </button>
            </div>
          </div>

          <div class="p-6">
            <div v-if="form.requirements.length > 0" class="space-y-4">
              <div v-for="(requirement, index) in form.requirements" :key="index" 
                class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Loại yêu cầu</label>
                    <select
                      v-model="requirement.requirement_type"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="MIN_CREDITS">Tín chỉ tối thiểu</option>
                      <option value="MIN_GPA">GPA tối thiểu</option>
                      <option value="MANDATORY_COURSES">Môn học bắt buộc</option>
                      <option value="ELECTIVE_CREDITS">Tín chỉ tự chọn</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Tên yêu cầu</label>
                    <input
                      v-model="requirement.requirement_name"
                      type="text"
                      placeholder="Tên yêu cầu"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-500 mb-1">Giá trị</label>
                    <input
                      v-model="requirement.value"
                      type="text"
                      placeholder="Giá trị"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div class="flex items-end gap-2">
                    <div class="flex-1">
                      <label class="block text-xs font-medium text-gray-500 mb-1">Mô tả</label>
                      <input
                        v-model="requirement.description"
                        type="text"
                        placeholder="Mô tả"
                        class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                    <button
                      type="button"
                      @click="removeRequirement(index)"
                      class="text-red-600 hover:text-red-900 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <span class="material-icons text-sm">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <span class="material-icons text-gray-400 text-3xl mb-2">rule</span>
              <p class="text-gray-500 text-sm">Chưa có yêu cầu tốt nghiệp nào</p>
            </div>
          </div>
        </div>

        <!-- Submit Buttons -->
        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors flex items-center gap-2"
          >
            <span class="material-icons text-sm">close</span>
            Hủy
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span class="material-icons text-sm" v-if="submitting">hourglass_empty</span>
            <span class="material-icons text-sm" v-else>{{ isEdit ? 'save' : 'add_circle' }}</span>
            <span v-if="submitting">Đang xử lý...</span>
            <span v-else>{{ isEdit ? 'Cập nhật' : 'Tạo mới' }}</span>
          </button>
        </div>
      </form>
    </div>

    <!-- Course Selection Modal -->
    <CourseSelectionModal
      v-if="showCourseModal"
      :show="showCourseModal"
      :selectedCourses="form.courses"
      @close="showCourseModal = false"
      @select="addCourse"
    />
  </BaseModal>
</template>

<script>
import { ref, reactive, watch, onMounted } from 'vue'
import api from '../services/api'
import BaseModal from './BaseModal.vue'
import CourseSelectionModal from './CourseSelectionModal.vue'

export default {
  name: 'CurriculumFormModal',
  components: {
    BaseModal,
    CourseSelectionModal
  },
  props: {
    show: Boolean,
    curriculum: Object,
    isEdit: Boolean
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const loading = ref(false)
    const submitting = ref(false)
    const majors = ref([])
    const showCourseModal = ref(false)

    const form = reactive({
      curriculum_code: '',
      curriculum_name: '',
      description: '',
      major_id: '',
      version: '',
      academic_year: new Date().getFullYear(),
      total_credits: 140,
      min_gpa: 2.5,
      effective_date: new Date().toISOString().split('T')[0],
      courses: [],
      requirements: []
    })

    const resetForm = () => {
      Object.assign(form, {
        curriculum_code: '',
        curriculum_name: '',
        description: '',
        major_id: '',
        version: '',
        academic_year: new Date().getFullYear(),
        total_credits: 140,
        min_gpa: 2.5,
        effective_date: new Date().toISOString().split('T')[0],
        courses: [],
        requirements: []
      })
    }

    const loadCurriculumData = async (curriculum) => {
      try {
        loading.value = true
        // Get full curriculum data
        const response = await api.get(`/curriculums/${curriculum.curriculum_id}`)
        const data = response.data.data

        Object.assign(form, {
          curriculum_code: data.curriculum_code,
          curriculum_name: data.curriculum_name,
          description: data.description || '',
          major_id: data.major_id,
          version: data.version,
          academic_year: data.academic_year,
          total_credits: data.total_credits,
          min_gpa: data.min_gpa || '',
          effective_date: data.effective_date.split('T')[0],
          courses: data.curriculumCourses || [],
          requirements: data.requirements || []
        })
      } catch (error) {
        console.error('Error loading curriculum data:', error)
      } finally {
        loading.value = false
      }
    }

    const fetchMajors = async () => {
      try {
        const response = await api.get('/departments') // Assuming majors are departments
        majors.value = response.data.data
      } catch (error) {
        console.error('Error fetching majors:', error)
      }
    }

    const addCourse = (courseData) => {
      form.courses.push(courseData)
      showCourseModal.value = false
    }

    const removeCourse = (index) => {
      form.courses.splice(index, 1)
    }

    const addRequirement = () => {
      form.requirements.push({
        requirement_type: 'MIN_CREDITS',
        requirement_name: '',
        description: '',
        value: ''
      })
    }

    const removeRequirement = (index) => {
      form.requirements.splice(index, 1)
    }

    const handleSubmit = async () => {
      try {
        submitting.value = true
        
        const submitData = {
          ...form,
          major_id: parseInt(form.major_id),
          academic_year: parseInt(form.academic_year),
          total_credits: parseInt(form.total_credits),
          min_gpa: form.min_gpa ? parseFloat(form.min_gpa) : null
        }

        if (props.isEdit) {
          await api.put(`/curriculums/${props.curriculum.curriculum_id}`, submitData)
          emit('success', 'Chương trình đào tạo đã được cập nhật thành công')
        } else {
          await api.post('/curriculums', submitData)
          emit('success', 'Chương trình đào tạo đã được tạo thành công')
        }
      } catch (error) {
        console.error('Error submitting curriculum:', error)
        // Handle error - could emit error event or show toast
      } finally {
        submitting.value = false
      }
    }

    // Watch for curriculum changes
    watch(() => props.curriculum, (curriculum) => {
      if (curriculum && props.isEdit) {
        loadCurriculumData(curriculum)
      } else {
        resetForm()
      }
    }, { immediate: true })

    onMounted(() => {
      fetchMajors()
    })

    return {
      loading,
      submitting,
      majors,
      showCourseModal,
      form,
      addCourse,
      removeCourse,
      addRequirement,
      removeRequirement,
      handleSubmit
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
