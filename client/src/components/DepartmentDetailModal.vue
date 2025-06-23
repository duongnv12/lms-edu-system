<template>
  <BaseModal :show="show" @close="$emit('close')">
    <template #header>Chi tiết khoa</template>
    <div v-if="department">
      <p><strong>Mã khoa:</strong> {{ department.id }}</p>
      <p><strong>Tên khoa:</strong> {{ department.name }}</p>
      <!-- Thêm các trường khác nếu cần -->
    </div>
    <div v-else>
      <p>Đang tải thông tin khoa...</p>
    </div>
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
const props = defineProps({ show: Boolean, department: Object });
</script>

<style scoped>
</style>
