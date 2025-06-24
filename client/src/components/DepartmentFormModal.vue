<template>
  <BaseModal :show="show" @close="$emit('close')" :title="mode === 'add' ? 'Thêm khoa mới' : 'Cập nhật thông tin khoa'" customClass="max-w-xl rounded-2xl shadow-2xl overflow-y-auto">
    <form @submit.prevent="onSubmit" class="bg-white p-8 rounded-2xl shadow-xl overflow-y-auto" style="max-height:80vh;">
      <div class="mb-4 flex flex-row gap-6">
        <div class="w-1/2">
          <label :class="labelClass">Mã khoa</label>
          <input v-model="localCode" class="input" required maxlength="20" placeholder="VD: CNTT, QTKD..." />
        </div>
        <div class="w-1/2">
          <label :class="labelClass">Tên khoa</label>
          <input v-model="localName" class="input" required />
        </div>
      </div>
      <div class="mb-4">
        <label :class="labelClass">Mô tả</label>
        <textarea v-model="localDesc" class="input" rows="2" placeholder="Mô tả về khoa..."></textarea>
      </div>
      <div v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</div>
      <div class="flex space-x-3 mt-6 justify-end">
        <button type="submit" :class="submitClass" :disabled="loading">
          <span class="material-icons text-base">{{ mode === 'add' ? 'add' : 'save' }}</span>{{ mode === 'add' ? 'Thêm' : 'Lưu' }}
        </button>
        <button type="button" @click="$emit('close')" class="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg shadow font-semibold transition-all" :disabled="loading">
          <span class="material-icons text-base">close</span>Hủy
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import BaseModal from './BaseModal.vue';
const props = defineProps({
  show: Boolean,
  mode: { type: String, default: 'add' }, // 'add' | 'edit'
  department: Object,
  loading: Boolean,
  error: String
});
const emit = defineEmits(['close', 'submit']);
const localCode = ref('');
const localName = ref('');
const localDesc = ref('');

watch(() => props.show, (val) => {
  if (val) {
    localCode.value = props.department?.code || '';
    localName.value = props.department?.dept_name || props.department?.name || '';
    localDesc.value = props.department?.description || '';
  }
});

const onSubmit = () => {
  emit('submit', {
    code: localCode.value.trim().toUpperCase(),
    dept_name: localName.value,
    description: localDesc.value
  });
};

const labelClass = computed(() =>
  'block font-semibold mb-2 text-blue-700'
);
const submitClass = computed(() =>
  'flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow font-semibold transition-all'
);
</script>

<style scoped>
.input {
  @apply w-full border border-blue-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 transition-all;
}
</style>
