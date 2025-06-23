<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">Danh sách khoa</h2>
      <button class="btn btn-primary" @click="showAdd = true">Thêm khoa</button>
    </div>
    <div v-if="loading" class="text-center py-8">Đang tải...</div>
    <div v-else>
      <table class="table-auto w-full border rounded-lg overflow-hidden">
        <thead class="bg-blue-50">
          <tr>
            <th class="px-4 py-2">Mã khoa</th>
            <th class="px-4 py-2">Tên khoa</th>
            <th class="px-4 py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dept in departments" :key="dept.id" class="border-b">
            <td class="px-4 py-2">{{ dept.id }}</td>
            <td class="px-4 py-2">{{ dept.name }}</td>
            <td class="px-4 py-2 flex gap-2">
              <button class="btn btn-info btn-xs" @click="selectDepartment(dept)">Chi tiết</button>
              <button class="btn btn-warning btn-xs" @click="editDepartment(dept)">Sửa</button>
              <button class="btn btn-error btn-xs" @click="deleteDepartment(dept)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <DepartmentAddModal :show="showAdd" @close="showAdd = false" @added="fetchDepartments" />
    <DepartmentEditModal :show="showEdit" :department="selectedDepartment" @close="showEdit = false" @updated="fetchDepartments" />
    <DepartmentDeleteModal :show="showDelete" :department="selectedDepartment" @close="showDelete = false" @deleted="fetchDepartments" />
    <DepartmentDetailModal :show="showDetail" :department="selectedDepartment" @close="showDetail = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useDepartmentStore } from '@/stores/departmentStore';
import DepartmentAddModal from '@/components/DepartmentAddModal.vue';
import DepartmentEditModal from '@/components/DepartmentEditModal.vue';
import DepartmentDeleteModal from '@/components/DepartmentDeleteModal.vue';
import DepartmentDetailModal from '@/components/DepartmentDetailModal.vue';

const showAdd = ref(false);
const showEdit = ref(false);
const showDelete = ref(false);
const showDetail = ref(false);
const selectedDepartment = ref(null);

const departmentStore = useDepartmentStore();
const { departments, loading, fetchDepartments } = departmentStore;

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
</script>

<style scoped>
.btn-xs { font-size: 0.85rem; padding: 0.25rem 0.75rem; }
</style>
