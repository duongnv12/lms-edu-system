<template>
  <DepartmentFormModal
    :show="show"
    mode="add"
    :loading="loading"
    :error="error"
    @close="$emit('close')"
    @submit="handleSubmit"
  />
</template>

<script setup>
import DepartmentFormModal from './DepartmentFormModal.vue';
import apiClient from '@/services/api';
import { ref, watch } from 'vue';
const props = defineProps({ show: Boolean });
const emit = defineEmits(['close', 'added']);
const error = ref('');
const loading = ref(false);

watch(() => props.show, (val) => { if (val) { error.value = ''; } });

const handleSubmit = async (data) => {
  error.value = '';
  loading.value = true;
  try {
    await apiClient.post('/departments', data);
    emit('added');
    emit('close');
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra.';
  } finally {
    loading.value = false;
  }
};
</script>
