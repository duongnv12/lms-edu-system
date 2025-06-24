<template>
  <div class="w-full">
    <BaseToast :show="toast.show" :message="toast.message" :type="toast.type" />
    <div class="bg-white rounded-lg shadow-xl p-8 sm:p-10 md:p-12 mb-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b-2 border-blue-100 pb-3 gap-4">
        <div class="flex items-center gap-3">
          <span class="material-icons text-4xl text-blue-500 bg-blue-100 rounded-full p-2 shadow">apartment</span>
          <h1 class="text-3xl font-extrabold text-blue-700 tracking-tight">Danh sách khoa</h1>
        </div>
        <div class="flex flex-col sm:flex-row gap-2 items-center">
          <input v-model="search" type="text" placeholder="Tìm kiếm mã hoặc tên khoa..." class="px-4 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-500 shadow-sm transition-all w-64" />
          <button v-if="canEdit" class="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow flex items-center font-semibold transition-all" @click="showAdd = true">
            <span class="material-icons mr-1">add_circle</span> Thêm khoa
          </button>
          <button v-if="canEdit" class="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow flex items-center font-semibold transition-all" @click="showImport = true">
            <span class="material-icons mr-1">upload</span> Nhập Excel
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
        <div class="overflow-x-auto rounded-2xl shadow-xl bg-white">
          <table class="table-auto w-full">
            <thead class="bg-blue-100 text-blue-800">
              <tr>
                <th class="px-6 py-3 text-left font-semibold">Mã khoa</th>
                <th class="px-6 py-3 text-left font-semibold">Tên khoa</th>
                <th class="px-6 py-3 text-left font-semibold">Mô tả</th>
                <th class="px-6 py-3 text-center font-semibold">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dept in filteredDepartments" :key="dept.department_id" class="border-b hover:bg-blue-50 transition">
                <td class="px-6 py-3 font-bold text-blue-700">{{ dept.code }}</td>
                <td class="px-6 py-3">{{ dept.dept_name }}</td>
                <td class="px-6 py-3 text-gray-600">{{ dept.description || '—' }}</td>
                <td class="px-6 py-3 flex gap-2 justify-center">
                  <button class="px-3 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold flex items-center gap-1 shadow-sm transition-all" @click="selectDepartment(dept)">
                    <span class="material-icons">info</span> Chi tiết
                  </button>
                  <button v-if="canEdit" class="px-3 py-1 rounded-lg bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold flex items-center gap-1 shadow-sm transition-all" @click="editDepartment(dept)">
                    <span class="material-icons">edit</span> Sửa
                  </button>
                  <button v-if="canDelete" class="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 font-semibold flex items-center gap-1 shadow-sm transition-all" @click="deleteDepartment(dept)">
                    <span class="material-icons">delete</span> Xóa
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <DepartmentAddModal :show="showAdd" @close="showAdd = false" @added="onAdded" />
      <DepartmentEditModal :show="showEdit" :department="selectedDepartment" @close="showEdit = false" @updated="onUpdated" />
      <DepartmentDeleteModal :show="showDelete" :department="selectedDepartment" @close="showDelete = false" @deleted="onDeleted" />
      <DepartmentDetailModal :show="showDetail" :department="selectedDepartment" @close="showDetail = false" />
      <DepartmentImportExcelModal :show="showImport" @close="showImport = false" @imported="onImported" />
      <div v-if="!canEdit" class="text-gray-400 text-sm mt-4">Bạn không có quyền chỉnh sửa khoa.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiClient from '@/services/api';
import DepartmentAddModal from '@/components/DepartmentAddModal.vue';
import DepartmentEditModal from '@/components/DepartmentEditModal.vue';
import DepartmentDeleteModal from '@/components/DepartmentDeleteModal.vue';
import DepartmentDetailModal from '@/components/DepartmentDetailModal.vue';
import DepartmentImportExcelModal from '@/components/DepartmentImportExcelModal.vue';
import BaseToast from '@/components/BaseToast.vue';
import { useAuthStore } from '@/stores/authStore';

const showAdd = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);
const showDetail = ref(false);
const showImport = ref(false);
const selectedDepartment = ref(null);
const toast = ref({ show: false, message: '', type: 'info' });

const departments = ref([]);
const loading = ref(false);
const search = ref('');

const authStore = useAuthStore();
const canEdit = computed(() => authStore.userRoles.includes('Admin') || authStore.userRoles.includes('Instructor'));
const canDelete = computed(() => authStore.userRoles.includes('Admin'));

const filteredDepartments = computed(() => {
  if (!search.value) return departments.value;
  const s = search.value.trim().toLowerCase();
  return departments.value.filter(d =>
    (d.code && d.code.toLowerCase().includes(s)) ||
    (d.dept_name && d.dept_name.toLowerCase().includes(s))
  );
});

async function fetchDepartments() {
  loading.value = true;
  try {
    const res = await apiClient.get('/departments');
    departments.value = res.data;
  } catch (err) {
    showToast('Lỗi khi tải danh sách khoa', 'error');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchDepartments();
});

function selectDepartment(dept) {
  selectedDepartment.value = dept;
  showDetail.value = true;
}
function editDepartment(dept) {
  selectedDepartment.value = dept;
  showEdit.value = true;
}
function deleteDepartment(dept) {
  selectedDepartment.value = dept;
  showDelete.value = true;
}
function showToast(message, type = 'info') {
  toast.value = { show: true, message, type };
  setTimeout(() => (toast.value.show = false), 3000);
}
async function onAdded() {
  await fetchDepartments();
  showToast('Thêm khoa thành công!', 'success');
  showAdd.value = false;
}
async function onUpdated() {
  await fetchDepartments();
  showToast('Cập nhật khoa thành công!', 'success');
  showEdit.value = false;
}
async function onDeleted() {
  await fetchDepartments();
  showToast('Đã xóa khoa!', 'success');
  showDelete.value = false;
}
async function onImported() {
  await fetchDepartments();
  showToast('Nhập dữ liệu thành công!', 'success');
  showImport.value = false;
}
</script>

<style scoped>
.material-icons { font-family: 'Material Icons'; font-style: normal; font-weight: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; direction: ltr; font-feature-settings: 'liga'; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
.table-auto th, .table-auto td { white-space: nowrap; }
</style>
