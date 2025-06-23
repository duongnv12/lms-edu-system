<template>
  <BaseModal :show="show" @close="$emit('close')" title="Import học phần từ Excel" customClass="max-w-xl rounded-2xl shadow-2xl overflow-y-auto">
    <div class="space-y-8 p-6 bg-white rounded-2xl">
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <label class="w-full flex flex-col cursor-pointer">
          <span class="text-base font-semibold text-blue-700 mb-2">Chọn file Excel</span>
          <input type="file" accept=".xlsx,.xls" @change="handleFileChange" class="block w-full text-base file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-base file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition" />
        </label>
        <a
          href="/course_import_template.xlsx"
          download
          class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow font-semibold transition min-w-[180px] justify-center"
          title="Tải file mẫu Excel để nhập học phần"
        >
          <span class="material-icons text-base">download</span>
          File mẫu
        </a>
      </div>
      <div v-if="preview.length" class="overflow-x-auto max-h-72 border rounded-xl bg-white shadow-inner">
        <table class="min-w-full text-base">
          <thead>
            <tr>
              <th v-for="(col, idx) in preview[0]" :key="'col'+idx" class="px-4 py-3 border-b bg-blue-100 text-blue-800 font-bold text-center">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, idx) in preview.slice(1)" :key="'row'+idx" :class="errors[idx] ? 'bg-red-50/70' : 'hover:bg-gray-50'">
              <td v-for="(cell, cidx) in row" :key="'cell'+cidx"
                  :class="['px-4 py-2 border-b text-center', errors[idx] && errors[idx][cidx] ? 'bg-red-200/80 text-red-700 font-semibold relative' : '']"
                  :title="errors[idx] && errors[idx][cidx] ? errors[idx][cidx] : ''">
                <span v-if="errors[idx] && errors[idx][cidx]">
                  <span class="material-icons text-xs align-middle mr-1">error_outline</span>
                  {{ cell }}
                  <span class="absolute left-1/2 -translate-x-1/2 mt-1 text-xs text-red-600" v-if="errors[idx][cidx]">{{ errors[idx][cidx] }}</span>
                </span>
                <span v-else>{{ cell }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="preview.length" class="flex items-center gap-2">
        <span v-if="errors.some(e => e)" class="text-red-600 text-sm flex items-center gap-1"><span class="material-icons text-base">error</span>Có lỗi trong dữ liệu, vui lòng kiểm tra lại!</span>
        <span v-else-if="confirmed" class="text-green-700 text-sm flex items-center gap-1"><span class="material-icons text-base">check_circle</span>Dữ liệu đã được xác nhận!</span>
      </div>
      <div class="flex justify-end gap-3 pt-2">
        <button @click="$emit('close')" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg shadow-sm font-semibold transition text-base">Hủy</button>
        <button v-if="preview.length && !confirmed" :disabled="errors.some(e => e)" @click="confirmPreview" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-semibold flex items-center gap-2 disabled:opacity-50 transition text-base">
          <span class="material-icons text-base">task_alt</span>
          Xác nhận dữ liệu
        </button>
        <button v-if="confirmed" :disabled="!file || loading || errors.some(e => e)" @click="submitImport" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow font-semibold flex items-center gap-2 disabled:opacity-50 transition text-base">
          <span v-if="loading" class="animate-spin material-icons mr-2">autorenew</span>
          <span v-else class="material-icons text-base">cloud_upload</span>
          Import
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import BaseModal from './BaseModal.vue';
import * as XLSX from 'xlsx';
import api from '../services/api';

const props = defineProps({
  show: Boolean
});
const emit = defineEmits(['close', 'imported', 'toast']);

const file = ref(null);
const preview = ref([]);
const loading = ref(false);
const errors = ref([]);
const confirmed = ref(false);

function validateRow(row, idx) {
  const rowErrors = {};
  if (!row[0] || typeof row[0] !== 'string') rowErrors[0] = 'Thiếu mã học phần';
  if (!row[1] || typeof row[1] !== 'string') rowErrors[1] = 'Thiếu tên học phần';
  if (row[2] === undefined || isNaN(Number(row[2]))) rowErrors[2] = 'Số tín chỉ không hợp lệ';
  // Có thể bổ sung validate cho các cột khác nếu cần
  return Object.keys(rowErrors).length ? rowErrors : null;
}

function handleFileChange(e) {
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
    // Validate từng dòng (bỏ header)
    errors.value = rows.slice(1).map(validateRow);
    confirmed.value = false;
  };
  reader.readAsArrayBuffer(f);
}

function confirmPreview() {
  confirmed.value = true;
}

async function submitImport() {
  if (!file.value || !confirmed.value || errors.value.some(e => e)) return;
  loading.value = true;
  try {
    const formData = new FormData();
    formData.append('file', file.value);
    await api.post('/courses/import-excel', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    emit('toast', { message: 'Import thành công!', type: 'success' });
    emit('imported');
    emit('close');
  } catch (e) {
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
  }
});
</script>
