<template>
  <BaseModal :show="show" @close="$emit('close')" title="Thêm học phần mới" customClass="max-w-lg">
    <CourseFormModal :show="show" :course="course" @saved="onSaved" @close="$emit('close')" />
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import CourseFormModal from './CourseFormModal.vue';
const props = defineProps({
  show: Boolean,
  course: { type: Object, default: null }
});
const emit = defineEmits(['close', 'saved']);
function onSaved() {
  emit('saved');
}
</script>
