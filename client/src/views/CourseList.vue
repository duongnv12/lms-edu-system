<template>
  <div class="w-full">
    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
    <div class="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12 mb-10 max-w-full xl:max-w-[1400px] 2xl:max-w-[1700px] mx-auto">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b-2 border-blue-100 pb-3 gap-4">
        <div class="flex items-center gap-3">
          <span class="material-icons text-4xl text-blue-500 bg-blue-100 rounded-full p-2 shadow">menu_book</span>
          <h1 class="text-3xl font-extrabold text-blue-700 tracking-tight">Danh sách học phần</h1>
        </div>
        <div class="flex gap-2 flex-wrap">
          <input v-model="search" type="text" placeholder="Tìm kiếm mã hoặc tên học phần..." class="border border-blue-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base w-64 shadow-sm" />
          <button v-if="canEdit" @click="openImportModal" class="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-2 rounded-lg shadow flex items-center font-semibold transition-all">
            <span class="material-icons mr-1">upload_file</span>Import Excel
          </button>
          <button v-if="canEdit" @click="openAddModal" class="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow flex items-center font-semibold transition-all">
            <span class="material-icons mr-1">add_circle</span> Thêm học phần
          </button>
        </div>
      </div>
      <div v-if="loading" class="flex justify-center items-center h-48">
        <svg class="animate-spin h-10 w-10 text-blue-500" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="course in filteredCourses" :key="course.course_id" class="bg-white border border-blue-100 rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition">
            <div class="flex items-center gap-3 mb-2">
              <span class="material-icons text-3xl text-blue-400 bg-blue-50 rounded-full p-2">menu_book</span>
              <div>
                <div class="text-blue-700 font-bold text-lg break-words whitespace-normal" :title="course.course_name">{{ course.course_name }}</div>
                <div class="text-xs text-gray-500 font-mono">{{ course.course_code }}</div>
              </div>
            </div>
            <div class="flex flex-wrap gap-2 mb-2">
              <span class="inline-block bg-blue-100 text-blue-700 text-xs font-semibold rounded px-2 py-1 shadow-sm">Tín chỉ: {{ course.credits }}</span>
              <span v-if="course.course_type" class="inline-block bg-blue-50 text-blue-700 text-xs font-semibold rounded px-2 py-1 shadow-sm">{{ course.course_type }}</span>
              <span class="inline-block bg-green-50 text-green-700 text-xs font-semibold rounded px-2 py-1 shadow-sm">Học kỳ: {{ course.semester_applicable }}</span>
              <span v-if="course.department?.dept_name" class="inline-block bg-purple-50 text-purple-700 text-xs font-semibold rounded px-2 py-1 shadow-sm" :title="course.department?.dept_name">Khoa: {{ course.department?.dept_name }}</span>
            </div>
            <div class="mb-2">
              <div class="text-xs text-gray-600 truncate" v-if="course.description" :title="course.description">{{ course.description }}</div>
            </div>
            <div class="flex flex-col gap-1 mb-3">
              <div class="text-xs"><span class="font-semibold text-blue-700">Tiên quyết:</span> <span :title="getPrerequisiteNames(course)">{{ getPrerequisiteNames(course) }}</span></div>
              <div class="text-xs"><span class="font-semibold text-blue-700">Học trước:</span> <span :title="getPriorNames(course)">{{ getPriorNames(course) }}</span></div>
            </div>
            <div class="flex items-center gap-2 mt-auto">
              <button @click="goDetail(course.course_id)" class="inline-flex items-center px-2 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded shadow-sm text-xs font-semibold transition-all">
                <span class="material-icons text-base mr-1">visibility</span>Xem
              </button>
              <button v-if="canEdit && canEditCourse(course)" @click="openEditModal(course)" class="inline-flex items-center px-2 py-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded shadow-sm text-xs font-semibold transition-all">
                <span class="material-icons text-base mr-1">edit</span>Sửa
              </button>
              <button v-if="canDelete && canDeleteCourse(course)" @click.stop="confirmDelete(course)" class="inline-flex items-center px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded shadow-sm text-xs font-semibold transition-all">
                <span class="material-icons text-base mr-1">delete</span>Xóa
              </button>
            </div>
          </div>
        </div>
        <CourseEditModal :show="addModal.show" :course="null" @close="addModal.show = false" @saved="onSavedFromModal" />
        <CourseEditModal :show="editModal.show" :course="editModal.course" @close="editModal.show = false" @saved="onSavedFromModal" />
        <CourseDeleteModal :show="deleteModal.show" :course="deleteModal.course" @close="deleteModal.show = false" @deleted="onDeletedFromModal" />
        <CourseImportExcelModal
          :show="importModal.show"
          :file="importModal.file"
          :preview="importModal.preview"
          :loading="importLoading"
          @close="importModal.show = false"
          @file-change="handleFileChange"
          @submit="submitImport"
          @imported="fetchCourses"
        />
        <CourseDetailModal :show="detailModal.show" :course="detailModal.course" @close="detailModal.show = false" />
        <div v-if="!canEdit" class="text-gray-400 text-sm mt-4">Bạn không có quyền chỉnh sửa học phần.</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import CourseEditModal from '../components/CourseEditModal.vue';
