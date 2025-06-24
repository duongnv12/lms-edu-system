<template>
  <DepartmentFormModal
    :show="show"
    mode="edit"
    :department="department"
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
const props = defineProps({ show: Boolean, department: Object });
const emit = defineEmits(['close', 'updated']);
const error = ref('');
const loading = ref(false);

watch(() => props.show, (val) => { if (val) error.value = ''; });

const handleSubmit = async (data) => {
  error.value = '';
  if (!props.department) return;
  loading.value = true;
  try {
    const id = props.department.department_id || props.department.id;
    await apiClient.put(`/departments/${id}`, data);
    emit('updated');
    emit('close');
  } catch (err) {
    error.value = err.response?.data?.message || 'Có lỗi xảy ra.';
  } finally {
    loading.value = false;
  }
};
</script>
