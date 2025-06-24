<template>
  <BaseModal :show="show" @close="$emit('close')" title="Nhập danh sách khoa từ Excel" customClass="max-w-lg">
    <form @submit.prevent="handleImport" class="p-4">
      <div class="mb-4">
        <label class="block font-semibold mb-2 text-blue-700">Chọn file Excel (.xlsx)</label>
        <div class="flex items-center gap-3 flex-wrap">
          <label class="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg shadow cursor-pointer transition-all border border-blue-300">
            <span class="material-icons mr-2">upload_file</span>
            <span>Chọn file</span>
            <input type="file" accept=".xlsx,.xls" @change="onFileChange" class="hidden" />
          </label>
          <a href="/department_import_template.xlsx" download class="flex items-center gap-1 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg shadow border border-green-300 transition-all text-sm font-semibold">
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
              <th class="px-2 py-1 border">Mã khoa</th>
              <th class="px-2 py-1 border">Tên khoa</th>
              <th class="px-2 py-1 border">Mô tả</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-2 py-1 border">CNTT</td>
              <td class="px-2 py-1 border">Khoa Công nghệ Thông tin</td>
              <td class="px-2 py-1 border">Khoa chuyên về CNTT</td>
            </tr>
            <tr>
              <td class="px-2 py-1 border">QTKD</td>
              <td class="px-2 py-1 border">Khoa Quản trị Kinh doanh</td>
              <td class="px-2 py-1 border">Khoa về kinh doanh, quản trị</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="preview.length" class="mb-4 bg-green-50 rounded-lg p-3 max-h-40 overflow-y-auto">
        <div class="font-semibold mb-2 text-green-700">Xem trước dữ liệu bạn sẽ nhập:</div>
        <table class="w-full text-sm">
          <thead>
            <tr class="text-green-800">
              <th class="px-2 py-1">Mã khoa</th>
              <th class="px-2 py-1">Tên khoa</th>
              <th class="px-2 py-1">Mô tả</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in preview" :key="i">
              <td class="px-2 py-1">{{ row.code }}</td>
              <td class="px-2 py-1">{{ row.dept_name }}</td>
              <td class="px-2 py-1">{{ row.description }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex items-center mt-2">
          <input type="checkbox" id="confirm" v-model="confirm" class="mr-2" />
          <label for="confirm" class="text-sm text-gray-700">Tôi xác nhận dữ liệu xem trước là đúng và muốn nhập vào hệ thống</label>
        </div>
      </div>
      <div v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 text-sm mb-2">{{ success }}</div>
      <div class="flex justify-end gap-2 mt-4">
        <button type="submit" class="px-5 py-2 rounded-lg bg-blue-500 hover:bg-blue-700 text-white font-semibold flex items-center gap-1 shadow transition-all" :disabled="loading || !file || (preview.length && !confirm)">
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
import { ref } from 'vue';
import * as XLSX from 'xlsx';
import apiClient from '@/services/api';
import BaseModal from './BaseModal.vue';
const props = defineProps({ show: Boolean });
const emit = defineEmits(['close', 'imported']);
const file = ref(null);
const preview = ref([]);
const error = ref('');
const success = ref('');
const loading = ref(false);
const confirm = ref(false);

function onFileChange(e) {
  error.value = '';
  preview.value = [];
  confirm.value = false;
  file.value = e.target.files[0];
  if (!file.value) return;
  const reader = new FileReader();
  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    preview.value = rows.slice(1).map(r => ({
      code: r[0] || '',
      dept_name: r[1] || '',
      description: r[2] || ''
    })).filter(r => r.code && r.dept_name);
  };
  reader.readAsArrayBuffer(file.value);
}

async function handleImport() {
  error.value = '';
  success.value = '';
  if (!file.value) return;
  if (preview.value.length && !confirm.value) {
    error.value = 'Bạn cần xác nhận dữ liệu trước khi nhập.';
    return;
  }
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', file.value);
    await apiClient.post('/departments/import-excel', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    success.value = 'Nhập dữ liệu thành công!';
    emit('imported');
    setTimeout(() => emit('close'), 1200);
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi khi nhập dữ liệu.';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.material-icons { font-family: 'Material Icons'; font-style: normal; font-weight: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; direction: ltr; font-feature-settings: 'liga'; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
</style>
