<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>Xóa khoa</template>
    <p>Bạn có chắc chắn muốn xóa khoa <strong>{{ department?.name }}</strong>?</p>
    <div class="flex justify-end mt-4">
      <button class="btn btn-error mr-2" @click="handleDelete">Xóa</button>
      <button class="btn" @click="$emit('close')">Hủy</button>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
const props = defineProps({ show: Boolean, department: Object });
const emit = defineEmits(['close', 'deleted']);

const handleDelete = () => {
  // Gọi API xóa khoa
  // await api.delete(`/departments/${props.department.id}`);
  emit('deleted');
  emit('close');
};
</script>

<style scoped>
</style>
