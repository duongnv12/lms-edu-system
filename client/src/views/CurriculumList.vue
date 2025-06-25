<template>
  <div class="w-full">
    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
    <div class="bg-white rounded-lg shadow-xl p-8 sm:p-10 md:p-12 mb-8">
      <!-- Header Section -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 border-b-2 border-green-100 pb-4 gap-4">
        <div class="flex items-center gap-3">
          <span class="material-icons text-4xl text-green-500 bg-green-100 rounded-full p-2 shadow">school</span>
          <h1 class="text-3xl font-extrabold text-green-700 tracking-tight">Danh sách chương trình đào tạo</h1>
        </div>
        <button 
          @click="openAddModal" 
          class="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow flex items-center font-semibold transition-all"
        >
          <span class="material-icons mr-1">add_circle</span> Thêm chương trình
        </button>
      </div>

      <!-- Filters Section -->
      <div class="mb-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-icons text-green-600">search</span>
          <span class="text-sm font-semibold text-gray-700">Tìm kiếm và Lọc dữ liệu</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="flex flex-col">
            <label class="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span class="material-icons text-xs">search</span>
              Tìm kiếm
            </label>
            <input 
              v-model="filters.search" 
              @input="debounceSearch"
              type="text" 
              placeholder="Tên, mã chương trình..." 
              class="border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm shadow-sm bg-white transition-all hover:border-green-300" 
            />
          </div>
          <div class="flex flex-col">
            <label class="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span class="material-icons text-xs">category</span>
              Ngành đào tạo
            </label>
            <select
              v-model="filters.major_id"
              @change="fetchCurriculums"
              class="border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm shadow-sm bg-white transition-all hover:border-green-300"
            >
              <option value="">Tất cả ngành</option>
              <option v-for="major in majors" :key="major.major_id" :value="major.major_id">
                {{ major.major_name }}
              </option>
            </select>
          </div>
          <div class="flex flex-col">
            <label class="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span class="material-icons text-xs">bookmark</span>
              Phiên bản
            </label>
            <input 
              v-model="filters.version" 
              @input="debounceSearch" 
              type="text" 
              placeholder="VD: K2019, K2020..." 
              class="border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm shadow-sm bg-white transition-all hover:border-green-300" 
            />
          </div>
          <div class="flex flex-col">
            <label class="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
              <span class="material-icons text-xs">toggle_on</span>
              Trạng thái
            </label>
            <select 
              v-model="filters.is_active" 
              @change="fetchCurriculums" 
              class="border border-green-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 text-sm shadow-sm bg-white transition-all hover:border-green-300"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Đang áp dụng</option>
              <option value="false">Ngừng áp dụng</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div>
        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>

        <!-- Curriculum Cards Grid -->
        <div v-else-if="curriculums.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="curriculum in curriculums" :key="curriculum.curriculum_id" class="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 overflow-hidden">
            <div class="p-6 flex flex-col h-full">
              <div class="mb-3">
                <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-2" :title="curriculum.curriculum_name">{{ curriculum.curriculum_name }}</h3>
                <p class="text-sm text-gray-600 font-mono" :title="curriculum.curriculum_code">{{ curriculum.curriculum_code }}</p>
              </div>
              <div class="flex flex-wrap gap-2 mb-3">
                <span v-if="curriculum.major?.major_name" class="inline-block bg-purple-50 text-purple-700 text-xs font-semibold rounded px-2 py-1 shadow-sm" :title="curriculum.major?.major_name">{{ curriculum.major?.major_name }}</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ curriculum.version }}
                </span>
                <span :class="curriculum.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                  {{ curriculum.is_active ? 'Đang áp dụng' : 'Ngừng áp dụng' }}
                </span>
              </div>
              <div class="flex flex-col gap-1 mb-3 text-sm">
                <div class="flex justify-between">
                  <span class="font-semibold text-gray-700">Tín chỉ:</span>
                  <span class="text-gray-900">{{ curriculum.total_credits }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="font-semibold text-gray-700">Sinh viên:</span>
                  <span class="text-gray-900">{{ curriculum._count?.students || 0 }}</span>
                </div>
              </div>
              <div class="flex flex-wrap items-center gap-1 mt-auto pt-3 border-t border-gray-100">
                <button @click="viewCurriculum(curriculum)" class="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded shadow-sm text-xs font-semibold transition-all" title="Xem chi tiết">
                  <span class="material-icons text-sm mr-1">visibility</span>
                  <span class="hidden sm:inline">Xem</span>
                </button>
                <button @click="editCurriculum(curriculum)" class="inline-flex items-center px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded shadow-sm text-xs font-semibold transition-all" title="Chỉnh sửa">
                  <span class="material-icons text-sm mr-1">edit</span>
                  <span class="hidden sm:inline">Sửa</span>
                </button>
                <button @click="cloneCurriculum(curriculum)" class="inline-flex items-center px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded shadow-sm text-xs font-semibold transition-all" title="Sao chép">
                  <span class="material-icons text-sm mr-1">content_copy</span>
                  <span class="hidden sm:inline">Sao chép</span>
                </button>
                <button @click="deleteCurriculum(curriculum)" class="inline-flex items-center px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded shadow-sm text-xs font-semibold transition-all" title="Xóa">
                  <span class="material-icons text-sm mr-1">delete</span>
                  <span class="hidden sm:inline">Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16 bg-white rounded-lg shadow-lg">
          <span class="material-icons text-6xl text-gray-400 mb-4">school</span>
          <h3 class="text-xl font-medium text-gray-900 mb-2">Không có chương trình đào tạo</h3>
          <p class="text-gray-500 mb-6">Bắt đầu bằng cách tạo chương trình đào tạo mới cho hệ thống.</p>
          <button 
            @click="openAddModal" 
            class="bg-green-500 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow flex items-center font-semibold transition-all mx-auto"
          >
            <span class="material-icons mr-2">add_circle</span> Tạo chương trình đầu tiên
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="curriculums.length > 0" class="bg-white rounded-lg shadow-lg px-6 py-4 mt-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="prevPage"
                :disabled="pagination.page <= 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Trước
              </button>
              <button
                @click="nextPage"
                :disabled="pagination.page >= pagination.pages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Sau
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Hiển thị
                  <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                  đến
                  <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
                  trong tổng số
                  <span class="font-medium">{{ pagination.total }}</span>
                  kết quả
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    @click="prevPage"
                    :disabled="pagination.page <= 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span class="material-icons text-lg">chevron_left</span>
                  </button>
                  <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    {{ pagination.page }} / {{ pagination.pages }}
                  </span>
                  <button
                    @click="nextPage"
                    :disabled="pagination.page >= pagination.pages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <span class="material-icons text-lg">chevron_right</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <CurriculumFormModal
      v-if="showFormModal"
      :show="showFormModal"
      :curriculum="selectedCurriculum"
      :isEdit="isEditMode"
      @close="closeModal"
      @success="handleSuccess"
    />

    <CurriculumDetailModal
      v-if="showDetailModal"
      :show="showDetailModal"
      :curriculum="selectedCurriculum"
      @close="closeModal"
    />

    <CurriculumCloneModal
      v-if="showCloneModal"
      :show="showCloneModal"
      :curriculum="selectedCurriculum"
      @close="closeModal"
      @success="handleSuccess"
    />

    <CurriculumDeleteModal
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :curriculum="selectedCurriculum"
      @close="closeModal"
      @success="handleSuccess"
    />

    <!-- Toast Notification -->
    <BaseToast ref="toast" />
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed } from 'vue'
import { debounce } from 'lodash-es'
import api from '../services/api'
import BaseToast from '../components/BaseToast.vue'
import CurriculumFormModal from '../components/CurriculumFormModal.vue'
import CurriculumDetailModal from '../components/CurriculumDetailModal.vue'
import CurriculumCloneModal from '../components/CurriculumCloneModal.vue'
import CurriculumDeleteModal from '../components/CurriculumDeleteModal.vue'

