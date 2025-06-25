<template>
  <BaseModal :show="show" @close="$emit('close')" :maxWidth="'max-w-md'">
    <template #header>
      <div class="flex items-center gap-3">
        <span class="material-icons text-2xl text-red-500">warning</span>
        <div>
          <h2 class="text-lg font-bold">Xóa chương trình đào tạo</h2>
          <p class="text-red-100 text-sm opacity-90">Hành động này không thể hoàn tác</p>
        </div>
      </div>
    </template>

    <div class="p-6">
      <!-- Warning Message -->
      <div class="mb-6">
        <p class="text-gray-600 mb-4">
          Bạn có chắc chắn muốn xóa chương trình đào tạo này không? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
        </p>
      </div>
      
      <!-- Curriculum Info -->
      <div class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <div class="flex items-start gap-3">
          <span class="material-icons text-red-600 text-lg">school</span>
          <div class="flex-1">
            <h4 class="font-medium text-red-800 mb-2">Thông tin chương trình</h4>
            <div class="space-y-2 text-sm text-red-700">
              <div class="flex justify-between">
                <span class="font-medium">Tên chương trình:</span>
                <span>{{ curriculum?.curriculum_name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Mã chương trình:</span>
                <span>{{ curriculum?.curriculum_code }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Phiên bản:</span>
                <span>{{ curriculum?.version }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Sinh viên đang theo học:</span>
                <span class="font-semibold">{{ curriculum?._count?.students || 0 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Warning if has students -->
      <div v-if="curriculum?._count?.students > 0" class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <span class="material-icons text-yellow-600 text-lg">warning</span>
          <div class="text-sm text-yellow-800">
            <p class="font-medium mb-1">Cảnh báo quan trọng!</p>
            <p>Chương trình này hiện có {{ curriculum._count.students }} sinh viên đang theo học. Bạn không thể xóa chương trình này.</p>
          </div>
        </div>
      </div>

      <!-- Additional warnings when no students -->
      <div v-else class="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <span class="material-icons text-yellow-600 text-lg">info</span>
          <div class="text-sm text-yellow-800">
            <p class="font-medium mb-2">Lưu ý quan trọng</p>
            <ul class="space-y-1 text-sm">
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 bg-yellow-600 rounded-full"></span>
                Tất cả thông tin về môn học trong chương trình sẽ bị xóa
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 bg-yellow-600 rounded-full"></span>
                Các yêu cầu tốt nghiệp sẽ bị xóa
              </li>
              <li class="flex items-center gap-2">
                <span class="w-1 h-1 bg-yellow-600 rounded-full"></span>
                Dữ liệu không thể khôi phục sau khi xóa
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Confirmation input -->
      <div v-if="!curriculum?._count?.students" class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Nhập "<strong>{{ curriculum?.curriculum_code }}</strong>" để xác nhận xóa:
        </label>
        <input
          v-model="confirmationText"
          type="text"
          :placeholder="curriculum?.curriculum_code"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          Hủy
        </button>
        <button
          v-if="!curriculum?._count?.students"
          type="button"
          @click="handleDelete"
          :disabled="!canDelete || deleting"
          class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <span class="material-icons text-sm" v-if="deleting">hourglass_empty</span>
          <span class="material-icons text-sm" v-else>delete</span>
          <span v-if="deleting">Đang xóa...</span>
          <span v-else>Xóa chương trình</span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script>
import { ref, computed, watch } from 'vue'
import api from '../services/api'
import BaseModal from './BaseModal.vue'

export default {
  name: 'CurriculumDeleteModal',
  components: {
    BaseModal
  },
  props: {
    show: Boolean,
    curriculum: Object
  },
  emits: ['close', 'success'],
  setup(props, { emit }) {
    const deleting = ref(false)
    const confirmationText = ref('')

    const canDelete = computed(() => {
      return confirmationText.value === props.curriculum?.curriculum_code
    })

    const handleDelete = async () => {
      if (!props.curriculum || !canDelete.value) return

      try {
        deleting.value = true
        
        await api.delete(`/curriculums/${props.curriculum.curriculum_id}`)
        
        emit('success', 'Chương trình đào tạo đã được xóa thành công')
      } catch (error) {
        console.error('Error deleting curriculum:', error)
        
        let errorMessage = 'Có lỗi xảy ra khi xóa chương trình'
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }
        
        // You could emit an error event or show a toast here
        alert(errorMessage)
      } finally {
        deleting.value = false
      }
    }

    // Reset confirmation text when modal opens/closes
    const resetForm = () => {
      confirmationText.value = ''
    }

    // Watch for modal state changes
    watch(() => props.isOpen, (isOpen) => {
      if (!isOpen) {
        resetForm()
      }
    })

    return {
      deleting,
      confirmationText,
      canDelete,
      handleDelete
    }
  }
}
</script>
