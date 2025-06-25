<template>
  <BaseModal :show="show" @close="$emit('close')" :maxWidth="'max-w-md'">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="material-icons text-2xl">content_copy</span>
        <div>
          <h2 class="text-lg font-bold">Sao chép chương trình đào tạo</h2>
          <p class="text-green-100 text-sm opacity-90">Tạo phiên bản mới từ chương trình hiện tại</p>
        </div>
      </div>
    </template>

    <div class="p-6">
      <!-- Current Curriculum Info -->
      <div class="mb-6 bg-green-50 p-4 rounded-lg border border-green-200">
        <div class="flex items-center gap-2 mb-2">
          <span class="material-icons text-sm text-green-600">school</span>
          <span class="text-sm font-medium text-green-800">Chương trình gốc</span>
        </div>
        <p class="text-sm text-green-700">
          <strong>{{ curriculum?.curriculum_name }}</strong>
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleClone">
        <div class="space-y-5">
          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span class="material-icons text-sm">code</span>
              Mã chương trình mới <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.new_curriculum_code"
              type="text"
              required
              placeholder="CNTT2025"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span class="material-icons text-sm">tag</span>
              Phiên bản mới <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.new_version"
              type="text"
              required
              placeholder="K2025"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          <div>
            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <span class="material-icons text-sm">calendar_today</span>
              Năm học áp dụng <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.new_academic_year"
              type="number"
              required
              min="2020"
              max="2030"
              :placeholder="new Date().getFullYear() + 1"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
            />
          </div>

          <!-- Note -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <span class="material-icons text-blue-500 text-lg">info</span>
              <div class="text-sm text-blue-700">
                <p class="font-medium mb-1">Lưu ý quan trọng</p>
                <p>Tất cả môn học, yêu cầu tốt nghiệp và cấu trúc chương trình sẽ được sao chép từ chương trình gốc. Bạn có thể chỉnh sửa sau khi tạo.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span class="material-icons text-sm" v-if="loading">hourglass_empty</span>
            <span class="material-icons text-sm" v-else>content_copy</span>
            <span v-if="loading">Đang sao chép...</span>
            <span v-else>Sao chép</span>
          </button>
        </div>
      </form>
    </div>
  </BaseModal>
</template>

<script>
import { reactive, ref } from 'vue'
import api from '../services/api'
import BaseModal from './BaseModal.vue'

export default {
  name: 'CurriculumCloneModal',
  components: {
    BaseModal
  },
  props: {
    show: Boolean,
    curriculum: Object
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const submitting = ref(false)
    
    const form = reactive({
      new_curriculum_code: '',
      new_version: '',
      new_academic_year: new Date().getFullYear() + 1
    })

    const handleClone = async () => {
      if (!props.curriculum) return

      try {
        submitting.value = true
        
        const response = await api.post(`/curriculums/${props.curriculum.curriculum_id}/clone`, form)
        
        emit('success', 'Chương trình đào tạo đã được sao chép thành công')
      } catch (error) {
        console.error('Error cloning curriculum:', error)
        
        let errorMessage = 'Có lỗi xảy ra khi sao chép chương trình'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }
        
        // You could emit an error event or show a toast here
        // For now, we'll just log it
        alert(errorMessage)
      } finally {
        submitting.value = false
      }
    }

    return {
      submitting,
      form,
      handleClone
    }
  }
}
</script>