export default {
  name: 'CurriculumList',
  components: {
    BaseToast,
    CurriculumFormModal,
    CurriculumDetailModal,
    CurriculumCloneModal,
    CurriculumDeleteModal
  },
  setup() {
    const loading = ref(false)
    const curriculums = ref([])
    const majors = ref([])
    const selectedCurriculum = ref(null)
    const showFormModal = ref(false)
    const showDetailModal = ref(false)
    const showCloneModal = ref(false)
    const showDeleteModal = ref(false)
    const isEditMode = ref(false)
    const toast = ref({ show: false, message: '', type: 'info' })

    const filters = reactive({
      search: '',
      major_id: '',
      version: '',
      is_active: ''
    })

    const pagination = reactive({
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    })

    // Fetch curriculums
    const fetchCurriculums = async () => {
      try {
        loading.value = true
        const params = {
          page: pagination.page,
          limit: pagination.limit,
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
          )
        }

        const response = await api.get('/curriculums', { params })
        curriculums.value = response.data.data
        Object.assign(pagination, response.data.pagination)
      } catch (error) {
        console.error('Error fetching curriculums:', error)
        showToast('Lỗi khi tải danh sách chương trình đào tạo', 'error')
      } finally {
        loading.value = false
      }
    }

    // Fetch majors for filter
    const fetchMajors = async () => {
      try {
        const response = await api.get('/curriculums/majors')
        majors.value = response.data.data
      } catch (error) {
        console.error('Error fetching majors:', error)
      }
    }

    // Debounced search
    const debounceSearch = debounce(() => {
      pagination.page = 1
      fetchCurriculums()
    }, 500)

    // Pagination
    const nextPage = () => {
      if (pagination.page < pagination.pages) {
        pagination.page++
        fetchCurriculums()
      }
    }

    const prevPage = () => {
      if (pagination.page > 1) {
        pagination.page--
        fetchCurriculums()
      }
    }

    // Modal handlers
    const openAddModal = () => {
      selectedCurriculum.value = null
      isEditMode.value = false
      showFormModal.value = true
    }

    const viewCurriculum = (curriculum) => {
      selectedCurriculum.value = curriculum
      showDetailModal.value = true
    }

    const editCurriculum = (curriculum) => {
      selectedCurriculum.value = curriculum
      isEditMode.value = true
      showFormModal.value = true
    }

    const cloneCurriculum = (curriculum) => {
      selectedCurriculum.value = curriculum
      showCloneModal.value = true
    }

    const deleteCurriculum = (curriculum) => {
      selectedCurriculum.value = curriculum
      showDeleteModal.value = true
    }

    const closeModal = () => {
      showFormModal.value = false
      showDetailModal.value = false
      showCloneModal.value = false
      showDeleteModal.value = false
      selectedCurriculum.value = null
    }

    const handleSuccess = (message) => {
      closeModal()
      fetchCurriculums()
      showToast(message, 'success')
    }

    const showToast = (message, type = 'info') => {
      toast.value = { show: true, message, type }
      setTimeout(() => (toast.value.show = false), 3000)
    }

    onMounted(() => {
      fetchCurriculums()
      fetchMajors()
    })

    return {
      loading,
      curriculums,
      majors,
      selectedCurriculum,
      showFormModal,
      showDetailModal,
      showCloneModal,
      showDeleteModal,
      isEditMode,
      filters,
      pagination,
      toast,
      fetchCurriculums,
      debounceSearch,
      nextPage,
      prevPage,
      openAddModal,
      viewCurriculum,
      editCurriculum,
      cloneCurriculum,
      deleteCurriculum,
      closeModal,
      handleSuccess,
      showToast
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
