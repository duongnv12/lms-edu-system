<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>
      <div class="flex items-center gap-2 text-red-700 text-2xl font-bold">
        <span class="material-icons">delete</span> Xóa khoa
      </div>
    </template>
    <div class="py-2">
      <p class="mb-4 text-lg">Bạn có chắc chắn muốn xóa khoa <strong class="text-red-700">{{ department?.dept_name || department?.name }}</strong>?</p>
      <div v-if="department?.courses && department.courses.length > 0" class="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700 flex items-center gap-2">
        <span class="material-icons">warning</span>
        <span>Khoa này đang có học phần liên kết. Không thể xóa!</span>
      </div>
      <div v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</div>
      <div class="flex justify-end gap-2 mt-4">
        <button class="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-700 text-white font-semibold flex items-center gap-1 shadow transition-all" @click="handleDelete" :disabled="loading || (department?.courses && department.courses.length > 0)">
          <span class="material-icons">delete</span> Xóa
        </button>
        <button class="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-1 shadow transition-all" @click="$emit('close')" :disabled="loading">
          <span class="material-icons">close</span> Hủy
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import apiClient from '@/services/api';
import { ref } from 'vue';
const props = defineProps({ show: Boolean, department: Object });
const emit = defineEmits(['close', 'deleted']);
const error = ref('');
const loading = ref(false);

const handleDelete = async () => {
  error.value = '';
  if (!props.department) return;
  loading.value = true;
  try {
    const id = props.department.department_id || props.department.id;
    await apiClient.delete(`/departments/${id}`);
    emit('deleted');
    emit('close');
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.material-icons { font-family: 'Material Icons'; font-style: normal; font-weight: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; direction: ltr; font-feature-settings: 'liga'; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
</style>
