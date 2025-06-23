<template>
  <BaseModal :show="show" @close="$emit('close')" :title="course?.course_name || 'Chi tiết học phần'" customClass="max-w-2xl">
    <div v-if="!course" class="flex items-center justify-center text-red-500 text-lg py-10">
      <span class="material-icons mr-2">error_outline</span>Không tìm thấy học phần!
    </div>
    <div v-else>
      <div class="flex items-center gap-3 mb-6">
        <span class="material-icons text-4xl text-blue-500 bg-blue-100 rounded-full p-2 shadow">menu_book</span>
        <h2 class="text-2xl font-extrabold text-blue-700 tracking-tight">{{ course.course_name }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6 mb-6">
        <div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Mã học phần:</span> {{ course.course_code }}</div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Số tín chỉ:</span> <span class="text-blue-700 font-bold">{{ course.credits }}</span></div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Loại:</span> <span v-if="course.course_type" class="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold shadow-sm">{{ course.course_type }}</span><span v-else class="text-gray-400">-</span></div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Học kỳ áp dụng:</span> {{ course.semester_applicable }}</div>
        </div>
        <div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Khoa:</span> {{ course.department?.dept_name }}</div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Tiên quyết:</span> {{ course.prerequisite?.course_name || '-' }}</div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Học trước:</span> {{ course.prior?.course_name || '-' }}</div>
        </div>
        <div class="md:col-span-2 mt-4">
          <div class="mb-2"><span class="font-semibold text-blue-700">Mô tả:</span> {{ course.description }}</div>
        </div>
      </div>
      <div class="flex justify-end">
        <button @click="$emit('close')" class="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow font-semibold transition-all flex items-center"><span class="material-icons mr-1">close</span>Đóng</button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
const props = defineProps({
  show: Boolean,
  course: Object
});
</script>

<style scoped>
.material-icons { font-family: 'Material Icons'; font-style: normal; font-weight: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; direction: ltr; font-feature-settings: 'liga'; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
</style>
