<template>
  <BaseModal :show="show" @close="$emit('close')" title="Chỉnh sửa học phần" customClass="max-w-xl rounded-2xl shadow-2xl overflow-y-auto">
    <CourseFormModal :show="show" :course="course" @saved="onSaved" @close="$emit('close')" />
  </BaseModal>
</template>

<script setup>
import BaseModal from './BaseModal.vue';
import CourseFormModal from './CourseFormModal.vue';
const props = defineProps({
  show: Boolean,
  course: Object
});
const emit = defineEmits(['close', 'saved']);
function onSaved() {
  emit('saved');
}
</script>
