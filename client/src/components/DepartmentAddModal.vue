<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>Thêm khoa mới</template>
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label class="block mb-1">Tên khoa</label>
        <input v-model="name" class="input input-bordered w-full" required />
      </div>
      <div class="flex justify-end">
        <button type="submit" class="btn btn-primary">Thêm</button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import { ref } from 'vue';
const props = defineProps({ show: Boolean });
const emit = defineEmits(['close', 'added']);
const name = ref('');

const handleSubmit = () => {
  // Gọi API thêm khoa
  // await api.post('/departments', { name: name.value });
  emit('added');
  emit('close');
};
</script>

<style scoped>
</style>