import CourseDeleteModal from '../components/CourseDeleteModal.vue';
import BaseModal from '../components/BaseModal.vue';
import CourseDetailModal from '../components/CourseDetailModal.vue';
import CourseImportExcelModal from '../components/CourseImportExcelModal.vue';
import BaseToast from '../components/BaseToast.vue';
import * as XLSX from 'xlsx';

const courses = ref([]);
const loading = ref(true);
const deleteModal = ref({ show: false, course: null });
const editModal = ref({ show: false, course: null });
const importModal = ref({ show: false, file: null, preview: [] });
const importLoading = ref(false);
const router = useRouter();
const authStore = useAuthStore();
const toast = ref({ show: false, message: '', type: 'info' });
const addModal = ref({ show: false });
const detailModal = ref({ show: false, course: null });
const search = ref("");

const canEdit = computed(() => authStore.userRoles.includes('Admin') || authStore.userRoles.includes('Instructor'));
const canDelete = computed(() => authStore.userRoles.includes('Admin'));

const canEditCourse = (course) => {
  if (authStore.userRoles.includes('Admin')) return true;
  if (authStore.userRoles.includes('Instructor')) {
    return true;
  }
  return false;
};
const canDeleteCourse = (course) => {
  return authStore.userRoles.includes('Admin');
};

const filteredCourses = computed(() => {
  if (!search.value.trim()) return courses.value;
  const keyword = search.value.trim().toLowerCase();
  return courses.value.filter(c =>
    (c.course_code && c.course_code.toLowerCase().includes(keyword)) ||
    (c.course_name && c.course_name.toLowerCase().includes(keyword))
  );
});

const fetchCourses = async () => {
  loading.value = true;
  try {
    const res = await api.get('/courses');
    courses.value = res.data;
  } catch (e) {
    showToast('Không thể tải danh sách học phần!', 'error');
  } finally {
    loading.value = false;
  }
};

const goDetail = (id) => {
  const course = courses.value.find(c => c.course_id === id);
  if (course) {
    detailModal.value = { show: true, course };
  }
};

const confirmDelete = (course) => {
  deleteModal.value = { show: true, course };
};

const openEditModal = (course) => {
  editModal.value = { show: true, course };
};

const openImportModal = () => {
  importModal.value = { show: true, file: null, preview: [] };
};

const openAddModal = () => {
  addModal.value = { show: true };
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  importModal.value.file = file;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    importModal.value.preview = rows;
  };
  reader.readAsArrayBuffer(file);
};

const submitImport = async () => {
  if (!importModal.value.file) return;
  importLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', importModal.value.file);
    await api.post('/courses/import-excel', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    showToast('Import thành công!', 'success');
    importModal.value = { show: false, file: null, preview: [] };
    // Cập nhật danh sách ngay lập tức mà không reload trang
    await fetchCourses();
  } catch (e) {
    showToast('Import thất bại!', 'error');
  } finally {
    importLoading.value = false;
  }
};

const onSavedFromModal = () => {
  fetchCourses();
  showToast('Lưu học phần thành công!', 'success');
  editModal.value = { show: false, course: null };
};

const onDeletedFromModal = () => {
  fetchCourses();
  showToast('Đã xóa học phần!', 'success');
  deleteModal.value = { show: false, course: null };
};

function showToast(message, type = 'info') {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
}

function getPrerequisiteNames(course) {
  if (!course.prerequisites || !course.prerequisites.length) return '-';
  return course.prerequisites
    .map(p => p.prerequisite?.course_name)
    .filter(Boolean)
    .join(', ') || '-';
}
function getPriorNames(course) {
  if (!course.priors || !course.priors.length) return '-';
  return course.priors
    .map(p => p.prior?.course_name)
    .filter(Boolean)
    .join(', ') || '-';
}

onMounted(fetchCourses);
</script>

<style scoped>
.material-icons { font-family: 'Material Icons'; font-style: normal; font-weight: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; direction: ltr; font-feature-settings: 'liga'; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
</style>
