<template>
  <BaseModal :show="show" @close="$emit('close')" :title="department?.dept_name || 'Chi tiết khoa'" customClass="max-w-2xl">
    <div v-if="!department" class="flex items-center justify-center text-red-500 text-lg py-10">
      <span class="material-icons mr-2">error_outline</span>Không tìm thấy khoa!
    </div>
    <div v-else>
      <div class="flex items-center gap-3 mb-6">
        <span class="material-icons text-4xl text-blue-500 bg-blue-100 rounded-full p-2 shadow">apartment</span>
        <h2 class="text-2xl font-extrabold text-blue-700 tracking-tight">{{ department.dept_name }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg border border-blue-100 p-6 mb-6">
        <div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Mã khoa:</span> {{ department.code }}</div>
        </div>
        <div>
          <div class="mb-2"><span class="font-semibold text-blue-700">Tên khoa:</span> {{ department.dept_name }}</div>
        </div>
        <div class="md:col-span-2 mt-4">
          <div class="mb-2"><span class="font-semibold text-blue-700">Mô tả:</span> {{ department.description || '—' }}</div>
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
const props = defineProps({ show: Boolean, department: Object });
</script>

<style scoped>
.material-icons { font-family: 'Material Icons'; font-style: normal; font-weight: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; direction: ltr; font-feature-settings: 'liga'; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
</style>
