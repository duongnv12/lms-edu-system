<template>
  <transition name="modal-fade">
    <div v-if="isVisible" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <div :class="['bg-white rounded-xl shadow-2xl w-full relative animate-fade-in border border-gray-200 my-8 max-h-[90vh] overflow-hidden flex flex-col', maxWidth || 'max-w-7xl']">
        <div v-if="title || $slots.header" class="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <slot name="header">
            <h2 class="text-xl font-bold">{{ title }}</h2>
          </slot>
          <button @click="$emit('close')" class="text-white hover:text-green-100 text-2xl font-bold focus:outline-none transition-colors">&times;</button>
        </div>
        <div class="flex-1 overflow-y-auto">
          <slot />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ 
  show: Boolean, 
  isOpen: Boolean, 
  title: String, 
  maxWidth: String 
});

const emit = defineEmits(['close']);

// Support both show and isOpen props for backward compatibility
const isVisible = computed(() => props.show || props.isOpen);
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.2s ease; }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>
