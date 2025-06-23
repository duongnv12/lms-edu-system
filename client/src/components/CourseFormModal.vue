<template>
  <BaseModal :show="show" @close="$emit('close')" :title="course ? 'Cập nhật học phần' : 'Thêm học phần mới'" customClass="max-w-xl">
    <form @submit.prevent="onSubmit" class="bg-white p-6 rounded shadow-md max-w-xl mx-auto mt-2">
      <div class="mb-3 flex flex-row gap-4">
        <div class="w-1/2">
          <label class="block font-semibold mb-1">Mã học phần</label>
          <input v-model="form.course_code" :disabled="!!course" class="input" required />
          <div v-if="errors.course_code" class="text-red-500 text-sm">{{ errors.course_code }}</div>
        </div>
        <div class="w-1/2">
          <label class="block font-semibold mb-1">Tên học phần</label>
          <input v-model="form.course_name" class="input" required />
          <div v-if="errors.course_name" class="text-red-500 text-sm">{{ errors.course_name }}</div>
        </div>
      </div>
      <div class="mb-3 flex flex-row gap-4">
        <div class="w-1/2">
          <label class="block font-semibold mb-1">Số tín chỉ</label>
          <input v-model.number="form.credits" type="number" min="1" class="input" required />
          <div v-if="errors.credits" class="text-red-500 text-sm">{{ errors.credits }}</div>
        </div>
        <div class="w-1/2">
          <label class="block font-semibold mb-1">Loại học phần</label>
          <input v-model="form.course_type" class="input" />
        </div>
      </div>
      <div class="mb-3 flex flex-row gap-4">
        <div class="w-1/2">
          <label class="block font-semibold mb-1">Học kỳ áp dụng</label>
          <input v-model="form.semester_applicable" class="input" />
        </div>
        <div class="w-1/2">
          <label class="block font-semibold mb-1">Khoa</label>
          <select v-model.number="form.department_id" class="input" required>
            <option v-for="dept in departments" :key="dept.department_id" :value="dept.department_id">{{ dept.dept_name }}</option>
          </select>
          <div v-if="errors.department_id" class="text-red-500 text-sm">{{ errors.department_id }}</div>
        </div>
      </div>
      <div class="mb-3 flex flex-row gap-4">
        <div class="w-1/2">
          <label class="block font-semibold mb-1">Tiên quyết</label>
          <select v-model="form.prerequisite_ids" class="input custom-scroll-select" multiple>
            <option v-for="c in courses" :key="c.course_id" :value="c.course_id">{{ c.course_name }}</option>
          </select>
        </div>
        <div class="w-1/2">
          <label class="block font-semibold mb-1">Học phần học trước</label>
          <select v-model="form.prior_ids" class="input custom-scroll-select" multiple>
            <option v-for="c in courses" :key="c.course_id" :value="c.course_id">{{ c.course_name }}</option>
          </select>
        </div>
      </div>
      <div class="mb-3">
        <label class="block font-semibold mb-1">Mô tả</label>
        <textarea v-model="form.description" class="input"></textarea>
      </div>
      <div class="flex space-x-2 mt-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Lưu</button>
        <button type="button" @click="$emit('close')" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded">Hủy</button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import BaseModal from './BaseModal.vue';
import api from '../services/api';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  show: Boolean,
  course: Object
});
const emit = defineEmits(['saved', 'close']);

const form = ref({
  course_code: '',
  course_name: '',
  credits: 3,
  course_type: '',
  semester_applicable: '',
  department_id: '',
  prerequisite_ids: [],
  prior_ids: [],
  description: ''
});

const departments = ref([]);
const courses = ref([]);
const errors = ref({});
const authStore = useAuthStore();

const fetchDepartments = async () => {
  const res = await api.get('/departments');
  departments.value = res.data;
};
const fetchCourses = async () => {
  const res = await api.get('/courses');
  courses.value = res.data;
};

onMounted(() => {
  fetchDepartments();
  fetchCourses();
  if (props.course) {
    form.value = {
      ...props.course,
      prerequisite_ids: (props.course.prerequisites || []).map(p => p.prerequisite?.course_id),
      prior_ids: (props.course.priors || []).map(p => p.prior?.course_id),
    };
  }
});

watch(() => props.course, (val) => {
  if (val) {
    form.value = {
      ...val,
      prerequisite_ids: (val.prerequisites || []).map(p => p.prerequisite?.course_id),
      prior_ids: (val.priors || []).map(p => p.prior?.course_id),
    };
  }
});

const validate = () => {
  errors.value = {};
  if (!form.value.course_code) errors.value.course_code = 'Mã học phần là bắt buộc';
  if (!form.value.course_name) errors.value.course_name = 'Tên học phần là bắt buộc';
  if (!form.value.credits || form.value.credits < 1) errors.value.credits = 'Số tín chỉ phải lớn hơn 0';
  if (!form.value.department_id) errors.value.department_id = 'Khoa là bắt buộc';
  return Object.keys(errors.value).length === 0;
};

const onSubmit = async () => {
  if (!validate()) return;
  try {
    const payload = {
      ...form.value,
      prerequisite_ids: form.value.prerequisite_ids,
      prior_ids: form.value.prior_ids,
    };
    if (props.course) {
      await api.put(`/courses/${props.course.course_id}`, payload);
      alert('Cập nhật thành công!');
    } else {
      await api.post('/courses', payload);
      alert('Thêm mới thành công!');
    }
    emit('saved');
  } catch (e) {
    alert('Có lỗi xảy ra!');
  }
};
</script>

<style scoped>
.input {
  @apply w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200;
}
.custom-scroll-select {
  height: 8rem;
  overflow-y: auto;
  /* For Firefox */
  scrollbar-width: thin;
  scrollbar-color: #a0aec0 #edf2f7;
}
.custom-scroll-select::-webkit-scrollbar {
  width: 8px;
}
.custom-scroll-select::-webkit-scrollbar-thumb {
  background: #a0aec0;
  border-radius: 4px;
}
.custom-scroll-select::-webkit-scrollbar-track {
  background: #edf2f7;
  border-radius: 4px;
}
</style>
