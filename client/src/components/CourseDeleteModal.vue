<template>
  <BaseModal :show="show" @close="$emit('close')" title="Xác nhận xóa học phần" customClass="max-w-md">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto items-center">
      <div class="text-red-700">
        <h3 class="text-lg font-bold mb-2">Bạn có chắc chắn muốn xóa?</h3>
        <div><span class="font-semibold">Tên:</span> {{ course?.course_name }}</div>
        <div><span class="font-semibold">Mã:</span> {{ course?.course_code }}</div>
        <div><span class="font-semibold">Khoa:</span> {{ course?.department?.dept_name }}</div>
        <div v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</div>
      </div>
      <div class="flex flex-col gap-3 items-end">
        <button @click="$emit('close')" :disabled="deleting" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Hủy</button>
        <button @click="onDelete" :disabled="deleting" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50">
          <span v-if="deleting" class="animate-spin material-icons text-base">autorenew</span>
          <span v-else class="material-icons text-base">delete</span>
          Xóa
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import api from '../services/api';
import { ref } from 'vue';
const props = defineProps({
  show: Boolean,
  course: Object
});
const emit = defineEmits(['close', 'deleted']);
const deleting = ref(false);
const error = ref('');
async function onDelete() {
  if (!props.course?.course_id) return;
  deleting.value = true;
  error.value = '';
  try {
    await api.delete(`/courses/${props.course.course_id}`);
    emit('deleted');
    emit('close');
  } catch (e) {
    error.value = 'Xóa thất bại!';
  } finally {
    deleting.value = false;
  }
}
</script>
