<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>Sửa thông tin khoa</template>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block mb-1">Tên khoa</label>
        <input v-model="name" class="input input-bordered w-full" required />
      </div>
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">Lưu</button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import { ref, watch } from 'vue';
const props = defineProps({ show: Boolean, department: Object });
const emit = defineEmits(['close', 'updated']);
const name = ref('');

watch(() => props.department, (val) => {
  name.value = val?.name || '';
}, { immediate: true });

const handleSubmit = () => {
  // Gọi API cập nhật khoa
  // await api.put(`/departments/${props.department.id}`, { name: name.value });
  emit('updated');
  emit('close');
};
</script>

<style scoped>
</style>
