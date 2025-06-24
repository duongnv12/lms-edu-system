<template>
  <BaseModal :show="show" @close="$emit('close')" title="Nhập danh sách học phần từ Excel" customClass="max-w-lg">
    <form @submit.prevent="submitImport" class="p-4">
      <div class="mb-4">
        <label class="block font-semibold mb-2 text-blue-700">Chọn file Excel (.xlsx)</label>
        <div class="flex items-center gap-3 flex-wrap">
          <label class="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow cursor-pointer transition-all border border-blue-300">
            <span class="material-icons mr-2">upload_file</span>
            <span>Chọn file</span>
            <input type="file" accept=".xlsx,.xls" @change="handleFileChange" class="hidden" />
          </label>
          <a href="/course_import_template.xlsx" download class="flex items-center gap-1 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg shadow border border-green-300 transition-all text-sm font-semibold">
            <span class="material-icons text-base align-middle">download</span> Tải file mẫu
          </a>
          <span v-if="file" class="text-sm text-blue-700 font-semibold truncate max-w-[200px]">{{ file.name }}</span>
        </div>
      </div>
      <div class="mb-4 bg-blue-50 rounded-lg p-3">
        <div class="font-semibold mb-2 text-blue-700">Dữ liệu mẫu:</div>
        <table class="w-full text-sm border">
          <thead>
            <tr class="text-blue-800">
              <th class="px-2 py-1 border">Mã học phần</th>
              <th class="px-2 py-1 border">Tên học phần</th>
              <th class="px-2 py-1 border">Số tín chỉ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-2 py-1 border">INT101</td>
              <td class="px-2 py-1 border">Nhập môn CNTT</td>
              <td class="px-2 py-1 border">3</td>
            </tr>
            <tr>
              <td class="px-2 py-1 border">MAT201</td>
              <td class="px-2 py-1 border">Toán rời rạc</td>
              <td class="px-2 py-1 border">2</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="preview.length > 1" class="mb-4 bg-green-50 rounded-lg p-3 max-h-40 overflow-y-auto">
        <div class="font-semibold mb-2 text-green-700">Xem trước dữ liệu bạn sẽ nhập:</div>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-green-800">
              <th class="px-2 py-1">Mã học phần</th>
              <th class="px-2 py-1">Tên học phần</th>
              <th class="px-2 py-1">Số tín chỉ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in preview.slice(1)" :key="i">
              <td class="px-2 py-1" :class="errors[i] && errors[i][0] ? 'bg-red-200/80 text-red-700 font-semibold' : ''" :title="errors[i] && errors[i][0] ? errors[i][0] : ''">{{ row[0] }}</td>
              <td class="px-2 py-1" :class="errors[i] && errors[i][1] ? 'bg-red-200/80 text-red-700 font-semibold' : ''" :title="errors[i] && errors[i][1] ? errors[i][1] : ''">{{ row[1] }}</td>
              <td class="px-2 py-1" :class="errors[i] && errors[i][2] ? 'bg-red-200/80 text-red-700 font-semibold' : ''" :title="errors[i] && errors[i][2] ? errors[i][2] : ''">{{ row[2] }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex items-center mt-2">
          <input type="checkbox" id="confirm" v-model="confirmed" class="mr-2" :disabled="errors.some(e => e)" />
          <label for="confirm" class="text-sm text-gray-700">Tôi xác nhận dữ liệu xem trước là đúng và muốn nhập vào hệ thống</label>
        </div>
        <div v-if="errors.some(e => e)" class="text-red-600 text-sm flex items-center gap-1 mt-1"><span class="material-icons text-base">error</span>Có lỗi trong dữ liệu, vui lòng kiểm tra lại!</div>
        <div v-else-if="confirmed" class="text-green-700 text-sm flex items-center gap-1 mt-1"><span class="material-icons text-base">check_circle</span>Dữ liệu đã được xác nhận!</div>
      </div>
      <div v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 text-sm mb-2">{{ success }}</div>
      <div class="flex justify-end gap-2 mt-4">
        <button type="submit" class="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 shadow transition-all" :disabled="loading || !file || (preview.length > 1 && (!confirmed || errors.some(e => e)))">
          <span class="material-icons">upload</span> Nhập dữ liệu
        </button>
        <button type="button" class="px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold flex items-center gap-1 shadow transition-all" @click="$emit('close')" :disabled="loading">
          <span class="material-icons">close</span> Hủy
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import * as XLSX from 'xlsx';
import api from '../services/api';

const props = defineProps({ show: Boolean });
const emit = defineEmits(['close', 'imported', 'toast']);
const file = ref(null);
const preview = ref([]);
const loading = ref(false);
const errors = ref([]);
const confirmed = ref(false);
const error = ref('');
const success = ref('');

function validateRow(row) {
  const rowErrors = {};
  if (!row[0] || typeof row[0] !== 'string') rowErrors[0] = 'Thiếu mã học phần';
  if (!row[1] || typeof row[1] !== 'string') rowErrors[1] = 'Thiếu tên học phần';
  if (row[2] === undefined || isNaN(Number(row[2]))) rowErrors[2] = 'Số tín chỉ không hợp lệ';
  return Object.keys(rowErrors).length ? rowErrors : null;
}

function handleFileChange(e) {
  error.value = '';
  success.value = '';
  confirmed.value = false;
  const f = e.target.files[0];
  if (!f) return;
  file.value = f;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    preview.value = rows;
    errors.value = rows.slice(1).map(validateRow);
    confirmed.value = false;
  };
  reader.readAsArrayBuffer(f);
}

async function submitImport() {
  error.value = '';
  success.value = '';
  if (!file.value) return;
  if (preview.value.length > 1 && (!confirmed.value || errors.value.some(e => e))) {
    error.value = 'Bạn cần xác nhận dữ liệu trước khi nhập.';
    return;
  }
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', file.value);
    await api.post('/courses/import-excel', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    success.value = 'Nhập dữ liệu thành công!';
    emit('toast', { message: 'Import thành công!', type: 'success' });
    emit('imported');
    setTimeout(() => emit('close'), 1200);
  } catch (e) {
    error.value = e.response?.data?.message || 'Import thất bại!';
    emit('toast', { message: 'Import thất bại!', type: 'error' });
  } finally {
    loading.value = false;
  }
}

watch(() => props.show, (val) => {
  if (!val) {
    file.value = null;
    preview.value = [];
    loading.value = false;
    confirmed.value = false;
    error.value = '';
    success.value = '';
    errors.value = [];
  }
});
</script>

<style scoped>
.material-icons { font-family: 'Material Icons'; font-style: normal; font-weight: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; direction: ltr; font-feature-settings: 'liga'; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
</style>
